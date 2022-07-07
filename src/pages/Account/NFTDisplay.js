import styles from "./NFTDisplay.module.scss";
import cn from "classnames/bind";
import Pagination from "src/components/common/Pagination";
import { useState, useEffect } from "react";
import NFTList from "./NFTList";
import ListSkeleton from "src/components/common/ListSkeleton/ListSkeleton";

const cx = cn.bind(styles);
const PAGE_SIZE = 10;

const NFTDisplay = ({ listNft, loading }) => {
	const [displayList, setDisplayList] = useState();
	const [totalPage, setTotalPage] = useState();
	const [page, setPage] = useState(1);

	useEffect(() => {
		if (!listNft) return;
		let newnftList = listNft.filter((_, index) => index >= (page - 1) * PAGE_SIZE && index <= page * PAGE_SIZE - 1);
		setDisplayList(newnftList);
		setTotalPage(Math.ceil(listNft.length / PAGE_SIZE));
	}, [listNft]);

	const handleClick = (_, pageNumber) => {
		let newnftList = listNft.filter(
			(_, index) => index >= (pageNumber - 1) * PAGE_SIZE && index <= pageNumber * PAGE_SIZE - 1
		);
		setDisplayList(newnftList);
		setPage(pageNumber);
	};

	let contentComponent;
	let paginationComponent;
	if (loading) {
		contentComponent = <ListSkeleton />;
	} else {
		contentComponent = (
			<>
				<NFTList listNft={displayList} page={page} />
			</>
		);
	}

	if (totalPage <= 1 || loading) {
		paginationComponent = <></>;
	} else {
		paginationComponent = <Pagination count={totalPage} page={page} onChange={handleClick} />;
	}

	return (
		<>
			<div className={cx("title")}>NFTs balance</div>
			<div className={cx("grid")}>{contentComponent}</div>
			{paginationComponent}
		</>
	);
};

export default NFTDisplay;
