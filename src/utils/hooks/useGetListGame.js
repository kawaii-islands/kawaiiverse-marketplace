import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { getListGame, getNumberOfGame } from "src/lib/web3";
import { setGames } from "src/lib/redux/slices/game";

export default function useGetListGame() {
	const dispatch = useDispatch();
	const currentListGame = useSelector(state => state?.games);
	const [listGame, setListGame] = useState(currentListGame);

	useEffect(() => {
		getData();
	}, [currentListGame]);

	const getData = async () => {
		try {
			const numberOfGame = await getNumberOfGame();
			const currentNumberOfGame = currentListGame.length;
			if (numberOfGame > currentNumberOfGame) {
				const newListGame = await getListGame(currentNumberOfGame, numberOfGame - currentNumberOfGame);
				dispatch(setGames([...listGame, ...newListGame]));
				setListGame([...listGame, ...newListGame]);
			}
		} catch (error) {
			console.log(error);
		}
	};
  
	return listGame;
}
