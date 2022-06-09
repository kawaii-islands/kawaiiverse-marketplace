import { useState, useEffect } from "react";
import { useQuery } from "react-query";
import { getListNFT } from "src/lib/api";
import ListNFT from "src/components/common/ListNFT";
import getItemsPerPage from "src/utils/getItemsPerPage";
import { useMemo } from "react";
import ENDPOINT from "src/constants/endpoint";
import axios from "axios";
import qs from "query-string";

export default function List({ listNft, totalItems, currentPage, setCurrentPage }) {
	console.log(listNft);
	console.log(currentPage);
	const [displayList, setDisplayList] = useState();
	const limit = 8;

	const getDisplayList = async (listNft, limit, currentPage) => {
		if (!listNft) {
			return;
		}
		const fromIndex = (currentPage - 1) * limit;
		const toIndex = currentPage * limit - 1;
		let displayList = listNft.filter((_, index) => index >= fromIndex && index <= toIndex);
		setDisplayList(displayList);
	};

	useEffect(() => {
		getDisplayList(listNft, limit, currentPage);
	}, [currentPage, listNft, limit]);
	if (listNft)
		return (
			<ListNFT
				items={displayList || []}
				totalItems={Math.ceil(totalItems / limit) || 0}
				setCurrentPage={setCurrentPage}
			/>
		);
}
