import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./profile.css";
import axios from "axios";
import userProfile from "../../assets/profile.jpeg";
import { useParams } from "react-router";
import { AiOutlineArrowRight } from "react-icons/ai";
import { Loader } from "../../inc";

const Profile = () => {
	const { userAddress } = useParams();
	const [listings, setListings] = React.useState(false);
	const [nftData, setNftData] = useState(null);
	let numOfListed = 0;
	let numOfNFTs = 0;

	useEffect(() => {
		console.log("working");
		console.log(
			`${
				process.env.REACT_APP_SERVER_URL
			}/assets?owner=${userAddress.toLowerCase()}`
		);
		axios(
			`${
				process.env.REACT_APP_SERVER_URL
			}/assets?owner=${userAddress.toLowerCase()}`
		).then(({ data }) => {
			setNftData(data);
		});
	}, [userAddress]);

	console.log("datacollection ", nftData);
	return (
		<div
			className="text-white min-h-screen pt-10 max-w-[1280px] mx-auto px-[20px]"
			id="main"
		>
			<div className="text-center">
				<img
					src={userProfile}
					alt=""
					className="w-24 rounded-full mx-auto my-3"
				/>
				<div className=" text-4xl font-bold mb-2">
					{userAddress.slice(0, 4)}...{userAddress.slice(-4)}
				</div>
			</div>

			<div className="flex justify-center mt-[50px]">
				<div
					className={`cursor-pointer m-4 text-3xl font-semibold ${
						!listings ? "text-red-300" : ""
					}`}
					onClick={() => setListings(false)}
				>
					My NFTs
				</div>
				<div
					className={`cursor-pointer m-4 text-3xl font-semibold ${
						listings ? "text-red-300" : ""
					}`}
					onClick={() => setListings(true)}
				>
					Listings
				</div>
			</div>

			{!listings && (
				<div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4 mt-4">
					{nftData?.map((nft) => {
						if (
							!(
								nft.state === "LISTED" ||
								nft.state === "MARGIN_LISTED"
							)
						)
							numOfNFTs++;
						if (
							!(
								nft.state === "LISTED" ||
								nft.state === "MARGIN_LISTED"
							)
						)
							return (
								<Link
									to={`/account/${nft.contractAddress}/${nft.tokenId}`}
									state={{ data: nft }}
									className="max-w-[250px]"
								>
									<div className="relative flex flex-col border-2 border-red-200 rounded-[15px] overflow-hidden">
										<div className="card--badge text-black">
											{nft.state}
										</div>
										<img
											src={`https://ipfs.io/ipfs/${
												nft.metadata?.imageURI.split(
													"//"
												)[1]
											}`}
											alt=""
											className="w-full aspect-square"
										/>
										<div className="flex flex-col mt-0 p-4">
											<div className="font-bold mb-2 flex items-center justify-between">
												<div>
													{nft.metadata?.name} #
													{nft.tokenId}
												</div>
												<div>
													<AiOutlineArrowRight className="mr-4" />
												</div>
											</div>
										</div>
									</div>
								</Link>
							);
					})}
				</div>
			)}

			{listings && (
				<div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4 mt-4">
					{nftData?.map((nft) => {
						if (
							nft.state === "LISTED" ||
							nft.state === "MARGIN_LISTED"
						)
							numOfListed++;
						if (
							nft.state === "LISTED" ||
							nft.state === "MARGIN_LISTED"
						)
							return (
								<Link
									to={`/account/${nft.contractAddress}/${nft.tokenId}`}
									state={{ data: nft }}
									className="max-w-[250px]"
								>
									<div className="relative flex flex-col border-2 border-red-200 rounded-[15px] overflow-hidden">
										<div className="card--badge text-black">
											{nft.state}
										</div>
										<img
											src={`https://ipfs.io/ipfs/${
												nft.metadata?.imageURI.split(
													"//"
												)[1]
											}`}
											alt=""
											className="w-full aspect-square"
										/>
										<div className="flex flex-col mt-0 p-4">
											<div className="font-bold mb-2 flex items-center justify-between">
												<div>
													{nft.metadata?.name} #
													{nft.tokenId}
												</div>
												<div>
													<AiOutlineArrowRight className="mr-4" />
												</div>
											</div>
										</div>
									</div>
								</Link>
							);
					})}
				</div>
			)}

			{!nftData && <Loader />}

			{listings && numOfListed === 0 && (
				<div className="text-center py-8">
					<span
						className="block text-[22px] font-600
          "
					>
						No NFTs found.
					</span>
					<span className="text-[16px] text-[#b7b7b7]">
						List your NFT for sale to show them here.
					</span>
				</div>
			)}

			{!listings && numOfNFTs === 0 && (
				<div className="text-center py-8">
					<span
						className="block text-[22px] font-600
          "
					>
						No NFTs found.
					</span>
					<span className="text-[16px] text-[#b7b7b7]">
						Purchase NFT to show them here.
					</span>
				</div>
			)}
		</div>
	);
};

export default Profile;

//http://localhost:8000/assets?owner=0x0b9Ba03e0D78A473aac15E2B392E0248077bED70
//http://localhost:8000/assets?owner=0x0b9ba03e0d78a473aac15e2b392e0248077bed70
