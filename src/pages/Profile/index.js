import React from "react";
import Sidebar from "src/components/Sidebar";
import { useParams } from "react-router-dom";

const Account = React.lazy(() => import("src/pages/Account"));
const SellBundle = React.lazy(() => import("src/pages/SellBundle"));

export default function Profile() {
	const { tab } = useParams();
	const getTab = () => {
		switch (tab) {
			case "account":
				return <Account />;
			case "sale":
				return <SellBundle />;
			default:
				return <Account />;
		}
	};
	return (
		<div style={{ display: "flex" }}>
			<Sidebar />
			{getTab()}
		</div>
	);
}
