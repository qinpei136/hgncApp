<template>
	<view class="searchPage">
		<!-- 状态栏 -->
		<statusBar></statusBar>
		<!-- 头部搜索框 -->
		<view class="header-wrap uni-flex uni-row">
			<view class="back uni-inline-item" @tap="goBack">
				<uni-icon type="back"></uni-icon>
			</view>
			
			<view class="search-box uni-inline-item">
				<!-- mSearch组件 如果使用原样式，删除组件元素-->
				<mSearch :mode="2" button="inside" :placeholder="defaultKeyword" @search="doSearch(false)"
				 @confirm="doSearch(false)" v-model="keyword" radius="0" @input="clear"></mSearch>
				<!-- 原样式 如果使用原样式，恢复下方注销代码 -->
							
				<!-- <view class="input-box">
					<input type="text" :placeholder="defaultKeyword" @input="inputChange" v-model="keyword" @confirm="doSearch(false)"
					 placeholder-class="placeholder-class" confirm-type="search">
				</view>
				<view class="search-btn" @tap="doSearch(false)">搜索</view> -->
				
				<!-- 原样式 end -->
			</view>
			<view class="cart uni-inline-item"  :class="isShowIcon?'active':''" @tap="toCart">
				<view class="iconfont iconicon_shoppingcart_nor">
					
				</view>
			</view>
		</view>
		
		<!-- 历史搜索 热门搜索-->
		<view class="search-keyword" @touchstart="blur" v-show="!isShowSearchList">
			<view class="keyword-box">
				<view class="keyword-block" v-if="oldKeywordList.length>0">
					<view class="keyword-list-header">
						<view>历史搜索</view>
						<view>
							<image @tap="oldDelete" src="/static/HM-search/delete.png"></image>
						</view>
					</view>
					<view class="keyword">
						<view v-for="key in oldKeywordList" @tap="doSearch(key)" :key="key">{{key}}</view>
					</view>
				</view>
				<view class="keyword-block">
					<view class="keyword-list-header">
						<view>热门搜索</view>
						<view>
							<image @tap="hotToggle" :src="'/static/HM-search/attention'+forbid+'.png'"></image>
						</view>
					</view>
					<view class="keyword" v-if="forbid==''">
						<view v-for="key in hotKeywordList" @tap="doSearch(key)" :key="key">{{key}}</view>
					</view>
					<view class="hide-hot-tis" v-else>
						<view>当前搜热门搜索已隐藏</view>
					</view>
				</view>
			</view>
		</view>
			
		<!-- 搜索到的商品 -->
		<view class="goods-wrap" v-if="isShowSearchList">
			<view class="tabs filters uni-flex uni-row">
				<view class="default uni-flex-item flex-center-center uni-center" :class="currentTab=='default'?'active':''" @tap="changeTab('default')"> 
					默认
					<view class="bottom-line"></view>
				</view>
				<!-- <view class="sales uni-flex-item flex-center-center uni-center" :class="currentTab=='sales'?'active':''" @tap="changeTab('sales')">
					销量
					<view class="bottom-line"></view>
				</view> -->
				<view class="price uni-flex-item flex-center-center uni-center" :class="currentTab=='price'?'active':''" @tap="changeTab('price')">
					价格
					<view class="bottom-line"></view>
					<!-- 三角 -->
					<view class="triangle_border_up" :class="currentTab=='price'&&isPriceDesc?'up':''"></view>
					<view class="triangle_border_down" :class="currentTab=='price'&&!isPriceDesc?'down':''"></view>
				</view>
			</view>
			<view class="content">
				<view class="hasData" v-if="hasData">
					<view class="total  flex-center-center uni-center uni-text-small">
						共计{{totalNum}}个相关产品
					</view>
					<view class="product-list common-ma-30">
						<view class="product" v-for="(item, index) in goodsList" :key="index" @tap="toGoods(item)">
							<!-- <image lazy-load class="lazy" mode="scaleToFill" :src="item.imageUrl"></image> -->
							<view class="uni-media-list-logo">
								<image class="image" :class="{lazy:!item.show}" :data-index="index" @load="onLoad" :src="item.show?item.imageUrl:''" />
								<image class="image placeholder" :class="{loaded:item.loaded}" :src="placeholderSrc" />
							</view>
							
							<view class="name">￥{{item.title}}</view>
							<view class="info">
								<view class="price">{{item.price}}</view>
								<view class="slogan">{{item.type}}</view>
							</view>	
						</view>
					</view>
				</view>
				<view class="hasNoData"  v-if="!hasData">
					<noData :text="noDataText"></noData>
					<view class="place-bar"></view>
					<!-- 推荐商品列表 -->
					<recommendGoods :title="'推荐商品'" :num="4"></recommendGoods>
				</view>				
			</view>	
		</view>
		
		<!-- 返回顶部 -->
		<scrollToTop :isShowBtn="isShowBtn"></scrollToTop>
	</view>
</template>

<script>
	import { uniIcon } from '@dcloudio/uni-ui';
	import service from '../../common/service.js';
	import mSearch from '../../components/common/mehaotian-search-revision.vue';
	import recommendGoods from '../../components/common/recommend-goods.vue';
	import scrollToTop from "../../components/common/scroll-to-top.vue";
	import noData from "../../components/common/no-data.vue";
	export default {
		components: {
			uniIcon,
			mSearch,
			noData,
			recommendGoods,
			scrollToTop
		},
		data() {
			return {
				// 默认展示关键词
				defaultKeyword: "",
				// 输入的关键词
				keyword: "",
				// 历史搜索
				oldKeywordList: [],
				// 热门搜索
				hotKeywordList: [],
				goodsList: [],
				// 推荐产品列表
				RecommendGoodsList:[],
				// 热门搜索的开关
				forbid: '',
				// 筛选条件
				currentTab: 'default',
				// 价格的升降序
				isPriceDesc: true, 
				// 是否展示搜索到的产品列表
				isShowSearchList: false,
				// 是否展示购物车图标
				isShowIcon: false,
				// 是否查询到产品
				hasData: false,
				// 产品总数
				totalNum: 0,
				page:1,
				// 图片懒加载
				show: false,
				// 图片默认路径
				placeholderSrc: "/static/img/logo@0.5x.png",
				// 设备屏幕高度
				windowHeight: 0,
				// 是否暂时返回顶部按钮
				isShowBtn: false
			}
		},
		onLoad() {
			this.init();
			// 获取设备高度
			this.windowHeight = uni.getSystemInfoSync().windowHeight;
		},
		onPageScroll() {
			this.pageScroll();
		},
		computed:{
			noDataText(){
				return `抱歉,未找到“${this.keyword}”相关产品`;
			}
// 			totalNum(){
// 				return this.goodsList.length;
// 			}
		},
		methods: {
			init() {
				this.loadDefaultKeyword();
				this.loadOldKeyword();
				this.loadHotKeyword();

			},
			blur() {
				uni.hideKeyboard()
			},
			//加载默认搜索关键字
			loadDefaultKeyword() {
				//定义默认搜索关键字，可以自己实现ajax请求数据再赋值,用户未输入时，以水印方式显示在输入框，直接不输入内容搜索会搜索默认关键字
				this.defaultKeyword = "输入商品名称、类型";
			},
			//加载历史搜索,自动读取本地Storage
			loadOldKeyword() {
				uni.getStorage({
					key: 'OldKeys',
					success: (res) => {
						var OldKeys = JSON.parse(res.data);
						this.oldKeywordList = OldKeys;
					}
				});
			},
			//加载热门搜索
			loadHotKeyword() {
				//定义热门搜索关键字，可以自己实现ajax请求数据再赋值
				this.hotKeywordList = ['键盘', '鼠标', '显示器', '电脑主机', '蓝牙音箱', '笔记本电脑', '鼠标垫', 'USB', 'USB3.0'];
			},
			//高亮关键字
			drawCorrelativeKeyword(keywords, keyword) {
				var len = keywords.length,
					keywordArr = [];
				for (var i = 0; i < len; i++) {
					var row = keywords[i];
					//定义高亮#9f9f9f
					var html = row[0].replace(keyword, "<span style='color: #9f9f9f;'>" + keyword + "</span>");
					html = '<div>' + html + '</div>';
					var tmpObj = {
						keyword: row[0],
						htmlStr: html
					};
					keywordArr.push(tmpObj)
				}
				return keywordArr;
			},
			//顶置关键字
			setkeyword(data) {
				this.keyword = data.keyword;
			},
			//清除历史搜索
			oldDelete() {
				uni.showModal({
					content: '确定清除历史搜索记录？',
					success: (res) => {
						if (res.confirm) {
							console.log('用户点击确定');
							this.oldKeywordList = [];
							uni.removeStorage({
								key: 'OldKeys'
							});
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
			},
			//热门搜索开关
			hotToggle() {
				this.forbid = this.forbid ? '' : '_forbid';
			},
			clear(keyword){
				if(!keyword){
					this.isShowSearchList = false;
					this.keyword = "";
				}
			},
			//执行搜索
			doSearch(key) {
				key = key ? key : this.keyword ? this.keyword : this.defaultKeyword;
// 				console.log("key",key);
// 				console.log("this.keyword",this.keyword)
// 				console.log("this.defaultKeyword",this.defaultKeyword)
				this.keyword = key;
				//保存为历史 
				this.saveKeyword(key);
				// 展示购物车图标
				this.isShowIcon = true;
				// 清空数据列表
				this.goodsList = [];
				// 查询数据
				this.getGoodsListByOrder();
			},
			//保存关键字到历史记录
			saveKeyword(keyword) {
				uni.getStorage({
					key: 'OldKeys',
					success: (res) => {
						// console.log(res.data);
						var OldKeys = JSON.parse(res.data);
						var findIndex = OldKeys.indexOf(keyword);
						if (findIndex == -1) {
							OldKeys.unshift(keyword);
						} else {
							OldKeys.splice(findIndex, 1);
							OldKeys.unshift(keyword);
						}
						//最多10个纪录
						OldKeys.length > 10 && OldKeys.pop();
						uni.setStorage({
							key: 'OldKeys',
							data: JSON.stringify(OldKeys)
						});
						this.oldKeywordList = OldKeys; //更新历史搜索
					},
					fail: (e) => {
						var OldKeys = [keyword];
						uni.setStorage({
							key: 'OldKeys',
							data: JSON.stringify(OldKeys)
						});
						this.oldKeywordList = OldKeys; //更新历史搜索
					}
				});
			},
			changeTab(type){
				// type： deafult sales  price
				if(type === "default") {
					this.isPriceDesc = true;
				}
				// 价格可以切换升降序
				if(type === "price") {
					this.currentTab = type;
					this.goodsList = [];
					this.getGoodsListByOrder();
					this.isPriceDesc = !this.isPriceDesc;
					return
				}
				
				// 默认和销量
				if(this.currentTab != type){
					this.currentTab = type;
					this.goodsList = [];
					this.getGoodsListByOrder();
				}
			},
			// 按筛选条件查询列表
			getGoodsListByOrder(){
				if(this.currentTab === "price") {
					// 价格可以切换升降序
					let orderBy = this.isPriceDesc ? [["price", "desc"]] : [["price", "asc"]];
					this.getGoodsList(this.keyword, orderBy);
				} else {
					// 默认和销量只有降序
					// let orderBy = this.currentTab === 'default' ? [["createTime", "desc"]] : [["sales", "desc"]];
					let orderBy = [["createTime", "desc"]];
					this.getGoodsList(this.keyword, orderBy);
				}
			},
			// 查询产品列表
			getGoodsList(key, orderBy){
				const data = {
					title: key,
					page: this.page,
					pageSize: 10,
					orderBy: orderBy 
				}
				this.isShowSearchList = true;
				uni.showLoading({
					title: "加载中..."
				});
				service.getGoodListBySearch(data).then(res=>{
					uni.hideLoading();
					let data = res.data.data;
					this.totalNum = data.total;
					if(data.data.length > 0) {
						this.hasData = true;
						const  goodsList = data.data;
						this.goodsList = _.concat(goodsList);
						_.forEach(this.goodsList, item => {
							item.show = false;
							item.loaded = false;
						});
						setTimeout(() => {
							this.load();
						}, 100)
					} else {
						this.hasData = false;
					}
				}).catch(err=>{
					uni.hideLoading();
					uni.showToast({
						icon: "none",
						title:  err.errMsg,
					})
				})
			},
			// 商品详情
			toGoods(item){
				uni.navigateTo({
					url: `/pages/home/goods_detail?id=${item.id}`
				})
			},
			// 购物车
			toCart(){
				this.$store.dispatch("change_page", "shopCart");
				uni.navigateTo({
					url: "/pages/index"
				})
			},
			// 返回顶部
			scrollToTop(){
				uni.pageScrollTo({
					scrollTop: 0,
					duration: 30
				});
			},
			// 获取搜索商品列表区域的滚动高度
			getScrollTop() {
				uni.createSelectorQuery().in(this).select('.product-list').boundingClientRect(data => {
					if(data) {
						// 内容超过一屏
						this.isShowBtn = data.top <= 0 ? true : false;
					}
				}).exec()
			},
			// 图片懒加载
			load() {
				uni.createSelectorQuery().in(this).selectAll('.lazy').boundingClientRect((images) => {
					_.forEach(images, (image, index)=>{
						if (image.top <= this.windowHeight) {
							let item = Object.assign({}, this.goodsList[image.dataset.index]);
							item.show = true;
							// 重新刷新数据
							this.$set(this.goodsList, image.dataset.index, item);
						}
					})
				}).exec()
			},
			onLoad(e) {
				// 图片url为空就不会执行这里
				let item = Object.assign({}, this.goodsList[e.target.dataset.index]);
				item.loaded = true;
				this.$set(this.goodsList, e.target.dataset.index, item);
			},
			pageScroll: _.throttle(function(){
				this.getScrollTop();
				this.load();
			}, 100),
			goBack(){
				uni.navigateBack()
			}
		}
	}
</script>
<style lang="scss">
	page{
		width: 100%;
		height: 120%;
		background-color: #fff;
	}
	.searchPage{
		width: 100%;
		height: 100%;
		background-color: #fff;
		.header-wrap{
			width: 100%;
			height:88upx;
			display: flex;
			align-items: center;
			justify-content: center;
			border-bottom: 1px solid #f6f6f6;
			background-color: #fff;
			position: fixed;
			top: 0;
			/*  #ifdef  APP-PLUS  */
			top: var(--status-bar-height);
			/*  #endif  */
			z-index: 1000;
			.back {
				width: 80upx;
				height: 100%;
				justify-content: center;
			}
			.search-box{
				flex: 1 1 0%;
				height: 88upx;
				padding: 10upx;
				justify-content: center;
				box-sizing: border-box;
				.search .content{
					background-color: #f0f0f0;
				}
			}
			.cart {
				width: 0upx;
				justify-content: center;
				transition: all 0.2s linear;
				visibility: hidden;
				&.active{
					width: 100upx;
					visibility: visible;
					transform-origin:center left;
				}
			}
		}
		
		.search-box .input-box {
			width: 85%;
			flex-shrink: 1;
			display: flex;
			justify-content: center;
			align-items: center;
		}

		.search-box .search-btn {
			width: 15%;
			margin: 0 0 0 2%;
			display: flex;
			justify-content: center;
			align-items: center;
			flex-shrink: 0;
			font-size: 14px;
			color: #fff;
			background: linear-gradient(to right, #ff9801, #ff570a);
			border-radius: 30px;
		}

		.search-box .input-box>input {
			width: 100%;
			height: 30px;
			font-size: 16px;
			border: 0;
			border-radius: 30px;
			-webkit-appearance: none;
			-moz-appearance: none;
			appearance: none;
			padding: 0 3%;
			margin: 0;
			background-color: #ffffff;
			box-sizing: border-box;
		}

		.placeholder-class {
			color: #9e9e9e;
		}

		.search-keyword {
			width: 100%;
			// background-color: rgb(242, 242, 242);
			padding-top: 88upx;
			/*  #ifdef  APP-PLUS  */
			padding-top: calc(var(--status-bar-height) + 88upx);
			/*  #endif  */
			box-sizing: border-box;
		}

		.keyword-box {
			// height: calc(100vh - 88upx);
			border-radius: 10upx 10upx 0 0;
			background-color: #fff;
		}

		.keyword-box .keyword-block {
			padding: 5upx 0;
			box-sizing: border-box;
		}

		.keyword-box .keyword-block .keyword-list-header {
			width: 94%;
			padding: 5px 3%;
			font-size: 13.5px;
			color: #333;
			display: flex;
			justify-content: space-between;
			box-sizing: border-box;
		}

		.keyword-box .keyword-block .keyword-list-header image {
			width: 20px;
			height: 20px;
		}

		.keyword-box .keyword-block .keyword {
			width: 94%;
			padding: 3px 3%;
			display: flex;
			flex-flow: wrap;
			justify-content: flex-start;
			box-sizing: border-box;
		}

		.keyword-box .keyword-block .hide-hot-tis {
			display: flex;
			justify-content: center;
			font-size: 14px;
			color: #6b6b6b;
		}

		.keyword-box .keyword-block .keyword>view {
			display: flex;
			justify-content: center;
			align-items: center;
			padding: 0 10px;
			margin: 5px 10px 5px 0;
			height: 30px;
			font-size: 14px;
			background-color: rgb(242, 242, 242);
			color: #6b6b6b;
			box-sizing: border-box;
		}
		.goods-wrap{
			.tabs{
				width: 100%;
				height: 80upx;
				background-color: #fff;
				position: fixed;
				top: 88upx;
				/*  #ifdef  APP-PLUS  */
				top: calc(var(--status-bar-height) + 88upx);
				/*  #endif  */
				z-index: 1000;
				border-bottom: 1upx solid #f0f0f0;
				.uni-flex-item {
					color:#666;
					position: relative;
					.bottom-line{
						display: none; 
					}
				}
				.price{
					/*向上*/
					.triangle_border_up{
						width:0;
						height:0;
						border-width:0 10upx 10upx;
						border-style:solid;
						border-color:transparent transparent #999;/*透明 透明  灰*/
						position:absolute;
						top: 30upx;
						right: 135upx;
						&.up{
							border-color:transparent transparent #333;/*透明 透明  灰*/
						}
					}
					/*向下*/
					.triangle_border_down{
						width:0;
						height:0;
						border-width:10upx 10upx 0;
						border-style:solid;
						border-color:#999 transparent transparent;/*灰 透明 透明 */
						position:absolute;
						top: 44upx;
						right: 135upx;
						&.down{
							border-color:#333 transparent transparent;/*灰 透明 透明 */
						}
					}
				}
				.active{
					color:#242424;
					.bottom-line{
						display: block;
						width: 10%;
						height: 6upx;
						position: absolute;
						bottom: 0;
						left: 50%;
						transform: translateX(-50%);
						background-color: #242424;
					}
				}
			}
			.content{
				padding-top: 168upx;
				/*  #ifdef  APP-PLUS  */
				padding-top: calc(var(--status-bar-height) + 168upx);
				/*  #endif  */
				.hasData{
					.total{
						height: 50upx;
						background-color: #f0f0f0;
						color: #666;
					}	
				}
				.hasNoData{

					.Recommend-goods-list{
						.title{
							padding: 20upx 30upx;
							box-sizing: border-box;
						}
					}
				}
				.product-list{
					background-color: #fff;
					display: flex;
					justify-content: space-between;
					flex-wrap: wrap;
					box-sizing: border-box;			
					.product {
						width: 47.75%;
						// border-radius: 20upx;
						background-color: #fff;
						margin: 0 0 15upx 0;
						.placeholder {
							opacity: 0.1;
							transition: opacity 0.1s linear;
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
						
// 						image{
// 							width: 100%;
// 							height: 246upx;
// 						}
							
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
		}
		
		.scrollToTop{
			width: 86upx;
			height: 86upx;
			background-color: #fff;
			border-radius: 50%;
			border: 1upx solid #f0f0f0;
			position: fixed;
			bottom: 156upx;
			right: 30upx;
			box-shadow: 6upx 6upx 20upx 3upx #c2c2c2;
			z-index: 1000;
		}
	}
</style>
