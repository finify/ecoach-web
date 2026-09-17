/**
 * Detail pages for the 10 platform blocks.
 *
 * `intro` and `features` are taken verbatim from the corresponding walkthrough
 * page on e-coach.co.uk; `bullets` come from the block summaries on the old
 * home page. Prices match the live pricing builder. Nothing here is invented —
 * where the old site had no copy (the directory block), the bullets carry the
 * page on their own.
 */
export const blockPages = [
  {
    slug: 'learning-management-system',
    blockId: 'lxp',
    name: 'Learning Experience Platform',
    short: 'Learning Management System',
    price: 9500,
    popular: true,
    eyebrow: 'Comprehensive learning platform',
    intro: 'Embed SCORM content or use our rapid authoring tool to create engaging courses. Track detailed progress, generate in-depth reporting, and deliver webinars and face-to-face sessions with comprehensive tracking capabilities.',
    features: ['Sector Leading Learning Platform', 'Rapid Authoring Tool', 'Accessibility First', 'Template Library', 'Learning Score', 'Integrate Face to Face and Hybrid Training', 'AI-Powered Learning Intelligence', 'Adaptive Paths'],
    bullets: ['30+ sport-specific courses included', 'SCORM compatible with rapid authoring', 'Custom branding on every experience', 'Track face-to-face and classroom sessions'],
    image: 'media/product/lms.webp',
    imageW: 1100,
    imageH: 1256
  },
  {
    slug: 'membership-crm',
    blockId: 'crm',
    name: 'Membership & CRM',
    short: 'Membership Management',
    price: 8800,
    popular: true,
    eyebrow: 'Complete member administration',
    intro: 'Sell, track, and manage memberships with automated renewals, tiered pricing, gated resources, and flexible access controls.',
    features: ['Membership Sales', 'Access Control', 'Renewal Automation', 'Admin Reports', 'Member administration', 'Member facing profile and records'],
    bullets: ['Members, clubs, roles and benefits in one record', 'Automated renewals and eligibility checks', 'Tiered access control and gated resources', 'Comprehensive admin reporting'],
    image: 'media/product/membership.webp',
    imageW: 1100,
    imageH: 1036
  },
  {
    slug: 'compliance-credentials',
    blockId: 'compliance',
    name: 'Compliance & Credentials',
    short: 'Compliance Reporting',
    price: 4000,
    popular: true,
    eyebrow: 'Automated compliance management',
    intro: 'Streamline your compliance management with automated reporting, real-time tracking, and comprehensive audit trails.',
    features: ['Automated Compliance Reporting', 'Automated Reports', 'Real-time Tracking', 'Audit Trails', 'DBS Management', 'DBS Upload & Application', 'DBS Verification Dashboard'],
    bullets: ['DBS, safeguarding, policies and renewals', 'Automatic renewal alerts before expiry', 'Audit-ready evidence trail with timestamps', 'Board-level reporting at a glance'],
    image: 'media/product/compliance.webp',
    imageW: 1100,
    imageH: 1168
  },
  {
    slug: 'safeguarding-governance',
    blockId: 'safeguarding',
    name: 'Safeguarding & Governance',
    price: 3500,
    eyebrow: 'Workforce safety and accountability',
    intro: 'Keep every club, coach and volunteer compliant with one hub for safeguarding and governance. From logging training to tracking expiry and capturing policy acceptance — everything you need for peace of mind and audit readiness in one place.',
    features: ['Record training', 'Training records', 'Add policy', 'Record acceptance', 'Policy view', 'Governance & Diagnostic Tools'],
    bullets: ['Keep the workforce safe with incident logging, case workflows, policy renewals and approvals.', 'Everything is audit-ready with timestamps, evidence, and clear accountability.', 'Real-time dashboards surface risks early and simplify board reporting.']
  },
  {
    slug: 'volunteer-workforce-hub',
    blockId: 'volunteer',
    name: 'Volunteer & Workforce Hub',
    price: 3500,
    eyebrow: 'Recruit, match and retain',
    intro: 'Create dedicated Volunteer and Coach Boards where people publish rich profiles — skills, qualifications, availability, and location. Clubs post vacancies with clear requirements, and smart matching does the rest.',
    features: ['How it works', 'Volunteer & Coach Profiles', 'Club Vacancies', 'Smart Matches', 'Admin & compliance', 'HR Advert Checker'],
    bullets: ['Central hub for roles, qualifications and availability — plus a live volunteer and coaching job board.', 'Smart matching pairs people to club roles based on skills, interests, checks and location.', 'Automated onboarding and renewal reminders keep teams staffed, safe and compliant.']
  },
  {
    slug: 'facilities-bookings',
    blockId: 'facilities',
    name: 'Facilities & Bookings',
    price: 3500,
    eyebrow: 'Courts, pitches and rooms',
    intro: 'Hire out courts and leisure spaces on a club-by-club basis, set hourly costs and capacity, take bookings, and send automated confirmations and reminders.',
    features: ['Facility Booking', 'Resource Management', 'Reporting & Finance', 'Make a Booking', 'Available Courts'],
    bullets: ['Courts, pitches and rooms with live availability.', 'Payments and check-in handled in the same flow.', 'Built for clubs and governing bodies alike.']
  },
  {
    slug: 'events-competitions',
    blockId: 'events',
    name: 'Events & Competitions',
    price: 3500,
    eyebrow: 'Run the whole competition',
    intro: 'Arrange tournaments and competitions, auto-seed schedules, and set qualification standards that update as results arrive. One workspace for organisers, clubs and athletes.',
    features: ['Tournament Builder', 'Smart Scheduling', 'Qualification Matrix', 'Schedule'],
    bullets: ['Run registrations, payments and waivers in one place.', 'Seed, schedule and score with leaderboards and live results.', 'Export draws and reports in a click — great for officials and comms.']
  },
  {
    slug: 'engagement-hub',
    blockId: 'engagement',
    name: 'Engagement Hub',
    price: 3500,
    eyebrow: 'Reach every audience',
    intro: 'Bring every channel into one place to drive action and continuously improve with live analytics and optimisation.',
    features: ['Engagement Hub', 'Insights & Optimisation'],
    bullets: ['Targeted messaging, forums and surveys to reach every audience.', 'Segment by role, club or programme for higher open and action rates.', 'Feedback loops turn insight into continuous improvement.']
  },
  {
    slug: 'clubs-venues-directory',
    blockId: 'directory',
    name: 'Clubs & Venues Directory',
    price: 3500,
    eyebrow: 'Discovery and accessibility',
    intro: 'Clubs create rich, self-managed profiles so prospective members can find the right place to play — including the accessibility detail most directories leave out.',
    features: [],
    bullets: ['Clubs create rich, self-managed profiles with photos, key info, and accessibility images (entrances, parking, routes).', 'Prospects filter by location, sport, facilities, and accessibility to find the right club fast.', 'Clean, searchable cards boost discovery and cut admin, keeping details accurate and current.']
  },
  {
    slug: 'content-library',
    blockId: 'library',
    name: 'Content Library',
    short: 'Courses & Webinars',
    price: 3500,
    eyebrow: 'Courses and webinars',
    intro: 'From equality and diversity to mental health and governance, our comprehensive library covers essential topics for modern sports organisations.',
    features: [],
    bullets: ['Full access to over 30 high-quality sports courses and quarterly webinars.', 'Easily add weight and depth to your e-learning offer and create training pathways.', 'Branded experiences that work on any device — ready to launch fast.'],
    showCourses: true
  }
]

export const blockBySlug = (slug) => blockPages.find((b) => b.slug === slug)
