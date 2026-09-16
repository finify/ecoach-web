/**
 * Sports icons for the drifting/orbiting system.
 *
 * Stroke-drawn on a 24x24 grid at a uniform 1.6 weight so they read as one
 * family and echo the chalk markings on the eCoach tactics-board mark. All
 * geometry is authored here — nothing comes from user input — so rendering
 * these with v-html is safe.
 */
export const sportIcons = [
  {
    id: 'football',
    label: 'Football',
    svg: `<circle cx="12" cy="12" r="9"/>
          <path d="M12 7.2l4.4 3.2-1.7 5.2H9.3L7.6 10.4z"/>
          <path d="M12 3v4.2M20.6 9.6l-4.2.8M17.9 19.1l-3.2-3.5M6.1 19.1l3.2-3.5M3.4 9.6l4.2.8"/>`
  },
  {
    id: 'tennis',
    label: 'Tennis',
    svg: `<ellipse cx="9.8" cy="9" rx="6.2" ry="7"/>
          <path d="M13.6 14.2L19.5 21"/>
          <path d="M5.2 8h9.2M5.2 11.4h9.2M8.4 2.4v13.2M11.6 2.4v13.2"/>`
  },
  {
    id: 'rugby',
    label: 'Rugby',
    svg: `<ellipse cx="12" cy="12" rx="9.2" ry="5.6" transform="rotate(-45 12 12)"/>
          <path d="M9.2 14.8l5.6-5.6M10.4 11.8l1.8 1.8M12.2 10l1.8 1.8"/>`
  },
  {
    id: 'basketball',
    label: 'Basketball',
    svg: `<circle cx="12" cy="12" r="9"/>
          <path d="M12 3v18M3 12h18"/>
          <path d="M5.6 5.6c3.6 3.2 3.6 9.6 0 12.8M18.4 5.6c-3.6 3.2-3.6 9.6 0 12.8"/>`
  },
  {
    id: 'hockey',
    label: 'Hockey',
    svg: `<path d="M6.5 3v9.5c0 2.3 1.8 4 4 4h4.5"/>
          <path d="M15 16.5l4-2.5"/>
          <ellipse cx="5.5" cy="19.5" rx="3" ry="1.6"/>`
  },
  {
    id: 'whistle',
    label: 'Coaching',
    svg: `<circle cx="8" cy="13.5" r="5.5"/>
          <path d="M13.4 12.2h6.2a1.4 1.4 0 0 0 1.4-1.4V8.6H13"/>
          <path d="M9 5.2h5"/>`
  },
  {
    id: 'stopwatch',
    label: 'Timing',
    svg: `<circle cx="12" cy="13.8" r="7.6"/>
          <path d="M12 9.8v4.2l2.6 1.8"/>
          <path d="M9.4 2.2h5.2M12 2.2v3.8M19.2 6.4l1.6-1.6"/>`
  },
  {
    id: 'trophy',
    label: 'Competition',
    svg: `<path d="M7 3.6h10v5.2a5 5 0 0 1-10 0z"/>
          <path d="M7 5.6H4.4a2.6 2.6 0 0 0 2.6 2.8M17 5.6h2.6a2.6 2.6 0 0 1-2.6 2.8"/>
          <path d="M12 13.8v3.4M8.6 20.6h6.8M10 17.2h4v3.4h-4z"/>`
  },
  {
    id: 'cycling',
    label: 'Cycling',
    svg: `<circle cx="5.4" cy="16.8" r="3.8"/><circle cx="18.6" cy="16.8" r="3.8"/>
          <path d="M5.4 16.8l4.4-8.4h5.4M9.8 8.4h5.4l3.4 8.4M12 16.8l3-8.4"/>
          <circle cx="15.4" cy="4.4" r="1.4"/>`
  },
  {
    id: 'swimming',
    label: 'Swimming',
    svg: `<circle cx="15.6" cy="6.6" r="2.2"/>
          <path d="M20.6 11.4l-6.2-2.8-4.4 3.2"/>
          <path d="M2.4 16.2c2.4-1.9 4.4-1.9 6.8 0s4.4 1.9 6.8 0 4.4-1.9 5.6 0"/>
          <path d="M2.4 20.4c2.4-1.9 4.4-1.9 6.8 0s4.4 1.9 6.8 0 4.4-1.9 5.6 0"/>`
  }
]
