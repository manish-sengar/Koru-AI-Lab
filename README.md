# Koru AI Lab

A directory of Koru's AI experiments: search, filters, generated illustrations and a detail page for each experiment.

Plain HTML, CSS and JavaScript. No framework, no build step, no dependencies.

## Project structure

```
index.html            Page shell: navigation, footer, shared SVG gradients
css/styles.css        Design tokens (colours, type, spacing, motion) and all styles
js/data.js            EXPERIMENTS array: the single source of content
js/illustrations.js   Placeholder illustration for each experiment
js/app.js             Hero, directory, filters, detail pages and routing
favicon.svg
netlify.toml          Netlify config (static publish, headers)
```

## Run locally

Open `index.html` in a browser, or serve the folder:

```bash
npx serve .
# or
python3 -m http.server 8000
```

## Deploy to Netlify

1. Push this folder to a GitHub repository.
2. In Netlify: **Add new site → Import an existing project → GitHub**, then pick the repo.
3. Leave the build command empty and set the publish directory to `.` (both come from `netlify.toml`).
4. Deploy. Every push to the main branch redeploys automatically.

Routing uses URL hashes (`/#/e/sparr`), so no redirect rules are needed.

## Adding or editing an experiment

Everything is driven by `js/data.js`. Add an object to `EXPERIMENTS` and the card, filters, counts, hero question, detail page and related links all update.

```js
{
  n: 25,                          // unique number
  slug: "my-experiment",          // URL: /#/e/my-experiment
  title: "My experiment",
  type: "tool",                   // "tool" | "insight" | "evaluation"
  visual: "components",           // any key in ILLUSTRATIONS (js/illustrations.js)
  status: "Early prototype",      // optional
  feature: true,                  // optional: sorts first under "Featured first"
  question: "Can AI do X?",       // optional: appears in the hero "Ask the lab" panel
  summary: "One or two sentences.",
  stats: [["~50%", "of effort saved"]],   // optional: shown as Key results
  themes: ["research"],           // keys from THEMES
  tools: ["Claude", "Figma"],
  hypothesis: "completes the sentence 'We wanted to explore whether…'",
  approach: "How it was done.",
  learned: ["Lesson one.", "Lesson two."],
  next: "What happens next.",
  related: [3, 14]                // n of related experiments (topped up by shared themes)
}
```

New themes go in the `THEMES` object in the same file.

## Replacing placeholder illustrations

Each experiment's `visual` points to a scene function in `ILLUSTRATIONS`. To use real screenshots, add images (for example `/images/sparr.webp`) and update `coverSVG` in `js/illustrations.js` to render an `<img>` when an experiment has a `coverImage` field.

## Content review

`hypothesis`, `approach` and `next` were drafted from one-line source descriptions. Have each experiment's owner confirm them before launch.

## Accessibility and performance

- Semantic HTML, keyboard navigation, visible focus states and ARIA labels on all controls
- `prefers-reduced-motion` turns off the typing effect, carousel autoplay, parallax and page transitions
- Light and dark themes follow the system setting, with a manual toggle
- Illustrations are inline SVG, so there are no image requests
- The only external request is Google Fonts (Geist), with a system font fallback
