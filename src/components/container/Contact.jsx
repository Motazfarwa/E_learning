import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const Contact = () => {
  return (
    <div className="section" id="contact">
      <div className="text-center max-w-[600px] mx-auto">
        <div className="sm:text-3xl text-2xl font-bold mb-5">
          Subscribe Newsletter
        </div>
        <p className="text-sm leading-7 text-gray">
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Sit, aut
          neque nulla, ipsam similique dolore, repudiandae laborum labore
          doloremque corrupti autem magni reprehenderit id beatae vero ratione
          sunt repellat cumque.
        </p>
        <AnimatePresence>
          <motion.form
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className="mt-5"
          >
            <input
              type="text"
              placeholder="Enter Your email address"
              className="sm:p-3 p-2 outline-none text-sm shadow-md sm:w-72 w-60"
            />
            <button className="text-sm text-white bg-Teal sm:p-3 p-2 shadow-md font-bold">
              Subscribe
            </button>
          </motion.form>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Contact;
