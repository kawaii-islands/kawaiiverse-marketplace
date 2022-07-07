import styles from "./index.module.scss";
import cn from "classnames/bind";
import ProfileInfo from "src/components/Profile/ProfileInfo";
import NFTDisplay from "./NFTDisplay";

const cx = cn.bind(styles);

const Onsale = () => {
	return (
		<div className={cx("account")}>
			<ProfileInfo />
			<NFTDisplay />
		</div>
	);
};

export default Onsale;
