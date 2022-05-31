import styles from "./NFTDisplay.module.scss";
import cn from "classnames/bind";
import NFTCard2 from "src/components/common/NFTCard2/NFTCard2";

const cx = cn.bind(styles);
import { useState, useEffect } from "react";

const NFTList = ({ listNft, page }) => {
	useEffect(() => {
		console.log(page);
	}, [page]);
	return <div className={cx("grid")}>{listNft && listNft.map((item, idx) => <NFTCard2 item={item} key={idx} />)}</div>;
};
export default NFTList;
