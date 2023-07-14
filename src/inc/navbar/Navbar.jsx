import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";

import MetaMaskAuthButton from "./metaskauth/metamask";

const Navbar = () => {
	return (
		<div className="h-20 flex blur-background justify-between items-center px-6 py-2">
			<div className="flex w-full items-center justify-between">
				<div className="mr-2 mx-4 flex items-center text-white">
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
				</div>
				<div className="flex items-center text-lg ">
					{/* <a href='https://discord.com/invite/PJp2DbX64U'>
            <li className='text-white mx-4 list-none capitalize mr-1 cursor-pointer  hover:text-[#0ea5e9] hover:scale-105'>
              Discover
            </li>
          </a> */}
					<Link to={`/staking`}>
						<a href="https://discord.com/invite/PJp2DbX64U">
							<li className="text-white mx-4 list-none capitalize mr-1 cursor-pointer  hover:text-[#0ea5e9] hover:scale-105">
								Stake
							</li>
						</a>
					</Link>
					<a href="#bnplComponent">
						<li className="text-white mx-4 list-none capitalize mr-1 cursor-pointer  hover:text-[#0ea5e9] hover:scale-105">
							BNPL
						</li>
					</a>
					<a href="https://armilaadarshs-organization.gitbook.io/gearfi_litepaper/welcome-to-gear_fi/abstract">
						<li className="text-white mx-4  list-none capitalize mr-1 cursor-pointer  hover:text-[#0ea5e9] hover:scale-105">
							Docs
						</li>
					</a>
					<a href="https://discord.com/invite/PJp2DbX64U">
						<li className="text-white mx-4 list-none  capitalize mr-1 cursor-pointer  hover:text-[#0ea5e9] hover:scale-105">
							Discord
						</li>
					</a>
				</div>
				<div>
					<MetaMaskAuthButton />
				</div>
			</div>
		</div>
	);
};

export default Navbar;
