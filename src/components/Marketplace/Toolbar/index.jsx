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
import { useState } from "react";
import GameAvatar from "src/assets/images/game.png";
import styles from "./index.module.scss";
import cn from "classnames/bind";
import { useDispatch, useSelector } from "react-redux";
import { setFilter } from "src/lib/redux/slices/filter";

const cx = cn.bind(styles);

const names = [
	"Oliver Hansen",
	"Van Henry",
	"April Tucker",
	"Ralph Hubbard",
	"Omar Alexander",
	"Carlos Abbott",
	"Miriam Wagner",
	"Bradley Wilkerson",
	"Virginia Andrews",
	"Kelly Snyder",
];

export default function Toolbar() {
	const dispatch = useDispatch();
	const games = useSelector(state => state?.games);
	const activeGames = useSelector(state => state?.filter?.games) || [];
	const [sort, setSort] = useState("Oliver Hansen");

	const onDelete = address => {
		dispatch(
			setFilter({
				games: activeGames.filter(i => i !== address),
			})
		);
	};

	const onClear = () => {
		dispatch(
			setFilter({
				games: [],
			})
		);
	};

	return (
		<>
			<Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
				<Box sx={{ display: "flex", alignContent: "center" }}>
					<Typography variant="h6" className={cx("total")}>
						2000 Items
					</Typography>
					<OutlinedInput
						className={cx("search")}
						variant="filled"
						placeholder="Search for NFT"
						endAdornment={
							<InputAdornment position="start">
								<SearchIcon />
							</InputAdornment>
						}
					/>
				</Box>
				<FormControl>
					<Select
						className={cx("sort")}
						displayEmpty
						input={<OutlinedInput />}
						value={sort}
						onChange={e => setSort(e.target.value)}
						size="small">
						{names.map(name => (
							<MenuItem key={name} value={name} className={cx("item")}>
								{name}
							</MenuItem>
						))}
					</Select>
				</FormControl>
			</Box>
			<Box display="flex" alignItems="center" marginBottom="30px" flexWrap="wrap">
				{activeGames.map(address => (
					<Chip
						key={address}
						className={cx("tag")}
						variant="outlined"
						onDelete={() => onDelete(address)}
						label={
							<Typography variant="body2" className={cx("text")}>
								{games.filter(game => game.address === address)[0].name}
							</Typography>
						}
						avatar={<Avatar src={GameAvatar} className={cx("avatar")} />}
					/>
				))}
				{activeGames.length > 0 && (
					<Button className={cx("clear")} onClick={onClear}>
						CLEAR ALL
					</Button>
				)}
			</Box>
		</>
	);
}
