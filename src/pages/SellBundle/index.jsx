import React from "react";
import styles from "./index.module.scss";
import cn from "classnames/bind";
import ProfileInfo from "src/components/Profile/ProfileInfo";
import { useQuery } from "react-query";
import { getListNFT } from "src/lib/api";

const cx = cn.bind(styles);

const SellBundle = () => {
	// const { isLoading, error, data } = useQuery("getListNFT", () => getListNFT(query));

	// let list;

	// if (isLoading) list = <div>Loading</div>;
	// if (error) list = <div>Error</div>;
	// if (data) list = <ListNFT items={data?.data || []} totalItems={Math.ceil(data?.option?.totalItem / limit) || 0} />;

	return (
		<div className={cx("sell-bundle")}>
			<ProfileInfo />
			<div className={cx("title")}>Sale</div>
		</div>
	);
};

export default SellBundle;
