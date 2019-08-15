<template>
	<view class="goodsDetailPage">
		
		<!-- 分享内容 -->
		<share :shareObj="shareObj" ref="shareChild"></share>
		
		<view class="content">
			<!-- 轮播图 -->
			<customSwiper :swiperList="flowImages" @toSwiper="toSwiper" :height="520"></customSwiper>
			<view class="goods-info">
				<!-- 商品文字描述 -->
				<view class="info-item">
					<view class="uni-h4">
						{{title}}
					</view>
					<view class="uni-text-small text-color-gray" v-if="detail">
						<text>{{detail}}</text>
					</view>
				</view>
				<!-- 商品价格积分 -->
				<view class="price-info info-item uni-flex">
					<view class="price uni-flex">
						<view class="uni-inline-item text-price uni-h4" style="font-size: 36upx;">
							￥{{price}}
						</view>
						<text class="uni-inline-item tag uni-text-small">
							可获{{currentPointRate}}倍积分
						</text>
					</view>
					<!-- <view class="number uni-flex text-color-gray">
						<view class="icon uni-inline-item">
							<uni-icon type="plus"></uni-icon>
						</view>
						<view class="uni-inline-item">
							123
						</view>
					</view> -->
				</view>
				
				<!-- 优惠 -->
				<!-- <view class="preferential uni-flex">
					<view class="title uni-inline-item text-color-gray">
						优惠
					</view>
					<view class="uni-inline-item">
						可获得1,2324个积分
					</view>
				</view> -->
			</view>
			
			<!-- 商品详情图 -->
			<view class="detail-image common-pa-30">
				<view class="title uni-h4">
					商品详情
				</view>
				<rich-text :nodes="detailImagesNode"></rich-text>
				<!-- <view class="image">
					<image src="/static/img/common/goodDetail.png" mode="widthFix"></image>
				</view> -->
			</view>
			
			<!-- 猜你喜欢 -->
			<recommendGoods :title="'猜你喜欢'" :num="4"></recommendGoods>
			<bottomInfo></bottomInfo>
		</view>
		<view class="goods-footer uni-flex">
			<view class="cart uni-flex-item">
				<view class="iconfont iconicon_shoppingcart_nor" @tap="toCart"></view>
				<uni-badge :text="total_num" type="primary" v-if="total_num - 0 > 0"></uni-badge>
			</view>
			<view class="btn add-to-cart uni-flex-item uni-center" @tap="selectSpecAction('toCart')">
				加入购物车
			</view>
			<view class="btn to-buy uni-flex-item uni-center" @tap="selectSpecAction('toBuy')">
				立即购买
			</view>
		</view>
		<!-- 规格-模态层弹窗 -->
		<view 
			class="popup spec" 
			:class="specClass"
			@touchmove.stop.prevent="stopPrevent"
			@click="toggleSpec"
		>
			<!-- 遮罩层 -->
			<view class="mask"></view>
			<view class="layer attr-content" @click.stop="stopPrevent">
				<view class="a-t uni-flex">
					<image class="uni-inline-item" :src="specSelected.imageUrl"></image>
					<view class="right uni-flex-item uni-column">
						<text class="price text-price">¥{{specSelected.price}}</text>
						<view class="selected uni-text-small">
							<text class="selected-text">
								请选择&nbsp;&nbsp;{{specTitle}}
							</text>
							<text class="selected-text text-color-gray">
								库存{{specSelected.inventory}}件
							</text>
						</view>
					</view>
				</view>
				<view class="attr-list">
					<text class="uni-bold">{{specTitle}}</text>
					<view class="item-list">
						<text 
							v-for="(item, index) in specList" 
							:key="index" class="tit"
							:class="{selected: item.selected, disabled:item.inventory <= 0}"
							@click="selectSpec(index, item.inventory <= 0)"
						>
							{{item.title}}
						</text>
					</view>
				</view>
				<view  class="attr-list uni-flex uni-row flex-right" style="padding-bottom: 150upx">
					<text class="uni-bold" style="padding-bottom: 20upx;">商品数量</text>
					<view class="number-box">
						<uni-number-box :min="1" @change="changeNum" :value="numberValue"></uni-number-box>
					</view>
				</view>
				<button class="btn" @click="specSeleted">确 定</button>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		uniIcon,
		uniBadge,
		uniNavBar,
		uniNumberBox
	} from '@dcloudio/uni-ui';
	import { mapState, mapMutations, mapGetters} from 'vuex';
	import service from '../../common/service.js';
	import util from '../../common/util.js';
	import customSwiper from "../../components/common/custom-swiper.vue";
	import _ from "lodash";
	import share from "../../components/common/share.vue";
	import recommendGoods from '../../components/common/recommend-goods.vue';
	export default {
		components: {
			uniIcon,
			uniBadge,
			uniNavBar,
			customSwiper,
			uniNumberBox,
			share,
			recommendGoods
		},
		data() {
			return {
				specClass: 'none',
				// 加入购物车数量
				numberValue: 1,
				// 加入购物车|直接购买
				type: "",
				// 商品id
				id:"",
				// 商品标题
				title: "",
				// 商品价格
				price: 0,
				// 描述
				detail: "",
				// 商品积分率
				pointRate: "",
				// 轮播图片
				flowImages: [],
				// 图文详情
				detailImages: [],
				// 图文详情的节点
				detailImagesNode: [],
				// 规格标题
				specTitle: "",
				// 规格选项
				specList: [],
				// 规格选择对象
				specSelected: {
					id: "",
					inventory: "",
					price: "",
					title: "",
					imageUrl: ""
				},
				// 分享的内容
				shareObj:{
					// 分享链接
					strShareUrl: "",
					// 分享标题
					strShareTitle: "",
					// 内容描述
					strShareSummary: "",
					// 分享图标
					strShareImageUrl: ""
				},
			}
		},
		onNavigationBarButtonTap(e) {
			if(this.id) {
				// 定义分享内容
				this.shareObj = {
					// 分享链接
					strShareUrl: "https://uniapp.dcloud.io",
					// 分享标题
					strShareTitle: this.title,
					// 内容描述
					strShareSummary: this.detail,
					// 分享图标
					strShareImageUrl: this.imageUrl
				}
				// 调用分享组件里面的分享方法
				if(e.index === 0) {
					this.$refs.shareChild.openShareBox();
				}
			}
		},
		computed:{
			...mapState(['userId', 'shopCart_store', 'imageDomain', 'gobalPointRate']),
			...mapGetters(["total_num"]),
			goodsList(){
				return this.shopCart_store.goodsList;
			},
			currentPointRate(){
				return this.pointRate || this.gobalPointRate;
			}
		},
		watch:{
			'specList.selected': {
				handler() {
					
				},
				deep: true,
				immediate: true
			}
		},
		methods: {
			...mapMutations(['ADD_GOODS', 'INIT_ORDER_lIST']),
			init(id){
				let ids = [];
				ids.push(id)
				uni.showLoading();
				service.getGoodListById({ids: ids}).then(res=>{
					// console.log(res)
					uni.hideLoading();
					let data = res.data.data;
					if(data.length > 0) {
						this.id = data[0].id;
						this.title = data[0].title;
						this.price = data[0].price;
						this.detail = data[0].detail;
						this.pointRate = data[0].pointRate;
						// 配置轮播图片
						this.flowImages = util.setImageUrl({
							type: "goods",
							goodId: data[0].id,
							imageName: data[0].imageUrl
						});
						// 配置图文详情图片
						this.detailImages = util.setImageUrl({
							type: "goods",
							goodId: data[0].id,
							imageName: data[0].detailImages
						});
						// 初始化图文详情
						this.detailImagesNode = this.initImagesNode(this.detailImages);
						// 初始化规格相关信息
						if(data[0].standard.length > 0) {
							// 有规格
							this.specTitle = data[0].standardTitle;
							this.specList = this.initSpecList(data[0].standard);
							//  默认选中第一条
							this.specList[0].selected = true;
							this.specSelected = {
								id: this.specList[0].id,
								title: this.specList[0].title,
								price: this.specList[0].price,
								inventory: this.specList[0].inventory,
								// 配置规格展示图片
								imageUrl: util.setImageUrl({
									type: "goods",
									goodId: this.specList[0].id,
									imageName: this.specList[0].imageUrl
								})[0].img
							}
						} else {
							// 无规格
							this.specSelected = {
								id: data[0].id,
								title: data[0].title,
								price: data[0].price,
								inventory: data[0].inventory,
								// 配置规格展示图片
								imageUrl: util.setImageUrl({
									type: "goods",
									goodId: data[0].id,
									imageName: data[0].imageUrl
								})[0].img
							}
						}
					}					
				}).catch(err=>{
					console.log(err)
					uni.hideLoading();
					uni.showToast({
						icon: "none",
						title:  err.errMsg,
					})
				})
			},
			// 初始化图文详情
			initImagesNode(images){
				let imagsNodes = [];
				_.forEach(images, item => {
					imagsNodes.push(`<img style="width:100%;display:block;" src="${item.img}" />`)
				})
				return `<div style="width:100%">${imagsNodes.join('')}</div>`;
			},
			// 初始化规格列表
			initSpecList(list){
				// 默认选中第一条
				return _.forEach(list, item =>  {item.selected = false});
			},
			/**  
			 * 左侧按钮点击事件  
			 */
			onClickLeft() {
				uni.navigateBack()
			},
			/**  
			 * 右侧按钮点击事件  
			 */
			onClickRight() {
				uni.showToast({
					title: "分享"
				})
			},
			//轮播图预览
			toSwiper(e) {
				uni.previewImage({
					urls: [e.img]
				});
			},
			// 跳转购物车
			toCart(){
				// 判断是否登录
				this.$guardToLogin().then(()=>{
					// 模拟底部跳转
					util.switchTab("shopCart");
				}).catch(()=>{});
			},
			// 打开规格选择弹框
			selectSpecAction(type){
				// 判断是否登录
				this.$guardToLogin().then(()=>{
					// 判断是否有规格
					this.type = type;
					if(this.specList.length > 0) {
						// 选择规格
						this.specClass = 'show';
					} else {
						// 无规则 直接购买或者加入购物车
						this.specSeleted()
					}
					
				}).catch(()=>{});
			},
			//规格弹窗开关
			toggleSpec() {
				if(this.specClass === 'show'){
					this.specClass = 'hide';
					setTimeout(() => {
						this.specClass = 'none';
					}, 250);
				}else if(this.specClass === 'none'){
					this.specClass = 'show';
				}
			},
			//选择规格
			selectSpec(index, disabled){
				if(disabled) {
					return
				}
				this.initSpecList(this.specList);
				this.$set(this.specList[index], 'selected', true);
				//存储已选择
				this.specSelected = {
					id: this.specList[index].id,
					title: this.specList[index].title,
					price: this.specList[index].price,
					standardText: this.specList[index].standardText,
					inventory: this.specList[index].inventory,
					// 配置规格展示图片
					imageUrl: util.setImageUrl({
						type: "goods",
						goodId: this.specList[index].id,
						imageName: this.specList[index].imageUrl
					})[0].img
				}
				// 更新展示的库存
				// this.$set(this.specSelected, 'inventory', this.specList[index].inventory);
			},
			// 修改加入购物车产品数量
			changeNum(value){
				this.numberValue = value;
			},
			stopPrevent(){},
			// 加入购物车
			addToCart(){
				// 查询商品是否已经存在于购物车
				let isExist = _.findIndex(this.goodsList, item => item.standardId === this.specSelected.id) > -1;
				// 购物车增加长度限制 最多50个
				if(!isExist && this.goodsList.length >= 50) {
					uni.showToast({
						icon:"none",
						title: "亲，购物车商品数量超出了限制哦，请删除部分后在添加"
					})
					return
				}
				let parms = {
					userId: this.userId,
					goodsId: this.id,
					num: this.numberValue,
					standardId: this.specSelected.id
				}
				uni.showLoading();
				service.addToCart(parms).then(res=>{
					uni.hideLoading();
					uni.showToast({
						title:"加入购物车成功"
					});
					let data = res.data.data;
					// 同一个商品加入购物城时，不增加数量
					if(!isExist) {
						// 同步vuex数据
						this.ADD_GOODS({
							goodsId: this.id,
							standardId: this.specSelected.id,
							num: this.numberValue
						});
					}
					
				}).catch(err=>{
					uni.hideLoading();
					uni.showToast({
						icon:"none",
						title: err.errMsg
					})
				})
			},
			// 创建订单；
			creatOrder(){
				// 同步vuex  
				let data = {
					goodsId: this.id,
					title: this.title,
					imageUrl: this.specSelected.imageUrl,
					standardId: this.specSelected.id,
					standardText: this.specSelected.title,
					num: this.numberValue,
					price: this.specSelected.price
				}
				this.INIT_ORDER_lIST([data]);
				uni.navigateTo({
					url: `/pages/shopCart/order_pay`
				});
			},
			// 规格选定后
			specSeleted(){
				// if(this.specSelected.inventory <= 0 || (this.specSelected.inventory < this.numberValue && this.numberValue === 1)) {
				// 	uni.showToast({
				// 		icon:"none",
				// 		title: "亲，所选商品库存不足哦！"
				// 	})
				// 	return
				// }
				// if(this.specSelected.inventory < this.numberValue) {
				// 	uni.showToast({
				// 		icon:"none",
				// 		title: "亲，所选商品数量超出库存了哦！"
				// 	})
				// 	return
				// }
				if(this.type === "toCart") {
					// 加入购物车
					this.addToCart();
				} else {
					// 直接购买
					this.creatOrder();
				}
				// 关闭弹框
				this.specClass = 'none';
			}
			
		},
		onLoad(e) {
			this.init(e.id);
			this.INIT_ORDER_lIST([]);
		},
	}
</script>

<style lang="scss">
	.goodsDetailPage {
		margin-bottom: 100upx;
		background-color: #f0f0f0;
		.content {
				
			.goods-info {
				.info-item {
					padding: 15upx 30upx;
					box-sizing: border-box;
					background-color: #fff;
				}
				.price-info{
					justify-content: space-between;
					padding-bottom: 40upx;
					margin-bottom: 20upx;
					.price{
						align-items: center;
						.tag{
							height: 32upx;
							background-color: #242424;
							padding: 4upx 12upx;
							color: #fff;
							margin-left: 30upx;
						}
					}
					.number{
						
					}
				}
				.preferential{
					height:88upx;
					margin-bottom: 20upx;
					background-color: #fff;
					padding: 0 30upx;
					box-sizing: border-box;
					align-items: center;
					.title{
						width: 96upx;
					}
				}
			}
			.detail-image {
				background-color: #fff;
				image{
					width:100%;
					height: auto;
				}
				margin-bottom: 30upx;
			}
		}

		.goods-footer {
			width: 100%;
			height: 100upx;
			position: fixed;
			bottom: 0;
			background-color: #fff;
			.btn{
				font-size: 30upx;
				display: flex;
				align-items: center;
				justify-content: center;
			}
			.cart{
				padding-left: 30upx;
				box-sizing: border-box;
				display: flex;
				align-items: center;
				justify-content: start !important;
				position: relative;
				.uni-badge{
					position: absolute;
					top: 16upx;
					left: 60upx;
				}
			}
			.add-to-cart{
				background-color: #fff;
				color: #242424;
			}
			.to-buy{
				background-color: #242424;;
				color: #fff;
				
			}
		}
		/*  弹出层 */
		.popup {
			position: fixed;
			left: 0;
			top: 0;
			right: 0;
			bottom: 0;
			z-index: 99;
			&.show {
				display: block;
				.mask{
					animation: showPopup 0.2s linear both;
				}
				.layer {
					animation: showLayer 0.2s linear both;
				}
			}
			&.hide {
				.mask{
					animation: hidePopup 0.2s linear both;
				}
				.layer {
					animation: hideLayer 0.2s linear both;
				}
			}
			&.none {
				display: none;
			}
			.mask{
				position: fixed;
				top: 0;
				width: 100%;
				height: 100%;
				z-index: 1;
				background-color: rgba(0, 0, 0, 0.4);
			}
			.layer {
				position: fixed;
				z-index: 99;
				bottom: 0;
				width: 100%;
				min-height: 40vh;
				background-color: #fff;
				padding: 30upx;
				box-sizing: border-box;
				.a-t{
					position: relative;
					top: -80upx;
					left: 0;
					image{
						width:240upx;
						height: 240upx;
						margin-right: 50upx;
					}
					.right{
						display: flex;
						justify-content: flex-end;
						.price{
							font-size: 36upx;
							font-weight: 600;
						}
						.selected{
							display: flex;
							justify-content: space-between;
							align-items: center;
						}
					}
				}
				.attr-list{
					display: flex;
					flex-direction: column;
					font-size: 30upx;
					color: #666;
					padding-bottom: 20upx;
					.number-box{
						.uni-numbox{
							transform: scale(0.85);
							transform-origin: left;
						}
					}
				}
				.item-list{
					padding: 20upx 0 0;
					display: flex;
					flex-wrap: wrap;
					text{
						display: flex;
						align-items: center;
						justify-content: center;
						background: #eee;
						margin-right: 20upx;
						margin-bottom: 20upx;
						min-width: 60upx;
						height: 60upx;
						padding: 0 20upx;
						font-size: 28upx;
						color: #242424;
					}
					.selected{
						background: #242424;
						color: #fff;
					}
					.disabled{
						color: #ccc;
					}
				}
				.btn{
					position: absolute;
					width: 100%;
					bottom: 0;
					height: 100upx;
					line-height: 100upx;
					background: #242424;
					font-size: 30upx;
					color: #fff;
					border-radius: 0;
					margin:0 -30upx;
				}
			}
			@keyframes showPopup {
				0% {
					opacity: 0;
				}
				100% {
					opacity: 1;
				}
			}
			@keyframes hidePopup {
				0% {
					opacity: 1;
				}
				100% {
					opacity: 0;
				}
			}
			@keyframes showLayer {
				0% {
					transform: translateY(120%);
				}
				100% {
					transform: translateY(0%);
				}
			}
			@keyframes hideLayer {
				0% {
					transform: translateY(0);
				}
				100% {
					transform: translateY(120%);
				}
			}
		}
	}
</style>
