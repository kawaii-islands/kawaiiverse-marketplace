import styles from "./NFTDisplay.module.scss";
import cn from "classnames/bind";
import NFTCard2 from "src/components/common/NFTCard2/NFTCard2";
import Pagination from "src/components/common/Pagination";
import { useWeb3React } from "@web3-react/core";
import addresses from "src/constants/addresses";
import MARKETPLACE_ABI from "src/abi/marketplace.json";
import { BSC_CHAIN_ID } from "src/constants/network";
import { useState, useEffect } from "react";
import { read } from "src/lib/web3";
import axios from "axios";
import URL from "src/constants/endpoint";
import useGetListGame from "src/utils/hooks/useGetListGame";
import NFT_1155_ABI from "src/abi/nft-1155.json";
import NFTList from "./NFTList";
import ListSkeleton from "src/components/common/ListSkeleton/ListSkeleton";

const cx = cn.bind(styles);
const PAGE_SIZE = 10;

const NFTDisplay = () => {
	const { account } = useWeb3React();
	const listGame = useGetListGame();
	const [listNft, setListNft] = useState();
	const [displayList, setDisplayList] = useState();
	const [totalPage, setTotalPage] = useState();
	const [page, setPage] = useState(1);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		getData();
	}, []);

	const getAuctionList = async () => {
		let auctionList = await read("getAuctionByAddress", BSC_CHAIN_ID, addresses.MARKETPLACE, MARKETPLACE_ABI, [
			account,
		]);
		auctionList = auctionList.filter(auction => {
			return auction.status === "0";
		});
		auctionList.map((aution, idx) => {
			delete aution.auction;
		});
		return auctionList;
	};

	const getNftList = async () => {
		if (!listGame) return;
		console.log(listGame);
		let listBuyNFT = await Promise.all(
			listGame.map(async (game, index) => {
				let totalNftByGame = await getTotalNftOfUser(game.address);

				if (totalNftByGame > 0) {
					const tmpNftArray = Array.from({ length: totalNftByGame }, (v, i) => i);

					const nftInfo = await Promise.all(
						tmpNftArray.map(async (nft, idx) => {
							let nftId = await getNftId(game.address, idx);
							const balance = await getBalanceOf(game.address, nftId);
							const res = await axios.get(`${URL}/nft/${game.address.toLowerCase()}/${nftId}`);
							if (res.data.data) {
								return { balance, detail: res.data.data, game: game, selling: 0 };
							}
						})
					);
					return nftInfo;
				}
			})
		);
		listBuyNFT = listBuyNFT.flat(3).filter(Boolean);
		console.log(listBuyNFT.length);
		setTotalPage(Math.ceil(listBuyNFT.length / PAGE_SIZE));
		return listBuyNFT;
	};

	const getData = async () => {
		setLoading(true);
		const auctionList = await getAuctionList();
		let nftList = await getNftList();

		nftList.map((nft, idx) => {
			auctionList.map((auction, index) => {
				if (nft.game.address == auction.erc1155 && nft.detail.tokenId == auction.erc1155TokenIds[0]) {
					nftList[idx].selling = nftList[idx].selling + parseInt(auction.amounts[0]);
				}
			});
		});
		nftList = nftList.reverse();
		setListNft(nftList);
		let newnftList = nftList.filter((_, index) => index >= (page - 1) * PAGE_SIZE && index <= page * PAGE_SIZE - 1);
		setDisplayList(newnftList);
		setLoading(false);
	};

	const handleClick = (event, pageNumber) => {
		let newnftList = listNft.filter(
			(_, index) => index >= (pageNumber - 1) * PAGE_SIZE && index <= pageNumber * PAGE_SIZE - 1
		);
		setDisplayList(newnftList);
		setPage(pageNumber);
	};

	const getTotalNftOfUser = async gameAddress => {
		const length = await read("getTotalNftOfUser", BSC_CHAIN_ID, gameAddress, NFT_1155_ABI, [account]);

		return length;
	};

	const getNftId = async (gameAddress, id) => {
		const nftId = await read("getIdOfUserAtIndex", BSC_CHAIN_ID, gameAddress, NFT_1155_ABI, [account, id]);
		return nftId;
	};

	const getBalanceOf = async (gameAddress, id) => {
		const balance = await read("balanceOf", BSC_CHAIN_ID, gameAddress, NFT_1155_ABI, [account, id]);
		return balance;
	};

	let contentComponent;
	let paginationComponent;
	if (loading) {
		contentComponent = <ListSkeleton />;
	} else {
		contentComponent = (
			<>
				<NFTList listNft={displayList} page={page} />
			</>
		);
	}

	if (totalPage <= 1 || loading) {
		paginationComponent = <></>;
	} else {
		paginationComponent = <Pagination count={totalPage} page={page} onChange={handleClick} />;
	}

	return (
		<>
			<div className={cx("title")}>NFTs balance</div>
			<div className={cx("grid")}>{contentComponent}</div>
			{paginationComponent}
		</>
	);
};

export default NFTDisplay;