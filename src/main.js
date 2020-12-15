import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify';
Vue.config.productionTip = false;
/*
import GAuth from 'vue-google-oauth2'
const gauthOption = {
  clientId: 'CLIENT_ID.apps.googleusercontent.com',
  scope: 'profile email',
  prompt: 'select_account'
}
Vue.use(GAuth, gauthOption)
*/
export const bus = new Vue();
new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
