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
  * @method 获取后台自定义配置   
  * @return {promise} 返回一个promise对象     
  */
const getConfigs = function() {
	return vm.$http.post('/v1/api/common/configs', {})
}

/**     
  * @method 登录   
  * @param {String} phoneNum  手机号  
  * @param {String} pwd  密码
  * @return {promise} 返回一个promise对象   
  */
const login = function(userInfo) {
	let data = {
		phoneNum: userInfo.phone,
		pwd: userInfo.password
	}
	return vm.$http.post('/v1/api/user/login', data)
}

/**     
  * @method 登录   
  * @param {String} phoneNum  手机号  
  * @param {String} pwd  密码
  * @return {promise} 返回一个promise对象   
  */
const logout = function(userInfo) {
	let data = {
		userId: vm.$store.state.userId
	}
	return vm.$http.post('/v1/api/user/logout', data)
}

/**     
  * @method 注册   
  * @param {String} phoneNum  手机号  
  * @param {String} pwd  密码
  * @param {String} inviteCode  邀请码
  * @param {String} authCode  验证码
  * @return {promise} 返回一个promise对象     
  **/
const register = function(params) {
	let data = {
		phoneNum: params.phone,
		pwd: params.password,
		inviteCode: params.inviteCode,
		authCode: params.code,
	}
	return vm.$http.post('/v1/api/user/signUp', data)
}

/**     
  * @method 发送验证码  
  * @param {String} phoneNum  手机号
  * @return {promise} 返回一个promise对象    
  **/
const getSms = function(params) {
	let data = {
		phoneNum: params.phone,
		pwd: params.password,
		authCode: params.authCode,
	}
	return vm.$http.post('/v1/api/sms/sendSms', data)
}

/**     
  * @method 忘记密码（重新设置密码）   
  * @param {String} phoneNum  手机号  
  * @param {String} pwd  密码
  * @param {String} authCode  验证码
  * @return {promise} 返回一个promise对象     
  **/
const reSetPwd = function(params) {
	let data = {
		phoneNum: params.phone,
		pwd: params.password,
		authCode: params.code,
	}
	return vm.$http.post('/v1/api/user/changePwd', data)
}
/**     
  * @method 修改用户绑定的手机号（重新设置密码）   
  * @param {String} userId  用户id  
  * @param {String} phoneNum  新手机号
  * @param {String} authCode  验证码
  * @return {promise} 返回一个promise对象     
  **/
const changeBindPhone = function(params) {
	let data = {
		userId: vm.$store.state.userId,
		phoneNum: params.phone,
		authCode: params.code,
	}
	return vm.$http.post('/v1/api/user/changeBindPhone', data)
}

/**     
  * @method 刷新token     连续10天没有登录app再登录      
  **/
const refleshToken = function(params) {
	return vm.$http.post('/v1/api/user/refleshToken', {})
}

/**     
  * @method 获取商品顶级分类列表   
  * @param {String} classScheme   cat1  
  * @return {promise} 返回一个promise对象     
  **/
const getGoodTopClass = function(params) {
	let data = {
		classScheme: params.classScheme,
	}
	return new Promise((resolve,reject)=>{
		vm.$http.post('/v1/api/goods/topClass', data)
			.then(res => {
				// console.log(JSON.stringify(res))
				if (res.data.status === 200) {
					resolve(res.data.data)
				} 
				// to do需要增加失败和异常分支
			})
	})
	// return vm.$http.post('/v1/api/goods/topClass', data)
}

/**     
  * @method 获取商品二级分类列表   
  * @param {Array} topClass   ["0","1"]  
  * @return {promise} 返回一个promise对象     
  **/
const getGoodSecondClass = function(params) {
	let data = {
		topClass: params.topClass,
	}
	return vm.$http.post('/v1/api/goods/secondClass', data)
}


/**     
  * @method 根据商品类型获取商品列表   
  * @param {String} type   商品类型   
  * @param {Number} page   列表页数   1
  * @param {Number} pageSize   一页商品数   默认为10条
  * @param {Array} orderBy   筛选条件
  * @return {promise} 返回一个promise对象     
  **/
const getGoodListByType = function(params) {
	let data = {
		type: params.type,
		page: params.page,
		pageSize: params.pageSize,
		orderBy: params.orderBy
	}
	return vm.$http.post('/v1/api/goods/goodsPageList', data)
}
/**
 * @method 根据商品一级分类id，查询商品列表
 * @param {String} type 分类类型
 * @param {Number} page 页码 1
 * @param {Number} pageSize 每页商品数 6
 * @param {Array} orderBy 筛选条件
 * @return {promise} 
 * **/
const getGoodListByTopClassType = function(params) {
	let data = {
		type: params.type,
		page: params.page,
		pageSize: params.pageSize,
		orderBy: params.orderBy
	}
	return new Promise((resolve,reject) => {
		vm.$http.post('/v1/api/goods/topClass/goodsPageList', data)
			.then(res=>{
				// console.log(res)
				if(res.data.status === 200) {
					resolve(res.data.data)
				}
			})
	})
}
/**     
  * @method 根据商品id获取商品详情   
  * @param {Array} ids   商品ID数组   
  * @return {promise} 返回一个promise对象     
  **/
const getGoodListById = function(params) {
	let data = {
		ids: params.ids,
	}
	return vm.$http.post('/v1/api/goods/goodsList', data)
}

/**     
  * @method 根据商品title模糊搜索商品（带分页）   
  * @param {String} title   ["0","1"]  
  * @param {Number} page   列表页数   1
  * @param {Number} pageSize   一页商品数    
  * @param {Array} orderBy   排序
  **/
const getGoodListBySearch = function(params) {
	let data = {
		title: params.title,
		page: params.page,
		pageSize: params.pageSize,
		orderBy: params.orderBy
	}
	return vm.$http.post('/v1/api/goods/search', data)
}

/**     
  * @method 用户商品推荐   
  * @param {String} userId   ["0","1"]  
  * @param {String} areaId  地区id
  * @param {Number} num   推荐商品数    
  **/
const getRecommendGoodList = function(params) {
	let data = {
		userId: "",
		areaId: params.areaId,
		num: params.num,
	}
	return vm.$http.post('/v1/api/goods/recommend', data)
}

/**     
  * @method 查询购物车列表   
  * @param {String} userId  用户id  
  * @return {promise} 返回一个promise对象     
  **/
const getCartList = function(userId) {
	let data = {
		userId: userId,
	}
	return vm.$http.post('/v1/api/cart/list', data)
}

/**     
  * @method 添加商品至购物车   
  * @param {String} userId  用户id  
  * @return {promise} 返回一个promise对象     
  **/
const addToCart = function(params) {
	let data = {
		userId: params.userId,
		goodsId: params.goodsId,
		num: params.num,
		standardId: params.standardId
	}
	return vm.$http.post('/v1/api/cart/add', data)
}

/**     
  * @method 删除购物车中的商品  
  * @param {String} userId  用户id 
  * @param {Array | undefined} goodsIds - undefined时，清空用户所有购物车中的商品
  * @return {promise} 返回一个promise对象     
  **/
const deleteFromCart = function(params) {
	let data = {
		userId: params.userId,
		goodsIds: params.ids
	}
	return vm.$http.post('/v1/api/cart/delete', data)
}

/**     
  * @method 查询地址列表  
  * @param {String} userId  用户id 
  * @return {promise} 返回一个promise对象     
  **/
const getAddressList = function(params) {
	let data = {
		userId: params.userId
	}
	return vm.$http.post('/v1/api/address/list', data)
}

/**     
  * @method 编辑地址信息  
  * @param {String} id  地址行id 
  * @return {promise} 返回一个promise对象     
  **/
const editAddress = function(params) {
	let data = {
		"id": params.id,
		"params": {
			province: params.province,
			city: params.city,
			region:  params.region,
			street:  params.street,
			detail:  params.detail,
			receiver:  params.receiver,
			phone:  params.phone,
			default:  params.default || false,
			tag: params.tag,
		}
	}
	return vm.$http.post('/v1/api/address/edit', data)
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
		"userId": params.userId,
		"params": {
			province: params.province,
			city: params.city,
			region:  params.region,
			street:  params.street,
			detail:  params.detail,
			receiver:  params.receiver,
			phone:  params.phone,
			default:  params.default || false,
			tag: params.tag,
		}
	
	}
	return vm.$http.post('/v1/api/address/add', data)
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
	return vm.$http.post('/v1/api/address/del', data)
}

/**     
  * @method 创建订单  
  * @param {String} userId  用户id 
  * @param {Array} goods  产品信息列表 [{"goodsId":"1120025","num":1,"price":100.5,"detail":"商品颜色大小等","imageUrl":"11.png"}	] 
  * @return {promise} 返回一个promise对象     
  **/
const createOrder = function(params) {
	let data = {
		// userId: params.userId, // 不用穿userId 现在已改成token机制
		goods: params.goods,
		addressId: params.addressId
	}
	return vm.$http.post('/v1/api/order/create', data)
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
	let data = {
		userId: params.userId || vm.$store.state.userId,
		// userId: "e8b46f10-43c8-11e9-9de7-55194d563065",
		status: params.status,
		page: params.page,
		pageSize: params.pageSize
	}
	return vm.$http.post('/v1/api/order/list', data)
}

/**     
  * @method 删除订单  
  * @param {String} userId  用户id 
  * @param {Array} goodsId  商品id【选填】  当一个订单下有多个商品时，传goodsId用来区分不同商品
  * @param {String} detail  商品型号 【选填】 当同一商品有不同型号时，用detail字段来区分不同型号
  * @return {promise} 返回一个promise对象     
  **/
const deleteOrder = function(params) {
	let data = {
		id: params.orderId,
		goodsId: params.goodsId,
		detail: params.detail
	}
	return vm.$http.post('/v1/api/order/delete', data)
}

/**     
  * @method 支付成功后的回调  
  * @param {String} orderId  订单id 
  * @param {String} payment  支付方式
  * @return {promise} 返回一个promise对象     
  **/
const callbackAfterPay = function(params) {
	let data = {
		orderId: params.orderId,
		payment: params.payment
	}
	return vm.$http.post('/v1/api/order/paySuccess', data)
}

/**     
  * @method 用户确认收货  
  * @param {Array} orderId  订单id 
  * @return {promise} 返回一个promise对象     
  **/
const receivedOrder = function(params) {
	let data = {
		orderId: params.orderId
	}
	return vm.$http.post('/v1/api/order/received', data)
}

/**     
  * @method 根据订单id查询订单详情（批量）  
  * @param {String} orderId  订单id数组 
  * @return {promise} 返回一个promise对象     
  **/
const getOrderDetail = function(params) {
	let data = {
		ids: params.ids
	}
	return vm.$http.post('/v1/api/order/ids', data)
}

/**     
  * @method 设置二级密码  
  * @param {String} userId  用户id 
  * @param {String} pwd  二级密码
  * @return {promise} 返回一个promise对象     
  **/
const setSecondaryPwd = function(params) {
	let data = {
		userId: vm.$store.state.userId,
		pwd: params.pwd
	}
	return vm.$http.post('/v1/api/user/setSecondaryPwd', data)
}

/**     
  * @method 修改二级密码  
  * @param {String} userId  手机号 
  * @param {String} oldPwd  原始密码
  * @param {String} newPwd  新密码 
  * @return {promise} 返回一个promise对象     
  **/
const changeSecondaryPwd = function(params) {
	let data = {
		userId: vm.$store.state.userId,
		oldPwd: params.oldPwd,
		newPwd: params.newPwd
	}
	return vm.$http.post('/v1/api/user/changeSecondaryPwd', data)
}

/**     
  * @method 忘记二级密码  
  * @param {String} phoneNum  手机号 
  * @param {String} authCode  手机验证码
  * @param {String} newPwd  新密码
  * @return {promise} 返回一个promise对象     
  **/
const forgetSecondaryPwd = function(params) {
	let data = {
		userId: vm.$store.state.userId,
		phoneNum: params.phoneNum,
		authCode: params.authCode,
		newPwd: params.newPwd
	}
	return vm.$http.post('/v1/api/user/forgetSecondaryPwd', data)
}

/**     
  * @method 校验二级密码  
  * @param {String} userId  用户id 
  * @param {String} pwd  二级密码
  * @return {promise} 返回一个promise对象     
  **/
const validSecondaryPwd = function(params) {
	let data = {
		userId: vm.$store.state.userId,
		pwd: params.pwd,
	}
	return vm.$http.post('/v1/api/user/validSecondaryPwd', data)
}

/**     
  * @method 查询今日释放积分  
  * @param {String} userId  用户id 
  **/
const getReleaseGold = function() {
	let data = {
		userId: vm.$store.state.userId
	}
	return vm.$http.post('/v1/api/user/releaseGold', data)
}

/**     
  * @method 转移专用积分  
  * @param {String} from  用户邀请码
  * @param {String} to  目标用户邀请码
  * @param {String} count 转移数量     
  **/
const transferScore = function(params) {
	let data = {
		from: vm.$store.state.userInviteCode,
		to: params.to,
		count: params.count,
	}
	return vm.$http.post('/v1/api/user/transferGold', data)
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
	let data = {
		userId: vm.$store.state.userId || params.userId,
		isCom: params.isCom,
		page: params.page,
		pageSize: params.pageSize,
		start: params.start,
		end: params.end,
		orderBy: params.orderBy,
	}
	return vm.$http.post('/v1/api/user/pointHistory', data)
}

/**     
  * @method 获取团队成员列表  
  * @param {String} userId   用户id 必填
  **/
const getGroupMembers = function(params) {
	let data = {
		userId: vm.$store.state.userId
	}
	return vm.$http.post('/v1/api/user/groupMembers', data)
}

/**     
  * @method 查找我的团队数量  
  * @param {String} userId   用户id 必填
  * @param {Number} start  开始时间 选填 
  * @param {Number} end  结束时间 选填  
  **/
const getMyTeamNum = function(params) {
	let data = {
		userId: vm.$store.state.userId,
		start: params.start,
		end: params.end
	}
	return vm.$http.post('/v1/api/user/myTeamNum', data)
}

/**     
  * @method 查找我的团队业绩  
  * @param {String} userId   用户id 必填
  * @param {Number} start  开始时间 选填 
  * @param {Number} end  结束时间 选填  
  **/
const getMyTeamPerformancem = function(params) {
	let data = {
		userId: vm.$store.state.userId,
		start: params.start,
		end: params.end
	}
	return vm.$http.post('/v1/api/user/myTeamPerformancem', data)
}

/**     
  * @method 查找我的团队积分新增情况  
  * @param {String} userId   用户id 必填
  * @param {Number} start  开始时间 选填 
  * @param {Number} end  结束时间 选填  
  **/
const getMyTeamPoint = function(params) {
	let data = {
		userId: vm.$store.state.userId,
		start: params.start,
		end: params.end
	}
	return vm.$http.post('/v1/api/user/user/myTeamPoint', data)
}

const LOGIN_MODULE = {
	getConfigs,
	login,
	logout,
	register,
	getSms,
	reSetPwd,
	changeBindPhone,
	refleshToken
}
const HOME_MODULE = {
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
}
export default {
	...LOGIN_MODULE,
    ...HOME_MODULE,
	...NEARBY_MODULE,
	...VIPCENTER_MODULE,
	...SHOPCART_MODULE,
	...MINE_MODULE
}
