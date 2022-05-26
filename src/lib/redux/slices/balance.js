import { createSlice } from "@reduxjs/toolkit";

export const balanceSlice = createSlice({
	name: "balance",
	initialState: {
		kwtBalance: 0,
	},
	reducers: {
		setKwtBalance: (state, action) => {
			return {
				...state,
				kwtBalance: action.payload,
			};
		},
	},
});

export const { setKwtBalance } = balanceSlice.actions;

export const selectBalance = state => {
	return state.balance;
};

export default balanceSlice.reducer;
