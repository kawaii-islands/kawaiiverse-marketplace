import styles from "./index.module.scss";
import cn from "classnames/bind";
import { Typography } from "@mui/material";
import kwtLogo from "src/assets/icons/kwt.png";
import { getCurrentPriceFromBackend } from "src/utils/getCurrentPrice";
import formatNumber from "src/utils/formatNumber";
import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useQuery } from "react-query";
import { getNFT } from "src/lib/api";
import { useNavigate } from "react-router-dom";
import AddCircleOutlineRoundedIcon from "@mui/icons-material/AddCircleOutlineRounded";
import RemoveCircleOutlineRoundedIcon from "@mui/icons-material/RemoveCircleOutlineRounded";

const cx = cn.bind(styles);

export default function NFTCardSellBundle({
	item,
	setListSellBundle,
	sellNFTs,
	setSellNFTs,
	listSellingContract,
	setListSellingContract,
	updateInfo,
	index,
}) {
	const id = item?.tokenIds1155?.[0] || "";
	const amount = item?.amounts?.[0] || "";
	const kwtPrice = useSelector(state => state.price?.kwtPrice);
	const [input, setInput] = useState(sellNFTs?.[item.tokenId] || 0);

	const handleInput = () => {};
	const checkExist = (array, element) => {
		return array.find(e => e === element);
	};

	return (
		<div className={cx("card")}>
			<Typography variant="body2" className={cx("id")}>
				{item?.detail.tokenId}
			</Typography>
			<div className={cx("avatar")}>
				<img src={item ? item?.detail.imageUrl : ""} />
				<Typography variant="body1" className={cx("balance")}>
					{item?.balance}
				</Typography>
			</div>
			<Typography variant="body1" className={cx("name")}>
				{item?.detail.name}
			</Typography>
			<div className={cx("selectNumber")}>
				<RemoveCircleOutlineRoundedIcon
					className={cx("icon")}
					onClick={() => {
						updateInfo("contract", item?.game.address);
						if (sellNFTs[item?.detail.tokenId]) {
							setInput(sellNFTs[item?.detail.tokenId] - 1);
							setSellNFTs(sellNFTs => ({
								...sellNFTs,
								[item?.detail.tokenId]: sellNFTs[item?.detail.tokenId] - 1,
							}));
							if (sellNFTs[item?.detail.tokenId] - 1 == 0) {
								let tmpArray = [...listSellingContract];
								tmpArray[index] = { ...tmpArray[index], isSell: 0 };
								setListSellingContract(tmpArray);
							}
						}
					}}
				/>
				<input
					type="number"
					className={cx("input")}
					value={input}
					min={0}
					max={item?.balance}
					// pattern="^[1-9][0-9]*$"
					onChange={e => {
						const { value } = e.target;
						updateInfo("contract", item?.game.address);
						if (
							value === "" ||
							(!isNaN(value) && Number.isInteger(Number(value)) && Number(value) >= 1 && Number(value) <= item?.balance)
						) {
							setInput(value);
							setSellNFTs(sellNFTs => ({
								...sellNFTs,
								[item?.detail.tokenId]: Number(value),
							}));
							if (
								!isNaN(value) &&
								Number.isInteger(Number(value)) &&
								Number(value) >= 1 &&
								Number(value) <= item?.balance
							) {
								let tmpArray = [...listSellingContract];
								tmpArray[index] = { ...tmpArray[index], isSell: 1 };
								setListSellingContract(tmpArray);
							}
						}
					}}
				/>

				<AddCircleOutlineRoundedIcon
					className={cx("icon")}
					onClick={() => {
						updateInfo("contract", item?.game.address);
						if (!sellNFTs[item?.detail.tokenId]) {
							setInput(1);
							setSellNFTs(sellNFTs => ({
								...sellNFTs,
								[item?.detail.tokenId]: 1,
							}));
						} else if (sellNFTs[item?.detail.tokenId] < item?.balance) {
							setInput(sellNFTs[item?.detail.tokenId] + 1);
							setSellNFTs(sellNFTs => ({
								...sellNFTs,
								[item?.detail.tokenId]: sellNFTs[item?.detail.tokenId] + 1,
							}));
						}
						let tmpArray = [...listSellingContract];
						tmpArray[index] = { ...tmpArray[index], isSell: 1 };
						setListSellingContract(tmpArray);
					}}
				/>
			</div>
		</div>
	);
}
