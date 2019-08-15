<template>
	<view class="scrollToTop flex-center-center" @tap="scrollToTop" v-if="isShowBtn">
		<view class="iconfont iconicon_stick"></view>
	</view>
</template>

<script>
	import { uniIcon } from '@dcloudio/uni-ui';
	export default {
		components:{
			uniIcon
		},
		data() {
			return {
				
			}
		},
		props: {
			// 是否展示
			isShowBtn: {
				type: Boolean,
				default: false
			}
		},
		methods: {
			// 返回顶部
			scrollToTop(){
				uni.pageScrollTo({
					scrollTop: 0,
					duration: 30
				});
			},
		}
	}
</script>

<style lang="scss">
	.scrollToTop{
		width: 86upx;
		height: 86upx;
		background-color: #fff;
		border-radius: 50%;
		border: 1upx solid #f0f0f0;
		position: fixed;
		bottom: 156upx;
		right: 30upx;
		box-shadow: 6upx 6upx 20upx 3upx #c2c2c2;
		z-index: 1000;
		.iconicon_stick{
			font-size: 40upx;
			margin-right: 0;
			color: #999;
		}
	}
</style>
