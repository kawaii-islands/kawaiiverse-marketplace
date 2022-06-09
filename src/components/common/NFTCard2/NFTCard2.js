//@ts-nocheck
import React, { useEffect, useRef } from "react";
import styles from "./NFTCard2.module.scss";
import cn from "classnames/bind";
import { useNavigate } from "react-router-dom";
import Web3 from "web3";

const cx = cn.bind(styles);

const NFTCard2 = ({ item, type }) => {
	if (!item) return;
	// console.log(item);
	const canvasRef = useRef(null);
	const navigate = useNavigate();

	let itemAddress;
	let tokenId;
	let itemBalance;
	let itemSelling;
	let itemImg;
	let itemName;
	let itemPrice;

	if (type == "onSale") {
		itemAddress = item.nft1155Address;
		tokenId = item.tokenIds1155[0];
		itemBalance = item.amounts;
		itemSelling = item.amounts;
		itemImg = item.imageUrl;
		itemName = item.name;
		itemPrice = Web3.utils.fromWei(item.startingPrice.toString());
	} else {
		itemAddress = item.game.address;
		tokenId = item.detail.tokenId;
		itemBalance = parseInt(item.balance);
		itemSelling = item.selling;
		itemImg = item.detail.imageUrl;
		itemName = item.detail.name;
	}

	const handleClickCard = () => {
		if (type !== "onSale") navigate(`/detail/${itemAddress}/${tokenId}`);
		else navigate(`/auction/${item.auctionIndex}`);
	};

	return (
		<div className={cx("nft-card")} onClick={() => handleClickCard()}>
			<div className={cx("nft-card-container")}>
				<div className={cx("nft-card-container-header")}>
					<div className={cx("tag")}>#{tokenId}</div>
					<img src={"https://images.kawaii.global/kawaii-marketplace-image/origin-tag.png"} />
				</div>
				<div className={cx("total")}>Total: {itemBalance + itemSelling}</div>
				<div className={cx("image")}>
					<>
						<img className={cx("avatar")} src={itemImg} />
					</>
					{type === "onSale" && <div className={cx("balance")}>{itemSelling}</div>}
				</div>
				<div className={cx("name")}>{itemName}</div>

				{type === "onSale" && (
					<div className={cx("price")}>
						<div className={cx("amount")}>{itemSelling}</div>
						<div className={cx("dollar")}>${itemPrice}</div>
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
