let auth = [{
  path: '/login',
  name: 'login',
  component: () => import('./login.vue'),
}, {
  path: '/organization',
  name: 'organization',
  component: () => import('./organization.vue'),
}];

export default auth;