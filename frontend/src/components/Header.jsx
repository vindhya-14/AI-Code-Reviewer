import { motion } from "framer-motion";
import { FaRobot } from "react-icons/fa";
import { FiCopy, FiCheck } from "react-icons/fi";

const Header = ({ copyCode, copied }) => (
  <header className="relative z-10 p-6 flex justify-between items-center">
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-center gap-3"
    >
      <FaRobot className="text-3xl text-purple-400" />
      <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-300">
        CodeAI Review
      </h1>
    </motion.div>

    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md px-4 py-2 rounded-lg border border-white/20 transition-all"
      onClick={copyCode}
    >
      {copied ? (
        <>
          <FiCheck className="text-green-400" />
          <span>Copied!</span>
        </>
      ) : (
        <>
          <FiCopy />
          <span>Copy Code</span>
        </>
      )}
    </motion.button>
  </header>
);

export default Header;
