import React from "react";
import { Link } from "react-scroll";
const MobileNavLinks = ({ link, herf, setTonggle }) => {
  return (
    <li className="list-none cursor-pointer mr-8">
      <Link
        to={herf}
        spy={true}
        smooth={true}
        duration={500}
        offset={-50}
        className=" font-bold transition-all duration-300 "
        onClick={() => setTonggle(false)}
      >
        {link}
      </Link>
    </li>
  );
};

export default MobileNavLinks;
