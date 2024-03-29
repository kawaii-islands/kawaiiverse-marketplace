import { Box } from "@mui/system";
import { Link } from "react-router-dom";

const links = [
	{
		title: "Marketplace",
		link: "/",
	},
];

export default function NavLinks() {
	return (
		<Box display="flex" justifyContent="center">
			{links.map(item => {
				return (
					<Link to={item.link} key={item.title} className="nav-link">
						{item.title}
					</Link>
				);
			})}
		</Box>
	);
}
