import Vue from 'vue';
import Vuex from 'vuex';
import footer_store from "./modules/footer_store.js";
import shopCart_store from "./modules/shopCart_store.js";
import address_store from "./modules/address_store.js";
import orderList_store from "./modules/orderList_store.js";
import prod_view_store from "./modules/prod_view_store.js";
Vue.use(Vuex);

const store = new Vuex.Store({
	state: {
		// 是否强制登录
		forcedLogin: false,
		// 是否已经登录
		hasLogin: true,
		// 用户名
		userName: "秦佩",
		// 用户等级，分为0,1,2,3,4五个等级
		userLevel: 2,
		// 用户id
		userId: "293a8598-739b-4653-9e73-eb869f2b6bdb",
		// 用户头像
		userFace: "",
		// 用户手机号
		userPhone: "15652581188",
		// 用户的邀请码
		userInviteCode: '',
		// 商品积分率
		gobalPointRate: 0,
		// 客服电话
		customerTelephone: "",
		// 图片地址域名
		imageDomain: "",
		// 是否校验用户二级密码
		isCheckPassword: false,
		// 用户二级密码
		secondaryPwd: null,
		// 全局的自定义标题栏的样式
		titleNView: Object.freeze({
			bg: '#242424',
			textColor: '#fff'
		})	
	},
	mutations: {
		// 登录动作
		
		LOGIN(state, data) {
		    state.userName = data.userName || 'PY_'+ data.phone;
			state.userLevel = data.tuser.role;
			state.userId = data.tuser.id;
			state.userFace = data.tuser.face || '/static/HM-PersonalCenter/face_default.png';
			state.userPhone = data.tuser.phone;
			state.userInviteCode = data.tuser.parentCode;
			state.secondaryPwd = data.tuser.secondaryPwd;
		    state.hasLogin = true;
		},
		// 后台相关配置
		SET_CONFIGS(state, data){
			state.gobalPointRate = data.DEFAULT_GOODS_POINTRATE;
			state.imageDomain = data.DEFAULT_IMAGE_DOMAIN;
			state.customerTelephone = data.customer_Telephone || "400334233"
		},
		// 退出登录
		LOGOUT(state) {  
            state.userName = "";
            state.userLevel = 0;
            state.userId = "";
            state.userFace = "";
            state.userPhone = "";
            state.userInviteCode = "";
            state.hasLogin = false; 
			// 情况缓存信息
			uni.removeStorageSync('USERS_INFO');
			uni.removeStorageSync('USER_TOKEN');
        },
		// 设置密码校验状态
		SET_PASSWORD_CHECKSTATUS(state, status) {
			state.isCheckPassword = status;
		},
		// 存储用户二级密码
		SET_SECONDARYPWD(state, pwd) {
			state.secondaryPwd = pwd;
		}
	},
	actions: {
		
	},
	modules:{
		footer_store,
		shopCart_store,
		address_store,
		orderList_store
	}
})

export default store
