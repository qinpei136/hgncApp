<template>
	<!-- 店铺管理 -->
	<view class="storeManagement">
		<view class="product">
			<view class="image uni-inline-item">
				<sunUpImg :upImgConfig="upImgConfig" @onUpImg="upImgData" ref="uImage" />
			</view>		
			<view class="name">{{shopName}}</view>
<!-- 			<view class="count">{{item.title}}</view>
			<view class="count">{{item.title}}</view>
			<view class="remark">今日访客</view>
			<view class="remark">今日订单数</view>
 -->		</view>
		<view class="place-bar-20" style="height: 16upx;"></view>
		<myList :pageList="pageList" @handleClick="handleClick"></myList>
	</view>
</template>

<script>
	import {uniIcon,} from '@dcloudio/uni-ui';
	import util from "../../common/util.js";
	import userService from "../../common/userService.js";
	import myList from "../../components/common/my-list";
	import sunUpImg from '../../components/sunui-upimg/sunui-upimg-logo.vue'
    export default {
		components: {
			uniIcon,
			myList,
			sunUpImg
		},
        data() {
            return {
				//店铺名称
				shopName:"",
				//店铺Id
				id:"",
				upImgConfig:{
					imgTitle:"店铺LOGO",
					imgName:"img",
					required:false,
					url:""
				},
				//店铺图片
				imgPath:"/static/img/logo.png",
				// 跳转其他功能页面列表
				pageList: [{
						title: '店铺管理',
						iconfont: 'icondianpu',
						extra:{},
						isShowExtra: false,
						isShowArrow: true,
					},
					{
						title: '商品管理',
						iconfont: 'iconshangpin',
						extra:{},
						isShowExtra: false,
						isShowArrow: true,
					},
					{
						title: '订单管理',
						iconfont: 'icondingdan',
						extra:{},
						isShowExtra: true,
						isShowArrow: true,
					},
					{
						title: '订单核销',
						iconfont: 'iconhexiao',
						extra:{},
						isShowExtra: true,
						isShowArrow: true,
					}
				],
                webviewStyles: {
                    progress: {
                        color: '#FF3333'
                    }
                }
            }
        },
		methods:{
			init()
			{
				uni.showLoading();
				userService.getShopByUserId().then(res => {
				uni.hideLoading();
				if(res.data.code=="200")
				{
					let data = res.data.result.tShops;
					this.id=data.id
					this.shopName=data.shopName
					if(data.imgpath)
						this.upImgConfig.url=util.getImageUrl(data.imgpath)
				}
				
			}).catch(err => {
				uni.hideLoading();
				uni.showToast({
					icon: "none",
					title: err.message
				})
			})
			},
			// 点击跳转
			handleClick(data) {
				console.log(data)
				// 店铺管理
				if (data.index === 0) {
					uni.navigateTo({
						url: "/pages/shop/shop_management"
					})
					// 商品管理
				} else if (data.index === 1) {
					uni.navigateTo({
						url: "/pages/goods/goods_management"
					})
					// 订单管理
				} else if (data.index === 2) {
					uni.navigateTo({
						url: "/pages/shop/intergral_transfer"
					})
					// 订单核销
				}else if (data.index === 3) {
					uni.navigateTo({
						url: "/pages/shop/intergral_transfer"
					})
				}
			},
			//获取上传图片返回来的数组(Step1)
			async upImgData(e) {
				if(e.value)
				{
					uni.showLoading();
					let params={"Id":this.id,"Imgpath":e.value}
						userService.editShop(params).then(res => {
						uni.hideLoading();
						if(res.data.code="200")
						{
							this[e.name]=e.value
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
				}
			},
		},
		onLoad(e) {
			this.init()
		},
    }
</script>

<style lang="scss">
	uni-page-body{
		background-color: #f0f0f0;
		height:100%;
	.storeManagement{
		width: 100%;
		height: 100%;
		.product {
			    width: 100%;
			    background-color: #fff;
			    margin: auto;
			    text-align: center;
			    padding-top: 60upx;
			    padding-bottom: 60upx;
				
				.image {
					width: 184upx;
					height: 184upx;
					margin:auto;
				
					image {
						width: 100%;
						height: 100%;
					}
				}
				
				.name {
					width: 100%;
					padding: 10upx 0;
					display: block;
					font-weight: 400;
					font-size: 32upx;
				}
			.count {
				width: 50%;
				padding: 30upx 0 0 0;
				display: inline-block;
				font-weight: 400;
				font-size: 28upx;
				font-weight: bold;
			}
			.remark {
				width: 50%;
				padding: 0;
				display: inline-block;
				font-weight: 400;
				font-size: 26upx;
				color:#999
			}
			
			.info {
				display: flex;
				justify-content: space-between;
				align-items: center;
				width: 100%;
				font-weight: 100;
			
				.price {
					color: #4c9bfa;
					font-size: 30upx;
					font-weight: 600;
				}
			
				.slogan {
					color: #c2c2c2;
					font-size: 24upx;
				}
			}
		}
	}
}
</style>
