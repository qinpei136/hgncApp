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
		pwd: params.pwd
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


/**     
  * @method 设置修改二级密码  
  * @param {String} phoneNum  手机号  
  * @param {String} pwd  密码
  * @return {promise} 返回一个promise对象   
  */
const setSecondaryPwd = function(params) {
	let data = {
		id: params.id,
		SecondaryPwd :params.pwd
	}
	return vm.$http.put('/api/TUsers/PutTUserSecondaryPwd/'+params.code, data)
}

/**     
  * @method 获取订单列表  
  * @param {String} userId  用户id 
  * @param {String} status 不传时查询所有订单，
  * 				"0"为待付款，
					"1"为已付款待发货，
					"2"为已发货待收货，
					"d"为确认收货已完成(done)交易成功状态
					"c"为未付款订单已取消(cancel)状态,
					"n"为已付款订单取消未退款状态
					"a"为已付款订单取消已退款状态
					其中流程已结束的订单状态为 d,c,a
  * @param {Number} page 
  * @param {Number} pageSize 
  **/
const getOrderList = function(params) {
	let userinfo = uni.getStorageSync('USERS_INFO')
	return vm.$http.get('/api/TOrders/GetTOrder_user/'+userinfo.tuser.id)
}

const LOGIN_MODULE = {
	getSms,
	register,
	login,
	reSetPwd,
	logout,
	setSecondaryPwd,
	getOrderList,
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
