import React, { useState } from "react";
import styles from "./index.module.scss";
import cn from "classnames/bind";
import ProfileInfo from "src/components/Profile/ProfileInfo";
import { useQuery } from "react-query";
import { getListNFT } from "src/lib/api";
import SellModal from "src/components/Detail/SellModal";
import cartIcon from "src/assets/icons/cart.png";
import { Badge, Button, Grid } from "@mui/material";
import NFTCardSellBundle from "src/components/common/NFTCardSellBundle";
import ListSkeleton from "src/components/common/ListSkeleton/ListSkeleton";
import { useWeb3React } from "@web3-react/core";
import { useEffect } from "react";
import LoadingModal from "src/components/common/LoadingModal/LoadingModal";
import BundleCardSell from "src/components/common/BundleCardSell";
import NFTList from "./NFTList";
import Pagination from "src/components/common/Pagination";

const cx = cn.bind(styles);
const PAGE_SIZE = 10;

const SellBundle = ({ listNft, loading }) => {
	const [listSellBundle, setListSellBundle] = useState([]);
	const [sellNFTs, setSellNFTs] = useState({});
	const [listSellingContract, setListSellingContract] = useState([]);
	const [selling, setSelling] = useState();
	const [loadingTitle, setLoadingTitle] = useState("");
	const [stepLoading, setStepLoading] = useState(0);
	const [hash, setHash] = useState();
	const [info, setInfo] = useState({ contract: "", tokenId: [], balance: [] });
	const [show, setShow] = useState(false);
	const { account } = useWeb3React();
	const [page, setPage] = useState(1);
	const [sellingLength, setSellingLength] = useState(0);
	const [totalPage, setTotalPage] = useState(1);
	const [displayList, setDisplayList] = useState();

	useEffect(() => {
		initAddressArray();
		initData();
	}, [listNft]);

	const initData = async () => {
		let newnftList = listNft?.filter((_, index) => index >= (page - 1) * PAGE_SIZE && index <= page * PAGE_SIZE - 1);
		setDisplayList(newnftList);
		setTotalPage(Math.ceil(listNft?.length / PAGE_SIZE));
	};

	const handleClick = (_, pageNumber) => {
		let newnftList = listNft.filter(
			(_, index) => index >= (pageNumber - 1) * PAGE_SIZE && index <= pageNumber * PAGE_SIZE - 1
		);
		setDisplayList(newnftList);
		setPage(pageNumber);
	};

	const initAddressArray = () => {
		if (!listNft) return;
		let array = listNft.map((game, index) => {
			return { contract: game.detail.contract, isSell: 0 };
		});
		setListSellingContract(array);
	};

	const updateInfo = (key, value) => {
		let tmpInfo;
		tmpInfo = { ...info, [key]: value };
		setInfo(tmpInfo);
	};

	const totalNFTs = Object.keys(sellNFTs).reduce((a, b) => {
		return a + sellNFTs[b];
	}, 0);

	const updateData = () => {
		let tmpInfo = info;
		let idList = [];
		let amountList = [];
		let keys = Object.keys(sellNFTs);
		let values = Object.values(sellNFTs);
		amountList = values.filter(value => value != "0");
		let indexList = values.map((value, index) => {
			if (value != "0") return index;
		});
		idList = keys.filter((_, index) => indexList.includes(index));
		tmpInfo = { ...tmpInfo, balance: amountList };
		tmpInfo = { ...tmpInfo, tokenId: idList };
		setInfo(tmpInfo);
	};

	let contentComponent;
	let paginationComponent;

	if (loading) {
		contentComponent = (
			<div style={{ display: "flex", flexWrap: "wrap" }}>
				<ListSkeleton />
			</div>
		);
	} else {
		contentComponent = (
			<NFTList
				listNft={displayList}
				page={page}
				setListSellBundle={setListSellBundle}
				sellNFTs={sellNFTs}
				setSellNFTs={setSellNFTs}
				setListSellingContract={setListSellingContract}
				updateInfo={updateInfo}
				listSellingContract={listSellingContract}
			/>
		);
	}

	if (totalPage <= 1 || loading) {
		paginationComponent = <></>;
	} else {
		paginationComponent = <Pagination count={totalPage} page={page} onChange={handleClick} />;
	}

	return (
		<div className={cx("sell-bundle")}>
			<ProfileInfo />
			<div className={cx("header")}>
				<div className={cx("title")}>Sale ({listNft?.length})</div>
				<div className={cx("right")}>
					<Badge badgeContent={totalNFTs} color="primary" max={100000} showZero>
						<img src={cartIcon} alt="cart" width={30} />
					</Badge>
					<Button
						className={cx("btn")}
						disabled={!totalNFTs}
						onClick={() => {
							updateData();
							setShow(true);
						}}>
						Sell
					</Button>
				</div>
			</div>
			<div className={cx("listNft")}>
				{contentComponent}
				{/* {loading ? (
					<div style={{ display: "flex", flexWrap: "wrap" }}>
						<ListSkeleton />
					</div>
				) : (
					<>
						<NFTList
							listNft={listNft}
							page={page}
							setListSellBundle={setListSellBundle}
							sellNFTs={sellNFTs}
							setSellNFTs={setSellNFTs}
							setListSellingContract={setListSellingContract}
							updateInfo={updateInfo}
							listSellingContract={listSellingContract}
						/>
					</>
				)} */}
			</div>
			{paginationComponent}

			<SellModal
				show={show}
				setShow={setShow}
				info={info}
				sellNFTs={sellNFTs}
				setSelling={setSelling}
				setLoadingTitle={setLoadingTitle}
				setStepLoading={setStepLoading}
				setHash={setHash}
				isBundle={true}
			/>

			{selling && (
				<LoadingModal
					show={selling}
					network={"BscScan"}
					loading={true}
					title={loadingTitle}
					stepLoading={stepLoading}
					onHide={() => {
						setUploadGameLoading(false);
						setHash(undefined);
						setStepLoading(0);
					}}
					hash={hash}
					hideParent={() => {}}
				/>
			)}
		</div>
	);
};

export default SellBundle;
