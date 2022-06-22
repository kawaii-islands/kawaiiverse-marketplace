import { Button } from "@mui/material";
import { useWeb3React } from "@web3-react/core";
import { useEagerConnect, useInactiveListener } from "src/utils/hooks/metamask";
import { useState, useEffect } from "react";
import ConnectWalletModal from "./ConnectWalletModal";
import { useNavigate } from "react-router-dom";

export default function ConnectWalletButton() {
	const context = useWeb3React();
	const { connector, account } = context;
	const [activatingConnector, setActivatingConnector] = useState();
	const [showConnectModal, setShowConnectModal] = useState(false);
	const navigate = useNavigate();
	const triedEager = useEagerConnect();
	useInactiveListener(!triedEager || !!activatingConnector);

	useEffect(() => {
		if (activatingConnector && activatingConnector === connector) {
			setActivatingConnector(undefined);
		}
	}, [activatingConnector, connector]);

	return (
		<>
			<Button
				variant="contained"
				onClick={() => {
					if (account) navigate("/profile/account");
					else setShowConnectModal(true);
				}}
				style={{ background: "#F25858", color: "#FFFFFF" }}>
				{account ? "My account" : "Connet wallet"}
			</Button>
			<ConnectWalletModal show={showConnectModal} setShow={setShowConnectModal} />
		</>
	);
}
