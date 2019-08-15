<template>
	<!-- 状态栏 -->
	<view class="status" :style="{position:headerPosition}"></view>
</template>

<script>
	export default {
		name: 'statusBar',
		data() {
			return {
				headerPosition:"fixed",
			}
		},	
		onPageScroll(e){
			//兼容iOS端下拉时顶部漂移
			if(e.scrollTop>=0){
				this.headerPosition = "fixed";
			}else{
				this.headerPosition = "absolute";
			}
		},
	}
</script>

<style lang="scss">
	.status {
		width: 100%;
		height: 0;
		/*  #ifdef  APP-PLUS  */
		height: var(--status-bar-height);//表示状态栏的高度。
		/*  #endif  */
		// opacity: 0;
		background-color: $uni-bg-color-status !important;
		position: fixed;
		top: 0;
		z-index: 999;
	}
</style>
