import web3 from "web3";

export const getCurrentPriceFromBackend = auction => {
	if (!auction) return 0;
	const now = Date.now() / 1000;
	const endingPrice = Number(
		web3.utils.fromWei(
			auction.endingPrice.toLocaleString("fullwide", {
				useGrouping: false,
			})
		)
	);
	const duration = Number(auction.duration);
	const startedAt = Number(auction.timestamp);
	if (now >= startedAt + duration) return endingPrice;
	const startingPrice = Number(
		web3.utils.fromWei(
			auction.startingPrice.toLocaleString("fullwide", {
				useGrouping: false,
			})
		)
	);
	const price = ((endingPrice - startingPrice) / duration) * (now - startedAt) + startingPrice;
	if (endingPrice <= startingPrice) return price;
	return Math.min(Math.ceil(price * 1.05 * 10 ** 2) / 10 ** 2, endingPrice);
};

export const getCurrentPriceOnChain = auction => {
	if (!auction) return 0;
	const now = Date.now() / 1000;
	const endingPrice = Number(web3.utils.fromWei(auction.endingPrice));
	const duration = Number(auction.duration);
	const startedAt = Number(auction.startedAt);
	if (now >= startedAt + duration) return endingPrice;
	const startingPrice = Number(web3.utils.fromWei(auction.startingPrice));
	const price = ((endingPrice - startingPrice) / duration) * (now - startedAt) + startingPrice;
	if (endingPrice <= startingPrice) return price;
	return Math.min(Math.ceil(price * 1.05 * 10 ** 2) / 10 ** 2, endingPrice);
};
