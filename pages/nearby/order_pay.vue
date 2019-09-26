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
		<!-- 订单信息 -->
		<view class="order-info">
			<view class="order-info-item uni-flex">
				<view class="title uni-flex-item">
					订单编号
				</view>
				<view class="info uni-flex-item uni-flex flex-right">
					{{orderId}}
				</view>
			</view>
			<view class="order-info-item uni-flex">
				<view class="title uni-flex-item">
					下单时间
				</view>
				<view class="info uni-flex-item uni-flex flex-right">
					{{createTime}}
				</view>
			</view>
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
							<radio value="alipay" :checked="payType === '1'" ></radio>
						</view>
					</view>
				</view>	

				<view class="pay-type-item uni-flex" :class="!isMbPayAvailable?'disabled':''">
					<view class="title uni-flex uni-flex-item">
						<view class="iconfont iconicon_m uni-inline-item"></view>
						<view class="name uni-inline-item">
							M币支付(余额{{mBalance}})
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
	import { uniIcon } from '@dcloudio/uni-ui';
	import { mapState, mapMutations, mapGetters} from 'vuex';
	import userService from '../../common/userService.js';
	import neilModal from '../../components/neil-modal/neil-modal.vue';
	export default {
		components: {
			uniIcon,
			neilModal,
		},
		data(){
			return {
				// 订单id
				orderId:"",
				createTime:"",
				// 支付方式
				payType: "1",
				// m币余额
				mBalance: 0,
				showModal: false,
				pwd: '',
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
				this.getUser()
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
			// 支付
			toPay(data){
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
						}
					});	
				}).catch(err=>{
					uni.hideLoading();
					uni.showToast({
						icon:"none",
						title: err.errMsg
					})
				})
				
			},
			// M币支付
			mbPay(){
				// 调用支付流程
					uni.showLoading()
					let params = {"ShopOrderId": this.orderId,"MB":this.totalPrice,"addressId":0}
					userService.mbPay(params).then(res=>{
						uni.hideLoading();
						if(res.data.code=="200")
						{
							// 去结果页
							this.toResult("success");
						}
						
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
		onLoad(e) {
			this.orderId=e.orderId
			this.createTime=new Date().toLocaleDateString()
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
				.name{width: 400upx;}
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

