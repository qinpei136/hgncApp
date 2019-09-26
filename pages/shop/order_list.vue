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
			<block v-if="!hasNoData">
				<view class="order-list-item" v-for="(item, index) in orderList" :key="index" >
					<view class="order-info uni-flex" @tap="toOrderDetail(item.shopOrderId)">
						<view class="image uni-inline-item" >
							<image :src="item.goodsImg" mode="aspectFit"></image>
						</view>
						<view class="info uni-flex-item">
							<view class="name uni-h5">
								<text style="color:#242424;font-weight:bold;">购买人：{{item.userPhone}}</text>
							</view>
							<view class="name uni-h5">
								<text>下单时间: {{item.orderTime}}</text>
								<!-- <view class="total-price">
									<text>></text>
								</view> -->
							</view>
							<view class="name uni-h5">
								<text>本单金额: {{item.price}}/{{item.price}}M币</text>
							</view>
						</view>
					</view>
					<view class="btn" style="text-align: right;line-height:1;padding:10upx;margin-top:14upx;box-sizing: border-box;" @tap="toOrderDetail(item.shopOrderId)">
						<button v-if='item.ststus==1' type="primary" size="mini" style="border:1upx solid #c6c6c6;color:#242424;background-color:#fff;border-radius:0;font-weight:bold;">去核销</button>
						<button v-else-if='item.ststus==0' type="primary" size="mini" style="border:1upx solid #c6c6c6;color:#242424;background-color:#fff;border-radius:0;font-weight:bold;">去关闭</button>
						<button v-else type="primary" size="mini" style="border:1upx solid #c6c6c6;color:#242424;background-color:#fff;border-radius:0;font-weight:bold;">详情</button>
					</view>
				</view>
			</block>
			<!-- 暂无数据 -->
			<block v-if="hasNoData">
				<noData :text="noDataText"></noData>
				<view v-if="tabs.current===0" class="uni-btn-v">
					<button @click="add()" class="btn">添加商品</button>
				</view>
			</block>
			
			
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
	import { mapMutations } from 'vuex';
	import noData from "../../components/common/no-data.vue";
	export default {
		components: {
			uniIcon,
			noData		
		},
		data() {
			return {	
				tabs: ["待核销","待付款", "已完成", "已关闭"],
				currentTab: 0,
				orderList: [],
				page: 1,
				shopId:'',
				status:'1',
				statuName:'待核销',
				noDataText: "暂无相关订单",
			}
		},
		computed:{
			hasNoData() {
				return this.orderList.length === 0;
			}
		},
		onReachBottom() {
			this.page++
			this.getOrderList();
		},
		methods: {
			...mapMutations(['INIT_ORDER_lIST']),
			initData(id){
				userService.getGoodsDetail().then();
			},
			init()
			{
				uni.showLoading();
				userService.getShopByUserId().then(res => {
				uni.hideLoading();
				if(res.data.code=="200")
				{
					this.shopId=res.data.result.tShops.id
					this.getOrderList();
				}
			}).catch(err => {
				uni.hideLoading();
				uni.showToast({
					icon: "none",
					title: err.message
				})
			})
			},
			// 获取订单列表
			getOrderList(){
				let params = {
					shopId:this.shopId,
					status: this.status,
					page: this.page,
					pageSize: 10,
				}
				uni.showLoading();
				userService.getShopOrderByShopId(params).then(res=>{
					uni.hideLoading();
					if(res.data.code=="200")
					{
						let data = res.data.result;
						if(data.length > 0) {
							// 拼接图片链接
							_.forEach(data, item => {
								item.goodsImg = util.getImageUrl(item.goodsImg)
								// item.orderTime=new Date(item.orderTime).Format("yyyy-MM-dd hh:mm")
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
					this.statuName = this.switchStatusName(this.status);
					this.getOrderList();
				}
			},
			// 订单详情
			toOrderDetail(id){
				uni.navigateTo({
					url: `/pages/shop/order_detail?id=${id}`
				})
			},
			// 转化status
			switchStatus(index){
				let status = "";
				switch (index){
					case 0:
						// 待核销
						status = "1";
						break;
					case 1:
						// 待付款
						status = "0";
						break;
					case 2:
						// 已完成
						status = "d";
						break;
					case 3:
						// 已关闭
						status = "c";
						break;
					default:
						status = "a";
						break;
					}
				return status;
			},
			// 转化statusName
			switchStatusName(status){
				let statuName = "";
				switch (status){
					case "1":
						// 待核销
						statuName = "待核销";
						break;
					case "0":
						// 待付款
						statuName = "待付款";
						break;
					case 'd':
						// 已完成
						statuName = "已完成";
						break;
					case 'c':
						// 已关闭
						statuName = "已关闭";
						break;
					default:
						statuName = "";
						break;
					}
				return statuName;
			},
		},
		onLoad(e) {
			// 初始化页面数据
			this.orderList=[];
			this.status = this.switchStatus(0);
			this.statuName = this.switchStatusName(this.status);
			this.init();
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
								// font-weight:bold;
								// color:#1c5ef0;
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
