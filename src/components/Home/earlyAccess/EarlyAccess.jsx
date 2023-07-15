import React, { useState, useEffect } from "react";
import earlyAccessImg from "../../../assets/EarlyAccess2.png";
import thumbsUpNFT from "../../../assets/thumbsUpNft.png";
import axios from "axios";

export default function EarlyAccess() {
	const [email, setEmail] = useState("");
	const [sentEmail, setSentEmail] = useState(false);

	const sendEmail = () => {
		console.log(email);
		axios.post(`http://localhost:8000/subscriber/`, { email });
		setSentEmail(true);
	};

	const handleInputChange = (event) => {
		setEmail(event.target.value);
	};

	return (
		<div className="max-w-[1280px] mb-[100px] mx-auto px-[10px]">
			<div className="flex flex-col md:flex-row justify-around items-center gap-[40px] md:gap-[10px] md:w-[100%] sm:w-2/3 mx-auto ">
				{sentEmail ? (
					<>
						<div className="md:w-1/2 w-2/3">
							<img src={thumbsUpNFT} alt="" />
						</div>
						<div className="md:w-1/2 text-center">
							<div className="text-4xl mb-12 font-semibold">
								Thanks!
							</div>
						</div>
					</>
				) : (
					<>
						<div className="md:w-1/2 w-2/3">
							<img src={earlyAccessImg} alt="" />
						</div>
						<div className="md:w-1/2 text-center">
							<div className="text-4xl mb-12 font-semibold">
								Get Early Access
							</div>
							<div className="text-[16px] m-4 text-center">
								Be a part of NFT Revolution and get early access
								to our mainnet application
							</div>

							<div className="flex justify-center h-[40px] leading-[40px] mt-8">
								<input
									type="text"
									placeholder="Your email here"
									className="rounded-l-[8px] text-black md:w-[300px] md:max-w-2/3 sm:w-[calc(100%_-_80px)] w-[calc(90%_-_80px)] px-3"
									value={email}
									onChange={handleInputChange}
								/>
								<button
									className="text-[#0ea5e9] text-[17px] bg-gray-800 px-3 w-[80px] font-medium text-center hover:bg-[#0ea5e9] hover:text-gray-800 m-0 py-0 rounded-[0_8px_8px_0]"
									onClick={sendEmail}
								>
									Submit
								</button>
							</div>
						</div>
					</>
				)}
			</div>
		</div>
	);
}
