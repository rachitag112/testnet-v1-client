import React from "react";
import "./footer.css";
import { AiOutlineInstagram, AiOutlineTwitter } from "react-icons/ai";
import { RiDiscordFill } from "react-icons/ri";

const Footer = () => {
	return (
		<div className="footer">
			<div className="footer-copyright">
				<div>
					<p>
						{" "}
						© {new Date().getFullYear()} GEARFI. All Rights Reserved
					</p>
				</div>
				<div className="flex">
					<a href="#" className="footer-icon">
						<AiOutlineInstagram size={25} />
					</a>
					<a href="#" className="footer-icon">
						<AiOutlineTwitter size={25} />
					</a>
					<a href="#" className="footer-icon">
						<RiDiscordFill size={25} />
					</a>
				</div>
			</div>
		</div>
	);
};

export default Footer;
