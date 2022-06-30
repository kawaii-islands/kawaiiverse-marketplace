import React from "react";
import Sidebar from "src/components/Sidebar";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import addresses from "src/constants/addresses";
import MARKETPLACE_ABI from "src/abi/marketplace.json";
import { BSC_CHAIN_ID } from "src/constants/network";
import axios from "axios";
import useGetListGame from "src/utils/hooks/useGetListGame";
import { read } from "src/lib/web3";
import { useWeb3React } from "@web3-react/core";
import NFT_1155_ABI from "src/abi/nft-1155.json";
import URL from "src/constants/endpoint";
import { toast } from "react-toastify";

const Account = React.lazy(() => import("src/pages/Account"));
const SellBundle = React.lazy(() => import("src/pages/SellBundle"));
const Onsale = React.lazy(() => import("src/pages/Onsale"));

export default function Profile() {
	const [loading, setLoading] = useState(true);
	const [listNft, setListNft] = useState();
	const listGame = useGetListGame();
	const { account } = useWeb3React();

	useEffect(() => {
		getData();
	}, []);

	const getData = async () => {
		setLoading(true);
		try {
			const auctionList = await getAuctionList();
			let nftList = await getNftList();

			nftList.map((nft, idx) => {
				auctionList.map((auction, index) => {
					if (nft.game.address == auction.erc1155) {
						let index = auction.erc1155TokenIds.indexOf(nft.detail.tokenId.toString());
						if (index != -1) nftList[idx].selling = nftList[idx].selling + parseInt(auction.amounts[index]);
					}
				});
			});
			nftList = nftList.reverse();
			console.log(nftList);
			setListNft(nftList);
			setLoading(false);
		} catch (error) {
			console.log(error);
			toast.error(error);
		}
	};

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
		return listBuyNFT;
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

	const { tab } = useParams();
	const getTab = () => {
		switch (tab) {
			case "account":
				return <Account listNft={listNft} loading={loading} />;
			case "sale":
				return <SellBundle listNft={listNft} loading={loading} />;
			default:
				return <Onsale />;
		}
	};
	return (
		<div style={{ display: "flex" }}>
			<Sidebar />
			{getTab()}
		</div>
	);
}
