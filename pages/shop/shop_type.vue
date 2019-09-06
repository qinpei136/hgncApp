<template>
	<view class="shopname" :style="setStyle">
		<uni-nav-bar fixed="true" left-icon="back" :background-color="titleNView.bg" :color="titleNView.textColor" right-text="保存" title="主营类目" @click-right="save" @click-left="back"></uni-nav-bar>
		<!-- 内容 -->
		<view class="type">
			<radio-group @change="radioChange">
				<view class="type-item uni-flex">
					<view class="title uni-flex uni-flex-item">
						<view class="name uni-inline-item">
							食品饮料
						</view>
					</view>
					<view class="uni-flex-item  uni-flex flex-right">
						<view class="checkbox uni-inline-item">
							<radio value="食品饮料" :checked="type === '食品饮料'" ></radio>
						</view>
					</view>
				</view>	
				<view class="type-item uni-flex">
					<view class="title uni-flex uni-flex-item">
						<view class="name uni-inline-item">
							服装及日用品
						</view>
					</view>
					<view class="uni-flex-item  uni-flex flex-right">
						<view class="checkbox uni-inline-item">
							<radio value="服装及日用品" :checked="type === '服装及日用品'" ></radio>
						</view>
					</view>
				</view>
				<view class="type-item uni-flex">
					<view class="title uni-flex uni-flex-item">
						<view class="name uni-inline-item">
							文化体育用品
						</view>
					</view>
					<view class="uni-flex-item  uni-flex flex-right">
						<view class="checkbox uni-inline-item">
							<radio value="文化体育用品" :checked="type === '文化体育用品'" ></radio>
						</view>
					</view>
				</view>
				<view class="type-item uni-flex">
					<view class="title uni-flex uni-flex-item">
						<view class="name uni-inline-item">
							家用电器及电子设备
						</view>
					</view>
					<view class="uni-flex-item  uni-flex flex-right">
						<view class="checkbox uni-inline-item">
							<radio value="家用电器及电子设备" :checked="type === '家用电器及电子设备'" ></radio>
						</view>
					</view>
				</view>
			</radio-group>
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
	import myList from "../../components/common/my-list";
	export default {
		components: {
			uniIcon,
			uniNavBar,
			myList
		},
		data() {
			return {
				// 店铺行业
				type: "",
				//店铺Id
				id:"",
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
					this.type=res.data.result.tShops.type
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
				let params={"Id":this.id,"type":this.type}
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
			},
			// 选择主营类目
			radioChange(evt) {
				this.type = evt.detail.value;
			},
			},
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
		
		.type{
			width: 100%;
			background-color: #fff;
			margin-bottom: 130upx;
			margin-top:30upx;
			.pay-title{
				width: 100%;
				height: 84upx;
				line-height: 84upx;
				border: 1upx solid #f0f0f0;
				text-indent: 30upx;
				color: #666;
			}
			.type-item{
				width: 100%;
				height: 84upx;
				padding: 0 30upx; 
				box-sizing: border-box;
				.iconfont{
					margin-right: 10upx;
				}
				.iconicon_zhifubao{
					color: #01aaef;
				}
				.iconicon_integral{
					color: #fcbb3b;
				}
				.iconicon_m{
					color: #ff8067;
				}
				.uni-flex-item{
					border-bottom: 1upx solid #f0f0f0;
				}
				.checkbox{
					margin-left: 20upx;
				}
				.red{
					color: #ff5011;
				}
				&.disabled{
					.name{
						color:#bbb;
					}
				}
			}
		}
	}
	}
</style>
