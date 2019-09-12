<template>
	<view class="nearbyPage">
		<!-- 状态栏 -->
		<statusBar></statusBar>
		<!-- 导航栏 -->
		<view class="nav-bar uni-row">
			<view class="left uni-flex uni-row">
				<text>{{picker.pickerText}}</text>
				<view class="icon">
					<uni-icon type="arrowdown" size="18"></uni-icon>
				</view>
			</view>
			<view class="mpvue-picer">
				<mpvue-picker ref="mpvuePicker" :mode="picker.mode" :deepLength="picker.deepLength" :pickerValueDefault="picker.pickerValueDefault"
				 :themeColor="picker.themeColor" @onChange="onChange" @onConfirm="onConfirm" @onCancel="onCancel" :pickerValueArray="picker.pickerValueArray"></mpvue-picker>
			</view>
			<!-- 订单 -->
			<view class="right" @tap="toOrderList">
				<view class="iconfont iconicon_order">
					
				</view>
			</view>
		</view>
		<!-- 搜索框 -->
		<view class="search-wrap">
			<view class="search uni-flex" @tap="toSearch()">
				<view class="icon uni-inline-item flex-center-center">
					<uni-icon type="search" size="20"></uni-icon>
				</view>
				<view class="input uni-flex-item uni-text-small">
					输入商品名称,类型
				</view>
			</view>
		</view>
		<!-- 探店 -->
		<view class="content">
			<!-- 轮播图 -->
			<customSwiper :swiperList="swiperList" @toSwiper="toSwiper" :isDotsInside="false"></customSwiper>

			<!-- 附近热店 -->
			<view class="hot-shop">
				<view class="uni-h4">
					附近热店
				</view>
				<view class="shop-list flex-center-center" v-for="(item, index) in shopList" :key="index" @tap="toShopIndex(item.shopId,item.distance)">
					<view class="img">
						<image :src="item.imgpath" mode="aspectFit" style="opacity: 0.1;"></image>
					</view>
					<view class="info">
						<view class="name">
							<text>{{item.shopName}}</text>
							<text class="distance">{{item.distance}}m</text>
						</view>
						<view class="tags">
							<view class="tag">
								{{item.type}}
							</view>
							<!-- <view class="tag" v-for="(tag, index2) in item.tags" :key="index2">
								{{item.tag}}
							</view> -->
						</view>
						<view class="location uni-flex uni-row" @tap="toMap(item.location)">
							<view class="icon uni-inline-item">
								<uni-icon type="location" size="16"></uni-icon>
							</view>
							<text class="location uni-flex-item">{{item.shopAddress}}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		uniIcon,
		uniNavBar
	} from '@dcloudio/uni-ui';
	import mpvuePicker from 'mpvue-picker';
	import cityData from "../../common/city.data.js";
	import customSwiper from "../../components/common/custom-swiper.vue";
	//高德SDK
	import amap from '../../common/SDK/amap-wx.js';
	import util from "../../common/util.js";
	import userService from "../../common/userService.js";
	// var swiperList = [{
	// 		sid: 0,
	// 		src: '自定义src0',
	// 		img: '/static/img/common/banner1.jpg',
	// 	},
	// 	{
	// 		sid: 1,
	// 		src: '自定义src1',
	// 		img: '/static/img/common/banner2.jpg'
	// 	},
	// 	{
	// 		sid: 2,
	// 		src: '自定义src2',
	// 		img: '/static/img/common/banner3.jpg'
	// 	},
	// 	{
	// 		sid: 3,
	// 		src: '自定义src3',
	// 		img: '/static/img/common/banner4.jpg'
	// 	}
	// ]
	export default {
		components: {
			uniIcon,
			uniNavBar,
			mpvuePicker,
			customSwiper
		},
		data() {
			return {
				// 底部导航类型 SHOP-探店，ORDER-订单
				markers: [],
				shopList: [],
				lon:"39.905829",
				lat:"116.478675",
				picker: {
					mode: 'multiLinkageSelector',
					deepLength: 2, // 几级联动
					pickerValueDefault: [], // 初始化值
					pickerValueArray: [], // picker 数组值
					pickerText: '',
					themeColor: '#000', // 颜色主题
				},
				//轮播
				swiperList: [],
			};
		},
		created() {
			this.init()
		},
		//下拉刷新，在组件中不支持onPullDownRefresh触发下拉刷新，改写成自定义方法pullDownRefresh
		// onPullDownRefresh() {},
		methods: {
			init(){
				// #ifdef APP-PLUS
				// 下拉刷新的起始位置(状态栏高度+导航栏高度+导航tab的高度)
				const offset = uni.getSystemInfoSync().statusBarHeight + 100 + 126;
				util.setRefreshMode(true, offset);
				// #endif
				this.getPosition();
			},
			// 自定义方法刷新，在index.vue首页文件中调用
			pullDownRefresh() {
				this.init()
			},
			// 获取当前地图定位
			getPosition(){
				uni.showLoading({
					title: "加载中..."
				})
				this.amapPlugin = new amap.AMapWX({
					//高德地图KEY，参考：http://ask.dcloud.net.cn/article/35070
					key: '7da2bb476a91a511d0c3b6626f7be558'
				});
				//定位地址
				this.amapPlugin.getRegeo({
					success: data => {
						this.picker.pickerText = data[0].name;
						this.lon=data[0].longitude
						this.lat=data[0].latitude
						this.getNearShop()
					}
				});
			},
			getNearShop() {
					let params = {"lon": this.lon,"lat": this.lat}
					uni.showLoading();
					userService.getNearShop(params).then(res => {
					uni.hideLoading();
					if(res.data.code=="200")
					{
						let data=res.data.result
						for(let i in data)
						{
							data[i].imgpath = util.getImageUrl(data[i].imgpath)
							this.swiperList.push({id: data[i].shopId,img: data[i].imgpath,distance:data[i].distance})
						}
						this.shopList=data
					}
				}).catch(err => {
					uni.hideLoading();
					uni.showToast({
						icon: "none",
						title: err.errMsg
					})
				})
			},
			//轮播图预览
			toSwiper(e) {
				this.toShopIndex(e.id,e.distance);
			},
			// 二级联动
			showPicker() {
				if (this.barType == 'ORDER') {
					return
				}
				this.picker.pickerValueArray = cityData;
				this.$refs.mpvuePicker.show();
			},
			onConfirm(e) {
				console.log(e);
				// this.pickerText = e.label;
				if (e && e.label) {
					this.picker.pickerText = e.label.replace('-', '·');
				}
			},
			onChange(e) {
				console.log(e);
			},
			onCancel(e) {
				console.log(e);
			},
			// 订单列表跳转
			toOrderList(){
				uni.navigateTo({
					url: '/pages/nearby/order_list'
				})
			},
			//搜索跳转
			toSearch() {
				uni.navigateTo({
					url: '/pages/home/search'
				})
			},
			// 店铺首页
			toShopIndex(id,distance){
				uni.navigateTo({
					url: `/pages/nearby/shop_index?id=${id}&distance=${distance}`
				})
			},
			// 跳转地图
			toMap(location){
				console.log(location);
				let arr =  location.split(",")
				let latitude = arr[1] || 30.503974;
				let longitude = arr[0] || 114.424647;
				uni.navigateTo({
					url: `/pages/nearby/map?latitude=${latitude}&longitude=${longitude}`
				})
			}
		}
	}
</script>

<style lang="scss">
	.nearbyPage {
		.nav-bar {
			position: fixed;
			width: 100%;
			height: 88upx;
			background-color: $uni-bg-color-status;
			color: $uni-text-color-status;
			top: 0;
			/*  #ifdef  APP-PLUS  */
			top: var(--status-bar-height);
			/*  #endif  */
			z-index: 996;
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 0 30upx;
			box-sizing: border-box;
		}

		.search-wrap {
			width: 100%;
			height: 112upx;
			display: flex;
			justify-content: center;
			align-items: center;
			position: fixed;
			top: 88upx;
			/*  #ifdef  APP-PLUS  */
			top: calc(var(--status-bar-height) + 88upx);
			/*  #endif  */
			z-index: 996;
			background-color: #fff;
			padding: 0 30upx;
			box-sizing: border-box;

			.search {
				width: 100%;
				height: 56upx;
				line-height: 56upx;
				background-color: #f0f0f0;
				color: #999;
				font-size: 28upx;
				border-radius: 4upx;

				.icon {
					width: 56upx;
					height: 56upx;
					color: #666;
				}

				.input {
					line-height: 56upx;
				}
			}
		}

		.content {
			width: 100%;
			margin-top: 200upx;
			/*  #ifdef  APP-PLUS  */
			margin-top: calc(var(--status-bar-height) + 200upx);
			/*  #endif  */
			padding-bottom: 100upx;

			.hot-shop {
				background-color: #fff;
				padding: 20upx 30upx;
				box-sizing: border-box;

				.shop-list {
					display: flex;
					border-bottom: 1upx solid #eee;
					padding: 20upx 0;
					box-sizing: border-box;

					.img {
						width: 150upx;
						height: 150upx;

						image {
							width: 100%;
							height: 100%;

						}

					}

					.info {
						width: calc(100% - 150upx);
						padding-left: 20upx;

						.name {
							display: flex;
							align-items: center;
							justify-content: space-between;
							line-height: 1;
							font-weight: 600;
							font-size: 32upx;

							.distance {
								font-weight: 100;
								font-size: 24upx;
							}
						}

						.tag {
							max-width: max-content;
							background-color: #e6f2ff;
							color: #037dfa;
							font-size: 22upx;
							margin: 16upx 0;
							padding: 0 8upx;
							box-sizing: border-box;
						}

						.location {
							width: 100%;
							line-height: 1;
							font-size: 24upx;
							color: #999;
							position: relative;
							box-sizing: border-box;
						}
					}
				}
			}
		}

		.footer {
			width: 100%;
			height: 100upx;
			position: fixed;
			bottom: 0;
			background-color: #eee;
			color: #999;

			.actived {
				color: #000;
			}
		}
	}
</style>
