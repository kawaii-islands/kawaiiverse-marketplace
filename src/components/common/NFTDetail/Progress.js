//@ts-nocheck
import { useMemo } from "react";
import styles from "./Progress.module.scss";
import cn from "classnames/bind";
import moment from "moment";
import formatNumber from "src/utils/formatNumber";
import kwtLogo from "src/assets/icons/kwt.png";
import { useSelector } from "react-redux";
import { getCurrentPriceOnChain } from "src/utils/getCurrentPrice";
import web3 from "web3";

const cx = cn.bind(styles);

const Progress = ({ auction }) => {
	const { kwtPrice } = useSelector(state => state?.price);
	const startingPrice = web3.utils.fromWei(auction.startingPrice);
	const endingPrice = web3.utils.fromWei(auction.endingPrice);
	const duration = auction.duration;
	const startedAt = auction.startedAt;
	const currentPrice = useMemo(() => getCurrentPriceOnChain(auction), [auction]);
	const currentPriceDollar = currentPrice * kwtPrice;
	const isFixed = auction.startingPrice === auction.endingPrice;
	const percent = Math.min(((Date.now() / 1000 - startedAt) / duration) * 100, 100);
	const isEnd = Date.now() / 1000 > startedAt + duration;

	return (
		<div className={cx("container")}>
			{!isEnd && !isFixed && (
				<div>
					<div className={cx("progress")}>
						<div className={cx("progress-start")}>
							<img src={kwtLogo} />
							{formatNumber(Number(startingPrice))}
						</div>
						<div>
							<div className={cx("duration")}>{moment.unix(duration + startedAt).fromNow()}</div>
							<div className={cx("progress-bar")}>
								<div className={cx("progress-bar-start")}></div>
								<div className={cx("progress-bar-center")}>
									<div className={cx("progress-bar-center-overlay")} style={{ width: `${percent}%` }}></div>
								</div>
								<div className={cx("progress-bar-end")}></div>
							</div>
						</div>
						<div className={cx("progress-end")}>
							<img src={kwtLogo} />
							{formatNumber(Number(endingPrice))}
						</div>
					</div>
				</div>
			)}
			<div className={cx("current-price")}>
				<div className={cx("amount")}>
					<img src={kwtLogo} /> {formatNumber(currentPrice)}
				</div>
				<div className={cx("dollar")}>(${formatNumber(currentPriceDollar)})</div>
			</div>
		</div>
	);
};

export default Progress;
