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
		phone:params.phone,
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
			detail:params.detail,
			receiver: params.receiver,
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
 * @method 实名认证 
 * @param {String} Operator 经营者姓名     
 * @param {String} CardId 身份证号码     
 * @param {String} ShopName 商家名称     
 * @param {String} Sex 性别     
 * @param {String} ShopCertificates1 身份证正面     
 * @param {String} ShopCertificates2 身份证反面     
 * @param {String} ShopCertificates3 营业执照     
 * @param {String} ShopCertificates4 运营委托书     
 * @param {String} Email 商家地址          
 * @param {String} ShopAddress 邮箱     
 **/
const postTShops1 = function(params) {
	let data = {
		UserId: vm.$store.state.userId,
		Operator: params.Operator,
		CardId: params.CardId,
		ShopName: params.ShopName,
		Sex: params.Sex,
		ShopCertificates1 : params.ShopCertificates1,
		ShopCertificates2: params.ShopCertificates2,
		ShopCertificates3: params.ShopCertificates3,
		ShopCertificates4: params.ShopCertificates4,
		Email : params.Email ,
		ShopAddress: params.ShopAddress
	}
	return vm.$http.post('/api/TShops/PostTShops1', data)
}

/**     
 * @method 添加店铺  
 * @param {String} mb 提现数量     
 **/
const outMB = function(params) {
	let data = {
		MB: params.count,
	}
	return vm.$http.post('/api/TUsers/OutMB/' + vm.$store.state.userId, data)
}

/**     
 * @method 获取实名认证信息  
 * @param {String} userId  用户Id    
 **/
const getTShopByUserID = function(params) {
	return vm.$http.get('/api/TShops/GetTShopByUserID/' + vm.$store.state.userId)
}

/**     
 * @method 获取用户信息  
 * @param {String} userId  用户Id    
 **/
const getUser = function(params) {
	return vm.$http.get('/api/TUsers/GetUser/' + vm.$store.state.userId)
}

/**     
  * @method 根据订单id查询订单详情（批量）  
  * @param {String} orderId  订单id数组 
  * @return {promise} 返回一个promise对象     
  **/
const getOrderDetail = function(params) {
	return vm.$http.get('/api/TOrders/GetTOrderDetails/'+ params.ids)
}

/**     
  * @method 确认收货，完成订单 
  * @param {String} orderId  订单id 
  * @return {promise} 返回一个promise对象     
  **/
const putOrderDone = function(params) {
	let data = {
		orderid: params.orderid,
	}
	return vm.$http.put('/api/TOrders/PutTOrder_Done/'+ vm.$store.state.userId,data)
}


/**     
  * @method 通过用户ID查找店铺 我的店铺  
  * @param {String} userId  用户Id  
  * @return {promise} 返回一个promise对象     
  **/
const getShopByUserId = function() {
	return vm.$http.get('/api/TShops/GetTShopByUserID/'+ vm.$store.state.userId)
}

/**     
  * @method 修改店铺信息
  * @param {String} userId  用户Id  
  * @return {promise} 返回一个promise对象     
  **/
const editShop = function(params) {
	return vm.$http.put('/api/TShops/PutTShops/'+ vm.$store.state.userId,params)
}

/**     
  * @method 通过店铺ID查找商品
  * @param {String} id  店铺Id
  * @param {int} pageSize  一页显示多少条
  * @param {int} pageIndex  第几页  
  * @param {boolean} listing  上下架 bool值 true上架 false下架
  * @return {promise} 返回一个promise对象     
  **/
const getGoodsList = function(params) {
	let url = params.id +
		"?pageIndex=" + params.pageIndex +
		"&pageSize=" + params.pageSize +
		"&listing=" + params.listing
	return vm.$http.get('/api/TShopGoods/GetTShopGoods/'+ url)
}

/**     
  * @method 修改店铺信息
  * @param {String} id  商品Id  
  * @return {promise} 返回一个promise对象     
  **/
const putGoodsUp = function(params) {
	return vm.$http.put('/api/TShopGoods/PutTShopGoodsListing_Up/'+ params.id)
}

/**     
  * @method 修改店铺信息
  * @param {String} id  商品Id  
  * @return {promise} 返回一个promise对象     
  **/
const putGoodsDown = function(params) {
	return vm.$http.put('/api/TShopGoods/PutTShopGoodsListing_Down/'+ + params.id)
}

/**     
  * @method 通过用户ID查找店铺 我的店铺  
  * @param {String} shopid  店铺Id  
  * @return {promise} 返回一个promise对象     
  **/
const getShopType = function(params) {
	return vm.$http.get('/api/TShopGoodsTypes/GetTShopType?shopid='+ params.shopId)
}

/**     
  * @method 通过商品类型id修改商品类型
  * @param {String} id  商品类型id
  * @param {String} TypeName  商品类型名称
  * @return {promise} 返回一个promise对象     
  **/
const updateShopType = function(params) {
	let data={"typeName":params.typeName}
	return vm.$http.put('/api/TShopGoodsTypes/PutTShopType/'+ params.id,data)
}

/**     
  * @method 添加商品类型
  * @param {String} shopid  店铺Id 
  * @param {String} TypeName  商品类型名称
  * @return {promise} 返回一个promise对象     
  **/
const addShopType = function(params) {
	let data={"shopId":params.shopId,"typeName":params.typeName}
	return vm.$http.post('/api/TShopGoodsTypes/PostTShopType',data)
}

/**     
  * @method 删除商品类型
  * @param {String} id  商品类型id
  * @return {promise} 返回一个promise对象     
  **/
const delShopType = function(params) {
	return vm.$http.delete('/api/TShopGoodsTypes/DeleteTShopType/'+ params.id)
}

/**     
  * @method 通过商品Id获取商品信息
  * @param {String} id  商品Id  
  * @return {promise} 返回一个promise对象     
  **/
const getShopGoodById = function(params) {
	return vm.$http.get('/api/TShopGoods/GetTShopGoodsById/'+ params.id)
}

/**     
  * @method 通过商品
  * @param {String} id  商品id
  * @param {String} params  店铺信息
  * @return {promise} 返回一个promise对象     
  **/
const updateShopGoods = function(params,id) {
	return vm.$http.put('/api/TShopGoods/PutTShopGoods1/'+ id,params)
}

/**     
  * @method 添加商品类型
  * @param {String} shopid  店铺Id 
  * @param {String} params  店铺信息
  * @return {promise} 返回一个promise对象     
  **/
const addShopGoods = function(params) {
	return vm.$http.post('/api/TShopGoods/PostTShopGoods1',params)
}

/**     
  * @method 删除商品
  * @param {String} id  商品id
  * @return {promise} 返回一个promise对象     
  **/
const delShopGoods = function(params) {
	return vm.$http.delete('/api/TShopGoods/DeleteTShopGoods/'+ params.id)
}

/**     
  * @method 获取附近店铺
  * @param {String} lon  经度
  * @param {String} lat  纬度 
  * @return {promise} 返回一个promise对象     
  **/
const getNearShop = function(params) {
	var url="?lon="+params.lon+"&lat="+params.lat
	return vm.$http.get('/api/TShops/GetNearShop'+url)
}

/**     
  * @method 通过店铺ID查找所有上架商品
  * @param {String} shopId  店铺Id
  * @return {promise} 返回一个promise对象     
  **/
const getAllShopGoods = function(params) {
	return vm.$http.get('/api/TShopGoods/GetAllTShopGoods/'+ params.shopId)
}

/**     
  * @method 添加订单
  * @param {String} userId  用户Id
  * @param {String} ShopGoodsId  商品Id
  * @param {String} num  数量
  * @return {promise} 返回一个promise对象     
  **/
const postShopOrder = function(params) {
	return vm.$http.post('/api/TShopOrders/PostTShopOrder/'+ vm.$store.state.userId,JSON.stringify(params))
}


/**     
  * @method 生成支付宝订单
  * @param {String} userId  用户Id
  * @param {String} ShopGoodsId  商品Id
  * @param {String} num  数量
  * @return {promise} 返回一个promise对象     
  **/
const appPay = function(orderId,params) {
	return vm.$http.post('/api/Alipay/AppPay/'+ orderId ,params )
}

/**     
  * @method 生成支付宝订单
  * @param {String} userId  用户Id
  * @param {String} ShopGoodsId  商品Id
  * @param {String} num  数量
  * @return {promise} 返回一个promise对象     
  **/
const mbPay = function(params) {
	return vm.$http.put('/api/TUsers/PayShopMB/'+ vm.$store.state.userId ,params )
}

/**     
  * @method 生成支付宝订单
  * @param {String} orderId  订单Id
  * @return {promise} 返回一个promise对象     
  **/
const getShopOrder = function(params) {
	return vm.$http.get('/api/TShopOrders/GetTShopOrder/'+ params.orderId )
}

/**     
  * @method 通过ID修改订单支付状态 已支付
  * @param {String}  orderId  订单Id
  * @return {promise} 返回一个promise对象     
  **/
const putPayStatus = function(params) {
	let data={"PayMode":params.PayMode}
	return vm.$http.put('/api/TShopOrders/PutTShopOrderPayStatus/'+ params.orderId,data )
}

/**     
  * @method 通过用户id查询订单
  * @param {String} status  订单Id
  * @return {promise} 返回一个promise对象     
  **/
const getShopOrderByUserId = function(params) {
	let url = vm.$store.state.userId +
		"?pageIndex=" + params.page +
		"&pageSize=" + params.pageSize +
		"&status=" + params.status
	return vm.$http.get('/api/TShopOrders/GetTShopOrder_userid/'+ url )
}

const LOGIN_MODULE = {
	getSms,
	register,
	login,
	reSetPwd,
	logout,
	setSecondaryPwd,
	getUser,
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
	getNearShop,
	getAllShopGoods,
	postShopOrder,
	appPay,
	mbPay,
	getShopOrder,
	getShopOrderByUserId,
	putPayStatus,
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
	postTShops1,
	getTShopByUserID,
	putOrderDone,
	// getMyTeamNum,
	// getMyTeamPerformancem,
	// getMyTeamPoint
}

const SHOP_MODULE = {
	getShopByUserId,
	editShop,
}

const GOODS_MODULE = {
	getGoodsList,
	putGoodsUp,
	putGoodsDown,
	getShopType,
	updateShopType,
	addShopType,
	delShopType,
	getShopGoodById,
	updateShopGoods,
	addShopGoods,
	delShopGoods
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
	getOrderDetail,
	// setSecondaryPwd,
	// changeSecondaryPwd,
	// forgetSecondaryPwd,
	// validSecondaryPwd
}
export default {
	...LOGIN_MODULE,
	// ...HOME_MODULE,
	...NEARBY_MODULE,
	...VIPCENTER_MODULE,
	// ...SHOPCART_MODULE,
	...MINE_MODULE,
	...SHOP_MODULE,
	...GOODS_MODULE
}
