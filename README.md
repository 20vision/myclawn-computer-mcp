# MyClawn Computer MCP

Give your AI assistant its own computer. MyClawn runs an AI agent on a real cloud desktop that
belongs to you: a browser that stays signed in to your accounts, its own email address, its own
files, and it keeps working after you close the chat. This MCP server lets Claude, ChatGPT,
Cursor, VS Code and any other MCP client hand it tasks.

**Server URL:** `https://www.myclawn.com/mcp/desktop` (Streamable HTTP, OAuth sign-in)

[Add to Cursor](https://cursor.com/en/install-mcp?name=myclawn&config=eyJ1cmwiOiJodHRwczovL3d3dy5teWNsYXduLmNvbS9tY3AvZGVza3RvcCJ9) ·
[Add to VS Code](https://insiders.vscode.dev/redirect/mcp/install?name=myclawn&config=%7B%22type%22%3A%22http%22%2C%22url%22%3A%22https%3A%2F%2Fwww.myclawn.com%2Fmcp%2Fdesktop%22%7D) ·
[Docs](https://www.myclawn.com/docs/connectors) ·
[myclawn.com](https://www.myclawn.com)

## What your assistant can do with it

- Work inside websites that need your login. The browser keeps its sessions between tasks, so
  you sign in once and the agent can use the site from then on.
- Send and read email from the computer's own address.
- Fill in forms and portals, download files, and edit documents and spreadsheets.
- Run long jobs that outlast a chat reply, then report back.
- Remember notes you ask it to keep, for every assistant connected to the same computer.

Every task comes back with the agent's answer, a screenshot of the final screen and a link to a
screen recording of the whole task. Recordings are private to you until you share one.

New accounts get a free 24-hour computer on their first task, no card needed. After that the
computer runs on a [MyClawn plan](https://www.myclawn.com/docs/pricing).

## Connect

Every client below signs in with your MyClawn account through OAuth. You create the account on
the way in if you do not have one yet.

**Claude** (claude.ai, Claude Desktop, mobile): Settings, then Connectors, then Add custom
connector. Paste `https://www.myclawn.com/mcp/desktop` and press Connect.

**ChatGPT**: turn on developer mode under Settings, then Security and login. Then open Plugins,
press + and choose Create app, with the server URL above and OAuth as the authentication.

**Claude Code**:

```sh
claude mcp add --transport http myclawn https://www.myclawn.com/mcp/desktop
```

Then type `/mcp` in Claude Code and choose myclawn to sign in. Or install it as a plugin:

```sh
/plugin marketplace add 20vision/myclawn-computer-mcp
/plugin install myclawn-computer@myclawn
```

**Cursor** and **VS Code**: use the Add buttons above, then press Connect (Cursor) or start the
server (VS Code) and sign in.

**Windsurf**: add this under `mcpServers` in `mcp_config.json`:

```json
"myclawn": { "serverUrl": "https://www.myclawn.com/mcp/desktop" }
```

### Clients without OAuth: the stdio bridge

For a client that only speaks stdio, or cannot sign in with OAuth, this repository has a small
bridge. Create a connector token in the MyClawn dashboard (Connected apps, then Create a new
token) and run:

```json
{
  "mcpServers": {
    "myclawn": {
      "command": "npx",
      "args": ["-y", "github:20vision/myclawn-computer-mcp"],
      "env": { "MYCLAWN_TOKEN": "mcc_..." }
    }
  }
}
```

The bridge forwards every request to the hosted server with that token. Without a token it still
lists the tools, and a tool call explains how to get one. A Dockerfile is included:
`docker build -t myclawn-computer-mcp . && docker run -i -e MYCLAWN_TOKEN=mcc_... myclawn-computer-mcp`.

## Tools

- `myclawn_desktop_run`: hand the computer a task and get its answer, a screenshot and a replay
  link. Big jobs can take several minutes.
- `myclawn_desktop_activity`: the steps the computer is taking right now.
- `myclawn_desktop_tasks`: the tasks it has run and how each one ended.
- `myclawn_desktop_sent_mail`: every email it sent from its own address.
- `myclawn_desktop_interrupt`: stop the current task.
- `myclawn_desktop_send_file`: put a text file on its desktop.
- `myclawn_notes_remember` and `myclawn_notes_recall`: save and look up notes, only when you ask.
- `myclawn_desktop_status`: your plan, whether the computer is ready, and its email address.

## Privacy

The assistant sends MyClawn only the task text it writes, files it hands over, and notes you ask
it to keep. MyClawn never reads your ChatGPT or Claude chat history or their memory. Sign-in
tokens are stored as hashes, and you can disconnect any app at once under Connected apps. Full
policy: [myclawn.com/privacy](https://www.myclawn.com/privacy).

## Support

Email support@myclawn.com. MyClawn is made by 20Vision GmbH, Vienna.

This repository holds the public connection files and the bridge. The MyClawn service itself is
hosted and is not open source.
