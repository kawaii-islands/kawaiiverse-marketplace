export default function AccountIcon({ stroke = "#833F1D" }) {
	return (
		<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path
				d="M18.1411 15.8586C16.74 15.0482 14.4536 14 12 14C9.54639 14 7.26 15.0482 5.85889 15.8586C4.92169 16.4007 4.38035 17.3935 4.26679 18.4702L4 21H20L19.7332 18.4702C19.6197 17.3935 19.0783 16.4007 18.1411 15.8586Z"
				stroke={stroke}
				strokeWidth="1.4"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z"
				stroke={stroke}
				strokeWidth="1.4"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
}
