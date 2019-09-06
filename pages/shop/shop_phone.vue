<template>
	<view class="shopphone" :style="setStyle">
		<uni-nav-bar fixed="true" left-icon="back" :background-color="titleNView.bg" :color="titleNView.textColor" right-text="保存" title="更换客服电话" @click-right="save" @click-left="back"></uni-nav-bar>
		<!-- 内容 -->
		<view class="content">
			<view class="nameview">
				<input class="uni-input uni-flex-item" type="text" :text="name" v-model="phone" placeholder="请输入您的手机号"/>
			</view>
		</view>
	</view>
</template>

<script>
	import userService from '../../common/userService.js';
	import {
		uniIcon,
		uniNavBar,
	} from '@dcloudio/uni-ui';
	import { mapState, mapMutations, mapActions } from 'vuex';
	export default {
		components: {
			uniIcon,
			uniNavBar
		},
		data() {
			return {
				// 店铺名称
				phone: "",
				//店铺Id
				id:""
			};
		},
		computed: {
			...mapState(['titleNView']),
			setStyle() {
				let paddingBottom = this.hasLogin ? 98 : 0;
				return `padding-bottom:${paddingBottom}upx`;
			}
		},
		methods: {
			init()
			{
				uni.showLoading();
				userService.getShopByUserId().then(res => {
				uni.hideLoading();
				if(res.data.code=="200")
				{
					if(res.data.result.tShops.phone)
						this.phone=res.data.result.tShops.phone
					this.id=res.data.result.tShops.id
				}
			}).catch(err => {
				uni.hideLoading();
				uni.showToast({
					icon: "none",
					title: err.message
				})
			})
			},
			//保存
			save(){
				uni.showLoading();
				let params={"Id":this.id,"phone":this.phone}
					userService.editShop(params).then(res => {
					uni.hideLoading();
					if(res.data.code=="200")
					{
						uni.navigateBack()
					}
					else{
						uni.showToast({
							icon: "none",
							title: res.data.msg
						})
					}
				}).catch(err => {
					uni.hideLoading();
					uni.showToast({
						icon: "none",
						title: err.message
					})
				})
			},
			//返回
			back(){
				uni.navigateBack()
			}},
		onLoad() {
			this.init()
		}
	};
</script>

<style lang="scss">
	uni-page-body{
		background-color: #f0f0f0;
		height:100%;
		
	.shopphone{
		background-color: #f0f0f0;
		padding-bottom: 98upx;
		.content{
			margin-bottom: 100upx;
			.nameview{
				padding-top: 20upx;
				padding-bottom: 20upx;
			}
		}
	}
}
</style>
