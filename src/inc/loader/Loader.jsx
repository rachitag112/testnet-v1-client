import React from "react";
import "./loader.css";

function Loader() {
	return (
		<div className="w-full py-10">
			<div className="animate-spin rounded-full w-24 aspect-square border-b-4 border-red-700 py-3 mx-auto mb-8"></div>
			<div className="text-center text-xl mb-8">Loading....</div>
			<div className="text-center text-md">
				Server is overloaded. It may take a while to fetch NFTs, please
				wait.
			</div>
		</div>
	);
}

export default Loader;
