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
  * @method 退出登录   
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
  * @param {String} status 0为未付款，1为已付款，c为未付款已取消(cancel)状态,d为确认收货已完成(done)状态
  * @param {Number} page 
  * @param {Number} pageSize 
  **/
const getOrderList = function(params) {
	let url=vm.$store.state.userId+"?pageIndex="+params.page+"&pageSize="+params.pageSize+"&status="+params.status
	return vm.$http.get('/api/TOrders/GetTOrder_user/'+url)
}

/**     
  * @method 查询地址列表  
  * @param {String} userId  用户id 
  * @return {promise} 返回一个promise对象     
  **/
const getAddressList = function() {
	return vm.$http.get('/api/TAddresses/GetTAddress/'+vm.$store.state.userId)
}

/**     
  * @method 编辑地址信息  
  * @param {String} id  地址行id 
  * @return {promise} 返回一个promise对象     
  **/
const editAddress = function(params) {
	let data = {
		UserId:vm.$store.state.userId,
		province: params.province,
		city: params.city,
		region:  params.region,
		phone:  params.phone,
		Default:  params.Default || false
	}
	return vm.$http.put('/api/TAddresses/PutTAddress/'+params.id, data)
}

/**     
  * @method 新增地址  
  * @param {String} province  省份 
  * @param {String} city  市
  * @param {String} region  区
  * @param {String} street  街道
  * @param {String} detail  地址详情
  * @param {String} receiver  收件人
  * @param {String} phone  手机号
  * @param {Boolean} default  是否默认
  * @param {String} tag  标签   家|公司
  * @return {promise} 返回一个promise对象     
  **/
const addAddress = function(params) {
	let data = {
		userId:vm.$store.state.userId,
		province: params.province,
		city: params.city,
		region:  params.region,
		detail:  params.detail,
		receiver:  params.receiver,
		phone:  params.phone,
		default:  params.default || false
	}
	return vm.$http.post('/api/TAddresses/PostTAddress', data)
}

/**     
  * @method 删除用户名下地址信息  
  * @param {String} id  地址id 
  * @return {promise} 返回一个promise对象     
  **/
const deleteAddress = function(params) {
	let data = {
		id: params.id
	}
	return vm.$http.put('/api/TAddresses/DelTAddress/'+params.id)
}

const LOGIN_MODULE = {
	getSms,
	register,
	login,
	reSetPwd,
	logout,
	setSecondaryPwd,
	// getConfigs,
	// changeBindPhone,
	// refleshToken
}
// const HOME_MODULE = {
// 	getGoodTopClass,
// 	getGoodSecondClass,
// 	getGoodListByType,
// 	getGoodListById,
// 	getGoodListBySearch,
// 	getRecommendGoodList,
// 	// 2019-06 16新增
// 	getGoodListByTopClassType
// }
const NEARBY_MODULE = {

}
// const VIPCENTER_MODULE = {
// 	getReleaseGold,
// 	transferScore,
// 	getScoreHistory,
// 	getGroupMembers,
// 	getMyTeamNum,
// 	getMyTeamPerformancem,
// 	getMyTeamPoint
// }
// const SHOPCART_MODULE = {
// 	getCartList,
// 	addToCart,
// 	deleteFromCart,
// 	createOrder,
// 	callbackAfterPay
// }
const MINE_MODULE = {
	getAddressList,
	editAddress,
	addAddress,
	deleteAddress,
	getOrderList,
	// deleteOrder,
	// receivedOrder,
	// getOrderDetail,
	// setSecondaryPwd,
	// changeSecondaryPwd,
	// forgetSecondaryPwd,
	// validSecondaryPwd
}
export default {
	...LOGIN_MODULE,
	/* ...HOME_MODULE,
	...NEARBY_MODULE,
	...VIPCENTER_MODULE,
	...SHOPCART_MODULE,*/
	...MINE_MODULE 
}
