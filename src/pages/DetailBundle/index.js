import { useState, useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
import { useParams } from "react-router-dom";
import styles from "./index.module.scss";
import cn from "classnames/bind";
import { Grid, Typography } from "@mui/material";
import CarouselComponent from "./CarouselComponent";
import NftInformation from "./NftInformation";
import NftImage from "./NftImage";
import URL from "src/constants/endpoint";
import axios from "axios";
import { useSelector } from "react-redux";

const cx = cn.bind(styles);
const PAGE_SIZE = 10;

const DetailBundle = () => {
	const { account } = useWeb3React();
	const { gameAddress, auction } = useParams();
	const [page, setPage] = useState(1);
	const sellBundleList = useSelector(state => state.sellBundleList);
	const [bundleInfo, setBundleInfo] = useState();
	const [listNftInBundle, setListNftInBundle] = useState([]);
	const [item, setItem] = useState(0);

	useEffect(() => {
		console.log("sellBundleList :>> ", sellBundleList);
		const nft = sellBundleList?.filter(item => item.auctionIndex.toString() === auction.toString())[0];
		setBundleInfo(nft);
	}, [auction, sellBundleList]);

	useEffect(() => {
		if (bundleInfo) {
			getAllNftInfo();
		}
	}, [bundleInfo]);

	const getAllNftInfo = async () => {
		const list = await Promise.all(
			bundleInfo.tokenIds1155.map(async (nftId, index) => {
				const response = await axios.get(`${URL}/nft/${gameAddress.toLowerCase()}/${nftId}`);
				const gameLogo = await axios.get(`${URL}/game/logo?contract=` + bundleInfo.nft1155Address.toLowerCase());

				return {
					...response,
					gameLogo: gameLogo.data.data[0].logoUrl,
				};
			})
		);

		setListNftInBundle(list);
		console.log("list :>> ", list);
		return list;
	};

	return (
		<div className={cx("bundle-detail")}>
			{console.log("item :>> ", item)}
			<div className={cx("container")}>
				<Grid container spacing={8}>
					<Grid item xs={5}>
						<NftImage
							bundleInfo={bundleInfo}
							nftInfo={listNftInBundle[item]}
							item={item}
							setItem={setItem}
							listNftInBundle={listNftInBundle}
						/>
					</Grid>
					<Grid item xs={7}>
						<NftInformation bundleInfo={bundleInfo} nftInfo={listNftInBundle[item]} />
					</Grid>
				</Grid>
			</div>
		</div>
	);
};

export default DetailBundle;
