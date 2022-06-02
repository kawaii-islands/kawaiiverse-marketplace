import cn from "classnames/bind";
import styles from "./index.module.scss";
import exchangeIcon from "src/assets/icons/transfer.svg";
import { OutlinedInput, Modal, Typography, InputAdornment, Button } from "@mui/material";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

const cx = cn.bind(styles);

const MultipleSell = ({ handleClick, info }) => {
	const { register, handleSubmit } = useForm();
	const onSubmit = data => {
		data.duration = Math.floor(3600 * 24 * Number(data.duration));
		if (checkValid(data)) handleClick(data);
	};

	const checkValid = data => {
		const isEmpty = Object.values(data).some(x => x === null || x === "");
		if (isEmpty) {
			toast.error("Please not let input empty!");
			return false;
		}

		const isNegative = Object.values(data).some(x => parseInt(x) <= 0);
		if (isNegative) {
			toast.error("Please input integer!");
			return false;
		}

		const isOverAmount = parseInt(data.amount) > parseInt(info.balance);
		if (isOverAmount) {
			toast.error("Not enough available item!");
			return false;
		}
		return true;
	};

	return (
		<>
			<form onSubmit={handleSubmit(onSubmit)}>
				<div className={cx("row")}>
					<span>Amount</span>
					<div className={cx("row-right")}>
						<input type="number" {...register("amount")} />
					</div>
				</div>
				<div className={cx("row")}>
					<span>Start price</span>
					<div className={cx("row-right")}>
						<input type="number" {...register("start_price")} />
						<span>KWT</span>
					</div>
				</div>
				<div className={cx("row2")}>
					<span>
						<img src={exchangeIcon} />
					</span>
					<div>$1000</div>
				</div>
				<div className={cx("row")}>
					<span>End price</span>
					<div className={cx("row-right")}>
						<input type="number" {...register("end_price")} />
						<span>KWT</span>
					</div>
				</div>
				<div className={cx("row2")}>
					<span>
						<img src={exchangeIcon} />
					</span>
					<div>$1000</div>
				</div>
				<div className={cx("row")}>
					<span>Duration</span>
					<div className={cx("row-right")}>
						<input type="number" {...register("duration")} />
						<span></span>
					</div>
				</div>
				<div className={cx("row2")}>
					<span>
						<img src={exchangeIcon} />
					</span>
					<div>$1000</div>
				</div>
				<div className={cx("row2")}>You will receive 1000 KWT ($1000) after</div>
				<Button className={cx("confirm-btn")} type="submit">
					<span>Confirm</span>
				</Button>
			</form>
		</>
	);
};

export default MultipleSell;
