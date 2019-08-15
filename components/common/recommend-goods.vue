<!-- 推荐商品 -->
<template>
	<view class="Recommend-goods-list">
		<view class="title uni-h4">{{title}}</view>
		<view class="product-list">
			<view class="product" v-for="(item, index) in goodList" :key="index" @tap="toGoods(item)">		
				<image mode="widthFix" :src="item.imageUrl"></image>
				<view class="name">{{item.title}}</view>
				<view class="info">
					<view class="price">￥{{item.price}}</view>
					<!-- <view class="slogan">{{item.slogan}}</view> -->
				</view>	
			</view>
		</view>
	</view>
</template>

<script>
	import service from '../../common/service.js';
	export default {
		data() {
			return {
				goodList: []
			}
		},
		props: {
			// 标题
			title: {
				type: String,
				default: "推荐商品"
			},
			// 推荐产品数量
			num: {
				type: Number,
				default: 4,
			}
		},
		methods: {
			init(){
				let params = {
					userId : this.$store.state.userId,
					areaId: "",
					num: this.num
				}
				service.getRecommendGoodList(params).then(res=>{
					uni.hideLoading();
					let data = res.data.data;
					this.goodList = data;
				}).catch(err=>{
					uni.hideLoading();
					uni.showToast({
						icon: "none",
						title:  err.errMsg,
					})
				})
			},
			toGoods(item){
				uni.navigateTo({
					url: `/pages/home/goods_detail?id=${item.id}`
				})
			}
		},
		created() {
			this.init();
		}
	}
</script>

<style lang="scss">
	.Recommend-goods-list {
		background-color: #fff;
		font-weight: 600;
		padding: 30upx;
		box-sizing: border-box;
		.title {
			width: 100%;
			height: 60upx;
			color: #242424;
			font-size: 40upx;
			margin-bottom: 36upx;
		}			
		.product-list {
			width: 100%;
			display: flex;
			justify-content: space-between;
			flex-wrap: wrap;	
			.product {
				width: 47.75%;
				background-color: #fff;
				margin: 0 0 15upx 0;
				image {
					width: 100%;
					height: 246upx;
					background-color: #f0f0f0;
				}
	
				.name {
					width: 100%;
					padding: 10upx 0;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 2;
					overflow: hidden;
					font-weight: 400;
					font-size: 26upx;
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
