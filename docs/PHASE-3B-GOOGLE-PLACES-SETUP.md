# Phase 3B — Google Places setup

Set `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` in the local environment and in Netlify. This browser-visible key is used only to load Google Maps JavaScript API Places functionality.

In Google Cloud, enable only the APIs required for Maps JavaScript address autocomplete. Restrict the key by HTTP referrer to:

- `https://birminghamairportcars.co.uk/*`
- `https://*.birminghamairportcars.co.uk/*`

Add explicit preview or local-development referrers only when required. Apply API restrictions to the Google Maps JavaScript API and the applicable Places API used by the project. Never put an unrestricted key in source control.

Phase 3B does not use Google distance or duration data. Supported fares continue to use the existing journey records and pricing engine.
