import NFTCard2 from "src/components/common/NFTCard2/NFTCard2";
import NFTCard from "src/components/common/BundleCard";

import { useEffect } from "react";

const NFTList = ({ listNft, page }) => {
	useEffect(() => {}, [page]);
	return (
		<>
			{listNft &&
				listNft.map((item, idx) =>
					item.isBundle ? <NFTCard auction={item} key={idx} /> : <NFTCard2 item={item} key={idx} type="onSale" />
				)}
		</>
	);
};
export default NFTList;
