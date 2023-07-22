import React from "react";
import { Header, PopularCollections, TopCollection } from "../../components";
import { Footer } from "../../inc";
import "./home.css";

import Staking from "../../components/Home/staking/Staking";
import ComingSoon from "../../components/Home/comingSoon/comingSoon";
import EarlyAccess from "../../components/Home/earlyAccess/EarlyAccess";
const Home = () => {
	return (
		<div id="home_page">
			<Header />
			<TopCollection />
			<Staking />
			<PopularCollections />
			<EarlyAccess />
			<ComingSoon />
			<Footer />
		</div>
	);
};

export default Home;
