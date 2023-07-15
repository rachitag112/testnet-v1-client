import React from "react";
import "./popularCollections.css";
import data from "../../../assets/data.json";
import { useNavigate } from "react-router-dom";

export default function PopularCollections() {
	const navigate = useNavigate();
	const handleRedirect = (address) => {
		navigate(`/collection/${address}`);
	};

	return (
		<div className="text-white font-semibold mb-[100px] mx-auto max-w-[1280px] px-[10px]">
			<h1
				className="p-4 text-2xl text-center"
				style={{
					fontFamily: "Inter, Arial",
					fontWeight: "500",
					letterSpacing: "0.2rem",
					fontSize: "2rem",
				}}
			>
				Popular Collections
			</h1>

			<div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4 mt-10 ">
				{data.slice(2, 6).map((coll, ixd) => {
					return (
						<div
							key={ixd}
							className="flex card items-end cursor-pointer rounded-[8px] bg-center bg-cover aspect-square"
							style={{ backgroundImage: `url(${coll.img})` }}
							onClick={() => handleRedirect(coll.address)}
						>
							<div className="flex flex-col m-4 blue-glassmorphism w-full p-2">
								<div className="font-bold mb-2 flex items-center justify-between">
									<div>{coll.COLLECTION}</div>
								</div>
								<div className="flex">
									<div className="w-24 text-sm">
										FLOOR PRICE
										<br />
										{coll.FLOOR_PRICE} SHM
									</div>
								</div>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}
