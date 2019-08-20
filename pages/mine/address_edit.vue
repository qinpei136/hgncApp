<template>
	<view class="addressManagementPage">
		<view class="input-group">
			<view class="uni-form-item uni-row">
                <view class="title uni-inline-item">收件人姓名：</view>
                <input class="uni-input uni-text-gray" v-model="receiver"/>
            </view>
			<view class="uni-form-item uni-row">
			    <view class="title uni-inline-item">手机号码：</view>
			    <input class="uni-input uni-text-gray" v-model="phone"/>
			</view>
			<view class="uni-flex uni-row address uni-form-item" @tap="showPicker">
			    <view class="title uni-inline-item">所在地区：</view>
			    <view class="uni-flex uni-flex-item uni-text-gray flex-right">
					<view class="pickerText uni-flex-item">
						{{pickerText}}
					</view>
					<view class="icon uni-inline-item uni-text-gray">
						<uni-icon type="arrowright" size="26"></uni-icon>
					</view>
			    </view>
			</view>
			<view class="uni-form-item uni-column address-detail">
			    <view class="title uni-inline-item">详细地址：</view>
			    <view class="textarea uni-text-gray">
			    	<textarea v-model="addresses" placeholder="街道,楼牌号等"/>
			    </view>
			</view>
		</view>
		<view class="uni-list-cell uni-list-cell-pd">
                <view class="uni-list-cell-db">设为默认地址</view>
                <switch @change="switchChange" :checked="isDefault"/>
            </view>
		<view class="save-btn btn-primary" @tap="save">
			<button>保&nbsp;存</button>
		</view>
		<view class="mpvue-picer">
			<mpvue-city-picker :themeColor="picker.themeColor" ref="mpvueCityPicker" :pickerValueDefault="picker.cityPickerValueDefault"
			 @onCancel="onCancel" @onConfirm="onConfirm"></mpvue-city-picker>
		</view>
	</view>
</template>

<script>
	import {	
		uniIcon,
		uniList,
		uniListItem,
	} from '@dcloudio/uni-ui';
	import _  from 'lodash';
	import { mapMutations, mapGetters, mapActions } from 'vuex';
	import service from '../../common/userService.js';
	import util from '../../common/util.js';
	// 三级联动
	import mpvueCityPicker from '../../components/mpvue-citypicker/mpvueCityPicker.vue'
	export default{
		components: {
			uniIcon,
			uniList,
			uniListItem,
			mpvueCityPicker,
		},
		data(){
			return {
				// 新增还是编辑
				mode: "eidt",
				// 地址id
				id: "",
				// 收件人姓名
				receiver: "",
				phone: "",
				isDefault: false,
				// 定位信息
				address: {
					// 国家
					country: "",
					// 省份
					province: "",
					// 城市
					city: "",
					// 区
					district: "",
					// 街道
					street: ""
				},
				// 详细地址
				addresses: "",
				cityPickerValueDefault: [0, 0, 1],
				picker: {
					cityPickerValueDefault: [0, 0, 1],
					pickerText: '',
					themeColor: '#000', // 颜色主题
				},
			}
		},
		computed:{
			pickerText(){
				return `${this.address.province} ${this.address.city} ${this.address.district}`
			},
			
		},
		methods:{
			// 注入vuex的方法
			...mapActions(['updataAddressList']),
			init(){
				// 
				// this.getLocation();
			},
			// 获取当前定位信息
			getLocation(){
				// #ifdef APP-PLUS
				// 使用h5+ api 可以直接获取中文位置信息
				uni.showLoading({
					title:"获取定位中..."
				})		
				plus.geolocation.getCurrentPosition((res)=>{
					uni.hideLoading();
					console.log(JSON.stringify(res));
					const address = res.address;
					this.address = {
						country: address.country,
						province: address.province,
						city: address.city,
						district: address.district,
						street: address.street
					};
					// this.addresses = res.addresses;
				}, (err)=>{
					uni.hideLoading();
					uni.showToast({
						title: err.message
					})
				})
				// #endif
			},
			// 三级联动
			showPicker() {
				this.$refs.mpvueCityPicker.show();
			},
			onCancel(e) {
				console.log(e);
				
			},
			onConfirm(e) {
				console.log(e);
				if(e) {
					// e label: "北京市-市辖区-西城区", value: Array(3), cityCode: "110102"
					let arr = e.label.split("-");
					this.address.province = arr[0];
					this.address.city = arr[1];
					this.address.district = arr[2];
				}
			},
			// 是否设置为默认
			switchChange(e){
				this.isDefault = e.detail.value
			},
			// 校验数据是否合法
			isValidFn(name, rules){
				let data = {};
				data[name] = this[name];
				return util.graceChecker.check(data, rules);
			},
			save(){
				// 定义校验列表
				const checkList = [{
						name: "receiver",
						rules: [
							{
								checkType: "notnull",
								name: "receiver",
								errorMsg: "收件人姓名不能为空"
							}
						]
					},{
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
						name: "addresses",
						rules: [
							{
								checkType: "notnull",
								name: "addresses",
								errorMsg: "详细地址不能为空"
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
				})
				if(isUserInvalid) {
					return
				}
				
				let params = {
					userId: this.$store.state.userId,
					id: this.id,
					province: this.address.province,
					city: this.address.city,
					region:  this.address.district,
					street:  "",
					detail:  this.addresses,
					receiver:  this.receiver,
					phone:  this.phone,
					default: this.isDefault ? 1 : 0,
					tag: "",
				}
				
				uni.showLoading();
				// 编辑或者新增
				service[`${this.mode}Address`](params).then(res=>{
					uni.hideLoading();
					if(res.data.code=="200")
					{
						uni.showToast({
							title: "收货地址已保存",
							success: function(){
								setTimeout(()=>{
									// 返回上一级页面
									uni.navigateBack()
								},800)
							}
						})	
						if(this.mode === "add"){
							// 清空信息
							this.addresses = "";
							this.receiver = "";
							this.phone = "";
							this.isDefault = false;
							this.address = {
								country: "",
								province: "",
								city: "",
								district: "",
								street: ""
							}
						}
						// 同步vuex修改后的数据
						this.updataAddressList();
					}
					else
					{
						uni.showToast({
							icon: "none",
							title: res.data.msg
						})
					}
					
				}).catch(err=>{
					console.log(err)
					uni.hideLoading();
					uni.showToast({
						icon: "none",
						title: err.message,
					})
				})
			},		
		},
		onBackPress() {
		  if (this.$refs.mpvueCityPicker.showPicker) {
		  	this.$refs.mpvueCityPicker.pickerCancel();
		    return true;
		  }
		},
		onUnload() {
			if (this.$refs.mpvueCityPicker.showPicker) {
				this.$refs.mpvueCityPicker.pickerCancel()
			}
		},	
		onLoad(option) {
			console.log(option); //打印出上个页面传递的参数。
			let title = option.mode === "edit" ? "地址编辑" : "新增地址";
			uni.setNavigationBarTitle({
				title: title
			});
			this.mode = option.mode;
			if(this.mode==="edit") {
				this.id = option.id;
				this.receiver = option.receiver;
				this.phone = option.phone;
				this.addresses = option.detail;
				this.isDefault = option.default == '0' ? false : true;
				console.log(this.isDefault)
				this.address = {
					country: "",
					province: option.province,
					city: option.city,
					district: option.region,
					street: ""
				}
			}	
			this.init()
		},
	}
</script>

<style lang="scss">
	page{
		width: 100%;
		height: 100%;
		background-color: #f5f5f5;
	}
	.addressManagementPage{
		.input-group{
			background-color: #fff;
			padding: 10upx 30upx 30upx;
			.uni-form-item{
				margin-top: 10upx;
				border-bottom: 1px solid #f5f5f5;
				.title{
					padding: 0;
					width: 180upx;
				}
			}
			.address{
				height: 88upx;
				justify-content: space-between;
				.pickerText {
					padding: 24upx;
					align-items: center;
					box-sizing: border-box;
				}
			};
			.address-detail{
				.title{
					margin-top: 20upx;
				}
				.textarea textarea{
					width: 100%;
					height: auto;
					height: 120upx;
				}
			}		
		}
		.uni-list-cell{
			background-color: #fff;
			margin-top: 20upx;
			padding-bottom: 20upx;
			box-sizing: border-box;
			&:after{
				background-color: #fff !important;
			}
		}
		.save-btn{
			width: 100%; 
			padding:0 30upx; 
			box-sizing: border-box;
		}
		.uni-text-gray{
			color: #666 !important;
		}
	}
</style>