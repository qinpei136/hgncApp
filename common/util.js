const BASE_IMAGE_URL = 'https://images.maiyidesan.cn/'
const BASE_IMAGE_URL_NO_SLASH = 'https://images.maiyidesan.cn'
const BASE_URL = 'http://server.maiyidesan.cn/v1/api/'
const domainImg="https://yymall.maiyidesan.cn/YYSYS"
/**  
 * @Title: util.js    
 * @Description: 公共工具汇总   
 * @author cskying  
 * @date 2019-3-11   
 * @version V1.0  
 */
import store from '../store/index.js';
import _ from 'lodash';


//引入vue
import Vue from 'vue';
//必须实例化 Vue
let vm = new Vue();
/**     
 * @method 表单优雅校验   
 * @param {String} error 错误提示  
 * @param {Object} data  需要检验的数据 {phone：13555555555}
 * @param {Array} rule   校验规则  [{checkType: "notnull",name: "password1",errorMsg: "确认密码不能为空"},{checkType: "same",checkRule: this.pwdData.password,name: "password1",errorMsg: "两次密码输入不一致"}]
 * @throws   
 */
const graceChecker = {
	error: '',
	check: function(data, rule) {
		for (var i = 0; i < rule.length; i++) {
			if (!rule[i].checkType) {
				return true;
			}
			if (!rule[i].name) {
				return true;
			}
			if (!rule[i].errorMsg) {
				return true;
			}
			if (!data[rule[i].name]) {
				this.error = rule[i].errorMsg;
				return false;
			}
			switch (rule[i].checkType) {
				case 'string':
					var reg = new RegExp('^.{' + rule[i].checkRule + '}$');
					if (!reg.test(data[rule[i].name])) {
						this.error = rule[i].errorMsg;
						return false;
					}
					break;
				case 'int':
					var reg = new RegExp('^(-[1-9]|[1-9])[0-9]{' + rule[i].checkRule + '}$');
					if (!reg.test(data[rule[i].name])) {
						this.error = rule[i].errorMsg;
						return false;
					}
					break;
					break;
				case 'between':
					if (!this.isNumber(data[rule[i].name])) {
						this.error = rule[i].errorMsg;
						return false;
					}
					var minMax = rule[i].checkRule.split(',');
					minMax[0] = Number(minMax[0]);
					minMax[1] = Number(minMax[1]);
					if (data[rule[i].name] > minMax[1] || data[rule[i].name] < minMax[0]) {
						this.error = rule[i].errorMsg;
						return false;
					}
					break;
				case 'betweenD':
					var reg = /^-?[1-9][0-9]?$/;
					if (!reg.test(data[rule[i].name])) {
						this.error = rule[i].errorMsg;
						return false;
					}
					var minMax = rule[i].checkRule.split(',');
					minMax[0] = Number(minMax[0]);
					minMax[1] = Number(minMax[1]);
					if (data[rule[i].name] > minMax[1] || data[rule[i].name] < minMax[0]) {
						this.error = rule[i].errorMsg;
						return false;
					}
					break;
				case 'betweenF':
					var reg = /^-?[0-9][0-9]?.+[0-9]+$/;
					if (!reg.test(data[rule[i].name])) {
						this.error = rule[i].errorMsg;
						return false;
					}
					var minMax = rule[i].checkRule.split(',');
					minMax[0] = Number(minMax[0]);
					minMax[1] = Number(minMax[1]);
					if (data[rule[i].name] > minMax[1] || data[rule[i].name] < minMax[0]) {
						this.error = rule[i].errorMsg;
						return false;
					}
					break;
				case 'same':
					if (data[rule[i].name] != rule[i].checkRule) {
						this.error = rule[i].errorMsg;
						return false;
					}
					break;
				case 'notsame':
					if (data[rule[i].name] == rule[i].checkRule) {
						this.error = rule[i].errorMsg;
						return false;
					}
					break;
				case 'email':
					var reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
					if (!reg.test(data[rule[i].name])) {
						this.error = rule[i].errorMsg;
						return false;
					}
					break;
				case 'phoneno':
					var reg = /^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/;
					if (!reg.test(data[rule[i].name])) {
						this.error = rule[i].errorMsg;
						return false;
					}
					break;
				case 'zipcode':
					var reg = /^[0-9]{6}$/;
					if (!reg.test(data[rule[i].name])) {
						this.error = rule[i].errorMsg;
						return false;
					}
					break;
				case 'reg':
					var reg = new RegExp(rule[i].checkRule);
					if (!reg.test(data[rule[i].name])) {
						this.error = rule[i].errorMsg;
						return false;
					}
					break;
				case 'in':
					if (rule[i].checkRule.indexOf(data[rule[i].name]) == -1) {
						this.error = rule[i].errorMsg;
						return false;
					}
					break;
				case 'notnull':
					if (data[rule[i].name] == null || data[rule[i].name].length < 1) {
						this.error = rule[i].errorMsg;
						return false;
					}
					break;
				case 'dateless':
					if (data[rule[i].name] < rule[i].checkRule) {
						this.error = rule[i].errorMsg;
						return false;
					}
					break;
			}
		}
		return true;
	},
	isNumber: function(checkVal) {
		var reg = /^-?[1-9][0-9]?.?[0-9]*$/;
		return reg.test(checkVal);
	},
}

// 模拟底部其他非nav页面跳转nav页面
const switchTab = function(type) {
	store.dispatch("change_page", type);
	uni.navigateTo({
		url: "/pages/index"
	})
}
/**
 * @method  进入有权限的页面之前判断当前是否登录 
 * @param {String} code 目标页面的标识
 **/
const guardToLogin = function(code) {
	return new Promise((reslove, reject) => {
		// 获取登录状态
		// const hasLogin = store.state.hasLogin;
		const hasLogin=vm.$store.state.hasLogin
		if (hasLogin) {
			reslove();
		} else {
			// 未登录跳转登录页面
			uni.navigateTo({
				url: `/pages/login/login?pageCode=${code}`,
				animationType: "slide-in-bottom"
			});
			reject();
		}
	})
}

/**     
 * @method  alert确认框       
 **/
const alert = function(params) {
	uni.showModal({
		title: params.title,
		content: params.content,
		showCancel: false,
		confirmColor: "#242424",
		success: (res) => {
			if (res.confirm) {
				params.success()
			}
		}
	})
}

/**     
 * @method 确认框       
 **/
const confirm = function(params) {
	uni.showModal({
		title: params.title,
		content: params.content,
		confirmColor: "#242424",
		success: (res) => {
			if (res.confirm) {
				params.success()
			} else if (res.cancel) {
				console.log('用户点击取消');
			}
		}
	})
}

/**     
 * @method 拼接图片路径
 * @param {String} domain 后台配置图片域名
 * @param {String} type 需要配置的模块 商品模块-goods
 * @param {String} goodID
 * @param {String} imageName 图片名称 英文冒号分割 detail_1.jpg;detail_2.jpg;
 * return String | Array   https://images.maiyidesan.cn/goods/018fsmw30000100/title1.jpg
 **/
const setImageUrl = function(params) {
	if (params.imageName) {
		let baseUrl = "";
		// let domain = store.state.imageDomain;
		let domain = BASE_IMAGE_URL_NO_SLASH;
		let type = params.type;
		let goodId = params.goodId;
		let imageName = params.imageName;
		let imgArr = _.split(imageName, ";");
		// 判断imageName是否带分号
		if (imgArr.length > 1) {
			let arr = [];
			_.forEach(imgArr, item => {
				arr.push({
					img: `${baseUrl}${domain}/${type}/${goodId}/${item}`
				})
			})
			return arr
		} else {
			return [{
				img: `${baseUrl}${domain}/${type}/${goodId}/${imageName}`
			}]
		}
	} else {
		return []
	}
}

/**
 * @method  获取图片完整地址
 * @param {String} img 图片地址
 **/
const getImageUrl = function(img) {
	if(img)
		return domainImg+img
	else
		return ""
}

/**     
 * @method 设置下拉刷新模式
 * @param {Boolean} isSupport 是否开启
 * @param {String} offset下拉刷新的起始位置
 **/
const setRefreshMode = function(isSupport, offset) {
	// upx转化为px
	let _offset = offset ? uni.upx2px(offset) + "px" : "0px";
	// #ifdef APP-PLUS
	const pages = getCurrentPages();
	const page = pages[pages.length - 1];
	var currentWebview = page.$getAppWebview();
	currentWebview.setStyle({
		pullToRefresh: {
			support: isSupport,
			offset: _offset, //仅对"circle"样式下拉刷新控件有效
			"style": "circle",
			"color": "#4c9bfa"
		}
	});
	// #endif
}

const calc = {
	/*
  函数，加法函数，用来得到精确的加法结果 
  说明：javascript的加法结果会有误差，在两个浮点数相加的时候会比较明显。这个函数返回较为精确的加法结果。
  参数：arg1：第一个加数；arg2第二个加数；d要保留的小数位数（可以不传此参数，如果不传则不处理小数位数）
  调用：calc.Add(arg1,arg2,d) 
  返回值：两数相加的结果
  */
	Add: function(arg1, arg2) {
		arg1 = arg1.toString(), arg2 = arg2.toString();
		var arg1Arr = arg1.split("."),
			arg2Arr = arg2.split("."),
			d1 = arg1Arr.length == 2 ? arg1Arr[1] : "",
			d2 = arg2Arr.length == 2 ? arg2Arr[1] : "";
		var maxLen = Math.max(d1.length, d2.length);
		var m = Math.pow(10, maxLen);
		var result = Number(((arg1 * m + arg2 * m) / m).toFixed(maxLen));
		var d = arguments[2];
		return typeof d === "number" ? Number((result).toFixed(d)) : result;
	},
	/*
	函数：减法函数，用来得到精确的减法结果 
	说明：函数返回较为精确的减法结果。 
	参数：arg1：第一个加数；arg2第二个加数；d要保留的小数位数（可以不传此参数，如果不传则不处理小数位数
	调用：calc.Sub(arg1,arg2) 
	返回值：两数相减的结果
	*/
	Sub: function(arg1, arg2) {
		return Calc.Add(arg1, -Number(arg2), arguments[2]);
	},
	/*
	函数：乘法函数，用来得到精确的乘法结果 
	说明：函数返回较为精确的乘法结果。 
	参数：arg1：第一个乘数；arg2第二个乘数；d要保留的小数位数（可以不传此参数，如果不传则不处理小数位数)
	调用：calc.Mul(arg1,arg2) 
	返回值：两数相乘的结果
	*/
	Mul: function(arg1, arg2) {
		var r1 = arg1.toString(),
			r2 = arg2.toString(),
			m, resultVal, d = arguments[2];
		m = (r1.split(".")[1] ? r1.split(".")[1].length : 0) + (r2.split(".")[1] ? r2.split(".")[1].length : 0);
		resultVal = Number(r1.replace(".", "")) * Number(r2.replace(".", "")) / Math.pow(10, m);
		return typeof d !== "number" ? Number(resultVal) : Number(resultVal.toFixed(parseInt(d)));
	},
	/*
	函数：除法函数，用来得到精确的除法结果 
	说明：函数返回较为精确的除法结果。 
	参数：arg1：除数；arg2被除数；d要保留的小数位数（可以不传此参数，如果不传则不处理小数位数)
	调用：calc.Div(arg1,arg2) 
	返回值：arg1除于arg2的结果
	*/
	Div: function(arg1, arg2) {
		var r1 = arg1.toString(),
			r2 = arg2.toString(),
			m, resultVal, d = arguments[2];
		m = (r2.split(".")[1] ? r2.split(".")[1].length : 0) - (r1.split(".")[1] ? r1.split(".")[1].length : 0);
		resultVal = Number(r1.replace(".", "")) / Number(r2.replace(".", "")) * Math.pow(10, m);
		return typeof d !== "number" ? Number(resultVal) : Number(resultVal.toFixed(parseInt(d)));
	}
};


export default {
	graceChecker,
	switchTab,
	guardToLogin,
	alert,
	confirm,
	setImageUrl,
	setRefreshMode,
	BASE_IMAGE_URL,
	calc,
	getImageUrl
}
