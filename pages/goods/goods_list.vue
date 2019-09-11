<template>
	<view class="goodslist" :style="setStyle"><!--  -->
		<uni-nav-bar fixed="true" left-icon="back" :background-color="titleNView.bg" :color="titleNView.textColor" right-text="添加商品" title="商品管理" @click-right="add" @click-left="back"></uni-nav-bar>
		<!-- 内容 -->
		<view class="content">
			<view class="tabs uni-flex">
				<view class="tab uni-flex-item flex-center-center" :class="{active: index === tabs.current}" v-for="(item, index) in tabs.items"
				 :key="index" @tap="changeTabs(index)">
					<view class="name">
						{{item}}
					</view>
					<view class="line-bottom"></view>
				</view>
			</view>
			
			<!-- 列表内容 -->
			<view class="order-list">
				<block v-if="!hasNoData">
					<view class="order-list-item" v-for="(item, index) in dataList" :key="index">
						<view class="order-info uni-flex" @tap="add(item.id)">
							<view class="image uni-inline-item">
								<image :src="item.imageUrl" mode="aspectFit"></image>
							</view>
							<view class="info uni-flex-item">
								<view class="name uni-h5">
									<text style="color:#242424;font-weight:bold;">{{item.title}}</text>
								</view>
								<view class="name uni-h5">
									<text class="price">￥{{item.price}}</text>
									<view class="more text-color-gray">
										<text class="up" v-if="!item.listing"  @tap.stop="goodsUp(item)">上架</text>
										<text>&nbsp;&nbsp;&nbsp;></text>
									</view>
								</view>
								<view class="code uni-text-small text-color-gray uni-column uni-flex">
									<text>{{item.createTime}}添加</text>
								</view>
							</view>
						</view>
					</view>
				</block>
				<!-- 暂无数据 -->
				<block v-if="hasNoData">
					<noData :text="noDataText"></noData>
					<view v-if="tabs.current===0" class="uni-btn-v">
						<button @click="add()" class="btn">添加商品</button>
					</view>
				</block>
			</view>
		</view>
	</view>
</template>

<script>
	import userService from '../../common/userService.js';
	import util from "../../common/util.js";
	import {
		uniIcon,
		uniNavBar,
	} from '@dcloudio/uni-ui';
	import noData from "../../components/common/no-data.vue";
	import { mapState, mapMutations, mapActions } from 'vuex';
	export default {
		components: {
			uniIcon,
			uniNavBar,
			noData
		},
		data() {
			return {
				tabs: {
					// 选项卡
					items: ['出售中', '已下架'],
					current: 0,
				},
				dataList: [],
				// 状态查询字段
				page: 1,
				noDataText: "暂无出售商品",
				// 店铺名称
				name: "",
				//店铺Id
				id:""
			};
		},
		computed: {
			...mapState(['titleNView']),
			setStyle() {
				let paddingBottom = this.hasLogin ? 98 : 0;
				return `padding-bottom:${paddingBottom}upx`;
			},
			hasNoData() {
				return this.dataList.length === 0;
			}
		},
		methods: {
			getShopId()
			{
				uni.showLoading();
				userService.getShopByUserId().then(res => {
					uni.hideLoading();
					if(res.data.code=="200")
					{
						this.id=res.data.result.tShops.id
						this.getGoodsList()
					}
				}).catch(err => {
					uni.hideLoading();
					uni.showToast({
						icon: "none",
						title: err.errMsg
					})
				})
			},
			getGoodsList()
			{
				this.noDataText=this.tabs.current=="0"?"暂无出售商品":"暂无已下架商品"
				let params = {
					listing: this.tabs.current=="0"?true:false,
					id: this.id,
					pageIndex: this.page,
					pageSize: 10,
				}
				uni.showLoading();
				userService.getGoodsList(params).then(res => {
				uni.hideLoading();
				if(res.data.code=="200")
				{
					let data=res.data.result
					for(let i in data)
					{
						data[i].imageUrl = util.getImageUrl(data[i].imageUrl)
						data[i].createTime = data[i].createTime.substr(0,10)
					}
					this.dataList=data
				}
			}).catch(err => {
				uni.hideLoading();
				uni.showToast({
					icon: "none",
					title: err.errMsg
				})
			})
			},
			// 切换选项卡
			changeTabs(index) {
				if (this.tabs.current !== index) {
					this.tabs.current = index;
					// 初始化查询条件
					this.page = 1;
					// this.statusParam = this.tabs.current;
					this.dataList = [];
					this.getGoodsList();
				}
			},
			//保存
			add(goodsId){
				uni.navigateTo({
					url: `/pages/goods/goods_add?shopId=`+this.id+"&goodsId="+goodsId
				})
			},
			//返回
			back(){
				uni.navigateBack()
			},
			goodsUp(item)
			{
				uni.showLoading();
				let params={"id":item.id}
				userService.putGoodsUp(params).then(res => {
					uni.hideLoading();
					if(res.data.code=="200")
					{
						this.dataList=this.dataList.filter(obj=>obj.id!=item.id)
					}
				}).catch(err => {
					uni.hideLoading();
					uni.showToast({
						icon: "none",
						title: err.errMsg
					})
				})
			}
			},
			
		onLoad() {
			this.getShopId()
		}
	};
</script>

<style lang="scss">
	uni-page-body{
		// background-color: #f0f0f0;
		// height:100%;
		
		.goodslist{
			// background-color: #f0f0f0;
			padding-bottom: 98upx;
			height:100%;
			.content{
				margin-bottom: 100upx;
				
				.tabs {
					width: 100%;
					height: 80upx;
					position: fixed;
					/* #ifdef H5 */
					top: 80upx;
					/* #endif */
					z-index: 1000;
					background-color: #fff;
					color: #999;
					border-bottom: 1upx solid #f0f0f0;
				
					.tab {
						position: relative;
				
						&.active {
							color: #242424;
				
							.line-bottom {
								width: 20upx;
								height: 6upx;
								background-color: #242424;
								position: absolute;
								bottom: 1upx;
								left: 50%;
								transform: translateX(-10upx);
							}
						}
					}
				}
				
				
				.order-list {
					/* #ifdef H5 */
					padding-top: 80upx;
					/* #endif */
					/*  #ifdef  APP-PLUS  */
					padding-top: calc(var(--status-bar-height) + 30upx);
				
					/* #endif */
					.order-list-item {
						background-color: #fff;
						width: 100%;
						border: 1px solid #eee;
						padding: 0 30upx;
						box-sizing: border-box;
						margin-top: 16upx;
						cursor:pointer;
				
						.title-wrap {
							width: 100%;
							height: 74upx;
							border-bottom: 1upx solid #f0f0f0;
				
							.title {
								// line-height: 74upx;
								width: 600upx;
							}
				
							.status {
								width: 100upx;
							}
						}
				
						.order-info {
							.image {
								width: 184upx;
								height: 184upx;
								margin-top: 30upx;
								margin-right: 20upx;
				
								image {
									width: 100%;
									height: 100%;
								}
							}
				
							.info {
								margin-top: 18upx;
								uni-view{
									line-height:70upx;
								}
				
								.name {
									.price{
										font-weight: bold;
										color: #1c5ef0;
									}
				
									// 合计的价格
									.more {
										float: right;
										font-weight: bold;
										.up{
											color: #1c5ef0;
											cursor: pointer;
											margin-right:20upx;
										}
									}
								}
							}
						}
						.btn{
							button{
								&::after{
									border-radius: 0;
								}
							}
						}
					}
					
					.uni-btn-v {
						// width: 100%;
						// height: 140upx;
						// margin: 0 -30upx;
						// position: fixed;
						// bottom: 0upx;
						// left: 30upx;
						// z-index: 1000;
						// padding: 0 30upx;
						// box-sizing: border-box;
						// display: flex;
						// align-items: flex-start;
					
						.btn {
							background: #242424;
							width: 240upx;
							color: #fff;
							border-radius: 2upx;
							margin: auto;
						}
					}
				}
			}
		}
	}
	
</style>
