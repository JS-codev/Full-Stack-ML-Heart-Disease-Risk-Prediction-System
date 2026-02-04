export default function coolBackground({ children }) {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-zinc-950 p-4 overflow-hidden">
      {/* Optional: Add a subtle global ambient glow */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -right-[10%] w-[50%] h-[50%] bg-blue-500/70 rounded-full blur-[120px]" />
        <div className="absolute -bottom-[10%] -left-[10%] w-[50%] h-[50%] bg-cyan-500/30 rounded-full blur-[120px]" />
      </div>

      {/* This is where your App content will land */}
      <div className="relative z-10 w-full flex flex-col items-center">
        {children}
      </div>
    </div>
  );
}


// relative min-h-screen bg-linear-to-r from-indigo-200 to-teal-100 p-7