<template>
	<view class="pwdPage common-pa-30">
		<view class="uni-h4">二级密码说明</view>
		<view class="page-title uni-h5">本文介绍M+二级密码设置，一般游戏总是会有一些盗号，融装备等等的事情发生，为了你的账号更安全，你可以看看看这篇文章，并设置二级密码，让你的账号更安全，下面来看看吧。</view>
	    <view class="content">
	    	<view class="input-wrap">
	    		<view class="input-item has-label-right uni-flex">
	    			<input type="number" class="input-left" placeholder="短信验证码" v-model="pwdData.code" />
	    			<view class="label-right" @tap="getsmscode">
	    				<text :style="{color:smsbtn.status?'#333':'#999'}">{{smsbtn.text}}</text>
	    			</view>
	    		</view>
	    	</view>
			<view class="uni-h4 view-title">设置二级密码</view>
			<view>
				<view class="view-pwd">
					<input id="pwd1" type="number" maxlength="1" class="input-pwd" v-model="pwdData.pwd1" @input="nextFocus('pwd2','')"/>
					<input id="pwd2" type="number" maxlength="1" class="input-pwd" v-model="pwdData.pwd2" @input="nextFocus('pwd3','pwd1')"/>
					<input id="pwd3" type="number" maxlength="1" class="input-pwd" v-model="pwdData.pwd3" @input="nextFocus('pwd4','pwd2')"/>
					<input id="pwd4" type="number" maxlength="1" class="input-pwd" v-model="pwdData.pwd4" @input="nextFocus('pwd5','pwd3')"/>
					<input id="pwd5" type="number" maxlength="1" class="input-pwd" v-model="pwdData.pwd5" @input="nextFocus('pwd6','pwd4')"/>
					<input id="pwd6" type="number" maxlength="1" class="input-pwd" v-model="pwdData.pwd6" @input="nextFocus('','pwd5')"/>
				</view>
			</view>
	    	<view class="btn-primary">
	    		<button @tap="reSetPwd">确认提交</button>
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
					code: "",
					pwd1:"",
					pwd2:"",
					pwd3:"",
					pwd4:"",
					pwd5:"",
					pwd6:""
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
				let userinfo = uni.getStorageSync('USERS_INFO')
				if(this.smsbtn.status) {
					const parms = {
						phone: userinfo.tuser.phone
					} 
					service.getSms(parms).then(res => {
						if(res.data && res.data.code === 200) {
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
								title: res.data.msg,
							});
							return;
						}
					}).catch((err)=>{
						// 请求失败
						uni.showToast({
							icon: 'none',
							title: err.message,
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
			nextFocus(nextName,preName){
				let name=nextName
				if(event.target.value=="")
				{
					name=preName
				}
				if(name!="")
				{
					let control=document.getElementById(name)
					let input=control.getElementsByTagName('input');
					input[0].focus()
				}
			},
			// 重置密码
			reSetPwd(){
				// 定义校验列表
				const checkList = [{
						name: "code",
						rules: [
							{
								checkType: "notnull",
								name: "code",
								errorMsg: "短信验证码不能为空"
							}
						]
					},{
						name: "pwd1",
						rules: [
							{
								checkType: "notnull",
								name: "pwd1",
								errorMsg: "请输入新密码"
							}
						]
					},{
						name: "pwd2",
						rules: [
							{
								checkType: "notnull",
								name: "pwd2",
								errorMsg: "请输入新密码"
							}
						]
					},{
						name: "pwd3",
						rules: [
							{
								checkType: "notnull",
								name: "pwd3",
								errorMsg: "请输入新密码"
							}
						]
					},{
						name: "pwd4",
						rules: [
							{
								checkType: "notnull",
								name: "pwd4",
								errorMsg: "请输入新密码"
							}
						]
					},{
						name: "pwd5",
						rules: [
							{
								checkType: "notnull",
								name: "pwd5",
								errorMsg: "请输入新密码"
							}
						]
					},{
						name: "pwd6",
						rules: [
							{
								checkType: "notnull",
								name: "pwd6",
								errorMsg: "请输入新密码"
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
				
				// 设置二级密码接口
				let userinfo = uni.getStorageSync('USERS_INFO')
				const parms = {
					id: userinfo.tuser.id,
					phone: userinfo.tuser.phone,
					pwd: this.pwdData.pwd1+this.pwdData.pwd2+this.pwdData.pwd3+this.pwdData.pwd4+this.pwdData.pwd5+this.pwdData.pwd6,
					code: this.pwdData.code,
				}
				uni.showLoading({title: '提交中'});
				service.setSecondaryPwd(parms).then(res => {
					uni.hideLoading();
					if(res.data.code === 200) {
						util.alert({
							title:'密码管理',
							content: "设置成功", 
							success: () => {
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
						title: err.message,
					});
					return;
                })
			},
		}
		
	}
</script>

<style lang="scss">
	.pwdPage{
		padding-top: 60upx;
		.page-title{
			border-bottom:2upx solid #999;
			padding-bottom:20upx;
		}
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
			.view-title{
				margin-top: 60upx;
			}
			.view-pwd{
				display: flex;
				justify-content: space-between
			}
			.input-pwd{
				display: inline-block;
				border:2px solid #999;
				width: 90upx;
				height: 90upx;
				margin: 30upx 10upx 30upx 0upx;
				color: #0480FA;
				font-size: 56upx;
				text-align: center;
			}
		}
	}
</style>
