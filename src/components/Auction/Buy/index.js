import { OutlinedInput, Modal, Typography, InputAdornment, Button } from "@mui/material";
import cn from "classnames/bind";
import styles from "./index.module.scss";
import cartIcon from "src/assets/icons/cart.svg";
import { Close } from "@mui/icons-material";
import tokenIcon from "src/assets/icons/kwt.png";
import { Box } from "@mui/system";
import { getCurrentPriceOnChain } from "src/utils/getCurrentPrice";
import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import formatNumber from "src/utils/formatNumber";

const cx = cn.bind(styles);

export default function BuyModal({ show, setShow, auction, info }) {
	const { kwtPrice } = useSelector(state => state?.price);
	const currentPrice = useMemo(() => getCurrentPriceOnChain(auction), [auction]);
	const [amount, setAmount] = useState(currentPrice);

	const buy = async () => {};

	return (
		<Modal
			open={show}
			animation="true"
			onClose={() => {
				setShow(false);
			}}>
			<div className={cx("buy-modal")}>
				<Close
					className={cx("close")}
					htmlColor="#F8A629"
					onClick={() => {
						setShow(false);
					}}
				/>
				<div className={cx("title")}>
					<img src={cartIcon} />
					<Typography variant="h6" className={cx("text")}>
						NFT #{info.tokenId}
					</Typography>
				</div>
				<div className={cx("info")}>
					<div className={cx("avatar")}>
						<img src="https://ipfs.infura.io/ipfs/QmYkx25HnXN8j1FXBGLCfjZYdpv3y9urQfuwzo39JYESRX" />
					</div>
					<div className={cx("right")}>
						<div className={cx("row")}>
							<Typography variant="body1" className={cx("label")}>
								Current price:
							</Typography>
							<Box display="flex">
								<img src={tokenIcon} className={cx("token")} />
								<Typography variant="body1" className={cx("label")}>
									{currentPrice}
								</Typography>
								<Typography variant="body1" className={cx("label", "usd")}>
									(${formatNumber(currentPrice * kwtPrice)})
								</Typography>
							</Box>
						</div>
						<div className={cx("row")}>
							<Typography variant="body1" className={cx("label")}>
								Buy at:
							</Typography>
							<Typography variant="body1" className={cx("label", "usd")}>
								${formatNumber(currentPrice * kwtPrice)}
							</Typography>
						</div>
						<div className={cx("row")}>
							<OutlinedInput
								className={cx("input")}
								value={amount}
								type="number"
								inputProps={{
									min: 0,
								}}
								onChange={e => setAmount(e.target.value)}
								endAdornment={
									<InputAdornment position="end">
										<Box className={cx("adorment")}>
											<img src={tokenIcon} /> <Typography variant="body2">KWT</Typography>
										</Box>
									</InputAdornment>
								}
							/>
						</div>
						<Button variant="contained" color="warning" className={cx("button")}>
							Buy
						</Button>
					</div>
				</div>
			</div>
		</Modal>
	);
}
