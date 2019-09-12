<template>
	<view class="shop-goodsDetail-page">
		<!-- 分享 -->
		<share :shareObj="shareObj" ref="shareChild"></share>
		<!-- 轮播图 -->
		<customSwiper :swiperList="flowImages" @toSwiper="toSwiper" :height="520"></customSwiper>
		
		<!-- 商品信息 -->
		<view class="goods-info common-pa-30">
			<view class="title uni-h5 uni-bold">
				{{name}}
			</view>
			<view class="details uni-text-small text-color-gray">
				{{details}}
			</view>
			<view class="price-box uni-flex">
				<view class="uni-flex-item">
					<view class="text-price price">
						M币{{mPrice}}枚
					</view>
					<view class="price-tag uni-flex-item uni-flex">
						<view class="vPrice">
							<text class="value uni-text-small">￥{{vPrice}}</text>
							<!-- <text class="tag uni-text-small">会员价</text> -->
						</view>
						<!-- <view class="sPrice">
							<text class="value uni-text-small">￥{{sPrice}}</text>
							<text class="tag uni-text-small">市场价</text>
						</view> -->
					</view>
				</view>
				<view class="uni-flex-item number-box">
					<uni-number-box :min="1" @change="changeNum" :value="num"></uni-number-box>
				</view>
			</view>
		</view>
		
		<!-- 商品详情图 -->
		<view class="detail-image common-pa-30">
			<view class="title uni-h4">
				商品详情
			</view>
			<!-- <rich-text :nodes="detailImagesNode"></rich-text> -->
			<view class="image">
				<image :src="detailImg" mode="widthFix"></image>
			</view>
		</view>
		
		<!-- 底部信息 -->
		<bottomInfo></bottomInfo>
		
		<view class="goods-footer uni-flex">
			<view class="cart uni-inline-item">
				<view class="iconfont iconicon_shoppingcart_nor" @tap="toCart"></view>
				<!-- <uni-badge :text="total_num" type="primary" v-if="total_num - 0 > 0"></uni-badge> -->
				<uni-badge :text="num" type="primary" v-if="num - 0 > 0"></uni-badge>
			</view>
			<view class="btn total uni-flex-item">
				总计：
				<text class="text-price uni-bold">￥{{total_price}}</text>
			</view>
			<view class="btn to-buy uni-inline-item uni-center" @tap="toBuy()">
				立即购买
			</view>
		</view>
	
	</view>
</template>

<script>
	import {
		uniIcon,
		uniBadge,
		uniNumberBox
	} from '@dcloudio/uni-ui';
	import { mapMutations, mapGetters } from 'vuex';
	import util from '../../common/util.js';
	import userService from '../../common/userService.js';
	import share from "../../components/common/share.vue";
	import customSwiper from "../../components/common/custom-swiper.vue";
	export default {
		components: {
			uniIcon,
			uniBadge,
			share,
			customSwiper,
			uniNumberBox
		},
		data() {
			return {
				// 商品id
				id: "",
				// 商品名称
				name: "",
				// 商品描述
				details: "",
				// 商品M币价格
				mPrice: "",
				// 商品会员价
				vPrice: "",
				// 商品市场价
				sPrice: "",
				// 商品数量
				num: 1,
				// 图文详情
				detailImages: [],
				// 图文详情的节点
				detailImagesNode: [],
				// 传给订单的小图片
				imageUrl: "",
				// 轮播图
				flowImages: [],
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
				"detailImg":""
			}
		},
		computed: {
			...mapGetters(["total_num"]),
			total_price() {
				return this.mPrice * this.num
			}
		},
		methods: {
			...mapMutations(['INIT_ORDER_lIST']),
			init(){
				// this.name = "阿萨德就好啦跨世纪的";
				// this.details = "alsdkjflasjdfa看是否卡事件返回";
				// this.mPrice = 320;
				// this.vPrice = 200;
				// this.sPrice = 300;
				uni.showLoading();
				let params = {"id": this.id}
				userService.getShopGoodById(params).then(res=>{
					uni.hideLoading();
					if(res.data.code=="200")
					{
						let data = res.data.result;
						this.name = data.title;
						this.details = data.detail;
						this.mPrice = data.mb;
						this.vPrice = data.price;
						// 配置轮播图片
						this.imageUrl=util.getImageUrl(data.imageUrl)
						this.flowImages.push({"id": data.id,"img": this.imageUrl});
						// 配置图文详情图片
						this.detailImg = util.getImageUrl(data.detailImages)
						// 初始化图文详情
						// this.detailImagesNode = this.initImagesNode(this.detailImages);
						// 初始化规格相关信息
						// if(data[0].standard.length > 0) {
						// 	// 有规格
						// 	this.specTitle = data[0].standardTitle;
						// 	this.specList = this.initSpecList(data[0].standard);
						// 	//  默认选中第一条
						// 	this.specList[0].selected = true;
						// 	this.specSelected = {
						// 		id: this.specList[0].id,
						// 		title: this.specList[0].title,
						// 		price: this.specList[0].price,
						// 		inventory: this.specList[0].inventory,
						// 		// 配置规格展示图片
						// 		imageUrl: util.setImageUrl({
						// 			type: "goods",
						// 			goodId: this.specList[0].id,
						// 			imageName: this.specList[0].imageUrl
						// 		})
						// 	}
						// 	} else {
						// 		// 无规格
						// 		this.specSelected = {
						// 			id: "",
						// 			title: "",
						// 			price: data[0].price,
						// 			inventory: data[0].inventory,
						// 		}
						// 	}					
							
					}
				}).catch(err=>{
				console.log(err)
					uni.hideLoading();
					uni.showToast({
						icon: "none",
						title:  err.errMsg,
					})
				})
				
			},
			// 初始化图文详情
			initImagesNode(images){
				let imagsNodes = [];
				_.forEach(images, item => {
					imagsNodes.push(`<img style="width:100%;display:block;" src="${item.img}" />`)
				})
				return `<div style="width:100%">${imagsNodes.join('')}</div>`;
			},
			//轮播图预览
			toSwiper(e) {
				uni.previewImage({
					urls: [e.img]
				});
			},
			// 修改加入购物车产品数量
			changeNum(value){
				this.num = value;
			},
			// 跳转购物车
			toCart(){
				// 判断是否登录
				this.$guardToLogin().then(()=>{
					// 模拟底部跳转
					util.switchTab("shopCart");
				}).catch(()=>{});
			},
			// 购买
			toBuy(type){
				// 判断是否登录
				this.$guardToLogin().then(()=>{
					// 创建订单
					this.creatOrder();
				}).catch(()=>{});
			},
			// 创建订单；
			creatOrder(){
				let params = [{"ShopGoodsId": this.id,"num": this.num}]
					uni.showLoading();
					userService.postShopOrder(params).then(res => {
					uni.hideLoading();
					if(res.data.code=="200")
					{
						let orderId=res.data.result[0]
						// 同步vuex
						let data = {
							goodsId: this.id,
							title: this.name,
							imageUrl: this.imageUrl,
							num: this.num,
							price: this.mPrice
						}
						// 缓存订单数据
						this.INIT_ORDER_lIST([data]);
						// 跳转到支付页面
						uni.navigateTo({
							url: `/pages/nearby/order_pay?orderId=`+orderId
						});
					}
				}).catch(err => {
					uni.hideLoading();
					uni.showToast({
						icon: "none",
						title: err.errMsg
					})
				})
				
			},
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
		onLoad(e) {
			this.id = e.id;
			this.init();
		},
		
	}
</script>

<style lang="scss">
	page{
		background-color: #f0f0f0;
	}
	.shop-goodsDetail-page {
		margin-bottom: 100upx;
		
		.goods-info {
			background-color: #fff;
			margin-bottom: 30upx;
			.price-box{
				.price{
					font-size: 48upx;
				}
				.price-tag{
					
					.tag{
						color: #fff;
						font-size: 20upx;
						padding: 2upx 6upx;
						margin-left: 10upx;
					}
					.vPrice{
						margin-right: 20upx;
						.value{
							color: #242424;
						}
						.tag{
							background-color: #242424;
						}
					}
					.sPrice{
						.value{
							color: #999;
							text-decoration: line-through;
						}
						.tag{
							background-color: #999;
						}
					}
				}
				.number-box{
					display: flex;
					align-items: center;
					justify-content: flex-end;
					.uni-numbox{
						transform: scale(0.85);
						transform-origin: left;
					}
				}
			}
		}

		.detail-image{
			background-color: #fff;
		}
		.goods-footer {
			width: 100%;
			height: 100upx;
			position: fixed;
			bottom: 0;
			background-color: #fff;
			.btn{
				font-size: 30upx;
				display: flex;
				align-items: center;
				justify-content: center;
			}
			.cart{
				width: 100upx;
				padding-left: 30upx;
				box-sizing: border-box;
				display: flex;
				align-items: center;
				justify-content: start !important;
				position: relative;
				.uni-badge{
					position: absolute;
					top: 16upx;
					left: 36upx;
				}
			}
			.total{
				text-align: left;
				background-color: #fff;
				color: #242424;
				display: flex;
				justify-content: flex-start;
			}
			.to-buy{
				width: 290upx;
				background-color: #242424;;
				color: #fff;
				
			}
		}
	}
</style>
