import styles from "./index.module.scss";
import cn from "classnames/bind";
import NFTDisplay from "./NFTDisplay"
import Profile from "src/components/Profile/Profile";

const cx = cn.bind(styles);

export default function Account() {
	return <div className={cx("account")}>
		<Profile/>
		<NFTDisplay/>
	</div>;
}
