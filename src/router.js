/**
 * Routes are listed explicitly (rather than generated) because vite-ssg
 * prerenders exactly this list into static HTML files — so every deep link is
 * a real 200 on GitHub Pages instead of the 404.html fallback.
 */
export const routes = [
  { path: '/', name: 'home', component: () => import('./views/HomeView.vue') },
  { path: '/what-we-do', name: 'what-we-do', component: () => import('./views/WhatWeDoView.vue') },
  { path: '/platform', name: 'platform', component: () => import('./views/PlatformView.vue') },
  { path: '/platform/:slug', name: 'block', component: () => import('./views/BlockView.vue') },
  { path: '/case-studies', name: 'case-studies', component: () => import('./views/CaseStudiesView.vue') },
  { path: '/testimonials', name: 'testimonials', component: () => import('./views/TestimonialsView.vue') },
  { path: '/team', name: 'team', component: () => import('./views/TeamView.vue') },
  { path: '/news', name: 'news', component: () => import('./views/NewsView.vue') },
  { path: '/news/:slug', name: 'article', component: () => import('./views/ArticleView.vue') },
  { path: '/contact', name: 'contact', component: () => import('./views/ContactView.vue') },
  { path: '/cookie-policy', name: 'cookie-policy', component: () => import('./views/CookiePolicyView.vue') },
  { path: '/:pathMatch(.*)*', name: 'not-found', component: () => import('./views/NotFoundView.vue') }
]
