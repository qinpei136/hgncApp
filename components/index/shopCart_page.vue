<template>
	<view class="shopCartPage" :style="setStyle">
	<!-- <view class="shopCartPage"> -->
		<!-- 状态栏 -->
		<statusBar></statusBar>
		<!-- 导航栏 -->
		<uni-nav-bar fixed="true" :background-color="titleNView.bg" :color="titleNView.textColor"
		 :title="'购物车'" :rightText="rightText" @click-right="onClickRight"></uni-nav-bar>
		<!-- 内容 -->
		<view class="content">
			<view class="no-data" v-if="showNoData">
				<image src="/static/img/common/emptyCart.jpg" mode="aspectFit"></image>
				<view class="empty-tips flex-center-center">
					空空如也
					<view class="navigator" v-if="hasLogin" @tap="navToIndex"> 随便逛逛 ></view>
					<view class="navigator" v-if="!hasLogin" @tap="navToLogin"> 去登陆></view>
				</view>
			</view>
			<scroll-view scroll-x="true" class="scrollView" v-for="(item,index) in goodsList" :key="index" :id="item.id"
			 :scroll-left="item.scrollLeft" @touchstart="touchS" @touchend="touchE" >
				<view class="viewbox">
					<view class="shangpin uni-flex">
						<view class="uni-inline-item" style="margin-right: 20upx;">
							<checkbox-group @change="proActive(item)">
								<checkbox  :value="item.isChecked+ ''" :checked="item.isChecked"></checkbox >
							</checkbox-group>
						</view>
						<view class="shangpin-info uni-flex-item">
							<view class="img uni-inline-item" @tap="toDetail(item.id)">
								<image :src="item.imageUrl" mode="aspectFit"></image>
							</view>
							<view class="text-info uni-flex-item">
								<view class="title-text uni-ellipsis">
									<text class="name uni-h5">{{ item.title }}</text>
									<text class="tags uni-flex uni-text-small uni-text-gray">{{ item.standardText }} </text>
								</view>
								<view class="bottom-price">
									<view class="jiage uni-flex">
										<text class="danjia uni-inline-item">￥{{ item.price }}</text>
										<text class="shuliang uni-inline-item uni-text-small">x {{ item.num }}</text>
									</view>
									<view class="numInput">
										<text class="reduce iconfont" @tap="changeCount(item,-1)" :class="item.num == 0 ? 'numbox-disabled' : ''">-</text>
										<input class="input" type="number" v-model="item.num" />
										<text class="plus iconfont" @tap="changeCount(item,1)">+</text>
									</view>
								</view>
							</view>
						</view>
					</view>
					<view class="delete-view" @tap="deleteSingle(index, item.id)">删除</view>
				</view>
			</scroll-view>
			<view class="place"></view>
			<!-- 商品推荐 -->
			<recommendGoods :title="'推荐商品'" :num="4"></recommendGoods>
			<!-- 底部信息 -->
			<bottomInfo></bottomInfo>
		</view>
	
		<!-- 底部结算 -->
		<view class="bottom-jiesuan uni-flex" v-if="!showNoData">
			<view class="info uni-flex">
				<view class="allSelectText uni-flex">
					<view class="uni-inline-item">
						<checkbox-group @change="allCheck()">
							<checkbox  :value="isCheckAll + ''" :checked="isCheckAll" style="margin-right: 20upx;"></checkbox >
						</checkbox-group>
					</view>
					<view class="allText">全选</view>
				</view>
				<view class="total-price" v-if="rightText=='编辑'">
					总计：<text class="text-price uni-bold">￥{{ allPrice }}</text>
				</view>
			</view>
			<view class="btn uni-flex-item" @tap="done(rightText=='完成')" :class="rightText=='完成'?'delete':''">{{rightText=='完成'?'删除':'结算'}}</view>
		</view>
		
	</view>
</template>

<script>
	var startX = 0;
	var endX = 0;
	import service from '../../common/service.js';
	import {
		uniIcon,
		uniNavBar,
	} from '@dcloudio/uni-ui';
	import _ from "lodash";
	import { mapState, mapMutations, mapActions } from 'vuex';
	import util from '../../common/util.js';
	import recommendGoods from '../../components/common/recommend-goods.vue';
	export default {
		components: {
			uniIcon,
			uniNavBar,
			recommendGoods
		},
		data() {
			return {
				// 底部按钮文字（完成、删除）
				rightText: '完成',
				// 全选
				isCheckAll: false,
				// 总价
				allPrice: 0, 
			};
		},
		//下下拉刷新，在组件中不支持onPullDownRefresh触发下拉刷新，改写成自定义方法pullDownRefresh
		// onPullDownRefresh() {},
		computed: {
			...mapState(['hasLogin', 'userId','shopCart_store', 'titleNView']),
			setStyle() {
				let paddingBottom = this.hasLogin ? 98 : 0;
				return `padding-bottom:${paddingBottom}upx`;
			},
			showNoData(){
				return !this.hasLogin || this.goodsList.length == 0
			},
			goodsList(){
				return this.shopCart_store.goodsList;
			}
		},
		methods: {
			// 注入vuex的两个方法
			...mapMutations(['INIT_GOODS', 'INIT_ORDER_lIST']), 
			...mapActions(['deleteGoods']),
			init(){
				// 获取购物车商品列表
				this.getCartList();
			},
			// 自定义方法刷新，在index.vue首页文件中调用
			pullDownRefresh() {
				this.init()
			},
			//  购物车商品列表分两步查询，先查询产品ids，再通过ids查询产品详细信息
			// 先查询产品ids
			getCartList(){
				uni.showLoading();
				service.getCartList(this.userId).then(res=>{
					uni.hideLoading();
					const data = res.data.data.data;
					if(data.length > 0) {
						// 通过ids批量查询商品详情
						this.getCartListDetail(data);
					} else {
						// 同步购物车数据;
						this.INIT_GOODS([]);
					}
				}).catch(err=>{
					uni.hideLoading();
					uni.showToast({
						icon: 'none',
						title: err.errMsg,
					});
				})
			},
			// 通过ids查询产品详细信息
			getCartListDetail(cartData){
				// 配置查询ids数组
				let goodsId = []
				_.forEach(cartData, item => {
					goodsId.push(item.goodsId);
				})
				uni.showLoading();
				service.getGoodListById({ids: goodsId}).then(res=>{
					uni.hideLoading();
					let data = res.data.data;
					
					// 需要对比的数组
					let contrastArr = [];
					_.forEach(data, item => {
						contrastArr.push(item.id);
					})
					// 筛选哪些产品失效了
					let removedGoods = this.getRemovedGoods(goodsId, contrastArr);
					let goodsList = [];
					// 组建购物车产品列表
					_.forEach(cartData, item => {
						// 判断当前产品是否失效
						let removedIndex = this.getIndex(item.goodsId, removedGoods, "");
						// 获取购物车中当前产品在详情数组中的下标
						let currentIndex = this.getIndex(item.goodsId, data, "id");
						// 查询是否有相应的规格
						let standardIndex = this.getIndex(item.standardId , data[currentIndex].standard, "id");
						goodsList.push({
							scrollLeft: 0,
							// 是否被选中
							isChecked: false,
							// 商品是否不能选中
							isDisabled: removedIndex > -1 ? true : (standardIndex > -1 ? false : true),
							// 数据id，删除时有用
							id: item.id,
							// 商品id
							goodsId: item.goodsId,
							// 商品数量
							num: item.num,
							// 规格id
							standardId: item.standardId,
							// 价格  下架展示为空，未下架优先展示规格里面的单价
							price: removedIndex > -1 ? "" : (standardIndex > -1 ? data[currentIndex].standard[standardIndex].price : data[currentIndex].price),
							// 商品标题
							title: removedIndex > -1 ? "亲，所选商品已经下架了哦" : data[currentIndex].title,
							// 规格描述
							standardText: removedIndex > -1 ? "" : (standardIndex > -1 ? data[currentIndex].standard[standardIndex].title : ""),
							// 商品是否失效, 实时查询的产品无此规格，则表示商品失效
							isInvalid: standardIndex > -1 ? false : true,
							imageUrl: removedIndex > -1 ? "/static/img/logo@0.5x.png" : util.setImageUrl({
								type: "goods",
								goodId: item.goodsId,
								imageName: standardIndex > -1 ? (data[currentIndex].standard[standardIndex].imageUrl || data[currentIndex].imageUrl) : data[currentIndex].imageUrl
							})[0].img,
						})
					})
					// 同步购物车数据;
					this.INIT_GOODS(goodsList);
				}).catch(err=>{
					console.log(err)
					uni.hideLoading();
					uni.showToast({
						icon: "none",
						title:  err.errMsg,
					})
				})
			},
			// 根据id查询对应下标
			getIndex(id, arr, key){
				return key ? _.findIndex(arr, item => id === item[key]) : _.findIndex(arr, item => id === item);
			},
			// 筛选哪些产品失效了
			getRemovedGoods(arr, arr2){
				return _.difference(arr, arr2)
			},
			touchS(e) {
				startX = e.mp.changedTouches[0].clientX;
			},
			touchE(e) {
				endX = e.mp.changedTouches[0].clientX;
				if (Math.abs(endX - startX) > 10) {
					if (endX - startX > 0) {
						_.forEach(this.goodsList, (item)=>{
							_.forEach(item, (goods) => {
								if (goods.pro_id == e.currentTarget.id) {
									goods.scrollLeft = 0;
								}
							})
						})
					} else {
						_.forEach(this.goodsList, (item)=>{
							_.forEach(item, (goods) => {
								if (goods.pro_id == e.currentTarget.id) {
									goods.scrollLeft = 75;
								}
							})
						})
					}
				}
			},
			// 编辑
			onClickRight() {
				if(this.showNoData) {
					return
				}
				if (this.rightText == "编辑") {
					this.rightText = "完成";

				} else {
					this.rightText = "编辑";
					// 执行删除逻辑
				}
			},
			// 点击取消选中商品
			proActive(pro) {
				pro.isChecked = !pro.isChecked;
				pro.isChecked ?
					this._checkTrue(pro):
					this._checkFalse(pro);
				// 计算商品价格
				this._totalPrice();
			},
			// 选择商品
			_checkTrue() {
				let listLen = this.goodsList.length;
				let allCount = 0;
				_.forEach(this.goodsList, item =>{
					if(item.isChecked) {
						allCount++;
					}
				})
				if(allCount == listLen) {
					this.isCheckAll = true;
				}
			},
			// 取消商品
			_checkFalse() {
				this.isCheckAll = false;
			},
			// 全选
			allCheck() {	
				this.isCheckAll = !this.isCheckAll;
				this.isCheckAll ?
					this.goodsList.forEach((item) => {
						item.isChecked = true;
					}) :
					this.goodsList.forEach((item) => {
						item.isChecked = false;
					});
			},
			changeCount(val, way) {
				if (way > 0) {
					val.num++;
				} else {
					val.num--;
					if (val.num < 1) {
						val.num = 1;
					}
				}
			},
			// 每次调用此方法，将初始值为0，便利价格并累加
			_totalPrice() {
				this.allPrice = 0;
				this.goodsList.forEach(item => {
					this.allPrice += item.isChecked && util.calc.Mul(item.price, item.num);
				});
				if(this.allPrice <= 0) {
					this.isCheckAll = false;
				}
			},
			// 单个删除
			deleteSingle(index, id) {
				let ids = [{
					id: id, 
					index: index
				}]
				this.deletePro(ids);
			},
			// 多个删除
			deleteMultiple() {
				let ids = [];
				_.forEach(this.goodsList, (item, index) => {
					if(item.isChecked) {
						ids.push({
							id:item.id, 
							index: index
						})
					}
				})
				this.deletePro(ids);
			},
			// 删除商品
			deletePro(idsArr) {
				util.confirm({
					title:"",
					content: "确定要删除该商品吗？",
					confirmColor: "#242424",
					success: () => {
						let ids = [];
						_.forEach(idsArr, item => {
							ids.push(item.id);
						})
						let params = {
							userId: this.userId,
							ids: ids
						}
						uni.showLoading({
							title: "删除中..."
						})
						service.deleteFromCart(params).then(res=>{
							uni.hideLoading();
							uni.showToast({
								title: "删除成功"
							})
							// 分发删除动作
							this.deleteGoods(idsArr);
							// 重置删除按钮
							_.forEach(this.goodsList, (item)=>{
								_.forEach(item, (goods) => {
									goods.scrollLeft = 0;	
								})
							})
						}).catch(err=>{
							uni.hideLoading();
							uni.showToast({
								icon: 'none',
								title: err.errMsg,
							});
						})
				}	
				})
			},
			// 底部按钮（结算 | 删除）
			done(isDelete) {
				// 删除
				if(isDelete) {
					this.deleteMultiple();
				} else {
					// 勾选的商品
					let selectedGoods = [];
					_.forEach(this.goodsList, item => {
						if(item.isChecked) {
							selectedGoods.push(item)
						}
					})
					if(selectedGoods.length === 0) {
						uni.showToast({
							icon: "none",
							title: "您还没有选择宝贝哦！"
						})
						return
					}
					// 同步vuex数据
					this.INIT_ORDER_lIST(selectedGoods);
					uni.navigateTo({
						url: '/pages/shopCart/order_pay'
					});
				}
			},
			// 去商品详情页
			toDetail(id){
				uni.navigateTo({
					url: `/pages/home/goods_detail?id=${id}`
				})
			},
			// 去首页
			navToIndex(){
				this.$store.dispatch("change_page", "home");
				uni.navigateTo({
					url: "/pages/index"
				})
			},
			// 去登录
			navToLogin(){
				uni.navigateTo({
					url: `/pages/login/login?pageCode=shopCart`,
					animationType: "slide-in-bottom"
				})
			}
		},
// 		onReachBottom() {
// 			uni.showToast({title: '触发上拉加载'});
// 		},
		// 单间商品的价格 x 数量
		filters: {
			totalprice(price, count) {
				console.log('当前项', price, count);
				return price * count;
			}
		},
		watch: { //深度监听所有数据，每次改变重新计算总价和总数
			goodsList: {
				deep: true,
				handler(val, oldval) {
					this._totalPrice();
				}
			},
			showNoData(){
				
			}
		},
		created() {
			// #ifdef APP-PLUS
			// 下拉刷新的起始位置(状态栏高度+导航栏高度+导航tab的高度)
			const offset = uni.getSystemInfoSync().statusBarHeight + 120;
			util.setRefreshMode(true, offset);
			// #endif
			// 是否展示编辑按钮（无数据时不展示）
			this.rightText = this.showNoData ? "" : "编辑";
			// 登陆后初始化页面
			if(this.hasLogin) {
				this.init();
			}
		}
	};
</script>

<style lang="scss">
	.shopCartPage{
		background-color: #f0f0f0;
		padding-bottom: 98upx;
		.content{
			margin-bottom: 100upx;
			background-color: #fff;
			.no-data{
				width: 100%;
				height: 300upx;
				padding-top: 200upx;
				text-align: center;
				color: #666;
				image{
					width: 240upx;
					height: 160upx;
					margin-bottom:30upx;
				}
				.empty-tips{
					display:flex;
					font-size: 28upx;
					color: #666;
					text-align: center;
					.navigator{
						color: #4c9bfa;
						margin-left: 16upx;
					}
				}
			}
			.scrollView{
				width: 100%;
				height: 200upx;
				.viewbox {
					width: 900upx;
					height: 200upx;
					display: flex;
					.shangpin{
						width: 760upx;
						padding: 36upx 30upx;
						display: flex;
						border-bottom: 1px solid #f0f0f0;
						box-sizing: border-box;
						.shangpin-info{
							display: flex;
							.img {
								width: 130upx;
								height: 130upx;
								margin-right: 30upx;
								flex-shrink: 0;
								image {
									display: block;
									width: 100%;
									height: 100%;
									background-color: #f0f0f0;
								}
							}
							.text-info {
								width: 400upx;
								.title-text{
									
								}
								.bottom-price{
									position: relative;
									.danjia{
										color: #59a0fa;
										margin-right: 10upx ;
									}
									.shuliang{
										color:#666;
									}
									.numInput{
										position: absolute;
										right: 0upx;
										top: 0upx;
										text {
											float: left;
											color: #999;
											font-size: 22upx;
											line-height: 50upx;
										}
										.iconfont{
											font-size: 44upx;
											padding: 4upx 16upx;
										}
										
										input {
											display: inline-block;
											height: 40upx;
											width: 56upx;
											margin: 0 20upx;
											float: left;
											text-align: center;
											line-height: 40upx;
											font-size: 24upx;
											color: #999;
											border: 1upx solid #f0f0f0;
										}
										
										.numbox-disabled {
											color: #c0c0c0;
										}
									}
								}
							}
						}
					}
					.delete-view{
						width: 150upx;
						background-color: #f44938;
						color: #FFFFFF;
						text-align: center;
						display: flex;
						justify-content: center;
						align-items: center;
					}
				}
			}
			.place{
				width: 100%;
				height: 30upx;
				background-color: #F0F0F0;
			}
		}
		.jiesuan {
			padding: 30upx 30upx 30upx;
			color: #333333;
			display: flex;
			flex-direction: column;
			align-items: flex-end;
			box-sizing: border-box;
		}
		.bottom-jiesuan {
			width: 100%;
			height: 98upx;
			box-sizing: border-box;
			position: fixed;
			bottom: 100upx;
			display: flex;
			z-index: 1000;
			box-shadow: 0px 0px 4upx 0px rgba(0, 0, 0, 0.1);
			.info {
				box-sizing: border-box;
				padding-left: 14upx;
				width: calc(100% - 166upx);
				font-size: 24upx;
				color: #333333;
				background-color: #FFFFFF;
				/* 全选的文字 */
				.allSelectText {
					width: 150upx;
					display: flex;
					align-items: center;
					justify-content: center;
				}
				.total-price{
					display: flex;
					align-items: center;
					justify-content: center;
					margin-left: 20upx;
				}
			}
			
			.btn {
				width: 166upx;
				line-height: 98upx;
				color: #FFFFFF;
				font-size: 30upx;
				text-align: center;
				background-color: #000;
			
				&.delete {
					background-color: #f44938;
				}
			}
		}
	}
</style>
