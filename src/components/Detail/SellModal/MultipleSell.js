import cn from "classnames/bind";
import styles from "./index.module.scss";
import exchangeIcon from "src/assets/icons/transfer.svg";
import { OutlinedInput, Modal, Typography, InputAdornment, Button } from "@mui/material";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import { selectPrice } from "src/lib/redux/slices/price";
import { useSelector } from "react-redux";

const cx = cn.bind(styles);

const MultipleSell = ({ handleClick, info }) => {
	const { register, handleSubmit } = useForm();
	const [errorAmount, setErrorAmount] = useState(false);
	const [errorStartPrice, setErrorStartPrice] = useState(false);
	const [errorEndPrice, setErrorEndPrice] = useState(false);
	const [errorDuration, setErrorDuration] = useState(false);
	const [errorAmountMessage, setErrorAmountMessage] = useState("");
	const [errorStartPriceMessage, setErrorStartPriceMessage] = useState("");
	const [errorEndPriceMessage, setErrorEndPriceMessage] = useState("");
	const [errorDurationMessage, setErrorDurationMessage] = useState("");
	const [startPriceUSD, setStartPriceUSD] = useState(0);
	const [endPriceUSD, setEndPriceUSD] = useState(0);
	const { kwtPrice } = useSelector(selectPrice);

	console.log(kwtPrice);

	const onSubmit = data => {
		data.duration = Math.floor(3600 * 24 * Number(data.duration));
		if (checkValid(data)) handleClick(data);
	};

	const checkValid = data => {
		const isEmpty = Object.values(data).some(x => x === null || x === "");
		if (isEmpty) {
			toast.error("Invalid input");
			return false;
		}

		const isNegative = Object.values(data).some(x => parseInt(x) <= 0);
		if (isNegative) {
			toast.error("Invalid input");
			return false;
		}

		const isOverAmount = parseInt(data.amount) > parseInt(info.balance);
		if (isOverAmount) {
			toast.error("Invalid input");
			return false;
		}
		return true;
	};

	const checkAmount = e => {
		console.log(e.target.value);
		if (e.target.value === null || e.target.value === "") {
			setErrorAmount(true);
			setErrorAmountMessage("Please input");
		} else {
			if (parseInt(e.target.value) <= 0) {
				setErrorAmount(true);
				setErrorAmountMessage("Please input integer");
			} else if (parseInt(e.target.value) > parseInt(info.balance)) {
				setErrorAmount(true);
				setErrorAmountMessage("Not enough available item!");
			} else {
				setErrorAmount(false);
				setErrorAmountMessage("");
			}
		}
	};

	const checkStartPrice = e => {
		if (checkInput(e, setErrorStartPrice, setErrorStartPriceMessage))
			setStartPriceUSD((parseInt(e.target.value) * kwtPrice).toFixed(4));
		else setStartPriceUSD(0);
	};

	const checkEndPrice = e => {
		if (checkInput(e, setErrorEndPrice, setErrorEndPriceMessage))
			setEndPriceUSD((parseInt(e.target.value) * kwtPrice).toFixed(4));
		else setEndPriceUSD(0);
	};

	const checkDuration = e => {
		checkInput(e, setErrorDuration, setErrorDurationMessage);
	};

	const checkInput = (e, setError, setErrorMessage) => {
		console.log(e.target.value);
		let valid = true;
		if (e.target.value === null || e.target.value === "") {
			setError(true);
			setErrorMessage("Please input");
			valid = false;
		} else {
			if (parseInt(e.target.value) < 0) {
				setError(true);
				setErrorMessage("Please input integer");
				valid = false;
			} else {
				setError(false);
				setErrorMessage("");
			}
		}
		return valid;
	};

	return (
		<>
			<form onSubmit={handleSubmit(onSubmit)}>
				<div className={cx("row")}>
					<span>Amount</span>
					<div className={errorAmount ? cx("row-right-error") : cx("row-right")}>
						<input type="number" {...register("amount")} onChange={e => checkAmount(e)} />
					</div>
				</div>
				<div className={cx("row2")}>{errorAmount && <div className={cx("row2-error")}>{errorAmountMessage}</div>}</div>
				<div className={cx("row")}>
					<span>Start price</span>
					<div className={errorStartPrice ? cx("row-right-error") : cx("row-right")}>
						<input type="number" {...register("start_price")} onChange={e => checkStartPrice(e)} />
						<span>KWT</span>
					</div>
				</div>
				<div className={cx("row2")}>
					{errorStartPrice && <div className={cx("row2-error")}>{errorStartPriceMessage}</div>}
				</div>
				<div className={cx("row2")}>
					<span>
						<img src={exchangeIcon} />
					</span>
					<div>${startPriceUSD}</div>
				</div>
				<div className={cx("row")}>
					<span>End price</span>
					<div className={errorEndPrice ? cx("row-right-error") : cx("row-right")}>
						<input type="number" {...register("end_price")} onChange={e => checkEndPrice(e)} />
						<span>KWT</span>
					</div>
				</div>
				<div className={cx("row2")}>
					{errorEndPrice && <div className={cx("row2-error")}>{errorEndPriceMessage}</div>}
				</div>

				<div className={cx("row2")}>
					<span>
						<img src={exchangeIcon} />
					</span>
					<div>${endPriceUSD}</div>
				</div>
				<div className={cx("row")}>
					<span>Duration</span>
					<div className={errorDuration ? cx("row-right-error") : cx("row-right")}>
						<input type="number" {...register("duration")} onChange={e => checkDuration(e)} />
						<span></span>
					</div>
				</div>
				<div className={cx("row2")}>
					{errorDuration && <div className={cx("row2-error")}>{errorDurationMessage}</div>}
				</div>

				<div className={cx("row2")}>You will receive 1000 KWT ($1000)</div>
				<Button className={cx("confirm-btn")} type="submit">
					<span>Confirm</span>
				</Button>
			</form>
		</>
	);
};

export default MultipleSell;
