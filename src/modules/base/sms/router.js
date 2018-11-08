const smsRouter = [
  {
    path: 'sms/account',
    component: () => import('./account/list.vue')
  }, {
    path: 'sms/template',
    component: () => import('./template/list.vue')
  }
];

export default smsRouter;