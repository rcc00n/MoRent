export const faqItems = [
  {
    id: 'how-do-i-book',
    question: 'How do I book a car?',
    answer:
      'Open the fleet, choose the car, select your dates, and send the request. We confirm availability directly after review.',
  },
  {
    id: 'are-rates-visible',
    question: 'Are rates visible before I request?',
    answer:
      'Yes. Every listed car shows the visible daily rate before you submit anything.',
  },
  {
    id: 'how-fast-is-confirmation',
    question: 'How fast is confirmation?',
    answer:
      'Most requests are reviewed within about 15 minutes during service hours, with final timing depending on the car and pickup window.',
  },
  {
    id: 'what-documents-are-needed',
    question: 'What documents are needed?',
    answer:
      'A valid driver licence and an identification document are reviewed before handoff. Final requirements are confirmed with the manager.',
  },
  {
    id: 'can-i-request-before-arrival',
    question: 'Can I request a car before arrival?',
    answer:
      'Yes. Early requests are encouraged for resort arrivals, hotel delivery, and airport pickup coordination.',
  },
  {
    id: 'where-is-pickup-arranged',
    question: 'Where is pickup arranged?',
    answer:
      'Pickup is coordinated after confirmation and can be arranged around hotel arrivals, airport meet points, or another agreed handoff location.',
  },
  {
    id: 'what-happens-after-submit',
    question: 'What happens after I submit the request?',
    answer:
      'Your request is saved, reviewed by the team, and confirmed manually with the final pickup details and next steps.',
  },
]

export const bookingProcessSteps = [
  {
    title: 'Choose the car',
    description:
      'Review the premium fleet, visible daily rates, and the exact car you want to request.',
  },
  {
    title: 'Send the request',
    description:
      'Select your dates and share the contact details needed for a direct follow-up.',
  },
  {
    title: 'Receive confirmation',
    description:
      'The team checks availability, confirms the handoff plan, and closes the booking details with you directly.',
  },
]

export const aboutPrinciples = [
  {
    title: 'Curated fleet',
    description:
      'The fleet stays deliberately selective so every listed car matches the premium standard shown on the site.',
  },
  {
    title: 'Visible daily rates',
    description:
      'Pricing is shown before the request starts so the decision feels clear, not negotiated in the dark.',
  },
  {
    title: 'Direct coordination',
    description:
      'Requests are handled by a person, which keeps pickup timing, resort logistics, and return details straightforward.',
  },
]

export const aboutStats = [
  {
    value: '15 min',
    label: 'Typical response during service hours',
  },
  {
    value: 'Daily',
    label: 'Visible rates across the active fleet',
  },
  {
    value: 'Premium',
    label: 'Curated cars prepared for resort and coastal travel',
  },
]

export const contactHighlights = [
  {
    title: 'Fastest route',
    detail: 'The quickest way to reach the team is through a booking request from the catalog or a specific car page.',
  },
  {
    title: 'Service hours',
    detail: 'Request review and pickup coordination are handled daily from 08:00 to 22:00 local time.',
  },
  {
    title: 'Pickup planning',
    detail: 'Airport arrivals, hotel delivery, and private handoff points are arranged after availability is confirmed.',
  },
]

export const termsSections = [
  {
    title: 'Booking and confirmation',
    items: [
      'Submitting a request does not charge the client or guarantee the car until the team confirms availability.',
      'MoRent may request document review or additional trip details before final confirmation.',
      'Handoff timing and return timing are fixed during the manual confirmation step.',
    ],
  },
  {
    title: 'Rates and payment',
    items: [
      'Displayed daily rates are indicative of the standard rental price for the listed car.',
      'Final pricing may reflect the confirmed rental period, delivery conditions, and any agreed add-ons.',
      'Payment timing and accepted methods are confirmed directly before handoff.',
    ],
  },
  {
    title: 'Use of the vehicle',
    items: [
      'The vehicle may only be used by the approved driver and within the agreed rental period.',
      'The client is responsible for returning the car in the agreed condition and following local driving regulations.',
      'Any incident, delay, or material issue must be reported as soon as possible during the rental period.',
    ],
  },
  {
    title: 'Changes and cancellations',
    items: [
      'Pickup changes should be requested as early as possible so the team can re-check the schedule.',
      'If the requested car becomes unavailable, MoRent may offer an alternative vehicle or timing.',
      'Cancellation handling is confirmed case by case according to the agreed booking terms.',
    ],
  },
]

export const privacySections = [
  {
    title: 'What we collect',
    items: [
      'Name, phone number, requested car, and requested rental dates submitted through the booking form.',
      'Technical request context needed to understand which page or vehicle generated the enquiry.',
    ],
  },
  {
    title: 'Why we collect it',
    items: [
      'To review availability, contact the client, and coordinate pickup or return details.',
      'To improve response workflows, page attribution, and future CRM integration.',
    ],
  },
  {
    title: 'How it is handled',
    items: [
      'Booking requests are stored on the service backend and reviewed by the operating team.',
      'Data is only used for request handling, operational follow-up, and related business processing.',
      'Reasonable security measures are applied to protect stored booking data.',
    ],
  },
  {
    title: 'Retention and requests',
    items: [
      'Data is retained for operational, legal, and service follow-up purposes only as long as necessary.',
      'Clients may request clarification or deletion review by contacting the business through the site workflow.',
    ],
  },
]

export const footerNavigation = {
  main: [
    { label: 'Home', to: '/' },
    { label: 'Fleet', to: '/catalog' },
    { label: 'How It Works', to: '/how-it-works' },
  ],
  company: [
    { label: 'About', to: '/about' },
    { label: 'Contacts', to: '/contacts' },
    { label: 'FAQ', to: '/faq' },
  ],
  legal: [
    { label: 'Terms', to: '/terms' },
    { label: 'Privacy', to: '/privacy' },
  ],
}

export const footerContext = {
  title: 'Premium coastal car rental with visible daily rates.',
  description:
    'MoRent keeps the booking path short: choose the car, see the day rate, and send the request for direct confirmation.',
}
