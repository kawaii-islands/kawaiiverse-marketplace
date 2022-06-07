import styles from "./Profile.module.scss";
import cn from "classnames/bind";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Tooltip from "@mui/material/Tooltip";
import { useWeb3React } from "@web3-react/core";
import bnbLogo from "src/assets/icons/bnb.png";
import kwtLogo from "src/assets/icons/kwt.png";
import milkyLogo from "src/assets/icons/milky.png";
import kawaiiLogo from "src/assets/images/logo.png";
import { Grid } from "@mui/material";

const cx = cn.bind(styles);

const Profile = () => {
	const { account } = useWeb3React();
	return (
		<>
			<div className={cx("title")}>Profile</div>
			<div className={cx("block")}>
				<div className={cx("infor")}>
					<div className={cx("balance")}>
						<div className={cx("top")}>
							<div>
								<div className={cx("label")}>Total Balance</div>
								<div className={cx("amount")}>$1000</div>
							</div>
							<div className={cx("token")}>
								<div className={cx("token-label")}>
									<div>KWT</div>
								</div>
								<div className={cx("token-bottom")}>
									<div className={cx("left")}>
										<img src={kwtLogo} />
									</div>
									<div
										style={{
											display: "flex",
										}}>
										<div>23</div>
										<Tooltip title="Buy KWT">
											<a
												href="https://pancakeswap.finance/swap?outputCurrency=0x257a8d1e03d17b8535a182301f15290f11674b53"
												target="_blank"
												className={cx("buy")}>
												+
											</a>
										</Tooltip>
									</div>
								</div>
							</div>
						</div>
						<div className={cx("tokens")}>
							<div className={cx("token")}>
								<div className={cx("token-label")}>
									<div>MILKY</div>
								</div>
								<div className={cx("token-bottom")}>
									<div className={cx("left")}>
										<img src={milkyLogo} />
									</div>
									<div
										style={{
											display: "flex",
										}}>
										<div>23</div>
										<Tooltip title="Buy MILKY">
											<a
												href="https://pancakeswap.finance/swap?outputCurrency=0x6fe3d0f096fc932a905accd1eb1783f6e4cec717"
												target="_blank"
												className={cx("buy")}>
												+
											</a>
										</Tooltip>
									</div>
								</div>
							</div>
							<div className={cx("token")}>
								<div className={cx("token-label")}>BNB</div>
								<div className={cx("token-bottom")}>
									<div className={cx("left")}>
										<img src={bnbLogo} />
									</div>
									<div>12</div>
								</div>
							</div>
						</div>
					</div>
					<div className={cx("address")}>
						Address: {`${account?.slice(0, 6)}...${account?.slice(account?.length - 6)}`}
						<div className={cx("icons")}>
							<CopyToClipboard text={account} onCopy={() => toast.success("Copied!")}>
								<img className={cx("icon")} src={require("src/assets/icons/copy.svg").default} />
							</CopyToClipboard>
							<a href={`https://bscscan.com/address/${account}`} target="_blank">
								<img className={cx("icon")} src={require("src/assets/icons/exit.svg").default} />
							</a>
						</div>
					</div>
				</div>
				<div className={cx("category")}>
					<div className={cx("top")}>
						<div className={cx("top-item")}>
							<img src={kawaiiLogo} />
							<div className={cx("text")}>Kawaii Islands</div>
						</div>
						<div className={cx("top-item")}>
							<img src={kawaiiLogo} />
							<div className={cx("text")}>Kawaii Islands</div>
						</div>
					</div>
					<div className={cx("bottom")}>
						<div className={cx("bottom-item")}>
							<img src={kawaiiLogo} />
							<div className={cx("text")}>Kawaii Islands</div>
						</div>
						<div className={cx("bottom-item")}>
							<img src={kawaiiLogo} />
							<div className={cx("text")}>Kawaii Islands</div>
						</div>
						<div className={cx("bottom-item")}>
							<img src={kawaiiLogo} />
							<div className={cx("text")}>Kawaii Islands</div>
						</div>
					</div>
				</div>
			</div>
			<div className={cx("divider")} />
		</>
	);
};
export default Profile;
