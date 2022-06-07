import styles from "./index.module.scss";
import cn from "classnames/bind";
import Profile from "src/components/Profile/Profile";
import NFTDisplay from "./NFTDisplay";

const cx = cn.bind(styles);

const Onsale = () => {
	return (
		<div className={cx("account")}>
			<Profile />
			<NFTDisplay />
		</div>
	);
};

export default Onsale;
