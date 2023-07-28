import { React, useEffect, useState } from "react";

import axios from "axios";
import { useParams } from "react-router";
import data from "../../assets/data.json";
import { Link } from "react-router-dom";
import { Loader } from "../../inc";

export default function Collection() {
	const { collAddress } = useParams();
	const [nftData, setNftData] = useState([]);

	useEffect(() => {
		axios(`${process.env.REACT_APP_SERVER_URL}/assets/${collAddress}`).then(
			({ data }) => {
				setNftData(Object.values(data));
			}
		);
	}, [collAddress]);
	console.log(nftData);

	const collData = data.find((obj) => {
		return obj.address === collAddress;
	});

	return (
		<div className="text-white h-full">
			<div className="">
				<img
					src={collData.banner_img}
					alt=""
					className="object-cover h-[40vh] relative top-0 left-0 w-full"
				/>
				<div className="max-w-[1280px] mx-auto relative mb-20">
					<img
						src={collData.img}
						alt=""
						className="border-4 border-white rounded-lg w-[200px] max-w-full sm:w-40 bg-[#cdcdcf] absolute left-[50%] translate-x-[-50%] sm:translate-x-0 sm:left-20 -bottom-8"
					/>
				</div>
			</div>
			<div className="max-w-[1280px] mx-auto px-[20px]">
				<div className="mb-0 mt-8 text-3xl font-bold">
					{collData.COLLECTION}
				</div>

				<div className="text-lg my-4 w-full">
					{collData.description}
				</div>

				<div className="grid sm:grid-cols-4 grid-cols-2 max-w-[720px] mx-auto my-8 gap-[40px] text-center capitalize py-5">
					<div className="">
						<div className="text-[18px] font-bold">
							{collData.FLOOR_PRICE}ETH
						</div>
						<div className="text-sm mt-2 text-[15px] text-[#b7b7b7]">
							Floor Price
						</div>
					</div>
					<div className="">
						<div className="text-[18px] font-bold">
							{collData.SUPPLY}
						</div>
						<div className="text-sm mt-2 text-[15px] text-[#b7b7b7]">
							Total Supply
						</div>
					</div>
					<div className="">
						<div className="text-[18px] font-bold">
							{collData.OWNERS}
						</div>
						<div className="text-sm mt-2 text-[15px] text-[#b7b7b7]">
							Unique Owners
						</div>
					</div>
					<div className="">
						<div className="text-[18px] font-bold">0.75ETH</div>
						<div className="text-sm mt-2 text-[15px] text-[#b7b7b7]">
							total volume
						</div>
					</div>
				</div>

				{nftData.length === 0 && <Loader />}

				<div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4 text-white pb-5">
					{nftData.map((nft) => {
						return (
							<Link
								to={`/collection/${nft.contractAddress}/${nft.tokenId}`}
								state={{ data: nft }}
								className="max-w-[250px]"
							>
								<div className="flex flex-col border-2 border-red-200 rounded-[15px] overflow-hidden">
									<img
										src={`https://ipfs.io/ipfs/${
											nft.metadata.imageURI.split("//")[1]
										}`}
										alt=""
										className="w-full aspect-square"
									/>

									<div className="mt-0 p-4">
										<div className="font-bold mb-2 text-center">
											<div>
												{nft.metadata.name} #
												{nft.tokenId}
											</div>
										</div>
										<div className="flex gap-[10px] text-center mt-4">
											<div className="w-1/2 text-sm">
												<span className="font-[600] text-[#b7b7b7]">
													Price
												</span>
												<br />
												{nft.price} SHM
											</div>
											<div className="w-1/2 text-sm">
												<span className="font-[600] text-[#b7b7b7]">
													DownPayment
												</span>
												<br />
												30%
											</div>
										</div>
									</div>
								</div>
							</Link>
						);
					})}
				</div>
			</div>
		</div>
	);
}
