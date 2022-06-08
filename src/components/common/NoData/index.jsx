import React from "react";
import noDataIcon from "src/assets/images/no-data.png";

const NoData = () => {
	return (
		<div style={{ display: "flex", justifyContent: "center" }}>
			<img src={noDataIcon} alt="no-data" width={220} />
		</div>
	);
};

export default NoData;
