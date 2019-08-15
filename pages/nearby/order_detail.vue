<template>
	<view class="nearby-orderDetail-page">
		<uni-notice-bar 
			show-close="true"
			show-icon="true" 
			scrollable="true" single="true" 
			:text="notice">
		</uni-notice-bar>
		
		<view class="order-list">
			<!-- 店铺名称，订单状态 -->
			<view class="title-wrap uni-flex bg-white padding-30-lr" @tap="toShopIndex(shopId)">
				<view class="iconfont icondianpu uni-inline-item"></view>
				<view class="title uni-h5 uni-flex-item uni-flex">
					<view class="name uni-inline-item">
						{{shopName}}
					</view>
					<view class="icon uni-inline-item text-color-gray">
						<uniIcon type="arrowright" size="18"></uniIcon>
					</view>
				</view>
				<view class="order-status uni-inline-item text-color-gray">
					{{orderStatus}}
				</view>
			</view>
			
			<!-- 商品信息 -->
			<view class="goods-info bg-white padding-30-lr uni-flex">
				<view class="image uni-inline-item">
					<image :src="imgUrl" mode="aspectFit"></image>
				</view>
				<view class="info uni-flex-item uni-flex uni-column">
					<view class="title-box uni-h5 uni-flex uni-row">
						<view class="title uni-flex-item">
							{{goodsTitle}}
							<text class="num">X{{num}}</text>
						</view>

						<view class="uni-flex-item total-price text-price uni-bold">
							￥<text>{{goodsPrice}}</text>
						</view>
					</view>
					<view class="tags uni-flex">
						<view class="tags uni-flex-item uni-text-small text-color-gray">
							{{tags}}
						</view> 
						<view class="btn uni-inline-item" @tap="toGoodsDetail(goodsId)">
							<button type="primary" size="mini" style="border:1upx solid #c6c6c6;color:#242424;background-color:#fff;border-radius:0;font-weight:bold;">再来一单</button>
						</view>
					</view>
				</view>
				
			</view>
			
			<!-- 订单信息 -->
			<view class="order-info bg-white padding-30-lr">
				<view class="order-info-item uni-column uni-flex">
					<text>订单编号：{{orderCode}}</text>
					<text>订单时间：{{orderTime}}</text>
				</view>
				<view class="order-info-item  uni-column uni-flex">
					<text>支付方式：{{payType}}</text>
					<text>支付时间：{{payTime}}</text>
				</view>
				<view class="order-info-item uni-flex">
					<text class="uni-flex-item">
						商品总额：
					</text>
					<text class="uni-flex-item" style="text-align: right;">￥{{totalPrice}}</text>
				</view>	
			</view>
		</view>
		
		<!-- 底部实付款 -->
		<view class="footer padding-30-lr">
			实付款：<view class="text-price uni-bold" style="display: inline-block;">￥{{actualPayment}}</view>
		</view>
	</view>
</template>

<script>
	import {
		uniIcon,
		uniNoticeBar
	} from '@dcloudio/uni-ui'; 
	export default{
		components: {
			uniIcon,
			uniNoticeBar		
		},
		data() {
			return {
				// 提示
				notice: "为了您的财产安全，不要点击陌生连接，不要向任何人透露银行卡或验证码信息，谨防诈骗！",
				// 商店名称
				shopName: "",
				// 商店id
				shopId: "",
				// 订单状态码
				status: "",
				// 商品标题
				goodsTitle: "",
				// 商品id
				goodsId: "",
				// 商品单价
				goodsPrice: "",
				// 商品数量
				num: 1,
				// 商品图片
				imgUrl: "",
				// 订单编号
				orderCode: "",
				// 订单时间
				orderTime: "",
				// 支付方式
				payType: "",
				// 支付时间
				payTime: "",
				// 商品总额
				totalPrice: "",
				// 运费
				
				// 实付款
				actualPayment: ""
				
			}
		},
		computed: {
			orderStatus() {
				let status = "";
				switch(this.status){
					case 0:
						status = "已完成"
						break;
					case 1:
						status = "待消费"
						break;
					case 2:
						status = "待付款"
						break;
					default:
						break;
				}
				return status 
			}
		},
		methods: {
			init(){
				this.shopName = "大仓小碗";
				this.status = 0;
				this.goodsTitle = "仿宋代明月石";
				this.goodsPrice = "2000"
				this.tags = "颜色：黑色";
				this.num = 1;
				this.imgUrl = "/static/img/logo.png";
				this.orderCode = "2348230948230324234";
				this.orderTime = "2019-04-15 20:20:20";
				this.payType = "支付宝";
				this.payTime = "2019-04-15 20:20:20";
				this.totalPrice = "2000";
				this.actualPayment = "2000";
			},
			// 店铺首页
			toShopIndex(id){
				uni.navigateTo({
					url: `/pages/nearby/shop_index?id=${id}`
				})
			},
			// 去产品详情页面
			toGoodsDetail(id){
				uni.navigateTo({
					url: `/pages/nearby/goods_detail?id=${id}`
				})
			}
		},
		onLoad(e) {
			this.init();
		},
	}
</script>

<style lang="scss">
	page{
		background-color: #f0f0f0;
	}
	.nearby-orderDetail-page{
		.bg-white{
			background-color: #fff;
		}
		.padding-30-lr{
			padding: 0 30upx;
			box-sizing: border-box;
		}
		.order-list{
			margin-top: 16upx;
			.title-wrap{
				border-bottom: 1upx solid #f0f0f0;
				.title {
					margin-left: 20upx;
					.name {
						margin-right: 10upx;
					}
				}
			}
			.goods-info{
				padding: 30upx;
				position: relative;
				.name{
					width: 100%;
					height: 40upx;
				}
				.image{
					width: 184upx;
					height: 184upx;
					border-radius: 6upx;
					margin-right: 20upx;
					image{
						width: 100%;
						height: 100%;
						border-radius: 6upx;
					}
				}
				.info{
					display: flex;
					flex-direction: column;
					.title-box {
						height: 40upx;
						.title{
							font-weight: 600;
							.num{
								font-size: 22upx;
								font-weight: 100;
								margin-left: 10upx;
								color: #777;
							}
						}
						.total-price{
							text-align: right;
						}
					}
					.tags {
						flex: 1;
						padding-top: 10upx;
						box-sizing: border-box;
					}
				}
				.btn{
					display: flex;
					align-items: flex-end;
					&/deep/ uni-button::after{
						border: none;
					}
				}
			}
			.order-info{
				margin-top: 16upx;
				.order-info-item{
					width: 100%;
					padding: 24upx 0;
					border-bottom: 1upx solid #f0f0f0;
					&:nth-last-child(0){
						border-bottom: none;
					}
				}
			}
		}
		.footer{
			width: 100%;
			height: 88upx;
			line-height: 88upx;
			text-align: right;
			position: fixed;
			bottom: 0;
			left: 0;
			background-color: #fff;
		}
	}
</style>
