<template>
	<view class="orderListPage">
		<view class="tabs uni-flex">
			<view class="tab uni-flex-item flex-center-center" :class="{active: index === tabs.current}" v-for="(item, index) in tabs.items"
			 :key="index" @tap="changeTabs(index)">
				<view class="name">
					{{item}}
				</view>
				<view class="line-bottom"></view>
			</view>
		</view>
		<!-- 列表内容 -->
		<view class="order-list">
			<block v-if="!hasNoData">
				<view class="order-list-item" v-for="(item, index) in orderList" :key="index">
					<view class="title-wrap uni-flex" @tap="toOrderDetail(item.orderId)">
						<view class="iconfont icondianpu uni-inline-item">

						</view>
						<view class="title uni-inline-item">
							<view class="">
								{{item.orderId}}
							</view>
						</view>
						<view class="status uni-inline-item">
							{{item.statusText}}
						</view>
					</view>
					<view class="order-info uni-flex" @tap="toOrderDetail(item.orderId)">
						<view class="image uni-inline-item">
							<image :src="item.imageUrl" mode="aspectFit"></image>
						</view>
						<view class="info uni-flex-item">
							<view class="name uni-h5">
								<text style="color:#242424;font-weight:bold;">{{item.title}}</text><text style="color:#aaa;font-size:20upx;margin-left:10upx;">X1</text>
								<view class="total-price">
									￥<text>{{item.price}}</text>
								</view>
							</view>
							<view class="code uni-text-small text-color-gray uni-column uni-flex">
								<!-- <text>订单编号: {{item.orderId}}</text> -->
								<text>订单时间: {{item.ordersTime}}</text>
								<text style="line-height:1.4">送货地址: {{item.address}}</text>
							</view>
						</view>
					</view>
					<view class="btn" style="text-align: right;line-height:1;padding:30upx 0;margin-top:14upx;">
						<!-- 再来一单 -->
						<!-- <button type="primary" v-if="item.status === 'd'" size="mini" style="border:1upx solid #c6c6c6;color:#242424;background-color:#fff;border-radius:0;font-weight:bold;" @tap="toGoodsDetail(item.GoodsId)">再来一单</button> -->
						<!-- 确认收货 -->
						<button type="primary" v-if="item.status === '2'" size="mini" style="border:1upx solid #c6c6c6;color:#242424;background-color:#fff;border-radius:0;font-weight:bold;" @tap="confirmHarvest(item)">确认收货</button>
						<!-- 去付款 -->
						<button type="primary" v-if="item.status === '0'" size="mini" style="border:1upx solid #c6c6c6;color:#242424;background-color:#fff;border-radius:0;font-weight:bold;" @tap="toPay(item)">去付款</button>
					</view>
					
				</view>
			</block>
			<!-- 暂无数据 -->
			<block v-if="hasNoData">
				<noData :text="noDataText"></noData>
			</block>
		</view>
	</view>
</template>

<script>
	import {
		uniTag,
		uniIcon,
		uniNavBar
	} from '@dcloudio/uni-ui';
	import _ from "lodash";
	import userService from '../../common/userService.js';
	import util from "../../common/util.js";
	import noData from "../../components/common/no-data.vue";
	import { mapMutations } from 'vuex';
	export default {
		components: {
			uniTag,
			noData
		},
		data() {
			return {
				tabs: {
					// 选项卡
					items: ['全部', '待付款', '待发货', '待收货', '已完成'],
					current: "a",
				},
				orderList: [],
				// 状态查询字段
				statusParam: "",
				page: 1,
				noDataText: "暂无订单相关数据"
			}
		},
		computed: {
			hasNoData() {
				return this.orderList.length === 0;
			}
		},
		onReachBottom() {
			// 加载更多
			this.page++;
			this.getOrderList(this.statusParam);
		},
		methods: {
			...mapMutations(['INIT_ORDER_lIST']),
			// initData(id){
			// 	service.getGoodsDetail().then();
			// },
			// 获取订单列表
			getOrderList(status) {
				let params = {
					status: status,
					page: this.page,
					pageSize: 10,
				}
				uni.showLoading();
				userService.getOrderList(params).then(res => {
						uni.hideLoading();
					if(res.data.code=="200")
					{
						let data = res.data.result;
						if (data.length > 0) {
							_.forEach(data, item => {
								// // 拼接图片链接
								item.imageUrl = util.getImageUrl(item.img)
								// 转换订单状态
								item.statusText = this.traslateStatus(item.status, "TO-TEXT");
								// 待收获状态，有确认收货按钮（一键结束流程）
								item.hasReceiptBtn = status === 2 ? true : false;
							})
							this.orderList = this.orderList.concat(data);
						}
					}
					else
					{
						if(res.data.code!="204")
						{
							uni.showToast({
								icon: "none",
								title: res.data.msg
							})
						}
					}
					
				}).catch(err => {
					uni.hideLoading();
					uni.showToast({
						icon: "none",
						title: err.message
					})
				})
			},
			//确认收货
			putOrderDone(item) {
				let params = {
					orderid: item.orderId
				}
				uni.showLoading();
				userService.putOrderDone(params).then(res => {
					uni.hideLoading();
					uni.showToast({
						icon: "none",
						title: res.data.msg
					})
					item.status='d'
				}).catch(err => {
					uni.hideLoading();
					uni.showToast({
						icon: "none",
						title: err.message
					})
				})
			},
			// 切换选项卡
			changeTabs(index) {
				if (this.tabs.current !== index) {
					this.tabs.current = index;
					// 初始化查询条件
					this.page = 1;
					this.statusParam = this.traslateStatus(this.tabs.current);
					this.orderList = [];
					this.getOrderList(this.statusParam);
				}
			},
			// 订单详情
			toOrderDetail(id) {
				uni.navigateTo({
					url: `/pages/mine/order_detail?id=${id}`
				})
			},
			// 商品详情
			// toGoodsDetail() {
			// 	uni.navigateTo({
			// 		url: "/pages/home/goods_detail"
			// 	})
			// },
			// 确认收货
			confirmHarvest(orderId){
				util.confirm({
					title: '',
					content: '是否确认收货',
					success: () => {
						this.putOrderDone(orderId)
					}
				})
			},
			// 去付款
			toPay(data){
				// 同步vuex  
				let good = {
					goodsId: data.goodsId,
					title: data.title,
					imageUrl: data.imageUrl,
					standardId: data.id,
					standardText: data.detail,
					num: data.num,
					price: data.price
				}
				this.INIT_ORDER_lIST([good]);
				uni.navigateTo({
					url: `/pages/shopCart/order_pay?hadOrderId=true`
				});
			},
			// 转化status为对应的文字
			// value-需要转化的值；mode-转化模式：TO-TEXT:状态码转文字，TO-PARAM: tab下标转为查询参数
			traslateStatus(value, mode) {
				let tValue = "";
				if (mode === "TO-PARAM" || !mode) {
					switch (value) {
						case 0:
							// 全部
							tValue = "a";
							break;
						case 1:
							// 待付款
							tValue = "0";
							break;
						case 2:
							// 待发货
							tValue = "1";
							break;
						case 3:
							// 待收货
							tValue = "2";
							break;
						case 4:
							// 已完成
							tValue = "d";
							break;
						default:
							break;
					}
				} else {
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
						default:
							break;
					}
				}
				return tValue;
			}
		},
		onLoad(e) {
			// 获取页面传参 - 当前tab
			this.tabs.current = e.index - 0;
			// 初始化状态字段
			this.statusParam = this.traslateStatus(this.tabs.current);
			// 初始化页面数据
			this.getOrderList(this.statusParam);
		},

	}
</script>

<style lang="scss">
	.orderListPage {
		background-color: #f0f0f0;

		.tabs {
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

			.tab {
				position: relative;

				&.active {
					color: #242424;

					.line-bottom {
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

		.order-list {
			/* #ifdef H5 */
			padding-top: 80upx;
			/* #endif */
			/*  #ifdef  APP-PLUS  */
			padding-top: calc(var(--status-bar-height) + 30upx);

			/* #endif */
			.order-list-item {
				background-color: #fff;
				width: 100%;
				border: 1px solid #eee;
				padding: 0 30upx;
				box-sizing: border-box;
				margin-top: 16upx;

				.title-wrap {
					width: 100%;
					height: 74upx;
					border-bottom: 1upx solid #f0f0f0;

					.title {
						// line-height: 74upx;
						width: 600upx;
					}

					.status {
						width: 100upx;
					}
				}

				.order-info {
					.image {
						width: 184upx;
						height: 184upx;
						margin-top: 30upx;
						margin-right: 20upx;

						image {
							width: 100%;
							height: 100%;
						}
					}

					.info {
						margin-top: 18upx;

						.name {

							// 合计的价格
							.total-price {
								float: right;
								font-weight: bold;
								color: #1c5ef0;
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
