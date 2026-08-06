# Phase 2F — Airport Knowledge Review

## Files

Added:

- `lib/airport-knowledge.ts`
- `components/AirportKnowledge.tsx`
- `tests/airport-knowledge.test.tsx`
- `docs/PHASE-2F-AIRPORT-KNOWLEDGE-REVIEW.md`

Modified:

- `components/AirportRouteLandingPage.tsx`
- `components/QuoteForm.tsx`
- `components/Footer.tsx`
- `components/LocationLandingPage.tsx`
- `app/book-now/page.tsx`
- `app/page.tsx`
- `app/business-accounts/page.tsx`
- `app/airport-taxi-faqs/page.tsx`
- `app/privacy-policy/page.tsx`
- `app/terms/page.tsx`

## Central architecture

`lib/airport-knowledge.ts` contains typed, non-JSX knowledge for Birmingham Airport and Heathrow Airport. The shared `AirportKnowledge` component selects content using each existing route's destination airport. Airport-level facts therefore have one source rather than being duplicated across sixteen route records.

## Guidance used

Birmingham Airport guidance retains the existing rule that the collection meeting point is confirmed with the booking. It adds cautious planning around exact addresses, road conditions, flight numbers, airline guidance, passenger and luggage totals, additional requirements, changed details and separately requested returns.

Heathrow guidance retains the verified facts that passenger Terminals 2, 3, 4 and 5 operate, passenger collection is not permitted from terminal forecourts, and an authorised car park or another agreed meeting point may be used. It does not promise terminal-door collection.

## Consolidation and placement

The reusable airport section appears once on every airport-transfer page after route-specific authority answers. The former separate Heathrow terminals-and-collection card was removed because it repeated the same centrally managed facts. Route-specific guides, direct answers, authority content, nearby routes and business links remain.

The airport section links contextually to the airport taxi FAQs, quote page and business accounts page. Existing links to area guides, corresponding airport routes and nearby routes are unchanged.

## Customer-facing cleanup

The quote page now uses “Airport transfer quote” and “Get an airport transfer quote”. Journey choices and results are described professionally without exposing milestone or development terminology, and the displayed result is qualified as an indication that requires a confirmed quotation.

The footer now reads “© [current year] Birmingham Airport Cars. All rights reserved.” Customer-visible Phase 1, development, prototype and later-phase wording was also removed from the homepage, area-guide CTAs, business accounts, airport FAQs, privacy policy and terms page.

## Deliberate omissions

No parking locations, airport fees, drop-off or collection charges, waiting periods, grace periods, meet-and-greet promise, driver-waiting guarantee, exact airport-processing time, airline-specific check-in time or terminal-transfer claim was added because it was not required and verified for this milestone.

No fares, airport charges or waiting rules were invented or approved. Pricing formulas, route-pricing approval gating, calculator calculations and vehicle-capacity rules remain unchanged.
