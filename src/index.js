import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import {
	EthereumClient,
	w3mConnectors,
	w3mProvider,
} from "@web3modal/ethereum";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { arbitrum, mainnet, polygon } from "wagmi/chains";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import "./App.css";

const chains = [arbitrum, mainnet, polygon];
const projectId = "99d6e975029eb8b28d1294ac944268a8";

const { publicClient } = configureChains(chains, [w3mProvider({ projectId })]);
const wagmiConfig = createConfig({
	autoConnect: true,
	connectors: w3mConnectors({ projectId, chains }),
	publicClient,
});
const ethereumClient = new EthereumClient(wagmiConfig, chains);

ReactDOM.render(
	<WagmiConfig config={wagmiConfig}>
		<BrowserRouter>
			<App
				wagmiConfig={wagmiConfig}
				ethereumClient={ethereumClient}
				projectId={projectId}
			/>
		</BrowserRouter>
	</WagmiConfig>,
	document.getElementById("root")
);
