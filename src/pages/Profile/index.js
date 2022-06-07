import React from "react";
import Sidebar from "src/components/Sidebar";
import { useParams } from "react-router-dom";

const Account = React.lazy(() => import("src/pages/Account"));
const Onsale = React.lazy(() => import("src/pages/Onsale"));

export default function Profile() {
	const { tab } = useParams();
	const getTab = () => {
		switch (tab) {
			case "account":
				return <Account />;
			default:
				return <Onsale />;
		}
	};
	return (
		<div style={{ display: "flex" }}>
			<Sidebar />
			{getTab()}
		</div>
	);
}
