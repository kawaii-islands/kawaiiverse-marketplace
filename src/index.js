import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import reportWebVitals from "./reportWebVitals";
import { Web3ReactProvider } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import { QueryClient, QueryClientProvider, useQuery } from "react-query";
import axios from "axios";
import ENDPOINT from "src/constants/endpoint";

const defaultQueryFn = async ({ queryKey }) => {
	const res = await axios.get(`${ENDPOINT}/${queryKey[0]}`);
	if (res.data.status === 1) return res.data.data;
	throw new Error(res.data.message);
};

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
			queryFn: defaultQueryFn,
		},
	},
});

function getLibrary(provider) {
	const library = new Web3Provider(provider);
	library.pollingInterval = 12000;
	return library;
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
	// <React.StrictMode>
	<QueryClientProvider client={queryClient}>
		<Web3ReactProvider getLibrary={getLibrary}>
			<BrowserRouter>
				<App />
			</BrowserRouter>
		</Web3ReactProvider>
	</QueryClientProvider>
	// </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
