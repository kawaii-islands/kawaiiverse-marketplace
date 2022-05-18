import { AppBar, Toolbar, Box, Button } from "@mui/material";
import NavLinks from "./NavLinks";
import "./index.scss";
import ConnectWalletButton from "./ConnectWalletButton";
import Logo from "src/assets/images/logo.png";
import { Link } from "react-router-dom";

export default function Header() {
	return (
		<AppBar position="fixed" color="secondary">
			<Toolbar className="app-header">
				<Box display="flex">
					<Link to="/">
						<img className="app-header-logo" src={Logo} />
					</Link>
					<NavLinks />
				</Box>
				<ConnectWalletButton />
			</Toolbar>
		</AppBar>
	);
}
