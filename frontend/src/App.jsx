import { useState, useEffect, useRef } from "react";
import "prismjs/themes/prism-tomorrow.css";
import prism from "prismjs";
import Editor from "react-simple-code-editor";
import axios from "axios";
import Markdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import { motion, AnimatePresence } from "framer-motion";
import { FiCopy, FiCheck, FiStar, FiCode, FiZap, FiCpu } from "react-icons/fi";
import { FaRobot } from "react-icons/fa";

function App() {
  const [code, setCode] = useState(`function sum(a, b) {\n  return a + b;\n}`);
  const [review, setReview] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("review");
  const [history, setHistory] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const editorRef = useRef(null);
  const reviewRef = useRef(null);

  // Sample code suggestions
  const codeSuggestions = [
    {
      title: "React Component",
      code: `function MyComponent() {\n  const [count, setCount] = useState(0);\n\n  return (\n    <div>\n      <p>Count: {count}</p>\n      <button onClick={() => setCount(count + 1)}>Increment</button>\n    </div>\n  );\n}`,
    },
    {
      title: "API Fetch",
      code: `async function fetchData() {\n  try {\n    const response = await fetch('https://api.example.com/data');\n    const data = await response.json();\n    return data;\n  } catch (error) {\n    console.error('Error:', error);\n    throw error;\n  }\n}`,
    },
    {
      title: "Form Validation",
      code: `function validateForm(formData) {\n  const errors = {};\n  \n  if (!formData.email.includes('@')) {\n    errors.email = 'Invalid email format';\n  }\n  \n  if (formData.password.length < 8) {\n    errors.password = 'Password must be at least 8 characters';\n  }\n  \n  return {\n    isValid: Object.keys(errors).length === 0,\n    errors\n  };\n}`,
    },
  ];

  useEffect(() => {
    prism.highlightAll();
  }, [code, review]);

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  async function reviewCode() {
    if (!code.trim()) return;

    setIsLoading(true);
    try {
      const response = await axios.post("http://localhost:3000/ai/get-review", {
        code,
      });
      setReview(response.data);
      setActiveTab("review");

      // Add to history
      setHistory((prev) => [
        {
          code,
          review: response.data,
          timestamp: new Date().toLocaleString(),
        },
        ...prev.slice(0, 4),
      ]);
    } catch (error) {
      setReview("## Error\nFailed to get review. Please try again later.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  async function optimizeCode() {
    if (!code.trim()) return;

    setIsLoading(true);
    try {
      const response = await axios.post("http://localhost:3000/ai/optimize", {
        code,
      });
      setCode(response.data.optimizedCode);
      setReview(`## Optimization Suggestions\n${response.data.suggestions}`);
      setActiveTab("review");
    } catch (error) {
      setReview("## Error\nFailed to optimize code. Please try again later.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  function copyCode() {
    navigator.clipboard.writeText(code);
    setCopied(true);
  }

  function handleSuggestionClick(suggestionCode) {
    setCode(suggestionCode);
    editorRef.current._input.focus();
  }

  function loadFromHistory(item) {
    setCode(item.code);
    setReview(item.review);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 text-white overflow-x-hidden">
      {/* Floating particles background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-purple-500/20"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              width: Math.random() * 10 + 5,
              height: Math.random() * 10 + 5,
              opacity: Math.random() * 0.5 + 0.1,
            }}
            animate={{
              y: [null, Math.random() * 100 - 50],
              x: [null, Math.random() * 100 - 50],
              transition: {
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                repeatType: "reverse",
              },
            }}
          />
        ))}
      </div>

      {/* Header */}
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

      <main className="relative z-10 p-6 flex flex-col lg:flex-row gap-6 min-h-[calc(100vh-80px)]">
        {/* Left: Code Editor */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="w-full lg:w-1/2 h-full flex flex-col gap-6"
        >
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
                  className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-4 py-2 rounded-lg transition-all disabled:opacity-50"
                >
                  <FiStar />
                  <span>{isLoading ? "Reviewing..." : "Get Review"}</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={optimizeCode}
                  disabled={isLoading}
                  className="flex items-center gap-2 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg transition-all disabled:opacity-50"
                >
                  <FiZap />
                  <span>Optimize</span>
                </motion.button>
              </div>
            </div>
            <div className="flex-grow rounded-lg bg-gray-900/80 overflow-auto border border-gray-700 shadow-inner scrollbar-thin scrollbar-thumb-purple-700 scrollbar-track-gray-800">
              <Editor
                ref={editorRef}
                value={code}
                onValueChange={setCode}
                highlight={(code) =>
                  prism.highlight(
                    code,
                    prism.languages.javascript,
                    "javascript"
                  )
                }
                padding={16}
                style={{
                  fontFamily: '"Fira Code", monospace',
                  fontSize: 16,
                  backgroundColor: "transparent",
                  height: "100%",
                  minHeight: "300px",
                }}
              />
            </div>
          </div>

          {/* Code Suggestions */}
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
                  <h4 className="font-medium text-purple-200">
                    {suggestion.title}
                  </h4>
                  <div className="text-xs text-gray-400 mt-1 line-clamp-2">
                    {suggestion.code.split("\n")[0]}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Right: Review Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="w-full lg:w-1/2 h-full flex flex-col gap-6"
        >
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
                        <p className="text-purple-300">
                          Analyzing your code...
                        </p>
                      </div>
                    ) : review ? (
                      <div ref={reviewRef}>
                        <Markdown rehypePlugins={[rehypeHighlight]}>
                          {review}
                        </Markdown>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-center text-gray-400">
                        <FiCode className="text-4xl mb-4" />
                        <h3 className="text-xl font-medium text-purple-200 mb-2">
                          No Review Yet
                        </h3>
                        <p>
                          Write or paste your code and click "Get Review" to see
                          AI suggestions.
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
                          Your review history will appear here after you get
                          your first review.
                        </p>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Stats/Info Panel */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 shadow-2xl">
            <h3 className="text-lg font-semibold text-purple-300 mb-3">
              Code Stats
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-purple-300">
                  {code.split("\n").length}
                </div>
                <div className="text-xs text-gray-400">Lines</div>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-purple-300">
                  {code.split(" ").filter(Boolean).length}
                </div>
                <div className="text-xs text-gray-400">Words</div>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-purple-300">
                  {code.length}
                </div>
                <div className="text-xs text-gray-400">Characters</div>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-purple-300">
                  {history.length}
                </div>
                <div className="text-xs text-gray-400">Reviews</div>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

export default App;
