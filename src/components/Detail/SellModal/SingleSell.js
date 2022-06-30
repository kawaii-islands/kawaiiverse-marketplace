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

const SingleSell = ({ handleClick, info, isBundle }) => {
	const { register, handleSubmit } = useForm();
	const [errorAmount, setErrorAmount] = useState(false);
	const [errorAmountMessage, setErrorAmountMessage] = useState("");
	const [errorPrice, setErrorPrice] = useState(false);
	const [errorPriceMessage, setErrorPriceMessage] = useState("");
	const [priceUSD, setPriceUSD] = useState(0);
	const { kwtPrice } = useSelector(selectPrice);

	const onSubmit = data => {
		data = { ...data, end_price: data.start_price, duration: 60 * 60 * 24 };
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

	const checkPrice = e => {
		let valid = true;
		if (e.target.value === null || e.target.value === "") {
			setErrorPrice(true);
			setErrorPriceMessage("Please input");
			valid = false;
		} else {
			if (parseInt(e.target.value) < 0) {
				setErrorPrice(true);
				setErrorPriceMessage("Please input integer");
				valid = false;
			} else {
				setErrorPrice(false);
				setErrorPriceMessage("");
			}
		}

		if (valid) setPriceUSD((parseInt(e.target.value) * kwtPrice).toFixed(4));
		else setPriceUSD(0);
		return valid;
	};

	return (
		<>
			<form onSubmit={handleSubmit(onSubmit)}>
				<div className={cx("row")}>
					<span>Amount</span>
					<div className={errorAmount ? cx("row-right-error") : cx("row-right")}>
						{isBundle ? (
							<input type="number" value={"1"} readOnly />
						) : (
							<input type="number" {...register("amount")} onChange={e => checkAmount(e)} />
						)}
					</div>
				</div>
				<div className={cx("row2")}>{errorAmount && <div className={cx("row2-error")}>{errorAmountMessage}</div>}</div>
				<div className={cx("row")}>
					<span>Sell at</span>
					<div className={errorPrice ? cx("row-right-error") : cx("row-right")}>
						<input type="number" {...register("start_price")} onChange={e => checkPrice(e)} />
						<span>KWT</span>
					</div>
				</div>
				<div className={cx("row2")}>{errorPrice && <div className={cx("row2-error")}>{errorPriceMessage}</div>}</div>
				<div className={cx("row2")}>
					<span>
						<img src={exchangeIcon} />
					</span>
					<div>${priceUSD}</div>
				</div>
				<div className={cx("row2")}>
					You will receive 1000 KWT <span className={cx("highlight")}>($1000)</span> after
				</div>
				<Button className={cx("confirm-btn")} type="submit">
					<span>Confirm</span>
				</Button>
			</form>
		</>
	);
};

export default SingleSell;
