//@ts-nocheck
import React, { useEffect, useRef } from "react";
import styles from "./NFTCard2.module.scss";
import cn from "classnames/bind";
import { useNavigate } from "react-router-dom";
import Web3 from "web3";
import { selectPrice } from "src/lib/redux/slices/price";
import { useSelector } from "react-redux";
import { getCurrentPriceFromBackend } from "src/utils/getCurrentPrice";

const cx = cn.bind(styles);

const NFTCard2 = ({ item, type }) => {
	if (!item) return;
	const { kwtPrice } = useSelector(selectPrice);
	const canvasRef = useRef(null);
	const navigate = useNavigate();

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

	const handleClickCard = () => {
		if (type !== "onSale" && type !== "marketplace") navigate(`/detail/${itemAddress}/${tokenId}`);
		else navigate(`/auction/${item.auctionIndex}`);
	};

	return (
		<div className={cx("nft-card")} onClick={() => handleClickCard()}>
			<div className={cx("nft-card-container")}>
				<div className={cx("nft-card-container-header")}>
					<div className={cx("tag")}>#{tokenId}</div>
					<img src={gameLogo} className={cx("logo")} />
				</div>
				<div className={cx("total")}>
					{type !== "onSale" && type !== "marketplace" && <>Total: {itemBalance + itemSelling}</>}
				</div>
				<div className={cx("image")}>
					<>
						<img className={cx("avatar")} src={itemImg} />
					</>
					{(type === "onSale" || type === "marketplace") && <div className={cx("balance")}>{itemSelling}</div>}
				</div>
				<div className={cx("name")}>{itemName}</div>

				{(type === "onSale" || type === "marketplace") && (
					<div className={cx("price")}>
						<img src={require(`src/assets/icons/kwt.png`)} />
						<div className={cx("amount")}>{itemPrice}</div>
						<div className={cx("dollar")}>${(parseInt(itemPrice) * kwtPrice).toFixed(4)}</div>
					</div>
				)}
				{type === undefined && (
					<div className={cx("onSale")}>
						<div className={cx("content")}>
							<div className={cx("left")}>
								<div className={cx("title")}>Onsale</div>
								<div className={cx("subTitle")}>(Est.)</div>
							</div>
							<div className={cx("right")}>
								<div className={cx("line")}></div>
								<div className={cx("value")}>{itemSelling}</div>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default NFTCard2;
