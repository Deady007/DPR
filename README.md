# DPR

Front-end for **Shreemay**, a project-tracking web app covering daily
progress reports, meeting minutes, and leave management.

## Pages

| File | Purpose |
| --- | --- |
| `index.html` | Dashboard |
| `projects.html` | Project list |
| `project.html` | Single-project detail, with tabbed sections |
| `mom.html` | Minutes of Meeting list |
| `mom-detail.html` | Single meeting detail |
| `mom-pdf.html` | Printable MoM output |
| `leave.html` | Leave management (employee and admin views) |
| `chatbot.html` | AI assistant |

## Layout

- `css/styles.css` — shared stylesheet
- `js/app.js` — shared application logic
- `js/data.js` — data layer
- `js/icons.js` — icon definitions
- `js/tab-*.js` — project-detail tabs: DPR, PO, SOP, Doc, Query, Pending
- `js/leave-*.js` — leave views, split by employee and admin
- `js/chatbot.js` — AI assistant logic

## Running

A static site with no build step — open `index.html` in a browser, or
serve the directory:

```sh
python3 -m http.server 8000
```

Then visit <http://localhost:8000>.
