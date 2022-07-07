import {
	Box,
	Typography,
	OutlinedInput,
	InputAdornment,
	MenuItem,
	FormControl,
	Avatar,
	Select,
	Chip,
	Button,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useEffect, useState } from "react";
import styles from "./index.module.scss";
import cn from "classnames/bind";
import { useDispatch, useSelector } from "react-redux";
import { setFilter } from "src/lib/redux/slices/filter";

const cx = cn.bind(styles);

const names = ["Price: Low to High", "Price: High to Low", "Newest"];

export default function Toolbar({ listNft, setListNft, originalList, sort, setSort }) {
	const dispatch = useDispatch();
	const [sort1, setSort1] = useState(names[2]);
	const activeGames = useSelector(state => state?.filter) || [];
	const [searchValue, setSearchValue] = useState();

	const onDelete = address => {
		let arr = activeGames.filter(item => item.address !== address);
		dispatch(setFilter([...arr]));
	};

	const clearAll = () => {
		dispatch(setFilter([]));
	};

	const handleSearch = value => {
		let arr = [...originalList];
		setSearchValue(value);

		let result = arr.filter((nft, idx) => {
			let condition1 = nft?.tokenId.toString().includes(value);
			let condition2 = nft?.name.toUpperCase().includes(value.toUpperCase());

			return condition1 || condition2;
		});

		setListNft([...result]);
	};

	const handleSort = sort => {
		switch (sort) {
			case "Price: Low to High":
				setSort("CurrentPriceAsc");
				break;
			
			case "Price: High to Low":
				setSort("CurrentPriceDesc");
				break;
		
			default:
				setSort("Latest");
				break;
		}
	};

	return (
		<>
			<Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "12px" }}>
				<Box sx={{ display: "flex", alignContent: "center" }}>
					<Typography variant="h6" className={cx("total")}>
						{listNft?.length} Items
					</Typography>
				</Box>
				<OutlinedInput
					className={cx("search")}
					variant="filled"
					placeholder="Search for NFT"
					endAdornment={
						<InputAdornment position="start">
							<SearchIcon />
						</InputAdornment>
					}
					// value={searchValue}
					onChange={e => handleSearch(e.target.value)}
				/>
				<FormControl>
					<Select
						className={cx("sort")}
						displayEmpty
						input={<OutlinedInput />}
						value={sort1}
						onChange={e => handleSort(e.target.value)}
						size="small">
						{names.map((name, id) => (
							<MenuItem key={name} value={name} className={cx("item")} onClick={()=> {setSort1(names[id])}}>
								{name}
							</MenuItem>
						))}
					</Select>
				</FormControl>
			</Box>

			{activeGames.length > 0 && (
				<div className={cx("gameActive")}>
					{activeGames.map((game, idx) => (
						<Box display="flex" alignItems="center" flexWrap="wrap" key={idx}>
							<Chip
								className={cx("tag")}
								variant="outlined"
								onDelete={() => onDelete(game.address)}
								label={
									<Typography variant="body2" className={cx("text")}>
										{game.name}
									</Typography>
								}
								avatar={<Avatar src={game.logoUrl} className={cx("avatar")} />}
							/>
						</Box>
					))}
					<Button className={cx("clear")} onClick={clearAll}>
						CLEAR ALL
					</Button>
				</div>
			)}
		</>
	);
}
