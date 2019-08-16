/**  
 * @Title: service.js    
 * @Description: 后台请求接口汇总   
 * @author cskying  
 * @date 2019-3-11   
 * @version V1.0  
 */
//引入vue
import Vue from 'vue';
//必须实例化 Vue
let vm = new Vue();

// 管理账号信息
const USERS_KEY = 'USERS_KEY';
const STATE_KEY = 'STATE_KEY';
// uni.getStorageSync(USERS_KEY);
// uni.setStorageSync(USERS_KEY, JSON.stringify(users));


/**     
 * @method 发送验证码  
 * @param {String} phone  手机号
 * @return {promise} 返回一个promise对象    
 **/
const getSms = function(params) {
	return vm.$http.get('/api/TUsers/GetPhoneCode/'+ params.phone,{})
}


/**     
  * @method 注册   
  * @param {String} username  用户名
  * @param {String} pwd  密码
  * @param {String} phone 手机号  
  * @param {String} parentCode  推荐人ID
  * @return {promise} 返回一个promise对象     
  **/
const register = function(params) {
	let data = {
		username: params.username,
		pwd: params.password,
		phone: params.phone,
		parentCode: params.inviteCode,
	}
	return vm.$http.post('/api/TUsers/PostTUser/'+params.code, data)
}

/**     
  * @method 登录   
  * @param {String} phoneNum  手机号  
  * @param {String} pwd  密码
  * @return {promise} 返回一个promise对象   
  */
const login = function(userInfo) {
	let data = {
		phone: userInfo.phone,
		pwd: userInfo.password
	}
	return vm.$http.post('/api/TUsers/Login', data)
}


/**     
  * @method 忘记密码（重新设置密码）   
  * @param {String} phoneNum  手机号  
  * @param {String} pwd  密码
  * @param {String} code  验证码
  * @return {promise} 返回一个promise对象     
  **/
const reSetPwd = function(params) {
	let data = {
		phone: params.phone,
		pwd: params.password
	}
	return vm.$http.put('/api/TUsers/BackPwd/'+params.code, data)
}

/**     
  * @method 登录   
  * @param {String} phoneNum  手机号  
  * @param {String} pwd  密码
  * @return {promise} 返回一个promise对象   
  */
const logout = function(params) {
	let data = {
		token: params.token
	}
	return vm.$http.post('/api/TUsers/InvalidateToken', data)
}

const LOGIN_MODULE = {
	getSms,
	register,
	login,
	reSetPwd,
	logout,
	// getConfigs,
	// changeBindPhone,
	// refleshToken
}
/* const HOME_MODULE = {
	getGoodTopClass,
	getGoodSecondClass,
	getGoodListByType,
	getGoodListById,
	getGoodListBySearch,
	getRecommendGoodList,
	// 2019-06 16新增
	getGoodListByTopClassType
}
const NEARBY_MODULE = {

}
const VIPCENTER_MODULE = {
	getReleaseGold,
	transferScore,
	getScoreHistory,
	getGroupMembers,
	getMyTeamNum,
	getMyTeamPerformancem,
	getMyTeamPoint
}
const SHOPCART_MODULE = {
	getCartList,
	addToCart,
	deleteFromCart,
	createOrder,
	callbackAfterPay
}
const MINE_MODULE = {
	getAddressList,
	editAddress,
	addAddress,
	deleteAddress,
	getOrderList,
	deleteOrder,
	receivedOrder,
	getOrderDetail,
	setSecondaryPwd,
	changeSecondaryPwd,
	forgetSecondaryPwd,
	validSecondaryPwd
} */
export default {
	...LOGIN_MODULE,
	/* ...HOME_MODULE,
	...NEARBY_MODULE,
	...VIPCENTER_MODULE,
	...SHOPCART_MODULE,
	...MINE_MODULE */
}
