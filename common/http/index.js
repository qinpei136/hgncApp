/**
 * 通用uni-app网络请求
 * 基于 Promise 对象实现更简单的 request 使用方式，支持请求和响应拦截
 */
// 是否正在刷新
let isRefreshing = false;

/*被挂起的请求数组*/
let refreshSubscribers = [];

/*push所有请求到数组中*/
function subscribeTokenRefresh(cb) {
	refreshSubscribers.push(cb);
}

/*刷新请求（refreshSubscribers数组中的请求得到新的token之后会自执行,用新的token去请求数据）*/
function onRrefreshed(token) {
	refreshSubscribers.map(cb => cb(token));
}

// 请求后台token刷新接口
function refleshToken(config) {
	return uni.request({
		url: config.baseUrl ? config.baseUrl + '/v1/api/user/refleshToken' : '/v1/api/user/refleshToken',
		data: {},
		method: 'post',
		header: {
            "Content-Type": "application/json",
			'Authorization': config.header['Authorization']
		}
	})
}

// 检查token的状态
function checkTokenStatus(response) {
	// 00	missing token	请求需带上token
	// FF	redis token timeout, please relogin	（超时，无法reflesh）重定向到登录页面
	// SF	not latest token	（非最新签发的token但token有效，被其他用户挤下来了）重定向到登录页面
	// ER	token invalid	（token解码失败）请勿伪造token
	// RF	token timeout	需要更换token
	// OE	not latest token;token timeout	（非最新签发的token且超时）重定向到登录页面
	const code = response.data.data.acode;
	if (code === "00" || code === "RF") {
		// 消息重发，换上新的token
		reloadMessage(response.config)
	} else if (code === "FF" || code === "SF" || code === "ER" || code === "OE") {
		if (code === "SF") {
			response.data.data = "此账户已在别处登录"
		} else{
			response.data.data = "token已过期"
		}
		// 获取当前路由，已经处于登录页面，跳过此处判断
		const pages = getCurrentPages();
		const currentPage = pages.length > 0 && pages[pages.length - 1].route;
		if(currentPage !== "pages/login/login" || !currentPage) {
			// 清楚缓存的token信息
			uni.removeStorageSync('USERS_INFO');
			uni.removeStorageSync('USER_TOKEN');
			// 重定向到登录页面
			uni.navigateTo({
				url: "/pages/login/login"
			})
		}	
	}
}

/* 消息重发 */
function reloadMessage(config) {
	if(!isRefreshing) {
		refleshToken(config).then(res => {
			if(res[1].data.data.code === 'OK' && res[1].data.data.token) {
				let token = res[1].data.data.token;
				/*成功刷新token*/
				config.header['Authorization'] = token;
				/*更新本地的token*/
				uni.setStorageSync("USER_TOKEN", token);
				isRefreshing = false;
				/*执行数组里的函数,重新发起被挂起的请求*/
				onRrefreshed(token);
				/*执行onRefreshed函数后清空数组中保存的请求*/
				refreshSubscribers = [];
			} else {
				// 清除缓存的token信息
				uni.removeStorageSync('USERS_INFO');
				uni.removeStorageSync('USER_TOKEN');
				// 重定向到登录页面
				uni.navigateTo({
					url: "/pages/login/login"
				})
				return
			}
		})	
	}
	isRefreshing = true;
	/*将请求挂起*/
	let retry = new Promise((resolve, reject) => {
		/*(token) => {...}这个函数就是回调函数*/
		subscribeTokenRefresh(token => {
			console.log(config)
			// 如果没有传入 success / fail / complete 参数，则会返回封装后的 Promise 对象
			uni.request({
				url: config.url,
				data: config.data,
				method: config.method,
				header: {
					'Authorization': token
				}
			}).then(res => {
				resolve(res.data)
			})
		});
	});
	return retry;
}


/**
 * 请求接口日志记录
 */
function _reqlog(req) {
	if (process.env.NODE_ENV === 'development') {
		// console.log("【" + req.requestId + "】 地址：" + req.url)
		// if (req.data) {
		// 	console.log("【" + req.requestId + "】 请求参数：" + JSON.stringify(req.data))
		// }
	}
	//TODO 调接口异步写入日志数据
}

/**
 * 响应接口日志记录
 */
function _reslog(res) {
	let _statusCode = res.statusCode;
	// if (process.env.NODE_ENV === 'development') {
	// 	console.log("【" + res.config.requestId + "】 地址：" + res.config.url)
	// 	if (res.config.data) {
	// 		console.log("【" + res.config.requestId + "】 请求参数：" + JSON.stringify(res.config.data))
	// 	}
	// 	console.log("【" + res.config.requestId + "】 响应结果：" + JSON.stringify(res))
	// }
	//TODO 除了接口服务错误外，其他日志调接口异步写入日志数据库
	switch (_statusCode) {
		case 200:
			break;
		case 401:
			checkTokenStatus(res)
			break;
		case 404:
			break;
		default:
			break;
	}
}

export default {
	config: {
		 baseUrl: "https://yymall.maiyidesan.cn",
		header: {
			'Content-Type': 'application/json;charset=UTF-8',
			// 'Content-Type':'application/x-www-form-urlencoded'
		},
		data: {},
		method: "GET",
		dataType: "json",
		/* 如设为json，会对返回的数据做一次 JSON.parse */
		responseType: "text",
		success() {},
		fail() {},
		complete() {}
	},
	interceptor: {
		request: null,
		response: null
	},
	request(options) {
		if (!options) {
			options = {}
		}
		options.baseUrl = options.baseUrl || this.config.baseUrl
		options.dataType = options.dataType || this.config.dataType
		options.url = options.baseUrl ? (options.baseUrl + options.url) : options.url
		options.data = options.data || {}
		options.method = options.method || this.config.method
		//TODO 加密数据

		//TODO 数据签名
		let _token = {
			'Authorization': uni.getStorageSync('USER_TOKEN') || 'undefined'
		};
		options.header = Object.assign({}, options.header, _token)

		return new Promise((resolve, reject) => {
			let _config = null

			options.complete = (response) => {
				let statusCode = response.statusCode
				response.config = _config
				if (process.env.NODE_ENV === 'development') {
					if (statusCode === 200) {
						// console.log("【" + _config.requestId + "】 结果：" + JSON.stringify(response.data))
					}
				}
				if (this.interceptor.response) {
					let newResponse = this.interceptor.response(response)
					if (newResponse) {
						response = newResponse
					}
				}
				// 统一的响应日志记录
				_reslog(response)
				if (statusCode === 200) { //成功
					resolve(response);
				} else {
					// 统一处理错误信息
					let err = {
						errMsg: (response.data && response.data.data) || response.errMsg
					}
					reject(err);
				}
			}

			_config = Object.assign({}, options)
			_config.requestId = new Date().getTime()

			if (this.interceptor.request) {
				this.interceptor.request(_config)
			}

			// 统一的请求日志记录
			_reqlog(_config)
			uni.request(_config);
		});
	},
	get(url, data, options) {
		if (!options) {
			options = {}
		}
		options.url = url
		options.data = data
		options.method = 'GET'
		return this.request(options)
	},
	post(url, data, options) {
		if (!options) {
			options = {}
		}
		options.url = url
		options.data = data
		options.method = 'POST'
		return this.request(options)
	},
	put(url, data, options) {
		if (!options) {
			options = {}
		}
		options.url = url
		options.data = data
		options.method = 'PUT'
		return this.request(options)
	},
	delete(url, data, options) {
		if (!options) {
			options = {}
		}
		options.url = url
		options.data = data
		options.method = 'DELETE'
		return this.request(options)
	}
}
