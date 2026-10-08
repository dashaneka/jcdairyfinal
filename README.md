# J&C Dairy demo

Single-page dairy farm website built with HTML, CSS and JavaScript.

Live demo: https://jcdairydemo.vercel.app

## Local preview

Run `python -m http.server 8765` in this directory, then open
http://localhost:8765 in your browser.

## Files

- `index.html`: website content and contact details
- `style.css`: responsive layout, styles and animations
- `script.js`: navigation, scroll effects, team carousel and form behavior
- `images/`: locally stored website images, including the transparent
  `jc-dairy-logo.png` used in the header and footer
- `vercel.json`: static Vercel deployment configuration

## Pending client handover

- Confirm owner and worker names with the client before adding them.
- Connect the contact form to a submission service. Currently it only displays
  a local success state and does not send messages.

Environment files and local Vercel credentials are excluded from version control.

## Photo update

The supplied screenshots were cropped to remove phone controls and exported as
WebP: owner, workers, entrance gate (hero), milking shed (about), pasture (vision),
and location (contact). The people slider has two slides; unverified director
and HR portraits were removed. The location view keeps its map label and is
credited to Google Maps. Original screenshot resolution limits image detail.
