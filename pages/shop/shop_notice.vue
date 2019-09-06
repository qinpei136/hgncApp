<template>
	<view class="shopnotice" :style="setStyle">
		<uni-nav-bar fixed="true" left-icon="back" :background-color="titleNView.bg" :color="titleNView.textColor" right-text="保存" title="店铺公告" @click-right="save" @click-left="back"></uni-nav-bar>
		<!-- 内容 -->
		<view class="content">
			<view class="nameview">
				<textarea class="uni-input uni-flex-item notice" @input="getCount" v-model="shopNotice" maxlength="500" placeholder="请输入店铺公告..."/>
				<view class="num">{{count}}/500</view>
			</view>
			<view class="bottomInfo">
				<view class="info">店铺公告是您店铺的门面，给顾客留下重要的第一印象。</view>
				<view class="info">好的店铺公告一般具有以下特点：</view>
				<view class="info">1.微暖有人情味，突出店铺或者主营商品的特色；</view>
				<view class="info">2.传递顾客关心的各种重要信息（比如发货时间、在线时间、售后处理方式、促销通知）；</view>
				<view class="info">3.不适用国家法律法规禁止的违规词、敏感词；</view>
				<view class="info">4.不出现‘淘宝’，‘微信’，‘代理’等会被屏蔽的词。</view>
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
				// 店铺公告
				shopNotice: "",
				//店铺Id
				id:"",
				count:0
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
					this.shopNotice=res.data.result.tShops.shopNotice
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
				let params={"Id":this.id,"shopNotice":this.shopNotice}
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
			//获取当前输入的数字
			getCount(e)
			{
				this.count=e.detail.value.length
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
	.shopnotice{
		padding-bottom: 98upx;
		height:100%;
		.content{
			margin-bottom: 100upx;
			.nameview{
				padding-top: 30upx;
				padding-bottom: 20upx;
				position: relative;
				width:97%;
				.notice{
					width: 100%;
					height: 200px;
				}
				.num{
					color: #cecdc2;
					position: absolute;
					bottom: 30upx;
					right: 30upx;
				}
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
