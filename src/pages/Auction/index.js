import { useState, useEffect } from "react";
import NFTDetail from "src/components/common/NFTDetail";
import styles from "./index.module.scss";
import cn from "classnames/bind";
import { useParams } from "react-router-dom";
import { read } from "src/lib/web3";
import addresses from "src/constants/addresses";
import { BSC_CHAIN_ID } from "src/constants/network";
import MARKETPLACE_ABI from "src/abi/marketplace.json";
import axios from "axios";
import ENDPOINT from "src/constants/endpoint";
import { toast } from "react-toastify";
import { useQuery } from "react-query";
import { getNFT } from "src/lib/api";
import BuyModal from "src/components/Auction/Buy";

const cx = cn.bind(styles);
const AUCTION_STATUS = ["AUCTION", "CLOSE", "CANCEL"];

export default function Auction() {
	const [auction, setAuction] = useState();
	const [info, setInfo] = useState();
	const [show, setShow] = useState(false);
	const [unavailable, setUnavailable] = useState(false);
	const [sold, setSold] = useState(false);
	const { index } = useParams();

	useEffect(() => {
		getAuction();
	}, []);

	useEffect(() => {
		if (auction) getNFTInfo(auction.erc1155, auction.erc1155TokenIds[0]);
	}, [auction]);

	const getAuction = async () => {
		try {
			const auction = await read("getAuction", BSC_CHAIN_ID, addresses.MARKETPLACE, MARKETPLACE_ABI, [index]);
			console.log(auction);
			if (auction.startedAt === "0") return toast.error("Auction not found");
			setAuction(auction);
			if (AUCTION_STATUS[auction.status] === "CLOSE") {
				setSold(true);
			} else if (AUCTION_STATUS[auction.status] !== "AUCTION") {
				setUnavailable(true);
			}
		} catch (error) {
			console.log(error);
			toast.error(error?.message || "An error occurred");
		}
	};

	const getNFTInfo = async (contract, id) => {
		try {
			const info = await getNFT(contract, id);
			console.log(info);
			setInfo(info);
		} catch (error) {
			toast.error(error?.message || "An error occurred");
		}
	};

	if (!auction || !info) return <></>;

	return (
		<div className={cx("auction")}>
			<NFTDetail auction={auction} info={info} sold={sold} unavailable={unavailable} onClick={() => setShow(true)} />
			<BuyModal show={show} setShow={setShow} auction={auction} info={info} />
		</div>
	);
}
