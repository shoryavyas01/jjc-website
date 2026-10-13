# Jai Jwala Contracts

A static, multi-page business website for Jai Jwala Contracts in Pokaran, Rajasthan. No build step or runtime dependencies are required.

## Preview

Run `python -m http.server 8000` from this directory and open `http://localhost:8000`.

## Design and content

The road emblem is redrawn as a clean vector mark while retaining the original blue-and-gold identity. The design uses ink blue, sandstone, and brass, with system sans-serif type and a Georgia serif accent. The original SVG illustrations in `assets/illustrations/` depict roadworks, a quarry, a railway materials yard, and a site engineer. They are illustrations, not photographs of completed projects. Existing photos remain in `images/` but are not used by the redesigned pages.

Project names, founding year, location, and business contact details are retained from the original repository. Headline statistics and the broken flyover entry have been removed. Confirm business information with the owner before adding new claims, client logos, registrations, or project metrics.

## Interactions

- Responsive navigation with Escape and outside-click dismissal; navigation remains available without JavaScript.
- Scroll reveals and entrance transitions that respect reduced-motion preferences.
- Project category filters and expandable work scopes.
- Service links prefill the enquiry form.
- Contact form validation, sending state, confirmed success, timeout and failure recovery. The existing Formspree endpoint is retained. Success appears only after an HTTP success response. Enquiry content is retained on failure.
- Native form submission remains available without JavaScript.

## Deployment

Publish the repository root as a static site. `netlify.toml` preserves security headers and serves the custom 404 with HTTP 404 status for unmatched requests. Other static hosts should configure their own 404 behavior. Keep the existing domain `jaijwalacontracts.in`; the canonical URLs and sitemap use it.

## Verification

Run `npm ci` and `npm test` (Python 3 and Node.js required). Tests check internal resources and anchors, SVG XML, structured data, navigation, filters, service prefilling, invalid submissions, duplicate prevention, and mocked success/failure states. No real enquiries are sent. These DOM tests do not replace visual browser checks.

## Maintenance

Shared styling and behavior live in `assets/css/styles.css` and `assets/js/main.js`. The header and footer are static HTML on each page: apply shared changes to all eight pages. The copyright year updates in JavaScript. The legal policy wording is preserved from the original site.

## Design references

Research references: [Turner Construction](https://www.turnerconstruction.com/), [L&T Construction](https://www.lntecc.com/), and [Mace Construction](https://www.macegroup.com/construction-services/). These informed the emphasis on clear expertise, work categories, and project enquiries. Copy, artwork, and page layouts are original to this redesign.
