// All listing content lives here so components stay presentational.
// Text transcribed from the reference page (docs/reference/page-content.md).

const img = (path) => `/images/${path}`

export const photoSections = [
  { id: 'living-room-1', title: 'Living room 1', count: 3, amenities: ['Sofa', 'Air conditioning', 'Ceiling fan', 'TV'] },
  { id: 'living-room-2', title: 'Living room 2', count: 7, amenities: ['Ceiling fan', 'Hot tub'] },
  {
    id: 'full-kitchen',
    title: 'Full kitchen',
    count: 2,
    amenities: ['Freezer', 'Fridge', 'Blender', 'Cooker', 'Cooking basics', 'Kettle', 'Microwave', 'Toaster', 'Wine glasses', 'Coffee', 'Crockery and cutlery'],
  },
  {
    id: 'bedroom',
    title: 'Bedroom',
    count: 6,
    amenities: [
      'Double bed', 'Air conditioning', 'Bed linen', 'Ceiling fan', 'Clothes storage', 'Cot', 'Hangers', 'Iron',
      'Room-darkening blinds', 'Cleaning available during stay', 'Cleaning products', 'Long-term stays allowed', 'Private entrance', 'Wifi',
    ],
  },
  { id: 'full-bathroom', title: 'Full bathroom', count: 1, amenities: ['Hairdryer', 'Hot water', 'Shampoo', 'Shower gel'] },
  { id: 'gym', title: 'Gym', count: 5, amenities: ['Air conditioning', 'Gym', 'Exercise equipment', 'Ceiling fan'] },
  { id: 'exterior', title: 'Exterior', count: 6, amenities: [] },
  { id: 'pool', title: 'Pool', count: 3, amenities: ['Pool'] },
  { id: 'additional-photos', title: 'Additional photos', count: 10, amenities: [] },
]

// Flat, ordered list of every photo — the lightbox walks this array.
export const photos = photoSections.flatMap((section) =>
  Array.from({ length: section.count }, (_, i) => {
    const n = String(i + 1).padStart(2, '0')
    return {
      id: `${section.id}-${n}`,
      src: img(`photos/${section.id}-${n}.jpeg`),
      sectionId: section.id,
      caption: section.title,
    }
  }),
)

export const photoIndex = (id) => photos.findIndex((p) => p.id === id)

// Hero grid: big image first, then the 2×2 grid (left→right, top→bottom).
export const heroPhotoIds = ['living-room-2-04', 'living-room-2-01', 'living-room-2-02', 'bedroom-01', 'exterior-05']

export const listing = {
  title: 'Romantic Jacuzzi 1BHK Candolim | Mirashya UG10',
  subtitle: 'Entire serviced apartment in Candolim, India',
  facts: ['3 guests', '1 bedroom', '1 bed', '1 bathroom'],
  rating: 4.95,
  reviewCount: 19,
  host: {
    name: 'Mirashya Homes',
    avatar: img('avatars/host.jpeg'),
    yearsHosting: 2,
    reviews: '1,463',
    rating: '4.68',
    facts: [
      { icon: 'balloon', text: 'Born in the 80s' },
      { icon: 'school', text: 'Where I went to school: NICMAR GOA' },
    ],
    coHosts: [
      { name: 'Sharath', avatar: img('avatars/co1.jpg') },
      { name: 'Aman Dev Pahwa', avatar: img('avatars/co2.jpg') },
      { name: 'Maria Karen Priyanka', avatar: img('avatars/co3.jpg') },
      { name: 'Simran', avatar: img('avatars/rev5.jpeg') },
      { name: 'Pallavi', avatar: img('avatars/rev1.jpeg') },
      { name: 'Sanyukta', avatar: img('avatars/rev2.jpeg') },
      { name: 'Shruti', initial: 'S', tint: 'pink' },
      { name: 'Amisha', initial: 'A', tint: 'blue' },
    ],
    responseRate: '100%',
    responseTime: 'within an hour',
  },
  highlights: [
    { icon: 'outdoor', title: 'Outdoor entertainment', text: 'The pool and alfresco dining are great for summer trips.' },
    { icon: 'fan', title: 'Designed for staying cool', text: 'Beat the heat with the A/C and ceiling fan.' },
    { icon: 'door', title: 'Self check-in', text: 'You can check in with the building staff.' },
  ],
  description:
    '🌴 Plan Your Relaxing Holiday at Amor De Goa by Mirashya Homes! ✨ Stay in this cozy 1BHK in the heart of Candolim, featuring a private jacuzzi 🛁 for the perfect unwind. Enjoy high-speed WiFi 💻, Smart TV 📺, pet-friendly comfort 🐾, and stylish interiors. Just minutes from Candolim Beach 🏖️, popular cafés, restaurants, and nightlife 🍹, it’s ideal for couples seeking romance, relaxation, and a touch of luxury in North Goa. ❤️🌴',
  sleep: [
    { photoId: 'bedroom-01', title: 'Bedroom', text: '1 double bed' },
    { photoId: 'living-room-1-01', title: 'Living room', text: '1 sofa' },
  ],
  amenities: [
    { icon: 'kitchen', label: 'Kitchen' },
    { icon: 'wifi', label: 'Wifi' },
    { icon: 'workspace', label: 'Dedicated workspace' },
    { icon: 'car', label: 'Free parking on premises' },
    { icon: 'pool', label: 'Pool' },
    { icon: 'hottub', label: 'Hot tub' },
    { icon: 'paw', label: 'Pets allowed' },
    { icon: 'camera', label: 'Exterior security cameras on property' },
    { icon: 'coAlarm', label: 'Carbon monoxide alarm', unavailable: true },
    { icon: 'smokeAlarm', label: 'Smoke alarm', unavailable: true },
  ],
  amenityTotal: 50,
  // Full list shown in the "What this place offers" dialog (grouped as on the reference).
  amenityGroups: [
    { title: 'Bathroom', items: ['Hairdryer', 'Cleaning products', 'Shampoo', 'Hot water', 'Shower gel'] },
    { title: 'Bedroom and laundry', items: ['Washing machine', 'Hangers', 'Bed linen', 'Room-darkening blinds', 'Iron', 'Clothes storage', 'Cot'] },
    { title: 'Entertainment', items: ['TV'] },
    { title: 'Family', items: ['Cot'] },
    { title: 'Heating and cooling', items: ['Air conditioning', 'Ceiling fan'] },
    { title: 'Home safety', items: ['Exterior security cameras on property'], unavailable: ['Carbon monoxide alarm', 'Smoke alarm'] },
    { title: 'Internet and office', items: ['Wifi', 'Dedicated workspace'] },
    {
      title: 'Kitchen and dining',
      items: ['Kitchen', 'Fridge', 'Freezer', 'Microwave', 'Cooking basics', 'Crockery and cutlery', 'Kettle', 'Coffee', 'Wine glasses', 'Toaster', 'Blender', 'Cooker'],
    },
    { title: 'Location features', items: ['Private entrance'] },
    { title: 'Outdoor', items: ['Patio or balcony', 'Outdoor dining area'] },
    { title: 'Parking and facilities', items: ['Free parking on premises', 'Pool', 'Hot tub', 'Gym'] },
    { title: 'Services', items: ['Pets allowed', 'Cleaning available during stay', 'Long-term stays allowed', 'Self check-in'] },
  ],
  location: 'Candolim, Goa, India',
  neighbourhood:
    'Located in the heart of Candolim, Amor de Goa offers a peaceful stay with easy access to beaches, cafés, and popular attractions.',
}

export const booking = {
  priceTotal: 28499, // for the default 5-night stay; nightly rate is derived from this
  nights: 5,
  checkIn: '2026-10-18',
  checkOut: '2026-10-23',
  guests: 2,
  maxGuests: 3,
  freeCancellationBy: '17 October',
  promo: { text: 'Get 10% off your next stay.', link: 'Terms apply', action: 'Claim', icon: img('ui/discount.svg') },
}

export const reviewSummary = {
  distribution: [0.95, 0.05, 0, 0, 0], // share of 5★ … 1★ ratings
  categories: [
    { label: 'Cleanliness', score: '5.0', icon: 'spray' },
    { label: 'Accuracy', score: '5.0', icon: 'check' },
    { label: 'Check-in', score: '5.0', icon: 'key' },
    { label: 'Communication', score: '5.0', icon: 'message' },
    { label: 'Location', score: '4.8', icon: 'map' },
    { label: 'Value', score: '4.8', icon: 'tag' },
  ],
  tags: [
    ['Comfort', 6, 'comfort'],
    ['Accuracy', 5, 'accuracy'],
    ['Hot tub', 5, 'hot-tub'],
    ['Condition', 4, 'condition'],
    ['Hospitality', 8, 'hospitality'],
    ['Cleanliness', 4, 'cleanliness'],
    ['Amenities', 2, 'amenities'],
    ['Decor', 2, 'decor'],
    ['Indoor spaces', 2, 'indoor-spaces'],
    ['Location', 2, 'location'],
  ].map(([label, count, icon]) => ({ label, count, icon: img(`chips/${icon}.png`) })),
}

export const reviews = [
  {
    name: 'Amit',
    initial: 'A',
    tint: 'amber',
    tenure: '2 months on Airbnb',
    date: '1 week ago',
    text: 'Very helpful and responsive team. Safe and peaceful stay. loved everything about the property.',
  },
  {
    name: 'Aheesh',
    avatar: img('avatars/rev1.jpeg'),
    tenure: '3 years on Airbnb',
    date: '2 weeks ago',
    text: 'We had a wonderful stay. The apartment was clean, comfortable, and exactly as shown in the photos. The host was very responsive and helpful throughout our stay. We would definitely recommend this place and would love to stay here again.',
  },
  {
    name: 'Samiksha',
    avatar: img('avatars/rev2.jpeg'),
    tenure: '8 months on Airbnb',
    date: 'May 2026',
    text: 'the host nitish was really great help',
  },
  {
    name: 'Vedant',
    initial: 'V',
    tint: 'violet',
    tenure: '4 years on Airbnb',
    date: 'May 2026',
    text: 'We had an amazing stay at this property in Goa! The entire home was spotless and exceptionally well-maintained, making us feel comfortable from the moment we arrived. The cleanliness standards were truly impressive, with every corner of the house looking fresh and pristine.\nThe highlight of our stay was definitely the jacuzzi. It was clean, well-kept, and the perfect place to relax after a day of exploring Goa. It added a luxurious touch to our vacation and made our experience even more memorable.\nThe property was exactly as described, well-equipped, and offered a peaceful atmosphere. We would highly recommend this place to anyone looking for a comfortable, clean, and relaxing stay in Goa. Looking forward to visiting again!',
  },
  {
    name: 'Vaibhav S',
    avatar: img('avatars/rev3.jpeg'),
    tenure: '3 years on Airbnb',
    date: 'May 2026',
    text: "Great great experience living out there , can't expect more , will always look for it in the future and will recommend my friends too.",
  },
  {
    name: 'Mohd',
    avatar: img('avatars/rev4.jpeg'),
    tenure: '5 years on Airbnb',
    date: 'May 2026',
    text: 'Great place. Exactly as described in the listing.',
  },
]

export const thingsToKnow = [
  {
    icon: 'calendarX',
    title: 'Cancellation policy',
    lines: ['Free cancellation before 17 October. Cancel before check-in on 18 October for a partial refund.', 'Review this host’s full policy for details.'],
  },
  { icon: 'keyRound', title: 'House rules', lines: ['Check-in after 2:00 pm', 'Checkout before 11:00 am', '3 guests maximum'] },
  {
    icon: 'shield',
    title: 'Safety & property',
    lines: ['Carbon monoxide alarm not reported', 'Smoke alarm not reported', 'Exterior security cameras on property'],
  },
]

export const nearbyStays = [
  { title: 'Beautiful Studio with a view to die for', price: '₹23,600', rating: '4.91', image: img('similar/s1.jpeg') },
  { title: 'NAQAB - 1bhk with private pool', price: '₹42,218', rating: '4.95', image: img('similar/s2.jpeg') },
  { title: 'Greentique Luxury Flat with plunge pool, Calangute', price: '₹44,506', rating: '4.94', image: img('similar/s3.jpeg') },
  { title: 'The Tropical Studio | 5 mins to Beach', price: '₹22,824', rating: '4.96', image: img('similar/s4.jpeg') },
  { title: 'Luxury Casa Bella 1BHK with plunge pool, Calangute', price: '₹39,942', rating: '4.95', image: img('similar/s5.jpeg') },
  { title: 'Kanso by Earthen Window | Jacuzzi | Terrace | Pool', price: '₹45,648', rating: '5.0', image: img('similar/s6.jpeg') },
  // The reference reuses two of the first-page images for the last two cards.
  { title: 'Luxury Apt | Private Pool | 6 Mins from Beach', price: '₹48,786', rating: '4.93', image: img('similar/s2.jpeg') },
  { title: 'Serendipity Cottage - Calm Stay in Calangute-Baga.', price: '₹22,824', rating: '4.92', image: img('similar/s4.jpeg') },
]
