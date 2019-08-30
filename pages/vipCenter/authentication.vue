<template>
	<!-- 实名认证 -->
	<view class="setupStorePage">
		<form @submit="formSubmit">
			<view class="uni-h5 uni-bold">
				需提交审核资料
			</view>
			<!-- 姓名 -->
			<view class="uni-form-item uni-row uni-flex">
				<view class="title uni-inline-item text-color-gray">
					<text class="required">*</text>经营者姓名:
				</view>
				<input class="uni-input uni-flex-item" type="text" v-model="name" name="name" />
			</view>
			<view class="tips">
				（注意：必须与会员账号本人真实姓名一致）
			</view>

			<!-- 身份证 -->
			<view class="uni-form-item uni-row uni-flex">
				<view class="title uni-inline-item text-color-gray">
					<text class="required">*</text>身份证号码:
				</view>
				<input class="uni-input uni-flex-item" type="idcard" v-model="card" name="card" />
			</view>
			<view class="tips">
				（注意：必须与会员账号本人真实姓名一致）
			</view>

			<!-- 商家名称 -->
			<view class="uni-form-item uni-row uni-flex">
				<view class="title uni-inline-item text-color-gray">
					<text class="required">*</text>商家名称:
				</view>
				<input class="uni-input uni-flex-item" type="text" v-model="storeName" name="storeName" />
			</view>

			<!-- 性别 -->
			<view class="uni-form-item uni-row uni-flex gender">
				<view class="title uni-inline-item text-color-gray">
					<text class="required">*</text>性别:
				</view>
				<radio-group @change="radioChange" class="radio-group uni-flex-item uni-flex">
					<label class="uni-list-cell flex-center-center" v-for="(item, index) in genderList" :key="item.value">
						<view>
							<radio :value="item.value" :checked="index === current" />
						</view>
						<view>{{item.name}}</view>
					</label>
				</radio-group>
			</view>
			<!-- 证件上传 -->
			<view class="uni-form-item uni-column uni-flex upload-wrap">
				<view class="title uni-inline-item text-color-gray">
					证件上传:
				</view>
				<view class="upload-body">
					<view class="item">
						<!-- <button @click="test">身份证正面扫描件</button> -->
						<sunUpImg imgTitle="身份证正面扫描件" imgName="img1" @onUpImg="upImgData" ref="uImage" />
					</view>
					<view class="item">
						<sunUpImg imgTitle="身份证反面扫描件" imgName="img2" @onUpImg="upImgData" ref="uImage" />
					</view>
					<view class="item">
						<sunUpImg imgTitle="营业执照扫描件" imgName="img3" @onUpImg="upImgData" ref="uImage" />
					</view>
					<view class="item">
						<sunUpImg imgTitle="运营委托书" imgName="img4" @onUpImg="upImgData" ref="uImage" />
					</view>
				</view>
				<view class="tips">
					（注意：需上传身份证照片正反面扫描件、营业执照扫描件、另外法人与实际经营人不是同一人需要上传运营委托书）
				</view>
			</view>

			<!-- 商家地址 -->
			<view class="uni-form-item uni-row uni-flex">
				<view class="title uni-inline-item text-color-gray">商家地址:</view>
				<input class="uni-input uni-flex-item" v-model="address" name="address" />
			</view>
			<!-- 邮箱 -->
			<view class="uni-form-item uni-row uni-flex email">
				<view class="title uni-inline-item text-color-gray">邮箱:</view>
				<input class="uni-input uni-flex-item" v-model="email" name="email" />
			</view>
			<view class="uni-btn-v" v-bind:style="{top: positionTop + 'px'}">
				<button formType="submit" class="btn">确认提交</button>
			</view>
		</form>
	</view>
</template>

<script>
	import sunUpImg from '../../components/sunui-upimg/sunui-upimg-new.vue'
	export default {
		components: {
			sunUpImg
		},
		data() {
			return {
				// 经营者姓名
				name: "",
				// 身份证
				card: "",
				// 商店名称
				storeName: "",
				// 性别
				gender: "",
				// 商家地址
				address: "",
				// 邮箱
				email: "",
				genderList: [{
					value: "0",
					name: "男"
				}, {
					value: "1",
					name: "女"
				}, {
					value: "2",
					name: "保密"
				}],
				current: 0,
				positionTop: 0,
				img1:"",
				img2:"",
				img3:"",
				img4:""
			}
		},
		computed: {

		},
		methods: {
			init() {

			},
			initPosition() {
				/**
				 * 使用 absolute 定位，并且设置 bottom 值进行定位。软键盘弹出时，底部会因为窗口变化而被顶上来。
				 * 反向使用 top 进行定位，可以避免此问题。
				 */
				// #ifdef H5
				this.positionTop = uni.getSystemInfoSync().windowHeight - 30;
				// #endif
				// #ifdef APP-PLUS
				this.positionTop = uni.getSystemInfoSync().windowHeight - 80;
				// #endif
			},
			// 选择性别
			radioChange(evt) {
				for (let i = 0; i < this.genderList.length; i++) {
					if (this.genderList[i].value === evt.target.value) {
						this.current = i;
						break;
					}
				}
			},
			//获取上传图片返回来的数组(Step1)
			async upImgData(e) {
				this[e.name]=e.value
			},

			//确认提交
			formSubmit(e) {
				if (e.detail.value.num === "") {
					// uni.showToast({
					// 	icon: "none",
					// 	title:  "请输入转让的M币数量”,
					// });
					return
				}
				if (e.detail.value.id === "") {
					// uni.showToast({
					// 	icon: "none",
					// 	title:  "请输入转入的会员ID”,
					// })
					return
				}
				if (this.isNumInvaild) {
					// uni.showToast({
					// 	icon: "none",
					// 	title:  "M币必须为数字”,
					// })
					return
				}
				// 转让
				this.transferScore();
			}
		},
		onLoad() {
			this.init();
			this.initPosition();
		}
	}
</script>

<style lang="scss">
	.setupStorePage {
		width: 100%;
		padding: 30upx;
		box-sizing: border-box;

		.uni-h5 {
			margin-bottom: 30upx;
		}

		.required {
			color: #f41e28;
			margin-left: 0;
		}

		.tips {
			color: #f9a315;
			font-size: 22upx;
		}

		.uni-form-item {
			align-content: center;
			border-bottom: 1upx solid #f0f0f0;

			.title {
				padding: 0;
			}

			.uni-input {
				// height: 40upx;
				// padding: 10upx 20upx;
				// box-sizing: border-box;
			}

			// 性别
			&.gender {
				height: 60upx;
				margin-top: 20upx;

				.radio-group {
					.uni-list-cell {
						width: 120upx;

						&::after {
							display: none;
						}
					}
				}
			}

			// 证件上传
			&.upload-wrap {
				width: 100%;

				.upload-body {
					width: 100%;
					display: flex;
					justify-content: space-between;
					flex-wrap: wrap;

					.item {
						width: 47.75%;
						background-color: #fff;
						margin: 0 0 15upx 0;
						height: 220upx;

						sunsin_picture_list {
							box-sizing: border-box;

							.sunsin_picture_item {
								width: inherit;
								height: inherit;

								.sunsin-add-image {
									width: inherit;
									height: inherit;

									image {
										width: inherit;
										height: inherit;
									}
								}
							}
						}

					}
				}

			}

			&.email {
				margin-bottom: 200upx;
			}
		}

		.invaild {
			color: #f41e28;
			display: flex;
			align-items: center;
			justify-content: space-between;

			.icon {
				background-color: #f41e28;
				border-radius: 50%;

				.uni-icon {
					color: #f0f0f0;
					width: 22upx;
					height: 22upx;
					display: flex;
					align-items: center;
					justify-content: center;
					overflow: hidden;

					&::before {
						font-size: 36upx;
					}
				}
			}
		}

		.uni-btn-v {
			width: 100%;
			height: 140upx;
			margin: 0 -30upx;
			position: fixed;
			bottom: 0upx;
			left: 30upx;
			z-index: 1000;
			padding: 0 30upx;
			box-sizing: border-box;
			display: flex;
			align-items: flex-start;
			background-color: #fff;

			.btn {
				background: #242424;
				width: 100%;
				color: #fff;
				border-radius: 2upx;
			}
		}
	}
</style>
