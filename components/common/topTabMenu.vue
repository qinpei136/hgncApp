<template>
	<view class="top-menu-control">
		<scroll-view scroll-x="true" @scroll="scroll" scroll-left="scrollLeft">
			<view class="top-menu-view" :class="isShowClassification?'ShowClassificationClass':''">
				<view :id="'tabNum' + index" v-for="(item, index) in values" class="menu-one-view" :class="[currentIndex==index ? 'menu-one-act' : 'menu-one']" :key="index" @click="swichMenu(index)">
					<view class="menu-one-txt">{{item.name}}</view>
					<view class="menu-one-bottom">
						<view class="menu-one-bottom-color"></view>
					</view>
				</view>
			</view>	
			<view class="classification" @tap="toSecondClassPage" v-if="isShowClassification">
				分类
			</view>
		</scroll-view>
	</view>
</template>

<script>
	export default {
		name: 'top-tabMenu',
		props: {
			current: {
				type: Number,
				default: 0
			},
			values: {
				type: Array,
				default () {
					return [];
				}
			},
			isShowClassification: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				currentIndex: this.current,
				scrollLeft: 0
			}
		},
		watch: {
			current(val) {
				if (val !== this.currentIndex) {
					this.currentIndex = val;
				}
			}
		},
		computed: {

		},
		methods: {
			scroll: function(){
				console.log("滚动tab");
			},
			//点击其中一个 menu
			swichMenu: async function(current) { 
				if (this.currentIndex == current) {
					return false;
				} else {
					this.currentIndex = current;
					this.setScrollLeft(current);
					this.$emit('clickItem', current);
				}
			},
			setScrollLeft: async function(tabIndex) {
				let leftWidthSum = 0;
				for (var i = 0; i <= tabIndex; i++) {
					let nowElement = await this.getWidth('tabNum' + i);
					leftWidthSum = leftWidthSum + nowElement.width;
				}
				let winWidth = uni.getSystemInfoSync().windowWidth;
				this.scrollLeft = leftWidthSum > winWidth ? (leftWidthSum - winWidth) : 0;
				console.log(this.scrollLeft);
				console.log(leftWidthSum);
				console.log(winWidth);
			},
			//得到元素的宽高
			getWidth: function(id) {
				return new Promise((res, rej) => {
					// 选择节点
					uni.createSelectorQuery().in(this).select("#" + id).fields({
						size: true,
						scrollOffset: true
					}, (data) => {
						res(data);
					}).exec();
				})
			},
			// 去二级分类页面
			toSecondClassPage(){
				uni.navigateTo({
					url: "/pages/home/subCategory_nav"
				})
			}
		},
	}
</script>

<style lang="scss">
	.top-menu-control {
		width: 100%;
		height: 80upx;
		position: fixed;
		/* 固定位置 */
		z-index: 100;
		display: flex;
		align-items: center;
		justify-content: center;
		/* white-space 属性设置如何处理元素内的空白 */
		background-color: #fff;
		top: 88upx;
		/*  #ifdef  APP-PLUS  */
		top: calc(var(--status-bar-height) + 88upx);
		/* #endif */
		.top-menu-view {
			padding:0 20upx;
			box-sizing: border-box;
			white-space: nowrap;
			/* 在这里设置导航条高度 */
			height: 100%;
			width: 100%;
			&.ShowClassificationClass{
				width: calc(100% -100upx);
				.menu-one-view:last-child{
					padding-right: 20upx !important;
				}
			}
			.menu-one-view {
				display: inline-block;
				white-space: nowrap;
				margin-left: 20upx;
				margin-right: 20upx;
				height: 80upx;
				text-align: center;
				line-height: 80upx;
				position: relative;
				.menu-one-txt {
					display: flex;
					align-items: center;
					justify-content: center;
					height: inherit;
					font-size: 28upx;
					font-weight: 400;
					color: rgba(154, 154, 154, 1);
					
				}
				.menu-one-bottom {
					display: flex;
					align-items: center;
					justify-content: center;
					position: absolute;
					bottom: 0upx;
					width: 100%;
					.menu-one-bottom-color {
						width: 40%;
						height: 6upx;
					}
				}
				
				&.menu-one-act {
					.menu-one-txt {	
						color: #000;	
					}
					.menu-one-bottom {
						.menu-one-bottom-color {
							background: #000;
						}
					}
				}
				&:last-child{
					padding-right: 120upx;
				}
			}
			// .menu-one-view:last-child
		}
		
		.classification{
			width: 100upx;
			height: 86upx;
			display: flex;
			align-items: center;
			justify-content: center;
			border-left:1upx solid #666;
			box-shadow: 0upx 0upx 1upx 1upx #999;
			background-color: #fff;
			position: fixed;
			z-index: 1000;
			right: 0upx;
			top: 88upx;
			/*  #ifdef  APP-PLUS  */
			top: calc(var(--status-bar-height) + 88upx);
			/* #endif */
		}
		
	}	
</style> 
