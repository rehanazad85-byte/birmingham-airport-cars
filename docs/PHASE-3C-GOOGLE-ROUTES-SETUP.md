# Phase 3C — Google Routes API setup

Phase 3C uses Google Routes API — Compute Routes on the server to obtain driving distance and duration. It does not call Routes API directly from the browser.

1. Enable **Routes API** in the Google Cloud project used for server routing.
2. Create a separate server-side API key and restrict that key to **Routes API** only.
3. Add the real key to the Netlify environment settings as `GOOGLE_ROUTES_API_KEY`.
4. Never commit the real key to Git or expose it through a `NEXT_PUBLIC_*` variable.

The existing `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` remains the separate browser key for Places autocomplete. Its browser and API restrictions should not be weakened.
