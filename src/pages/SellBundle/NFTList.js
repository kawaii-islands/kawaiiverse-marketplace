import BundleCardSell from "src/components/common/BundleCardSell";
import { useEffect } from "react";

const NFTList = ({
	listNft,
	page,
	setListSellBundle,
	sellNFTs,
	setSellNFTs,
	listSellingContract,
	setListSellingContract,
	updateInfo,
}) => {
	useEffect(() => {}, [page]);
	return (
		<>
			{listNft &&
				listNft.map((item, idx) => (
					<BundleCardSell
						key={idx}
						item={item}
						setListSellBundle={setListSellBundle}
						sellNFTs={sellNFTs}
						setSellNFTs={setSellNFTs}
						setListSellingContract={setListSellingContract}
						updateInfo={updateInfo}
						listSellingContract={listSellingContract}
						index={idx}
						type="sellBundle"
					/>
				))}
		</>
	);
};
export default NFTList;
