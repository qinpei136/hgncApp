<template>
	<view class="nearby-orderDetail-page">
		<uni-notice-bar 
			show-icon="true" 
			:text="notice">
		</uni-notice-bar>
		
		<view class="order-list">
			<!-- 店铺名称，订单状态 -->
			<view class="title-wrap uni-flex bg-white padding-30-lr"> <!-- @tap="toShopIndex(shopId)" -->
				<view class="iconfont icondianpu uni-inline-item"></view>
				<view class="title uni-h5 uni-flex-item uni-flex">
					<view class="name uni-inline-item">
						{{orderCode}}
					</view>
				</view>
				<view class="order-status uni-inline-item text-color-gray">
					{{orderStatus}}
				</view>
			</view>
			
			<!-- 商品信息 -->
			<view v-for="(item,index) in orderList"  :key="index" class="goods-info bg-white padding-30-lr uni-flex">
				<view class="image uni-inline-item">
					<image :src="item.ImageUrl" mode="aspectFit"></image>
				</view>
				<view class="info uni-flex-item uni-flex uni-column">
					<view class="title-box uni-h5 uni-flex uni-row">
						<view class="title uni-flex-item">
							{{item.Title}}
							<!-- <text class="num">X{{item.Num}}</text> -->
						</view>

						<view class="uni-flex-item total-price text-price uni-bold">
							￥<text>{{item.OrderDetailsPrice}}</text>
						</view>
					</view>
					<view class="tags uni-flex">
						<view class="tags uni-flex-item uni-text-small text-color-gray">
							数量:{{item.Num}} &nbsp; 规格:{{item.StandardDetails}}
						</view> 
						<view class="btn uni-inline-item" @tap="toGoodsDetail(item.GoodsId)">
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
	 import userService from '../../common/userService.js';
	 import util from "../../common/util.js";
	export default{
		components: {
			uniIcon,
			uniNoticeBar		
		},
		data() {
			return {
				// 订单id
				orderId: "",
				// 提示
				notice: "为了您的财产安全，不要点击陌生连接，不要向任何人透露银行卡或验证码信息，谨防诈骗！",
				// 商店名称
				shopName: "",
				// 商店id
				shopId: "",
				tags: "",
				// 订单状态码
				orderStatus: "",
				// 商品id
				goodsId: "",
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
				actualPayment: "",
				orderList:[],
				imgDomainImg:""
				
			}
		},
		computed: {
			
		},
		methods: {
			init(){
				this.getOrderDetail();
			},
			// 获取订单信息
			getOrderDetail(){
				let params = {
					ids: [this.orderId],
				}
				uni.showLoading();
				userService.getOrderDetail(params).then(res => {
					uni.hideLoading();
					let data = res.data.result;
					if (data.length > 0) {
						this.orderList=res.data.result
						for(var i in this.orderList)
							this.orderList[i].ImageUrl=util.getImageUrl(this.orderList[i].ImageUrl)
						const orderDetail = data[0];
						this.orderStatus = this.traslateStatus(orderDetail.Status);
						this.orderCode = orderDetail.OrderId;
						this.orderTime = orderDetail.CreateTime;
						this.payType =this.traslatePayment(orderDetail.Payment) ;
						this.payTime = orderDetail.PayTime;
						this.totalPrice = orderDetail.OrderDetailsPrice;
						this.actualPayment = orderDetail.Price;
					}
				}).catch(err => {
					uni.hideLoading();
					uni.showToast({
						icon: "none",
						title: err.errMsg
					})
				})
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
			},
			// 需要转化的值
			traslateStatus(value) {
				let tValue = "";
				switch (value) {
					case "a":
						tValue = "全部";
						break;
					case "0":
						tValue = "待付款";
						break;
					case "1":
						tValue = "待发货";
						break;
					case "2":
						tValue = "待收货";
						break;
					case "d":
						tValue = "已完成";
						break;
				}
				return tValue;
			},
			traslatePayment(value) {
				let tValue = "";
				switch (value) {
					case "1":
						tValue = "支付宝";
						break;
					case "2":
						tValue = "微信";
						break;
					case "3":
						tValue = "M币";
						break;
					case "4":
						tValue = "积分";
						break;
				}
				return tValue;
			}
		},
		onLoad(e) {
			this.orderId = e.id;
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
				border-top:1px solid #f0f0f0;
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
	
	// .uni-noticebar__content-inner{
	// 	padding-left: 0upx;
	// 	color: red;
	// 	white-space: inherit;
	// }
</style>
