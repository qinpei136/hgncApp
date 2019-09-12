<template>
	<view class="shopIndexPage">
		<!-- 分享 -->
		<share :shareObj="shareObj" ref="shareChild"></share>
		
		<!-- 内容部分 -->
		<view class="content">
			<!-- 轮播图 -->
			<customSwiper :swiperList="flowImages" @toSwiper="toSwiper" :height="520"></customSwiper>
			
			<!-- 店铺信息 -->
			<view class="shop-info">
				<view class="title">
					<view class="name uni-h5 uni-bold">
						{{name}}
					</view>
					<view class="tags uni-flex uni-row">
						<text class="tag uni-inline-item" v-for="(tag, index) in tags" :key="index">
							{{tag}}
						</text>
					</view>
				</view>
				<!-- 地址 -->
				<view class="address-wrap uni-flex uni-row">
					<view class="icon-left uni-inline-item common-mr-20">
						<view class="iconfont iconaddress"></view>
					</view>
					<view class="address-center uni-inline-item" @tap="toMap">
						<view class="address">
							{{address}}
						</view>
						<view class="distance uni-text-small text-color-gray">
							距离您{{distance}}km
						</view>
					</view>
					<view class="icon-right uni-inline-item" @tap="callUp">
						<view class="iconfont iconicon_telephone"></view>
					</view>
				</view>
			</view>
			
			<!-- 店铺商品 -->
			<view class="goods-wrap common-pa-30">
				<view class="title uni-h4">
					店铺商品
				</view>
				<view class="goodsList">
					<view class="good" v-for="(item, index) in goodsList" :key="index" @tap="toGoodsDetail(item.goods_id)">
						<view class="uni-media-list-logo">
							<image class="image" lazy-load :src="item.img" />
						</view>
						<view class="name">{{item.name}}</view>
						<view class="info">
							<view class="price">{{item.price}}</view>
							<view class="slogan">{{item.slogan}}</view>
						</view>	
					</view>
				</view>
			</view>
			
			<!-- 店铺详情 -->
			<view class="shop-detail common-pa-30">
				<view class="title uni-h4">
					店铺详情
				</view>
				<view class="detail-text text-color-gray">
					{{detail}}
				</view>
			</view>
			
			<!-- 底部信息 -->
			<bottomInfo></bottomInfo>
		</view>
	</view>
</template>
<script>
	import customSwiper from "../../components/common/custom-swiper.vue";
	import share from "../../components/common/share.vue";
	import userService from "../../common/userService.js";
	import util from '../../common/util.js';
	
	
	export default {
		components: {
			share,
			customSwiper
		},
		data() {
			return {
				shopId:"",
				// 轮播图
				flowImages: [],
				// 店铺名称
				name: "",
				// 店铺标签
				tags: [],
				// 店铺地址
				address: "",
				// 店铺距离
				distance: 0,
				// 店铺电话
				telphone: "",
				// 店铺商品
				goodsList: [],
				// 店铺详情
				detail: "",
				// 分享的内容
				shareObj:{
					// 分享链接
					strShareUrl: "",
					// 分享标题
					strShareTitle: "",
					// 内容描述
					strShareSummary: "",
					// 分享图标
					strShareImageUrl: ""
				},
			}
		},
		methods: {
			init() {
				this.getShopInfo();
			},
			// 获取店铺信息
			getShopInfo() {
				let params = {"shopId": this.shopId}
				uni.showLoading();
				userService.getAllShopGoods(params).then(res => {
					uni.hideLoading();
					if(res.data.code=="200")
					{
						let shop=res.data.result.tShop
						let goods=res.data.result.tShopGoods
						// this.flowImages = swiperList;
						this.name =shop.shopName;
						this.tags = [shop.type];
						this.address = shop.shopAddress;
						this.telphone = shop.phone;
						this.detail =shop.shopNotice
						for(var i in goods)
						{
							let imgUrl=util.getImageUrl(goods[i].imageUrl)
							this.goodsList.push({
								"goods_id": goods[i].id,
								"img": imgUrl,
								"name": goods[i].title,
								"price": goods[i].price
							})
							
							this.flowImages.push({"id": goods[i].id,"img": imgUrl})
						}
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
				uni.previewImage({
					urls: [e.img]
				});
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
			},
			// 商品详情
			toGoodsDetail(id){
				uni.navigateTo({
					url: `/pages/nearby/goods_detail?id=${id}`
				})
			},
			// 
			callUp(){
				uni.showModal({
					title: "是否确定拨打电话？",
					content: this.telphone,
					success:  (res) => {
						if (res.confirm) {
							uni.makePhoneCall({
								phoneNumber: this.telphone 
							});
						} 
					}
				})
			}
		},
		onNavigationBarButtonTap(e) {
			// if(this.id) {
				// 定义分享内容
				this.shareObj = {
					// 分享链接
					strShareUrl: "https://uniapp.dcloud.io",
					// 分享标题
					strShareTitle: this.title,
					// 内容描述
					strShareSummary: this.detail,
					// 分享图标
					strShareImageUrl: this.imageUrl
				}
				// 调用分享组件里面的分享方法
				if(e.index === 0) {
					this.$refs.shareChild.openShareBox();
				}
			// }
		},
		onLoad(option) {
			this.shopId = option.id;
			this.distance = option.distance;
			this.init();
		}
	}
</script>

<style lang="scss">
	page{
		background-color: #f0f0f0;
	}
	.shopIndexPage{
		.content{
			.shop-info{
				background-color: #fff;
				padding: 0 30upx;
				margin-bottom: 30upx;
				.title{
					padding: 20upx 0;
					border-bottom: 1upx solid #f0f0f0;
					.name{
						
					}
					.tag{
						font-size: 20upx;
						background-color: #e9f2ff;
						color: #057ffa;
						margin-right: 10upx;
						padding: 3upx 8upx;
						box-sizing: border-box;
					}
				}
				.address-wrap{
					width: 100%;
					padding: 20upx 0upx;
					box-sizing: border-box;
					.icon-left{
						width: 40upx;
					}
					.address-center{
						flex: 1 1 0%;
						display: flex;
						flex-direction: column !important;
						align-items: flex-start !important;
					}
					.icon-right{
						width: 96upx;
						flex-direction: row-reverse;
					}
				}
			}
			.goods-wrap{
				background-color: #fff;
				margin-bottom: 30upx;
				.title{
					padding-bottom: 20upx;
				}
				.goodsList{
					width: 100%;
					display: flex;
					justify-content: space-between;
					flex-wrap: wrap;
					box-sizing: border-box;
								
					.good {
						width: 47.75%;
						border-radius: 20upx;
						background-color: #fff;
						margin: 0 0 15upx 0;
						
						.uni-media-list-logo {
							width: 100%;
							height: 300upx;
							position: relative;
						}
						
						.uni-media-list-logo .image {
							position: absolute;
						}
								
						.name {
							width: 100%;
							padding: 10upx 0;
							display: -webkit-box;
							-webkit-box-orient: vertical;
							-webkit-line-clamp: 2;
							overflow: hidden;
							font-weight: 400;
							font-size: 26upx;
						}
								
						.info {
							display: flex;
							justify-content: space-between;
							align-items: center;
							width: 100%;
							font-weight: 100;
								
							.price {
								color: #4c9bfa;
								font-size: 30upx;
								font-weight: 600;
							}
								
							.slogan {
								color: #c2c2c2;
								font-size: 24upx;
							}
						}
					}
				}
			}
			.shop-detail{
				background-color: #fff;
				.title{
					padding-bottom: 20upx;
				}
			}
		}
	}
</style>
