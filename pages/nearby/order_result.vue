<template>
	<view class="nearby-orderResult-page">
		<view class="result-wrap">
			<view class="title">
				<view class="icon flex-center-center" :class="payStatus ==='success'?'success':'fail'">
					<uni-icon :type="icon" color="#fff"></uni-icon>
				</view>
				<view class="title uni-h4 flex-center-center" style="margin-top: 20upx;">
					{{title}}
				</view>
				<view class="flex-center-center uni-text-small" style="color: #aaa;" v-if="payStatus ==='success'">
					请直接到店出示一下二维码
				</view>
				<!-- <view class="flex-center-center uni-text-small" style="color: #aaa;" v-if="payStatus ==='fail'">
					请在{{expireTime}}内完成付款，否则订单将关闭
				</view> -->
			</view>
			<view class="bg-bar">
				
			</view>
			<view class="info">
				<!-- 二维码 -->
				<view class="QR-code flex-center-center uni-column" v-if="payStatus ==='success'">
					<view class="image">
						<image :src="img" mode="widthFix"></image>
					</view>
					<view class="text uni-flex-item text-color-gray uni-text-small">
						请将此二维码展示给商家
					</view>
				</view>
				<view class="info-item uni-flex">
					<view class="title uni-inline-item">
						付款金额
					</view>
					<text class="text-price uni-flex uni-flex-item flex-right">{{total}}</text>
				</view>
				<!-- <view class="info-item uni-flex">
					<view class="title uni-inline-item">
						订单总计
					</view>
					<text class="text-price uni-flex uni-flex-item flex-right">￥1400</text>
				</view> -->
				<!-- <view class="info-item uni-flex">
					<view class="title uni-inline-item">
						优惠减免
					</view>
					<text class="text-price uni-flex uni-flex-item flex-right">-￥100</text>
				</view> -->
			</view>
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
							<radio value="zfb" :checked="payType === '1'" ></radio>
						</view>
					</view>
				</view>	
				
				<view class="pay-type-item uni-flex" :class="!isMbPayAvailable?'disabled':''">
					<view class="title uni-flex uni-flex-item">
						<view class="icon uni-inline-item">
							<uni-icon type="info" color="blue"></uni-icon>
						</view>
						<view class="name uni-inline-item">
							M币支付（余额{{mBalance}}）
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
		<view class="footer flex-center-center" v-if="payStatus === 'success'" @tap="backToIndex">
			回到首页
		</view>
		<!-- 交易失败按钮 -->
		<view class="footer uni-flex" v-if="payStatus === 'fail'">
			<view class="total uni-flex-item flex-center-center">
				<text>共计：</text>
				<text class="text-price">{{total}}M币</text>
			</view>
			<view class="buy  uni-flex-item flex-center-center" @tap="toPay">
				去付款
			</view>
		</view>
		
		<!-- 模态框 检验二级密码-->
		<neil-modal :show="showModal" @close="closeModal()" @confirm="confirmPwd" title="二级密码验证"> 
			<view class="input-wrap">	
				<input type="number" maxlength="6" v-model="pwd" placeholder="请输入二级密码" class="nick-name" />
			</view>
		</neil-modal>
	</view>
	
</template>
<script>
	// 注入vuex的方法
	import { mapMutations } from 'vuex';
	import { uniIcon } from '@dcloudio/uni-ui';
	import util from "../../common/util.js";
	// 引入二维码生成器
	import QR from "../../common/utils/wxqrcode.js" // 二维码生成器  
	import userService from '../../common/userService.js';
	import neilModal from '../../components/neil-modal/neil-modal.vue';
	export default {
		components: {
			uniIcon,
			neilModal
		},
		data(){
			return {
				// 交易状态
				payStatus: "fail",
				icon: "checkmarkempty",
				title: "交易成功",
				// 倒计时
				countDown: "21:30",
				// 付款方式
				payType: "1",
				// 积分余额
				jBalance: 0,
				// m币余额
				mBalance: 0,
				// 总价
				total:0,
				// 二维码图片
				img: "",
				expireTime:"",
				showModal: false,
				pwd: '',
			}
		},
		computed: {
			isMbPayAvailable() {
				return this.mBalance >= this.total; 
			},
		},
		methods: {
			...mapMutations(['SET_PASSWORD_CHECKSTATUS', 'INIT_ORDER_lIST']),
			init(){
				// 生成二维码
				this.img = QR.createQrCodeImg(this.orderId, {  
					 size: parseInt(300)  
				})  
				this.getShopOrder()
				if(this.payStatus!="success")
				{
					this.getUser()
				}
			},
			getShopOrder(){
				uni.showLoading()
				let params = {"orderId": this.orderId}
				userService.getShopOrder(params).then(res=>{
					uni.hideLoading();
					if(res.data.code=="200")
					{
						let data=res.data.result;
						for(var i in data)
							this.total+=data[i].price
						
						let orderTime=new Date(data[0].orderTime.replace(/-/g,'/'))
						let expireDate=new Date(orderTime.setMinutes(orderTime.getMinutes() + 60))
						this.expireTime=expireDate.getHours()+":"+expireDate.getMinutes()
					}
					
				}).catch(err=>{
					uni.hideLoading();
					uni.showToast({
						icon:"none",
						title: err.errMsg
					})
				}) 
			},
			// 获取用户信息
			getUser(){
				uni.showLoading()
				userService.getUser().then(res=>{
					uni.hideLoading();
					if(res.data.code=="200")
						this.mBalance=res.data.result.gold
				}).catch(err=>{
					uni.hideLoading();
					uni.showToast({
						icon:"none",
						title: err.errMsg
					})
				})
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
				this.pwd=""
				this.showModal = true;
			},
			// 支付宝支付
			alipay(){
				let _this=this;
				uni.showLoading()
				let params = {"addressId": "0","orderType":"2"}
				userService.appPay(_this.orderId,params).then(res=>{
					uni.hideLoading();
					let orderInfo=res.data.orderInfo
					uni.requestPayment({
						provider: 'alipay',
						orderInfo: orderInfo, //订单数据
						success: function(res) {
							_this.callbackAfterPay();
						},
						fail: function(err) {
							_this.toResult(false);
						},
					});	
				}).catch(err=>{
					uni.hideLoading();
					uni.showToast({
						icon:"none",
						title: err.errMsg
					})
				})
			},
			// 支付成功了回调
			callbackAfterPay(){
				let parms = {
					orderId: this.orderId,
					PayMode: this.payType
				}
				uni.showLoading();
				userService.putPayStatus(parms).then(res=>{
					uni.hideLoading();
					this.toResult(true);
					
				}).catch(err=>{
					uni.hideLoading();
					uni.showToast({
						icon: "none",
						title: err.errMsg,
					})
				})
			},
			// M币支付
			mbPay(){
				// 调用支付流程
					uni.showLoading()
					let params = {"orderId": this.orderId}
					userService.getShopOrder(params).then(res=>{
						uni.hideLoading();
						if(res.data.code=="200")
						{
							this.payStatus="success"
							this.icon = "checkmarkempty";
							this.title="付款成功";
						}
						
					}).catch(err=>{
						uni.hideLoading();
						uni.showToast({
							icon:"none",
							title: err.errMsg
						})
					})
			},
			// 关闭modal
			closeModal(){
				this.showModal = false;
			},
			// 修改昵称
			confirmPwd(){
				uni.showLoading()
				let params = {pwd: this.pwd}
				let _this=this
				userService.vsecondaryPwd(params).then(res => {
					uni.hideLoading();
					if(res.data.code=="200")
					{
						// 支付流程
						if(_this.payType === "1") {
							// 支付宝支付
							uni.showToast({
								title: "支付宝支付"
							})
							// this.callbackAfterPay()
							_this.alipay();
						} else {
							// 支付宝支付
							uni.showToast({
								title: "Mb支付宝支付"
							})
							_this.mbPay();
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
		onLoad(option) {
			this.payStatus = option.payStatus;
			this.title = this.payStatus === "success" ? "付款成功" : "付款失败";
			this.icon = this.payStatus === "success" ? "checkmarkempty" : "closeempty";
			this.orderId=option.orderId
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
	.nearby-orderResult-page{
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
				background-color: #fff;
				position: absolute;
				left: 50%;				
				top: 316upx;
				transform: translateX(-50%);
				padding: 0upx 30upx 60upx;
				box-sizing: border-box;
				.QR-code{
					padding: 60upx 0 40upx;
					.image{
						width: 200upx;
						height: 200upx;
						image{
							width: 100%;
							height: 100%;
						}
					}
					.text{
						padding: 10upx 0;
					}
				}
				.info-item{
					padding-top:60upx;
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
				.name{width: 400upx;}
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