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
	return vm.$http.get('/api/TUsers/GetPhoneCode/' + params.phone, {})
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
	return vm.$http.post('/api/TUsers/PostTUser/' + params.code, data)
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
	return vm.$http.put('/api/TUsers/BackPwd/' + params.code, data)
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
		SecondaryPwd: params.pwd
	}
	return vm.$http.put('/api/TUsers/PutTUserSecondaryPwd/' + params.code, data)
}

/**     
 * @method 获取订单列表  
 * @param {String} userId  用户id 
 * @param {String} status 0为未付款，1为已付款，c为未付款已取消(cancel)状态,d为确认收货已完成(done)状态
 * @param {Number} page 
 * @param {Number} pageSize 
 **/
const getOrderList = function(params) {
	let url = vm.$store.state.userId + "?pageIndex=" + params.page + "&pageSize=" + params.pageSize + "&status=" + params
		.status
	return vm.$http.get('/api/TOrders/GetTOrder_user/' + url)
}

/**     
 * @method 查询地址列表  
 * @param {String} userId  用户id 
 * @return {promise} 返回一个promise对象     
 **/
const getAddressList = function() {
	return vm.$http.get('/api/TAddresses/GetTAddress/' + vm.$store.state.userId)
}

/**     
 * @method 编辑地址信息  
 * @param {String} id  地址行id 
 * @return {promise} 返回一个promise对象     
 **/
const editAddress = function(params) {
	var data = {}
	if (params.province) {
		data = {
			UserId: vm.$store.state.userId,
			province: params.province,
			city: params.city,
			region: params.region,
			phone: params.phone,
			Default: params.default || false
		}
	} else {
		data = {
			UserId: vm.$store.state.userId,
			Default: params.default || false
		}
	}
	return vm.$http.put('/api/TAddresses/PutTAddress/' + params.id, data)
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
		userId: vm.$store.state.userId,
		province: params.province,
		city: params.city,
		region: params.region,
		detail: params.detail,
		receiver: params.receiver,
		phone: params.phone,
		default: params.default || false
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
	return vm.$http.put('/api/TAddresses/DelTAddress/' + params.id)
}

/**     
 * @method 查询今日释放积分  
 * @param {String} userId  用户id 
 **/
const getReleaseGold = function() {
	return vm.$http.get('/api/TUsers/GetTodayMB/' + vm.$store.state.userId)
}

/**     
 * @method 查询用户积分历史列表  
 * @param {String} userId   用户id 必填
 * @param {String} isCom   是否要查普通积分标识位，默认为true
 * @param {Number} page  第几页 默认第一页
 * @param {Number} pageSize  每页条数 默认每页10条 
 * @param {Number} start  开始时间 必填 
 * @param {Number} end  结束时间 必填 
 * @param {Number} orderBy  排序规则 选填 默认时间倒序排序 
 **/
const getScoreHistory = function(params) {
	let url = vm.$store.state.userId +
		"?pageIndex=" + params.page +
		"&pageSize=" + params.pageSize +
		"&sTime=" + params.start +
		"&eTime=" + params.end
	if (params.isCom)
		return vm.$http.get('/api/TUsers/GetMyComPointLog/' + url)
	else
		return vm.$http.get('/api/TUsers/GetMyMBLog/' + url)

}

/**     
 * @method 获取 我指导的 用户  
 * @param {String} userId   用户id 必填
 * @param {Number} page  第几页 默认第一页
 * @param {Number} pageSize  每页条数 默认每页10条 
 **/
const getMyMentor = function(params) {
	let url = vm.$store.state.userId +
		"?pageIndex=" + params.page +
		"&pageSize=" + params.pageSize +
		"&phone=" + params.keyword
	return vm.$http.get('/api/TUsers/GetMyMentor/' + url)
}

/**     
 * @method 获取我的团队(普通会员)  
 * @param {String} userId   用户id 必填
 * @param {Number} page  第几页 默认第一页
 * @param {Number} pageSize  每页条数 默认每页10条 
 **/
const getMyCustomer = function(params) {
	let url = vm.$store.state.userId +
		"?pageIndex=" + params.page +
		"&pageSize=" + params.pageSize +
		"&phone=" + params.keyword
	return vm.$http.get('/api/TUsers/GetMyCustomer/' + url)
}

/**     
 * @method 获取我的团队 我下级的经理  
 * @param {String} userId   用户id 必填
 * @param {Number} page  第几页 默认第一页
 * @param {Number} pageSize  每页条数 默认每页10条 
 **/
const getMyManager = function(params) {
	let url = vm.$store.state.userId +
		"?pageIndex=" + params.page +
		"&pageSize=" + params.pageSize +
		"&phone=" + params.keyword
	return vm.$http.get('/api/TUsers/GetMyManager/' + url)
}

/**     
 * @method 获取我的团队 我下级的总监  
 * @param {String} userId   用户id 必填
 * @param {Number} page  第几页 默认第一页
 * @param {Number} pageSize  每页条数 默认每页10条 
 **/
const getMyZongjian = function(params) {
	let url = vm.$store.state.userId +
		"?pageIndex=" + params.page +
		"&pageSize=" + params.pageSize +
		"&phone=" + params.keyword
	return vm.$http.get('/api/TUsers/GetMyZongjian/' + url)
}

/**     
 * @method 转移专用积分  
 * @param {String} from  用户邀请码
 * @param {String} to  目标用户邀请码
 * @param {String} count 转移数量     
 **/
const transferScore = function(params) {
	let data = {
		UserId: params.to,
		MB: params.count,
	}
	return vm.$http.put('/api/TUsers/PutTUserMB/' + vm.$store.state.userId, data)
}

/**     
 * @method 添加店铺  
 * @param {String} ShopCertificates  审核图片
 * @param {String} Imgpath  店铺图标
 * @param {String} UserId 用户ID   
 * @param {String} CardId 店主身份证号   
 * @param {String} Operator 经营者   
 * @param {String} ShopName 店铺名称   
 * @param {String} Sex 性别   
 * @param {String} Phone 电话   
 * @param {String} ShopAddress 店铺地址   
 * @param {String} Latitude 纬度   
 * @param {String} Longitude 经度     
 **/
const addTShops = function(params) {
	let data = {
		UserId: params.to,
		ShopCertificates: params.ShopCertificates,
		Imgpath: params.Imgpath,
		CardId: params.CardId,
		Operator: params.Operator,
		ShopName: params.ShopName,
		Sex: params.Sex,
		Phone: params.Phone,
		ShopAddress: params.ShopAddress,
		Latitude: params.Latitude,
		Longitude: params.Longitude
	}
	return vm.$http.post('/api/TShops/PostTShops', data)
}

/**     
 * @method 经理业绩查询  
 * @param {String} userId  用户Id    
 **/
const getOrderMange = function() {
	return vm.$http.get('/api/TOrders/GetOrderMange/' + vm.$store.state.userId)
}

/**     
 * @method 经理业绩查询  
 * @param {String} userId  用户Id
 * @param {String} stime  开始时间
 * @param {String} etime 结束时间     
 **/
const getOrderMangeBytime = function(params) {
	let url = vm.$store.state.userId +
		"?stime=" + params.stime +
		"&etime=" + params.etime
	return vm.$http.get('/api/TOrders/GetOrderMangeBytime/' + url)
}

/**     
 * @method 销售管理  
 * @param {String} userId  用户Id
 * @param {String} stime  开始时间
 * @param {String} etime 结束时间     
 **/
const getOrder = function(params) {
	let url = vm.$store.state.userId +
		"?stime=" + params.stime +
		"&etime=" + params.etime +
		"&payModel=" + params.payModel
	return vm.$http.get('/api/TOrders/GetOrder/' + url)
}

/**     
 * @method M币提现  
 * @param {String} mb 提现数量     
 **/
const outMB = function(params) {
	let data = {
		MB: params.count,
	}
	return vm.$http.post('/api/TUsers/OutMB/' + vm.$store.state.userId, data)
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
const VIPCENTER_MODULE = {
	getReleaseGold,
	transferScore,
	getScoreHistory,
	getMyMentor,
	getMyCustomer,
	getMyManager,
	getMyZongjian,
	addTShops,
	getOrderMange,
	getOrderMangeBytime,
	getOrder,
	outMB,
	// getMyTeamNum,
	// getMyTeamPerformancem,
	// getMyTeamPoint
}
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
	// ...HOME_MODULE,
	// ...NEARBY_MODULE,
	...VIPCENTER_MODULE,
	// ...SHOPCART_MODULE,
	...MINE_MODULE
}
