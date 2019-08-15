export default {
	state: {
		//浏览商品过程中，是否点击"立即购买"
		inImmidiateBuyProcess: false
	},
	mutations: {
		SET_IN_IMMIDIATE_BUY_PROCESS(state,bool) {
			state.inImmidiateBuyProcess = bool
		}
	},
	actions: {},
	getters: {},
}