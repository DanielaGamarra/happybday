# happybday

Little birthday gifts, one folder per year and person.

## 2026 / Paula: Little Toronto (with a beagle)

Live: https://danielagamarra.github.io/happybday/2026/Paula/

Same puzzle as Joseline's, made personal for Paula: Paula holding baby Olivia, Salva and their beagle in the park, a Canada and a Costa Rica flag flying together on the Flatiron, a toucan, a TTC Jane station sign and a High Park capybara.

## 2026 / Joseline: Little Toronto

Live: https://danielagamarra.github.io/happybday/2026/Joseline/


A tiny wooden puzzle of Toronto, built piece by piece. A birthday gift for Joseline.

- 54 laser-cut style pieces across 8 chapters: the base, Queen Street, a bay-and-gable row, the 504 streetcar, the Gooderham Flatiron (with a DAGA rooftop billboard), the CN Tower, an autumn neighbourhood (with two monkeys) and a birthday surprise.
- Tap a piece from the tray that snaps onto something already built. Drag to turn the city, pinch or scroll to zoom. Some pieces hide on the back.
- When the last piece lands the city lights up for the night.

Plain static site in `2026/Joseline/`: `index.html` + ES modules, three.js loaded from a pinned CDN. No build step.

Run locally:

```bash
npx serve .
```

then open http://localhost:3000/2026/Joseline/

Works on phones, tablets and desktop browsers.

Before each commit run `sh scripts/bump.sh` so browsers fetch the new files instead of cached ones.
