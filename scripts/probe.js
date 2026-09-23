// Layout probe: paste into both the reference and the clone at the same viewport, then diff.
// Finds the deepest element whose normalised text equals each probe and reports y,h,x,w (document coords).
(() => {
  const norm = (s) => s.replace(/\s+/g, ' ').trim()
  const probes = [
    ['h1', 'Romantic Jacuzzi 1BHK Candolim | Mirashya UG10'], ['share', 'Share'], ['showAll', 'Show all photos'],
    ['subtitle', 'Entire serviced apartment in Candolim, India'], ['gfText', 'One of the most loved homes on Airbnb, according to guests'],
    ['hostedBy', 'Hosted by Mirashya Homes'], ['hostYears', '2 years hosting'], ['hl1', 'Outdoor entertainment'],
    ['hl1t', 'The pool and alfresco dining are great for summer trips.'], ['hl3', 'Self check-in'], ['showOrig', 'Show original'],
    ['sleepH', "Where you'll sleep"], ['bedroom', 'Bedroom'], ['doubleBed', '1 double bed'], ['offersH', 'What this place offers'],
    ['kitchen', 'Kitchen'], ['smoke', 'Smoke alarm'], ['all50', 'Show all 50 amenities'], ['calH', '5 nights in Candolim'],
    ['calSub', '18 Oct 2026 - 23 Oct 2026'], ['oct', 'October 2026'], ['clear', 'Clear dates'], ['promo', 'Get 10% off your next stay.'],
    ['claim', 'Claim'], ['checkin', 'CHECK-IN'], ['reserve', 'Reserve'], ['noCharge', "You won't be charged yet"],
    ['report', 'Report this listing'], ['howRev', 'How reviews work'], ['overall', 'Overall rating'], ['comm', 'Communication'],
    ['amit', 'Amit'], ['vaibhav', 'Vaibhav S'], ['all19', 'Show all 19 reviews'], ['whereH', 'Where you’ll be'],
    ['place', 'Candolim, Goa, India'], ['exact', 'Exact location will be provided after booking.'], ['nbh', 'Neighbourhood highlights'],
    ['meetH', 'Meet your host'], ['cohosts', 'Co-Hosts'], ['sharath', 'Sharath'], ['hostDetails', 'Host details'], ['message', 'Message host'],
    ['born', 'Born in the 80s'], ['thingsH', 'Things to know'], ['cancel', 'Cancellation policy'], ['staysH', 'More stays nearby'],
    ['stay1', 'Beautiful Studio with a view to die for'],
  ]
  const all = [...document.querySelectorAll('body *')].filter((e) => {
    const r = e.getBoundingClientRect()
    return r.width > 0 && r.height > 0 && !e.closest('[role=dialog]')
  })
  const out = probes.map(([label, text]) => {
    const matches = all.filter((e) => norm(e.textContent) === text && ![...e.children].some((c) => norm(c.textContent) === text))
    const e = matches.sort((a, b) => a.getBoundingClientRect().y - b.getBoundingClientRect().y)[0]
    if (!e) return `${label}:-`
    const r = e.getBoundingClientRect()
    return `${label}:${Math.round(r.y + scrollY)},${Math.round(r.height)},${Math.round(r.x)},${Math.round(r.width)}`
  })
  return `doc:${document.documentElement.scrollHeight} ` + out.join(' ')
})()
