<template>
	<view class="subCategoryPage">
		<!-- 状态栏 -->
		<!-- <statusBar></statusBar> -->
		<view class="swiper-content">
			<view class="uni-tab-bar">
				<!-- 分类导航 -->
				<view class="custom-tabs">
					<scroll-view id="tab-bar" class="uni-swiper-tab" scroll-x :scroll-left="scrollLeft">
						<view v-for="(tab,index) in tabBars" :key="tab.id" class="swiper-tab-list" :class="tabIndex==index ? 'active' : ''"
						 :id="'tar'+index" :data-current="index" :data-id="tab.id" @tap="tapTab">
							{{tab.name}}
							<view class="bottom-line"></view>
						</view>
					</scroll-view>
				</view>
				<!-- 商品内容 -->
				<swiper :current="tabIndex" class="swiper-box" :duration="300" @change="swiperChangeTab">
					<swiper-item v-for="(tab,index1) in dataList" :key="index1" :data-id="tab.id">
						<scroll-view class="list" :class="'list'+ index1" scroll-y @scrolltolower="loadMore(index1)" scroll-top="0"
						 @scroll="onPageScroll">
							<!-- 商品列表 -->
							<view class="product-list" v-if="isShowProductList">
								<view class="product" v-for="(item,index2) in tab.data" :key="index2" @tap="toGoods(item)" :id="'swiper'+index1">
									<view class="uni-media-list-logo">
										<image class="image" lazy-load :class="{lazy:!item.show}" :data-index="index2" @load="imgLoaded" :src="item.show?item.imageUrl:''" />
										<image class="image placeholder" :class="{loaded:item.loaded}" :src="placeholderSrc" />
									</view>
									<view class="name">{{item.title}}</view>
									<view class="info">
										<view class="price">￥{{item.price}}</view>
										<view class="slogan">{{item.slogan}}</view>
									</view>
								</view>
							</view>
							<bottomInfo></bottomInfo>
							<view class="uni-tab-bar-loading">
								{{tab.loadingText}}
							</view>
						</scroll-view>
					</swiper-item>
				</swiper>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		uniIcon,
		uniNavBar
	} from '@dcloudio/uni-ui';
	import _ from 'lodash';
	import service from '../../common/service.js';
	import topTabMenu from "../../components/common/topTabMenu.vue";
	export default {
		components: {
			uniIcon,
			uniNavBar,
			topTabMenu
		},
		data() {
			return {
				// 导航栏标题
				title: "",
				tabBars: [],
				tabIndex: 0,
				scrollLeft: 0,
				dataList: [],
				// 图片默认路径
				placeholderSrc: "/static/img/logo@0.5x.png",

			}
		},
		computed: {
			isShowProductList() {
				return this.dataList[this.tabIndex].data.length > 0 
			}
		},
		onReachBottom() {
			uni.showToast({
				title: '触发上拉加载'
			});
		},
		methods: {
			// 初始化顶部分类
			initSubCategory(id, subId) {
				let idArr = [];
				idArr.push(id);
				service.getGoodSecondClass({
					"topClass": idArr
				}).then(res => {
					uni.hideLoading();
					let data = res.data.data;
					if (data.length > 0) {
						this.tabBars = data;
						// 处理产品列表
						this.initDataList(this.tabBars);
						// 获取当前tab
						this.tabIndex = this.getCurrentTab(subId);
						// 设置当前tab
						this.setScrollLeft(this.tabIndex);
						// 获取分类下的商品列表
						let orderBy = [
							["createTime", "desc"]
						];
						this.getGoodsList(this.tabIndex, subId, orderBy);
					}
				}).catch(err => {
					uni.hideLoading();
					uni.showToast({
						icon: "none",
						title: err.errMsg,
					})
				})
			},
			// 获取当前tabIndex
			getCurrentTab(id) {
				let index = _.findIndex(this.tabBars, item => item.id === id);
				return index > -1 ? index : 0;
			},
			// 初始化产品列表
			initDataList(tabBars) {
				_.forEach(tabBars, item => {
					this.dataList.push({
						loadingText: '加载更多...',
						data: [],
						id: item.id,
						page: 1
					})
				})
			},
			// 获取商品列表
			getGoodsList(index, id, orderBy) {
				let params = {
					type: id,
					page: this.dataList[index].page,
					pageSize: 10,
					orderBy: orderBy
				};
				uni.showLoading();
				service.getGoodListByType(params).then(res => {
					uni.hideLoading();
					let data = res.data.data;
					if (data.data.length > 0) {
						_.forEach(data.data, item => {
							// 初始化懒加载相关配置
							item.show = false;
							item.loaded = false;
						})
						this.dataList[index].data = _.concat(this.dataList[index].data, data.data);
					} else {
						if(this.dataList[index].page > 1) {
							this.dataList[index].page--;
						}
						this.dataList[index].loadingText = '没有更多了';
					}
				}).catch(err => {
					uni.hideLoading();
					uni.showToast({
						icon: "none",
						title: err.errMsg,
					})
				})
			},
			// 跳转搜索页面
			onClickRight() {
				uni.navigateTo({
					url: "/pages/home/search"
				})
			},
			// 跳转商品详情
			toGoods(product) {
				let id = product.id;
				uni.navigateTo({
					url: `/pages/home/goods_detail?id=${id}`
				})
			},
			loadMore(e) {
				let timer = setTimeout(() => {
					this.addData(e);
					this.load();
					timer = null;
				}, 50)
			},
			addData(e) {
				this.dataList[this.tabIndex].page++;
				let id = this.dataList[this.tabIndex].id;
				let orderBy = [
					["createTime", "desc"]
				];
				this.getGoodsList(this.tabIndex, id, orderBy);
			},
			// 滑动切换商品类型
			async swiperChangeTab(e) {
				let index = e.target.current;
				// 点击切换时，会触发滑动切换
				if (this.isClickChange) {
					this.tabIndex = index;
					this.isClickChange = false;
					return;
				}
				this.setScrollLeft(index);
				this.isClickChange = false;
				this.tabIndex = index;
				if (this.dataList[index].data.length === 0) {
					let id = this.dataList[index].id;
					let orderBy = [
						["createTime", "desc"]
					];
					this.getGoodsList(index, id, orderBy)
				}
				let timer = setTimeout(() => {
					this.load();
					timer = null;
				}, 50)
			},
			//得到元素的size
			getElSize(id) {
				return new Promise((res, rej) => {
					uni.createSelectorQuery().in(this).select("#" + id).fields({
						size: true,
						scrollOffset: true
					}, (data) => {
						res(data);
					}).exec();
				})
			},
			//点击切换tab-bar
			async tapTab(e) {
				let tabIndex = e.target.dataset.current;
				if (this.tabIndex === tabIndex) {
					return false;
				} else {
					this.setScrollLeft(tabIndex);
					this.isClickChange = true;
					this.tabIndex = tabIndex;
				}
				if (this.dataList[tabIndex].data.length === 0) {
					let id = e.target.dataset.id;
					let orderBy = [
						["createTime", "desc"]
					];
					this.getGoodsList(tabIndex, id, orderBy)
				}
				let timer = setTimeout(() => {
					this.load();
					timer = null;
				}, 50)
			},
			// 设置顶部nav的滚动距离
			async setScrollLeft(index) {
				let tabBar = await this.getElSize("tab-bar"),
					tabBarScrollLeft = tabBar.scrollLeft; //点击的时候记录并设置scrollLeft
				let width = 0;
				for (let i = 0; i < index; i++) {
					let result = await this.getElSize('tar' + i);
					width += result.width;
				}
				let winWidth = uni.getSystemInfoSync().windowWidth,
					nowElement = await this.getElSize('tar' + index),
					nowWidth = nowElement.width;
				if (width + nowWidth - tabBarScrollLeft > winWidth) {
					this.scrollLeft = width + nowWidth - winWidth;
				}
				if (width < tabBarScrollLeft) {
					this.scrollLeft = width;
				}
			},
			// 图片懒加载
			load() {
				uni.createSelectorQuery().in(this).selectAll(`#swiper${this.tabIndex} .lazy`).boundingClientRect((images) => {
					images.forEach((image, index) => {
						if (image.top <= this.windowHeight) {
							// this.dataList[this.tabIndex].data[image.dataset.index].show = true;
							let item = Object.assign({}, this.dataList[this.tabIndex].data[image.dataset.index]);
							item.show = true;
							// 重新刷新数据
							this.$set(this.dataList[this.tabIndex].data, image.dataset.index, item);
						}
					})
				}).exec()
			},
			// 图片加载完毕的回调
			imgLoaded(e) {
				// 图片url为空就不会执行这里
				// this.dataList[this.tabIndex].data[e.target.dataset.index].loaded = true;
				let item = Object.assign({}, this.dataList[this.tabIndex].data[e.target.dataset.index]);
				item.loaded = true;
				this.$set(this.dataList[this.tabIndex].data, e.target.dataset.index, item);
			},
			// Scroll-view组件的滚动监听
			onPageScroll: _.throttle(function() {
				// 控制图片懒加载
				this.load();
				// 控制刷新开启关闭
				// this.isSupportRefresh();
			}, 50)
		},
		onLoad(options) {
			// 获取设备高度
			this.windowHeight = uni.getSystemInfoSync().windowHeight;
			// 获取标题
			this.title = options.name;
			// 初始化分类列表
			this.initSubCategory(options.id, options.subId);
			
		}
	}
</script>

<style lang="scss">
	page {
		width: 100%;
		height: 100%;
		background-color: #f0f0f0;
	}

	.subCategoryPage {
		width: 100%;
		height: 100%;

		.swiper-content {
			width: 100%;
			height: 100%;
			.custom-tabs {
				.uni-swiper-tab {
					width: 100%;
					height: 88upx;
					line-height: 88upx;
					border-bottom: 1upx solid #f0f0f0;
					background-color: #fff;
					z-index: 100;
					position: fixed;
					left: 0;
					.swiper-tab-list {
						width: auto;
						position: relative;
						font-size: 26upx;
						color: #707070;
						padding: 0 20upx;
						box-sizing: border-box;

						&.active {
							color: #242424;
							font-size: 27upx;

							.bottom-line {
								width: calc(100% - 40upx);
								height: 6upx;
								position: absolute;
								bottom: -20upx;
								left: 50%;
								transform: translateX(-50%);
								background-color: #242424;
							}
						}
					}
				}
			}

			.swiper-box {
				height: calc(100% - 100upx);
				padding-top: 88upx;
				box-sizing: border-box;
			}

			.product-list {
				width: 100%;
				display: flex;
				justify-content: space-between;
				flex-wrap: wrap;
				padding: 30upx;
				box-sizing: border-box;
				background-color: #fff;
				.product {
					width: 47.75%;
					background-color: #fff;
					margin: 0 0 15upx 0;

					.placeholder {
						opacity: 0.1;
						// transition: opacity 0.2s linear;
					}

					.placeholder.loaded {
						opacity: 0;
					}

					.uni-media-list-logo {
						width: 100%;
						height: 300upx;
						position: relative;
					}

					.uni-media-list-logo .image {
						position: absolute;
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

			.uni-tab-bar-loading {
				width: 100%;
				display: flex;
				justify-content: center;
				align-items: center;
				height: 60upx;
				color: #979797;
				font-size: 24upx;
				background-color: #f0f0f0;
				padding: 0;
			}
		}
	}
</style>
