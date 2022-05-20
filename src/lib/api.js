import ENDPOINT from "src/constants/endpoint";
import axios from "axios";
import qs from "query-string";

export const getListNFT = async (query = {}, filters = {}) => {
	const res = await axios.post(`${ENDPOINT}/v1/marketplace?${qs.stringify(query)}`, { filters });
	if (res.data.status === 1) return res.data;
	throw new Error(res.data.message);
};

export const getNFT = async (contract, id) => {
	const res = await axios.get(`${ENDPOINT}/v1/nft/${contract}/${id}`);
	if (res.data.status === 1) return res.data;
	throw new Error(res.data.message);
};
