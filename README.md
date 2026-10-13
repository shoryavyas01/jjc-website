# Jai Jwala Contracts

Static multi-page website for Jai Jwala Contracts, Pokaran, Rajasthan. No build step or runtime JavaScript dependencies.

## Preview and tests

Run `python -m http.server 8000` and open `http://localhost:8000`.

Run `npm ci` and `npm test` (Python 3 and Node.js required). Tests validate internal resources and anchors, heading structure, structured data, navigation, project filters, service prefilling, and mocked enquiry submission states. No real enquiries are sent.

## Design

Deep navy, white, restrained gold accents, clear sans-serif typography, and real construction photography. Motion is limited to a short hero entrance, scroll reveals, and small hover transitions. Reduced-motion preferences are respected. The former illustrations, caricature, decorative stamps, and repeated slogans are removed.

Project scopes are shown without stock photos beside named projects, avoiding the impression that stock photography documents the company's own work. Founding year, project names, location, and contact details are retained from the original repository; new business metrics and certifications are not invented.

## Photography

Pexels photography is hosted on its image CDN. These photos are representative service imagery, not Jai Jwala project photos. Their source pages describe them as free to use:

- [Quarry equipment, photo 14484391](https://www.pexels.com/photo/heavy-machinery-in-a-quarry-site-14484391/)
- [Road construction, David McElwee, photo 12228684](https://www.pexels.com/photo/construction-machineries-on-side-of-the-road-12228684/)
- [Excavator, photo 12230651](https://www.pexels.com/photo/a-yellow-and-black-excavator-on-concrete-road-with-soil-and-rocks-12230651/)

The image URLs are explicit and versioned by photo ID. All photographic elements use `referrerpolicy="no-referrer"`; below-fold images load lazily. The original repository photos are retained in Git but are not displayed. Photo hosting relies on Pexels availability; replace with owner-approved, locally hosted company photography when available.

## Interactions

Responsive navigation supports Escape, outside-click dismissal, and operation without JavaScript. Project categories use accessible pressed states and a live result count. Native work-scope details and service jump links need no runtime dependency. Service and project enquiries prefill the contact form.

The existing Formspree endpoint is retained. Validation, duplicate prevention, sending status, confirmed success, timeout and failure recovery remain in place. Details are preserved on failures. The native form also works without JavaScript.

## Deployment and maintenance

Publish the repository root. Netlify serves `404.html` with HTTP 404 for unmatched routes. Canonical URLs and sitemap use `jaijwalacontracts.in`.

Styling: `assets/css/styles.css`. Behavior: `assets/js/main.js`. Apply shared header and footer changes to all eight pages. Existing legal wording is retained.
