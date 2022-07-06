import ENDPOINT from "src/constants/endpoint";
import axios from "axios";
import qs from "query-string";

export const getListNFT = async (query = {}, filters = {}) => {
	const res = await axios.post(`${ENDPOINT}/marketplace?${qs.stringify(query)}`, { filters });
	if (res.data.status === 1) return res.data;
	throw new Error(res.data.message);
};

export const getNFT = async (contract, id) => {
	const res = await axios.get(`${ENDPOINT}/nft/${contract}/${id}`);
	if (res.data.status === 1) return res.data.data;
	throw new Error(res.data.message);
};

export const getGameLogo = async contract => {
	const res = await axios.get(`${ENDPOINT}/game/logo?contract=${contract}`);
	if (res.data.status === 1) return res.data.data[0].logoUrl;
	throw new Error(res.data.message);
};

export const getAllAuction = async account => {
	const configGetLength = {
		headers: {
			"Content-Type": "application/json",
		},
		params: {
			page: 1,
			limit: 10000,
			sort: "Latest",
		},
	};

	const data = {
		filters: { sender: account },
	};

	const res = await axios.post(`${ENDPOINT}/marketplace`, data, configGetLength);
	if (res.data.status === 1) return res.data.data;
	throw new Error(res.data.message);
};

export const getAuctionByQuery = async (account, page, PAGE_SIZE, sort) => {
	const config = {
		headers: {
			"Content-Type": "application/json",
		},
		params: {
			page: page,
			limit: PAGE_SIZE,
			sort: sort,
		},
	};

	const data = {
		filters: { sender: account },
	};

	const res = await axios.post(`${ENDPOINT}/marketplace`, data, config);
	if (res.data.status === 1) return res.data.data;
	throw new Error(res.data.message);
};

export const getAuctionFullDataByQuery = async (account, page, PAGE_SIZE, sort) => {
	const auctionList = await getAuctionByQuery(account, page, PAGE_SIZE, sort);
	const auctionFullDataList = await Promise.all(
		auctionList.map(async sellingItem => {
			const response = await axios.get(
				`${ENDPOINT}/nft/${sellingItem.nft1155Address.toLowerCase()}/${sellingItem.tokenIds1155[0]}`
			);

			const gameLogo = await axios.get(`${ENDPOINT}/game/logo?contract=` + sellingItem.nft1155Address.toLowerCase());
			return {
				...sellingItem,
				name: response.data.data.name,
				imageUrl: response.data.data.imageUrl,
				gameLogo: gameLogo.data.data[0].logoUrl,
			};
		})
	);

	return auctionFullDataList;
};
