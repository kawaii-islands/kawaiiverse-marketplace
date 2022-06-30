import { Box } from "@mui/material";
import Filter from "src/components/Marketplace/Filter";
import Toolbar from "src/components/Marketplace/Toolbar";
import List from "src/components/Marketplace/List";
import { useQuery } from "react-query";
import { getListNFT, getGameLogo } from "src/lib/api";
import { useEffect, useMemo, useState } from "react";
import ListSkeleton from "src/components/common/ListSkeleton/ListSkeleton";
import { getNFT } from "src/lib/api";
import NoData from "src/components/common/NoData";
import { useSelector } from "react-redux";

const names = ["Price: Low to High", "Price: High to Low", "Newest"];

export default function Marketplace() {
	const [listNft, setListNft] = useState();
	const [originalList, setOriginalList] = useState([]);
	const [loadingList, setLoadingList] = useState(true);
	const [currentPage, setCurrentPage] = useState(1);
	const [data, setData] = useState();
	const [isLoading, setIsLoading] = useState(false);
	const [sort, setSort] = useState(names[2]);
	const query = {
		limit: 100000000,
		sort: sort
	};
	const filter = {}
	const activeGames = useSelector(state => state?.filter) || [];

	useEffect(() => {
		getData();
	}, [sort])

	useEffect(() => {
		if (activeGames.length) {
			let a = originalList.filter(nft =>
				activeGames.find(i => i.address.toLowerCase() === nft.nft1155Address.toLowerCase())
			);
			setListNft([...a]);
		} else {
			setListNft([...originalList]);
		}
		setCurrentPage(1);
	}, [activeGames, originalList]);

	const getData = async () => {
		let fetchedData;
		try {
			setIsLoading(true);
			fetchedData = await getListNFT(query, filter);
			setData(fetchedData)

			let arr = [];
			await Promise.all(
				fetchedData?.data.map(async (nft, id) => {
					let nftData = await getNFT(nft.nft1155Address, nft?.tokenIds1155?.[0]);
					let gameLogo = await getGameLogo(nft.nft1155Address);
					arr[id] = { ...nft, name: nftData.name, tokenId: nftData.tokenId, imageUrl: nftData.imageUrl, gameLogo: gameLogo };
				})
			);
			setListNft([...arr]);
			setOriginalList([...arr]);
			setLoadingList(false);
		} catch (error) {
			console.log(error)
		} finally {
			setIsLoading(false);
		}
	}

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
				<Toolbar listNft={listNft} setListNft={setListNft} originalList={originalList} sort={sort} setSort={setSort}/>
				<div style={{ marginTop: "40px" }}>
					{console.log(loadingList, isLoading, loadingList || isLoading)}
					{loadingList || isLoading ? (
						<div style={{ display: "flex", flexWrap: "wrap" }}>
							<ListSkeleton />
						</div>
					) : !listNft?.length ? (
						<NoData />
					) : (
						<List listNft={listNft} totalItems={listNft.length} currentPage={currentPage} setCurrentPage={setCurrentPage}/>
					)}
				</div>
			</Box>
		</Box>
	);
}
