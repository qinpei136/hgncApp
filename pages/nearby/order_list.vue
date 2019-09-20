<template>
	<view class="orderListPage">
		<view class="tabs uni-flex">
			<view class="tab uni-flex-item flex-center-center" :class="{active: index === currentTab}" v-for="(item, index) in tabs" :key="index" @tap="changeTabs(index)">
				<view class="name">
					{{item}}
				</view>
				<view class="line-bottom"></view>
			</view>
		</view>
		<!-- 列表内容 -->
		<view class="order-list">
			<view class="order-list-item" v-for="(item, index) in orderList" :key="index" >
				<view class="title-wrap uni-flex" @tap="toShopIndex(item.shopId)">
					<view class="iconfont icondianpu uni-inline-item"></view>
					<view class="title uni-h5 uni-flex-item uni-flex">
						<view class="name uni-inline-item">
							{{item.shopName}}
						</view>
						<view class="icon uni-inline-item text-color-gray">
							<uniIcon type="arrowright" size="18"></uniIcon>
						</view>
					</view>
					<view class="order-status uni-inline-item">
						{{item.status}}
					</view>
				</view>
				<view class="order-info uni-flex" @tap="toOrderDetail(item.shopOrderId)">
					<view class="image uni-inline-item" >
						<image :src="item.goodsImg" mode="aspectFit"></image>
					</view>
					<view class="info uni-flex-item">
						<view class="name uni-h5">
							<text style="color:#242424;font-weight:bold;">{{item.title}}</text><text style="color:#aaa;font-size:20upx;margin-left:10upx;">X1</text>
							<view class="total-price">
								￥<text>{{item.price}}</text>
							</view>
						</view>
						<view class="code uni-text-small text-color-gray uni-column uni-flex">
							<text>订单编号: {{item.shopOrderId}}</text>
							<text>订单时间: {{item.orderTime}}</text>
							<text style="line-height:1.4">送货地址: {{item.address}}</text>
						</view>
					</view>
				</view>
				<view class="btn" style="text-align: right;line-height:1;padding:30upx;margin-top:14upx;box-sizing: border-box;" @tap="toGoodsDetail(item.goodsId)">
					<button type="primary" size="mini" style="border:1upx solid #c6c6c6;color:#242424;background-color:#fff;border-radius:0;font-weight:bold;">再来一单</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		uniIcon
	} from '@dcloudio/uni-ui';
	import _ from "lodash";
	import userService from '../../common/userService.js';
	import util from "../../common/util.js";
	export default {
		components: {
			uniIcon		
		},
		data() {
			return {	
				tabs: ["全部", "待核销", "待付款"],
				currentTab: 0,
				orderList: [],
				page: 1/* {
					name: "大藏小玩",
					status: 0,
					title: "防宋代明月石",
					num: 1,
					price: 555.55,
					orderCode: "12323423454566546",
					orderTime: "2019-01-01 12:05:09",
					orderAddress: "奥斯卡的很深刻的经费和思考的家伙水电费你说，都没你份"
				} */
			}
		},
		computed:{
			noData(){
				return this.orderList.length === 0;
			}
		},
		onReachBottom() {
			this.page++
			this.getOrderList();
		},
		methods: {
			initData(id){
				userService.getGoodsDetail().then();
			},
			// 获取订单列表
			getOrderList(){
				let params = {
					status: this.status,
					page: this.page,
					pageSize: 10,
				}
				uni.showLoading();
				userService.getShopOrderByUserId(params).then(res=>{
					uni.hideLoading();
					if(res.data.code=="200")
					{
						let data = res.data.result;
						if(data.length > 0) {
							// 拼接图片链接
							_.forEach(data, item => {
								item.goodsImg = util.getImageUrl(item.goodsImg)
								item.orderTime=new Date(item.orderTime).Format("yyyy-MM-dd hh:mm")
								// this.orderList.push(item)
							})
							this.orderList = this.orderList.concat(data);
						}
					}
				}).catch(err=>{
					uni.hideLoading();
					uni.showToast({
						icon:"none",
						title: err.errMsg
					})
				})
			},
			// 切换选项卡
			changeTabs(index) {
				if (this.currentTab !== index) {
					this.orderList=[];
					this.currentTab = index;
					this.page = 1;
					this.status = this.switchStatus(index);
					this.getOrderList();
				}
			},
			// 店铺首页
			toShopIndex(id){
				uni.navigateTo({
					url: `/pages/nearby/shop_index?id=${id}`
				})
			},
			// 订单详情
			toOrderDetail(id){
				uni.navigateTo({
					url: `/pages/nearby/order_detail?id=${id}`
				})
			},
			// 商品详情
			toGoodsDetail(id){
				uni.navigateTo({
					url: `/pages/nearby/goods_detail?id=${id}`
				})
			},
			// 转化status
			switchStatus(index){
				let status = "";
				switch (index){
					case 0:
						// 全部
						status = "a";
						break;
					case 1:
						// 待核销
						status = "1";
						break;
					case 2:
						// 待付款
						status = "0";
						break;
					default:
						status = "a";
						break;
				}
				return status;
			}
			
		},
		onLoad(e) {
			this.orderList=[];
			this.tabs.current = e.index - 0;
			// 初始化页面数据
			this.status = this.switchStatus(this.tabs.current);
			this.getOrderList();
		},
		
	}
</script>

<style lang="scss">
	.orderListPage{
		background-color:#f0f0f0;
		.tabs{
			width: 100%;
			height: 80upx;
			position: fixed;
			/* #ifdef H5 */
			top: 80upx;
			/* #endif */	
			z-index: 1000;
			background-color: #fff;
			color: #999;
			border-bottom: 1upx solid #f0f0f0;
			.tab{
				position: relative;
				&.active{
					color: #242424;
					.line-bottom{
						width: 20upx;
						height: 6upx;
						background-color: #242424;
						position: absolute;
						bottom: 1upx;
						left: 50%;
						transform: translateX(-10upx);
					}
				}
			}
		}
		.order-list{
			/* #ifdef H5 */
			padding-top: 80upx;
			/* #endif */	
			/*  #ifdef  APP-PLUS  */
			padding-top: 80upx; 
			/* #endif */	
			.order-list-item{
				background-color:#fff;
				width: 100%;
				border: 1px solid #eee;
				margin-top:16upx;
				.title-wrap{
					width: 100%;
					height: 74upx;
					border-bottom: 1upx solid #f0f0f0;	
					padding: 0 30upx;
					box-sizing: border-box;
					.title{
						.name{
							margin: 0 10upx 0 20upx ;
						}
						.icon{
							
						}
					}
					.order-status{
						width: 100upx;
					}
				}
				.order-info{
					padding: 0 30upx;
					box-sizing: border-box;
					.image{
						width: 184upx;
						height: 184upx;
						margin-top:30upx;
						margin-right: 20upx;
						image{
							width: 100%;
							height: 100%;
						}
					}
					
					.info{
						margin-top:18upx;
						.name{
							// 合计的价格
							.total-price{
								float:right;
								font-weight:bold;
								color:#1c5ef0;
							}
						}
					}
				}
				.btn{
					button{
						&::after{
							border-radius: 0;
						}
					}
				}
			}
		}
	}
</style>
