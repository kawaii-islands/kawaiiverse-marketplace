import Web3 from "web3";
import { RPC_URLS } from "src/constants/connectors";
import { splitSignature } from "@ethersproject/bytes";
import { BSC_CHAIN_ID_HEX, BSC_rpcUrls, BSC_blockExplorerUrls, BSC_CHAIN_ID } from "src/constants/network";
import FACTORY_ABI from "src/abi/factory.json";
import NFT_1155_ABI from "src/abi/nft-1155.json";
import addresses from "src/constants/addresses";
import ERC20_ABI from "src/abi/erc20.json";
import axios from "axios";
import URL from "src/constants/endpoint";

export const createNetworkOrSwitch = async provider => {
	if (!provider.isMetaMask) {
		throw new Error(`Please change network to Binance smart chain`);
	}
	let ethereum = window.ethereum;

	if (!ethereum) throw new Error(`Please change network to Binance smart chain`);

	const chainId = BSC_CHAIN_ID_HEX;
	const data = [
		{
			chainId: BSC_CHAIN_ID_HEX,
			chainName: "Binance Smart Chain",
			nativeCurrency: {
				name: "BNB",
				symbol: "BNB",
				decimals: 18,
			},
			rpcUrls: [BSC_rpcUrls],
			blockExplorerUrls: [BSC_blockExplorerUrls],
		},
	];

	try {
		await ethereum.request({
			method: "wallet_switchEthereumChain",
			params: [{ chainId }],
		});
	} catch (switchError) {
		if (switchError.code === 4902) {
			try {
				await ethereum.request({
					method: "wallet_addEthereumChain",
					params: data,
				});
			} catch (addError) {
				console.log(addError);
			}
		} else {
			throw Error("Switch network fail!");
		}
	}
};

export const write = async (method, provider, address, abi, params, sendObj, callback) => {
	const web3 = new Web3(provider);
	const contract = new web3.eth.Contract(abi, address);
	let response;
	await contract.methods[method](...params)
		.send(sendObj)
		.on("transactionHash", hash => {
			console.log("txhash", hash);
			if (callback) {
				callback(hash);
			}
		})
		.on("receipt", receipt => {
			console.log(receipt);
			response = receipt;
		});
	return response;
};

export const sign = async (account, data, provider) => {
	let res = await provider.send("eth_signTypedData_v4", [account, data]);
	if (res.result) {
		res = res.result;
	}
	return splitSignature(res);
};

export const read = async (method, chainId, address, abi, params) => {
	const web3 = new Web3(RPC_URLS[chainId]);
	const contract = new web3.eth.Contract(abi, address);
	const res = await contract.methods[method](...params).call();
	return res;
};

export const getNativeBalance = (address, chainId = BSC_CHAIN_ID) => {
	const web3 = new Web3(RPC_URLS[chainId]);
	return web3.eth.getBalance(address);
};

export const getKwtBalance = (address, chainId = BSC_CHAIN_ID) => {
	return read("balanceOf", chainId, addresses.KAWAII_TOKEN, ERC20_ABI, [address]);
};

export const getCurrentBlock = () => {
	const web3 = new Web3(RPC_URLS[BSC_CHAIN_ID]);
	return web3.eth.getBlockNumber();
};

export const getNumberOfGame = async () => {
	const numberOfGame = +(await read("nft1155Length", BSC_CHAIN_ID, addresses.FACTORY, FACTORY_ABI, []));
	return numberOfGame;
};

export const getListGame = async (from, numberOfGame) => {
	const listPromise = Array(numberOfGame)
		.fill()
		.map((_, idx) => read("nft1155", BSC_CHAIN_ID, addresses.FACTORY, FACTORY_ABI, [idx + from]));
	const listGame = await Promise.all(listPromise);
	const listName = await Promise.all(listGame.map(address => read("name", BSC_CHAIN_ID, address, NFT_1155_ABI, [])));
	const listLogo = await Promise.all(
		listGame.map(async address => {
			let res = await axios.get(`${URL}/game/logo?contract=${address}`);
			if (res.status === 200 && res.data.data[0]) {
				return res.data.data[0].logoUrl;
			}
		})
	);

	console.log('listName[0] :>> ', listName[0]);

	return listGame.map((address, idx) => ({
		name: listName[idx],
		address,
		logoUrl: listLogo[idx],
	}));
};
