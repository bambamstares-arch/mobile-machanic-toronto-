# GTA Mobile Tire Services

Marketing site for GTA Mobile Tire Services — mobile and in-shop tire and auto
repair across the Greater Toronto Area.

Static HTML/CSS/JS. No build step: open `index.html`, or serve the folder.

```
python -m http.server 4173
```

## Pages

| File | Purpose |
| --- | --- |
| `index.html` | Home — hero, services, how it works, reviews, service area |
| `services.html` | Full service list |
| `bookings.html` | Booking form (composes a pre-filled SMS) |
| `reviews.html` | Google reviews |
| `contact.html` | Callback request form (composes a pre-filled SMS) |
| `about.html` | Team and story |
| `404.html` | Not-found page |

## Structure

```
assets/img/     logo lockups, favicons, poster stills for the videos
assets/video/   looping hero footage (muted, autoplay, playsinline)
css/style.css   design system + all page styles
js/main.js      mobile nav, sticky call bar, GSAP scroll reveals
previews/       reference screenshots (not linked from the site)
```

## Logo

`assets/img/logo.png` (dark ink, for light surfaces) and `logo-light.png` (for
the dark footer) are a horizontal lockup — mark left, wordmark right — derived
from the supplied artwork, which is stacked. The stacked original is kept at
`logo-stacked.png`. `icon-32/180/512.png` are the favicon and touch icon.

The logo reads "Mobile Mechanic Toronto" while the site copy still reads "GTA
Mobile Tire Services" — that is deliberate, not a leftover.

## Notes

- Both forms are client-side only: they build a message and hand off to
  `sms:+16475717200`. There is no backend, so nothing is stored or emailed.
  On desktop browsers without an SMS handler the link may not open.
- GSAP and ScrollTrigger load from cdnjs. If either fails, `js/main.js` falls
  back to the static page rather than leaving content hidden.
- Deployed with no custom domain.
