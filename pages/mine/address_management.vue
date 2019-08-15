<template>
	<view class="addressManagementPage">
		<view class="address-none" v-if="getAddressList.length == 0">
			暂无收货地址
		</view>
		<view class="address-list">
			<radio-group @change="radioChange">
				<view class="address-item" v-for="(item, index) in getAddressList" :key="index" @tap="selectAddr(item)">
					<view class="info">
						<view class="uni-bold uni-h5">
							{{item.receiver}} &nbsp;&nbsp;{{item.phone}}
						</view>
						<view class="uni-text-gray uni-text-small">
							{{item.province}} &nbsp;{{item.city}} &nbsp;{{item.region}} &nbsp;{{item.detail}}
						</view>
					</view>
					<view class="btn-group">
						<view class="set-default uni-flex">
							<label class="uni-flex">
								<view class="checkbox uni-flex-item">
									<radio :value="item.id" :checked="item.default === 1"></radio>
								</view>
								<text class="uni-text common-pl-20">
									设为默认
								</text>
							</label>
						</view>
						<view class="btn-right uni-flex">
							<view class="edit flex-center-center common-mr-20" @tap="editAddress(item)">
								<view class="icon">
									<uni-icon type="compose" size="26"></uni-icon>
								</view>
								<text class="uni-text">编辑</text>
							</view>
							<view class="delete flex-center-center" @tap="deleteAddress(item.id)">
								<view class="icon">
									<uni-icon type="trash" size="26"></uni-icon>
								</view>
								<text class="uni-text">删除</text>
							</view>
						</view>
					</view>
				</view>
			</radio-group>
		</view>
		<view class="bottom-btn" @tap="addAddress">
			<view class="icon">
				<uni-icon type="plus" size="26"></uni-icon>
			</view>
			<text>新增地址</text>
		</view>
	</view>
</template>

<script>
	import {
		uniIcon
	} from '@dcloudio/uni-ui';
	import _ from "lodash";
	import { mapMutations, mapGetters, mapActions } from 'vuex';
	import service from '../../common/service.js';
	export default{
		components: {
			uniIcon
		},
		data(){
			return {
				// 放到vuex中去管理了
				// addressList: [],
				current: 0
			}
		},
		computed:{
			// 注入vuex的计算方法
			...mapGetters(["getAddressList"]),	
		},
		methods:{
			// 注入vuex的方法
			...mapMutations(['INIT_ADDRESS']),
			...mapActions(['updataAddressList']),
			// 选择地址
			selectAddr(address) {
				// 跳不过去，只能在pages/mine/目录下跳，怎么破?
				// uni.navigateTo({
				// 	url:"order_pay"
				// })
				setTimeout(() => {
					uni.navigateBack({
						delta: 1
					});
				}, 1000);
			},
			init(){
				let params = {
					userId: this.$store.state.userId,
					// userId: "660efd50-4c6f-11e9-bc7c-95dfc83db603"
				}
				// 获取用户收获地址列表
				uni.showLoading();
				service.getAddressList(params).then(res=>{
					uni.hideLoading();
					let data = res.data.data;
					if(data.length > 0) {
						// this.addressList = data;
						this.INIT_ADDRESS(data);
					} 		
				}).catch(err=>{
					console.log(err)
					uni.hideLoading();
					uni.showToast({
						icon: "none",
						title: err.errMsg,
					})
				})
			},
			radioChange(e) {
				console.log(e)
				// 请求设置为默认接口
				let params = {
					id: e.detail.value,
					default: true
				}
				uni.showLoading();
				service.editAddress(params).then(res=>{
					uni.hideLoading();
					uni.showToast({
						title: "已保存为默认"
					})	
					// 同步到vuex
					this.updataAddressList();
				}).catch(err=>{
					console.log(err)
					uni.hideLoading();
					uni.showToast({
						icon: "none",
						title: err.errMsg,
					})
				})
			},
			editAddress(item){
				uni.navigateTo({
					url:`address_edit?mode=edit&id=${item.id}&receiver=${item.receiver}&phone=${item.phone}&province=${item.province}&city=${item.city}&region=${item.region}&detail=${item.detail}&default=${item.default}`
				})
			},
			// 删除地址
			deleteAddress(id){
				var that = this;
				console.log(this);
				uni.showModal({
					title: "确认",
					content: "是否删除地址？",
					success(res) {
						if (res.confirm) {
							let params = {
								id: id,
							}
							uni.showLoading();
							service.deleteAddress(params).then(res=>{
								uni.hideLoading();
								uni.showToast({
									title: "地址已删除"
								});
								// 同步到vuex
								that.updataAddressList();
							}).catch(err=>{
								console.log(err)
								uni.hideLoading();
								uni.showToast({
									icon: "none",
									title:  err.errMsg || err.data.data,
								})
							})
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				})
				
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
