import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./metamaskauth.css";
const userImage = require("../../../assets/user.jpg");

const MetaMaskAuthButton = () => {
	const [isConnected, setIsConnected] = useState(false);
	const [address, setAddress] = useState("");

	const sliceIt = (address) => {
		return `${address.slice(0, 4)}...${address.slice(-4)}`;
	};

	useEffect(async () => {
		try {
			// Check if MetaMask is installed
			if (window.ethereum) {
				const accounts = await window.ethereum.request({
					method: "eth_accounts",
				});

				if (accounts.length != 0) {
					setIsConnected(true);
					setAddress(window.ethereum.selectedAddress);
				}
			}
		} catch (error) {
			// Error occurred during MetaMask authentication or message signing
			setIsConnected(false);

			console.error("Error:", error);
		}
	}, [window.ethereum]);

	const connectAndSign = async () => {
		try {
			// Check if MetaMask is installed
			if (window.ethereum) {
				// Request MetaMask user's permission to connect
				await window.ethereum.enable();

				await window.ethereum.request({
					method: "wallet_addEthereumChain",
					params: [
						{
							chainId: "0x1f91",
							chainName: "Shardeum Sphinx DApp 1.X",
							rpcUrls: ["https://dapps.shardeum.org/"],
						},
					],
				});

				// User is now connected to MetaMask
				setIsConnected(true);

				// Get the connected user's address
				setAddress(window.ethereum.selectedAddress);
			} else {
				// MetaMask is not installed, handle the error or prompt the user to install it
				alert("MetaMask is not installed.");
			}
		} catch (error) {
			// Error occurred during MetaMask authentication or message signing
			setIsConnected(false);

			console.error("Error:", error);
		}
	};

	return (
		<div className="metamask-auth-wrapper z-2">
			{isConnected ? (
				<div className="relative">
					<Link to={`/user/${address}`}>
						<div className="flex flex-row cursor:pointer items-center">
							<p className="text-white text-xl mr-2">
								{sliceIt(address)}
							</p>

							<img
								src={userImage}
								alt=""
								className="w-12 rounded-full"
							/>
						</div>
					</Link>
				</div>
			) : (
				<button
					onClick={connectAndSign}
					className="text-[#0ea5e9] bg-gray-800 border-2 border-gray-900 items-center px-3 py-2 text-lg font-medium text-center  hover:bg-[#0ea5e9] hover:text-gray-800 "
				>
					Connect Wallet
				</button>
			)}
		</div>
	);
};

export default MetaMaskAuthButton;
