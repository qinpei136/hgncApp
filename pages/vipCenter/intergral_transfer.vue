<template>
	<!-- 积分转让 -->
	<view class="intergralTransferPage">
		<!-- 头部 -->
		<view class="header uni-flex">
			<view class="left uni-flex-item flex-center-center">
				<view class="icon"></view>
				<view class="vertical-line"></view>
				<view class="text">
					<view class="top uni-text-small text-color-gray">
						我的积分
					</view>
					<view class="bottom uni-bold">
						{{jfValue}}
					</view>
				</view>
			</view>
			<view class="right uni-flex-item flex-center-center">
				<view class="icon"></view>
				<view class="vertical-line"></view>
				<view class="text">
					<view class="top uni-text-small text-color-gray">
						M币钱包(枚)
					</view>
					<view class="bottom uni-bold">
						{{mbValue}}
					</view>
				</view>
			</view>
		</view>
		<view class="place-bar-20" style="height: 16upx;"></view>
		<view class="content">
			<!-- 提示 -->
			<view class="notice" v-if="isShowNotice">
				<view class="icon info flex-center-center">
					<uni-icon type="info"></uni-icon>
				</view>
				<view class="text">
					所有积分转让都是不可逆转的，请慎重操作。
				</view>
				<view class="close" @tap="closeNotice">
					<uni-icon type="closeempty" size="28"></uni-icon>
				</view>
			</view>
			<!-- 输入框 -->
			<view class="input-group">
				<form @submit="formSubmit">
					<view class="uni-h4 uni-bold">
						M币转让
					</view>
					<view class="uni-form-item uni-row uni-flex" :class="isNumInvaild?'error':''">
						<view class="title uni-inline-item text-color-gray">转让的M币数量:</view>
						<input class="uni-input uni-flex-item" type="number" v-model="num" name="num" />
						<view class="uni-inline-item text-color-gray uni-text-small">
							枚
						</view>
					</view>
					<!-- 错误提示 -->
					<view class="invaild" v-if="isNumInvaild">
						<view class="uni-text-small">
							余额不足请输入正确数字
						</view>
						<view class="icon">
							<uni-icon type="info" size="18"></uni-icon>
						</view>
					</view>
					<view class="uni-form-item uni-row uni-flex">
						<view class="title uni-inline-item text-color-gray">转入的会员ID:</view>
						<input class="uni-input uni-flex-item" v-model="id" name="id" />
					</view>
					<view class="uni-btn-v" v-bind:style="{top: positionTop + 'px'}">
						<button formType="submit" class="btn">确认转出</button>
					</view>
				</form>
			</view>
		</view>
	</view>
</template>

<script>
	import { uniIcon } from '@dcloudio/uni-ui';
	import userService from '../../common/userService.js';
	export default {
		components:{
			uniIcon
		},
		data() {
			return {
				// 是否展示提示
				isShowNotice: true,
				// 我的积分
				jfValue: 0,
				// M币钱包
				mbValue: 0,
				// 转让数量
				num: "",
				// 转入会员id
				id: "",
				positionTop: 0
			}
		},
		computed:{
			isNumInvaild(){
				return this.mbValue - 0 < this.num - 0
			}
		},
		methods: {
			init(){
				// 获取我的积分
				let userinfo = uni.getStorageSync('USERS_INFO')
				this.jfValue=userinfo.tuser.comPoint
				this.mbValue=userinfo.tuser.gold
			},
			initPosition() {
			    /**
			     * 使用 absolute 定位，并且设置 bottom 值进行定位。软键盘弹出时，底部会因为窗口变化而被顶上来。
			     * 反向使用 top 进行定位，可以避免此问题。
			     */
			    this.positionTop = uni.getSystemInfoSync().windowHeight - 80;
			},
			// 获取用户积分信息
			getUserInfo(){
				
			},
			// 关闭提示
			closeNotice() {
				this.isShowNotice = false;
			},
			// 确认转出
			formSubmit(e){
				 if(e.detail.value.num === "") {
					 // uni.showToast({
					 // 	icon: "none",
					 // 	title:  "请输入转让的M币数量”,
					 // });
					 return
				 }
				 if(e.detail.value.id === "") {
					 // uni.showToast({
					 // 	icon: "none",
					 // 	title:  "请输入转入的会员ID”,
					 // })
					 return
				 }
				 if(this.isNumInvaild) {
					 // uni.showToast({
					 // 	icon: "none",
					 // 	title:  "M币必须为数字”,
					 // })
				 	return
				 }
				 // 转让
				 this.transferScore();
			},
			// 积分转让
			transferScore(){
				let params = {
					to: this.id,
					count: this.num
				}
				uni.showLoading();
				userService.transferScore(params).then(res=>{
					uni.hideLoading();
					uni.showToast({
						title:  "转让成功",
					})
				}).catch(err => {
					uni.hideLoading();
					uni.showToast({
						icon: "none",
						title:  err.errMsg,
					})
				})
			}
		},
		onLoad() {
			this.init();
			this.initPosition();
		}
	}
</script>

<style lang="scss">
	pages{
		width: 100%;
		height: 100%;
	}
	.intergralTransferPage{
		width: 100%;
		height: 100%;
		.header{
			width: 100%;
			height: 160upx;
			.uni-flex-item{
				.icon{
					background-size: 100%; 
				}
				.vertical-line{
					width: 4upx;
					height: 20upx;
					background-color: #999;
					margin: 0 30upx;
				}
				.text{
					.bottom{
						color: #1358ef; 
					}
				}
			}
			.left{
				border-right: 2upx solid #f0f0f0;
				width: 81upx;
				.icon{
					width: 81upx;
					height: 81upx;
					background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFEAAABRCAMAAACdUboEAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3FpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpjZDQzYTE4Yi0yODVjLTJhNDUtYjQ0Ny1jNzhhZTI1NDc1NTkiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NzU4NDk3NUU1Q0M4MTFFOTk1Mzg4QTk0M0MxMTUxRDciIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NzU4NDk3NUQ1Q0M4MTFFOTk1Mzg4QTk0M0MxMTUxRDciIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOmNkNDNhMThiLTI4NWMtMmE0NS1iNDQ3LWM3OGFlMjU0NzU1OSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpjZDQzYTE4Yi0yODVjLTJhNDUtYjQ0Ny1jNzhhZTI1NDc1NTkiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz5TYfP8AAADAFBMVEXpvUH+5Yr++ev99Nr88tP6yC314antwTvqvTzesDH7zkrUohzcsUHw3KT047X9zjj+8sr8xy7crCz7xjLx2pnlsR36ykL91Un20lX+5qP97LzzyCTyxkz6xS361mTPmhL1yirjrhjxxR3oujb1yUr901z//fj/1kX/10b//PX/21T0wjXtyWT5zVH+1EL93YP1133svjX8yDD94pP934n92nj81mv9+vH8yTnuzXHYoxXRnBbswUf60jn+1kf2x0HlsiHu1ZXpy3r+6rPhrBf41FbaqSb+3F7+9uHYpRz9zDb57szXpSH2zC3eqRbgsTH9yjPksBruxU3+0j/VoBT9yzT50Dbsw1H1ylH62WXhu1X1yEL3zTDqui3bqR73zjL/+OTyxyH10VvltjXftkr+0DzzzVb47tXyyUrrxl7xxUf0yUXotiX7yDj/32Thrhz+6az1zULw04Hxwj3yyE3muTv+3WH+00D2zUn91kP8yDT//v360kzdqyD8yjz7yTvhsijerST036Pv0XnqwEr8zUb0yU3luDD711j910f90FL40EvswUT25rnWohbxy1fWpijoti7hszTntCH+78X+5J361Ev91Ub81D/vyEr8yTH0x0ftwkjjtS3Snhf/2Un////8xi3krxjOmRLwxBvgqxfWoRTdqBbZpBXRnBPuzW7apRXSnRPcpxb468XTnhPrwEP/2Ef+0Dv/2Uj///7+2Ej/2k/krxn+1EH+0T7xx1D71k/mtCfPmxTnty/81UD8yTf923v93H//+/Hmx3LmtSj7y0LzzlrfuVP89+n26cT10Wv/657VoBbQmxPvxkL56r/57Mj/997bphX92En0zk/ouTHruzXsuzL+7sDZqjH++/Ptw0D/2EnuxUb4wivyyk/700f71Eb10FPvwT/wxUDvz3P+1UP4xznZpBb/7KXbphbbqSTvyVPjszDjtCvhryXmsyz+21f82V7+3FnisCb4zlXlsyT4ySz202D6y0b51FL90VfltzL93GT52XrXqTCtAAAHAElEQVR42qTZd0ATVxgA8BgQFJQgGhARg4ABBKKBiKggS4KgIsMguBAVZ1vcCFRQrNatFUcZ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");
				}
			}
			.right{
				.icon{
					width: 81upx;
					height: 79upx;
					background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABPCAMAAABLT7LRAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3FpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpjZDQzYTE4Yi0yODVjLTJhNDUtYjQ0Ny1jNzhhZTI1NDc1NTkiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QkYzQTYxOUI1Q0M4MTFFOThGMEJBQkZGODdDODBBNkMiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QkYzQTYxOUE1Q0M4MTFFOThGMEJBQkZGODdDODBBNkMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOmNkNDNhMThiLTI4NWMtMmE0NS1iNDQ3LWM3OGFlMjU0NzU1OSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpjZDQzYTE4Yi0yODVjLTJhNDUtYjQ0Ny1jNzhhZTI1NDc1NTkiLz4gPC9y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");
				}
			}
		}
		.content{
			width: 100%;
			padding: 20upx 30upx;
			box-sizing: border-box;
			.notice{
				width: 100%;
				height: 64upx;
				background-color: #f9a315;
				border-radius:4upx;
				color: #fff;
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding: 0 10upx;
				box-sizing: border-box;
				box-shadow:  2upx 2upx 16upx 0upx #f9a315;
				.info{
					background-color: #fff;
					border-radius: 50%;
					.uni-icon {
						color: #f9a315;
						width: 36upx;
						height:36upx;
						display: flex;
						align-items: center;
						justify-content: center;
						overflow: hidden;
						&::before{
							font-size: 50upx;
						}
					}
				}
				.text{
					font-size: 26upx;
				}
			}
			.input-group{
				padding-top: 30upx;
				.uni-h4 {
					margin-bottom: 30upx;
				}
				.uni-form-item{
					align-content: center;
					border-bottom: 1upx solid #f0f0f0;
					&.error{
						border-bottom: 1upx solid #f41e28;
					}
					.title{
						padding: 0;
						
					}
				}
				.invaild{
					color: #f41e28;
					display: flex;
					align-items: center;
					justify-content: space-between;
					.icon{
						background-color: #f41e28;
						border-radius: 50%;
						.uni-icon {
							color: #f0f0f0;
							width: 22upx;
							height:22upx;
							display: flex;
							align-items: center;
							justify-content: center;
							overflow: hidden;
							&::before{
								font-size: 36upx;
							}
						}
					}
				}
				.uni-btn-v{
					width: calc(100% - 60upx);
					position: absolute;
					font-size: 30upx;
					top: 0upx;
					left: 30upx;
					z-index: 1000;
					.btn{
						background: #242424;
						color: #fff;
						border-radius: 2upx;
					}
				}
			}
		}
	}
</style>
