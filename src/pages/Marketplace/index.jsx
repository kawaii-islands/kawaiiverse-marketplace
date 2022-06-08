import { Box } from "@mui/material";
import Filter from "src/components/Marketplace/Filter";
import Toolbar from "src/components/Marketplace/Toolbar";
import List from "src/components/Marketplace/List";
import { useQuery } from "react-query";
import { getListNFT } from "src/lib/api";
import ListNFT from "src/components/common/ListNFT";
import getItemsPerPage from "src/utils/getItemsPerPage";
import { useEffect, useMemo, useState } from "react";
import ListSkeleton from "src/components/common/ListSkeleton/ListSkeleton";
import { getNFT } from "src/lib/api";
import NoData from "src/components/common/NoData";
import { useSelector } from "react-redux";

export default function Marketplace() {
	const limit = useMemo(() => getItemsPerPage(window.innerWidth), [window.innerWidth]);
	const query = {
		limit,
	};
	const { isLoading, error, data } = useQuery("getListNFT", () => getListNFT(query));
	console.log("data :>> ", data);
	const [listNft, setListNft] = useState();
	const [originalList, setOriginalList] = useState([]);
	const [loadingList, setLoadingList] = useState(true);
	const activeGames = useSelector(state => state?.filter) || [];

	useEffect(() => {
		if (activeGames.length) {
			let a = originalList.filter(nft =>
				activeGames.find(i => i.address.toLowerCase() === nft.nft1155Address.toLowerCase())
			);
			setListNft([...a]);
		} else {
			setListNft([...originalList]);
		}
	}, [activeGames, originalList]);

	useEffect(() => {
		getFullNftData();
	}, [data]);

	const getFullNftData = async () => {
		setLoadingList(true);
		if (!data) return;
		let arr = [];
		await Promise.all(
			data?.data.map(async (nft, id) => {
				let nftData = await getNFT(nft.nft1155Address, nft?.tokenIds1155?.[0]);

				arr[id] = { ...nft, name: nftData.name, tokenId: nftData.tokenId, imageUrl: nftData.imageUrl };
				console.log("nftData :>> ", arr[id]);
			})
		);
		setListNft([...arr]);
		setOriginalList([...arr]);
		setLoadingList(false);
	};

	return (
		<Box display="flex">
			<Filter />
			<Box
				style={{
					height: "calc(100vh - 70px)",
					flex: 1,
					padding: "24px 32px",
					overflowY: "auto",
				}}>
				<Toolbar listNft={listNft} setListNft={setListNft} originalList={originalList} />
				<div style={{ marginTop: "40px" }}>
					{loadingList && isLoading ? (
						<div style={{ display: "flex", flexWrap: "wrap" }}>
							<ListSkeleton />
						</div>
					) : !listNft?.length ? (
						<NoData />
					) : (
						<List listNft={listNft} />
					)}
				</div>
			</Box>
		</Box>
	);
}
