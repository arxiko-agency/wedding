# Shreya & Rahul – Forever Begins (Germany)

Plain HTML + CSS + JavaScript. No build step, no installs.

## Folder
- `index.html` – page structure
- `css/style.css` – emerald & gold design
- `js/config.js` – **the only file you need to edit** (names, date, venue, schedule, photos, WhatsApp, RSVP…)
- `js/main.js` – logic (countdown, music, gallery, RSVP, calendar…)
- `images/` – your photos (already optimized) · `music/wedding-music.mp3` – first 2:30 of your song, fades in/out and loops from the start

## 1. Edit your details (js/config.js)
Replace everything marked ✏️ EDIT: wedding date/time (the 12 June 2027 15:00 date is only a placeholder), city, venue, address, Google Maps link, WhatsApp number (e.g. `49XXXXXXXXXX`, digits only), schedule, dress code, hotel, registry link, texts about bride/groom and the love story.
Unknown details are neutral placeholders – nothing was invented. The Germany venue picture is a stand-in; put your own photo in `images/` and set `venue.photo`.

## 2. Change photos / music
Copy a new file into `images/` (or `music/`) and change its path in `config.js`. To use a different part of a song:
`ffmpeg -i song.mp3 -ss 30 -t 150 -af "afade=t=in:d=3,afade=t=out:st=145:d=5" music/wedding-music.mp3`

## 3. Make RSVP really save answers
The form shows "received" ONLY when a real backend accepts it. Until you set `rsvp.endpoint`, guests see that RSVP is not live and can use the WhatsApp button.
- **Easiest – Formspree:** create a free form at formspree.io, paste `https://formspree.io/f/xxxx` into `rsvp.endpoint`. Answers arrive by email.
- **Google Sheet:** new Sheet → Extensions → Apps Script, paste:
```js
function doPost(e){
  var d = JSON.parse(e.postData.contents);
  SpreadsheetApp.getActiveSheet().appendRow([new Date(), d.name, d.phone, d.email, d.guests, d.attending, d.message]);
  return ContentService.createTextOutput(JSON.stringify({ok:true})).setMimeType(ContentService.MimeType.JSON);
}
```
  Deploy → New deployment → Web app → Execute as *Me*, access *Anyone* → paste the `/exec` URL into `rsvp.endpoint`.

## 4. Test on your computer
Open a terminal in this folder: `python3 -m http.server 8000` → http://localhost:8000
(Double-clicking index.html also works, but use the server to test everything.)

## 5. Publish (free, ~2 minutes)
- **Netlify Drop:** go to app.netlify.com/drop and drag the whole folder in. You get a link; set it as `siteUrl` in config.js and upload again.
- **Vercel:** `npx vercel` inside the folder, or import a GitHub repo.
- **GitHub Pages:** upload to a repo → Settings → Pages → branch `main`, folder `/root`.
A custom domain can be added in each service's settings. Music starts only after guests tap OPEN INVITATION (browser rule).

## Notes
Fonts (Cinzel, Cormorant Garamond, Great Vibes) load from Google Fonts; a similar serif is used if offline.
You need rights to use the music publicly – a commercial song may be restricted on a public website; swap in a licensed/royalty-free track if in doubt.
