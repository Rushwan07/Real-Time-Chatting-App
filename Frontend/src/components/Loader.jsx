import { motion } from "framer-motion";
import React from "react";

const Loader = ({ s = 10, c = "#08CB00" }) => {
  return (
    <motion.div
      className="flex items-center justify-center gap-1 ml-1 h-5"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {[0, 0.15, 0.3].map((delay, i) => (
        <motion.span
          key={i}
          style={{
            width: s * 4, // tailwind w-1 = 4px equivalent
            height: s * 4,
            backgroundColor: c,
          }}
          className="rounded-full"
          animate={{ y: [0, -4, 0] }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            ease: "easeInOut",
            delay,
          }}
        />
      ))}
    </motion.div>
  );
};

export default Loader;
