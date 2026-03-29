const en = {
  common: {
    pricing: {
      perDay: '/ day',
    },
    status: {
      available: 'Available',
      booked: 'Booked',
    },
    actions: {
      bookNow: 'Book now',
      checkAvailability: 'Check availability',
      viewFleet: 'View the fleet',
      viewAllCars: 'View all cars',
      openFleet: 'Open the fleet',
      openFullFaq: 'Open the full FAQ',
      readFaq: 'Read the FAQ',
      contactDetails: 'Contact details',
      serviceDetails: 'Service details',
      howItWorks: 'How it works',
      howBookingWorks: 'How booking works',
      rentalTerms: 'Rental terms',
      privacyPolicy: 'Privacy policy',
      startRequest: 'Start a request',
      backToCatalog: 'Back to catalog',
      backToFleet: 'Back to the fleet',
      returnHome: 'Return home',
    },
    labels: {
      toBeConfirmed: 'To be confirmed',
      carsAvailable: '{{count}} cars available right now.',
    },
    errors: {
      featuredCars: 'Unable to load featured cars.',
      catalog: 'Unable to load the catalog.',
      car: 'Unable to load this car.',
      carNotFound: 'Car not found.',
      booking: 'Unable to submit the booking right now.',
      contact: 'Unable to send the contact request right now.',
    },
    aria: {
      viewCarAvailability: 'View availability for {{carName}}',
      viewCarPhoto: 'View {{carName}} photo {{index}}',
    },
  },
  nav: {
    navigate: 'Navigate',
    primaryLabel: 'Primary',
    mobilePrimaryLabel: 'Mobile primary',
    openMenu: 'Open navigation menu',
    closeMenu: 'Close navigation menu',
    switcherLabel: 'Language',
    languages: {
      en: 'EN',
      ru: 'RU',
    },
    links: [
      { label: 'Home', to: '/', end: true },
      { label: 'Fleet', to: '/catalog' },
      { label: 'How It Works', to: '/how-it-works' },
      { label: 'About', to: '/about' },
      { label: 'Contacts', to: '/contacts' },
    ],
    mobileExtraLinks: [
      { label: 'FAQ', to: '/faq' },
      { label: 'Book now', to: '/catalog' },
    ],
  },
  footer: {
    title: 'Premium coastal car rental with visible daily rates.',
    requestCar: 'Request a car',
    serviceDetails: 'Service details',
    groups: {
      explore: 'Explore',
      company: 'Company',
      legal: 'Legal',
    },
    navigation: {
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
    },
    context:
      'Coastal service area with resort, hotel, and airport pickup by arrangement.',
    copyright: '© {{year}} MoRent. All rights reserved.',
  },
  cars: {
    bmwX5: {
      description:
        'Premium SUV for business trips, city driving, and long-distance comfort.',
    },
    mercedesEClass: {
      description:
        'Executive sedan with a smooth ride, refined interior, and strong road presence.',
    },
    porscheCayenne: {
      description:
        'Luxury performance SUV for customers who want comfort and dynamic handling.',
    },
  },
  home: {
    hero: {
      title: 'Premium coastal car rental with visible rates and a fast booking path.',
      description:
        'Choose the car, check the day rate, and send the request before pickup.',
    },
    signal: {
      title: 'A grand tourer in motion.',
    },
    featured: {
      title: 'Check availability for the cars booked first.',
      description: 'Open any car and move straight into dates.',
      moreOptions: 'Need more options? Open the full fleet.',
    },
    destination: {
      title: 'Seafront light. Calm pickup. Premium cars ready for the coast.',
      description:
        'Resort calm, direct booking, and a clean handoff from arrival to the road.',
      imageAlt: 'Seafront coastal road with calm sunset light',
    },
    benefits: {
      title: 'See the car. Trust the rate. Send the request.',
      description: 'Exact fleet, readable day rates, direct confirmation.',
      processItems: [
        {
          title: 'See the car.',
          description: 'Open the fleet and inspect the exact car first.',
          href: '#featured-cars',
          tone: 'fleet',
        },
        {
          title: 'Trust the rate.',
          description: 'Read the day rate before the request starts.',
          href: '#rate-clarity',
          tone: 'pricing',
        },
        {
          title: 'Send the request.',
          description: 'Choose the dates and send confirmation in minutes.',
          href: '#booking-path',
          tone: 'signal',
        },
      ],
    },
    faqPreview: {
      title: 'Answers before the request starts.',
      description:
        'Clear terms, visible rates, and a short review flow keep the booking path readable.',
      moreDetails: 'Need the full detail set before you choose the car?',
    },
    closing: {
      title: 'Choose the dates. We confirm the rest.',
      description: 'Pick the car, choose the dates, send the request.',
      steps: ['Choose the car', 'Check the dates', 'Send the request'],
    },
  },
  catalog: {
    title: 'Premium fleet with visible daily rates.',
    description:
      'Choose the car first, review the daily rate, and move into the request only when the timing works for the trip.',
    visuals: {
      primaryAlt: 'Premium coastal highway for resort arrivals and scenic drives',
      primaryCaption: 'Coastal arrival routes planned around your pickup',
    },
    infoCards: [
      {
        title: 'Visible pricing',
        description: 'Daily rates stay clear before the request starts.',
      },
      {
        title: 'Fast review',
        description:
          'Most requests are checked within about 15 minutes during service hours.',
      },
      {
        title: 'Pickup support',
        description:
          'Hotel, airport, and private handoff points are agreed after confirmation.',
      },
    ],
  },
  carPage: {
    loading: {
      title: 'Premium Rental Car Details | MoRent',
      description:
        'Open the premium MoRent fleet, review car details, and send a direct booking request.',
    },
    notFound: {
      title: 'Car Not Found | MoRent',
      description:
        'The requested car could not be loaded. Browse the active premium fleet instead.',
    },
    supportCards: [
      {
        title: 'What happens after the request?',
        description:
          'The team reviews availability, confirms the timing, and arranges the pickup details directly.',
      },
      {
        title: 'Need the booking details first?',
        description: 'Review the booking flow and FAQ before you submit the dates.',
      },
    ],
  },
  bookingForm: {
    title: 'Check availability for {{carName}}',
    description:
      'Send your dates and contact details. No payment is required to request the car.',
    fields: {
      name: 'Full name',
      namePlaceholder: 'Your name',
      phone: 'Phone',
      phonePlaceholder: '+7 999 123 45 67',
      startDate: 'Start date',
      endDate: 'End date',
    },
    validation: {
      nameRequired: 'Enter the driver name.',
      nameShort: 'Name looks too short.',
      phoneRequired: 'Enter a phone number.',
      phoneShort: 'Use at least 10 digits for contact.',
      startDateRequired: 'Choose a start date.',
      endDateRequired: 'Choose an end date.',
      endDateAfterStart: 'End date must be after the start date.',
    },
    feedback: {
      reviewTitle: 'Please review the form',
      reviewMessage:
        'A few fields still need attention before we can check availability.',
      requestErrorTitle: 'Unable to send the request',
    },
    submitLoading: 'Checking...',
    submitIdle: 'Book now',
    note:
      'Prefer to decide first? The request only checks availability and starts the manager callback.',
  },
  contactForm: {
    title: 'Send a consultation or support request',
    description:
      'Choose the inquiry type, leave the contact details you want us to use, and add the context needed for a direct reply.',
    intents: {
      contact_request: 'Consultation request',
      support_request: 'Support question',
    },
    contactMethods: {
      phone: 'Phone call',
      email: 'Email',
      whatsapp: 'WhatsApp',
      telegram: 'Telegram',
    },
    fields: {
      name: 'Full name',
      namePlaceholder: 'Your name',
      phone: 'Phone',
      phonePlaceholder: '+7 999 123 45 67',
      email: 'Email',
      emailPlaceholder: 'you@example.com',
      requestType: 'Inquiry type',
      preferredContactMethod: 'Preferred reply channel',
      preferredContactMethodPlaceholder: 'Choose if you have a preference',
      message: 'Message',
      messagePlaceholder:
        'Tell the team what you need help with, which route you plan, or what should be confirmed first.',
    },
    validation: {
      nameRequired: 'Enter your name.',
      nameShort: 'Name looks too short.',
      contactRequired: 'Add a phone number or email address.',
      phoneShort: 'Use at least 10 digits for phone follow-up.',
      emailInvalid: 'Enter a valid email address.',
      messageRequired: 'Add a short message for the team.',
      messageShort: 'Add a little more context so the team can reply cleanly.',
      preferredMethodNeedsEmail: 'Add an email address for email follow-up.',
      preferredMethodNeedsPhone: 'Add a phone number for the selected contact method.',
    },
    feedback: {
      reviewTitle: 'Please review the contact request',
      reviewMessage:
        'A few details still need attention before the team can follow up.',
      successTitle: 'Request received',
      successMessage:
        'The contact request has been saved and is ready for a direct follow-up.',
      requestErrorTitle: 'Unable to send the contact request',
    },
    submitIdle: 'Send request',
    submitLoading: 'Sending...',
    note:
      'Ready to book a specific car already? Use the fleet and car pages for the fastest booking path.',
  },
  about: {
    eyebrow: 'About MoRent',
    title: 'Premium coastal car rental designed to feel calm, clear, and direct.',
    description:
      'MoRent is built around a short decision path: visible daily rates, a curated fleet, and direct request handling for resort arrivals, hotel delivery, and private pickup coordination.',
    visuals: {
      primaryAlt: 'Sunset coastal road matching the MoRent premium travel mood',
      primaryCaption: 'Calm travel mood, premium fleet, direct handoff',
    },
    stats: [
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
    ],
    sectionTitle: 'Why the service feels different',
    sectionDescription:
      'The business is structured around fewer cars, clearer pricing, and a manual handoff process that protects the premium experience.',
    principles: [
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
    ],
    ctaTitle: 'Ready to choose the car?',
    ctaDescription:
      'The fleet stays concise on purpose. Open the catalog and send the request when the timing feels right.',
  },
  contacts: {
    eyebrow: 'Contacts',
    title: 'Contact the team and plan the request with the right pickup context.',
    description:
      'The site is the main booking channel. Once the request is in, the team follows up directly to confirm availability, pickup timing, and the handoff point.',
    visuals: {
      primaryAlt:
        'Premium arrival forecourt for airport and hotel pickup coordination',
      primaryCaption: 'Airport and hotel pickup agreed after review',
    },
    summary: [
      {
        label: 'Primary channel',
        value: 'Online booking request',
      },
      {
        label: 'Service hours',
        value: 'Daily, 08:00 to 22:00',
      },
      {
        label: 'Coverage',
        value: 'Resort, hotel, airport, and private pickup by arrangement',
      },
    ],
    highlights: [
      {
        title: 'Fastest route',
        detail:
          'The quickest way to reach the team is through a booking request from the catalog or a specific car page.',
      },
      {
        title: 'Service hours',
        detail:
          'Request review and pickup coordination are handled daily from 08:00 to 22:00 local time.',
      },
      {
        title: 'Pickup planning',
        detail:
          'Airport arrivals, hotel delivery, and private handoff points are arranged after availability is confirmed.',
      },
    ],
    ctaTitle: 'Need the fastest response?',
    ctaDescription:
      'Open the fleet, choose the car, and send the dates. That gives the team the context needed to confirm the request quickly.',
    entrySectionTitle: 'Choose the right entry point',
    entrySectionDescription:
      'Use the booking flow when dates are ready, or send a cleaner consultation or support request when you need guidance first.',
    entryCards: [
      {
        intent: 'booking',
        title: 'Booking request',
        description:
          'Choose the car, set the dates, and move straight into the booking path.',
        actionLabel: 'Open the fleet',
      },
      {
        intent: 'contact_request',
        title: 'Consultation request',
        description:
          'Use this when you need help choosing the right car, pickup format, or service fit.',
        actionLabel: 'Request consultation',
      },
      {
        intent: 'support_request',
        title: 'Support question',
        description:
          'Use this for document questions, request follow-up, or service details before confirmation.',
        actionLabel: 'Send support question',
      },
    ],
    channelsTitle: 'Direct business channels',
    channelsDescription:
      'When configured, direct phone, email, and messenger links stay available alongside the booking path.',
    channelLabels: {
      phone: 'Phone',
      email: 'Email',
      whatsapp: 'WhatsApp',
      telegram: 'Telegram',
    },
    formSectionTitle: 'Contact the team cleanly',
    formSectionDescription:
      'This form is for consultation and support questions. Booking requests with dates still move fastest through the fleet.',
  },
  faq: {
    eyebrow: 'FAQ',
    title: 'Questions people ask before they send the request.',
    description:
      'This page keeps the booking path readable: how requests work, what gets confirmed first, and what to expect after submission.',
    visuals: {
      primaryAlt: 'Premium interior image supporting comfort and service clarity',
      primaryCaption: 'Clear answers before the booking starts',
      secondaryAlt:
        'Coastal arrival route reinforcing the premium travel context',
      secondaryCaption: 'Questions answered before arrival and pickup',
    },
    items: [
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
    ],
    ctaTitle: 'Ready to move from answers to availability?',
    ctaDescription:
      'Open the fleet and send the request when the car and dates look right.',
  },
  howItWorks: {
    eyebrow: 'How It Works',
    title: 'A short booking path built for premium trips, not admin.',
    description:
      'MoRent keeps the process intentionally simple so the client sees the fleet, understands the rate, and reaches a confirmed handoff without extra steps.',
    visuals: {
      primaryAlt:
        'Scenic coastal road representing the route from request to drive',
      primaryCaption: 'Short request path, premium drive, direct confirmation',
    },
    steps: [
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
    ],
    highlights: [
      {
        title: 'Visible rates first',
        description:
          'The daily rate is shown before the request starts, which keeps the decision clear and commercially honest.',
      },
      {
        title: 'No payment at request stage',
        description:
          'The online request is an availability check and booking signal. Final payment handling happens only after manual confirmation.',
      },
      {
        title: 'Pickup arranged after review',
        description:
          'Airport arrival, hotel delivery, and private pickup details are agreed once the requested car and dates are confirmed.',
      },
    ],
    ctaTitle: 'Ready to start the request?',
    ctaDescription:
      'Open the fleet and move straight into the car that fits the trip.',
    ctaFaq: 'Booking questions',
  },
  terms: {
    eyebrow: 'Terms',
    title: 'Rental terms and legal information for MoRent requests.',
    description:
      'This summary explains how booking requests, pricing review, vehicle use, and booking changes are handled before a confirmed rental begins.',
    visuals: {
      primaryAlt:
        'Premium coastal landscape used to frame legal and booking context',
      primaryCaption: 'Clear operating terms before confirmation',
      secondaryAlt: 'Coastal road matching the MoRent driving context',
      secondaryCaption: 'Rates, vehicle use, and timing explained clearly',
    },
    sections: [
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
    ],
    ctaTitle: 'Need the practical side of the process?',
    ctaDescription:
      'The FAQ and booking flow explain what happens before handoff, while privacy handling is described separately.',
  },
  privacy: {
    eyebrow: 'Privacy',
    title: 'Privacy policy for booking requests and service follow-up.',
    description:
      'MoRent keeps personal data collection focused on what is needed to review availability, confirm the request, and manage future operational workflows.',
    visuals: {
      primaryAlt:
        'Premium car interior supporting privacy and request-handling context',
      primaryCaption: 'Only the details needed to review the request',
      secondaryAlt:
        'Arrival setting linked to service follow-up and request handling',
      secondaryCaption:
        'Operational follow-up stays tied to the booking journey',
    },
    sections: [
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
    ],
    ctaTitle: 'Continue with the booking path',
    ctaDescription:
      'When you are ready, open the fleet and send the request with the dates you want reviewed.',
  },
  requestReceived: {
    eyebrow: 'Request received',
    title: 'Your request is in. We will review the availability next.',
    descriptionWithCar: '{{carName}} has been added to the request queue.',
    descriptionWithoutCar:
      'The booking request has been saved and sent to the team for review.',
    descriptionEnd: 'No payment is taken at this stage.',
    visuals: {
      primaryAlt:
        'Arrival forecourt visual reinforcing the booking confirmation mood',
      primaryCaption:
        'The team reviews timing, car, and pickup context next',
      secondaryAlt:
        'Calm coastal road representing the next step after confirmation',
      secondaryCaption:
        'Once confirmed, the trip moves from request to handoff',
    },
    dates: {
      start: 'Requested start',
      end: 'Requested end',
    },
    steps: [
      {
        title: '1. Review',
        description: 'The team checks the car, timing, and pickup context.',
      },
      {
        title: '2. Confirmation',
        description:
          'You receive the next-step message with the final handoff plan.',
      },
    ],
  },
  metadata: {
    default: {
      title: 'MoRent | Premium Car Rental',
      description:
        'Explore premium car rental with a curated fleet, visible daily rates, and a direct booking request flow.',
    },
    organizationDescription:
      'Premium coastal car rental with visible daily rates and direct booking requests.',
    pages: {
      home: {
        title: 'MoRent | Premium Coastal Car Rental With Visible Daily Rates',
        description:
          'Discover premium coastal car rental with visible daily rates, a curated fleet, and a fast request flow for resort, hotel, and airport pickup.',
      },
      catalog: {
        title: 'Fleet | Premium Coastal Rental Cars With Visible Rates | MoRent',
        description:
          'Browse the MoRent fleet, compare visible daily rates, and request premium cars for coastal, resort, and airport pickup plans.',
      },
      howItWorks: {
        title: 'How Booking Works | Fast Premium Car Request Flow | MoRent',
        description:
          'See how MoRent booking requests work, from choosing the car and dates to direct confirmation and coordinated pickup.',
      },
      about: {
        title: 'About MoRent | Premium Coastal Car Rental',
        description:
          'Learn how MoRent approaches premium coastal car rental with a curated fleet, visible rates, and direct request handling.',
      },
      contacts: {
        title: 'Contacts | Coastal Pickup and Booking Support | MoRent',
        description:
          'Find MoRent service details, booking support information, service hours, and pickup coordination guidance for your request.',
      },
      faq: {
        title: 'FAQ | Premium Car Rental Questions Answered | MoRent',
        description:
          'Read concise answers about booking, visible daily rates, confirmation timing, pickup arrangement, and required documents.',
      },
      terms: {
        title: 'Terms and Legal Information | MoRent',
        description:
          'Review MoRent rental terms, booking confirmation notes, pricing guidance, vehicle use rules, and cancellation principles.',
      },
      privacy: {
        title: 'Privacy Policy | Booking Request Data Handling | MoRent',
        description:
          'Understand how MoRent handles booking request data, service follow-up, and operational information used for enquiries.',
      },
      requestReceived: {
        title: 'Request Received | MoRent',
        description:
          'Your booking request has been received and is being reviewed by the MoRent team.',
      },
      carLoading: {
        title: 'Premium Rental Car Details | MoRent',
        description:
          'Open the premium MoRent fleet, review car details, and send a direct booking request.',
      },
      carNotFound: {
        title: 'Car Not Found | MoRent',
        description:
          'The requested car could not be loaded. Browse the active premium fleet instead.',
      },
      car: {
        title: '{{carName}} | Premium Rental Car | MoRent',
        fallbackDescription:
          'View {{carName}}, review the daily rate, and send a direct booking request with MoRent.',
        structuredFallbackDescription:
          'Premium rental car available through the MoRent booking request flow.',
      },
    },
  },
}

export default en
