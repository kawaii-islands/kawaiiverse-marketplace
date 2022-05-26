import React, { Suspense, useEffect } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import "./App.css";
import { ThemeProvider } from "@mui/material/styles";
import Header from "./components/Header";
import { theme } from "./constants/theme";
import { StyledEngineProvider } from "@mui/material/styles";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";
import { Provider, useDispatch } from "react-redux";
import store from "src/lib/redux/store";
import { setKwtPrice } from "./lib/redux/slices/price";
import { setKwtBalance } from "./lib/redux/slices/balance";
import { getKwtBalance } from "./lib/web3";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingPage from "./components/common/LoadingPage";
import Web3 from "web3";
import { useWeb3React } from "@web3-react/core";

const lazyMinLoadTime = (factory, minLoadTimeMs = 2000) =>
	React.lazy(() =>
		Promise.all([factory(), new Promise(resolve => setTimeout(resolve, minLoadTimeMs))]).then(
			([moduleExports]) => moduleExports
		)
	);

const persistor = persistStore(store);
const Marketplace = lazyMinLoadTime(() => import("src/pages/Marketplace"));
const Profile = lazyMinLoadTime(() => import("src/pages/Profile"));
const Auction = lazyMinLoadTime(() => import("src/pages/Auction"));

const UpdatePrice = () => {
	const dispatch = useDispatch();
	const updatePrice = async () => {
		try {
			const [kwtData] = await Promise.all([
				axios.get("https://api.coingecko.com/api/v3/simple/price?ids=kawaii-islands&vs_currencies=usd"),
			]);
			dispatch(setKwtPrice(kwtData?.data["kawaii-islands"]?.usd));
		} catch (error) {}
	};

	useEffect(() => {
		updatePrice();
		const interval = setInterval(updatePrice, 1000 * 60);
		return clearInterval(interval);
	}, []);

	return null;
};

const UpdateBalance = () => {
	const { account } = useWeb3React();
	const dispatch = useDispatch();
	const updateBalance = async () => {
		try {
			const [kwtData] = await Promise.all([getKwtBalance(account)]);
			dispatch(setKwtBalance(Web3.utils.fromWei(kwtData)));
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		if (account) {
			updateBalance();
			const interval = setInterval(updateBalance, 1000 * 60);
			return clearInterval(interval);
		}
	}, [account]);

	return null;
};

export default function App() {
	return (
		<Provider store={store}>
			<PersistGate loading={null} persistor={persistor}>
				<ThemeProvider theme={theme}>
					<StyledEngineProvider injectFirst>
						<UpdatePrice />
						<UpdateBalance />
						<Header />
						<div className="app-layout">
							<Suspense fallback={<LoadingPage />}>
								<Routes>
									<Route path="/" element={<Marketplace />} />
									<Route path="profile/:tab" element={<Profile />} />
									<Route path="auction/:index" element={<Auction />} />
								</Routes>
							</Suspense>
						</div>
						<ToastContainer />
					</StyledEngineProvider>
				</ThemeProvider>
			</PersistGate>
		</Provider>
	);
}
