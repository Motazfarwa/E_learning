import React, { useState } from "react";
import { BsChevronDown } from "react-icons/bs";
import { motion, AnimatePresence } from "framer-motion";

const Accordion = ({ title, id, activeIndex, setActiveIndex }) => {
  const isActive = id === activeIndex;

  const handleClick = () => {
    setActiveIndex(isActive ? null : id);
  };

  return (
    <div className="pb-8 border-b border-gray-300">
      <div
        className="flex items-center justify-between cursor-pointer"
        role="button"
        onClick={handleClick}
        aria-expanded={isActive}
      >
        <div className="sm:text-xl text-base font-bold">{title}</div>
        <BsChevronDown
          className={`transform transition-transform duration-300 ${
            isActive ? "rotate-180" : "rotate-0"
          }`}
        />
      </div>
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ overflow: "hidden" }}
            className="pt-4"
          >
            <p className="text-sm leading-7 text-gray-500">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Amet,
              quaerat in! Quaerat provident nobis aperiam sit rem earum minus
              accusamus? Lorem ipsum dolor sit, amet consectetur adipisicing
              elit. Possimus ad quidem sint iste ullam dignissimos, molestias
              iure cupiditate et? Non!
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Accordions = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const accordionItems = [
    { id: 1, title: "Accordion 1" },
    { id: 2, title: "Accordion 2" },
    { id: 3, title: "Accordion 3" },
  ];

  return (
    <div>
      {accordionItems.map((item) => (
        <Accordion
          key={item.id}
          id={item.id}
          title={item.title}
          activeIndex={activeIndex}
          setActiveIndex={setActiveIndex}
        />
      ))}
    </div>
  );
};

export default Accordions;
