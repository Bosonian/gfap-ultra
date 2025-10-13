export default function ProbabilityRing({ percent = 0, level = "normal" }) {
  const radius = 50;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  // pick color based on level
  const strokeColor =
    level === "critical"
      ? "#DC2626" // red-600
      : level === "high"
        ? "#F59E0B" // amber-500
        : "#2563EB"; // blue-600

  return (
    <div className="relative w-28 h-28 flex items-center justify-center">
      {/* Background circle */}
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
        <circle
          cx="60"
          cy="60"
          r={radius}
          stroke="rgba(0,0,0,0.1)"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress arc */}
        <circle
          cx="60"
          cy="60"
          r={radius}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          fill="none"
          className="transition-all duration-700 ease-out"
        />
      </svg>

      {/* Text */}
      <div className="absolute text-center">
        <span className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          {Math.round(percent)}%
        </span>
      </div>
    </div>
  );
}
