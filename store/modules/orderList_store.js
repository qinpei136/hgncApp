import service from "../../common/service.js";
import _ from "lodash";

export default {
	state:{
		// 收货地址列表
		orderList: []
	},
	getters: {
		// 待付款订单个数
		dfk_num(state){
			return _.filter(state.orderList, item => item.status === "0").length
		},
		// 待发货订单个数
		dfh_num(state){
			return _.filter(state.orderList, item => item.status === "1").length
		},
		// 待收获订单个数
		dsh_num(state){
			return _.filter(state.orderList, item => item.status === "2").length
		}
	},
	mutations:{
		// 收货地址数据更改
		INIT_ORDERLIST(state, data) {
			state.orderList = data;
		},
	},
	actions:{
		updataOrderList(ctx){
			ctx.commit("INIT_ORDERLIST", []);
			let params = {
				userId: ctx.rootState.userId,
				status: "", // 查询全部
				page: 1,
				pageSize: 1000
			}
			service.getOrderList(params).then(res=>{
				let data = res.data.data; 
				ctx.commit("INIT_ADDRESS", data);
			}).catch(err=>{
				
			})
		}
	}
}