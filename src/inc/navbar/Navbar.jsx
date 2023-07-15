import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";

import MetaMaskAuthButton from "./metaskauth/metamask";

const Navbar = () => {
	const [openDrawer, setOpenDrawer] = useState(false);

	const toggleDrawer = () => {
		setOpenDrawer((prevOpenDrawer) => !prevOpenDrawer);
	};
	return (
		<div
			className="w-full blur-background px-6 py-2 relative flex-col
		md:flex-row w-[auto] sticky top-0 z-10
		"
		>
			<div className="flex items-center justify-between max-w-[1280px] mx-auto">
				<div
					className="flex items-center text-white justify-between w-[100%]
					md:w-[auto]
				"
				>
					<Link to="/">
						<div className="flex">
							<span
								className="py-2 pl-3 pr-4 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 font-extrabold lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700"
								style={{
									color: "#0ea5e9",
									fontFamily: "Monoton,cursive",
									fontSize: "25px",
									fontWeight: "200",
									letterSpacing: "5px",
								}}
							>
								GEARFI
							</span>
							<div className="text-white top-0 text-xs">
								Testnet
							</div>
						</div>
					</Link>

					<div
						className="w-[30px] h-[30px] cursor-pointer leading-[30px] text-center md:hidden"
						onClick={toggleDrawer}
					>
						<i className="fas fa-bars"></i>
					</div>
				</div>

				<div
					className={
						(!openDrawer ? "h-0 " : "") +
						"flex w-[100%] flex-col text-center gap-1 md:flex-row md:w-[auto] md:h-[100%] overflow-hidden"
					}
				>
					<div
						className="flex text-lg flex-col gap-1 leading-[40px] text-[16px]
				md:flex-row md:leading-[50px] md:text-[18px]
				"
					>
						{/* <a href='https://discord.com/invite/PJp2DbX64U'>
							<li className='text-white mx-4 list-none capitalize mr-1 cursor-pointer  hover:text-[#0ea5e9] hover:scale-105'>
							Discover
							</li>
						</a> */}
						<Link to={`/staking`} className="block">
							<li className="text-white list-none capitalize px-4 hover:text-[#0ea5e9] hover:scale-105">
								Stake
							</li>
						</Link>
						<Link to="#bnplComponent" className="block">
							<li className="text-white list-none capitalize px-4 hover:text-[#0ea5e9] hover:scale-105">
								BNPL
							</li>
						</Link>
						<Link
							to="https://armilaadarshs-organization.gitbook.io/gearfi_litepaper/welcome-to-gear_fi/abstract"
							className="block"
						>
							<li className="text-white  list-none capitalize px-4  hover:text-[#0ea5e9] hover:scale-105">
								Docs
							</li>
						</Link>
						<a
							href="https://discord.com/invite/PJp2DbX64U"
							className="block"
						>
							<li className="text-white list-none  capitalize px-4 hover:text-[#0ea5e9] hover:scale-105">
								Discord
							</li>
						</a>
					</div>
					<div>
						<MetaMaskAuthButton />
					</div>
				</div>
			</div>
		</div>
	);
};

export default Navbar;
