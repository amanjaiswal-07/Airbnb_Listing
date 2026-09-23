export const guestSummary = (guests) => {
  const people = guests.adults + guests.children
  const parts = [`${people} guest${people === 1 ? '' : 's'}`]
  if (guests.infants) parts.push(`${guests.infants} infant${guests.infants === 1 ? '' : 's'}`)
  if (guests.pets) parts.push(`${guests.pets} pet${guests.pets === 1 ? '' : 's'}`)
  return parts.join(', ')
}
