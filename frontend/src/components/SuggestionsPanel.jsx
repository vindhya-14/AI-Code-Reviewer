import { motion } from "framer-motion";
import { FiCpu } from "react-icons/fi";

const SuggestionsPanel = ({ codeSuggestions, handleSuggestionClick }) => (
  <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 shadow-2xl">
    <h3 className="text-lg font-semibold text-purple-300 mb-3 flex items-center gap-2">
      <FiCpu />
      <span>Quick Suggestions</span>
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      {codeSuggestions.map((suggestion, index) => (
        <motion.div
          key={index}
          whileHover={{ y: -5 }}
          whileTap={{ scale: 0.98 }}
          className="bg-gray-800/50 hover:bg-gray-700/50 rounded-lg p-3 cursor-pointer border border-gray-700 transition-all"
          onClick={() => handleSuggestionClick(suggestion.code)}
        >
          <h4 className="font-medium text-purple-200">{suggestion.title}</h4>
          <div className="text-xs text-gray-400 mt-1 line-clamp-2">
            {suggestion.code.split("\n")[0]}
          </div>
        </motion.div>
      ))}
    </div>
  </div>
);

export default SuggestionsPanel;
