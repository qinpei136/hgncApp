<template>
	<!-- 佣金管理 -->
	<view class="commissionsManagementDetailPage">
		<view class="place-bar">
			
		</view>
		<!-- 银行卡 -->
		<view class="bank uni-flex" @tap="showPicker">
			<view class="image uni-inline-item">
				<image src="imageUrl" mode="widthFix"></image>
			</view>
			<view class="bank-info uni-flex-item">
				<text>{{picker.pickerText}}</text>
			</view>
			<view class="icon uni-inline-item">
				<uni-icon type="arrowright" size="20"></uni-icon>
			</view>
		</view>
		<mpvue-picker ref="mpvuePicker" :mode="picker.mode" :deepLength="picker.deepLength" :pickerValueDefault="picker.pickerValueDefault"
		 :themeColor="picker.themeColor" @onChange="onChange" @onConfirm="onConfirm" @onCancel="onCancel"
		 :pickerValueArray="picker.pickerValueArray"></mpvue-picker>
		<!-- 提现金额 -->
		<view class="money">
			<view class="text-color-gray uni-text-small">
				提现金额
			</view>
			<view class="input-box uni-flex">
				<text class="uni-inline-item symbol">￥</text>
				<input class="uni-input uni-flex-item" type="number" v-model="money" :placeholder="placeholder"/>
				<view class="all uni-inline-item uni-bold" @tap="withdrawAll">
					全部提现
				</view>
			</view>
			<view class="uni-text-small">
				已赚取￥{{earned}}，可提现￥{{canDraw}}
			</view>
		</view>
		
		<view class="btn">
			<button type="primary" class="next" :class="{'disabled': disabled}" :disabled="disabled" @tap="submit">申请提现</button>
		</view>
	</view>
</template>

<script>
	import {
		uniIcon
	} from '@dcloudio/uni-ui';
	import mpvuePicker from 'mpvue-picker';
	export default {
		components:{
			uniIcon,
			mpvuePicker
		},
		data() {
			return {
				// 姓名
				name: "",
				// 卡号
				card: "",
				// 已赚取
				earned: 0,
				// 可提现
				canDraw: 0,
				// 输入金额
				money: "",
				// 银行图标
				imageUrl: "",
				// 银行列表
				bankData: [],
				picker: {
					mode: 'selector',
					deepLength: 1, // 几级联动
					pickerValueDefault: [], // 初始化值
					pickerValueArray: [], // picker 数组值
					pickerText: '武汉',
					themeColor: '#000', // 颜色主题
				},
			}
		},
		computed:{
			disabled(){
				return this.money === "";
			},
			placeholder(){
				return `最多提现￥${this.canDraw}`;
			}
		},
		methods:{
			init(){
				this.name = "招商银行";
				this.card = "4533";
				this.earned = 8888.99;
				this.canDraw = 88.99;
				this.picker.pickerText = `${this.name}（ ${this.card}）`;
				this.picker.pickerValueArray = [{
					label: "招商银行（3242）",
					value: 0
				},{
					label: "民生银行（6242）",
					value: 2
				},{
					label: "工商银行（8742）",
					value: 3
				}]
			},
			//选择银行
			showPicker() {
				this.$refs.mpvuePicker.show();
			},
			onConfirm(e) {
				console.log(e);
				if (e && e.label) {
					this.picker.pickerText = e.label;
				}
			},
			onChange(e) {
				console.log(e);
			},
			onCancel(e) {
				console.log(e);
			},
			// 全部提现
			withdrawAll(){
				this.money = this.canDraw;
			},
			// 申请提现
			submit(){
				if(this.money - 0 > this.canDraw - 0) {
					uni.showToast({
						icon:"none",
						title: `最多可提现￥${this.canDraw}`
					})
					return
				}
				
				// 提现接口
			}
			
		},
		onLoad() {
			this.init();
		}
	}
</script>

<style lang="scss">
	page {
		width: 100%;
		height: 100%;
		background-color: #f0f0f0;
	}
	.commissionsManagementDetailPage{
		width: 100%;
		.bank{
			width: 100%;
			height: 98upx;
			padding: 0 30upx;
			box-sizing: border-box;
			margin-bottom: 30upx;
			background-color: #fff;
			align-items: center;
			.image{
				width: 68upx;
				height: 68upx;
				border-radius: 50%;
				margin-right: 70upx;
				box-shadow: 1upx 1upx 6upx 4upx #f0f0f0;
				image{
					width: 100%;
					height: 100%;
				}
			}
		}
		.money{
			width: 100%;
			padding: 20upx 30upx;
			box-sizing: border-box;
			background-color: #fff;
			.input-box{
				margin-bottom: 10upx;
				padding: 20upx 0;
				box-sizing: border-box;
				border-bottom: 1upx solid #f0f0f0;
				.symbol{
					margin-right: 10upx;
					font-size: 38upx;
				}
				.uni-input{
					font-size: 32upx;
					font-weight: 600;
					.input-placeholder{
						color: #aaa !important;
						font-weight: 100 !important;
					}
				}
				.all{
					color: #037ff9;
					font-size: 30upx;
				}
			}
		}
		.btn{
			margin-top: 50upx;
			padding: 0 30upx;
			box-sizing: border-box;
			.next{
				background-color: #242424;
				color: #fff;
				&.disabled{
					background-color: #9d9d9d;
				}
			}
		}
	}
</style>
