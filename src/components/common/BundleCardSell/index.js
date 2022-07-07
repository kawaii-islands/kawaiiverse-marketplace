//@ts-nocheck
import React, { useState, useRef } from "react";
import styles from "./index.module.scss";
import cn from "classnames/bind";
import { useNavigate } from "react-router-dom";
import Web3 from "web3";
import { selectPrice } from "src/lib/redux/slices/price";
import { useSelector } from "react-redux";
import { getCurrentPriceFromBackend } from "src/utils/getCurrentPrice";
import AddCircleOutlineRoundedIcon from "@mui/icons-material/AddCircleOutlineRounded";
import RemoveCircleOutlineRoundedIcon from "@mui/icons-material/RemoveCircleOutlineRounded";

const cx = cn.bind(styles);

const BundleCardSell = ({
	item,
	type,
	setListSellBundle,
	sellNFTs,
	setSellNFTs,
	listSellingContract,
	setListSellingContract,
	updateInfo,
	index,
}) => {
	if (!item) return;
	const { kwtPrice } = useSelector(selectPrice);
	const canvasRef = useRef(null);
	const navigate = useNavigate();
	const [input, setInput] = useState(sellNFTs?.[item.tokenId] || 0);

	let itemAddress;
	let tokenId;
	let itemBalance;
	let itemSelling;
	let itemImg;
	let itemName;
	let itemPrice;
	let gameLogo;

	if (type == "onSale") {
		itemAddress = item.nft1155Address;
		tokenId = item.tokenIds1155[0];
		itemBalance = parseInt(0);
		itemSelling = parseInt(item.amounts);
		itemImg = item.imageUrl;
		itemName = item.name;
		itemPrice = getCurrentPriceFromBackend(item);
		gameLogo = item.gameLogo;
	} else if (type == "marketplace") {
		itemAddress = item.nft1155Address;
		tokenId = item.tokenIds1155[0];
		itemBalance = parseInt(0);
		itemSelling = parseInt(item.amounts[0]);
		itemImg = item.imageUrl;
		itemName = item.name;
		itemPrice = getCurrentPriceFromBackend(item);
		gameLogo = item.gameLogo;
	} else {
		itemAddress = item.game.address;
		tokenId = item.detail.tokenId;
		itemBalance = parseInt(item.balance);
		itemSelling = item.selling;
		itemImg = item.detail.imageUrl;
		itemName = item.detail.name;
		gameLogo = item.game.logoUrl;
	}

	return (
		<div className={cx("nft-card")}>
			<div className={cx("nft-card-container")}>
				<div className={cx("nft-card-container-header")}>
					<div className={cx("tag")}>#{tokenId}</div>
					<img src={gameLogo} className={cx("logo")} />
				</div>

				<div className={cx("image")}>
					<>
						<img className={cx("avatar")} src={itemImg} />
					</>
					<div className={cx("balance")}>{itemBalance}</div>
				</div>
				<div className={cx("name")}>{itemName}</div>

				<div className={cx("selectNumber")}>
					<RemoveCircleOutlineRoundedIcon
						className={cx("icon")}
						onClick={() => {
							console.log("Hello");
							updateInfo("contract", item?.game.address);
							if (sellNFTs[item?.detail.tokenId]) {
								setInput(sellNFTs[item?.detail.tokenId] - 1);
								setSellNFTs(sellNFTs => ({
									...sellNFTs,
									[item?.detail.tokenId]: sellNFTs[item?.detail.tokenId] - 1,
								}));
								if (sellNFTs[item?.detail.tokenId] - 1 == 0) {
									let tmpArray = [...listSellingContract];
									tmpArray[index] = { ...tmpArray[index], isSell: 0 };
									setListSellingContract(tmpArray);
								}
							}
						}}
					/>
					<input
						type="number"
						className={cx("input")}
						min={0}
						value={input}
						max={item?.balance}
						// pattern="^[1-9][0-9]*$"
						onChange={e => {
							const { value } = e.target;
							updateInfo("contract", item?.game.address);
							if (
								value === "" ||
								(!isNaN(value) &&
									Number.isInteger(Number(value)) &&
									Number(value) >= 1 &&
									Number(value) <= item?.balance)
							) {
								setInput(value);
								setSellNFTs(sellNFTs => ({
									...sellNFTs,
									[item?.detail.tokenId]: Number(value),
								}));
								if (
									!isNaN(value) &&
									Number.isInteger(Number(value)) &&
									Number(value) >= 1 &&
									Number(value) <= item?.balance
								) {
									let tmpArray = [...listSellingContract];
									tmpArray[index] = { ...tmpArray[index], isSell: 1 };
									setListSellingContract(tmpArray);
								}
							}
						}}
					/>

					<AddCircleOutlineRoundedIcon
						className={cx("icon")}
						onClick={() => {
							updateInfo("contract", item?.game.address);
							if (!sellNFTs[item?.detail.tokenId]) {
								setInput(1);
								setSellNFTs(sellNFTs => ({
									...sellNFTs,
									[item?.detail.tokenId]: 1,
								}));
							} else if (sellNFTs[item?.detail.tokenId] < item?.balance) {
								setInput(sellNFTs[item?.detail.tokenId] + 1);
								setSellNFTs(sellNFTs => ({
									...sellNFTs,
									[item?.detail.tokenId]: sellNFTs[item?.detail.tokenId] + 1,
								}));
							}
							let tmpArray = [...listSellingContract];
							tmpArray[index] = { ...tmpArray[index], isSell: 1 };
							setListSellingContract(tmpArray);
						}}
					/>
				</div>
			</div>
		</div>
	);
};

export default BundleCardSell;
