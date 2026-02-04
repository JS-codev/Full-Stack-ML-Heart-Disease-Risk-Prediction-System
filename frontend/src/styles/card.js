export default function PerformanceCard({ children }) {
  return (
    <div className="relative max-lg:row-start-1 rounded-[calc(var(--radius-lg)+1px)] overflow-hidden mb-10">
      {/* Background with blur */}
      <div
        className="absolute inset-0 bg-gray-700/70 backdrop-blur-md pointer-events-none"
      />

      {/* Optional outline for glass effect */}
      <div className="pointer-events-none absolute inset-0 rounded-[calc(var(--radius-lg)+1px)] 
                      border border-blue-500/50 shadow-lg" />

      {/* Actual content */}
      <div className="relative flex flex-col h-full p-4 overflow-visible">
        {children}
      </div>
    </div>
  );
}
 