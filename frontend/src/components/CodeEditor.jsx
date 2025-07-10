import Editor from "react-simple-code-editor";
import prism from "prismjs";
import { FiCode, FiStar, FiZap } from "react-icons/fi";
import { motion } from "framer-motion";

const CodeEditor = ({
  code,
  setCode,
  isLoading,
  reviewCode,
  optimizeCode,
  editorRef,
}) => (
  <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 flex-grow flex flex-col shadow-2xl">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-bold text-purple-300 flex items-center gap-2">
        <FiCode />
        <span>Code Editor</span>
      </h2>
      <div className="flex gap-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={reviewCode}
          disabled={isLoading}
          className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg transition-all disabled:opacity-50"
        >
          <FiStar />
          <span>{isLoading ? "Reviewing..." : "Get Review"}</span>
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={optimizeCode}
          disabled={isLoading}
          className="flex items-center gap-2 bg-gradient-to-r from-pink-600 to-purple-600 text-white px-4 py-2 rounded-lg transition-all disabled:opacity-50"
        >
          <FiZap />
          <span>Optimize</span>
        </motion.button>
      </div>
    </div>

    <div className="flex-grow rounded-lg bg-gray-900/80 overflow-auto border border-gray-700">
      <Editor
        ref={editorRef}
        value={code}
        onValueChange={setCode}
        highlight={(code) =>
          prism.highlight(code, prism.languages.javascript, "javascript")
        }
        padding={16}
        style={{
          fontFamily: '"Fira Code", monospace',
          fontSize: 16,
          backgroundColor: "transparent",
          height: "100%",
        }}
      />
    </div>
  </div>
);

export default CodeEditor;
