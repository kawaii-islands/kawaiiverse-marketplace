import React, { useState } from "react";
import styles from "./index.module.scss";
import cn from "classnames/bind";
import ProfileInfo from "src/components/Profile/ProfileInfo";
import { useQuery } from "react-query";
import { getListNFT } from "src/lib/api";
import cartIcon from "src/assets/icons/cart.png";
import { Badge, Button, Grid } from "@mui/material";
import NFTCardSellBundle from "src/components/common/NFTCardSellBundle";
import ListSkeleton from "src/components/common/ListSkeleton/ListSkeleton";
import { useWeb3React } from "@web3-react/core";

const cx = cn.bind(styles);

const SellBundle = ({ listNft, loading }) => {
	const [listSellBundle, setListSellBundle] = useState([]);
	const [sellNFTs, setSellNFTs] = useState({});
	console.log("sellNFTs :>> ", sellNFTs);
	const [show, setShow] = useState(false);
	const { account } = useWeb3React();

	const totalNFTs = Object.keys(sellNFTs).reduce((a, b) => {
		return a + sellNFTs[b];
	}, 0);

	return (
		<div className={cx("sell-bundle")}>
			<ProfileInfo />
			<div className={cx("header")}>
				<div className={cx("title")}>Sale ({listNft?.length})</div>
				<div className={cx("right")}>
					<Badge badgeContent={totalNFTs} color="primary" max={100000} showZero>
						<img src={cartIcon} alt="cart" width={30} />
					</Badge>
					<Button
						className={cx("btn")}
						disabled={!totalNFTs}
						onClick={() => {
							setShow(true);
						}}>
						Sell
					</Button>
				</div>
			</div>
			<div className={cx("listNft")}>
				{loading ? (
					<div style={{ display: "flex", flexWrap: "wrap" }}>
						<ListSkeleton />
					</div>
				) : (
					<Grid container spacing={2} justifyContent="center">
						{listNft.map((item, index) => (
							<Grid item key={item.detail._id}>
								<NFTCardSellBundle
									item={item}
									setListSellBundle={setListSellBundle}
									sellNFTs={sellNFTs}
									setSellNFTs={setSellNFTs}
								/>
							</Grid>
						))}
					</Grid>
				)}
			</div>

			{/* <SellModal
				show={show}
				setShow={setShow}
				info={info}
				setSelling={setSelling}
				setLoadingTitle={setLoadingTitle}
				setStepLoading={setStepLoading}
				setHash={setHash}
			/> */}
		</div>
	);
};

export default SellBundle;
