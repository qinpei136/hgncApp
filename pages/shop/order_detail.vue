<template>
	<view class="nearby-orderDetail-page">
		<view class="order-list">
			<view class="order-info bg-white padding-30-lr">
				<view class="order-info-item uni-column uni-flex">
					<text class="orderStatus">{{orderName}}</text>
					<text>购买人：{{userName}}</text>
					<text>联系方式：{{userPhone}}</text>
					<view style="text-align: right;margin-top: 10upx;" @tap="call">
						<button type="primary" size="mini" style="border:1upx solid #c6c6c6;color:#242424;background-color:#fff;border-radius:0;font-weight:bold;">联系买家</button>
					</view>
					
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
							{{item.orderDetailsTitle}}
						</view>
						<view class="uni-flex-item total-price text-price uni-bold">
							￥<text>{{item.price}}</text>
						</view>
					</view>
					<view class="tags uni-flex">
						<view class="tags uni-flex-item uni-text-small text-color-gray">
							数量:{{item.orderDetailsNum}}<!-- &nbsp; 规格:{{item.StandardDetails}} -->
						</view> 
						<!-- <view class="btn uni-inline-item" @tap="toGoodsDetail(item.orderDetailsId)">
							<button type="primary" size="mini" style="border:1upx solid #c6c6c6;color:#242424;background-color:#fff;border-radius:0;font-weight:bold;">再来一单</button>
						</view> -->
					</view>
				</view>
			</view>
			
			<!-- 订单信息 -->
			<view class="order-info bg-white padding-30-lr">
				<view class="order-info-item uni-column uni-flex">
					<text>订单编号：{{orderCode}}</text>
					<text>下单账号：{{userPhone}}</text>
					<text>下单时间：{{orderTime}}</text>
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
		<view class="footer padding-30-lr" @tap="processingOrder">
			<button v-if="orderStatus=='0'" type="primary" size="mini" style="border:1upx solid #c6c6c6;color:#242424;background-color:#fff;border-radius:0;font-weight:bold;margin-top: 14upx;">关闭订单</button>
			<button v-if="orderStatus=='1'" type="primary" size="mini" style="border:1upx solid #c6c6c6;color:#242424;background-color:#fff;border-radius:0;font-weight:bold;margin-top: 14upx;">核销</button>
		</view>
	</view>
</template>

<script>
	import {
		uniIcon
	} from '@dcloudio/uni-ui';
	 import userService from '../../common/userService.js';
	 import util from "../../common/util.js";
	export default{
		components: {
			uniIcon		
		},
		data() {
			return {
				// 订单id
				orderId: "",
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
				imgDomainImg:"",
				userName:"",
				userPhone:"",
				orderName:""
				
				
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
					orderId: this.orderId,
				}
				uni.showLoading();
				userService.getShopOrder(params).then(res => {
					uni.hideLoading();
					let data = res.data.result;
					if (data.length > 0) {
						this.orderList=res.data.result
						for(var i in this.orderList)
							this.orderList[i].ImageUrl=util.getImageUrl(this.orderList[i].orderDetailsImg)
						const orderDetail = data[0];
						this.orderName = this.traslateStatus(orderDetail.orderStatus);
						this.orderCode = orderDetail.orderId;
						this.orderTime = new Date(orderDetail.orderTime).Format("yyyy-MM-dd hh:mm");
						this.payType =this.traslatePayment(orderDetail.payMode) ;
						this.payTime = new Date(orderDetail.orderTime).Format("yyyy-MM-dd hh:mm");
						this.totalPrice = orderDetail.price;
						this.actualPayment = orderDetail.price;
						this.userName=orderDetail.userName;
						this.userPhone=orderDetail.userPhone;
						this.orderStatus=orderDetail.orderStatus
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
					case "1":
						// 待核销
						tValue = "待核销";
						break;
					case "0":
						// 待付款
						tValue = "待付款";
						break;
					case 'd':
						// 已完成
						tValue = "已完成";
						break;
					case 'c':
						// 已关闭
						tValue = "已关闭";
						break;
					default:
						tValue = "";
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
					default:
						tValue = "未支付";
						break;
				}
				return tValue;
			},
			call(){
				uni.makePhoneCall({
				    phoneNumber: this.userPhone
				});
			},
			processingOrder()
			{
				let mode=''
				//关闭订单
				if(this.orderStatus=='0')
					mode='cancelOrder'
				else//核销
					mode='writeOffOrders'
				let params = {orderId: this.orderId}
				uni.showLoading();
				userService[mode](params).then(res => {
					uni.hideLoading();
					if(res.data.code=="200")
					{
						if(this.orderStatus=='0')//关闭订单
						{
							this.orderStatus='c'
							this.orderName='已关闭'
							uni.showToast({
								icon: "none",
								title: "订单已关闭"
							})
						}
						else//核销
						{
							this.orderStatus='d'
							this.orderName='已完成'
							uni.showToast({
								icon: "none",
								title: "订单已完成"
							})
						}
					}
					else
					{
						uni.showToast({
							icon: "none",
							title: res.data.msg
						})
					}
				}).catch(err => {
					uni.hideLoading();
					uni.showToast({
						icon: "none",
						title: err.errMsg
					})
				})
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
				border-top:8px solid #f0f0f0;
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
					.orderStatus{
						font-size: 40upx;
						font-weight: bold;
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
