# MediathekViewWeb MSX on Cloudflare Workers

Cloudflare Worker that exposes a documentary-focused Media Station X
start/menu/content API for MediathekViewWeb search results.

## Endpoints

- `/` - small browser landing page with launch links
- `/health` - JSON endpoint checklist
- `/msx/start.json` - MSX Start Object
- `/msx/menu.json` - MSX Menu Root Object
- `/msx/search` - dynamic MSX Content Root Object from MediathekViewWeb results
- `/msx/search-action` - legacy `execute:code` handler for older clients
- `/msx/play` - `execute` handler that returns a `video:{URL}` action
- `/msx/resolve` - `video:resolve` compatible handler
- `/api/query` - optional MediathekViewWeb query proxy

## Local Checks

This project does not require a build step. The Worker is a JavaScript module.

```bash
node --check index.js
node --test
```

## Cloudflare Deployment

Wrangler's current Worker config requires `name`, `main`, and
`compatibility_date` in `wrangler.toml`.

```bash
npx --yes wrangler@latest whoami
npx --yes wrangler@latest dev
npx --yes wrangler@latest deploy
```

If the local machine has no `npm`/`npx`, install Wrangler through the normal
Cloudflare workflow on the deploy machine, or run the commands in an environment
that has Node.js and npm available.

After deployment, configure Media Station X with:

```text
https://<worker-host>/msx/start.json
```

Or launch in the browser with:

```text
https://msx.benzac.de/?start=menu:https://<worker-host>/msx/menu.json
```

## Research Summary

MSX is driven by JSON, not by scraping or mirroring the HTML website. The Worker
therefore serves the full MSX surface directly:

- Start Object points MSX to `/msx/menu.json`.
- Menu Root Object exposes a Doku search, Doku sender tiles, Doku presets, info,
  and settings entries.
- Search uses the MSX Input Plugin with `type=search`, so normal text input is
  available instead of the numeric `execute:code` keyboard.
- Content Root Objects are generated dynamically from MediathekViewWeb results.
- The "Neue Dokus nach Sendern" preset adds `group=channel` and inserts sender
  headers before the result items.
- Result items and sender headers are enriched with logos from
  `tv-logo/tv-logos` under `countries/germany`.
- Server Actions are wrapped as `{"response": {"status": 200, ...}}`, as MSX
  expects for `execute:*` and `resolve` workflows.
- MediathekViewWeb search uses `POST /api/query` with JSON text containing
  `queries`, `sortBy`, `sortOrder`, `future`, `offset`, and `size`.
- Worker responses add CORS headers and cache GET search transformations for a
  short time while keeping interactive server actions uncached.

Primary references:

- MSX Start Object: https://msx.benzac.de/wiki/index.php?title=Start_Object
- MSX Menu Root Object: https://msx.benzac.de/wiki/index.php?title=Menu_Root_Object
- MSX Content Root Object: https://msx.benzac.de/wiki/index.php?title=Content_Root_Object
- MSX Input Plugin: https://www.msx.benzac.de/wiki/index.php?title=Input_Plugin
- MSX Actions/Responses: https://msx.benzac.de/wiki/index.php?title=Actions
- Cloudflare Workers config: https://developers.cloudflare.com/workers/wrangler/configuration/
- MediathekViewWeb repository: https://github.com/mediathekview/mediathekviewweb
- German TV logos: https://github.com/tv-logo/tv-logos/tree/main/countries/germany
