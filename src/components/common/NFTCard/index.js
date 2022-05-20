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

const cx = cn.bind(styles);

export default function NFTCard({ item }) {
	const id = item?.tokenIds1155?.[0] || "";
	const amount = item?.amounts?.[0] || "";
	const kwtPrice = useSelector(state => state.price?.kwtPrice);
	const currentPrice = useMemo(() => getCurrentPriceFromBackend(item), [item]);
	const { isLoading, error, data } = useQuery("getNFT", () => getNFT(item.nft1155Address, id));

	return (
		<div className={cx("card")}>
			<Typography variant="body2" className={cx("id")}>
				#{id}
			</Typography>
			<div className={cx("avatar")}>
				<img src={data?.data ? data?.data?.imageUrl : ""} />
				<Typography variant="body1" className={cx("balance")}>
					{amount}
				</Typography>
			</div>
			<Typography variant="body1" className={cx("name")}>
				{!!data?.data?.name ? data?.data?.name : ""}
			</Typography>
			<div className={cx("price")}>
				<img src={kwtLogo} />
				<Typography className={cx("amount")}>{formatNumber(currentPrice)}</Typography>
				<Typography className={cx("usd")}>${formatNumber(currentPrice * kwtPrice)}</Typography>
			</div>
		</div>
	);
}
