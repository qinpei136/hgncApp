<template>
	<view class="minePage">
		<!-- 状态栏 -->
		<statusBar></statusBar>
		<view class="header uni-flex" @tap="toAccountInfo">
			<view class="face uni-inline-item">
				<image :src="userinfo.face"></image>
			</view>
			<view class="info uni-flex-item uni-flex uni-column" v-if="hasLogin">
				<view class="username">{{userinfo.userName}}</view>
				<view class="integral">ID: {{userinfo.id}}</view>
			</view>
			<view class="setting uni-inline-item">
				<uni-icon type="arrowright" size="20"></uni-icon>
			</view>
		</view>
		<view class="orders">
			<view class="title uni-flex">
				<view class="uni-h4 uni-flex-item">
					我的订单
				</view>
				<view class="to-all-orders uni-flex-item uni-link" @tap="toOrderType(0)">
					所有订单 >
				</view>
			</view>
			<view class="box">
				<view class="label" hover-class="hoverd" @tap="toOrderType(1)">
					<view class="icon">
						<view class="badge" v-if="dfk_num>0">{{dfk_num}}</view>
						<text class="iconfont iconxingzhuang"></text>
					</view>
					<view class="text">
						待付款
					</view>
				</view>
				<view class="label" hover-class="hoverd" @tap="toOrderType(2)">
					<view class="icon">
						<view class="badge" v-if="dfh_num>0">{{dfh_num}}</view>
						<text class="iconfont iconxingzhuang1"></text>
					</view>
					<view class="text">
						待发货
					</view>
				</view>
				<view class="label" hover-class="hoverd" @tap="toOrderType(3)">
					<view class="icon">
						<view class="badge" v-if="dsh_num>0">{{dsh_num}}</view>
						<text class="iconfont iconxingzhuang2"></text>
					</view>
					<view class="text">
						待收货
					</view>
				</view>
				<view class="label" hover-class="hoverd" @tap="toOrderType(4)">
					<view class="icon">
						<text class="iconfont iconxingzhuang3"></text>
					</view>
					<view class="text">
						已完成
					</view>
				</view>
			</view>
			<view class="bg-bar"></view>
		</view>
		<!-- 跳转列表 -->
		<myList :pageList="pageList" @handleClick="handleClick"></myList>
		<view class="version">
			当前版本号: {{version}}
		</view>
	</view>
</template>
<script>
	import {
		uniIcon
	} from '@dcloudio/uni-ui';
	import {
		mapMutations,
		mapState,
		mapGetters,
		mapActions
	} from 'vuex';
	import myList from "../../components/common/my-list";
	import util from "../../common/util.js";
	export default {
		components: {
			uniIcon,
			myList
		},
		data() {
			return {
				userinfo: {},
				version: "",
				// 跳转其他功能页面列表
				pageList: [{
						title: '换绑手机',
						iconfont: 'iconshouji',
						extra: {},
						isShowExtra: false,
						isShowArrow: true,
					},
					{
						title: '收货地址',
						iconfont: 'iconaddress',
						extra: {},
						isShowExtra: false,
						isShowArrow: true,
					},
					{
						title: '密码管理',
						iconfont: 'iconpssword_management',
						extra: {},
						isShowExtra: true,
						isShowArrow: true,
					}
				]
			};
		},
		computed: {
			...mapState(["hasLogin"]),
			...mapGetters(["dfk_num",, "dfh_num", "dsh_num"])
		},
		mounted() {
			
			// 刷新用户信息
			this.refreshMemberInfo();
			this.updataOrderList();
			console.log(this.dfk_num)
		},
		onLoad() {
			// 关闭刷新
			util.setRefreshMode(false);
			//加载
			this.refreshMemberInfo();
			// #ifdef APP-PLUS
			this.version = plus.runtime.version;
			// #endif
		},
		methods: {
			...mapActions(["updataOrderList"]),
			refreshMemberInfo() {
				this.userinfo = {
					face: '/static/HM-PersonalCenter/face_default.png',
					userName: this.$store.state.userName,
					id: this.$store.id
				}
			},
			login() {
				uni.navigateTo({
					url: "/pages/login/login",
					animationType: "slide-in-bottom"
				})
			},
			// 修改账户信息
			toAccountInfo() {
				uni.navigateTo({
					url: `/pages/mine/account_info`
				})
			},
			//用户点击订单类型
			toOrderType(index) {
				uni.navigateTo({
					url: `/pages/mine/order_list?index=${index}`
				})
			},

			// 点击跳转
			handleClick(data) {
				// 换绑手机
				if (data.index === 0) {
					uni.navigateTo({
						url: "/pages/mine/change_telphone"
					})
					// 收货地址
				} else if (data.index === 1) {
					uni.navigateTo({
						url: "/pages/mine/address_management"
					})
					// 管理密码
				} else if (data.index === 2) {
					uni.navigateTo({
						url: "/pages/mine/gesture_lock?mode=set"
					})

				}
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #fff
	}

	.minePage {
		/* #ifdef APP-PLUS */
		padding-top: var(--status-bar-height);
		/* #endif */
		.header {
			background: linear-gradient(135deg, #242424, #343434);
			width: 100%;
			height: 220upx;
			padding: 20upx 30upx;
			box-sizing: border-box;
			align-items: center;
			.face {
				width: 130upx;
				height: 130upx;
				border-radius: 50%;
				margin-right: 30upx;
				image {
					display: inline-block;
					border: 4px solid #fff;
					box-sizing: border-box;
					width: 130upx;
					height: 130upx;
					border-radius: 50%;
				}
			}

			.info {
				color: #fff;
				.username {
					width: 100%;
					height: 40upx;
					line-height: 40upx;
					font-size: 32upx
				}
				.integral {
					width: 100%;
					padding: 0;
					height: 40upx;
					font-size: 24upx;
					color: #999;
				}
			}
			
			.setting {
				color: #fff;
			}
		}

		.hoverd {
			background-color: #eee
		}

		.orders {
			background-color: #fff;
			width: 100%;

			.title {
				width: 100%;
				padding: 15upx 30upx;
				border-bottom: 1upx solid #eee;
				box-sizing: border-box;

				.to-all-orders {
					text-align: right;
					line-height: 2;
					color: #aaaaaa;
				}
			}

			.box {
				width: 100%;
				display: flex;
				align-items: center;
				justify-content: center;

				.label {
					width: 100%;
					height: 160upx;
					color: #666666;
					padding: 20upx 0;
					font-size: 26upx;
					display: flex;
					align-items: center;
					justify-content: center;
					flex-direction: column;

					.icon {
						position: relative;
						width: 60upx;
						height: 60upx;

						.badge {
							position: absolute;
							width: 36upx;
							height: 36upx;
							background-color: #1358ef;
							top: -14upx;
							left: 46upx;
							border-radius: 100%;
							font-size: 18upx;
							color: #fff;
							display: flex;
							align-items: center;
							justify-content: center;
							z-index: 10;
						}
						.iconfont{
							display: block;
							width: 60upx;
							height: 60upx;
							text-align: center;
							line-height: 60upx;
							font-size: 60upx;
							color: #242424;
						}
					}

					.text {
						margin-top: 18upx;
					}
				}
			}

			.bg-bar {
				width: 100%;
				height: 30upx;
				background-color: #eee;
			}
		}

		.list {
			width: 100%;
		}

		.version {
			width: 100%;
			margin-top: 50upx;
			text-align: center;
		}

		.uni-list-item /deep/ .uni-list-item__container:after {
			left: 50px;
		}

		.uni-list-item:last-child /deep/ .uni-list-item__container:after {
			display: none;
		}
	}
</style>
