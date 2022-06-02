import { useState, useEffect } from "react";
import NFTDetail from "src/components/common/NFTDetail";
import styles from "./index.module.scss";
import cn from "classnames/bind";
import { useParams } from "react-router-dom";
import { getNFT } from "src/lib/api";
import { toast } from "react-toastify";
import SellModal from "src/components/Detail/SellModal";
import { read } from "src/lib/web3";
import { useWeb3React } from "@web3-react/core";
import { BSC_CHAIN_ID } from "src/constants/network";
import NFT_1155_ABI from "src/abi/nft-1155.json";
import LoadingModal from "src/components/common/LoadingModal/LoadingModal";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";

const cx = cn.bind(styles);

const Detail = () => {
	const { account } = useWeb3React();
	const { contract, index } = useParams();
	const [info, setInfo] = useState();
	const [balance, setBalance] = useState();
	const [show, setShow] = useState(false);
	const [selling, setSelling] = useState();
	const [loadingTitle, setLoadingTitle] = useState("");
	const [stepLoading, setStepLoading] = useState(0);
	const [hash, setHash] = useState();

	useEffect(() => {
		console.log(contract, index);
		getNFTInfo(contract, index);
	}, []);

	const getNFTInfo = async (contract, id) => {
		try {
			let info = await getNFT(contract, index);
			const balance = await getBalanceOf(contract, index);
			info = { ...info, balance: balance };
			console.log(info);
			setInfo(info);
		} catch (error) {
			toast.error(error?.message || "An error occurred");
		}
	};

	const handleOnClick = () => {
		setShow(true);
	};

	const getBalanceOf = async (gameAddress, id) => {
		const balance = await read("balanceOf", BSC_CHAIN_ID, gameAddress, NFT_1155_ABI, [account, id]);
		return balance;
	};

	return (
		<div className={cx("detail")}>
			<NFTDetail info={info} sell={true} onClick={handleOnClick} />
			<SellModal
				show={show}
				setShow={setShow}
				info={info}
				setSelling={setSelling}
				setLoadingTitle={setLoadingTitle}
				setStepLoading={setStepLoading}
				setHash={setHash}
			/>
			{selling && (
				<LoadingModal
					show={selling}
					network={"BscScan"}
					loading={true}
					title={loadingTitle}
					stepLoading={stepLoading}
					onHide={() => {
						setUploadGameLoading(false);
						setHash(undefined);
						setStepLoading(0);
					}}
					hash={hash}
					hideParent={() => {}}
				/>
			)}
		</div>
	);
};

export default Detail;
