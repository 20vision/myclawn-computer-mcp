---
name: myclawn-computer
description: Hand work to the user's MyClawn computer, a cloud desktop with a signed-in browser, its own email address and files. Use when a task needs a website login, sending or reading email, filling in a web form or portal, downloading files, many steps in a real browser, or more time than one reply, and the myclawn tools are connected.
---

# Working with the MyClawn computer

The user's MyClawn computer is a real Linux desktop in the cloud with an agent on it. It keeps its
browser sessions between tasks, has its own email address, and keeps working when this
conversation ends. The user can watch its screen live in the MyClawn dashboard.

## When to use it

Use `myclawn_desktop_run` for work you cannot do from here:

- a site or portal that needs the user's login (the browser stays signed in once the user has
  signed in on the computer),
- sending, reading or answering email from the computer's own address,
- filling in forms, booking, downloading reports or files,
- research that needs many pages in a real browser,
- anything that should keep going after the user leaves.

Do not use it for questions you can answer yourself, or for code in the current project.

## Writing the task

Brief it like a contractor who cannot see this conversation:

1. The goal in one sentence.
2. The details it needs: names, URLs, dates, amounts, the exact text to send.
3. What to report back, and in what form.
4. Anything it must not do, such as "do not submit the form, stop on the last page".

Send only what the task needs. Never paste passwords into a task; if a site needs a login the
computer does not have yet, tell the user to sign in once on the computer's screen in the
MyClawn dashboard.

For long input (a contact list, a draft), put it on the computer first with
`myclawn_desktop_send_file` and refer to the file by name in the task.

## After you send it

- A task returns the agent's answer, a screenshot and a replay link. Give the user the replay
  link: it shows exactly what their computer did, and they can share it.
- If the reply says the task is still running, check `myclawn_desktop_activity` after a few
  minutes, or `myclawn_desktop_tasks` for the result. Do not send the same task again.
- If the reply says the computer is starting or needs a plan, relay that to the user plainly.
- To confirm an email really went out, use `myclawn_desktop_sent_mail`.
- If the user asks to stop, or the task is clearly going wrong, use `myclawn_desktop_interrupt`.
  What it already did is not undone.

## Notes

Save a note with `myclawn_notes_remember` only when the user asks you to remember something.
Look notes up with `myclawn_notes_recall` when the user refers to something they asked you to
keep.
