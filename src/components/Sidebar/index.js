import styles from "./index.module.scss";
import cn from "classnames/bind";
import AccountIcon from "src/assets/icons/AccountIcon";
import AuctionIcon from "src/assets/icons/AuctionIcon";
import SaleIcon from "src/assets/icons/SaleIcon";
import { useParams, useNavigate } from "react-router-dom";

const cx = cn.bind(styles);
const ActiveIconProps = {
	fill: "white",
	stroke: "white",
};
const TABS = [
	{
		icon: props => <AccountIcon {...props} />,
		name: "Account",
		path: "account",
	},
	{
		icon: props => <AuctionIcon {...props} />,
		name: "On Sale",
		path: "on-sale",
	},
	{
		icon: props => <SaleIcon {...props} />,
		name: "Sale",
		path: "sale",
	},
];

export default function Sidebar() {
	const { tab } = useParams();
	const navigate = useNavigate();

	return (
		<div className={cx("sidebar")}>
			{TABS.map(item => {
				const active = item.path === tab;
				const Icon = item.icon;
				const props = active ? ActiveIconProps : {};
				return (
					<div
						className={cx("tab", active && "active")}
						key={item.name}
						onClick={() => navigate(`/profile/${item.path}`)}>
						<Icon {...props} /> {item.name}
					</div>
				);
			})}
		</div>
	);
}
