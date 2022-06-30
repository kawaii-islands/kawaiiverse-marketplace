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
