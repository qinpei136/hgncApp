import _ from "lodash";
export default {
	state:{
		footer_nav:[
			{
				name:'首页',
				name_code:'home',
				icon:'iconicon_home_nor',
				select_icon:'iconicon_home_sel'
			},
			{
				name:'附近',
				name_code:'nearby',
				icon:'iconicon_nearby_nor',
				select_icon:'iconicon_nearby_sel'
			},
			// 开发调试使用，后续删掉
			{
				name:'会员中心',
				name_code:'vipCenter',
				icon:'iconicon_member_nor',
				select_icon:'iconicon_member_sel'
			},
			{
				name:'购物车',
				name_code:'shopCart',
				icon:'iconicon_shoppingcart_nor',
				select_icon:'iconicon_shoppingcart_sel'
			},
			{
				name:'我的',
				name_code:'mine',
				icon:'iconicon_mine_nor',
				select_icon:'iconicon_mine_sel'
			}
		],
		now_page_index:0,
	},
	mutations:{
		CHANGE_NAV_LIST(state, data){
			state.footer_nav = data;
		},
		CHANGE_PAGE(state, index){
			state.now_page_index = index;
		}
	},
	actions:{
		change_page(ctx, code){
			let index = _.findIndex(ctx.state.footer_nav, item => item.name_code === code);
			index = index > -1 ? index : 0;
			ctx.commit("CHANGE_PAGE", index)
		},
		menu_4(ctx){
			let menu_list = [
				{
					name:'首页',
					name_code:'home',
					icon:'iconicon_home_nor',
					select_icon:'iconicon_home_sel'
				},
				{
					name:'附近',
					name_code:'nearby',
					icon:'iconicon_nearby_nor',
					select_icon:'iconicon_nearby_sel'
				},
				{
					name:'购物车',
					name_code:'shopCart',
					icon:'iconicon_shoppingcart_nor',
					select_icon:'iconicon_shoppingcart_sel'
				},
				{
					name:'我的',
					name_code:'mine',
					icon:'iconicon_mine_nor',
					select_icon:'iconicon_mine_sel'
				}
			]
			
			ctx.commit("CHANGE_NAV_LIST",menu_list)
		},
		menu_5(ctx){
			let menu_list = [
				{
					name:'首页',
					name_code:'home',
					icon:'iconicon_home_nor',
					select_icon:'iconicon_home_sel'
				},
				{
					name:'附近',
					name_code:'nearby',
					icon:'iconicon_nearby_nor',
					select_icon:'iconicon_nearby_sel'
				},
				{
					name:'会员中心',
					name_code:'vipCenter',
					icon:'iconicon_member_nor',
					select_icon:'iconicon_member_sel'
				},
				{
					name:'购物车',
					name_code:'shopCart',
					icon:'iconicon_shoppingcart_nor',
					select_icon:'iconicon_shoppingcart_sel'
				},
				{
					name:'我的',
					name_code:'mine',
					icon:'iconicon_mine_nor',
					select_icon:'iconicon_mine_sel'
				}
			]
			
			ctx.commit("CHANGE_NAV_LIST",menu_list)
		}
	}
}