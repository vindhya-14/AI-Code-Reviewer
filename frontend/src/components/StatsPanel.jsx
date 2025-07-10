const StatsPanel = ({ code, history }) => {
  const lineCount = code.split("\n").length;
  const wordCount = code.split(" ").filter(Boolean).length;
  const charCount = code.length;
  const reviewCount = history.length;

  return (
    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 shadow-2xl">
      <h3 className="text-lg font-semibold text-purple-300 mb-3">Code Stats</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Lines", value: lineCount },
          { label: "Words", value: wordCount },
          { label: "Characters", value: charCount },
          { label: "Reviews", value: reviewCount },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="bg-gray-800/50 rounded-lg p-3 text-center"
          >
            <div className="text-2xl font-bold text-purple-300">{value}</div>
            <div className="text-xs text-gray-400">{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatsPanel;
