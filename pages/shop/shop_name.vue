<template>
	<view class="shopname" :style="setStyle">
		<uni-nav-bar fixed="true" left-icon="back" :background-color="titleNView.bg" :color="titleNView.textColor" right-text="保存" title="店铺名称" @click-right="save" @click-left="back"></uni-nav-bar>
		<!-- 内容 -->
		<view class="content">
			<view class="nameview">
				<input class="uni-input uni-flex-item" type="text" :text="name" v-model="name" placeholder="店铺名称"/>
			</view>
			<view class="bottomInfo">
				<view class="info">好的店铺名称具有以下特别：</view>
				<view class="info">1.简短易懂，朗朗上口，避免雷同，避免生僻字，尽量体现主营商品；</view>
				<view class="info">2.凸显店铺特色，体现店铺风格；</view>
				<view class="info">3.不使用国家法律法规禁止的违规词、敏感词；</view>
				<view class="info">4.不出现“淘宝”，“微信”，“代理”等会被屏蔽的词。</view>
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
				name: "",
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
					this.name=res.data.result.tShops.shopName
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
				let params={"Id":this.id,"shopname":this.name}
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
		
		.shopname{
			background-color: #f0f0f0;
			padding-bottom: 98upx;
			height:100%;
			.content{
				margin-bottom: 100upx;
				// background-color: #fff;
				.nameview{
					padding-top: 30upx;
					padding-bottom: 20upx;
				}
				
				.bottomInfo {
					width: 100%;
					height: 100%;
					text-align: left;
					// background-color: #f0f0f0;
					color: #979797;
					font-weight: 100;
					// padding-top: 20upx;
					box-sizing: border-box;
					padding: 20upx;
					.info {
						font-size: 24upx;
						line-height: 1.5;
					}
				}
			}
		}
	}
	
</style>
