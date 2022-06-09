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
import { useWeb3React } from "@web3-react/core";
import { toast } from "react-toastify";
import addresses from "src/constants/addresses";
import MARKETPLACE_ABI from "src/abi/marketplace.json";
import ERC20_ABI from "src/abi/erc20.json";
import web3 from "web3";
import { BSC_CHAIN_ID } from "src/constants/network";
import { createNetworkOrSwitch, read, write } from "src/lib/web3";

const cx = cn.bind(styles);

export default function BuyModal({ show, setShow, auction, info, index, setBuying, setStepLoading, setHash }) {
	const { account, chainId, library } = useWeb3React();
	const { kwtPrice } = useSelector(state => state?.price);
	const balance = useSelector(state => state?.balance?.kwtBalance);
	const currentPrice = useMemo(() => getCurrentPriceOnChain(auction), [auction]);
	const [price, setPrice] = useState(currentPrice);

	const callback = hash => {
		setHash(hash);
		setStepLoading(1);
	};

	const buy = async () => {
		try {
			setBuying(true);
			setShow(false);
			if (!price || price < 0) {
				return toast.error("Invalid amount");
			}
			if (Number(price) < Number(currentPrice)) {
				return toast.error("Amount must be greater than current price");
			}
			if (price > balance) {
				return toast.error(`Not enough KWT`);
			}

			if (chainId !== BSC_CHAIN_ID) {
				const error = await createNetworkOrSwitch(library.provider);
				if (error) {
					throw new Error("Please change network to Binance smart chain");
				}
			}

			const allowance = await getAllowance();
			if (Number(allowance) < price * 10 ** 18) {
				await approve();
			}

			await write(
				"bid",
				library.provider,
				addresses.MARKETPLACE,
				MARKETPLACE_ABI,
				[index, web3.utils.toWei(price.toString(), "ether")],
				{
					from: account,
				},
				callback
			);
			setStepLoading(2);
		} catch (error) {
			setStepLoading(-1);
			console.log(error);
			toast.error(error.message || "An error occurred!");
		} finally {
			setBuying(false);
		}
	};

	const getAllowance = async () => {
		return read("allowance", BSC_CHAIN_ID, addresses.KAWAII_TOKEN, ERC20_ABI, [account, addresses.MARKETPLACE]);
	};

	const approve = async () => {
		return await write(
			"approve",
			library.provider,
			addresses.KAWAII_TOKEN,
			ERC20_ABI,
			[addresses.MARKETPLACE, web3.utils.toWei("999999999999999", "ether")],
			{ from: account }
		);
	};

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
								value={price}
								type="number"
								inputProps={{
									min: 0,
								}}
								onChange={e => setPrice(e.target.value)}
								endAdornment={
									<InputAdornment position="end">
										<Box className={cx("adorment")}>
											<img src={tokenIcon} /> <Typography variant="body2">KWT</Typography>
										</Box>
									</InputAdornment>
								}
							/>
						</div>
						<Button variant="contained" color="warning" className={cx("button")} onClick={buy}>
							Buy
						</Button>
					</div>
				</div>
			</div>
		</Modal>
	);
}
