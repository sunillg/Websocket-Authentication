import { motion } from "framer-motion";

function Practice() {
  return (
    <center>
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 5 }}
    >
      Hello, JS!
    </motion.div>
    </center>
  );
}

export default Practice;
