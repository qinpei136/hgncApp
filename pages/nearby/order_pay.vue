<template>
	<view class="nearby-pay-page">
		
		<!-- 购买商品 -->
		<view class="goods-list"> 
			<view class="goods-item uni-flex uni-row" v-for="(item, index) in getOrderList" :key="index" :id="item.index">
				<view class="image uni-inline-item" @tap="toDetail(item.goodsId)">
					<image :src="item.imageUrl" mode="aspectFit"></image>
				</view>
				<view class="info uni-flex-item">
					<view class="title  uni-flex uni-column">
						<text class="uni-ellipsis">{{ item.title }}</text>
						<text class="text-color-gray uni-text-small">{{ item.standardText }}</text>
					</view>
					<view class="price uni-flex">
						<text class="text-price uni-flex-item">￥{{ item.price }}</text>
						<text class="uni-flex" style="align-items: flex-end;">x {{ item.num }}</text>
					</view>
				</view>
			</view>
		</view>
		<!-- 优惠券 -->
		<!-- <view class=" discount uni-flex">
			<view class="title uni-inline-item">
				优惠券
			</view>
			<view class="uni-flex-item text-price" style="text-align: right;line-height: 88upx;">
				满99减10
			</view>
			<view class="icon-right uni-inline-item">
				<uni-icon type="arrowright" color="#666"></uni-icon>
			</view>
		</view> -->
		
		<!-- 订单信息 -->
		<view class="order-info">
			<view class="order-info-item uni-flex">
				<view class="title uni-flex-item">
					发货方式
				</view>
				<view class="info uni-flex-item uni-flex flex-right">
					到店消费
				</view>
			</view>
			<view class="order-info-item uni-flex">
				<view class="title uni-flex-item">
					订单总价
				</view>
				<view class="text-price info uni-flex-item">
					￥{{totalPrice}}
				</view>
			</view>
			<!-- <view class="order-info-item uni-flex">
				<view class="title uni-flex-item">
					活动优惠
				</view>
				<view class="uni-flex-item">
					-￥220
				</view>
			</view> -->
		</view>
		<!-- 支付方式 -->
		<view class="pay-type">
			<view class="pay-title uni-h5">
				支付方式
			</view>
			<radio-group @change="radioChange">
				<view class="pay-type-item uni-flex">
					<view class="title uni-flex uni-flex-item">
						<view class="iconfont iconicon_zhifubao uni-inline-item"></view>
						<view class="name uni-inline-item">
							支付宝支付
						</view>
					</view>
					<view class="uni-flex-item  uni-flex flex-right">
						<view class="checkbox uni-inline-item">
							<radio value="alipay" :checked="payType === 'alipay'" ></radio>
						</view>
					</view>
				</view>	

				<view class="pay-type-item uni-flex" :class="!isMbPayAvailable?'disabled':''">
					<view class="title uni-flex uni-flex-item">
						<view class="iconfont iconicon_m uni-inline-item"></view>
						<view class="name uni-inline-item">
							M币支付（余额{{mBalance}}）
						</view>
					</view>
					<view class="uni-flex-item  uni-flex flex-right">
						<text class="uni-inline-item red" v-if="!isMbPayAvailable">余额不足</text>
						<view class="checkbox uni-inline-item">
							<radio value="mb" :checked="payType === 'mb'"  :disabled="!isMbPayAvailable"></radio>
						</view>
					</view>
				</view>	
			</radio-group>
		</view>
		
		<view class="footer uni-flex">
			<view class="total uni-flex-item flex-center-center">
				<text>共计：</text>
				<text class="text-price">{{totalPrice}}M币</text>
			</view>
			<view class="buy  uni-flex-item flex-center-center" @tap="creatOrder">
				去付款
			</view>
		</view>
		
	</view>
</template>
<script>
	import { uniIcon } from '@dcloudio/uni-ui';
	import { mapState, mapMutations, mapGetters} from 'vuex';
	import service from '../../common/service.js';
	export default {
		components: {
			uniIcon,
		},
		data(){
			return {
				// 支付方式
				payType: "alipay",
				// m币余额
				mBalance: 0,
				// 订单id
				orderId: null
			}
		},
		computed: {
			// 注入vuex的计算方法
			...mapState(["userId"]),
			...mapGetters(["getOrderList"]),
			totalPrice(){
				let total = 0;
				_.forEach(this.getOrderList, item => {
					total += item.price * item.num
				})
				return total
			},
			// M币是否可用
			isMbPayAvailable() {
				return this.mBalance >= this.totalPrice; 
			}
			
		},
		methods: {
			init(){
				this.mBalance = 9999;
			},
			// 跳转商品详情
			toDetail(id){
				uni.navigateTo({
					url: `/pages/home/goods_detail?${id}`
				})
			},
			// 选择付款方式
			radioChange(evt) {
				this.payType = evt.detail.value;
			},
			// 创建订单
			creatOrder(){
				// 支付宝支付不用检验二级密码
				if(this.payType !== "alipay" && !this.$store.state.isCheckPassword) {
					this.toSecond();
					return 
				} 
				this.toResult(true);
				return
				let goods = [];
				_.forEach(this.getOrderList, item => {
					goods.push({
						goodsId: item.goodsId,
						num: item.num,
						price: item.price,
						detail: item.standardText,
						imageUrl: item.imageUrl
					})
				})
				let params = {
					userId: this.userId,
					goods: goods,
				}
				uni.showLoading();
				service.createOrder(params).then(res=>{
					uni.hideLoading();
					let data = res.data.data;
					console.log(data);
					this.orderId = data || undefined;
					// 去支付
					// this.toPay(data);
				}).catch(err=>{
					uni.hideLoading();
					uni.showToast({
						icon:"none",
						title: err.errMsg
					})
				})
			},
			// 支付
			toPay(data){
				// 支付流程
				if(this.payType === "alipay") {
					// 支付宝支付
					uni.showToast({
						title: "支付宝支付"
					})
					this.alipay(data);
				} else {
					// 支付宝支付
					uni.showToast({
						title: "Mb支付宝支付"
					})
					this.mbPay(data);
				}
			},
			// 支付宝支付
			alipay(data){
				// 然后调用api，吊起支付宝支付
				uni.requestPayment({
					provider: 'alipay',
					orderInfo: {
						"dealId": data.dealId,
						"appKey": data.appKey,
						"totalAmount": data.totalAmount,
						"tpOrderId": data.tpOrderId,
						"dealTitle": data.dealTitle,
						"rsaSign": data.rsaSign,
						"bizInfo": data.bizInfo
					}, //订单数据
					success: function(res) {
						console.log('success:' + JSON.stringify(res));
						this.callbackAfterPay();
						this.toResult(true);
					},
					fail: function(err) {
// 						uni.showToast({
// 							icon: "none",
// 							title:  err.errMsg || err.data.data,
// 						})
						this.toResult(false);
					}
				});	
			},
			// M币支付
			mbPay(){
				// 调用支付流程
					
				// 去结果页
				this.toResult();
			},
			// 支付成功了回调
			callbackAfterPay(){
				let parms = {
					orderId: this.orderId,
					payment: this.payType
				}
				uni.showLoading();
				service.callbackAfterPay().then(res=>{
					uni.hideLoading();
					const data = res.data.data;
					
				}).catch(err=>{
					console.log(err)
					uni.hideLoading();
					uni.showToast({
						icon: "none",
						title: err.errMsg,
					})
				})
			},
			// 去二级密码页面
			toSecond(){
				uni.navigateTo({
					url: "/pages/mine/gesture_lock?mode=check"
				})
			},
			// 支付结果
			toResult(isSuccess) {
				let payStatus = isSuccess ? "success" : "fail";
				let orderId = this.orderId;
				uni.showToast({
					title: isSuccess ? "支付成功" : "支付失败",
					icon: isSuccess ? "success" : "",
					duration: 2000,
					complete: () => {
						uni.reLaunch({
							url: `/pages/nearby/order_result?payStatus=${payStatus}&orderId=${orderId}`
						});
					}
				});
			}
		},
		onLoad() {
			this.init();
		}
	}
</script>

<style lang="scss">
	page{
		width: 100%;
		height: 100%;
		background-color: #f0f0f0;
	}
	.nearby-pay-page{
		width: 100%;
		.goods-list{
			width: 100%;
			background-color:  #fff;
			padding: 30upx;
			box-sizing: border-box;
			margin-bottom: 30upx;
			.goods-item{
				margin-bottom: 10upx;
				border-bottom: 1upx solid #f0f0f0;
				padding: 10upx 30upx;
				margin: 0 -30upx;
				box-sizing: border-box;
				.image {
					width: 130upx;
					height: 130upx;
					margin-right: 30upx;
					flex-shrink: 0;
					image {
						display: block;
						width: 100%;
						height: 100%;
						background-color: #f0f0f0;
					}
				}
				.info{
					width: calc(100% - 180upx);
					.price{
						justify-content: space-between;
					}
				}
			}
			
		}
		.discount{
			width: 100%;
			height: 88upx;
			background-color: #fff;
			margin-bottom: 30upx;
			padding: 0 10upx 0 30upx;
			box-sizing: border-box;
		}
		.order-info{
			width: 100%;
			padding: 30upx;
			box-sizing: border-box;
			background-color: #fff;
			margin-bottom: 30upx;
			.order-info-item{
				.title{
					color: #666;
				}
				.info{
					text-align: right
				}
			}
		}
		.pay-type{
			width: 100%;
			background-color: #fff;
			margin-bottom: 130upx;
			.pay-title{
				width: 100%;
				height: 84upx;
				line-height: 84upx;
				border: 1upx solid #f0f0f0;
				text-indent: 30upx;
				color: #666;
			}
			.pay-type-item{
				width: 100%;
				height: 84upx;
				padding: 0 30upx; 
				box-sizing: border-box;
				.iconfont{
					margin-right: 10upx;
				}
				.iconicon_zhifubao{
					color: #01aaef;
				}
				.iconicon_integral{
					color: #fcbb3b;
				}
				.iconicon_m{
					color: #ff8067;
				}
				.uni-flex-item{
					border-bottom: 1upx solid #f0f0f0;
				}
				.checkbox{
					margin-left: 20upx;
				}
				.red{
					color: #ff5011;
				}
				&.disabled{
					.name{
						color:#bbb;
					}
				}
			}
		}
		.footer{
			width: 100%;
			height: 100upx;
			position: fixed;
			bottom: 0;
			border-top: 1upx solid #f0f0f0;
			.total{
				background-color: #fff;
			}
			.buy{
				background-color: #242424;
				color: #fff;;
			}
		}
	}
</style>

