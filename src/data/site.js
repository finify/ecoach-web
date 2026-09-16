/**
 * Content lifted from the live e-coach.co.uk site (copy, pricing, stats,
 * testimonial and client list), restructured for the 2026 rebrand.
 */

// Vite rewrites BASE_URL at build time, so assets resolve both on a local
// dev server ('/') and under a GitHub Pages project path ('/<repo>/').
export const asset = (path) => `${import.meta.env.BASE_URL}${path}`.replace(/\/{2,}/g, '/')

export const nav = [
  { label: 'Platform', href: '#platform' },
  { label: 'Blocks', href: '#blocks' },
  { label: 'Pricing', href: '#builder' },
  { label: 'Customers', href: '#customers' }
]

export const hero = {
  eyebrow: "UK's #1 digital platform for sport",
  title: ['The all-in-one platform', 'for sport'],
  titleAccent: 'Learning, compliance & membership.',
  body: 'Deliver courses, track DBS and safeguarding, and maintain accurate member records — all in one sport-ready platform. Log offline training, see progress at a glance and stay audit-ready with real-time dashboards.',
  note: 'Trusted by 50+ organisations across sport — from national governing bodies to grassroots clubs.'
}

export const stats = [
  { value: 50, suffix: '+', label: 'Organisations', note: 'NGBs to grassroots clubs' },
  { value: 30, suffix: '+', label: 'Sport courses', note: 'Built with subject experts' },
  { value: 75, suffix: '%', label: 'Average saving', note: 'Against per-user competitors' }
]

export const clients = [
  { name: 'sportscotland', file: 'sportscotland' },
  { name: 'Football Association of Wales', file: 'faw' },
  { name: 'Scottish FA', file: 'scottishfa' },
  { name: 'England Rugby', file: 'englandrugby' },
  { name: 'Irish FA', file: 'irishfa' },
  { name: 'England Squash', file: 'englandsquash' },
  { name: 'England Hockey', file: 'englandhockey' },
  { name: 'Volleyball England', file: 'volleyballengland' },
  { name: 'BIS', file: 'bis' },
  { name: 'Surfing England', file: 'surfingengland' },
  { name: 'Wales Netball', file: 'walesnetball' },
  { name: 'Sport NI', file: 'sportni' },
  { name: 'Get Ireland Walking', file: 'getirelandwalking' },
  { name: 'SRA', file: 'sra' },
  { name: 'Sport Wales', file: 'sportwales' }
]

/** The three flagship blocks, each with a real product screenshot. */
export const pillars = [
  {
    id: 'lms',
    eyebrow: 'Comprehensive learning platform',
    title: 'Learning Management System',
    body: 'Our flagship LMS includes access to 30+ sport-specific courses with advanced tracking, SCORM support and custom branding. Create engaging learning experiences through gamification and a mobile-friendly interface.',
    features: ['30+ sport courses', 'SCORM compatible', 'Custom branding', 'Track face-to-face and classroom sessions'],
    image: 'media/product/lms.webp',
    // Intrinsic size: lets the browser reserve the box before the image
    // loads, so the section does not grow and shift every ScrollTrigger
    // measurement below it.
    w: 1100,
    h: 1256
  },
  {
    id: 'compliance',
    eyebrow: 'Automated compliance management',
    title: 'Compliance Reporting',
    body: 'Maintain 100% compliance with automated tracking, renewal alerts and comprehensive reporting. DBS management, training compliance and audit-ready documentation.',
    features: ['DBS & safeguarding tracking', 'Automatic renewal alerts', 'Audit-ready evidence trail', 'Board-level reporting'],
    image: 'media/product/compliance.webp',
    // Intrinsic size: lets the browser reserve the box before the image
    // loads, so the section does not grow and shift every ScrollTrigger
    // measurement below it.
    w: 1100,
    h: 1168
  },
  {
    id: 'membership',
    eyebrow: 'Complete member administration',
    title: 'Membership Management',
    body: 'Sell, track and manage memberships with automated renewals. Tiered access controls, member profiles and comprehensive admin tools for sports organisations.',
    features: ['Automated renewals', 'Tiered access control', 'Rich member profiles', 'Club & role hierarchies'],
    image: 'media/product/membership.webp',
    // Intrinsic size: lets the browser reserve the box before the image
    // loads, so the section does not grow and shift every ScrollTrigger
    // measurement below it.
    w: 1100,
    h: 1036
  }
]

/**
 * The 10 blocks, with the list prices shown on the live pricing builder.
 * `popular` mirrors the POPULAR flag on the current site.
 */
export const blocks = [
  { id: 'lxp', name: 'Learning Experience Platform', price: 9500, popular: true, body: 'Deliver, track and brand sport-ready learning. SCORM/xAPI, CPD, pathways.' },
  { id: 'crm', name: 'Membership & CRM', price: 8800, popular: true, body: 'Members, clubs, roles & benefits with renewals and eligibility checks.' },
  { id: 'compliance', name: 'Compliance & Credentials', price: 4000, popular: true, body: 'DBS, safeguarding, policies & renewals — always audit-ready.' },
  { id: 'safeguarding', name: 'Safeguarding & Governance', price: 3500, body: 'Training records, incident logging, workflows & audit trails.' },
  { id: 'volunteer', name: 'Volunteer & Workforce Hub', price: 3500, body: 'Roles, quals & HR matrix with renewal automation.' },
  { id: 'facilities', name: 'Facilities & Bookings', price: 3500, body: 'Courts, pitches, rooms — availability, payments, check-in.' },
  { id: 'events', name: 'Events & Competitions', price: 3500, body: 'Tournaments, meets & registrations with leaderboards.' },
  { id: 'engagement', name: 'Engagement Hub', price: 3500, body: 'Messaging, social, forums & surveys — reach every audience.' },
  { id: 'directory', name: 'Clubs & Venues Directory', price: 3500, body: 'Find clubs & accessibility info with venue images to plan ahead.' },
  { id: 'library', name: 'Content Library', price: 3500, body: 'Access curated sport courses & webinars.' }
]

export const testimonial = {
  quote: 'The team at e-coach have been great to work with and have been incredibly responsive and adaptive to our changing needs. They have gone above and beyond in the partnership so far to support us getting through to implementation.',
  name: 'Mairi McGauhlin',
  org: 'sportscotland'
}

export const ecosystem = [
  { title: 'Safeguarding & Governance Manager', lines: ['Keep the workforce safe with incident logging, case workflows, policy renewals and approvals.', 'Everything is audit-ready with timestamps, evidence, and clear accountability.', 'Real-time dashboards surface risks early and simplify board reporting.'] },
  { title: 'Volunteer & Workforce Hub', lines: ['Central hub for roles, qualifications and availability — plus a live volunteer and coaching job board.', 'Smart matching pairs people to club roles based on skills, interests, checks and location.', 'Automated onboarding and renewal reminders keep teams staffed, safe and compliant.'] },
  { title: 'Clubs & Venues Directory', lines: ['Clubs create rich, self-managed profiles with photos, key info, and accessibility images.', 'Prospects filter by location, sport, facilities and accessibility to find the right club fast.', 'Clean, searchable cards boost discovery and cut admin, keeping details accurate and current.'] },
  { title: 'Events & Competitions', lines: ['Run registrations, payments and waivers in one place.', 'Seed, schedule and score with leaderboards and live results.', 'Export draws and reports in a click — great for officials and comms.'] },
  { title: 'Engagement Hub', lines: ['Targeted messaging, forums and surveys to reach every audience.', 'Segment by role, club or programme for higher open and action rates.', 'Feedback loops turn insight into continuous improvement.'] },
  { title: 'Content Library', lines: ['Full access to over 30 high-quality sports courses and quarterly webinars.', 'Easily add weight and depth to your e-learning offer and create training pathways.', 'Branded experiences that work on any device — ready to launch fast.'] }
]
