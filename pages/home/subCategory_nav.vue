<template>
	<view class="secondClassPage">
		<!-- 状态栏 -->
		<statusBar></statusBar>
		<!-- 搜索框 -->
		<view class="header-wrap uni-flex">
			<view class="back uni-inline-item" @tap="goBack">
				<uni-icon type="back"></uni-icon>
			</view>
			
			<view class="search-box uni-inline-item">	
				<view class="input-box" @tap="toSearch()">
					<view class="icon">
						<uni-icon type="search" size="20"></uni-icon>
					</view>
					{{defaultKeyword}}
				</view>
			</view>
		</view>
		
		<view class="content">
			<view class="nav">
				<scroll-view class="nav-left" scroll-y :style="'height:'+height+'px'">
					<view class="nav-left-item" @tap="categoryClickMain(item,index)" :key="index" :class="index==categoryActive?'active':''" v-for="(item,index) in categoryList">
						{{item.name}}
					</view>
				</scroll-view>
				<scroll-view class="nav-right" scroll-y :scroll-top="scrollTop" @scroll="scroll" :style="'height:'+height+'px'" scroll-with-animation >
					<view class="title uni-center">
						-&nbsp;分类&nbsp;-
					</view>
					<view :id="index==0?'first':''" class="nav-right-item" v-for="(item, index) in subCategoryList" :key="index" @tap="toSubCategory(categoryActive, item.id)">
						<image :src="item.img" />
						<view class="name">{{item.name}}</view>
					</view>			
				</scroll-view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		uniIcon
	} from '@dcloudio/uni-ui';
	import service from '../../common/service.js';
	export default {
		components: {
			uniIcon
		},
		data(){
			return {
				categoryList:[],
				subCategoryList: [],
				height:0,
				categoryActive:0,
				scrollTop:0,
				scrollHeight:0,
				defaultKeyword: "8斤芒果28.9元到手"
			}
		},
		methods: {
			scroll(e){
				this.scrollHeight = e.detail.scrollHeight;
			},
			// 切换分类
			categoryClickMain(categroy, index) {
				this.categoryActive = index;
				this.scrollTop = -this.scrollHeight*index;
				this.getSubCategory(categroy.id);
			},
			// 获取一级分类
			getCategory() {
				let parms = {
					"classScheme": "cat1"
				}
				uni.showLoading();
				service.getGoodTopClass(parms).then(res=>{
					let data = res;
					if(data.length > 0) {
						this.categoryList = data;
						this.getSubCategory(this.categoryList[0].id);
					}
				}).catch(err=>{
					uni.hideLoading();
					uni.showToast({
						icon: "none",
						title:  err.errMsg,
					})
				})
			},
			// 获取二级分类
			getSubCategory(id){
				let idArr = [];
				idArr.push(id);
				service.getGoodSecondClass({"topClass": idArr}).then(res=>{
					uni.hideLoading();
					let data = res.data.data;
					if(data.length > 0) {
						this.subCategoryList = data;
					}
				}).catch(err=>{
					uni.hideLoading();
					uni.showToast({
						icon: "none",
						title: err.errMsg,
					})
				})
			},
			// 跳转搜索页面
			toSearch(){
				uni.navigateTo({
					url: "/pages/home/search"
				})
			},
			// 跳转商品分类页面
			toSubCategory(activeIndex, subId){
				// 一级分类的ID
				let name = this.categoryList[activeIndex].name;
				let id = this.categoryList[activeIndex].id;
				// subId 二级分类的id
				uni.navigateTo({
					url: `/pages/home/subCategory?name=${name}&id=${id}&subId=${subId}`
				})
			},
			goBack(){
				uni.navigateBack()
			}
		},
		onLoad(){
			this.getCategory()
			uni.getSystemInfo({
				success: res => {
					console.log(res.screenHeight);
					this.height =res.screenHeight - uni.upx2px(88);
				}
			})
		}
	}
</script>

<style lang="scss">
	.secondClassPage{
		
		.header-wrap{
			width: 100%;
			height:88upx;
			position: fixed;
			top: 0;
			/*  #ifdef  APP-PLUS  */
			top: var(--status-bar-height);
			/*  #endif  */
			display: flex;
			align-items: center;
			justify-content: center;
			background-color: #242424;
			z-index: 1000;
			.back {
				width: 80upx;
				justify-content: center;
				color: #fff;
			}
			.search-box{
				width: 95%;
				height: 88upx;
				display: flex;
				padding:10upx 30upx;
				box-sizing: border-box;
				position: relative;
				.icon {
					width: 50upx;
					height: 50upx;
					position: absolute;
					color: #242424;
					z-index: 996;
					top: 16upx;
					/*  #ifdef  APP-PLUS  */
					top: 20upx;
					/*  #endif  */
					left: 40upx;
					/*  #ifdef  APP-PLUS  */
					left: 40upx;
					/*  #endif  */
				}
				.input-box{
					width: 100%;
					height: 80%;
					line-height: 2;
					background-color: #666;
					border-radius: 4upx;
					padding: 0 10upx 0 65upx;
					box-sizing: border-box;
				}
			}
		}
		.content {
			position: relative;
			/* #ifdef H5 */
			top: 88upx;
			/* #endif */	
			
			/* #ifdef APP-PLUS */
			top: calc(var(--status-bar-height) + 88upx);
			/* #endif */
					
			.nav {
				display: flex;
				width: 100%;
			}
			
			.nav-left {
				width: 25%;
			}
			
			.nav-left-item {
				height: 100upx;
				display: flex;
				align-items: center;
				justify-content: center;
				background-color: #f0f0f0;
				font-size: 28upx;
				font-weight: 100;
			}
			
			.nav-right {
				width: 75%;
				padding: 0 30upx;
				box-sizing: border-box;
				background-color: #fff;
				.title{
					padding-top: 20upx;
				}
			}
			
			.nav-right-item {
				width: 33%;
				height: 120px;
				float: left;
				text-align: center;
				padding: 11px;
				box-sizing: border-box;
				border: 1upx solid #f0f0f0;
				.name{
					font-size: 22upx;
				}
			}
			.nav-right-item image{
				width: 100%;
				height: 70%;
			}
			.active {
				background-color: #fff;
				font-size: 30upx;
				font-weight: 600;
			}
		}
		
	}
</style>
