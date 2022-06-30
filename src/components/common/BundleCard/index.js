import { useEffect, useState } from "react";
import styles from "./index.module.scss";
import cn from "classnames/bind";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { getCurrentPriceFromBackend } from "src/utils/getCurrentPrice";
import { selectPrice } from "src/lib/redux/slices/price";
import { useSelector } from "react-redux";
import axios from "axios";
import URL from "src/constants/endpoint";
import { useNavigate } from "react-router-dom";

const cx = cn.bind(styles);

const NFTCard = ({ auction, price }) => {
	const { kwtPrice } = useSelector(selectPrice);
	const [totalItems, setTotalItem] = useState();
	const [currentIndex, setCurrentIndex] = useState(0);
	const [dataList, setDataList] = useState([]);
	const navigate = useNavigate();

	useEffect(() => {
		initData();
	}, [currentIndex]);

	const initData = async () => {
		let tmpTotal = 0;

		auction.amounts.map(amount => {
			tmpTotal += amount;
		});

		setTotalItem(tmpTotal);
		await Promise.all(
			auction.tokenIds1155.map(async id => {
				const res = await axios.get(`${URL}/nft/${auction.nft1155Address}/${id}`);
				if (res.data.data) {
					// console.log(res.data.data.imageUrl);
					return res.data.data;
				}
			})
		).then(responses => {
			console.log(responses);
			setDataList(responses);
		});
	};
	// console.log(auction);

	return (
		<div className={cx("nft-card")}>
			<div
				className={cx("nft-card-container")}
				onClick={() => navigate(`/detailBundle/${auction.nft1155Address}/${auction.auctionIndex}`)}>
				<div className={cx("nft-card-container-title")}>
					<div>
						<div className={cx("nft-card-container-title-name")}>Bundle #{auction.auctionIndex}</div>
						<div className={cx("nft-card-container-title-total")}>
							{totalItems} items of {auction.amounts.length} types
						</div>
					</div>
				</div>
				<div className={cx("nft-card-container-header")}>
					<div className={cx("tag")}>#{auction.tokenIds1155[currentIndex]}</div>
					<img src={auction.gameLogo} className={cx("logo")} />
				</div>
				<div className={cx("image")}>
					<img className={cx("avatar")} src={dataList[currentIndex]?.imageUrl} />
					<div
						className={cx("arrow", "back")}
						onClick={e => {
							if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
						}}>
						<ArrowBackIosIcon htmlColor="#e68b00" style={{ fontSize: 16, marginLeft: 4 }} />
					</div>
					<div
						className={cx("arrow", "forward")}
						onClick={e => {
							// e.stopPropagation();
							if (currentIndex + 1 < auction.amounts.length) setCurrentIndex(currentIndex + 1);
						}}>
						<ArrowForwardIosIcon htmlColor="#e68b00" style={{ fontSize: 16 }} />
					</div>
					<div className={cx("balance")}>{auction.amounts[currentIndex]}</div>
				</div>
				<div className={cx("name")}>{dataList[currentIndex]?.name}</div>
				<div className={cx("price")}>
					<img src={require(`src/assets/icons/kwt.png`)} />
					<div className={cx("amount")}>{getCurrentPriceFromBackend(auction)}</div>
					<div className={cx("dollar")}>${(parseInt(getCurrentPriceFromBackend(auction)) * kwtPrice).toFixed(4)}</div>
				</div>
			</div>
		</div>
	);
};

export default NFTCard;
