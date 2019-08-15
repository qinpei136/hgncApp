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
		
		<!-- 模态框 修改昵称-->
		<neil-modal :show="showModal" @close="closeModal()" @confirm="changeNickName" title="修改昵称">
		    <view class="input-wrap">	
		    	<input type="text" v-model="nickName" placeholder="请输入昵称" class="nick-name" />
		    </view>
		</neil-modal>
	</view>
</template>

<script>
	import neilModal from '../../components/neil-modal/neil-modal.vue';
	import myList from "../../components/common/my-list";
	import { mapMutations } from 'vuex';
	import service from "../../common/service.js";
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
				pageList1: [{
						type: "face",
						title: '头像',
						iconfont: 'iconchracter',
						extra: {},
						isShowExtra: false,
						isShowArrow: true
					},
					{
						type: "nikeName",
						title: '昵称',
						iconfont: 'iconicon_mine_nor',
						extra: {
							text: "昵称",
							color: "#999"
						},
						isShowExtra: true,
						isShowArrow: true
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
				let token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZSI6IjE1NjUyNTgxMTg4IiwidXNlcmlkIjoiMjkzYTg1OTgtNzM5Yi00NjUzLTllNzMtZWI4NjlmMmI2YmRiIiwidXNlcm5hbWUiOiLnp6bkvakiLCJuYmYiOjE1NjU4NTQzODksImV4cCI6MTU2NTg2MDM4OSwiaWF0IjoxNTY1ODU0Mzg5LCJpc3MiOiJpc3N1ZXIiLCJhdWQiOiJBdWRpZW5jZSJ9.7AdDAYFi8GKuWBRoiMPTn8pj1iqb8qcT_9vnsMnq84M"
				let data={"id":"293a8598-739b-4653-9e73-eb869f2b6bdb","userName":"秦佩","pwd":"F3412D31BF5D660E","secondaryPwd":null,"phone":"15652581188","role":0,"parentCode":"14fcfa90-5b8c-44a3-b6fc-57fc3bc22ff8","mentorCode":"NULL                                ","topCode":"8a8b7f5c-0023-4b17-9fdb-01023f75f038","createTime":"2019-08-15T14:44:37.843","timeLine":null,"comPoint":0,"gold":0,"dumpRate":0,"alive":true,"dumpPointFlag":true,"cost":0,"remain":0,"storeOwner":false,"tShops":null,"tAddress":[],"tCart":[],"tOrder":[],"tShopCart":[],"tShopOrder":[]}
				uni.setStorageSync("USER_TOKEN", token);
				uni.setStorageSync('USERS_INFO', data);
				let userinfo = uni.getStorageSync('USERS_INFO')
				if(userinfo) {
					// 初始化头像
					// 初始化昵称
					this.pageList1[1].extra.text = userinfo.userName;
					this.nickName = userinfo.userName;
					// 初始化id
					this.pageList1[2].extra.text = userinfo.inviteCode;
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
				// 更换头像
				if (data.item.type === "face") {
					uni.showToast({
						title:"更换头像"
					})
					// 修改昵称
				} else if (data.item.type === "nikeName") {
					this.showModal = true;
					// 管理密码
				} else if (data.item.type === "password") {
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
							service.logout().then(res=>{
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
