import { Web3Modal } from "@web3modal/react";
import { ToastContainer } from "react-toastify";

import "./App.css";
import { Home, Profile, Item, Profile_item } from "./pages";
import { Routes, Route } from "react-router-dom";
import { Navbar } from "./inc";
import Collection from "./pages/collection/Collection";
import Staking from "./pages/staking/StakingPage";
import { useEffect } from "react";

function App({ wagmiConfig, ethereumClient, projectId }) {
	useEffect(() => {
		if ("serviceWorer" in navigator) {
			navigator.serviceWorer.register("/sw.js");
		}
	}, []);

	return (
		<div className="gradient-bg-welcome">
			<Web3Modal
				themeMode="dark"
				projectId={projectId}
				ethereumClient={ethereumClient}
			/>
			<ToastContainer
				position="top-right"
				autoClose={3000}
				hideProgressBar={false}
				newestOnTop={false}
				closeOnClick={true}
				rtl={false}
				pauseOnFocusLoss={true}
				draggable={false}
				pauseOnHover={false}
				theme="colored"
			/>
			<Navbar className="" />
			<Routes>
				<Route path="/" element={<Home />} />
				{/* <Route path=':item/:id' element={<Item />} /> */}
				<Route path="/user/:userAddress" element={<Profile />} />
				<Route
					path="collection/:collAddress"
					element={<Collection />}
				/>
				<Route
					path="/collection/:tokenAddress/:tokenId"
					element={<Item />}
				/>
				<Route
					path="/account/:tokenAddress/:tokenId"
					element={<Profile_item />}
				/>
				{/* <Route path = '/discover' element={<Discover/>} /> */}
				<Route path="/staking" element={<Staking />} />
			</Routes>
		</div>
	);
}

export default App;
