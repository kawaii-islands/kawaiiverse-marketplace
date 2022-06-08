import { OutlinedInput, Modal, Typography, InputAdornment, Button } from "@mui/material";
import cn from "classnames/bind";
import styles from "./index.module.scss";
import tagIcon from "src/assets/icons/tag.svg";
import exchangeIcon from "src/assets/icons/transfer.svg";
import { useState } from "react";
import SingleSell from "./SingleSell";
import MultipleSell from "./MultipleSell";
import { createNetworkOrSwitch, read, write } from "src/lib/web3";
import * as web3 from "web3";
import { BSC_CHAIN_ID } from "src/constants/network";
import NFT1155_ABI from "src/abi/nft-1155.json";
import MARKETPLACE_ABI from "src/abi/marketplace.json";
import addresses from "src/constants/addresses";
import { useWeb3React } from "@web3-react/core";
import { useNavigate } from "react-router-dom";

const cx = cn.bind(styles);

const SellModal = ({ show, setShow, auction, info, index, setSelling, setLoadingTitle, setStepLoading, setHash }) => {
	if (!info) return;
	const { account, chainId, library } = useWeb3React();
	const navigate = useNavigate();
	console.log(info.contract);
	const [tab, setTab] = useState(1);

	const handleClick = async inputData => {
		setShow(false);
		setSelling(true);
		console.log(inputData);
		try {
			const isApproved = await isApprovedForAll();
			console.log("isApproved : ", isApproved);

			if (!isApproved) {
				setStepLoading(0);
				await approve();
				console.log("isApproved : ", await isApprovedForAll());
			}

			const res = await write(
				"createAuction",
				library.provider,
				addresses.MARKETPLACE,
				MARKETPLACE_ABI,
				[
					[
						info.contract,
						"0x0000000000000000000000000000000000000000",
						[info.tokenId.toString()],
						[inputData.amount],
						[],
						web3.utils.toWei(inputData.start_price),
						web3.utils.toWei(inputData.end_price),
						inputData.duration,
					],
				],
				{
					from: account,
				},
				callback
			);
			setStepLoading(2);
		} catch (error) {
			setStepLoading(-1);
			toast.error(error);
			console.log(error);
		} finally {
			setTimeout(() => {
				setSelling(false);
			}, 2000);
		}
	};

	const callback = hash => {
		setHash(hash);
		setStepLoading(1);
	};

	const isApprovedForAll = async () => {
		return read("isApprovedForAll", BSC_CHAIN_ID, info.contract, NFT1155_ABI, [account, addresses.MARKETPLACE]);
	};

	const approve = async () => {
		await write(
			"setApprovalForAll",
			library.provider,
			info.contract,
			NFT1155_ABI,
			[addresses.MARKETPLACE, true],
			{
				from: account,
			},
			callback
		);
	};

	return (
		<>
			<Modal
				open={show}
				animation="true"
				onClose={() => {
					setShow(false);
				}}>
				<div className={cx("sell-modal")}>
					<div className={cx("header")}>
						<img src={tagIcon} />
						<span>Sell bundle of 12</span>
					</div>
					<div className={cx("tabs")}>
						<div onClick={() => setTab(1)} className={cx(tab === 1 && "tabs--active")}>
							Fixed price
						</div>
						<div onClick={() => setTab(2)} className={cx(tab === 2 && "tabs--active")}>
							Auction
						</div>
					</div>
					<div className={cx("tab-content")}>
						{tab === 1 && <SingleSell handleClick={handleClick} info={info} />}
						{tab === 2 && <MultipleSell handleClick={handleClick} info={info} />}
					</div>
				</div>
			</Modal>
		</>
	);
};

export default SellModal;
