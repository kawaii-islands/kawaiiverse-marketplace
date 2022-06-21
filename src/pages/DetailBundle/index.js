import { useState, useEffect } from "react";
import NFTDetail from "src/components/common/NFTDetail";
import SellModal from "src/components/Detail/SellModal";
import LoadingModal from "src/components/common/LoadingModal/LoadingModal";
import { useWeb3React } from "@web3-react/core";
import { useParams } from "react-router-dom";
import styles from "./index.module.scss";
import cn from "classnames/bind";

const cx = cn.bind(styles);

const DetailBundle = () => {
	const { account } = useWeb3React();
	const { auction } = useParams();
	const [info, setInfo] = useState();
	const [balance, setBalance] = useState();
	const [show, setShow] = useState(false);
	const [selling, setSelling] = useState();
	const [loadingTitle, setLoadingTitle] = useState("");
	const [stepLoading, setStepLoading] = useState(0);
	const [hash, setHash] = useState();

	const handleOnClick = () => {
		setShow(true);
	};

	return (
		<div className={cx("detail")}>
			<NFTDetail info={info} sell={true} onClick={handleOnClick} />
			<SellModal
				show={show}
				setShow={setShow}
				info={info}
				setSelling={setSelling}
				setLoadingTitle={setLoadingTitle}
				setStepLoading={setStepLoading}
				setHash={setHash}
			/>
			{selling && (
				<LoadingModal
					show={selling}
					network={"BscScan"}
					loading={true}
					title={loadingTitle}
					stepLoading={stepLoading}
					onHide={() => {
						setUploadGameLoading(false);
						setHash(undefined);
						setStepLoading(0);
					}}
					hash={hash}
					hideParent={() => {}}
				/>
			)}
		</div>
	);
};

export default DetailBundle;
