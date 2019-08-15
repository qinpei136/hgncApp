<template>
	<!-- 银行卡管理 -->
	<view class="bankCardPage common-pa-30">
		<view class="card common-pa-30 uni-flex" v-for="(item, index) in datalist" :key="index">
			<view class="image uni-inline-item">
				<image :src="item.imagesUrl" mode="widthFix"></image>
			</view>
			<view class="info uni-flex-item">
				<view class="name uni-h4">
					{{item.name}}
				</view>
				<view class="type">
					{{item.type}}
				</view>
				<view class="code uni-flex">
					<view class="uni-flex-item" >
						****
					</view>
					<view class="uni-flex-item" >
						****
					</view>
					<view class="uni-flex-item" >
						****
					</view>
					<view class="uni-flex-item" >
						{{item.code}}
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	
	export default {
		components:{
			
		},
		data() {
			return {
				datalist: [{
					name: "中国民生银行",
					type: "储蓄卡",
					imagesUrl: "",
					code: "6434"
				},{
					name: "中国银行",
					type: "储蓄卡",
					imagesUrl: "",
					code: "3454"
				},{
					name: "中国工商银行",
					type: "储蓄卡",
					imagesUrl: "",
					code: "6434"
				},{
					name: "招商银行",
					type: "储蓄卡",
					imagesUrl: "",
					code: "6434"
				},{
					name: "浦发银行",
					type: "储蓄卡",
					imagesUrl: "",
					code: "6434"
				}]
			}
		},
		methods:{
			
		},
		// 新增银行卡
		onNavigationBarButtonTap(e){
			console.log(e)
			uni.navigateTo({
				url: "/pages/vipCenter/add_card"
			})
		},
		onLoad() {
			
		}
	}
</script>

<style lang="scss">
	page {
		width: 100%;
		height: 100%;
		background-color: #fff;
	}
	.bankCardPage{
		width: 100%;
		.card{
			width: 100%;
			height: 264upx;
			&:nth-child(3n+0){
				background: linear-gradient( to right, #fec470, #ff9e3f);
			}
			&:nth-child(3n+1){
				background: linear-gradient( to right, #5db8ff, #3285ff);
			}
			&:nth-child(3n+2){
				background: linear-gradient( to right, #fe9786, #ff5869);
			}
			margin-bottom: 30upx;
			.image{
				width: 100upx;
				height: 100upx;
				background-color: #fff;
				border-radius: 50%;
				margin-right: 30upx;
				image{
					width: 100upx;
					height: 100upx;
				}
			}
			.info{
				color: #fff;
				.code{
					margin-top: 50upx;
					.uni-flex-item{
						height: 48upx;
						line-height: 48upx;
					}
				}
			}
		}
	}
</style>