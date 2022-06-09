import NFTCard from "src/components/common/NFTCard";
import { Grid } from "@mui/material";
import Pagination from "src/components/common/Pagination";

export default function ListNFT({ items, totalItems, setCurrentPage }) {
	return (
		<>
			<Grid container spacing={2} justifyContent="center">
				{items.map(item => (
					<Grid item key={item._id}>
						<NFTCard item={item} />
					</Grid>
				))}
			</Grid>
			<Pagination count={totalItems} color="primary" shape="rounded" onChange={(e, page) => setCurrentPage(page)} />
		</>
	);
}
