import React from "react";
import "./header.css";

import Banner from "../banner/banner";

const Header = () => {
	return (
		<div className="flex flex-col justify-center text-white items-center mb-[100px] max-w-[1280px] mx-auto">
			<Banner />

			<h2 className="text-4xl mt-20 mb-5">GearFi Testnet V1</h2>
			<p className="text-sm  text-red-400 text-center w-[90%]">
				Disclaimer: NFTs displayed are for testing purposes only and do
				not represent ownership of original collections.
			</p>
		</div>
	);
};

export default Header;
