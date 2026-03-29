"use client";

import { useEffect, useMemo, useState } from "react";

export default function Cronometro() {
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (!isRunning) {
      return;
    }

    const intervalId = globalThis.setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);

    return () => {
      globalThis.clearInterval(intervalId);
    };
  }, [isRunning]);

  const { minutes, seconds } = useMemo(() => {
    return {
      minutes: Math.floor(secondsElapsed / 60),
      seconds: secondsElapsed % 60,
    };
  }, [secondsElapsed]);

  const handleStart = () => {
    setIsRunning(true);
  };

  const handleStop = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setSecondsElapsed(0);
  };

  return (
    <section className="mx-auto mt-10 w-full max-w-4xl rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
      <h2 className="text-6xl font-bold text-zinc-900">Timer</h2>

      <p className="mt-10 text-5xl font-semibold text-zinc-900">
        {minutes} mins {seconds} secs
      </p>

      <div className="mt-10 flex flex-wrap gap-4">
        <button
          type="button"
          onClick={handleStart}
          className="min-w-32 bg-green-600 px-8 py-5 text-4xl font-semibold text-black transition hover:bg-green-500"
        >
          Start
        </button>

        <button
          type="button"
          onClick={handleStop}
          className="min-w-32 bg-red-600 px-8 py-5 text-4xl font-semibold text-black transition hover:bg-red-500"
        >
          Stop
        </button>

        <button
          type="button"
          onClick={handleReset}
          className="min-w-32 bg-yellow-300 px-8 py-5 text-4xl font-semibold text-black transition hover:bg-yellow-200"
        >
          Reset
        </button>
      </div>
    </section>
  );
}