import styles from "./index.module.scss";
import cn from "classnames/bind";

const cx = cn.bind(styles);

export default function Account() {
	return <div className={cx("account")}></div>;
}
