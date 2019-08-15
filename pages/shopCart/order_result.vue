<template>
	<view class="orderResultPage">
		<view class="result-wrap">
			<view class="title">
				<view class="icon flex-center-center" :class="payStatus ==='success'?'success':'fail'">
					<uni-icon :type="icon" color="#fff"></uni-icon>
				</view>
				<view class="title uni-h4 flex-center-center" style="margin-top: 20upx;">
					{{title}}
				</view>
				<view class="flex-center-center uni-text-small" style="color: #aaa;" v-if="payStatus ==='success'">
					我们将尽快给您准备好货物，感谢您的支持
				</view>
				<view class="flex-center-center uni-text-small" style="color: #aaa;" v-if="payStatus ==='fail'">
					<block v-if="isShowCount">
						请在<min-countdown :targetTime="countDown" @callback="countDownOver"></min-countdown>内完成付款，否则订单将关闭
					</block>
					<block v-if="!isShowCount">订单已关闭</block>
				</view>
			</view>
			<view class="bg-bar">
				
			</view>
			<view class="info">
				<view class="info-item uni-flex">
					<view class="title uni-inline-item">
						付款金额
					</view>
					<text class="text-price uni-flex uni-flex-item flex-right">￥1500</text>
				</view>
				<view class="info-item uni-flex">
					<view class="title uni-inline-item">
						订单总计
					</view>
					<text class="text-price uni-flex uni-flex-item flex-right">￥1400</text>
				</view>
				<view class="info-item uni-flex">
					<view class="title uni-inline-item">
						优惠减免
					</view>
					<text class="text-price uni-flex uni-flex-item flex-right">-￥400</text>
				</view>
			</view>
		</view>
		
		<!-- 商品推荐 -->
		<view class="goods-list" v-if="payStatus ==='success'">
			<!-- 商品推荐 -->
			<recommendGoods :title="'商品推荐'" :num="4"></recommendGoods>
		</view>
		
		<!-- 支付方式 -->
		<view class="pay-type" v-if="payStatus ==='fail'">
			<view class="pay-title uni-h5">
				支付方式
			</view>
			<radio-group @change="radioChange">
				<view class="pay-type-item uni-flex">
					<view class="title uni-flex uni-flex-item">
						<view class="icon uni-inline-item">
							<uni-icon type="info" color="blue"></uni-icon>
						</view>
						<view class="name uni-inline-item">
							支付宝支付
						</view>
					</view>
					<view class="uni-flex-item  uni-flex flex-right">
						<view class="checkbox uni-inline-item">
							<radio value="zfb" :checked="payType === 'zfb'" ></radio>
						</view>
					</view>
				</view>	
				<view class="pay-type-item uni-flex" :class="!isJfPayAvailable?'disabled':''">
					<view class="title uni-flex uni-flex-item">
						<view class="icon uni-inline-item">
							<uni-icon type="info" color="blue"></uni-icon>
						</view>
						<view class="name uni-inline-item">
							积分支付（余额364）
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
						<view class="icon uni-inline-item">
							<uni-icon type="info" color="blue"></uni-icon>
						</view>
						<view class="name uni-inline-item">
							M币支付（余额664）
						</view>
					</view>
					<view class="uni-flex-item  uni-flex flex-right">
						<text class="uni-inline-item red" v-if="!isMbPayAvailable">余额不足</text>
						<view class="checkbox uni-inline-item">
							<radio value="mb" :checked="payType === 'mb'" :disabled="!isMbPayAvailable"></radio>
						</view>
					</view>
				</view>	
			</radio-group>
		</view>
		
		<!-- 交易成功展示 -->
		<view class="footer flex-center-center" v-if="payStatus === 'success' || !isShowCount" @tap="backToIndex">
			回到首页
		</view>
		<!-- 交易失败按钮 -->
		<view class="footer uni-flex" v-if="payStatus === 'fail'&&isShowCount">
			<view class="total uni-flex-item flex-center-center">
				<text>共计：</text>
				<text class="text-price">{{total}}M币</text>
			</view>
			<view class="buy  uni-flex-item flex-center-center" @tap="toPay">
				去付款
			</view>
		</view>
	</view>
	
</template>
<script>
	// 注入vuex的方法
	import { mapMutations } from 'vuex';
	import { uniIcon } from '@dcloudio/uni-ui';
	import util from "../../common/util.js";
	import minCountdown from '../../components/common/min-countdown.vue'
	import recommendGoods from '../../components/common/recommend-goods.vue';
	export default {
		components: {
			uniIcon,
			minCountdown,
			recommendGoods
		},
		data(){
			return {
				// 交易状态
				payStatus: "fail",
				icon: "checkmarkempty",
				title: "交易成功",
				// 倒计时
				countDown: new Date().getTime() + 30*60*1000,
				// 是否显示倒计时
				isShowCount: true,
				// 付款方式
				payType: "zfb",
				// 积分余额
				jBalance: 0,
				// m币余额
				mBalance: 0,
				// 总价
				total:0,
				//猜你喜欢列表
				productList: [
					{
						goods_id: 1,
						img: '/static/img/common/good2.jpg',
						name: '阿玛熊红豆薏米粉480g熟早餐五谷核桃黑豆粉牛奶燕麦熟早餐五谷核桃黑豆粉牛奶燕麦',
						price: '￥68',
						slogan: '686人付款'
					},
					{
						goods_id: 2,
						img: '/static/img/common/good6.jpg',
						name: 'VKE 小爱早教智能机器人语音互动 听故事儿童玩具wifi版',
						price: '￥288',
						slogan: '232人付款'
					},
					{
						goods_id: 3,
						img: '/static/img/common/good7.jpg',
						name: '进口智利三文鱼400g',
						price: '￥216',
						slogan: '3235人付款'
					},
					{
						goods_id: 4,
						img: '/static/img/common/good8.jpg',
						name: '【赠送小黄人杯子】意大利进口科砾霖牙膏2支',
						price: '￥58',
						slogan: '35人付款'
					}
				]
			}
		},
		computed: {
			isJfPayAvailable() {
				return this.jBalance >= this.total; 
			},
			isMbPayAvailable() {
				return this.mBalance >= this.total; 
			},
		},
		methods: {
			...mapMutations(['SET_PASSWORD_CHECKSTATUS', 'INIT_ORDER_lIST']),
			init(){
				this.jBalance = 450;
				this.mBalance = 650;
				this.total = 505;
			},
			// 倒计时结束的回调
			countDownOver(){
				console.log('倒计时结束')
				this.isShowCount = false;
			},
			// 选择付款方式
			radioChange(evt) {
				this.payType = evt.detail.value;
			},
			// 返回首页
			backToIndex() {
				this.$store.dispatch("change_page", "home");
				uni.reLaunch({
					url: "/pages/index"
				})
			},
			// 去商品详情页
			toDetail(id){
				uni.navigateTo({
					url: `/pages/home/goods_detail?id=${id}`
				})
			},
			// 支付
			toPay(){
				// 支付流程
				if(this.payType === "zfb") {
					// 支付宝支付
					uni.showToast({
						title: "支付宝支付"
					})
					// this.alipay();			
			
				} else if (this.payType === "jf") {
					// 支付宝支付
					uni.showToast({
						title: "积分支付"
					})
					this.jfPay();
				} else {
					// 支付宝支付
					uni.showToast({
						title: "Mb支付"
					})
					this.mbPay();
				}
				
				// this.toResult();
			},
			// 支付宝支付
			alipay(){
				// 请求后台接口获取订单数据
				uni.showLoading();
				service.getorderInfo().then(res=>{
					uni.hideLoading();
					const data = res.data.data;
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
						},
						fail: function(err) {
							uni.showToast({
								icon: "none",
								title:  err.errMsg || err.data.data,
							})
						}
					});
				}).catch(err=>{
					console.log(err)
					uni.hideLoading();
					uni.showToast({
						icon: "none",
						title:  err.errMsg ,
					})
				})
				
			},
			// 积分支付
			jfPay(){
			
			},
			// M币支付
			mbPay(){
				
			},
		},
		onLoad(option) {
			this.payStatus = option.payStatus;
			this.title = this.payStatus === "success" ? "付款成功" : "付款失败";
			this.icon = this.payStatus === "success" ? "checkmarkempty" : "closeempty";
			this.init();
			// 付款成功
			if(this.payStatus === "success"){
				// 重置二级密码校验状态为false
				this.SET_PASSWORD_CHECKSTATUS(false);
				// 清空待支付订单列表
				this.INIT_ORDER_lIST([]);
			}	
			
		}
	}
</script>

<style lang="scss">
	page{
		width: 100%;
		height: 100%;
		background-color: #f0f0f0;
		
	}
	.orderResultPage{
		margin-bottom: 100upx;
		.result-wrap{
			width: 100%;
			height:448upx;
			background-color: #242424;
			padding-top: 45upx;
			box-sizing: border-box;
			position: relative;
			margin-bottom: 100upx;
			color: #fff;
			.title{
				.icon{
					width: 100upx;
					height: 100upx;
					position: relative;
					left:50%;
					border-radius: 50%;
					transform: translateX(-50%);
					.uni-icon{
						transform: scale(2)
					}
					&.success{
						background-color: #057ffc;
					}
					&.fail{
						background-color: #f24837;
					}
				}
			}
			.bg-bar{
				width: 690upx;
				height: 14upx;
				background-color: #464646;
				position: absolute;
				left: 50%;				
				bottom: 128upx;
				transform: translateX(-50%);
			}
			.info{
				width: 680upx;
				height: 205upx;
				background-color: #fff;
				position: absolute;
				left: 50%;				
				bottom: -70upx;
				transform: translateX(-50%);
				padding: 30upx;
				box-sizing: border-box;
				.info-item{
					.title{
						color: #666;
						width: 120upx;
						text-align: left;
					}
				}
			}
		}
		.goods-list {
			background-color: #fff;
			font-weight: 600;
			padding-top: 20upx;
			.title {
				width: 100%;
				height: 60upx;
				color: #242424;
				font-size: 40upx;
				margin-bottom: 36upx;
				padding: 0 30upx;
				box-sizing: border-box;
			}			
			.product-list {
				width: 100%;
				display: flex;
				justify-content: space-between;
				flex-wrap: wrap;
				padding: 0 30upx;
				box-sizing: border-box;
		
				.product {
					width: 47.75%;
					background-color: #fff;
					margin: 0 0 15upx 0;
					image {
						width: 100%;
						height: 246upx;
						background-color: #f0f0f0;
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
			background-color: #242424;
			font-size: 30upx;
			color: #fff;
			.total{
				background-color: #fff;
				color: #242424;
			}
			.buy{
				color: #fff;;
			}
		}
	}
</style>