import { useEffect, useState } from "react";
import data from "../../../assets/data.json";
import { useNavigate } from "react-router-dom";

const UserData = ({ users }) => {
	const navigate = useNavigate();

	const handleRedirect = (address) => {
		navigate(`/collection/${address}`);
	};

	return (
		<>
			{users.map((curUser) => {
				const {
					COLLECTION,
					FLOOR_PRICE,
					oneD_CHANGE,
					sevenD_CHANGE,
					oneD_VOLUME,
					sevenD_VOLUME,
					OWNERS,
					SUPPLY,
				} = curUser;
				const red = oneD_CHANGE < 0;
				return (
					<tr
						key={curUser.address}
						className="hover:bg-gray-600 text-center"
						onClick={() => handleRedirect(curUser.address)}
						style={{ cursor: "pointer" }}
					>
						<td className="p-2 text-start border-separated border-spacing-x-[20px] flex items-center sm:flex-row flex-col">
							<img
								src={curUser.img}
								className="w-16 rounded-full m-4"
							/>
							<p className="whitespace-nowrap sm:whitespace-normal sm:break-words">
								{COLLECTION}
							</p>
						</td>
						<td className="">{FLOOR_PRICE}</td>
						<td
							className={` ${
								red ? "text-orange-700" : "text-white"
							}`}
						>
							{oneD_CHANGE}
						</td>
						<td className="p-4">{sevenD_CHANGE}</td>
						<td className="p-4">{oneD_VOLUME}</td>
						<td className="p-4">{sevenD_VOLUME}</td>
						<td className="p-4">{OWNERS}</td>
						<td className="p-4">{SUPPLY}</td>
					</tr>
				);
			})}
		</>
	);
};

const Chart = () => {
	const [users, setUsers] = useState([]);

	const fetchUser = async () => {
		try {
			if (data.length > 0) {
				setUsers(data);
			}
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		fetchUser();
	}, []);

	return (
		<div className=" mb-[100px]  max-w-[1280px] mx-auto px-[10px]">
			<h1
				className="p-4 text-2xl text-center"
				style={{
					fontFamily: "Inter, Arial",
					fontWeight: "500",
					letterSpacing: "0.2rem",
					fontSize: "2rem",
				}}
			>
				Top Collections
			</h1>

			<div className="mt-10 px-3">
				<div className="overflow-auto">
					<table className="text-sm w-[100%] leading-[30px] whitespace-nowrap ">
						<thead className="border-b-1 border-white">
							<tr className="whitespace-nowrap">
								<th className="pl-4 sm:w-[300px] block">
									COLLECTION
								</th>
								<th className="px-4">FLOOR PRICE</th>
								<th className="px-4">1D CHANGE</th>
								<th className="px-4">7D CHANGE</th>
								<th className="px-4">1D VOLUME</th>
								<th className="px-4">7D VOLUME</th>
								<th className="px-4">OWNERS</th>
								<th className="px-4">SUPPLY</th>
							</tr>
						</thead>
						<tbody>
							<UserData users={users} />
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
};

export default Chart;
