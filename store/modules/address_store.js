import service from "../../common/service.js";
import _ from "lodash";

export default {
	state:{
		// 收货地址列表
		addressList: []
	},
	getters: {
		// 获取收货地址列表
		getAddressList(state){
			// 对数组重新排序，默认的地址排首位
			return _.sortBy(state.addressList, item => -item.default)
		}
	},
	mutations:{
		// 收货地址数据更改
		INIT_ADDRESS(state, data) {
			state.addressList = data;
		},
// 		ADD_ADDRESS(state, data){
// 			state.addressList.push(data);
// 		},
// 		DELETE_ADDRESS(state, index) {
// 			state.addressList.splice(index,1);
// 		},
// 		UPDATA_ADDRESS(state, data) {
// 			const {index,key,value}=data;
// 			state.addressList[index][key]=value;
// 		}
	},
	actions:{
		updataAddressList(ctx){
			// console.log(ctx);
			// console.log(ctx.rootState.userId);
			// 重新获取地址列表数据
			let userId = ctx.rootState.userId;
			ctx.commit("INIT_ADDRESS", []);
			service.getAddressList({userId: userId}).then(res=>{
				let data = res.data.data; 
				ctx.commit("INIT_ADDRESS", data);
			}).catch(err=>{
				
			})
		}
	}
}