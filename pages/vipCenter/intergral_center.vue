<template>
	<!-- 积分中心 -->
	<view class="intergralCenterPage">
		<!-- 头部 -->
		<view class="header uni-flex">
			<view class="left uni-flex-item uni-column flex-center-center">
				<view class="iconfont iconAintegral flex-center-center"></view>
				<view class="text">
					<view class="top">
						我的积分
					</view>
					<view class="bottom uni-text-small">
						{{jfValue}}
					</view>
				</view>
			</view>
			<view class="middle uni-flex-item uni-column flex-center-center">
				<view class="iconfont iconm_coin1 flex-center-center"></view>
				<view class="text">
					<view class="top">
						今日释放积分
					</view>
					<view class="bottom uni-text-small">
						{{jfValue}}枚
					</view>
				</view>
			</view>
			<view class="right uni-flex-item uni-column flex-center-center">
				<view class="iconfont iconwallet1 flex-center-center"></view>
				<view class="text">
					<view class="top">
						M币钱包
					</view>
					<view class="bottom uni-text-small">
						{{mbValue}}枚
					</view>
				</view>
			</view>
		</view>
		<view class="place-bar-20" style="height: 16upx;"></view>
		<!-- 时间picker -->
		<mx-date-picker :show="showPicker" :type="'date'" :value="timeValue" :show-tips="true" :show-seconds="true" @confirm="onSelected"
		 @cancel="onSelected" />
		<!-- 时间段查询 -->
		<view class="search">
			<view class="title uni-h4">
				时间段查询
			</view>
			<view class="picker uni-flex">
				<view class="start uni-flex uni-flex-item" @tap="onShowDatePicker('start')">
					<view class="value uni-flex-item flex-center-center">
						{{startDate}}
					</view>
					<view class="arrowdown uni-inline-item">
						<uni-icon type="arrowdown" size="18"></uni-icon>
					</view>
				</view>
				<view class="icon uni-inline-item uni-flex flex-center-center">
					<view class="arrow"></view>
				</view>
				<view class="end uni-flex uni-flex-item" @tap="onShowDatePicker('end')">
					<view class="value uni-flex-item flex-center-center">
						{{endDate}}
					</view>
					<view class="arrowdown uni-inline-item">
						<uni-icon type="arrowdown" size="18"></uni-icon>
					</view>
				</view>
			</view>
			<view class="searchBtn">
				<button class="btn" @tap="search">查询</button>
			</view>
		</view>
		<view class="place-bar-20" style="height: 16upx;"></view>
		<!-- 数据列表 -->
		<view class="list">
			<view class="tabs uni-flex">
				<view class="uni-flex-item flex-center-center" :class="currentTab=='jf'?'active':''" @tap="changeTab('jf')">
					积分
					<view class="bottom-line"></view>
				</view>
				<view class="uni-flex-item flex-center-center" :class="currentTab=='mb'?'active':''" @tap="changeTab('mb')">
					M币
					<view class="bottom-line"></view>
				</view>
			</view>
			<view class="table">
				<!-- 表头 -->
				<view class="table-header table-body  uni-flex uni-row">
					<view class="time">
						操作时间
					</view>
					<view class="changed" @tap="filterFn('changed')">
						变更
						<!-- 三角 -->
						<view class="triangle_border_up" :class="currentFilter=='changed'&&isDesc?'up':''"></view>
						<view class="triangle_border_down" :class="currentFilter=='changed'&&!isDesc?'down':''"></view>
					</view>
					<view class="balance" @tap="filterFn('balance')">
						余额
						<!-- 三角 -->
						<view class="triangle_border_up" :class="currentFilter=='balance'&&isDesc?'up':''"></view>
						<view class="triangle_border_down" :class="currentFilter=='balance'&&!isDesc?'down':''"></view>
					</view>
					<view class="remark" @tap="filterFn('remark')">
						备住
						<!-- 三角 -->
						<!-- <view class="triangle_border_up" :class="currentFilter=='remark'&&isDesc?'up':''"></view>
						<view class="triangle_border_down" :class="currentFilter=='remark'&&!isDesc?'down':''"></view> -->
					</view>
				</view>
				<!-- 内容 -->
				<view class="table-body uni-flex uni-row" v-for="(item, index) in dataList" :key="index" :class="{'active':index%2 != 0}">
					<view class="time">
						{{item.time}}
					</view>
					<view class="changed">
						+{{item.changed}}
					</view>
					<view class="balance">
						{{item.balance}}
					</view>
					<view class="remark">
						{{item.remark}}
					</view>
				</view>
			</view>
		</view>
		<!-- 返回顶部 -->
		<scrollToTop :isShowBtn="isShowBtn"></scrollToTop>
	</view>
</template>

<script>
	import {
		uniIcon
	} from '@dcloudio/uni-ui';
	import moment from "moment";
	import MxDatePicker from "../../components/mx-datepicker/mx-datepicker.vue";
	import scrollToTop from "../../components/common/scroll-to-top.vue";
	import service from "../../common/service.js";

	export default {
		components: {
			uniIcon,
			MxDatePicker,
			scrollToTop
		},
		data() {
			return {
				// 我的积分
				jfValue: 0,
				// 今日释放积分
				releasedToday: 0,
				// M币钱包
				mbValue: 0,
				showPicker: false,
				// 开始时间
				startDate: '2019年/01月/01日',
				// 结束时间
				endDate: '2019年/04月/01日',
				// 
				type: 'start',
				// picker的返回值
				timeValue: "",
				// 积分|M币
				currentTab: "jf",
				// 当前排序
				currentFilter: "",
				// 是否降序
				isDesc: false,
				// 是否显示回到顶部按钮
				isShowBtn: false,
				// 数据列表
				dataList: [],
				page: 1,
				pageSize: 10
			}
		},
		onPageScroll(e) {
			this.isShowBtn = e.scrollTop >= 298 ? true : false 
		},
		onReachBottom() {
			this.page++
			this.getDataList();
		},
		computed: {
			isNumInvaild() {
				return this.mbValue - 0 < this.num - 0
			}
		},
		methods: {
			init() {
				this.mbValue = 10299.99;
				// 获取我的积分
				// 获取今日释放积分
				this.getReleaseGold();
				// 获取M币钱包
				
				this.getDataList();
			},
			// 初始化时间
			initTime(){
				//获取当前时间
				let now = moment();
				// 结束时间为当前
				this.endDate = now.format("YYYY年MM月DD日");
				// 开始时间为7天前
				this.startDate = now.subtract(7, 'days').format("YYYY年MM月DD日");
			},
			onShowDatePicker(type) { //显示
				this.showPicker = true;
				this.type = type;
			},
			onSelected(e) { //选择
				this.showPicker = false;
				if (e) {
					this[`${this.type}Date`] = moment(e.value).format("YYYY年MM月DD日");
					//选择的值
					console.log('value => ' + e.value);
					//原始的Date对象
					console.log('date => ' + e.date);
				}
			},
			getReleaseGold(){
				uni.showLoading()
				service.getReleaseGold().then(res=>{
					uni.hideLoading();
					this.releasedToday = res.data.data || "0.00";
				}).catch(err=>{
					uni.hideLoading();
					uni.showToast({
						icon:"none",
						title: err.errMsg
					})
				})
			},
			// 
			changeTab(tab){
				this.currentTab = tab;
				this.getDataList();
			},
			// 查询
			search(){
				// 结束时间不早于开始时间
				let start = this.startDate.replace(/年/g, "-").replace(/月/g, "-").replace(/日/g, "");
				let end = this.endDate.replace(/年/g, "-").replace(/月/g, "-").replace(/日/g, "");
				if(moment(end).isBefore(start)) {
					uni.showToast({
						icon: "none",
						title: "结束时间不能早于开始时间"
					})
				}
				
				//todo 执行查询操作
				this.getDataList();
			},
			// 获取积分，M币数据列表
			getDataList(){
				uni.showLoading();
				let start = this.startDate.replace(/年/g, "-").replace(/月/g, "-").replace(/日/g, "");
				let end = this.endDate.replace(/年/g, "-").replace(/月/g, "-").replace(/日/g, "");
				let param = {
					userId: '6edb5990-5293-11e9-aa84-d307a0d28bbc',
					isCom: this.currentTab=='jf' ? true: false,
					page: this.page,
					pageSize : this.pageSize,
					start: moment(start).valueOf(),
					end: moment(end).valueOf(),
					orderBy: [['createTime','desc']]
				}
				service.getScoreHistory(param).then(res=>{
					uni.hideLoading();
					let data = res.data.data;
					console.log(data);
								
				}).catch(err=>{
					uni.hideLoading();
					uni.showToast({
						icon: "none",
						title:  err.errMsg,
					})
				})
			},
			// 切換排序
			filterFn(type){
				if(this.currentFilter !== type) {
					this.isDesc = false;
					this.currentFilter = type;
				} else {
					this.isDesc = !this.isDesc;
				}
				
				//todo 执行排序操作
				// this.
			}
		},
		onLoad() {
			this.init();
			// 
			this.initTime();
		}
	}
</script>

<style lang="scss">
	.intergralCenterPage {
		.header {
			width: 100%;
			height: 210upx;

			.uni-flex-item {
				border-right: 2upx solid #f0f0f0;
				&:nth-last-child(1){
					border: none;
				}
				.iconfont {
					width: 100%;
					height: 110upx;
					font-size: 80upx;
					color: #1359ed;
				}
				.text {
					.bottom {
						color: #aaa;
						text-align: center;
					}
				}
			}
		}


		// 时间段查询
		.search {
			width: 100%;
			padding: 20upx 30upx;
			box-sizing: border-box;

			.picker {
				width: 100%;
				height: 64upx;
				margin: 30upx 0;

				.start,
				.end {
					height: 100%;
					border: 2upx solid #eee;
					display: flex;
					align-items: center;
					justify-content: space-between;
					padding: 0 10upx;
					font-size: 24upx;
					color: #666;
				}

				.icon {
					width: 100upx;
					height: 100%;

					.arrow {
						width: 25upx;
						height: 21upx;
						background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAWCAMAAAACYceEAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA4RpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDplMzU1MTcwMS04N2FlLTRjNGMtYjMzNC1mMjg5NDA2ODgzNWUiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QzY1OEUzRTQ1RDAzMTFFOTkxNTlCRkVEOTQ4NTE3QzgiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QzY1OEUzRTM1RDAzMTFFOTkxNTlCRkVEOTQ4NTE3QzgiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKFdpbmRvd3MpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6YWU1MWE1MTktOTM1Yi02MzQ5LTljMjktNzEyNzM1MDExNDMzIiBzdFJlZjpkb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6MjZlZTkzNWQtNTQ5NS0xMWU5LTg0MDYtZDBjNmE2NDI3ZWRiIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+bnHWoQAAAJZQTFRF////JCQkkZGR/v7+WlpaJSUlkpKSIyMjWVlZW1tb5ubm9PT0/Pz8Xl5e/f39KCgooqKikJCQvr6+lJSUJiYmVFRU0dHRRUVFQ0ND4eHhhYWFNzc3gYGB7+/vrq6uKysrycnJiIiIuLi4Ojo6Y2NjsLCwLi4uz8/Pw8PDMDAwQUFB1NTU29vbNTU15eXlysrKQkJC7e3t7Ol8IgAAALtJREFUeNp0j4cSwiAQRG+5kB6T2Hvv3f//OQkZNdHzMTcsBwsLkYF3bZ2QAD8u+nAV+hR3oPdm/mqbGgIto/jHtNRYsz3EVQPReYZ+RA2iqqmQ0VHjHviO4wfOG9+ZMmUaBg8aVpRoKKZQucXI82L6MH/dziTCkuafQ/zHX+3eVA3XlqtCIoUanolsCpnZsaLyFbvsRSwkiwNvO2Ap4Rhoiuk2wEJM3U3hNyRLOMJqIn418dJT+exTgAEAyoEHGO24i4YAAAAASUVORK5CYII=");
						background-size: 100%;
					}
				}
			}
			.searchBtn{
				.btn{
					background: #1359ef;
					color: #fff;
					border-radius: 2upx;
				}
			}
		}
		.list{
			.tabs{
				width: 100%;
				height: 80upx;
				.uni-flex-item {
					color:#666;
					position: relative;
					.bottom-line{
						display: none; 
					}
				}
				.active{
					color:#242424;
					font-weight: 600;
					.bottom-line{
						display: block;
						width: 20upx;
						height: 6upx;
						position: absolute;
						bottom: 4upx;
						left: 50%;
						transform: translateX(-50%);
						background-color: #242424;
					}
				}
			}
			.table{
				.table-body{
					width: 100%;
					height: 80upx;
					background-color: #fff;
					color: #666;
					&.active{
						background-color: #f5f5f5;
					}
				}
				.table-header{
					width: 100%;
					height: 80upx;
					background-color: #242424;
					color: #fff;
					// 边框
					.time, .changed, .balance{
						border-right: 1upx solid #fff;
					}
					// 箭头
					.changed, .balance, .remark{
						position: relative;
						/*向上*/
						.triangle_border_up{
							width:0;
							height:0;
							border-width:0 10upx 10upx;
							border-style:solid;
							border-color:transparent transparent #999;/*透明 透明  灰*/
							position:absolute;
							top: 30upx;
							left: 80upx;
							&.up{
								border-color:transparent transparent #fff;/*透明 透明  灰*/
							}
						}
						/*向下*/
						.triangle_border_down{
							width:0;
							height:0;
							border-width:10upx 10upx 0;
							border-style:solid;
							border-color:#999 transparent transparent;/*灰 透明 透明 */
							position:absolute;
							top: 44upx;
							left: 80upx;
							&.down{
								border-color:#fff transparent transparent;/*灰 透明 透明 */
							}
						}
					}
				}
				.time, .changed, .balance, .remark{
					display: flex;
					align-items: center;
					box-sizing: border-box;
				}
				.time, .changed, .balance{
					border-right: 1upx solid #f0f0f0;
				}
				.time{
					flex: 0 0 43%;
					padding-left: 30upx; 
				}
				.changed, .balance{
					flex: 0 0 16.7%;
					padding-left: 15upx;
				}
				.remark{
					flex: 0 0 23.6%;
					padding-left: 15upx;
				}
			}
		}
	}
</style>
