<template>
	<view>
		<view class="footerNav">
			<view class="footer_item" :class="index==now_index?'select_text':''" :style="'width:'+item_width" @click="change_nav(item, index)" v-for="(item,index) in footer_nav" :key="index">
				<view class="iconfont" :class="index==now_index?item.select_icon:item.icon"></view>
				<view class="name">{{item.name}}</view>
				<!-- 购物车数量 -->
				<uni-badge class="shop-num" :text="total_num" type="primary" v-if="(total_num - 0 > 0)&&item.name_code==='shopCart'"></uni-badge>
			</view>
		</view>
	</view>
</template>

<script>
	import { uniIcon, uniBadge} from '@dcloudio/uni-ui';
	import util from "../../common/util.js";
	import { mapGetters} from 'vuex';
	export default {
		components: {
			uniIcon,
			uniBadge
		},
		data() {
			return {
				
			};
		},
		methods:{
			change_nav(item, index){
				// 切换底部导航做权限判定，登录后才可进入(我的)
				if(item.name_code === "mine") {
					this.$guardToLogin(item.name_code).then(()=>{
						this.$store.dispatch("change_page", item.name_code);
					}).catch(()=>{});
					return
				}
				this.$store.dispatch("change_page", item.name_code);
			}
		},
		computed:{
			...mapGetters(["total_num"]),
			item_width(){
				let length = this.$store.state.footer_store.footer_nav.length;
				switch (length){
					case 4:
						return '25%'
						break;
					case 5:
						return '20%'
						break;
					default:
						break;
				}
			},
			footer_nav(){
				return this.$store.state.footer_store.footer_nav
			},
			now_index(){
				return this.$store.state.footer_store.now_page_index;
			}
		}
	}
</script>

<style lang="scss">
.footerNav{
	height: 100upx;
	position: fixed;
	bottom: 0;
	left: 0;
	width: 100%;
	background-color: #fff;
	border-top: 1upx solid #eee;
	color: #999;
	z-index: 10000;
	.footer_item{
		float: left;
		text-align: center;
		height: 100upx;
		position: relative;
		.name{
			font-size: 22upx;
		}
		.iconfont{
			font-size: 50upx;
			margin-right: 0;
			line-height: 1.2;
		}
		.shop-num{
			position: absolute;
			top: 4upx;
			right: 25%;
		}
	}
	.select_text{
		color: #000;
	}

}

</style>
