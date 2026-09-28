#!/usr/bin/env node
// myclawn-computer-mcp: a stdio bridge to the hosted MyClawn Computer MCP
// server (https://www.myclawn.com/mcp/desktop).
//
// Most clients should connect to the hosted server directly and sign in
// with OAuth (see README). This bridge is for clients that only speak stdio,
// or that cannot do OAuth: it forwards every request to the hosted server
// with a MyClawn connector token (MYCLAWN_TOKEN, "mcc_...").
//
// Without a token it still answers tools/list from tools.json, a copy of
// the hosted server's tool list, so a client can show what is available;
// calling a tool then explains how to get a token.
import { readFileSync } from 'node:fs'
import { Server } from '@modelcontextprotocol/sdk/server/index.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js'
import { ListToolsRequestSchema, CallToolRequestSchema } from '@modelcontextprotocol/sdk/types.js'

const VERSION = '1.0.0'
const SERVER_URL = process.env.MYCLAWN_URL || 'https://www.myclawn.com/mcp/desktop'
const TOKEN = (process.env.MYCLAWN_TOKEN || '').trim()
const TOOLS = JSON.parse(readFileSync(new URL('./tools.json', import.meta.url), 'utf8'))
// A task can run for several minutes on the computer.
const CALL_TIMEOUT_MS = 300_000

const NO_TOKEN = [
  'MyClawn needs a connector token for this client.',
  'Create one at https://www.myclawn.com (Connected apps > Create a new token) and set it as MYCLAWN_TOKEN.',
  'Clients that support OAuth (Claude, ChatGPT, Cursor, VS Code, Claude Code) can instead connect to https://www.myclawn.com/mcp/desktop directly and sign in.',
].join(' ')

let remote = null
async function upstream() {
  if (remote) return remote
  const client = new Client({ name: 'myclawn-computer-bridge', version: VERSION })
  await client.connect(new StreamableHTTPClientTransport(new URL(SERVER_URL), {
    requestInit: { headers: { authorization: `Bearer ${TOKEN}` } },
  }))
  remote = client
  return client
}

const server = new Server(
  { name: 'myclawn-computer', version: VERSION },
  {
    capabilities: { tools: {} },
    instructions: "These tools reach the user's own MyClawn computer: a persistent cloud machine with a browser that stays logged in, files, and its own email address. Hand it work that needs a login, an inbox, many web steps or more time than this chat. Send only what a task needs. Save notes only when the user asks.",
  },
)

server.setRequestHandler(ListToolsRequestSchema, async () => {
  if (!TOKEN) return { tools: TOOLS }
  try {
    return await (await upstream()).listTools()
  } catch {
    remote = null
    return { tools: TOOLS }
  }
})

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (!TOKEN) return { content: [{ type: 'text', text: NO_TOKEN }], isError: true }
  try {
    return await (await upstream()).callTool(request.params, undefined, { timeout: CALL_TIMEOUT_MS })
  } catch (err) {
    remote = null
    const unauthorized = /401|unauthori[sz]ed|invalid_token/i.test(String(err?.message))
    return {
      content: [{
        type: 'text',
        text: unauthorized
          ? 'MyClawn did not accept MYCLAWN_TOKEN (revoked or mistyped). Create a new one under Connected apps at https://www.myclawn.com.'
          : `Could not reach MyClawn: ${err?.message || err}`,
      }],
      isError: true,
    }
  }
})

await server.connect(new StdioServerTransport())
