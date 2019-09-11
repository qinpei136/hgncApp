<template>
	<!-- 商品管理 -->
	<view class="goodsManagement">
		<myList :pageList="dataList" @handleClick="dataClick" class="title_list"></myList>
	</view>
</template>

<script>
	import myList from "../../components/common/my-list";
    export default {
		components: {
			myList
		},
        data() {
            return {
				// 跳转其他功能页面列表
				dataList: [
					{
						title: '店铺管理',
						extra:{},
						isShowExtra: true,
						isShowArrow: true,
					},
					{
						title: '分类管理',
						extra:{},
						isShowExtra: true,
						isShowArrow: true,
					}],
                webviewStyles: {
                    progress: {
                        color: '#FF3333'
                    }
                }
            }
        },
		methods:{
			// 点击跳转
			dataClick(data) {
				// 店铺Logo
				if (data.index === 0) {
					uni.navigateTo({
						url: "/pages/goods/goods_list"
					})
					// 店铺名称
				} else if (data.index === 1) {
					uni.navigateTo({
						url: "/pages/goods/goods_type"
					})
				}
			}
		},
    }
</script>

<style lang="scss">
	pages{
		width: 100%;
		height: 100%;
	}
	.goodsManagement{
		width: 100%;
		height: 100%;
		.title_list{
				padding-left: 20upx;
			}
	}
</style>
