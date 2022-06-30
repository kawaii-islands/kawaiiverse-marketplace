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
		const configGetLength = {
			headers: {
				"Content-Type": "application/json",
			},
			params: {
				page: 1,
				limit: 10000,
				sort: "Latest",
			},
		};

		const config = {
			headers: {
				"Content-Type": "application/json",
			},
			params: {
				page: page,
				limit: PAGE_SIZE,
				sort: "Latest",
			},
		};

		const data = {
			filters: { sender: account },
		};

		const resLength = await axios.post(URL + "/marketplace", data, configGetLength);
		let sellingListAll = resLength.data.data;

		const res = await axios.post(URL + "/marketplace", data, config);
		let sellingList = res.data.data;
		console.log("sellingList :>> ", sellingList);

		const newSellingList = await Promise.all(
			sellingList.map(async sellingItem => {
				const response = await axios.get(
					`${URL}/nft/${sellingItem.nft1155Address.toLowerCase()}/${sellingItem.tokenIds1155[0]}`
				);

				const gameLogo = await axios.get(`${URL}/game/logo?contract=` + sellingItem.nft1155Address.toLowerCase());
				return {
					...sellingItem,
					name: response.data.data.name,
					imageUrl: response.data.data.imageUrl,
					gameLogo: gameLogo.data.data[0].logoUrl,
				};
			})
		);

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
