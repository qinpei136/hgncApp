<template>
	<view class="goodsAddPage">
		<view class="img-view">
			<view class="image uni-inline-item">
				<sunUpImg :upImgConfig="upImgConfig" @onUpImg="upImgData" ref="uImage" />
			</view>	
		</view>
		<view class="input-group">
			<view class="uni-form-item uni-row">
                <view class="title uni-inline-item">标题：</view>
                <input class="uni-input uni-text-gray" placeholder="请输入商品标题" v-model="title"/>
            </view>
			<view class="uni-form-item uni-row uni-flex">
			    <view class="title uni-inline-item">M币价格：</view>
			    <input class="uni-input uni-text-gray" @input="updateVal" placeholder="请输入M币价格" v-model="mb"/>
				<view class="uni-inline-item text-color-gray uni-text-small">
					枚
				</view>
			</view>
			<view class="uni-form-item uni-row">
			    <view class="title uni-inline-item">价格：</view>
			    <input class="uni-input uni-text-gray" @input="updateVal" placeholder="请输入价格" v-model="price"/>
				<view class="uni-inline-item text-color-gray uni-text-small">
					元
				</view>
			</view>
			
			<view class="uni-form-item uni-row">
			    <view class="title uni-inline-item">分类：</view>
			    <view class="uni-flex uni-input uni-text-gray" @tap="showPicker">
			    	<view class="bank-info uni-flex-item">
			    		<text>{{typeName}}</text>
			    	</view>
			    	<view class="icon uni-inline-item">
			    		<uni-icon type="arrowright" size="20"></uni-icon>
			    	</view>
			    </view>
				<mpvue-picker class="uni-text-gray picker" ref="mpvuePicker" :mode="picker.mode" :deepLength="picker.deepLength" :pickerValueDefault="picker.pickerValueDefault"
				 :themeColor="picker.themeColor" @onConfirm="onConfirm"
				 :pickerValueArray="picker.pickerValueArray"></mpvue-picker>
			</view>
			<view class="uni-form-item uni-row">
			    <view class="title uni-inline-item">商品图片：</view>
				<view class="img-view">
					<view class="image uni-inline-item">
						<sunUpImg :upImgConfig="upImgConfig1" @onUpImg="upImgData" ref="uImage" />
					</view>	
				</view>
			</view>
			<view class="uni-form-item uni-row detail">
			    <view class="title uni-inline-item">商品描述：</view>
				<textarea class="uni-input uni-flex-item notice" v-model="detail" maxlength="500" placeholder="请输入商品描述..."/>
			</view>
			<view class="uni-btn-v">
				<button @click="save(false)" class="btn1">放入仓库</button>
				<button @click="save(true)" class="btn">上架出售</button>
			</view>
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
	import userService from '../../common/userService.js';
	import util from '../../common/util.js';
	import sunUpImg from '../../components/sunui-upimg/sunui-upimg-logo.vue'
	import mpvuePicker from 'mpvue-picker';
	// 三级联动
	import mpvueCityPicker from '../../components/mpvue-citypicker/mpvueCityPicker.vue'
	export default{
		components: {
			uniIcon,
			uniList,
			uniListItem,
			mpvueCityPicker,
			sunUpImg,
			mpvuePicker,
			
		},
		data(){
			return {
				upImgConfig:{
					imgTitle:"商品图片",
					imgName:"imageUrl",
					required:false,
					url:""
				},
				upImgConfig1:{
					imgTitle:"详情图片",
					imgName:"detailImages",
					required:false,
					url:""
				},
				imageUrl:"",
				shopId:"",
				title:"",
				price:"",
				mb:"",
				typeId:"",
				typeName:"请选择",
				detailImages:"",
				detail:"",
				// 新增还是编辑
				mode: "add",
				id: "",
				picker: {
					deepLength: 1, // 几级联动
					pickerValueDefault: [], // 初始化值
					pickerValueArray: [], // picker 数组值
					pickerText: '请选择',
					themeColor: '#000', // 颜色主题
				},
			}
		},
		computed:{
			
		},
		methods:{
			init(){
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
			//选择分类
			showPicker() {
				this.$refs.mpvuePicker.show();
			},
			//获取上传图片返回来的数组(Step1)
			async upImgData(e) {
				this[e.name]=e.value
			},
			updateVal(e)
			{
				this.mb=e.detail.value
				this.price=e.detail.value
			},
			getShopType(){
				// 获取分类列表
				uni.showLoading();
				let params={"shopId":this.shopId}
				userService.getShopType(params).then(res=>{
					uni.hideLoading();
					if(res.data.code=="200")
					{
						let data = res.data.result;
						if(data.length > 0) {
							if(this.typeId=="")
								this.typeId = data[0].a.id;
							for(var i in data)
							{
								if(data[i].a.id==this.typeId)
									this.typeName = data[i].a.typeName;
								this.picker.pickerValueArray.push({label:data[i].a.typeName,value: data[i].a.id})
							}
						} 
					}
							
				}).catch(err=>{
					uni.hideLoading();
					uni.showToast({
						icon: "none",
						title: err.errMsg,
					})
				})
			},
			getShopGoods(){
				// 获取分类列表
				uni.showLoading();
				let params={"id":this.id}
				userService.getShopGoodById(params).then(res=>{
					uni.hideLoading();
					if(res.data.code=="200")
					{
						let data = res.data.result;
						this.title=data.title,
						this.price=data.price,
						this.mb=data.mb,
						this.typeId=data.typeId,
						this.imageUrl="default",
						this.detailImages="default",
						this.detail=data.detail
						this.upImgConfig.url=util.getImageUrl(data.imageUrl)
						this.upImgConfig1.url=util.getImageUrl(data.detailImages)
					}
							
				}).catch(err=>{
					uni.hideLoading();
					uni.showToast({
						icon: "none",
						title: err.errMsg,
					})
				})
			},
			showPicker() {
				this.$refs.mpvuePicker.show();
			},
			onCancel(e) {
				console.log(e);
				
			},
			onConfirm(e) {
				if (e && e.label) {
					this.typeName = e.label;
					this.typeId = e.value[0];
				}
			},
			// 校验数据是否合法
			isValidFn(name, rules){
				let data = {};
				data[name] = this[name];
				return util.graceChecker.check(data, rules);
			},
			save(listing){
				let params={
					"ShopId":this.shopId,
					"Title":this.title,
					"Price":this.price,
					"MB":this.mb,
					"TypeId":this.typeId,
					"ImageUrl":this.imageUrl,
					"DetailImages":this.detailImages,
					"detail":this.detail,
					"Listing":listing
				}
				uni.showLoading();
				let tips="商品添加成功"
				if(this.id)
				{
					this.mode="update"
					tips="商品修改成功"
				}
				else
					this.mode="add"
				// 编辑或者新增
				userService[`${this.mode}ShopGoods`](params,this.id).then(res=>{
					uni.hideLoading();
					if(res.data.code=="200")
					{
						uni.showToast({
							title: tips,
							success: function(){
								setTimeout(()=>{
									// 返回上一级页面
									uni.navigateBack()
								},800)
							}
						})	
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
			this.shopId = option.shopId;
			if(option.goodsId!="undefined") {
				this.id = option.goodsId;
				uni.setNavigationBarTitle({
					title: "修改商品"
				});
				this.getShopGoods()
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
	.goodsAddPage{
		width: 100%;
		.img-view{
			background-color: #fff;
			margin-bottom:20upx;
			.image {
				padding:20upx 0upx;
				width: 184upx;
				height: 184upx;
				margin:auto;
				uni-view{
					width: 100%;
				}
				image {
					width: 100%;
					height: 100%;
				}
			}
		}
		
		
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
				picker{
					width: 100%;
					text-align: right;
					color: #888;
					uni-input{
						color: #888 !important;
					}
				}
			}
			.detail{
				height: 250upx;
				textarea{
					height: 240upx;
				}
			}
			
			.uni-btn-v {
				width: 100%;
				height: 140upx;
				display: flex;
			
				.btn1 {
					// background: #242424;
					width: 50%;
					// color: #fff;
					border-radius: 2upx;
					margin: auto;
				}
				.btn {
					background: #242424;
					width: 50%;
					color: #fff;
					border-radius: 2upx;
					margin: auto;
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