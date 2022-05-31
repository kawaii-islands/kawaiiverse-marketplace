//@ts-nocheck
import React, { useEffect, useRef } from "react";
import styles from "./NFTCard2.module.scss";
import cn from "classnames/bind";

const cx = cn.bind(styles);

const NFTCard2 = ({ item }) => {
	if (!item) return;
	const canvasRef = useRef(null);
	return (
		<div className={cx("nft-card")}>
			<div className={cx("nft-card-container")}>
				<div className={cx("nft-card-container-header")}>
					<div className={cx("tag")}>#{item.detail.tokenId}</div>
					<img src={"https://images.kawaii.global/kawaii-marketplace-image/origin-tag.png"} />
				</div>
				<div className={cx("total")}>Total: {parseInt(item.balance) + item.selling}</div>
				<div className={cx("image")}>
					<>
						<img className={cx("avatar")} src={item.detail.imageUrl} />
					</>
					{/* <div className={cx("balance")}>{item.balance}</div> */}
				</div>
				<div className={cx("name")}>{item.detail.name}</div>
				{/* <div className={cx("price")}>
					<img src="https://bafybeiasmrkk6vcoyhboac66psgt2sjo5am2zza2t7j3bpll75bfgxxjjm.ipfs.infura-ipfs.io/" />
					<div className={cx("amount")}>123</div>
					<div className={cx("dollar")}>$123</div>
				</div> */}
				<div className={cx("onSale")}>
					<div className={cx("content")}>
						<div className={cx("left")}>
							<div className={cx("title")}>Onsale</div>
							<div className={cx("subTitle")}>(Est.)</div>
						</div>
						<div className={cx("right")}>
							<div className={cx("line")}></div>
							<div className={cx("value")}>{item.selling}</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default NFTCard2;
