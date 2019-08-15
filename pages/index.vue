<template>
	<view class="indexPage">
		<homePage v-if="page_code=='home'" ref="homePageRef"></homePage>
		<nearbyPage v-if="page_code=='nearby'" ref="nearbyRef"></nearbyPage>
		<vipCenterPage v-if="page_code=='vipCenter'" ref="vipCenterRef"></vipCenterPage>
		<shopCartPage v-if="page_code=='shopCart'" ref="shopCartRef"></shopCartPage>
		<minePage v-if="page_code=='mine'" ref="mineRef"></minePage>
		<footerNav></footerNav>
	</view>
</template>

<script>
	import homePage from "../components/index/home_page.vue";
	import nearbyPage from "../components/index/nearby_page.vue";
	import vipCenterPage from "../components/index/vipCenter_page.vue";
	import shopCartPage from "../components/index/shopCart_page.vue";
	import minePage from "../components/index/mine_page.vue";
	import footerNav from "../components/index/footer_nav.vue";
	
	import { mapState } from 'vuex';
	export default {
		data() {
			return {}
		},
		components: {
			homePage,
			nearbyPage,
			vipCenterPage,
			shopCartPage,
			minePage,
			footerNav
		},	
		computed: {
			...mapState(["footer_store"]),
			page_code() {
				return this.footer_store.footer_nav[this.footer_store.now_page_index].name_code;
			}
		},
		onReady() {
			
		},
		// 下拉刷新
		onPullDownRefresh() {
			//  自定义组件模式  在组件中不支持onPullDownRefresh触发下拉刷新
			if(this.page_code == 'home') {
				this.$refs.homePageRef.pullDownRefresh()
			} else if(this.page_code == 'nearby') {
				this.$refs.nearbyRef.pullDownRefresh()
			} else if(this.page_code == 'vipCenter') {
				// this.$refs.vipCenterRef.pullDownRefresh()
			} else if(this.page_code == 'shopCart') {
				this.$refs.shopCartRef.pullDownRefresh()
			} else if(this.page_code == 'mine') {
				// this.$refs.mineRef.pullDownRefresh()
			}
		},
		methods: {
			
		}	
	}
</script>

<style lang="scss">
	page{
		width: 100%;
		height: 100%;
	}
	.indexPage {
		width: 100%;
		height: 100%;;
	}
</style>
