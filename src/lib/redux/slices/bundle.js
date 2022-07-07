import { createSlice } from "@reduxjs/toolkit";

export const sellBundleListSlice = createSlice({
	name: "sellBundleList",
	initialState: [],
	reducers: {
		setSellBundleList: (state, action) => {
			return [...action.payload];
		},
	},
});

export const { setSellBundleList } = sellBundleListSlice.actions;

export default sellBundleListSlice.reducer;
