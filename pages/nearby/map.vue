/**
 * map 用到的属性
* @param width map宽度
* @param height map高度
* @param latitude 中心纬度
* @param longitude 中心经度
* @param scale 缩放级别，取值范围为5-18
* @param markers 标记点
* @param show-location 显示带有方向的当前定位点
* @param markertap 点击标记点时触发
* */         
<template>
	<view class="page-body">
		<view class="page-section page-section-gap">
			<map style="width: 100%; height: 100%;" :latitude="latitude" :longitude="longitude" scale="16" :markers="markers"
			 show-location="true" @markertap="markertap">
			</map>
		</view>
	</view>
</template>

<script>
	//高德SDK
	import amap from '../../common/SDK/amap-wx.js';
	export default {
		data() {
			return {
				markers: [],
				poisdatas: [],
				title: 'map',
				latitude: 0,
				longitude: 0,
			}
		},
		computed:{
			circles(){
				return [{
					latitude: this.latitude,
					longitude: this.longitude,
					// fillColor: "rgba(255,255,255, 0)",//填充颜色
					color:"#12A1DD",//描边的颜色
					radius: 500,
					strokeWidth: 10
				}]
			}
		},
		methods: {
			//得到点击的marker的id，遍历markers数组，判断有没有相等的id
			//如果有的就能从this.poisdatas[i].address得到坐标位置（没有就提醒下）
			markertap: function(e) {
				for (var i = 0; i < this.markers.length; i++) {
					if (JSON.stringify(e).substring(18, 20) == this.markers[i].id) {
						console.log("markers" + this.poisdatas[i].name + "   " + this.poisdatas[i].address);
						uni.showToast({
							title: this.poisdatas[i].name,
							mask: false,
							duration: 1500
						});
					}
				}

			}
		},
		onLoad(option) {
			this.latitude = option.latitude;
			this.longitude = option.longitude;
			var that = this;
			var amapPlugin = new amap.AMapWX({
				key: "7da2bb476a91a511d0c3b6626f7be558"
			});
			amapPlugin.getPoiAround({
				success: function(data) {
					//成功回调
					that.markers = data.markers;
					console.log("markers:" + JSON.stringify(that.markers));
					that.poisdatas = data.poisData;
					var markers_new = [];
					that.markers.forEach(function(item, index) {
						markers_new.push({
							id: item.id, //marker 序号
							width: item.width, //marker 宽度
							height: item.height, //marker 高度
							iconPath: "/static/img/location.png", //marker 图标路径
							latitude: item.latitude, //marker  纬度
							longitude: item.longitude, //marker 经度
							//自定义标记点上方的气泡窗口
							callout: {
								padding: 2, //callout 文本边缘留白
								fontSize: 15, //callout  文字大小
								bgColor: 'blue', //callout 背景颜色
								color: '#6B8E23', //callout 文字颜色
								borderRadius: 5, //边框圆角
								display: 'BYCLICK', //callout 'BYCLICK':点击显示; 'ALWAYS':常显
								content: that.poisdatas[index].name //地理位置名称
							}
						})
					})
					that.markers = markers_new;
					// console.log("data:" + JSON.stringify(that.poisdatas));
				},
				fail: function(info) {
					//失败回调
					console.log("info", info)
				}
			})
		}
	}
</script>

<style lang="scss">
	page{
		width: 100%;
		height: 100%;
	}
	.page-body{
		width: 100%;
		height: 100%;
		.page-section-gap{
			width: 100%;
			height: 100%;
		}
	}
</style>
