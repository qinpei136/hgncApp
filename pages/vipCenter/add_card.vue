<template>
	<!-- 添加银行卡 -->
	<view class="addCardPage">
		<view class="title">
			请添加<text class="name">{{name}}</text>的银行卡
		</view>
		<view class="input-box uni-row uni-flex">
			<view class="label uni-inline-item">
				卡号
			</view>
			<input class="uni-input uni-flex-item" type="idcard" v-model="card" placeholder="请输入银行卡卡号"/>
		</view>
		<view class="btn">
			<button type="primary" class="next" :class="{'disabled': disabled}" :disabled="disabled" @tap="add">下一步</button>
		</view>
	</view>
</template>

<script>
	
	export default {
		components:{
			
		},
		data() {
			return {
				// 姓名
				name: "",
				// 卡号
				card: ""
			}
		},
		computed:{
			disabled(){
				return this.card === "";
			}
		},
		methods:{
			init(){
				this.name="奥斯卡"
			},
			// 添加银行卡
			add(){
				// uni.showLoading({})
				uni.showToast({
					title: "添加成功"
				})
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
	.addCardPage{
		width: 100%;
		.title{
			width: 100%;
			height: 88upx;
			line-height: 88upx;
			padding-left: 30upx;
			background-color: #f0f0f0; 
			box-sizing: border-box;
			color: #666;
			.name{
				color: #333;
				font-weight: 600;
				padding: 0 10upx;
				box-sizing: border-box;
			}
		}
		.input-box{
			width: 100%;
			background-color: #fff; 
			padding-left: 30upx;
			box-sizing: border-box;
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