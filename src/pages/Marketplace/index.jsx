import { Box } from "@mui/material";
import Filter from "src/components/Marketplace/Filter";
import Toolbar from "src/components/Marketplace/Toolbar";
import List from "src/components/Marketplace/List";
import { useQuery } from "react-query";
import { getListNFT } from "src/lib/api";
import { useEffect, useMemo, useState } from "react";
import ListSkeleton from "src/components/common/ListSkeleton/ListSkeleton";
import { getNFT } from "src/lib/api";
import NoData from "src/components/common/NoData";
import { useSelector } from "react-redux";

export default function Marketplace() {
	const [listNft, setListNft] = useState();
	const [originalList, setOriginalList] = useState([]);
	const [loadingList, setLoadingList] = useState(true);
	const [currentPage, setCurrentPage] = useState(1);
	const query = {
		limit: 100000000
	};
	
	const { isLoading, error, data } = useQuery("getListNFT", () => getListNFT(query));
	const [totalItems, setTotalItems] = useState(0);
	const activeGames = useSelector(state => state?.filter) || [];

	useEffect(() => {
		if (activeGames.length) {
			let a = originalList.filter(nft =>
				activeGames.find(i => i.address.toLowerCase() === nft.nft1155Address.toLowerCase())
			);
			setListNft([...a]);
			setTotalItems(a.length);
		} else {
			setListNft([...originalList]);
			setTotalItems(originalList.length);
		}
		setCurrentPage(1);
	}, [activeGames, originalList]);

	useEffect(() => {
		getFullNftData();
	}, [data]);

	const getFullNftData = async () => {
		setLoadingList(true);
		if (!data) return;
		setTotalItems(data?.option.totalItem);
		
		let arr = [];
		await Promise.all(
			data?.data.map(async (nft, id) => {
				let nftData = await getNFT(nft.nft1155Address, nft?.tokenIds1155?.[0]);

				arr[id] = { ...nft, name: nftData.name, tokenId: nftData.tokenId, imageUrl: nftData.imageUrl };
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
						<List listNft={listNft} totalItems={totalItems} currentPage={currentPage} setCurrentPage={setCurrentPage}/>
					)}
				</div>
			</Box>
		</Box>
	);
}
