import React from "react";
import styles from "./NftInformation.module.scss";
import cn from "classnames/bind";
import { Typography } from "@mui/material";

const cx = cn.bind(styles);

const NftInformation = ({ bundleInfo, nftInfo }) => {
	return (
		<div className={cx("nft-info")}>
			<div className={cx("right")}>
				<div className={cx("feature")}>
					<Typography variant="body2" className={cx("tag")}>
						#{bundleInfo?.auctionIndex}
					</Typography>
					<div className={cx("image")}>
						<img src={bundleInfo?.gameLogo} />
					</div>
				</div>
				<Typography variant="h4" className={cx("name")}>
					Bundle #{bundleInfo?.auctionIndex}
				</Typography>

				<>
					<Typography variant="body1" className={cx("id")}>
						Quantity: {bundleInfo?.amounts.length}
					</Typography>
					<Typography variant="body1" className={cx("id")}>
						Owner: {bundleInfo ? bundleInfo?.sender.slice(0, 6) + "..." + bundleInfo?.sender.slice(-4) : ""}
					</Typography>
				</>

				<>
					<div className={cx("label")}>Price</div>
					<div className={cx("price")}>
						<div className={cx("price-right")}>
							<div className={cx("sold")}>Sold</div>
						</div>
					</div>
				</>

				<div className={cx("divider")} />
				<div className={cx("label")} style={{ fontSize: "28px" }}>
					{nftInfo?.data.data.name}
				</div>

				<>
					<Typography variant="body1" className={cx("id")}>
						Category: {nftInfo?.data.data.category}
					</Typography>
					<Typography variant="body1" className={cx("id")}>
						Owner: {nftInfo ? nftInfo.data.data.author.slice(0, 6) + "..." + nftInfo.data.data.author.slice(-4) : ""}
					</Typography>
				</>

				{nftInfo?.data.data.description && (
					<div className={cx("description")}>
						<div className={cx("title")}>Description:</div>
						<div className={cx("content")}>{nftInfo.data.data.description}</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default NftInformation;
