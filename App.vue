<script>
	import { mapMutations, mapState } from "vuex";
	import service from "./common/service.js";
	import userService from "./common/userService.js";
	import _  from 'lodash';
	import util from './common/util.js';
	
	export default {
		onLaunch: function() {
			console.log('App Launch');
			// #ifdef APP-PLUS
			// 锁定屏幕方向
			plus.screen.lockOrientation('portrait-primary'); //锁定
			// 检测升级
			uni.request({
				url: 'https://uniapp.dcloud.io/update', //检查更新的服务器地址
				data: {
					appid: plus.runtime.appid,
					version: plus.runtime.version,
					imei: plus.device.imei
				},
				success: (res) => {
					console.log('success', res);
					if (res.statusCode == 200 && res.data.isUpdate) {
						let openUrl = plus.os.name === 'iOS' ? res.data.iOS : res.data.Android;
						// 提醒用户更新
						uni.showModal({
							title: '更新提示',
							content: res.data.note ? res.data.note : '是否选择更新',
							success: (showResult) => {
								if (showResult.confirm) {
									plus.runtime.openURL(openUrl);
								}
							}
						})
					}
				}
			})
			// #endif
			// 获取缓存用户信息
			let userInfo = uni.getStorageSync('USERS_INFO');
			if(userInfo) {
				// 用户角色等级
				const userLevel = userInfo.role || 0;
				const userId = userInfo.id;
				/* // 获取购物车数据
				this.getCartList(userId); */
				// 获取收货地址
				userService.getAddress(userId);
				// 获取订单列表数据
				userService.getOrderList(userId);
				// 设置底部导航栏
				// this.setfooterBar(userLevel);
				// 缓存用户信息
				uni.setStorageSync('USERS_INFO', userInfo);
				// 同步store里面的用户名称，等级
				this.LOGIN(userInfo);	
			}
			//this.getConfigs();
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},
		// // 捕获 app error
		// onError(err) {
		// 	console.log(err)
		// },
		methods: {
			...mapMutations(['LOGIN', 'INIT_GOODS', 'INIT_ADDRESS', 'INIT_ORDERLIST', 'SET_CONFIGS']),
			// 获取后台相关配置
			getConfigs(){
				uni.showLoading({
					title: "加载中"
				})
				service.getConfigs().then(res=>{
					uni.hideLoading();
					let data = res.data.data;
					this.SET_CONFIGS(data);
				}).catch(err=>{
					uni.hideLoading();
					uni.showToast({
						icon: "none",
						title: err.errMsg,
					})
				})
			},
			//  购物车商品列表分两步查询，先查询产品ids，再通过ids查询产品详细信息
			// 先查询产品ids
			getCartList(userId){
				uni.showLoading();
				service.getCartList(userId).then(res=>{
					uni.hideLoading();
					const data = res.data.data.data;
					if(data.length > 0) {
						// 通过ids批量查询商品详情
						this.getCartListDetail(data);
					} else {
						// 同步购物车数据;
						this.INIT_GOODS([]);
					}
				}).catch(err=>{
					uni.hideLoading();
					uni.showToast({
						icon: 'none',
						title: err.errMsg,
					});
				})
			},
			// 通过ids查询产品详细信息
			getCartListDetail(cartData){
				// 配置查询ids数组
				let goodsId = []
				_.forEach(cartData, item => {
					goodsId.push(item.goodsId);
				})
				uni.showLoading();
				service.getGoodListById({ids: goodsId}).then(res=>{
					uni.hideLoading();
					let data = res.data.data;
					
					// 需要对比的数组
					let contrastArr = [];
					_.forEach(data, item => {
						contrastArr.push(item.id);
					})
					// 筛选哪些产品失效了
					let removedGoods = this.getRemovedGoods(goodsId, contrastArr);
					let goodsList = [];
					// 组建购物车产品列表
					_.forEach(cartData, item => {
						// 判断当前产品是否失效
						let removedIndex = this.getIndex(item.goodsId, removedGoods, "");
						// 获取购物车中当前产品在详情数组中的下标
						let currentIndex = this.getIndex(item.goodsId, data, "id");
						// 查询是否有相应的规格
						let standardIndex = this.getIndex(item.standardId , data[currentIndex].standard, "id");
						goodsList.push({
							scrollLeft: 0,
							// 是否被选中
							isChecked: false,
							// 商品是否不能选中
							isDisabled: removedIndex > -1 ? true : (standardIndex > -1 ? false : true),
							// 数据id，删除时有用
							id: item.id,
							// 商品id
							goodsId: item.goodsId,
							// 商品数量
							num: item.num,
							// 规格id
							standardId: item.standardId,
							// 价格  下架展示为空，未下架优先展示规格里面的单价
							price: removedIndex > -1 ? "" : (standardIndex > -1 ? data[currentIndex].standard[standardIndex].price : data[currentIndex].price),
							// 商品标题
							title: removedIndex > -1 ? "亲，所选商品已经下架了哦" : data[currentIndex].title,
							// 规格描述
							standardText: removedIndex > -1 ? "" : (standardIndex > -1 ? data[currentIndex].standard[standardIndex].title : ""),
							// 商品是否失效, 实时查询的产品无此规格，则表示商品失效
							isInvalid: standardIndex > -1 ? false : true,
							imageUrl: removedIndex > -1 ? "/static/img/logo@0.5x.png" : util.setImageUrl({
								type: "goods",
								goodId: item.goodsId,
								imageName: standardIndex > -1 ? (data[currentIndex].standard[standardIndex].imageUrl || data[currentIndex].imageUrl) : data[currentIndex].imageUrl
							})[0].img,
						})
					})
					// 同步购物车数据;
					this.INIT_GOODS(goodsList);
				}).catch(err=>{
					console.log(err)
					uni.hideLoading();
					uni.showToast({
						icon: "none",
						title:  err.errMsg,
					})
				})
			},
			// 根据id查询对应下标
			getIndex(id, arr, key){
				return key ? _.findIndex(arr, item => id === item[key]) : _.findIndex(arr, item => id === item);
			},
			// 筛选哪些产品失效了
			getRemovedGoods(arr, arr2){
				return _.difference(arr, arr2)
			},
			// 获取收货地址数据
			getAddress(userId){
				if(!userId) {
					return
				}
				let params = {
					userId: userId,
				}
				uni.showLoading({
					title: "加载中"
				})
				// 获取用户收获地址列表
				userService.getAddressList().then(res=>{
					uni.hideLoading();
					let data = res.data.data;
					if(data.length > 0) {
						this.INIT_ADDRESS(data);
					} 
				}).catch(err=>{
					uni.hideLoading();
					uni.showToast({
						icon: "none",
						title: err.errMsg,
					})
				})
			},
			// 获取订单列表
			getOrderList(userId){
				if(!userId) {
					return
				}
				let params = {
					userId: userId,
					status: "", // 查询全部
					page: 1,
					pageSize: 1000
				}
				uni.showLoading({
					title: "加载中"
				})
				// 获取用户收获地址列表
				userService.getOrderList(params).then(res=>{
					uni.hideLoading();
					let data = res.data.data.data;
					if(data.length > 0) {
						this.INIT_ORDERLIST(data);
					} 
				}).catch(err=>{
					uni.hideLoading();
					uni.showToast({
						icon: "none",
						title: err.errMsg,
					})
				})
			},
			// 设置不同的tabbar
			setfooterBar(userLevel) {
				// 用户等级大于1的才能看到会员中心
				let barType =  userLevel >= 1 ? "menu_5" : "menu_4";
				// 触发设置导航
				this.$store.dispatch(barType);
				// 切换导航下标
				this.$store.dispatch("change_page", this.pageCode);
			}
		}
		
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	@import "./static/css/uni.css";
	// 引入字体文件
	@import "./static/css/font/iconfont.css";

	// 顶部导航栏全局配置
	.uni-navbar {
		color: $uni-text-color-status !important;
		margin-top: 0;
		/*  #ifdef  APP-PLUS  */
		margin-top: var(--status-bar-height); //表示状态栏的高度。

		/*  #endif  */
		.uni-navbar__content {
			padding: 0 20upx;
			box-sizing: border-box;
			box-shadow: none;
			border: none;
		}
	}

	// 全局多列选择的样式
	.mpvue-picker-view {
		color: #000;
	}

	// 全局swiper的样式
	.swiper {
		.uni-swiper-wrapper {
			overflow: visible !important;

			.uni-swiper-dots {
				bottom: -40upx !important;

				.uni-swiper-dot {
					border-radius: 0 !important;
				}

				.uni-swiper-dot-active {
					width: 30upx !important;
				}
			}
		}
	}
	.uni-list .uni-list-item .uni-list-item__icon .uni-list-item__icon-img{
		width: 36upx;
		height: 36upx;
		margin-right: 20upx;
		image{
			width: 100%;
			height: 100%;
		}
	}

	// 全局的button样式
	.btn-primary {
		margin-top: 96upx;

		button {
			height: 100upx;
			width: 100%;
			line-height: 100upx;
			color: #ffffff;
			font-size: 30upx;
			outline: 0;
			display: block;
			margin: 0;
			font-family: inherit;
			background: #242424;
			opacity: 1;
			border-radius: 2upx;
		}
	}
	// 全局 蓝色价格字体样式
	.text-price {
		color: #59a0fa !important;
		font-size: 28upx;
	}
	// 水平垂直居中
	.flex-center-center {
		display: flex;
		justify-content: center;
		align-items: center;

	}
	// 右对齐
	.flex-right {
		justify-content: flex-end;
	}

	// 占位条
	.place-bar {
		width: 100%;
		height: 30upx;
		background-color: #f0f0f0;
	}
	// 占位条-20upx
	.place-bar-20 {
		width: 100%;
		height: 20upx;
		background-color: #f0f0f0;
	}
	// 灰色字体
	.text-color-gray {
		color: #888 !important;
	}
	// 白色字体
	.text-color-white {
		color: #fff !important;
	}

	.common-pa-30 {
		padding: 30upx;
		box-sizing: border-box;
	}

	.common-pl-20 {
		padding-left: 20upx;
		box-sizing: border-box;
	}

	.common-pr-20 {
		padding-right: 20upx;
		box-sizing: border-box;
	}

	.common-ma-30 {
		margin: 30upx;
	}

	.common-ml-20 {
		margin-left: 20upx;
	}

	.common-mr-20 {
		margin-right: 20upx;
	}

	// 字体颜色和大小
	.big-title {
		font-size: $uni-font-size-title;
		color: $uni-color-title;
	}

	.sub-title {
		font-size: $uni-font-size-lg;
		color: $uni-color-title;
	}

	.tab-sub-title {
		font-size: $uni-font-size-lg;
		color: $uni-color-title;
		font-weight: 600;
	}
</style>
