import styles from "./index.module.scss";
import cn from "classnames/bind";
import { Typography } from "@mui/material";
import kwtLogo from "src/assets/icons/kwt.png";
import { getCurrentPriceFromBackend } from "src/utils/getCurrentPrice";
import formatNumber from "src/utils/formatNumber";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { useQuery } from "react-query";
import { getNFT } from "src/lib/api";
import { useNavigate } from "react-router-dom";

const cx = cn.bind(styles);

export default function NFTCard({ item }) {
	const id = item?.tokenIds1155?.[0] || "";
	console.log(id);
	const amount = item?.amounts?.[0] || "";
	const kwtPrice = useSelector(state => state.price?.kwtPrice);
	const currentPrice = useMemo(() => getCurrentPriceFromBackend(item), [item]);
	const { isLoading, error, data } = useQuery(`nft/${item.nft1155Address}/${id}`);
	const navigate = useNavigate();

	return (
		<div className={cx("card")} onClick={() => navigate(`/auction/${item.auctionIndex}`)}>
			<Typography variant="body2" className={cx("id")}>
				#{id}
			</Typography>
			<div className={cx("avatar")}>
				<img src={data ? data?.imageUrl : ""} />
				<Typography variant="body1" className={cx("balance")}>
					{amount}
				</Typography>
			</div>
			<Typography variant="body1" className={cx("name")}>
				{!!data?.name ? data?.name : ""}
			</Typography>
			<div className={cx("price")}>
				<img src={kwtLogo} />
				<Typography className={cx("amount")}>{formatNumber(currentPrice)}</Typography>
				<Typography className={cx("usd")}>${formatNumber(currentPrice * kwtPrice)}</Typography>
			</div>
		</div>
	);
}
