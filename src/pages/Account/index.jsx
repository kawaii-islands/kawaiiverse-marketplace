import styles from "./index.module.scss";
import cn from "classnames/bind";
import { read } from "src/lib/web3";
import addresses from "src/constants/addresses";
import { useQuery } from "react-query";
import useGetListGame from "src/utils/hooks/useGetListGame";

const cx = cn.bind(styles);

export default function Account() {
	const listGame = useGetListGame();
	return <div className={cx("account")}></div>;
}
