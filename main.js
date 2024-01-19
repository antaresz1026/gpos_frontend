import Vue from 'vue'
import store from './store'
Vue.prototype.$store = store
import './uni.promisify.adaptor'
import uView from '@/uni_modules/uview-ui'

Vue.use(uView)
App.mpType = 'app'

const app = new Vue({
  	store,
	...App
})

app.$mount()

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif