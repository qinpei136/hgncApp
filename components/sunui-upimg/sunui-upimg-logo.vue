<template name='sun-upimg-new'>
	<view>
		<view class="sunsin_picture_list">
			<view class="sunsin_picture_item" v-show="upImgConfig.url!=''">
				<image :src="upImgConfig.url" mode="aspectFill" @click="previewImgs"></image>
				<text class='del' @click='deleteImg'>×</text>
			</view>
			<view>
				<view class='sunsin_picture_item' :class="[upImgConfig.url!='' ? 'view-none' : 'view-block']">
					<view class="sunsin-add-image" @click='chooseImage(upImgConfig.imgName)' :style="'background-color:#999'">
						<view><text class="icon-cameraadd" :style="'color:#fff'"></text></view>
						<view class="icon-text" :style="'color:#fff'"><text v-show="upImgConfig.required==true"  class="required">*</text>{{upImgConfig.imgTitle}}</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				img1:"",
				img2:"",
				img3:"",
				img4:"",
				imgs: [],
				upload_picture_list: [],
				childrenMessage:''
			};
		},
		name: 'sun-upimg-new',
		props: {
			upImgConfig:{
				type: Object,
				default: function() {
					return {
					imgTitle:"添加图片",
					imgName:"img1",
					required:true,
					url:"123"
				}
				}
			}
		},
		methods: {
			chooseImage(name) {
				cImage(this,name);
			},
			deleteImg(e) {
				dImage(e, this);
			},
			previewImgs(e) {
				puImage(e, this);
			}
		}
	}

	// 删除图片
	const dImage =async (e, _this) => {
		let name=_this.upImgConfig.imgName
		_this.upImgConfig.url=""
		await _this.$emit('onUpImg', {"name":name,"value":""});
	}


	// 选择图片
	const cImage =async (_this,name) => {
		uni.chooseImage({
			count: 1, //默认9
			sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
			sourceType: ['album'], //从相册选择
			success: async (res) =>{
				uni.getImageInfo({
					src: res.tempFilePaths[0],
					success:async (img)=> {
						res.tempFiles[0]['name'] = name;
						var image = new Image();  
						image.src = img.path; 
						var canvas = document.createElement("canvas");  
						 canvas.width = image.width;  
						 canvas.height = image.height;  
						 var ctx = canvas.getContext("2d");  
						 ctx.drawImage(image, 0, 0, image.width, image.height);  
						 var ext = image.src.substring(image.src.lastIndexOf(".")+1).toLowerCase();  
						 var dataURL = canvas.toDataURL("image/"+ext); 
						_this.upImgConfig.url=res.tempFiles[0].path
					    await _this.$emit('onUpImg', {"name":name,"value":dataURL});
					    return dataURL;
						}
				});
			}
		});
	}

	// 预览(通用)
	const puImage = (e, _this) => {
		uni.previewImage({
			current: _this.upImgConfig.url,
			urls: [_this.upImgConfig.url]
		})
	}
</script>


<!-- 
 如何更改上传图片iconfont图标？
 可以参考我的这篇博文：https://www.cnblogs.com/cisum/p/10364192.html
 -->
<style scoped>
	@import "../../static/css/font/iconfontnew.css";
	[class*="icon-"] {
		font-family: "iconfont" !important;
		font-size: inherit;
		font-style: normal;
	}
		.required {
			color: #f41e28;
			margin-left: 0;
		}

	.icon-text {
		font-size: 28upx;
		/* margin-top: -25%; */
	}

	.icon-cameraadd {
		font-size: 60upx;
		margin-left: 0px !important;
	}

	.icon-cameraadd:before {
		content: "\e60c";
	}

	.sunsin_picture_list {
		width: 100%;
		/* padding: 20upx; */
		display: flex;
		flex-wrap: wrap;
		align-items: flex-start;
		align-content: flex-start;
		flex-direction: row;
		justify-content: flex-start;
		
	}

	.sunsin_picture_list >uni-view
	{
		width: 100%;
	}
	.sunsin_picture_list image {
		width: 40upx;
		height: 40upx;
		margin: 0 4%;
	}
	.product >uni-view>uni-view
	{
		width: 100%;
	}

	.sunsin-add-image {
		width: 100%;
		/* width: 160upx; */
		height: 160upx;
		color: #ddd;
		font-size: 144upx;
		text-align: center;
		margin: 2% 0 0 2%;
		background-color: #eee;
		cursor: pointer;
		border-radius: 10upx;
		display: block;
		/* display: flex; */
		justify-content: center;
		align-items: center;
		flex-wrap: wrap;
		
		text-align: center;
	}

	.sunsin_picture_item {
		margin: 20upx;
		margin-left: 0;
		position: relative;
		/* width: 100%; */
		/* width: 160upx; */
		height: 160upx;
	}
	/* .sunsin_picture_item>uni-image{
		width: 100%;
	} */

	.sunsin_picture_item .del {
		position: absolute;
		top: 0;
		right: -6upx;
		color: #fff;
		border-radius: -4upx;
		border-top-right-radius: 6upx;
		width: 40upx;
		height: 40upx;
		line-height: 40upx;
		z-index: 2;
		text-align: center;
		background-color: #E54D42;
	}

	.sunsin_upload_progress {
		font-size: 24upx;
		color: #fff;
		width: 100%;
		/* width: 162upx; */
		height: 160upx;
		margin-left: 3%;
		text-align: center;
		line-height: 160upx;
		position: absolute;
		top: 0;
		left: 0;
		opacity: 0.7;
		border-radius: 8upx;
		background-color: #000;
	}

	.sunsin_picture_item image {
		width: 100%;
		/* width: 160upx; */
		height: 160upx;
		box-shadow: 6upx 6upx 12upx rgba(112, 128, 144, 0.7);
		border-radius: 15upx;
	}
	.view-none{
		display: none;
	}
	.view-block{
		display: block;
	}
</style>
