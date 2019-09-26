<template>
</template>

<script>
	import userService from '../../common/userService.js';
	export default{
		onLoad() {
			uni.scanCode({
				success: function (res) {
					console.log("res:"+JSON.stringify(res))
					let params = {
						orderId: res.result,
					}
					uni.showLoading();
					userService.writeOffOrders(params).then(res => {
						uni.hideLoading();
						if(res.data.code=="200")
						{
							uni.showToast({
								icon: "none",
								title: "订单已核销"
							})
						}
						else
						{
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
				}
			});
		}
	}
</script>

<style>
</style>
