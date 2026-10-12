# Waymark

A reading journal for **The Pilgrim’s Progress**. Sign in, mark the passage you are on, and a pin shows that place on the map — from the City of Destruction to the Celestial City.

The four plates follow Christian’s journey in Part I, joined into one map you can scroll. Plate IV is at the top and Plate I is at the bottom. The map opens on the plate you are reading. Passages are named for the story, not for a page number, so they line up in any unabridged edition. You can also keep a note on each passage.

Anyone signed in on this copy of Waymark shows up on the map, under a name they choose. That name is the only thing other readers see — not an email, and not the notes on a passage. Open **Leaderboard** for the ranking — rank, points, and how long someone has been at a passage — or tap a colored pin.

The book icon beside your name opens a reference for Part I: the people and the places, a picture of each, and the scriptures Bunyan set in the margin. On the map, drag or scroll up and down to move from plate to plate. Plate IV is above Plate III, then Plate II, then Plate I. The menu under Waymark jumps to a plate. The path still shows one city at a time: choose it from the menu, then choose one place. Each person at that place appears as a picture under the name.

Each place is worth 50 points the first time you reach it. The pin moves one passage at a time, when you finish the passage you are on. **I’ve read this passage** is the only way to open that place’s quiz: three questions, then one hard question, on a single 45-second chance. The total sits beside your name, and company shows everyone else’s score. Characters from the book have left a line at each passage. Your own note stays private. Tap a pin on the map and the passage opens over the plate. The bar along the bottom switches between the map, the leaderboard, a badge for every stop, and the retreat schedule. An admin can edit the Friday and Saturday times on that page, and everyone else sees the saved timetable. The schedule has four missions everyone does before the trip, three mystery missions drawn for each person (they unlock Thursday, Oct 29 at 11:59 PM Pacific), and the Shining Ones, chosen when that mission unlocks on Thursday, Oct 29 at 11:59 PM Pacific. A finished mission is 25 points, once, except Pack your scroll, which is 100, and a mystery mission, which is 200. Three Shining Ones are chosen when that mission unlocks. The group names them together in person. If every one of them is named, each reader gets 250. A Shining One nobody names gets 300. After a quiz, the passage keeps the right answers in green and the ones you missed in red. Hebrews 11:13–16 is marked when it is memorized. The others take a photo. An admin sees every mission early, each person’s draw, and who the Shining Ones are. From a reader’s profile, an admin can set a new password and copy it to send privately. The old password is not kept. The profile button in the corner keeps your map name, a picture on your pin, where you are, that other readers see too, and a daily check-in. Change the picture from that button. **Your name** in that same sheet is private. An admin sees it, along with each reader’s map name, the questions they missed, the missions they finished, and a gallery. **Download pictures for Google Drive** saves those photos as a zip.

## Run it

```bash
npm install
npm run dev
```

Open [http://127.0.0.1:3000](http://127.0.0.1:3000). Create an account, then use **I’ve read this passage** to move the pin. Drag or scroll the map to move between plates, and pinch to zoom. **Places** shows the other towns and landmarks drawn on the plate.

Accounts, your place, and notes are stored in `data/waymark.sqlite` on this machine. That folder is not committed.

## Deploy on Railway

Waymark keeps the journal and the photos in a SQLite file. Deploy it on Railway with one replica and a volume mounted at `/app/data`. The live site starts empty. This machine’s accounts are not uploaded.

From the project folder in PowerShell:

```powershell
npm i -g @railway/cli
railway login
railway up --name waymark
railway volume add --mount-path /app/data
$bytes = New-Object byte[] 32
[System.Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($bytes)
railway variable set ("SESSION_SECRET=" + [Convert]::ToBase64String($bytes))
railway variable set ADMIN_EMAILS=you@example.com
railway domain
```

Use the email you will sign in with for `ADMIN_EMAILS`. Leave the service at one replica. Add the volume and the secret before anyone creates an account. After that, open the domain Railway prints and create the admin account with that same email.

## Session secret

Sessions are signed cookies. In production set a long random `SESSION_SECRET` (see `.env.example`). If you leave it unset, the app creates `data/.session-secret` the first time it runs.
