import React from "react";
import styles from "./NftImage.module.scss";
import cn from "classnames/bind";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import NFTCarousel from "./Carousel";

const cx = cn.bind(styles);

const NftImage = ({ bundleInfo, nftInfo, item, setItem, listNftInBundle }) => {
	return (
		<div className={cx("nft-image")}>
			<div className={cx("top")}>
				<div className={cx("header")}>
					<div className={cx("id")}>#{nftInfo?.data.data.tokenId}</div>
					<img src={nftInfo?.gameLogo} className={cx("category")} />
				</div>

				<img className={cx("avatar")} src={nftInfo?.data.data.imageUrl} />

				<div className={cx("name")}>{nftInfo?.data.data.name}</div>
				<div className={cx("balance")}>{bundleInfo?.amounts[item]}</div>
				{item > 0 && (
					<div className={cx("arrow", "back")} onClick={() => setItem(item - 1)}>
						<ArrowBackIos />
					</div>
				)}
				{item < bundleInfo?.amounts.length - 1 && (
					<div className={cx("arrow", "forward")} onClick={() => setItem(item + 1)}>
						<ArrowForwardIos />
					</div>
				)}
			</div>
			<div style={{ overflow: "hidden" }}>
				<NFTCarousel listNftInBundle={listNftInBundle} item={item} setItem={setItem} />
			</div>
		</div>
	);
};

export default NftImage;
