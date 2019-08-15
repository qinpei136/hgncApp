<template>
	<!-- 提现记录详情 -->
	<view class="withdrawalsRecordDetailPage">
		<view class="item">
			<view class="title text-color-gray">
				提现金额
			</view>
			<view class="value">
				￥{{money}}
			</view>
		</view>
		<view class="item">
			<view class="title text-color-gray">
				提现方式
			</view>
			<view class="value">
				{{mode}}
			</view>
		</view>
		<view class="item">
			<view class="title text-color-gray">
				提现状态
			</view>
			<view class="value">
				{{status}}
			</view>
		</view>
		<view class="item">
			<view class="title text-color-gray">
				状态备注
			</view>
			<view class="value">
				{{remark}}
			</view>
		</view>
		<view class="item">
			<view class="title text-color-gray">
				提现创建时间
			</view>
			<view class="value">
				{{creatTime}}
			</view>
		</view>
		<view class="item">
			<view class="title text-color-gray">
				提现订单号
			</view>
			<view class="value">
				{{orderId}}
			</view>
		</view>
		<view class="item">
			<view class="title text-color-gray">
				提现流水号
			</view>
			<view class="value">
				{{serialNo}}
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 提现金额
				money: "",
				// 提现方式
				mode: "人工申请",
				// 提现状态
				status: "提现成功",
				// 状态备注
				remark:  "银行卡冻结",
				// 提现创建时间
				creatTime: "2019-04-15 17:44:55",
				// 提现订单号
				orderId: "45345346456456546546546456",
				// 提现流水号
				serialNo: "4398759843759437598437598437598435"
				
			}
		},
		computed:{
			disabled(){
				return this.card === "";
			}
		},
		methods:{
			init(){
				this.name="奥斯卡"
			},
			// 添加银行卡
			add(){
				// uni.showLoading({})
				uni.showToast({
					title: "添加成功"
				})
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
		background-color: #fff;
	}
	.withdrawalsRecordDetailPage{
		width: 100%;
		padding: 30upx;
		box-sizing: border-box;
		border-top: 1upx solid #f0f0f0;
		.item{
			width: 100%;
			display: flex;
			align-items: center;
			justify-content: space-between;
			margin-bottom: 30upx;
			.title{
				
			}
			.value{
				
			}
		}
	}
</style>