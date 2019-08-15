<template>
	<view class="list">
		<view class="list-item uni-flex" v-for="(item, index) in pageList" :key="index" @tap="handleClick(index, item)">
			<!-- 左边iconfont图标 -->
			<block v-if="item.iconfont">
				<view class="iconfont uni-inline-item flex-center-center" :class="item.iconfont"></view>
			</block>
			<!-- 右边内容 -->
			<view class="title-wrap uni-flex-item uni-flex">
				<!-- 标题 -->
				<text class="title uni-flex-item uni-flex">{{item.title}}</text>
				<!-- 扩展内容 -->
				<block v-if="item.isShowExtra">
					<text class="extra uni-flex-item uni-flex uni-text-small" :style="{'color': item.extra.color}" v-if="item.isShowExtra">{{item.extra.text}}</text>
				</block>
				<!-- 箭头 -->
				<block v-if="item.isShowArrow">
					<view class="icon uni-inline-item text-color-gray">
						<uni-icon type="arrowright" size="20"></uni-icon>
					</view>
				</block>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		uniIcon,
	} from '@dcloudio/uni-ui';
	export default {
		props: {
			pageList: {
				type: Array,
				default: function(){
					return [{
						// 内容
						title: '',
						// 左边图标
						iconfont: '',
						// 扩展内容
						extra:{
							text: '',
							color: ""
						},
						// 是否展示扩展内容
						isShowExtra: false,
						isShowArrow: true
					}]
				}
			},
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
	
	.list {
		background-color: #fff;
		.list-item{
			width: 100%;
			height: 110upx;
			.iconfont{
				width: 100upx;
			}
			.title-wrap{
				padding-right:  30upx;
				box-sizing: border-box;
				border-bottom: 1upx solid #f0f0f0;
				.title{
					align-items: center;
				}
				.extra{
					align-items: center;
					justify-content: flex-end;
				}
			}
			&:nth-last-child(1) {
				.title-wrap{
					border-bottom: none;
				}
			}
		}
		.uni-list{
			&::before, &::after{
				display: none;
			}
		}
	}
</style>
