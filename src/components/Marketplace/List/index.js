import { useState, useEffect } from "react";
import { useQuery } from "react-query";
import { getListNFT } from "src/lib/api";
import ListNFT from "src/components/common/ListNFT";
import getItemsPerPage from "src/utils/getItemsPerPage";
import { useMemo } from "react";

export default function List({ listNft }) {
	const limit = useMemo(() => getItemsPerPage(window.innerWidth), [window.innerWidth]);
	const query = {
		limit,
	};
	const { isLoading, error, data } = useQuery("getListNFT", () => getListNFT(query));

	if (isLoading) return <></>;
	if (error) return <></>;
	if (listNft)
		return (
			<ListNFT items={listNft || []} totalItems={Math.ceil(listNft?.length / limit) || 0} />
		);
}
