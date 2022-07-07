//@ts-nocheck
import React, { useEffect, useState } from "react";
import styles from "./index.module.scss";
import cn from "classnames/bind";
import Progress from "./Progress";
import { Typography, Button } from "@mui/material";

const cx = cn.bind(styles);

const NFTDetail = ({ auction, info, sold, unavailable, sell, onClick, isOwner }) => {
	if (!info) return;
	return (
		<div className={cx("nft-detail")}>
			<div className={cx("left-container")}>
				<div className={cx("left-img")}>
					<img src={info.imageUrl} />
					{/* <div className={cx("balance")}>2</div> */}
				</div>
			</div>
			<div className={cx("right")}>
				<div className={cx("feature")}>
					<Typography variant="body2" className={cx("tag")}>
						#{info.tokenId}
					</Typography>
					{/* <div className={cx("image")}>
						<img src={`https://images.kawaii.global/kawaii-marketplace-image/category/Icon_Plant.png`} />
					</div> */}
				</div>
				<Typography variant="h4" className={cx("name")}>
					{info.name}
				</Typography>
				{sell && (
					<>
						<Typography variant="body1" className={cx("id")}>
							Quantity: {info.balance}
						</Typography>
						<Typography variant="body1" className={cx("id")}>
							Author: {info.author}
						</Typography>
					</>
				)}
				{auction && (
					<>
						<Typography variant="body1" className={cx("id")}>
							Quantity: {auction.amounts[0]}
						</Typography>
						<Typography variant="body1" className={cx("id")}>
							Author: {info.author}
						</Typography>
						<div className={cx("price-owner")}>
							Owner:{" "}
							<a href={`https://bscscan.com/address/${auction.seller}`} target="_blank">
								{auction.seller.slice(0, 6)}...
								{auction.seller.slice(36)}
							</a>
						</div>
					</>
				)}
				<div className={cx("divider")} />
				{/* <span>
					<Button variant="contained" color="warning" className={cx("button")}>
						Sell NFT
					</Button>
				</span> */}
				<>
					<div className={cx("label")}>Price</div>
					<div className={cx("price")}>
						{auction && <Progress auction={auction} />}

						<div className={cx("price-right")}>
							{sold ? (
								<div className={cx("sold")}>Sold</div>
							) : unavailable ? (
								<>
									<Button variant="contained" color="warning" className={cx("button")} disabled={true}>
										Buy
									</Button>
									<div className={cx("unavailable")}>This auction is no longer available. Please try again later</div>
								</>
							) : isOwner ? (
								<Button variant="contained" color="secondary" className={cx("button")} onClick={onClick}>
									Cancel
								</Button>
							) : sell ? (
								<Button variant="contained" color="secondary" className={cx("button-sell")} onClick={onClick}>
									Sell
								</Button>
							) : (
								<Button variant="contained" color="warning" className={cx("button")} onClick={onClick}>
									Buy
								</Button>
							)}
						</div>
					</div>
				</>
			</div>
		</div>
	);
};

export default NFTDetail;
