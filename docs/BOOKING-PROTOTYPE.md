# Guided booking prototype · 0.6.6

This is the complete booking interaction requested for the hackathon. It replaces the interest button that previously opened a conversation card. Explore, Journeys and the second passport page link to the new experience catalogue.

## Visitor flow

1. Start with the city selected in settings; change it in the catalogue if desired. Ten proposed experiences cover Riyadh, Jeddah, Makkah, Madinah and Dammam. The Ithra option explicitly identifies nearby Dhahran.
2. Choose a tour. Read its proposed itinerary, duration and religious-guide specialty. The existing visitor/host illustration provides the human introduction; no guide identity, rating or certification is fabricated.
3. Pick one of the next 14 dates, a local time, 1–8 visitors and Arabic or English. Ticket name and a question for the guide are optional. A saved conversation-card question can be attached by deliberate choice.
4. Review and confirm. No payment is requested in the prototype.
5. Receive a ticket with a unique reference and all selected details. Download a standalone HTML ticket, which can be printed or saved as PDF from its own Print button. Return via My tickets, change the appointment or cancel it.

The concise prototype note remains visible in the flow and on exported tickets. Dates, guide roles, durations, programmes and meeting points are proposed demonstration data. No external booking, payment, guide assignment, admission entitlement or message is sent. No prototype booking earns an actual visit stamp. The official destination links document the places, not partnerships or availability.

This continues the project's device-local demonstration model: prototype drafts and tickets are stored on the current device under `lahza-prototype-booking-draft-v1` and `lahza-prototype-tickets-v1`. Refresh restores the draft or ticket; Clear my data removes both. The confirmation writes the record before showing success; denied storage leaves the form intact with a recoverable error. Repeated confirmation uses the same draft ID. Tickets are retained up to a 50-record prototype limit, with no silent eviction. Real-world booking infrastructure is outside this prototype.

## Destination references checked 6 October 2026

- Riyadh / National Museum: https://engage.moc.gov.sa/national_museum/?lang=en
- Diriyah / At-Turaif: https://www.diriyah.sa/en/history-and-culture
- Jeddah / Al-Balad: https://www.visitsaudi.com/content/sauditourism/en/destinations/jeddah/attractions/summer-night-adventures-in-al-balad.html
- Jeddah / Al Tayebat: https://book.visitsaudi.com/product/0e1be3ed-61fa-452f-a2eb-e2a8d66e5612?locale=en
- Makkah / Hira Cultural District and its Qur’an Museum: https://www.visitsaudi.com/en/destinations/makkah/attractions/hira-cultural-district-tour
- Madinah / Dar Al-Madinah and the International Museum of the Prophet’s Biography and Islamic Civilization: https://book.visitsaudi.com/product/dce27cbe-026f-4282-9f46-508464ebca3e?locale=en
- Dammam / Heritage Village: https://www.visitsaudi.com/en/eastern-province/attractions/heritage-village-in-dammam
- Dhahran / Ithra: https://www.visitsaudi.com/en/destinations/eastern-province/attractions/ithra

No religious explanatory claim was authored or edited. `data/moments-batch1.json`, the content/source gates and model backend remain byte-for-byte unchanged from 0.6.5. Tour descriptions are proposed logistical programmes, not an extension of the religious claim library.

## Verification

`node scripts/test-v066-booking.mjs` executes 12 focused checks on the actual component handlers and booking/export functions, using controlled hook, browser-storage and DOM adapters. It covers every city, both language flows, draft/ticket restoration, editing, cancellation, duplicate prevention, storage failure, date/count validation, escaped download content, the parent entry point, privacy clearing and unchanged religious/model files. All passed. These checks are not browser screenshots or visual QA. The test writes two standalone sample ticket files and the detailed result under `docs/release-0.6.6/`.
