import React from "react";

export default function ComingSoon() {
	return (
		<div
			id="bnplComponent"
			className="flex items-center justify-center text-white w-full border-t  mb-[70px] px-[10px] py-[30px]"
		>
			<div className="rounded-lg shadow-md max-w-[1280px] w-full mx-auto">
				<div className="text-white ">
					<div className="flex flex-col items-center justify-center">
						<div className=" top-4 text-center bg-[#0F0E13]">
							<p className="text-2xl text-[#0ea5e9]">
								Coming Soon
							</p>
						</div>

						<div className="grid sm:grid-cols-3 justify-around gap-[40px] my-8 text-[#262626]">
							<div className="flex flex-col items-center p-4 border-2 border-[#204] rounded-[20px_0_20px_0] bg-[#bcbcbc] shadow-[0_5px_5px_5px_#2a2a2a]">
								<p className="text-center  text-[#262626] font-[600]">
									Choose your favourite NFT from any
									Marketplace
								</p>
							</div>
							<div className="flex flex-col items-center p-4 border-2 border-[#204] rounded-[20px_0_20px_0] bg-[#bcbcbc] shadow-[0_5px_5px_5px_#2a2a2a]">
								<p className="text-center  text-[#262626] font-[600]">
									Just copy and paste NFT's URL below and
									click on Buy Now Pay Later{" "}
								</p>
							</div>
							<div className=" flex flex-col items-center p-4 border-2 border-[#204] rounded-[20px_0_20px_0] bg-[#bcbcbc] shadow-[0_5px_5px_5px_#2a2a2a]">
								<p className="text-center  text-[#262626] font-[600]">
									Pay a down payment and own your favourite
									NFT
								</p>
							</div>
						</div>

						<div className="text-center max-w-[500px] w-[100%] mt-4 leading-[40px]">
							<input
								className="w-full rounded-md border border-black text-center text-[17px] h-[40px]"
								type="text"
								placeholder="Type NFT URL Here"
							/>

							<button
								className="text-[#0ea5e9] text-[17px] bg-gray-800 items-center px-3 py-0 font-medium text-center h-[40px] hover:bg-[#0ea5e9] hover:text-gray-800"
								disabled={true}
							>
								Buy Now Pay Later
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
