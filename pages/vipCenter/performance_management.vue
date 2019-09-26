<template>
	<!-- 业绩查询 -->
	<view class="performanceManagementPage">
		<!-- 头部 -->
		<view class="header uni-flex">
			<view class="uni-flex-item uni-column flex-center-center">
				<view class="text">
					<view class="top uni-text-small">
						总成交额
					</view>
					<view class="bottom blue">
						￥{{totalTurnover}}
					</view>
				</view>
			</view>
			<view class="uni-flex-item uni-column flex-center-center">
				<view class="text">
					<view class="top uni-text-small">
						团队人数
					</view>
					<view class="bottom">
						<text class="blue">{{teamSize}}</text>人
					</view>
				</view>
			</view>
			<view class="uni-flex-item uni-column flex-center-center">
				<view class="text">
					<view class="top uni-text-small">
						今日成交
					</view>
					<view class="bottom blue">
						￥{{todayTurnover}}
					</view>
				</view>
			</view>
			<view class="uni-flex-item uni-column flex-center-center">
				<view class="text">
					<view class="top uni-text-small">
						今日人数
					</view>
					<view class="bottom">
						<text class="blue">{{todayInvit}}</text>人
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
			<!-- 查询到的数据 -->
			<view class="list">
				<view class="title uni-text-small text-color-gray">
					该时间段内
				</view>
				<view class="list-item uni-flex">
					<view class="left uni-flex-item">
						总成交：
					</view>
					<view class="right uni-flex-item blue">
						￥{{totalTurnoverInPeriod}}
					</view>
				</view>
				<view class="list-item uni-flex">
					<view class="left uni-flex-item">
						团队人数增加：
					</view>
					<view class="right uni-flex-item">
						<text class="blue">{{invitNumInPeriod}}</text>人
					</view>
				</view>
				<view class="list-item uni-flex">
					<view class="left uni-flex-item">
						新增优惠积分：
					</view>
					<view class="right uni-flex-item blue">
						{{addedScore}}
					</view>
				</view>
			</view>
		</view>
		
	</view>
</template>

<script>
	import {
		uniIcon
	} from '@dcloudio/uni-ui';
	import moment from "moment";
	import MxDatePicker from "../../components/mx-datepicker/mx-datepicker.vue";
	import userService from '../../common/userService.js';
	export default {
		components: {
			uniIcon,
			MxDatePicker
		},
		data() {
			return {
				// 总成交额
				totalTurnover: 0,
				// 团队人数
				teamSize: 0,
				// 今日成交
				todayTurnover: 0,
				// 今日邀请人数
				todayInvit: 0,
				// 是否展示时间选择
				showPicker: false,
				// 开始时间
				startDate: '',
				// 结束时间
				endDate: '',
				// 标志开始时间还是结束时间
				type: 'start',
				// picker的返回值
				timeValue: "",
				// 时间段内总成交
				totalTurnoverInPeriod: 0,
				// 时间段内要求人数
				invitNumInPeriod: 0,
				// 时间段内新增优惠积分
				addedScore: 0
				
			}
		},
		computed: {
			isNumInvaild() {
				return this.mbValue - 0 < this.num - 0
			}
		},
		methods: {
			init() {
				this.initTime();
				this.initInfo();
			},
			initInfo(){
				userService.getOrderMange().then(res=>{
					if(res.data.code==200)
					{
						var result=res.data.result
						this.teamSize = result.usercount;
						this.totalTurnover = result.price;
						this.todayTurnover = result.todayprice;
						this.todayInvit = result.todayuser;
						
						// 默认搜索
						this.getdata();
					}
					else
					{
						uni.showToast({
							icon:"none",
							title: res.data.msg
						})
					}
					
				}).catch(err=>{
					uni.showToast({
						icon:"none",
						title: err.errMsg
					})
				})
				
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
				}
			},
			// 
			changeTab(tab){
				this.currentTab = tab;
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
				
				// 
				this.getdata();
			},
			getdata(){
				var params={
					stime:this.startDate.replace(/年/g, "-").replace(/月/g, "-").replace(/日/g, ""),
					etime:this.endDate.replace(/年/g, "-").replace(/月/g, "-").replace(/日/g, "")
				}
				userService.getOrderMangeBytime(params).then(res=>{
					if(res.data.code==200)
					{
						var result=res.data.result
						this.totalTurnoverInPeriod = result.price;
						this.invitNumInPeriod = result.newuser;
						this.addedScore = result.newComPoint;
					}
					else
					{
						uni.showToast({
							icon:"none",
							title: res.data.msg
						})
					}
					
				}).catch(err=>{
					uni.showToast({
						icon:"none",
						title: err.errMsg
					})
				})
				
			}
		},
		onLoad(options) {
			// 我的团队中查看 经理业绩
			if(options.role) {
				uni.setNavigationBarTitle({
					title: "经理业绩查询"
				})
			}
			this.init();
		}
	}
</script>

<style lang="scss">
	page{
		width: 100%;
		height: 100%;
		background-color: #f0f0f0;
	}
	.performanceManagementPage {
		.header {
			width: 100%;
			height: 140upx;
			background-color: #fff;
			.uni-flex-item {
				border-right: 1upx solid #f0f0f0;
				.text {
					.top,.bottom {
						color: #aaa;
						text-align: center;
					}
				}
			}
		}
		.blue{
			color: #1359ef !important;
			font-weight: 600;
		}

		// 时间段查询
		.search {
			width: 100%;
			padding: 20upx 30upx;
			box-sizing: border-box;
			background-color: #fff;
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
			margin-top: 30upx;
			border-top: 2upx solid #f0f0f0;
			.title{
				margin: 20upx 0 10upx;
			}
			.list-item{
				display: flex;
				align-items: center;
				justify-content: space-between;
				.left, .right{
					font-size: 26upx;
				}
				.right{
					text-align: right;
					flex-shrink: 1;
				}
			}
		}
	}
</style>

