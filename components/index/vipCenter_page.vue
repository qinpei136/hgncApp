<template>
	<view class="vipCenterPage">
		<!-- 状态栏 -->
		<statusBar></statusBar>
		<view class="header">
			<!-- 销售经理以上才展示 -->
			<view class="title" v-if="subTitle">
				{{subTitle}}
			</view>
			<view class="userinfo">
				<view class="face">
					<image :src="userFace"></image>
				</view>
				<view class="info">
					<view class="username">{{ userName }}</view>
					<view class="integral uni-flex">
						<text class="icon iconfont iconshouji"></text>
						{{ encryptPhone }}
					</view>
				</view>
				<view class="info2 uni-text-small" @tap="copyId">
					<text class="id iconfont iconid1"></text>
					<text class="text">{{userInviteCode}}</text>
					<view class="icon">
						<uni-icon type=""></uni-icon>
					</view>
				</view>
			</view>
		</view>
		<view class="table">
			<view class="row uni-flex">
				<view class="row-item uni-flex-item uni-center">
					<!-- 图标 -->
					<view class="iconfont iconAintegral flex-center-center"></view>
					<view class="top">
						我的积分
					</view>
					<view class="bottom">
						999
					</view>
				</view>
				<view class="row-item uni-flex-item uni-center">
					<view class="iconfont iconm_coin1 flex-center-center">
					</view>
					<view class="top">
						今日释放M币
					</view>
					<view class="bottom">
						{{releasedToday}}枚
					</view>
				</view>
				<view class="row-item uni-flex-item uni-center" @tap="toIntegralCenter(1)">
					<view class="iconfont iconwallet1 flex-center-center">
					</view>
					<view class="top">
						M币钱包>
					</view>
					<view class="bottom">
						9999.99枚
					</view>
				</view>
			</view>

			<view class="row uni-flex">
				<view class="row-item uni-flex-item uni-center" @tap="toMyOrder">
					<view class="iconfont iconBill flex-center-center">
					</view>
					<view class="top">
						我的订单
					</view>
					<view class="bottom">
						购买记录
					</view>
				</view>
				<view class="row-item uni-flex-item uni-center" @tap="toIntegralCenter(0)">
					<view class="iconfont icondata flex-center-center">
					</view>
					<view class="top">
						{{userLevel > 1?"积分中心":"数据中心"}}
					</view>
					<view class="bottom">
						数据详情
					</view>
				</view>
				<view class="row-item uni-flex-item uni-center" @tap="toMyTeam">
					<view class="iconfont iconclient flex-center-center">
					</view>
					<view class="top">
						{{userLevel > 1?"我的团队":"客户管理"}}
					</view>
					<view class="bottom">
						{{userLevel > 1?"团队数据":"团队数据"}}
					</view>
				</view>
			</view>
			<!-- 销售经理以上才展示 -->
			<view class="row uni-flex" v-if="userLevel > 1">
				<view class="row-item uni-flex-item uni-center" @tap="toFundManagement">
					<view class="iconfont iconcommission flex-center-center">
					</view>
					<view class="top">
						资金管理
					</view>
					<view class="bottom">
						佣金提现
					</view>
				</view>
				<view class="row-item uni-flex-item uni-center" @tap="toSalesManagement">
					<view class="iconfont iconsale flex-center-center">
					</view>
					<view class="top">
						销售管理
					</view>
					<view class="bottom">
						销售记录
					</view>
				</view>
				<view class="row-item uni-flex-item uni-center" @tap="toPerformanceManagement">
					<view class="iconfont iconPerformance flex-center-center">
					</view>
					<view class="top">
						业绩管理
					</view>
					<view class="bottom">
						业绩详情
					</view>
				</view>
			</view>
		</view>
		<!-- 跳转列表 -->
		<myList :pageList="pageList" @handleClick="handleClick"></myList>
		<!-- 客服电话 -->
		<view class="telphone flex-center-center uni-row uni-text-small text-color-gray">
			<view class="iconfont iconicon_telephone"></view>
			<text>客服电话：</text>
			<text>{{customerTelephone}}</text>
		</view>
	</view>
</template>

<script>
	import {
		uniIcon,
	} from '@dcloudio/uni-ui';
	import {
		mapState,
		mapMutations,
		mapActions
	} from 'vuex';
	import util from "../../common/util.js";
	import service from "../../common/service.js";
	import myList from "../../components/common/my-list";
	export default {
		components: {
			uniIcon,
			myList
		},
		data() {
			return {
				// 我的积分
				myScore: "",
				// 今日释放积分
				releasedToday: "",
				// M币钱包
				myMbScore: "",
				// 跳转其他功能页面列表
				pageList: [{
						title: '邀请会员',
						iconfont: 'iconinvite',
						extra:{},
						isShowExtra: false,
						isShowArrow: true,
					},
					{
						title: '积分转让',
						iconfont: 'icontransfer',
						extra:{},
						isShowExtra: false,
						isShowArrow: true,
					},
					{
						title: '实体加盟',
						iconfont: 'iconjoin',
						extra:{
							text: '需实名认证',
							color: "#ff8c4f"
						},
						isShowExtra: true,
						isShowArrow: true,
					}
				]
			};
		},
		computed: {
			...mapState(['userName', 'userLevel', 'userFace', 'userPhone', 'userInviteCode', 'customerTelephone']),
			// 
			subTitle() {
				let title = "";
				switch (this.userLevel) {
					case 4:
						title = "大区经理，你好！"
						break;
					case 3:
						title = "业务总监，你好！"
						break;
					case 2:
						title = "销售经理，你好！"
						break;
					case 1:
						title = ""
						break;
					default:
						break;
				}
				return title;
			},
			// 处理手机号加密
			encryptPhone(){
				if(this.userPhone){
					let start = this.userPhone.slice(0, 3);
					let end = this.userPhone.slice(-4);
					return `${start}****${end}`;
				}
			}
		},
		methods: {
			init() {
				// 查询今日释放积分
				this.getReleaseGold();
				// 判断当前用户是否，已经进行实名认证了
				
			},
			// 查询今日释放积分
			getReleaseGold(){
				uni.showLoading()
				service.getReleaseGold().then(res=>{
					uni.hideLoading();
					this.releasedToday = res.data.data || "0.00";
				}).catch(err=>{
					uni.hideLoading();
					uni.showToast({
						icon:"none",
						title: err.errMsg
					})
				})
			},
			// 复制id
			copyId() {
				uni.setClipboardData({
					data: this.userInviteCode,
					success: () => {
						uni.showToast({
							icon: "none",
							title: "成功复制邀请码到剪切板"
						});
					}
				});
			},
			// 我的订单
			toMyOrder() {
				uni.navigateTo({
					url: '../../mine/order_list?index=0'
				})
			},
			// 积分中心
			toIntegralCenter(index) {
				// 根据index的不同展示不同的tab
				uni.navigateTo({
					url: '../../vipCenter/intergral_center'
				})
			},
			// 我的团队
			toMyTeam() {
				uni.navigateTo({
					url: '../../vipCenter/my_team'
				})
			},
			// 资金管理
			toFundManagement() {
				uni.navigateTo({
					url: '../../vipCenter/fund_management'
				})
			},
			// 销售管理
			toSalesManagement() {
				uni.navigateTo({
					url: '../../vipCenter/sales_management'
				})
			},
			// 业绩管理
			toPerformanceManagement() {
				uni.navigateTo({
					url: '../../vipCenter/performance_management'
				})
			},
			// 点击跳转
			handleClick(data) {
				console.log(data)
				// 邀请会员
				if (data.index === 0) {
					uni.showToast({
						title: '分享去邀请会员'
					})
					// uni.navigateTo({
					// 	url: "/pages/mine/change_telphone"
					// })
					// 积分转让
				} else if (data.index === 1) {
					uni.navigateTo({
						url: "/pages/vipCenter/intergral_transfer"
					})
					// 实体加盟（我要开店）
				} else if (data.index === 2) {
					// 未认证，跳转认证页面;已认证，跳转店铺管理
					let url = data.item.isShowExtra ? "/pages/vipCenter/authentication" : "/pages/vipCenter/store_management";
					uni.navigateTo({
						url: url
					})

				}
			}
		},
		created() {
			// 关闭下拉刷新
			util.setRefreshMode(false);
			
			// 初始化
			this.init()
			
			// 判断当前用户是否有店铺
			
		}
	};
</script>

<style lang="scss">
	page {
		width: 100%;
		height: 100%;
		background-color: #f0f0f0 !important;
	}

	.vipCenterPage {
		.header {
			background-color: #242424;
			width: 100%;
			margin-top: 0;
			/*  #ifdef  APP-PLUS  */
			margin-top: var(--status-bar-height);

			/*  #endif  */
			.title {
				text-align: center;
				color: #fff;
				padding: 30upx 10upx 0;
				height: 50upx
			}

			.userinfo {
				width: 100%;
				height: 200upx;
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding: 30upx 0 30upx 30upx;
				box-sizing: border-box;

				.face {
					flex-shrink: 0;
					width: 136upx;
					height: 136upx;
					border-radius: 50%;
					border: 4upx solid #fff;
					image {
						width: 100%;
						height: 100%;
						border-radius: 50%;
					}
				}

				.info {
					display: flex;
					flex-flow: wrap;
					padding-left: 30upx;

					.username {
						width: 100%;
						color: #fff;
						font-size: 32upx;
					}

					.integral {
						display: flex;
						align-items: center;
						height: 40upx;
						color: #999;
						background-color: rgba(0, 0, 0, 0.1);
						border-radius: 20upx;
						font-size: 24upx;

						.icon {
							width: 30upx;
							height: 100%;
							margin-right: 10upx;
							display: block;
							font-size: 22upx;
							color: #fff;
							text-align: left;
							line-height: 42upx;
						}
					}
				}

				.info2 {
					height: 48upx;
					padding: 0 20upx;
					background: linear-gradient(to right, #e5bd77, #c09853);
					border-top-left-radius: 24upx;
					border-bottom-left-radius: 24upx;
					box-sizing: border-box;
					display: flex;
					align-items: center;
					justify-content: center;

					.id {
						width: 24upx;
						height: 24upx;
						display: inline-block;
						font-size: 24upx;
						color: #242424;
						line-height: 28upx;
					}

					.text {
						display: block;
						height: 100%;
						line-height: 48upx;
						font-size: 24upx;
						font-weight: 700;
						padding: 0 10upx;
						color: #242424;
						box-sizing: border-box;
					}

					.icon {
						width: 18upx;
						height: 18upx;
						display: inline-block;
						background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAMAAABhEH5lAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA4RpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDozNjAwZGU1Yi03YmNmLTNkNDctYjg2OC0wMWQxM2NmYTZlOGQiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MzcxODE3OUY1QzU3MTFFOThEMjJEM0JGOEI5MUMzNDUiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MzcxODE3OUU1QzU3MTFFOThEMjJEM0JGOEI5MUMzNDUiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKFdpbmRvd3MpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6MzIyM2I1NTktMWEzZS03YjRkLWI0N2ItMWJjMzA1MDRjNjAxIiBzdFJlZjpkb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6NjgyNmRmNjktNTU1Mi0xMWU5LTkzN2UtYzA5MGE2NzQ5MGNmIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+AzmqqwAAAcJQTFRF//////7////9/v///v7+/v78/f/+y6twwJpTy6NeyqNe1bWC1beD///7//780q910rSA0rJ/1riG0bN/1LaE07WB17mFzKReyqJd8ubYwZpX1reIza107+jWzKxzzalt/v7/8uvb/v/7//3+//3/0raE/v/6wppV/v/9/vz9yqNg/v3/9OfX2LmD+//+69/H7N3I0attw5dW/Pv2z690zaJd7ODI17mDx6NlzKRfza9z17mHwJpZzqtzxJ1YwZ5ewJdXy6Ve+/v5+/f26+DO0baB8ufVz692xJlVz6NmvZtT7Obayqpx7+bUwZlU1bqLwJlW/f/8wZhWyadq1raDzap0zKt12bmGzKlx0a508enU7ODK/P//zaRixaNczrF50K1z1rqKzKptzqps//z5zq13zaVn+vv207WD8OfWw5xb7t/K6+DK0reC8ubWzKdwyqZozqpuyqJc/P/907B2zq512LiF8+3h0K11zapy8+jU1LaA+/z3xqJmzKlv07OC2buJ0bOB/f39zKpq1riE8eXX8OTU8OfY0a9y1raF1LSBzapwyqVhwJdVwJlU//v48ejW1bmHxZ9g0LB38OnZ8ebUb5NwywAAATFJREFUeNocjlVXQlEUhGfvc+6lUURQwUAwwO7u7u7u7u7uzv/rXT7My6xvfTMoDAvbyr3Od/e7zXuhIaumuTJUGpOSGrMZQvgJKiMwhlFDuKEIzNTJxJxAFIlwg9GYmbIW8TF0XxfxrojkWbw8pBY7bz6dPSGhx9PjAS9N4FkCTIKEBV6l4E5BNIIASEIcSBLH1EBGYgcaJvwWqDSCwxX8U4TY36PbqH1OwEAe0KdVvqqLx1qzOb7aCl06ZC++QYrmh5UEpG5YohT1IBYCQluQrMtgbCIHvvlJk8nhaD9hblmmq3IciG3E/iy2RjXPQMTobKdt2AURSy3MKs5cHW8NGEyDUODR7loJ64l6fRc2YGFAFUKFR/nKKtFXYGlqIf7Jdn4ZbA+2d7uaEl/1fwIMADVBME8p3UUbAAAAAElFTkSuQmCC");
						background-size: 100%;
					}
				}
			}

			.setting {
				flex-shrink: 0;
				width: 6vw;
				height: 6vw;

				image {
					width: 100%;
					height: 100%;
				}
			}
		}

		.table {
			width: 100%;
			margin-bottom: 20upx;
			border-bottom: 1upx solid #f0f0f0;
			background-color: #fff;

			.row {
				height: 212upx;
				border-bottom: 1upx solid #f0f0f0;

				&:last-child {
					border-bottom: none;
				}

				.row-item {
					border-right: 1upx solid #f0f0f0;

					&:last-child {
						border-right: none;
						margin-bottom: none;
					}

					.iconfont {
						width: 100%;
						height: 110upx;
						font-size: 80upx;
						color: #1359ed;
					}

					.top {
						color: #242424;
						font-weight: 600;
						font-size: 26upx;
					}

					.bottom {
						color: #999;
						font-size: 24upx;
					}
				}
			}
		}

		.telphone{
			height: 150upx;
			margin-bottom: 100upx;
		}
	}
</style>
