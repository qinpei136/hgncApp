<template>
	<view class="payPage">
		<!-- 收货地址 -->
		<view class="address-wrap uni-flex uni-row" @tap="toAddress">
			<view class="icon-left uni-inline-item common-mr-20">
				<view class="iconfont iconicon_position_fill"></view>
			</view>
			<view class="default-address uni-inline-item">
				<!-- 有地址 -->
				<view class="info uni-h5 uni-bold" v-if="address">
					{{address.receiver}}&nbsp;&nbsp;{{address.phone}}
				</view>
				<view class="address-detail uni-text-small text-color-gray" v-if="address">
					{{address.province}} &nbsp;{{address.city}} &nbsp;{{address.region}} &nbsp;{{address.detail}}
				</view>
				<!-- 暂无地址 -->
				<view class="text-color-gray uni-flex-item flex-center-center" v-if="!address">
					暂无收货地址，请前往设置
				</view>
			</view>
			<view class="icon-right uni-inline-item">
				<uni-icon type="arrowright" color="#666"></uni-icon>
			</view>
		</view>
		<!-- <rain-color ref="rainColor" v-model="rainColor.value" :mode="rainColor.mode" :color="rainColor.colorArr" :w="rainColor.w" @click="addColor" /> -->
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
				<view class="info uni-flex-item uni-flex">
					<view class="text-price uni-flex-item">
						￥0
					</view>
					<text class="uni-inline-item flex-right" style="width: 142upx;">(快递包邮)</text>
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
				<view class="pay-type-item uni-flex" :class="!isJfPayAvailable?'disabled':''">
					<view class="title uni-flex uni-flex-item">
						<view class="iconfont iconicon_integral uni-inline-item"></view>
						<view class="name uni-inline-item">
							积分支付（余额{{jBalance}}）
						</view>
					</view>
					<view class="uni-flex-item  uni-flex flex-right">
						<text class="uni-inline-item red" v-if="!isJfPayAvailable">余额不足</text>
						<view class="checkbox uni-inline-item">
							<radio value="jf" :checked="payType === 'jf'" :disabled="!isJfPayAvailable"></radio>
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
				<text class="text-price">{{totalPrice}} {{ unit }}</text>
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
	import util from '../../common/util.js';
	// import rainColor from "../../components/common/rain-color.vue"
	export default {
		components: {
			uniIcon,
			// rainColor
		},
		data(){
			return {
				// 支付方式
				payType: "alipay",
				// 积分余额
				jBalance: 0,
				// m币余额
				mBalance: 0,
				// 货币单位
				unit: '元'
			}
		},
		computed: {
			// 注入vuex的计算方法
			...mapState(["userId"]),
			...mapGetters(["getAddressList", "getOrderList"]),
			// 默认地址
			address(){
				return this.getAddressList.length > 0 ? this.getAddressList[0] : null
			},
			totalPrice(){
				let total = 0;
				_.forEach(this.getOrderList, item => {
					total += util.calc.Mul(item.price, item.num)
				})
				return total
			},
			// 积分是否可用
			isJfPayAvailable() {
				return this.jBalance >= this.totalPrice; 
			},
			// M币是否可用
			isMbPayAvailable() {
				return this.mBalance >= this.totalPrice; 
			}			
		},
		methods: {
			init(){
				this.jBalance = 450;
				this.mBalance = 9999;
			},
			// 去地址管理页面
			toAddress(){
				uni.navigateTo({
					url: "/pages/mine/address_management"
				})
			},
			// 跳转商品详情
			toDetail(id){
				// uni.navigateTo({
				// 	url: `/pages/home/goods_detail?${id}`
				// })
			},
			// 选择付款方式
			radioChange(evt) {
				this.payType = evt.detail.value;
				if (this.payType === 'alipay') {
					this.unit = '元'
				} else if (this.payType === 'jf') {
					this.unit = '分'
				} else if (this.payType === 'mb') {
					this.unit = 'M币'
				}
				console.log(evt)
			},
			// 创建订单
			creatOrder(){
				// 支付宝支付不用检验二级密码
				if(this.payType !== "alipay" && !this.$store.state.isCheckPassword) {
					this.toSecond();
					return 
				} 
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
					goods: goods,
					addressId: this.address.id
				}
				uni.showLoading();
				service.createOrder(params).then(res=>{
					uni.hideLoading();
					let data = res.data.data;
					// console.log(JSON.stringify(data));
					let orderId = data;
					// 去支付
					this.toPay(data);
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
					// uni.showToast({
					// 	title: "支付宝支付"
					// })
					this.alipay(data);
				} else if (this.payType === "jf") {
					// 支付宝支付
					// uni.showToast({
					// 	title: "积分支付"
					// })
					this.jfPay(data);
				} else {
					// 支付宝支付
					// uni.showToast({
					// 	title: "Mb支付宝支付"
					// })
					this.mbPay(data);
				}
			},
			// 支付宝支付
			alipay(data){
				// 然后调用api，吊起支付宝支付
				uni.requestPayment({
					provider: 'alipay',
					orderInfo: data.secret, //订单数据
					success: function(res) {
						// console.log('success:' + JSON.stringify(res));
						this.callbackAfterPay(data);
						this.toResult(orderId, true);
					},
					fail: function(err) {
// 						uni.showToast({
// 							icon: "none",
// 							title:  err.errMsg || err.data.data,
// 						})
						this.toResult(data.orderId, false);
					}
				});	
			},
			// 积分支付
			jfPay(orderId){
				// 调用支付流程
					
				// 去结果页
				this.toResult(orderId);
			},
			// M币支付
			mbPay(orderId){
				// 调用支付流程
					
				// 去结果页
				this.toResult(orderId);
			},
			// 支付成功了回调
			callbackAfterPay(){
				let parms = {
					orderId: data.orderId,
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
			toResult(orderId, isSuccess) {
				let payStatus = isSuccess ? "success" : "fail";
				uni.showToast({
					title: isSuccess ? "支付成功" : "支付失败",
					icon: isSuccess ? "success" : "",
					duration: 2000,
					complete: () => {
						uni.reLaunch({
							url: `/pages/shopCart/order_result?payStatus=${payStatus}&orderId=${orderId}`
						});
					}
				});
			}
		},
		onLoad(data) {
			console.log(JSON.stringify(data))
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
	.payPage{
		width: 100%;
		.address-wrap{
			width: 100%;
			height: 180upx;
			padding: 30upx 20upx; 
			box-sizing: border-box;
			background-color: #fff;
			margin-bottom: 30upx;
			.icon-left{
				width: 40upx;
			}
			.default-address{
				flex: 1 1 0%;
				display: flex;
				flex-direction: column !important;
				align-items: flex-start !important;
			}
			.icon-right{
				width: 96upx;
				// justify-content: end;
				flex-direction: row-reverse;
			}
		}
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
