
// import service from "../../common/service.js";
import _ from "lodash";

export default {
	state:{
		// 购物车商品总数量
		// total_num: 0,
		// 购物车数据
		goodsList: [],
		// 待提交到订单的产品
		orderList: []
	},
	getters: {
		// 购物车商品总数量
		total_num(state){
			return state.goodsList.length + "";
		},
		// 
		getOrderList(state){
			return state.orderList
		}
	},
	mutations:{
		INIT_GOODS(state, data) {
			state.goodsList = data;
		},
		ADD_GOODS(state, data){
			state.goodsList.push(data);
		},
		DELETE_GOODS(state, index) {
			state.goodsList.splice(index, 1);
			console.log(state.goodsList);
		},
		UPDATA_GOODS(state, data) {
			const {index,key,value}=data;
			state.goodsList[index][key]=value;
		},
		INIT_ORDER_lIST(state, data) {
			state.orderList = data;
		},
	},
	actions:{
		deleteGoods(ctx, arr){
			let goodsList = _.cloneDeep(ctx.state.goodsList);
			_.forEach(arr, item => {
				let index = _.findIndex(ctx.state.goodsList, item1 => item.id === item1.id);
				ctx.commit("DELETE_GOODS", index);
			})
		},
	}
}