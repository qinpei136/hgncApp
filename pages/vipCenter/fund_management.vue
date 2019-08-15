<template>
	<!-- 资金管理 -->
	<view class="fundManagementPage">
		<view class="header">
			<view class="balance uni-flex flex-center-center uni-column">
				<view class="value uni-h3">
					{{balance}}
				</view>
				<view class="name uni-text-small">
					我的余额(元)
				</view>
			</view>
			<view class="uni-flex uni-flex flex-center-center">
				<view class="left uni-flex-item uni-column flex-center-center">
					<view class="value uni-h4">
						+{{newEarnings}}
					</view>
					<view class="name uni-text-small">
						今日收益(元)
					</view>
				</view>
				<view class="right uni-flex-item uni-column flex-center-center">
					<view class="value uni-h4">
						+{{earnings}}
					</view>
					<view class="name uni-text-small">
						已赚取(元)
					</view>
				</view>
			</view>
		</view>
	
		<myList :pageList="pageList" @handleClick="handleClick"></myList>
	</view>
</template>

<script>
	import myList from "../../components/common/my-list"
	export default {
		components: {
			myList
		},
		data() {
			return {
				// 我的余额
				balance: 0,
				// 今日收益
				newEarnings: 0,
				// 已赚取
				earnings: 0,
				// 跳转其他功能页面列表
				pageList: [{
						title: '银行卡管理',
						iconfont: 'iconbankcard',
						extra:{},
						isShowExtra: false,
						isShowArrow: true,
					},
					{
						title: '佣金提现',
						iconfont: 'iconcashwithdrawal',
						extra:{},
						isShowExtra: false,
						isShowArrow: true,
					},
					{
						title: '提现记录',
						iconfont: 'iconwithdrawalsrecord1',
						extra:{},
						isShowExtra: false,
						isShowArrow: true,
					}
				]
			}
		},
		methods: {
			init(){
				this.balance = "23,432,847.99";
				this.newEarnings = 233.55;
				this.earnings = 12349.23;
			},
			// 点击跳转
			handleClick(data) {
				// 银行卡管理
				if(data.index === 0) {
					uni.navigateTo({
						url: "/pages/vipCenter/bank_card"
					})
				// 佣金管理
				} else if (data.index === 1) {
					uni.navigateTo({
						url: '/pages/vipCenter/commissions_management'
					})
				// 提现记录
				} else if (data.index === 2) {
					uni.navigateTo({
						url: '/pages/vipCenter/withdrawals_record'
					})
					
				}
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
	.fundManagementPage{
		.header{
			width: 100%;
			height: 380upx;
			padding: 30upx;
			box-sizing: border-box;
			background: linear-gradient( #242424 , #333);
			margin-bottom: 30upx;
			.balance{
				width: 100%;
				height: 150upx;
				margin-bottom: 50upx;
			}
			.value{
				color: #fff;
			}
			.name{
				color: #999;
			}
		}
	}
</style>
