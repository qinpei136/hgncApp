<template>
	<view class="no-data-component" :style="{'background-color': bgColor}">
		<view class="image flex-center-center" >
			<image :src="icon" mode="scaleToFill"></image>
		</view>
		<view class="uni-text-small">
			{{text}}
		</view>
	</view>
</template>

<script>
	import {
		uniIcon,
	} from '@dcloudio/uni-ui';
	export default {
		props: {
			icon: {
				type: String,
				default: '/static/img/common/search-no-data.png'
			},
			text: {
				type: String,
				default: '暂无相关数据'
			},
			bgColor: {
				type: String,
				default: '#fff'
			}
		},
		components: {
			uniIcon
		},
		data() {
			return {
				
			}
		},
		methods:{
			// 点击跳转
			handleClick(index, item){
				let data = {
					index: index,
					item: item
				}
				this.$emit("handleClick", data);
			}
		}
	}
</script>

<style lang="scss">
	.no-data-component {
		width: 100%;
		height: 264upx;
		text-align: center;
		color: #999;
		padding-top: 30upx;
		box-sizing: border-box;
		.image{
			width: 100%;
			height: 160upx;
			image{
				width: 164upx;
				height: 148upx;
			}
		}
	}
</style>

