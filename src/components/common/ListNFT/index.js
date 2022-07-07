import NFTCard from "src/components/common/BundleCard";
import { Grid } from "@mui/material";
import cn from "classnames/bind";
import Pagination from "src/components/common/Pagination";
import NFTCard2 from "../NFTCard2/NFTCard2";
import styles from "./index.module.scss";

const cx = cn.bind(styles);

export default function ListNFT({ items, totalItems, setCurrentPage }) {
	return (
		<>
			<div className={cx("grid")}>
				{items &&
					items.map((item, idx) =>
						item.isBundle ? (
							<NFTCard auction={item} key={idx} type="marketplace" />
						) : (
							<NFTCard2 item={item} key={idx} type="marketplace" />
						)
					)}
			</div>

			<Pagination count={totalItems} color="primary" shape="rounded" onChange={(e, page) => setCurrentPage(page)} />
		</>
	);
}
