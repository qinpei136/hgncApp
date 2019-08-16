<template>
	<view class="pwdPage common-pa-30">
		<view class="page-title uni-h4">重置密码</view>
	    <view class="content">
	    	<view class="input-wrap">
	    		<view class=" input-item">
	    			<input type="number" maxlength="11" v-model="pwdData.phone" placeholder="请输入手机号" class="is-input1 " data-val="phone" />
	    		</view>
	    		<view class="input-item has-label-right uni-flex">
	    			<input type="number" class="input-left" placeholder="短信验证码" v-model="pwdData.code" />
	    			<view class="label-right" @tap="getsmscode">
	    				<text :style="{color:smsbtn.status?'#333':'#999'}">{{smsbtn.text}}</text>
	    			</view>
	    		</view>
	    		<view class="input-item">
	    			<input placeholder="请输入新密码" type="password" v-model="pwdData.password" maxlength="16"/>
	    		</view>
	    		<view class="input-item">
	    			<input placeholder="确认密码" type="password" v-model="pwdData.password1" maxlength="16"/>
	    		</view>
	    	</view>
	    	<view class="btn-primary">
	    		<button @tap="reSetPwd">重置密码</button>
	    	</view>
	    </view>
	</view>
</template>

<script>
	import _  from 'lodash';
	import service from '../../common/userService.js';
	import util from '../../common/util.js';
	export default {
		data() {
			return {
				pwdData: {
					phone:"",
					password:"",
					password1:"",
					code: ""
				},
				smsbtn: {
					text: '获取验证码',
					status: true,
					codeTime: 60
				},
				timerId: null,
			}
		},
		methods:{
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
					const isValid = this.isValidFn(item.name, item.rules, "pwdData");
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
						phone: this.pwdData.phone
					} 
					service.getSms(parms).then(res => {
						if(res.data && res.data.status === 200) {
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
						} else {
							uni.showToast({
								icon: 'none',
								title: res.data.errmsg,
							});
							return;
						}
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
			isValidFn(name, rules, dataType){
				let data = {};
				data[name] = this[dataType][name];
				return util.graceChecker.check(data, rules);
			},
			// 重置密码
			reSetPwd(){
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
					},{
						name: "code",
						rules: [
							{
								checkType: "notnull",
								name: "code",
								errorMsg: "短信验证码不能为空"
							}
						]
					},{
						name: "password",
						rules: [
							{
								checkType: "notnull",
								name: "password",
								errorMsg: "请输入新密码"
							}
						]
					},{
						name: "password1",
						rules: [
							{
								checkType: "notnull",
								name: "password1",
								errorMsg: "确认密码不能为空"
							},{
								checkType: "same",
								checkRule: this.pwdData.password,
								name: "password1",
								errorMsg: "两次密码输入不一致"
							}
						]
					}
				];
				// 校验数据
				let isUserInvalid = false;
				_.forEach(checkList, (item) => {
					const isValid = this.isValidFn(item.name, item.rules, "pwdData");
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
				
				// 请求重置密码接口
				const parms = {
					phone: this.pwdData.phone,
					pwd: _.trim(this.pwdData.password),
					code: this.pwdData.code,
				}
				uni.showLoading({title: '重置中'});
				service.reSetPwd(parms).then(res => {
					uni.hideLoading();
					if(res.data.status === 200) {
						util.alert({
							title:'重置密码',
							content: res.data.data, 
							success: () => {
								// 跳转至登录页面？把手机号密码带过去？
// 								uni.redirectTo({
// 									url: `./login?phone=${this.pwdData.phone}&password=${this.pwdData.password}`
// 								})	
								uni.navigateBack()
							} 
						})
					} else {
						// 登录失败
						uni.showToast({
							icon: 'none',
							title: res.data.msg,
						});
						return;
					}
				}).catch((err)=>{
					uni.hideLoading();
                    // 请求失败
					uni.showToast({
						icon: 'none',
						title: err.errMsg,
					});
					return;
                })
			},
		}
		
	}
</script>

<style lang="scss">
	.pwdPage{
		padding-top: 120upx;
		.content{
			margin-top:30upx;
			.input-wrap{
				.input-item{
					width: 100%;
					height: 80upx;
					padding-top: 30upx; 
					border-bottom: 1px solid #999;
					justify-content: center;
					align-items: center;
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
		}
	}
</style>
