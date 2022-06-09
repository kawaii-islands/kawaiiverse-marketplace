import NFTCard2 from "src/components/common/NFTCard2/NFTCard2";

import { useEffect } from "react";

const NFTList = ({ listNft, page }) => {
	useEffect(() => {
		// console.log(listNft);
	}, [page]);
	return <>{listNft && listNft.map((item, idx) => <NFTCard2 item={item} key={idx} type="onSale" />)}</>;
};
export default NFTList;
