import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false
// 引入vuex 状态库
import store from "./store";
// 是否登录路由守卫挂到vue上面
import util from "./common/util.js"
// 设置http 
import http from './common/http/';
// 全局组件
import statusBar from './components/global/status_bar.vue';
import bottomInfo from './components/global/bottom_info.vue';

//设置baseUrl
// http.config.baseUrl = "http://10.90.131.120:7002";

// #ifdef MP-WEIXIN
http.config.baseUrl = "https://yymall.maiyidesan.cn";
// #endif
/* #ifdef APP-PLUS */
http.config.baseUrl = "https://yymall.maiyidesan.cn";
/* #endif */

// //设置请求前拦截器
// http.interceptor.request = (config) => {
//  //    // 添加通用参数
// 	// const _token = uni.getStorageSync('USER_TOKEN') || 'undefined';
//  //    config.header = {
//  //        'Content-Type':'application/json;charset=UTF-8',
// 	// 	'Authorization': _token
//  //    }
// }
// //设置请求结束后拦截器
// http.interceptor.response = (response) => {
//     //判断token是否合法
// 	const msg = response.data.data;
// 	if(msg === "token invalid") {
// 		// 表示使用了伪造token
// 		uni.navigateTo({
// 			url: "/pages/login/login"
// 		})
// 		
// 	} else if (msg === "token timeout" || msg === "not latest token;token timeout"){
// 		// 过期token，需要重定向到登录页面
// 		uni.navigateTo({
// 			url: "/pages/login/login"
// 		})
// 		// 重新刷新_token
// 		
// 		return
// 	} else if(msg === "not latest token") {
// 		response.data.data = "此账户已在别处登录";
// 		uni.navigateTo({
// 			url: "/pages/login/login"
// 		})
// 	} 
//     return response;
// }


// // 在main.js中注册全局组件
// import myloading from './components/loading/loading.vue'
// Vue.component('myloading',myloading) 

// 全局注册组件
Vue.component('statusBar',statusBar);
Vue.component('bottomInfo',bottomInfo);


App.mpType = 'app'
Vue.prototype.$store = store;
Vue.prototype.$http = http;
Vue.prototype.$guardToLogin = util.guardToLogin;
const app = new Vue({ 
	store,
	...App
})
app.$mount()
