<template>
	<!-- 店铺管理 -->
	<view class="shopManagement">
		<view class="titleInfo">基本信息</view>
		<myList :pageList="baseList" @handleClick="baseClick" class="title_list"></myList>
		<view class="titleInfo">认证信息</view>
		<myList :pageList="authenticationList" @handleClick="authenticationClick" class="title_list"></myList>
		<view class="detail" v-show="shopState==2">
			失败详情:{{detail}}
		</view>
	</view>
</template>

<script>
	import {uniIcon,} from '@dcloudio/uni-ui';
	import util from "../../common/util.js";
	import userService from "../../common/userService.js";
	import myList from "../../components/common/my-list";
    export default {
		components: {
			uniIcon,
			myList
		},
        data() {
            return {
				//店铺名称
				shopName:"",
				//店铺图片
				imgPath:"/static/img/logo.png",
				//认证状态
				shopState:"",
				//失败原因
				detail:"",
				// 跳转其他功能页面列表
				baseList: [
					{
						title: '店铺名称',
						extra:{
							text: '未设置',
							color: "#cecdc2",
							},
						isShowExtra: true,
						isShowArrow: true,
					},
					{
						title: '店铺公告',
						extra:{
							text: '未设置',
							color: "#cecdc2",
							},
						isShowExtra: true,
						isShowArrow: true,
					},
					{
						title: '店铺行业',
						extra:{
							text: '未设置',
							color: "#cecdc2",
							},
						isShowExtra: true,
						isShowArrow: true,
					},
					{
						title: '客服电话',
						extra:{
							text: '未设置',
							color: "#cecdc2",
							},
						isShowExtra: true,
						isShowArrow: true,
					}
				],
				authenticationList: [{
						title: '店铺认证信息',
						extra:{
							text: '未认证',
							color: "#cecdc2",
							},
						isShowExtra: true,
						isShowArrow: true,
					}],
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
					//店铺名称
					if(data.shopName)
					{
						this.baseList[0].extra.text=data.shopName
					}
					//店铺公告
					if(data.shopNotice)
					{
						if(data.shopNotice.length>8)
							this.baseList[1].extra.text=data.shopNotice.substr(0,8)+"..."
						else
							this.baseList[1].extra.text=data.shopNotice
					}
					//店铺行业
					if(data.type)
						this.baseList[2].extra.text=data.type
					//客服电话
					if(data.phone)
						this.baseList[3].extra.text=data.phone
					//店铺认证信息
					this.detail=data.detail
					this.shopState=data.shopState
					if(data.shopState)
					{
						if(data.shopState=="1")
							this.authenticationList[0].extra.text="已认证"
						else if(data.shopState=="2")
						{
							this.authenticationList[0].extra.text="认证失败"
						}
					}
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
			baseClick(data) {
					// 店铺名称
				if (data.index === 0) {
					uni.navigateTo({
						url: "/pages/shop/shop_name"
					})
					// 店铺公告
				} else if (data.index === 1) {
					uni.navigateTo({
						url: "/pages/shop/shop_notice"
					})
					// 店铺行业
				}else if (data.index === 2) {
					uni.navigateTo({
						url: "/pages/shop/shop_type"
					})
					// 客服电话
				}else if (data.index === 3) {
					uni.navigateTo({
						url: "/pages/shop/shop_phone"
					})
				}
			},
		// 点击跳转
		authenticationClick(data) {
			// 店铺认证信息
			if (data.index === 0) {
				uni.navigateTo({
					url: "/pages/vipCenter/authentication"
				})
			} 
		}
		},
		onShow(e) {
			this.init()
		},
    }
</script>

<style lang="scss">
	pages{
		width: 100%;
		height: 100%;
	}
	.shopManagement{
		width: 100%;
		height: 100%;
		.titleInfo {
			    width: 100%;
				background-color: #f0f0f0;
				height: 92upx;
				line-height: 92upx;
				font-size: 32upx;
				padding-left: 20upx;
				font-weight: bold;
			}
		.title_list{
				padding-left: 20upx;
			}
		.detail{
			margin-left: 10px;
			color: #ff8c4f;
		}
	}
</style>
