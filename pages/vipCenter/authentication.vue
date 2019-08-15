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
				<input class="uni-input uni-flex-item" type="text" v-model="name" name="name"/>
			</view>
			<view class="tips">
				（注意：必须与会员账号本人真实姓名一致）
			</view>
			
			<!-- 身份证 -->
			<view class="uni-form-item uni-row uni-flex">
				<view class="title uni-inline-item text-color-gray">
					<text class="required">*</text>身份证号码:
				</view>
				<input class="uni-input uni-flex-item" type="idcard" v-model="card" name="card"/>
			</view>
			<view class="tips">
				（注意：必须与会员账号本人真实姓名一致）
			</view>
			
			<!-- 商家名称 -->
			<view class="uni-form-item uni-row uni-flex">
				<view class="title uni-inline-item text-color-gray">
					<text class="required">*</text>商家名称:
				</view>
				<input class="uni-input uni-flex-item" type="text" v-model="storeName" name="storeName"/>
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
						<sunUpImg :upImgConfig="upImgConfig" @onUpImg="upImgData" ref="uImage" />
					</view>
					<view class="item">
						<sunUpImg :upImgConfig="upImgConfig" @onUpImg="upImgData" ref="uImage" />
					</view>
					<view class="item">
						<sunUpImg :upImgConfig="upImgConfig" @onUpImg="upImgData" ref="uImage" />
					</view>
					<view class="item">
						<sunUpImg :upImgConfig="upImgConfig" @onUpImg="upImgData" ref="uImage" />
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
	import sunUpImg from '../../components/sunui-upimg/sunui-upimg.vue'
	export default {
		components:{
			sunUpImg
		},
		data() {
			return {
				// 经营者姓名
				name:"",
				// 身份证
				card: "",
				// 商店名称
				storeName: "",
				// 性别
				gender: "",
				// 商家地址
				address:"",
				// 邮箱
				email:"",
				genderList: [{
					value: "0",
					name: "男"
				},{
					value: "1",
					name: "女"
				},{
					value: "2",
					name: "保密"
				}],
				current: 0,
				positionTop: 0,
				/**
                 * 图片上传配置项
                 * 
                 * 关于阿里云oos,开启oos的话(需要配置./ali-oos/config.js的配置项)
                 */
                upImgConfig: {
                    // 是否阿里云oos且oos地址必须是https
                    oos: true,
                    aliConfig: {
                        // 阿里云oos上传key_secret(后端传)
                        AccessKeySecret: 'zmOJcaqKJB5e4gqtLunHcNoMBTdDgp',
                        // 阿里云oos上传key_id(后端传)
                        OSSAccessKeyId: 'LTAIPcJL9J5OZr2G',
                        // 阿里云oos上传目录(必须存在)
                        oosDirectory: 'mifanimg',
                    },
                    // 后端图片接口地址(阿里云开启oos的话就填写阿里云上传服务器url：http://4zlinkimgtest.oss-cn-beijing.aliyuncs.com/否则的话写自己后端上传图片地址，注意把oos置为false!!!)
                    url: 'http://4zlinkimgtest.oss-cn-beijing.aliyuncs.com/',
                    // 是否开启notli(开启的话就是选择完直接上传，关闭的话当count满足数量时才上传)
                    notli: false,
                    // 图片数量
                    count: 1,
                    // 过滤图片容量大于或等于3M的图片(2019/4/11新增)
                    maxsize: 3,
                    // 相机来源([相机,相册],[相机])
                    sourceType: true,
                    // 是否压缩上传照片(仅小程序生效)
                    sizeType: true,
                    // 新增上传背景修改
                    bgColor: '#999',
                    // 新增上传icon图标颜色修改
                    iconColor: '#fff',
                    // 上传文字描述(仅限四个字)
                    text: '上传图片',
                    // 删除图标定义背景颜色
                    delIconColor: '',
                    // 删除图标字体颜色
                    delIconText: '',
                    // 上传图标替换(+),是个http,https图片地址(https://www.playsort.cn/right.png)
                    iconReplace: ''
                },
                imgArr: []
			}
		},
		computed:{
			
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
			radioChange(evt){
				for (let i = 0; i < this.genderList.length; i++) {
					if (this.genderList[i].value === evt.target.value) {
						this.current = i;
						break;
					}
				}
			},
			// 上传图片(2019/3/29新增) -> 手动上传(需要传入上传url,还需要搭配count参数使用!)
            uImageTap() {
                this.$refs.uImage.uploadimage('http://4zlinkimgtest.oss-cn-beijing.aliyuncs.com/');
            },
            //获取上传图片返回来的数组(Step1)
            async upImgData(e) {
                // 上传图片数组
                let arrImg = [];
                for (let i = 0, len = e.length; i < len; i++) {
                    if (e[i].path_server != "") {
                        console.log(i);
                        await arrImg.push(e[i].path_server.split(','));
                    }
                }
                // 图片信息保存到data数组
                this.imgArr = arrImg;

                // 可以根据长度来判断图片是否上传成功. 2019/4/11新增
                if (this.imgArr.length == this.upImgConfig.count) {
                    uni.showToast({
                        title: `上传成功`,
                        icon: 'none'
                    })
                }
            },
		},
		onLoad() {
			this.init();
			this.initPosition();
		}
	}
</script>

<style lang="scss">
	.setupStorePage{
		width: 100%;
		padding: 30upx;
		box-sizing: border-box;
		.uni-h5 {
			margin-bottom: 30upx;
		}
		.required{
			color: #f41e28;
			margin-left: 0;
		}
		.tips{
			color: #f9a315;
			font-size: 22upx;
		}
		.uni-form-item{
			align-content: center;
			border-bottom: 1upx solid #f0f0f0;
			.title{
				padding: 0;
			}
			.uni-input{
				// height: 40upx;
				// padding: 10upx 20upx;
				// box-sizing: border-box;
			}
			// 性别
			&.gender{
				height: 60upx;
				margin-top: 20upx;
				.radio-group{
					.uni-list-cell{
						width: 120upx;
						&::after{
							display: none;
						}
					}
				}
			}
			// 证件上传
			&.upload-wrap{
				width: 100%;
				.upload-body{
					width: 100%;
					display: flex;
					justify-content: space-between;
					flex-wrap: wrap;
					.item{
						width: 47.75%;
						background-color: #fff;
						margin: 0 0 15upx 0;
						height: 220upx;
						sunsin_picture_list{
							box-sizing: border-box;
							.sunsin_picture_item{
								width: inherit;
								height: inherit;
								.sunsin-add-image{
									width: inherit;
									height: inherit;
									image{
										width: inherit;
										height: inherit;
									}
								}
							}
						}
						
					}
				}
				
			}
			&.email{
				margin-bottom: 200upx;
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
			.btn{
				background: #242424;
				width: 100%;
				color: #fff;
				border-radius: 2upx;
			}
		}
	}
</style>
