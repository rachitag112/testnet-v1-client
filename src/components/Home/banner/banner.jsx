import React from "react";
import collImg from "../../../assets/nft_3.jpg";
import { useNavigate } from "react-router-dom";

import { AiOutlineArrowRight } from "react-icons/ai";

export default function Banner2() {
	const navigate = useNavigate();

	const handleRedirect = (address) => {
		navigate(`/collection/${address}`);
	};
	return (
		<div className="text-white mt-10 w-full px-[20px]">
			<div className="md:flex justify-center gap-4 ">
				<div
					className="flex flex-col md:w-1/2 justify-center items-start px-2 text-center
				 md:text-left items-center md:items-start mb-10"
				>
					<div className="text-5xl font-bold text-gradient">
						Buy Now Pay Later and Margin Trading for NFTs
					</div>
					<div className="w-2/3 text-gradient my-4">
						Trade Top NFT collections on a fraction of price, access
						liquidty from GearFi Vaults
					</div>
					<div className="flex">
						<a href="https://discord.com/invite/PJp2DbX64U">
							<button className="bg-gray-200 text-[#5865F2] text-xl font-md px-5 py-2.5  cursor-pointer hover:bg-[#5865F2] hover:text-gray-200">
								Join Discord
							</button>
						</a>
					</div>
				</div>

				<div
					className="white-glassmorphism-no-border max-w-[90%] h-[fit-content] rounded-none py-4 px-4 align-self-left mx-auto
					sm:max-w-[50%]
				"
				>
					<div
						className="flex md:h-72 md:m-4 m-0 card items-end cursor-pointer bg-cover bg-center aspect-square pb-4 justify-center"
						style={{ backgroundImage: `url(${collImg})` }}
						onClick={() =>
							handleRedirect(
								"0x02d074f26290ddc1551905fcca4f9cdb53578572"
							)
						}
					>
						<div className="flex flex-col blue-glassmorphism p-4 w-[80%]">
							<div className="font-bold mb-2 flex items-center justify-between">
								<div>BAYC</div>
								<div>
									<AiOutlineArrowRight className="mr-4" />
								</div>
							</div>
							<div className="flex">
								<div className="w-24 text-sm">
									FLOOR PRICE:
									<br />
									40 ETH
								</div>
								<div className="ml-4 w-20 text-sm">
									LAST SALE:
									<br />
									38 ETH
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
