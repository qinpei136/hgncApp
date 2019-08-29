<template>
	<view class="salesManagementPage">
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
		<!-- 交易量统计 -->
		<view class="notice text-color-gray uni-text-small">
			共<text class="blue">{{totalTransactions}}</text>笔，其中现金交易<text class="blue">{{cashTransactions}}</text>笔，M币交易<text
			 class="blue">{{mbTransactions}}</text>笔
		</view>
		<!-- 选项卡 -->
		<view class="tabs uni-flex">
			<view class="uni-flex-item flex-center-center" :class="currentTab=='cash'?'active':''" @tap="changeTab('cash')">
				现金支付
				<view class="bottom-line"></view>
			</view>
			<view class="uni-flex-item flex-center-center" :class="currentTab=='mb'?'active':''" @tap="changeTab('mb')">
				M币支付
				<view class="bottom-line"></view>
			</view>
		</view>
		<!-- 表格 -->
		<scroll-view scroll-x="true" class="scrollView" :scroll-left="scrollLeft" @touchstart="touchS" @touchend="touchE">
			<view class="table">
				<!-- 表头 -->
				<view class="table-header table-body  uni-flex uni-row">
					<view class="name">
						姓名
					</view>
					<view class="time">
						操作时间
					</view>
					<view class="product">
						商品
					</view>
					<!-- <view class="balance" @tap="filterFn('balance')">
						余额
						<view class="triangle_border_up" :class="currentFilter=='balance'&&isDesc?'up':''"></view>
						<view class="triangle_border_down" :class="currentFilter=='balance'&&!isDesc?'down':''"></view>
					</view> -->
					<view class="num" @tap="filterFn('num')">
						数量
						<!-- 三角 -->
						<view class="triangle_border_up" :class="currentFilter=='num'&&isDesc?'up':''"></view>
						<view class="triangle_border_down" :class="currentFilter=='num'&&!isDesc?'down':''"></view>
					</view>
					<view class="money" @tap="filterFn('money')">
						金额
						<!-- 三角 -->
						<view class="triangle_border_up" :class="currentFilter=='money'&&isDesc?'up':''"></view>
						<view class="triangle_border_down" :class="currentFilter=='money'&&!isDesc?'down':''"></view>
					</view>
					<view class="score" @tap="filterFn('score')">
						积分
						<!-- 三角 -->
						<view class="triangle_border_up" :class="currentFilter=='score'&&isDesc?'up':''"></view>
						<view class="triangle_border_down" :class="currentFilter=='score'&&!isDesc?'down':''"></view>
					</view>
				</view>
				<!-- 内容 -->
				<view class="table-body uni-flex uni-row" v-for="(item, index) in dataList" :key="index" :class="{'active':index%2 != 0}">
					<view class="name">
						{{item.userName}}
					</view>
					<view class="time">
						{{item.time}}
					</view>
					<view class="product">
						{{item.goods}}
					</view>
					<!-- <view class="balance">
						￥{{item.balance}}
					</view> -->
					<view class="num">
						{{item.num}}
					</view>
					<view class="money">
						￥{{item.price}}
					</view>
					<view class="score">
						+{{item.comPoint}}
					</view>
				</view>
			</view>
		</scroll-view>
		<!-- 返回顶部 -->
		<scrollToTop :isShowBtn="isShowBtn"></scrollToTop>
	</view>
</template>

<script>
	var startX = 0;
	var endX = 0;
	import {
		uniIcon
	} from '@dcloudio/uni-ui';
	import moment from "moment";
	import MxDatePicker from "../../components/mx-datepicker/mx-datepicker.vue";
	import scrollToTop from "../../components/common/scroll-to-top.vue";
	import userService from '../../common/userService.js';
	export default {
		components: {
			uniIcon,
			MxDatePicker,
			scrollToTop
		},
		data() {
			return {
				// 总交易笔数
				totalTransactions: "",
				// 现金交易笔数
				cashTransactions: "",
				// M币交易笔数
				mbTransactions: "",
				showPicker: false,
				// 开始时间
				startDate: '',
				// 结束时间
				endDate: '',
				// 
				type: 'start',
				// picker的返回值
				timeValue: "",
				// 积分|M币
				currentTab: "cash",
				// 当前排序
				currentFilter: "",
				// 是否降序
				isDesc: false,
				// 数据列表
				dataList: [],
				scrollLeft: 0,
				// 是否显示回到顶部按钮
				isShowBtn: false

			}
		},
		onPageScroll(e) {
			this.isShowBtn = e.scrollTop >= 216 ? true : false
		},
		computed: {
			disabled() {
				return this.card === "";
			}
		},
		methods: {
			init() {
				this.totalTransactions = "0";
				this.cashTransactions = "0";
				this.mbTransactions = "0";
				this.initTime()
				// 默认查询
				this.search()
			},
			// 初始化时间
			initTime() {
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
			// 
			changeTab(tab) {
				this.currentTab = tab;
				this.getDataList();
			},
			// 查询
			search() {
				// 结束时间不早于开始时间
				let start = this.startDate.replace(/年/g, "-").replace(/月/g, "-").replace(/日/g, "");
				let end = this.endDate.replace(/年/g, "-").replace(/月/g, "-").replace(/日/g, "");
				if (moment(end).isBefore(start)) {
					uni.showToast({
						icon: "none",
						title: "结束时间不能早于开始时间"
					})
				}

				//todo 执行查询操作
				this.getDataList();

			},
			// 变更排序
			filterFn(type) {
				if (this.currentFilter !== type) {
					this.isDesc = false;
					this.currentFilter = type;
				} else {
					this.isDesc = !this.isDesc;

					this.getDataList();
				}

				//todo 执行排序操作

			},
			// 获取数据
			getDataList() {
				uni.showLoading()
				this.dataList = [];
				var params = {
					stime: this.startDate.replace(/年/g, "-").replace(/月/g, "-").replace(/日/g, ""),
					etime: this.endDate.replace(/年/g, "-").replace(/月/g, "-").replace(/日/g, ""),
					payModel:this.currentTab=="mb"?"2":"1"
				}
				userService.getOrder(params).then(res => {
					uni.hideLoading();
					if (res.data.code == 200) {
						var result = res.data.result
						this.totalTransactions = result.count+result.mbcount;
						this.cashTransactions = result.count;
						this.mbTransactions = result.mbcount;
						this.dataList = result.data;
					} else {
						uni.showToast({
							icon: "none",
							title: res.data.msg
						})
					}

				}).catch(err => {
					uni.hideLoading();
					uni.showToast({
						icon: "none",
						title: err.errMsg
					})
				})
			},
			touchS(e) {
				startX = e.mp.changedTouches[0].clientX;
			},
			touchE(e) {
				endX = e.mp.changedTouches[0].clientX;
				if (Math.abs(endX - startX) > 10) {
					if (endX - startX > 0) {
						this.scrollLeft = 0;
					} else {
						this.scrollLeft = 500;
					}
				}
			}
		},
		onLoad() {
			this.init();
			this.initTime();
		}
	}
</script>

<style lang="scss">
	page {
		width: 100%;
		height: 100%;
		background-color: #f0f0f0;
	}

	.salesManagementPage {

		// 时间段查询
		.search {
			width: 100%;
			padding: 20upx 30upx 40upx;
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

			.searchBtn {
				.btn {
					background: #1359ef;
					color: #fff;
					border-radius: 2upx;
				}
			}
		}

		.notice {
			width: 100%;
			height: 70upx;
			padding-left: 30upx;
			box-sizing: border-box;
			line-height: 70upx;

			.blue {
				color: #1359ef;
				font-weight: 600;
			}
		}

		.tabs {
			width: 100%;
			height: 80upx;
			background-color: #fff;

			.uni-flex-item {
				color: #666;
				position: relative;

				.bottom-line {
					display: none;
				}
			}

			.active {
				color: #242424;
				font-weight: 600;

				.bottom-line {
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

		.scrollView {
			width: 100%;

			.table {
				width: 1250upx;
				margin-bottom: 20upx;

				.table-body {
					width: 100%;
					height: 80upx;
					background-color: #fff;
					color: #666;

					&.active {
						background-color: #f5f5f5;
					}

					.name,
					.time,
					.product,
					.balance,
					.num,
					.money,
					.score {
						display: flex;
						align-items: center;
						box-sizing: border-box;
						// flex-shrink: 0;
						padding: 15upx;
						font-size: 24upx;
					}

					.name,
					.time,
					.product,
					.balance,
					.num,
					.money,
						{
						border-right: 1upx solid #f0f0f0;
					}

					.time {
						flex: 0 0 24%;
						padding-left: 30upx;
					}

					.name,
					.product,
					.balance,
					.num,
					.money,
					.score {
						flex: 0 0 12.67%;
						padding-left: 15upx;
					}

				}

				.table-header {
					width: 100%;
					height: 80upx;
					background-color: #242424;
					color: #fff;
					font-size: 24upx;

					// 边框
					.name,
					.time,
					.product,
					.balance,
					.num,
					.money {
						border-right: 1upx solid #fff;
					}

					// 箭头
					.balance,
					.num,
					.money {
						position: relative;

						/*向上*/
						.triangle_border_up {
							width: 0;
							height: 0;
							border-width: 0 10upx 10upx;
							border-style: solid;
							border-color: transparent transparent #999;
							/*透明 透明  灰*/
							position: absolute;
							top: 30upx;
							left: 80upx;

							&.up {
								border-color: transparent transparent #fff;
								/*透明 透明  灰*/
							}
						}

						/*向下*/
						.triangle_border_down {
							width: 0;
							height: 0;
							border-width: 10upx 10upx 0;
							border-style: solid;
							border-color: #999 transparent transparent;
							/*灰 透明 透明 */
							position: absolute;
							top: 44upx;
							left: 80upx;

							&.down {
								border-color: #fff transparent transparent;
								/*灰 透明 透明 */
							}
						}
					}
				}
			}
		}

	}
</style>
