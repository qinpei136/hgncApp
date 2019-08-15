<template>
	<!-- 提现记录 -->
	<view class="withdrawalsRecordPage">
		<view class="list">
			<view class="row-item uni-flex common-pa-30" v-for="(item, index) in dataList" :key="index" @tap="toDetail">
				<view class="left uni-flex-item">
					<view class="title uni-h5 uni-bold uni-flex uni-row">
						<text class="uni-inline-item">{{item.title}}</text>
						<text class="tag uni-inline-item" :class="{'success': item.status === '1'}">{{item.status === '1'? '提现成功':'提现失败'}}</text>
					</view>
					<view class="date uni-text-gray uni-text-small">
						{{item.date}}
					</view>
				</view>
				<view class="right uni-flex-item uni-flex">
					<view class="money uni-flex-item uni-flex">
						￥{{item.money}}
					</view>
					<view class="icon uni-inline-item flex-center-center">
						<uni-icon type="arrowright" size="20"></uni-icon>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		uniIcon
	} from '@dcloudio/uni-ui';
	export default {
		components: {
			uniIcon
		},
		data() {
			return {
				dataList: [{
					title: "提现申请",
					date: "2019-11-11 20:33:20",
					money:"44.22",
					status: "1"
				},{
					title: "提现申请",
					date: "2019-11-11 20:33:20",
					money:"48.22",
					status: "0"
				},{
					title: "提现申请",
					date: "2019-11-11 20:33:20",
					money:"54.22",
					status: "1"
				},{
					title: "提现申请",
					date: "2019-11-11 20:33:20",
					money:"224.22",
					status: "1"
				},{
					title: "提现申请",
					date: "2019-11-11 20:33:20",
					money:"4994.22",
					status: "0"
				},{
					title: "提现申请",
					date: "2019-11-11 20:33:20",
					money:"44.22",
					status: "1"
				},{
					title: "提现申请",
					date: "2019-11-11 20:33:20",
					money:"48.22",
					status: "0"
				},{
					title: "提现申请",
					date: "2019-11-11 20:33:20",
					money:"54.22",
					status: "1"
				},{
					title: "提现申请",
					date: "2019-11-11 20:33:20",
					money:"224.22",
					status: "1"
				},{
					title: "提现申请",
					date: "2019-11-11 20:33:20",
					money:"4994.22",
					status: "0"
				},{
					title: "提现申请",
					date: "2019-11-11 20:33:20",
					money:"44.22",
					status: "1"
				},{
					title: "提现申请",
					date: "2019-11-11 20:33:20",
					money:"48.22",
					status: "0"
				},{
					title: "提现申请",
					date: "2019-11-11 20:33:20",
					money:"54.22",
					status: "1"
				},{
					title: "提现申请",
					date: "2019-11-11 20:33:20",
					money:"224.22",
					status: "1"
				},{
					title: "提现申请",
					date: "2019-11-11 20:33:20",
					money:"4994.22",
					status: "0"
				}]
			}
		},
		methods: {
			toDetail() {
				uni.navigateTo({
					url: "withdrawals_record_detail"
				})
			}
		},
	}
</script>

<style lang="scss">
	.withdrawalsRecordPage{
		.list{
			.row-item{
				width: 100%;
				height: 120upx;
				border-bottom: 1upx solid #f0f0f0;
				box-sizing: border-box;
				.title{
					align-items: center;
					.tag{
						height: 36upx;
						line-height: 36upx;
						border-radius: 2upx;
						color: #f7695b;
						background-color: #ffedeb;
						font-size: 20upx;
						padding: 0 10upx;
						box-sizing: border-box;
						margin-left: 10upx; 
						&.success{
							color: #20c380;
							background-color: #e8f9f1;
						}
					}
				}
				.money{
					align-items: center;
					justify-content: flex-end;
				}
				.icon{
					width: 70upx;
					color: #999;
				}
			}
		}
	}
</style>
