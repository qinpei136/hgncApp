<template>
	<view class="addressManagementPage">
		<block v-if="dataList.length == 0">
			<noData :text="noDataText"></noData>
		</block>
		<view class="address-list">
			<radio-group @change="radioChange">
				<view class="address-item" v-for="(item, index) in dataList" :key="index" ><!-- @tap="selectAddr(item)" -->
					<view class="btn-group">
						<view class="set-default uni-flex">
							<label class="uni-flex">
								<text class="uni-text common-pl-20">
									{{item.a.typeName}}({{item.count}})
								</text>
							</label>
						</view>
						<view class="btn-right uni-flex">
							<view class="edit flex-center-center common-mr-20" @tap="edit(item)">
								<view class="icon">
									<uni-icon type="compose" size="26"></uni-icon>
								</view>
								<!-- <text class="uni-text">编辑</text> -->
							</view>
							<view class="delete flex-center-center" @tap="del(item)">
								<view class="icon">
									<uni-icon type="trash" size="26"></uni-icon>
								</view>
								<!-- <text class="uni-text">删除</text> -->
							</view>
						</view>
					</view>
				</view>
			</radio-group>
		</view>
		<neil-modal :show="showModal" @close="closeModal()" @confirm="save" :title="title">
				    <view class="input-wrap">	
				    	<input type="text" v-model="typeName" placeholder="请填写分类名称" class="nick-name" />
				    </view>
				</neil-modal>
		<view class="bottom-btn" @tap="add">
			<view class="icon">
				<uni-icon type="plus" size="26"></uni-icon>
			</view>
			<text>新增分类</text>
		</view>
	</view>
</template>

<script>
	import {
		uniIcon
	} from '@dcloudio/uni-ui';
	import _ from "lodash";
	import { mapMutations, mapGetters, mapActions } from 'vuex';
	import userService from '../../common/userService.js';
	import noData from "../../components/common/no-data.vue";
	import neilModal from '../../components/neil-modal/neil-modal.vue';
	export default{
		components: {
			uniIcon,
			noData,
			neilModal
		},
		data(){
			return {
				//点评Id
				shopId:"",
				dataList:[],
				noDataText: "暂无商品分类",
				showModal: false,
				title:"新建分类",
				typeName:"",
				id:"",
				mode:"add",
				current: 0,
			}
		},
		computed:{
			
		},
		methods:{
			init()
			{
				uni.showLoading();
				userService.getShopByUserId().then(res => {
				uni.hideLoading();
				if(res.data.code=="200")
				{
					this.shopId=res.data.result.tShops.id
					this.getShopType()
				}
				}).catch(err => {
					uni.hideLoading();
					uni.showToast({
						icon: "none",
						title: err.errMsg
					})
				})
			},
			getShopType(){
				// 获取分类列表
				uni.showLoading();
				let params={"shopId":this.shopId}
				userService.getShopType(params).then(res=>{
					uni.hideLoading();
					let data = res.data.result;
					if(data.length > 0) {
						this.dataList = data;
					} 		
				}).catch(err=>{
					uni.hideLoading();
					uni.showToast({
						icon: "none",
						title: err.errMsg,
					})
				})
			},
			add(){
				this.title="新建分类"
				this.showModal=true;
				this.id=""
				this.mode="add"
				this.typeName=""
			},
			// 关闭modal
			closeModal(){
				this.showModal = false;
			},
			edit(item){
				this.title="修改分类"
				this.showModal=true;
				this.typeName=item.a.typeName
				this.id=item.a.id
				this.mode="update"
			},
			save(){
				uni.showLoading();
				let params={"shopId":this.shopId,"id":this.id,"typeName":this.typeName}
				userService[`${this.mode}ShopType`](params).then(res=>{
					uni.hideLoading();
					if(res.data.code=="200")
						this.init()
					else
						uni.showToast({
							icon: "none",
							title: res.data.msg,
						})	
				}).catch(err=>{
					uni.hideLoading();
					uni.showToast({
						icon: "none",
						title: err.errMsg,
					})
				})
			},
			// 删除
			del(item){
				if(item.count>0)
				{
					uni.showToast({
						title: "此分类下有商品，不能删除！"
					});
					return;
				}
				else
				{
					var _this = this;
					uni.showModal({
						title: "确认",
						content: "是否删除分类？",
						success(res) {
							if (res.confirm) {
								let params = {
									id: item.a.id,
								}
								uni.showLoading();
								userService.delShopType(params).then(res=>{
									uni.hideLoading();
									if(res.data.code=="200")
									{
										_this.init()
									}
									else
									{
										uni.showToast({
											icon: "none",
											title:  res.data.msg
										})
									}
								}).catch(err=>{
									uni.hideLoading();
									uni.showToast({
										icon: "none",
										title:  err.errMsg
									})
								})
							}
						}
					})
				}
				
			},
			addAddress(){
				uni.navigateTo({
					url:"address_edit?mode=add"
				})
			}
		},
		onLoad() {
			this.init()
		}
	}
</script>

<style lang="scss">
	page{
		width: 100%;
		height: 100%;
		background-color: #f5f5f5;
	}
	.addressManagementPage{
		.address-none{
			margin-top: 200upx;
			text-align: center;
			font-size: 36upx;
			color: #666;
		}
		.address-list{
			margin-bottom: 100upx;
			.address-item{
				width: 100%;
				margin-bottom: 20upx;
				background-color: #fff;
				.info{
					width: 100%;
					border-bottom: 1upx solid #f5f5f5;
					padding: 30upx;
					box-sizing: border-box;
				}
				.btn-group{
					height: 74upx;
					width: 100%;
					padding: 0 30upx;
					box-sizing: border-box;
					display: flex;
					align-items: center;
					justify-content: space-between;
				}
			}
		}
		.bottom-btn{
			width: 100%;
			height: 100upx;
			position: fixed;
			bottom: 0;
			left: 0;
			background-color: #fff;
			border-top: 1upx solid #f0f0f0;
			display: flex;
			justify-content: center;
			align-items: center;
			text-align: center;
			.icon{
				margin-right: 10upx;
				font-weight:600; 
			}
			text{
				font-weight:600; 
			}
		}
	}
</style>
