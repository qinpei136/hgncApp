<template>
	<view class="gestureLockPage">
		<view class="uni-page-head">
			<view class="uni-page-head-title">{{title}}</view>
		</view>
		<view class="uni-padding-wrap uni-common-mt">
			<view>
				<mpvue-gesture-lock :containerWidth="590" :cycleRadius="70" @end="onEnd" :password="password"></mpvue-gesture-lock>
			</view>
			<!-- 提示 -->
			<view class="uni-helllo-text uni-common-mt uni-center" v-if="text">{{text}}</view>
			<!-- 错误提示 -->
			<view class="uni-helllo-text uni-common-mt uni-center error" v-if="error">
				{{error}}
			</view>
		</view>
		<!-- 模态框 -->
		<neil-modal :show="showModal" @close="closeModal()" title="重置密码">
		    <view class="input-wrap">
				<view class="text-color-gray uni-text-small notice">
					请先获取验证码后，再进行手势设定
				</view>
		    	<view class=" input-item">
		    		<input type="number" maxlength="11" v-model="phone" placeholder="请输入手机号" class="is-input1 " data-val="phone" />
		    	</view>
		    	<view class="input-item has-label-right uni-flex">
		    		<input type="number" class="input-left" placeholder="短信验证码" v-model="code" />
		    		<view class="label-right" @tap="getsmscode">
		    			<text :style="{color:smsbtn.status?'#333':'#999'}">{{smsbtn.text}}</text>
		    		</view>
		    	</view>
		    </view>
		</neil-modal>
		
		<view class="more" @tap="showMore" v-show="isShowMore">
			更多
		</view>
	</view>
</template>

<script>
	import mpvueGestureLock from '../../components/mpvueGestureLock/index.vue';
	import neilModal from '../../components/neil-modal/neil-modal.vue';
	import service from '../../common/service.js';
	import { mapMutations, mapState } from 'vuex';
	import _ from "lodash";
	import util from "../../common/util.js";
	export default {
		components: {
			mpvueGestureLock,
			neilModal
		},
		data() {
			return {
				title: "密码管理",
				// 提示内容
				text: "请设定手势",
				// 设定的密码
				password: [],
				// 错误提示
				error: "",
				// 错误次数
				errCount: 0,
				// 页面模式，set-管理模式, check-校验模式
				mode: "set",
				// 管理模式下的操作状态，change-修改密码， forget-忘记密码 
				setStatus: "",
				// 密码设定的步骤
				step: 1,
				// 获取验证码按钮相关配置
				smsbtn: {
					text: '获取验证码',
					status: true,
					codeTime: 60
				},
				showModal: false,
				// 手机号
				phone: "",
				// 验证码
				code: ""
			}
		},
		computed:{
			// ...mapState(['secondaryPwd'])
			isShowMore(){
				return this.$store.state.secondaryPwd !== null
			}
		},
		methods: {
			// 注入vuex的方法
			...mapMutations(['SET_PASSWORD_CHECKSTATUS', 'SET_SECONDARYPWD']),
			// 初始化title
			initTitle(){
				let title = this.mode === "set" ? "二级密码管理" : "二级密码校验";
				uni.setNavigationBarTitle({
					title: title
				});
				this.title = this.mode === "set" ? "密码管理" : "密码校验";
			},
			onEnd(data) {
// 				console.log(data);
// 				console.log(this.password);
				// 密码低于四位
				if(!(this.mode === "set" && this.setStatus === "")) {
					if(data.length < 4) {
						this.error = "最少连接四个点，请重新输入";
						return
					} else {
						this.error = "";
					}
				}
				// 尚未设置二级密码
				if( !this.$store.state.secondaryPwd ) {
					// 设定二级密码，需要输入两次
					if (this.step === 1) {
						this.text = '请确认手势设定';
						this.password = data;
						// 进入下一步设置
						this.step++;
					} else {
						if (this.password.join('') === data.join('')) {
							// 请求设定接口
							this.setPassword(this.password.join(''));
						} else {
							this.error = '两次手势设定不一致';
						}
					}
					return
				}
				// 管理模式
				if(this.mode === "set") {
					// 未选择操作状态，不触发任何行为
					if(this.setStatus ==="") {
						return
					} else if(this.setStatus === "change") {
						// 修改状态，输入三次，一次身份认证，一次输入密码，一次确认密码
						if(this.step === 1) {
							// 身份认证
							this.password = this.$store.state.secondaryPwd.split("");
							if(this.password.join('') === data.join('')) {
								this.text = "手势验证成功，请设定新手势密码";
								// 进入第二步设置
								this.step++;
								// 清空密码
								this.password = [];
							} else {
								this.error = "手势验证不通过，请重新输入";
							}
						} else if(this.step === 2) {
							// 输入新密码
							this.text = '请确认手势设定';
							this.password = data;
							// 进入第三步确认
							this.step++;
						} else {
							// 确认新密码
							if (this.password.join('') === data.join('')) {						
								this.changePassword(this.password.join(''));
							} else {
								this.error = '两次手势设定不一致';
							}
							
						} 
					} else if(this.setStatus === "forget") {
						// 重置状态，需要输入两次
						if (this.step === 1) {
							this.text = '请确认手势设定';
							this.password = data;
							// 进入下一步设置
							this.step++;
						} else {
							if (this.password.join('') === data.join('')) {
								// 请求设定接口
								this.reSetPassword(this.password.join(''));
							} else {
								this.error = '两次手势设定不一致';
							}
						}
						return
					}
				} else if(this.mode === "check"){
					// 校验模式，只需输入一次，直接校验
					this.password = this.$store.state.secondaryPwd.split("");
					if(this.password.join('') === data.join('')) {
						// 请求校验接口
						this.checkPassword(data.join(''))
					} else {
						this.errCount++
						if(this.errCount === 5) {
							uni.showLoading();
							// 输入达到五次，登出设备
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
						}
						// 不通过
						this.error = `手势密码校验不成功,还可以输入${5 - this.errCount}次`;
					}
				}
				
			},
			// 设定二级密码
			setPassword(password){
				let params = {
					pwd: password
				}
				uni.showLoading();
				service.setSecondaryPwd(params).then(res=>{
					uni.hideLoading();
					this.text = '手势设定完成';
					// 清空密码值
					this.password = [];
					// 重置步骤
					this.step = 1;
					// 同步密码
					this.SET_SECONDARYPWD(password);
					uni.showToast({
						icon: "none",
						title:  "二级密码设定成功"
					})
					// 校验模式直接返回
					if(this.mode === "check") {
						this.SET_PASSWORD_CHECKSTATUS(true);
						let timer = setTimeout(()=>{
							uni.navigateBack();
							timer = null;
						}, 300);
					}
				}).catch(err => {
					uni.hideLoading();
					// 重置步骤
					this.step = 1;
					this.text = '请设定手势';
					uni.showToast({
						icon: "none",
						title:  err.errMsg,
					})
				})
			},
			// 校验二级密码
			checkPassword(password){ 
					let params = {
						pwd: this.password.join('')
					}
					uni.showLoading();
					service.setSecondaryPwd(params).then(res=>{
						uni.hideLoading();
						this.text = '手势密码校验成功';
						// 清空密码值
						this.password = [];
						// 重置步骤
						this.step = 1;
						// 通过
						uni.showToast({
							icon: "none",
							title:  "手势密码校验成功",
							success: () => {
								// 同步校验状态为true，购买完成后重置为false（每次购物都检验）
								this.SET_PASSWORD_CHECKSTATUS(true);
								let timer = setTimeout(()=>{
									uni.navigateBack();
									
									timer = null;
								}, 300);
							}
						})
					}).catch(err => {
						uni.hideLoading();
						// 重置步骤
						this.step = 1;
						this.text = '请校验手势';
						uni.showToast({
							icon: "none",
							title:  err.errMsg,
						})
					})
				
			},
			// 知道密码的前提下，修改二级密码
			changePassword(newPwd){
				let params = {
					oldPwd: this.$store.state.secondaryPwd,
					newPwd: newPwd
				}
				uni.showLoading();
				service.changeSecondaryPwd(params).then(res=>{
					uni.hideLoading();
					this.title = "密码管理";
					this.text = '手势设定完成';
					// 清空密码值
					this.password = [];
					// 重置步骤
					this.step = 1;
					// 重置模式为空 
					this.setStatus = "";
					// 同步密码到vuex
					this.SET_SECONDARYPWD(newPwd);
					this.SET_PASSWORD_CHECKSTATUS(true);
					uni.showToast({
						icon: "none",
						title:  "二级密码修改成功"
					})
				}).catch(err => {
					uni.hideLoading();
					// 重置步骤
					this.step = 1;
					this.text = '请先进行手势验证';
					uni.showToast({
						icon: "none",
						title:  err.errMsg,
					})
				})
			},
			// 忘记密码，重新设置密码
			reSetPassword(newPwd){
				let params = {
					phoneNum: this.phone,
					authCode: this.code,
					newPwd: newPwd
				}
				uni.showLoading();
				service.forgetSecondaryPwd(params).then(res=>{
					uni.hideLoading();
					this.text = '手势设定完成';
					// 清空密码值
					this.password = [];
					// 重置步骤
					this.step = 1;
					// 同步密码
					this.SET_SECONDARYPWD(password);
					uni.showToast({
						icon: "none",
						title:  "二级密码重置成功"
					})
				}).catch(err => {
					uni.hideLoading();
					// 重置步骤
					this.step = 1;
					this.text = '请设定手势';
					uni.showToast({
						icon: "none",
						title:  err.errMsg,
					})
				})
			},
			// 获取用户设定的二级密码
			getSetedPassword(){
				let secondaryPwd = this.$store.state.secondaryPwd;
				if(secondaryPwd) {
					// 已经设定密码
					this.text = this.mode === "set" ? '' : '请校验手势';
				} else {
					// 用户可能尚未设定密码
					uni.showToast({
						icon: "none",
						title:  "您尚未设定手势密码，请进行设定",
					})
					this.text = '请设定手势';
				}
			},
			// 更多操作
			showMore(){
				this.errCount = 0;
				uni.showActionSheet({
					itemList:["修改密码", "忘记密码"],
					success: (res) => {
						// 重置步骤
						this.step = 1;
						this.password = [];
						this.error = "";
						if(res.tapIndex === 0) {
							// 修改密码
							this.title = "修改密码";
							this.text = "请先进行手势验证";
							this.setStatus = "change";
						} else if (res.tapIndex === 1) {
							// 忘记密码
							this.title = "忘记密码";
							this.text = "请设定手势";
							this.setStatus = "forget";
							// 打开modal
							this.showModal = true;
						}
					},
					fail: function (res) {
						console.log(res.errMsg);
					}
				})
			},
			// 关闭modal
			closeModal(){
				this.showModal = false;
			},
			// 获取验证码
			getsmscode() {
				// 定义校验列表
				const checkList = [
					{
						name: "phone",
						rules: [
							{
								checkType: "notnull",
								name: "phone",
								errorMsg: "请输入手机号"
							},{
								checkType: "phoneno",
								name: "phone",
								errorMsg: "请输入正确的手机号"
							}
						]
					}
				];
				// 校验数据
				let isUserInvalid = false;
				_.forEach(checkList, (item) => {
					const isValid = this.isValidFn(item.name, item.rules);
					if (!isValid) {
					    uni.showToast({
					        icon: 'none',
					        title: util.graceChecker.error
					    });
						isUserInvalid = true;
					    return false;
					}
				});
				if( isUserInvalid ) {
					return 
				}
				
				if(this.smsbtn.status) {
					const parms = {
						phone: this.phone
					} 
					service.getSms(parms).then(res => {
						uni.showToast({
							icon: 'none',
							title: '验证码已发送,请注意查收!',
						});
						this.timerId = setInterval(() => {
							this.smsbtn.status = false;
							var codeTime = this.smsbtn.codeTime;
							codeTime--;
							this.smsbtn.codeTime = codeTime;
							this.smsbtn.text = codeTime + "S";
							if (codeTime < 1) {
								clearInterval(this.timerId);
								this.smsbtn.text = "重新获取";
								this.smsbtn.codeTime = 60;
								this.smsbtn.status = true;
							}
						},
						1000);
					}).catch((err)=>{
						// 请求失败
						uni.showToast({
							icon: 'none',
							title: err.errMsg,
						});
						return;
					});
				}
			},
			// 校验数据是否合法
			isValidFn(name, rules){
				let data = {};
				data[name] = this[name];
				return util.graceChecker.check(data, rules);
			},
		},
		onLoad(option) {
			this.mode = option.mode;
			this.initTitle();
			// 查看是否已经设置密码
			this.getSetedPassword();
		}
	}
</script>

<style lang="scss">
	page{
		width: 100%;
		height: 100% !important;
	}
	.gestureLockPage{
		.error{
			color: #f41e28;
		}
		.more{
			width: 100%;
			height: 60upx;
			margin-top: 100upx;
			text-align: center;
			color: #1358f1;
			position: absolute;
			bottom: 100upx;
		}
		.input-wrap{
			padding-bottom: 40upx;
			.input-item{
				width: calc(100% - 30upx);
				height: 80upx;
				padding: 10upx 30upx 10upx 0upx; 
				margin-left: 30upx;
				border-bottom: 1px solid #f0f0f0;
				justify-content: center;
				align-items: center;
				box-sizing: border-box;
				input{		
					width: 100%;
					height: 100%;
					border:none;
				}
				&.has-label-right{
					.label-right{
						width: 240upx;
						height: 50upx;
						margin-left: 20upx;
						border: 1upx solid #999;
						display: flex;
						align-items: center;
						justify-content: center;
						navigator{
							width: 100%;
							text-align: right;
						}
						text{
							width: 100%;
							height: 100%;
							text-align: center;
							color: #333;
							line-height: 50upx;
						}
					}
					
				}
			}
		}
		.neil-modal__container{
			width: calc(100% - 100upx) !important;
			.notice{
				padding: 30upx;
				box-sizing: border-box;
				text-align: center;
			}
			.neil-modal__footer-right{
				background-color: #242424!important;
				color: #fff !important;
			}
		}
	}
</style>
