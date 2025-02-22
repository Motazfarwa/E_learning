import React from "react";
import { motion } from "framer-motion";

const Categories = ({ icon: Icon, category }) => {
  const item = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  return (
    <motion.div
      variants={item}
      whileHover={{ scale: 1.1 }}
      className="flex items-center cursor-pointer flex-col gap-4 bg-white p-8 rounded-md shadow-md"
    >
      <div className="text-4xl text-teal-500">
        {typeof Icon === "function" ? <Icon /> : Icon}
      </div>
      <div className="font-semibold text-lg">{category}</div>
      <a href="#" className="text-sm text-gray-500 hover:underline">
        View More
      </a>
    </motion.div>
  );
};

export default Categories;
