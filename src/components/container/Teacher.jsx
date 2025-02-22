import React from "react";
import teacher1 from "../../assets/teacher1.png";
import teacher2 from "../../assets/teacher2.png";
import { accordions } from "../../Data";
import Accordions from "./Accordions";

const Teacher = () => {
  return (
    <div className="section" id="teacher">
      <div className=" grid sm:grid-cols-2 place-items-center gap-8">
        <div className=" pl-5">
          <div className=" font-bold sm:text-[1.875rem] text-[1.5rem] ">
            Become <span className=" text-Teal">An Instructor</span>
            <br /> of Our Platform.
          </div>
          <p className=" text-gray leading-7 text-sm mb-4">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Provident
            eos iste aut a deserunt et ipsam reiciendis cupiditate eum est
            maxime asperiores accusamus non, explicabo quibusdam ipsum
            reprehenderit necessitatibus saepe?
          </p>
          <button className=" px-4 bg-Teal py-3 rounded-lg text-sm font-bold text-white">
            Start Teaching
          </button>
        </div>
        <div className="p-4 md:w-3/4 sm:row-start-1">
          <img src={teacher1} alt="" />
        </div>
        <div className=" pl-5">
          <div className=" font-bold sm:text-[1.875rem] text-[1.5rem] ">
            Become <span className=" text-Teal">An Instructor</span>
            <br /> of Our Platform.
          </div>
          <p className=" text-gray leading-7 text-sm mb-4">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Provident
            eos iste aut a deserunt et ipsam reiciendis cupiditate eum est
            maxime asperiores accusamus non, explicabo quibusdam ipsum
            reprehenderit necessitatibus saepe?
          </p>
          <button className=" px-4 bg-Teal py-3 rounded-lg text-sm font-bold text-white">
            Get Started
          </button>
        </div>
        <div className="p-4 md:w-3/4 ">
          <img src={teacher2} alt="" />
        </div>
      </div>
  
    </div>
  );
};

export default Teacher;
