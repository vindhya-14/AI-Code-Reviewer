import { motion, AnimatePresence } from "framer-motion";
import { FaRobot } from "react-icons/fa";
import { FiStar, FiCode } from "react-icons/fi";
import Markdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";

const ReviewPanel = ({
  activeTab,
  setActiveTab,
  isLoading,
  review,
  reviewRef,
  history,
  loadFromHistory,
}) => (
  <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 flex-grow flex flex-col shadow-2xl">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-bold text-purple-300 flex items-center gap-2">
        <FaRobot />
        <span>AI Assistant</span>
      </h2>
      <div className="flex bg-gray-800 rounded-lg p-1">
        {["review", "history"].map((tab) => (
          <button
            key={tab}
            className={`px-4 py-1 rounded-md transition-all ${
              activeTab === tab
                ? "bg-purple-600 text-white"
                : "text-gray-400 hover:text-white"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>
    </div>

    <div className="flex-grow rounded-lg bg-gray-900/80 overflow-auto border border-gray-700 shadow-inner scrollbar-thin scrollbar-thumb-purple-700 scrollbar-track-gray-800 p-4">
      <AnimatePresence mode="wait">
        {activeTab === "review" ? (
          <motion.div
            key="review"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mb-4"></div>
                <p className="text-purple-300">Analyzing your code...</p>
              </div>
            ) : review ? (
              <div ref={reviewRef}>
                <Markdown rehypePlugins={[rehypeHighlight]}>{review}</Markdown>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center text-gray-400">
                <FiCode className="text-4xl mb-4" />
                <h3 className="text-xl font-medium text-purple-200 mb-2">
                  No Review Yet
                </h3>
                <p>
                  Write or paste your code and click "Get Review" to see AI
                  suggestions.
                </p>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="history"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            {history.length > 0 ? (
              <div className="space-y-4">
                {history.map((item, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.01 }}
                    className="bg-gray-800/50 rounded-lg p-4 border border-gray-700 cursor-pointer"
                    onClick={() => loadFromHistory(item)}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-mono text-purple-300">
                        {item.timestamp}
                      </span>
                      <span className="text-xs bg-purple-900/50 text-purple-300 px-2 py-1 rounded">
                        {item.code.split("\n")[0]}
                      </span>
                    </div>
                    <div className="text-sm line-clamp-2">
                      {item.review.split("\n")[0]}
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center text-gray-400">
                <FiStar className="text-4xl mb-4" />
                <h3 className="text-xl font-medium text-purple-200 mb-2">
                  No History Yet
                </h3>
                <p>
                  Your review history will appear here after you get your first
                  review.
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  </div>
);

export default ReviewPanel;
