import styles from "./NFTDisplay.module.scss";
import cn from "classnames/bind";
import NFTCard from "src/components/common/BundleCard";
import { useState, useEffect } from "react";
import NFTCard2 from "src/components/common/NFTCard2/NFTCard2";
import { BSC_CHAIN_ID } from "src/constants/network";
import addresses from "src/constants/addresses";
import MARKETPLACE_ABI from "src/abi/marketplace.json";
import Pagination from "src/components/common/Pagination";
import axios from "axios";
import URL from "src/constants/endpoint";
import { useWeb3React } from "@web3-react/core";
import NFTList from "./NFTList";
import ListSkeleton from "src/components/common/ListSkeleton/ListSkeleton";
import { setSellBundleList } from "src/lib/redux/slices/bundle";
import { useDispatch } from "react-redux";
import { getAllAuction, getAuctionFullDataByQuery } from "src/lib/api";

const cx = cn.bind(styles);
const PAGE_SIZE = 10;

const NFTDisplay = () => {
	const { account } = useWeb3React();
	const [saleList, setSaleList] = useState();
	const [loading, setLoading] = useState(true);
	const [page, setPage] = useState(1);
	const [sellingLength, setSellingLength] = useState(0);
	const [totalPage, setTotalPage] = useState(1);
	const dispatch = useDispatch();

	useEffect(() => {
		getAuctionList();
	}, [account, page]);

	const getAuctionList = async () => {
		setLoading(true);
		const sellingListAll = await getAllAuction(account);
		const newSellingList = await getAuctionFullDataByQuery(account, page, PAGE_SIZE, "Latest");

		dispatch(setSellBundleList(newSellingList));
		setSaleList(newSellingList);
		setSellingLength(sellingListAll.length);
		setTotalPage(Math.ceil(sellingListAll.length / PAGE_SIZE));
		setLoading(false);
	};

	const handleClick = (event, pageNumber) => {
		setPage(pageNumber);
	};

	let contentComponent;
	let paginationComponent;
	if (loading) {
		contentComponent = <ListSkeleton />;
	} else {
		contentComponent = (
			<>
				<NFTList listNft={saleList} page={page} />
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
			<div className={cx("title")}>On sale ({sellingLength})</div>
			<div className={cx("grid")}>{contentComponent}</div>
			{paginationComponent}
		</>
	);
};

export default NFTDisplay;
