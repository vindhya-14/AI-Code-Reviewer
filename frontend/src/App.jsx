import { useState, useEffect, useRef } from "react";
import prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";
import axios from "axios";

import Header from "./components/Header";
import CodeEditor from "./components/CodeEditor";
import SuggestionsPanel from "./components/SuggestionsPanel";
import ReviewPanel from "./components/ReviewPanel";
import StatsPanel from "./components/StatsPanel";
import ParticlesBackground from "./components/ParticlesBackground";

function App() {
  const [code, setCode] = useState(`function sum(a, b) {\n  return a + b;\n}`);
  const [review, setReview] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("review");
  const [history, setHistory] = useState([]);
  const [suggestions] = useState([
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
  ]);

  const editorRef = useRef(null);
  const reviewRef = useRef(null);

  useEffect(() => {
    prism.highlightAll();
  }, [code, review]);

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  const reviewCode = async () => {
    if (!code.trim()) return;

    setIsLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/ai/get-review`,
        { code }
      );
      setReview(response.data);
      setActiveTab("review");

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
  };

  const optimizeCode = async () => {
    if (!code.trim()) return;

    setIsLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/ai/optimize`,
        { code }
      );
      setCode(response.data.optimizedCode);
      setReview(`## Optimization Suggestions\n${response.data.suggestions}`);
      setActiveTab("review");
    } catch (error) {
      setReview("## Error\nFailed to optimize code. Please try again later.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
  };

  const handleSuggestionClick = (suggestionCode) => {
    setCode(suggestionCode);
    editorRef.current?._input?.focus?.();
  };

  const loadFromHistory = (item) => {
    setCode(item.code);
    setReview(item.review);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 text-white overflow-x-hidden">
      <ParticlesBackground />
      <Header copyCode={copyCode} copied={copied} />

      <main className="relative z-10 p-6 flex flex-col lg:flex-row gap-6 min-h-[calc(100vh-80px)]">
        {/* Left Side */}
        <div className="w-full lg:w-1/2 flex flex-col gap-6">
          <CodeEditor
            code={code}
            setCode={setCode}
            isLoading={isLoading}
            reviewCode={reviewCode}
            optimizeCode={optimizeCode}
            editorRef={editorRef}
          />
          <SuggestionsPanel
            codeSuggestions={suggestions}
            handleSuggestionClick={handleSuggestionClick}
          />
        </div>

        {/* Right Side */}
        <div className="w-full lg:w-1/2 flex flex-col gap-6">
          <ReviewPanel
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            isLoading={isLoading}
            review={review}
            reviewRef={reviewRef}
            history={history}
            loadFromHistory={loadFromHistory}
          />
          <StatsPanel code={code} history={history} />
        </div>
      </main>
    </div>
  );
}

export default App;
