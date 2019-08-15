<template>
	<view class="startupPage">
		<view class="logo-wrap">
			<view class="logo">
				<image src="../static/img/logo.png" mode="widthFix"></image>
			</view>
			<view class="text">
				鹏鱼
			</view>
		</view>
		<view class="copright">
			Copyright © 2019 鹏鱼.All rights reserved
		</view>
	</view>
</template>

<script>
	export default {
		data(){
			return {
				
			}
		},
		onLoad() {
			setTimeout(()=>{
				uni.reLaunch({
					url: './index',
					animationType: 'pop-out',
					animationDuration: 200
				});
			}, 2000)
		}
	}
</script>

<style lang="scss">
	page{
		width: 100%;
		height: 100%;
	}
	.startupPage{
		width: 100%;
		height: 100%;
		position: relative;
		.logo-wrap{
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			.logo{
				image{
					width: 150upx;
					height: 150upx;
					border: 1upx;
					border-radius: 30upx;
				}
			}
			.text{
				text-align: center;
				font-weight: 600;
			}
			
		}
		.copright{
			width: 100%;
			position: absolute;
			bottom: 60upx;
			text-align: center;
			color: #999;
		}
	}
</style>
