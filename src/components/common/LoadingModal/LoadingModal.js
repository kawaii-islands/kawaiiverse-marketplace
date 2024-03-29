import React from "react";
import { Modal } from "react-bootstrap";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import cn from "classnames/bind";
import styles from "./LoadingModal.module.scss";
import upload from "src/assets/icons/upload.svg";
import loadingProcess from "src/assets/icons/loading1.png";
import { Button } from "@material-ui/core";
import logoSuccess from "src/assets/icons/success.png";
import warning from "src/assets/icons/error1.png";
import { useNavigate } from "react-router-dom";

const cx = cn.bind(styles);
const EXPLORER = {
	Etherscan: "https://etherscan.io",
	BscScan: "https://testnet.bscscan.com",
};

const LoadingModal = ({
	setIsSellNFT,
	show,
	network,
	loading,
	title,
	stepLoading,
	onHide,
	hash,
	hideParent,
	notClose,
	notViewNft,
}) => {
	const navigate = useNavigate();

	return (
		<Modal
			show={show}
			dialogClassName={cx("loading-modal")}
			centered
			onHide={() => {
				if (notClose) {
					if (stepLoading < 2) return;
				}

				if (!loading || stepLoading === 1) {
					if ((stepLoading === 2 || stepLoading === 1) && hideParent) {
						hideParent();
					}

					onHide();
				}
			}}
			backdrop="static"
			style={{
				borderRadius: "8px",
			}}>
			<Modal.Body className={cx("modal-body")}>
				<div className={cx("top-body")}>
					<ClearRoundedIcon
						className={cx("icon-cancel")}
						onClick={() => {
							if (notClose) {
								if (stepLoading < 2) return;
							}
							if (!loading || stepLoading === 1) {
								if ((stepLoading === 2 || stepLoading === 1) && hideParent) {
									hideParent();
								}

								onHide();
							}
						}}
					/>
				</div>
				{stepLoading === 2 ? (
					<div>
						<div className={cx("center-body")}>
							<img src={logoSuccess} alt="upload-icon" />
						</div>
						<div className={cx("bottom-body")}>
							<div className={cx("title")}>
								<div className={cx("title")}>Transaction confirmed</div>
							</div>
							<br />
							{hash && (
								<a
									href={`${EXPLORER[network]}/tx/${hash}`}
									target="_blank"
									style={{ color: "#fff", textDecoration: "none" }}>
									<Button className={cx("MuiButton-root")} size="large">
										View on {network}
									</Button>
								</a>
							)}
							<br />
							{!notViewNft && (
								<Button
									onClick={() => {
										navigate({ search: "?view=true" });
										setIsSellNFT(false);
									}}
									size="medium"
									style={{ background: "#A86C60", color: "#FFFFFF", marginTop: 10, width: "70%" }}>
									View NFT
								</Button>
							)}
						</div>
					</div>
				) : stepLoading === 1 ? (
					<div>
						<div className={cx("center-body")}>
							<div className={cx("icn-spinner")}>
								<img src={loadingProcess} alt="icon-loading" />
							</div>
						</div>
						<div className={cx("bottom-body")}>
							<div className={cx("title")}>Transaction submitted</div>
							<div className={cx("content")}>Waiting for confirmation</div>
							<br />
							{hash && (
								<a
									href={`${EXPLORER[network]}/tx/${hash}`}
									target="_blank"
									style={{ color: "#fff", textDecoration: "none" }}>
									<Button className={cx("MuiButton-root")} size="large">
										View on {network}
									</Button>
								</a>
							)}
						</div>
					</div>
				) : stepLoading === 0 ? (
					<div>
						<div className={cx("center-body")}>
							<div className={cx("icn-spinner")}>
								<img src={loadingProcess} alt="icon-loading" />
							</div>
						</div>
						<div className={cx("bottom-body")}>
							<div className={cx("title")}>{title}</div>
							<div className={cx("content")}>
								<div className={cx("content")}>Confirm this transaction in your wallet</div>
							</div>
						</div>
					</div>
				) : stepLoading === null ? (
					<div>
						<div className={cx("center-body")}>
							<div className={cx("icn-spinner")}>
								<img src={loadingProcess} alt="icon-loading" />
							</div>
						</div>
						<div className={cx("bottom-body")}>
							<div className={cx("title")}>{title}</div>
						</div>
					</div>
				) : (
					<div>
						<div className={cx("center-body")}>
							<img src={warning} alt="icon-warning" />
						</div>
						<div className={cx("bottom-body")}>
							<div className={cx("title")}>Transaction failed</div>
						</div>
					</div>
				)}
			</Modal.Body>
		</Modal>
	);
};

export default LoadingModal;
