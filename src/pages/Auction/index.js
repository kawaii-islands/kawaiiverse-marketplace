import { useState, useEffect } from "react";
import NFTDetail from "src/components/common/NFTDetail";
import styles from "./index.module.scss";
import cn from "classnames/bind";
import { useParams } from "react-router-dom";
import { read, write, createNetworkOrSwitch } from "src/lib/web3";
import addresses from "src/constants/addresses";
import { BSC_CHAIN_ID } from "src/constants/network";
import MARKETPLACE_ABI from "src/abi/marketplace.json";
import axios from "axios";
import ENDPOINT from "src/constants/endpoint";
import { toast } from "react-toastify";
import { useQuery } from "react-query";
import { getNFT } from "src/lib/api";
import BuyModal from "src/components/Auction/Buy";
import { useWeb3React } from "@web3-react/core";
import web3 from "web3";
import LoadingModal from "src/components/common/LoadingModal/LoadingModal";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import { useNavigate } from "react-router-dom";

const cx = cn.bind(styles);
const AUCTION_STATUS = ["AUCTION", "CLOSE", "CANCEL"];

export default function Auction() {
	const { account, chainId, library } = useWeb3React();
	const [auction, setAuction] = useState();
	const [info, setInfo] = useState();
	const [show, setShow] = useState(false);
	const [unavailable, setUnavailable] = useState(false);
	const [sold, setSold] = useState(false);
	const [buying, setBuying] = useState(false);
	const [cancelling, setCancelling] = useState(false);
	const [hash, setHash] = useState("");
	const [stepLoading, setStepLoading] = useState(0);
	const [loadingTitle, setLoadingTitle] = useState("");
	const { index } = useParams();
	const navigate = useNavigate();

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
	const callback = hash => {
		setHash(hash);
		setStepLoading(1);
	};

	const cancelAuction = async () => {
		try {
			setStepLoading(0);
			setCancelling(true);
			if (chainId !== BSC_CHAIN_ID) {
				const error = await createNetworkOrSwitch(library.provider);
				if (error) {
					throw new Error("Please change network to Binance smart chain.");
				}
			}

			await write(
				"cancelAuction",
				library.provider,
				addresses.MARKETPLACE,
				MARKETPLACE_ABI,
				[index],
				{ from: account },
				callback
			);
			setStepLoading(2);
			setTimeout(() => {
				navigate(`/profile/account`);
			}, 1000);
		} catch (error) {
			setStepLoading(-1);
			console.log(error);
			toast.error(error.message || "An error occurred!");
		} finally {
			setTimeout(() => {
				setCancelling(false);
			}, 2000);
		}
	};

	if (!auction || !info) return <></>;

	const isOwner = web3.utils.toChecksumAddress(auction.seller) === web3.utils.toChecksumAddress(account);
	let onClick;
	if (isOwner) onClick = cancelAuction;
	else onClick = () => setShow(true);

	return (
		<div className={cx("auction")}>
			<NFTDetail
				auction={auction}
				info={info}
				sold={sold}
				unavailable={unavailable}
				onClick={onClick}
				isOwner={isOwner}
			/>
			<BuyModal
				show={show}
				setShow={setShow}
				auction={auction}
				info={info}
				index={index}
				setBuying={setBuying}
				setStepLoading={setStepLoading}
				setHash={setHash}
			/>
			{(buying || cancelling) && (
				<LoadingModal
					show={buying || cancelling}
					network={"BscScan"}
					loading={true}
					title={loadingTitle}
					stepLoading={stepLoading}
					onHide={() => {
						setBuying(false);
						setCancelling(false);
						setHash(undefined);
						setStepLoading(0);
					}}
					hash={hash}
					hideParent={() => {}}
				/>
			)}
		</div>
	);
}
