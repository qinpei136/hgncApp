<template>
	<view class="accountInfoPage">
		<!-- 跳转列表1 -->
		<myList :pageList="pageList1" @handleClick="handleClick"></myList>
		
		<view class="place-bar-20"></view>
		<!-- 跳转列表2 -->
		<myList :pageList="pageList2" @handleClick="handleClick"></myList>
		<view class="bottom-btn" @tap="logout">
			<button type="primary">退出当前账号</button>
		</view>
	</view>
</template>

<script>
	import neilModal from '../../components/neil-modal/neil-modal.vue';
	import myList from "../../components/common/my-list";
	import { mapMutations } from 'vuex';
	import service from "../../common/userService.js";
	export default {
		components: {
			myList,
			neilModal
		},
		data() {
			return {
				userinfo: {
					
				},
				showModal: false,
				nickName: '',
				pageList1: [
					{
						type: "nikeName",
						title: '用户名',
						iconfont: 'iconicon_mine_nor',
						extra: {},
						isShowExtra: true,
						isShowArrow: false
					},
					{
						type: "id",
						title: 'ID',
						iconfont: 'iconid',
						extra: {
							text: "242234234",
							color: "#999"
						},
						isShowExtra: true,
						isShowArrow: false
					},
					{
						type: "password",
						title: '密码管理',
						iconfont: 'iconpssword_management',
						extra: {},
						isShowExtra: true,
						isShowArrow: true
					}
				],
				pageList2: [{
						type: "telphone",
						title: '换绑手机',
						iconfont: 'iconshouji',
						extra: {},
						isShowExtra: false,
						isShowArrow: true
					},
					{
						type: "money",
						title: '累计消费',
						iconfont: 'iconmoney',
						extra: {
							text: "￥242234234",
							color: "#999"
						},
						isShowExtra: true,
						isShowArrow: false
					}
				]
			};
		},
		onLoad() {
			//加载
			this.init();
		},
		methods: {
			init() {
				// 缓存用户token
				let userinfo = uni.getStorageSync('USERS_INFO')
				if(userinfo) {
					// 初始化昵称
					this.pageList1[0].extra.text = userinfo.userName;
					this.nickName = userinfo.userName;
					// 初始化id
					this.pageList1[1].extra.text = userinfo.tuser.id;
					//初始化累计消费
					this.pageList2[1].extra.text = userinfo.sales;
				}
			},
			// 关闭modal
			closeModal(){
				this.showModal = false;
			},
			// 修改昵称
			changeNickName(){
				// 请求接口
				this.pageList1[1].extra.text = this.nickName;
			},
			// 点击跳转
			handleClick(data) { 
				// 管理密码
				if (data.item.type === "password") {
					uni.navigateTo({
						url: "/pages/mine/gesture_lock?mode=set"
					})
			
				} else if (data.item.type === "telphone") {
					uni.navigateTo({
						url: `/pages/mine/change_telphone`
					})
				}
			},
			// 退出当前账号
			logout(){
				uni.showModal({
					// title: '提示',
					content: '是否确定退出登录？',
					success:  (res) => {
						if (res.confirm) {
							uni.showLoading({
								title: "退出中..."
							});
				let token = uni.getStorageSync('USER_TOKEN')
				const parms = {
					token: token
				};
							service.logout(parms).then(res=>{
								uni.hideLoading();
								this.$store.commit('LOGOUT');
								uni.reLaunch({
									url: "/pages/login/login"
								})
							}).catch(err=>{
								uni.hideLoading();
								uni.showToast({
									icon: "none",
									title:  err.errMsg,
								})
							})
							
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
				
			}
			
		}
	}
</script>

<style lang="scss">
	page{
		width: 100%;
		height: 100%;
		background-color: #f0f0f0;
	}
	.accountInfoPage{
		.bottom-btn{
			width: 100%;
			position: fixed;
			bottom: 0;
			border-radius: 0upx; 
			button{
				color: #f45444;
				background-color: #f6f6f6;
				border-radius:0upx; 
				&::after{
					border-radius:0upx;
					border: none;
				}
			}
		}
		.input-wrap{
			padding: 10upx 20upx;
		}
	}
</style>
