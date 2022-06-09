import styles from "./index.module.scss";
import cn from "classnames/bind";
import NFTDisplay from "./NFTDisplay"
import ProfileInfo from "src/components/Profile/ProfileInfo";

const cx = cn.bind(styles);

export default function Account({ listNft, loading }) {
	return <div className={cx("account")}>
		<ProfileInfo />
		<NFTDisplay listNft={listNft} loading={loading}/>
	</div>;
}
