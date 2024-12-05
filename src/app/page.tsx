"use client";

import React, { useEffect, useState } from "react";

import IconPlay from "@/icons/IconPlay";
import IconPause from "@/icons/IconPause";
import IconStop from "@/icons/IconStop";

export default function Home() {
  const [statusClass, setStatusClass] = useState("colors-done");
  const [isPaused, setIsPaused] = useState(true);
  const [time, setTime] = useState("00:00");
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
  const [remainingSeconds, setRemainingSeconds] = useState(0);

  const handlePauseResume = () => {
    setIsPaused(!isPaused);
  };

  const handleStop = () => {
    if (intervalId) clearInterval(intervalId);
    setTime("00:00");
    setRemainingSeconds(0);
    setIsPaused(true);
    setStatusClass("colors-done");
  };

  const handleChangeMinutes = (value: number) => {
    setStatusClass("colors-progress");
    const totalSeconds = value * 60;
    setRemainingSeconds(totalSeconds);
    setIsPaused(false);
  };

  useEffect(() => {
    if (intervalId) clearInterval(intervalId);

    if (remainingSeconds > 0) {
      const updateTimerDisplay = () => {
        const mins = Math.floor(remainingSeconds / 60)
          .toString()
          .padStart(2, "0");
        const secs = (remainingSeconds % 60).toString().padStart(2, "0");
        setTime(`${mins}:${secs}`);
      };

      updateTimerDisplay();

      const newIntervalId = setInterval(() => {
        if (!isPaused) {
          setRemainingSeconds((prev) => {
            if (prev <= 1) {
              clearInterval(newIntervalId);
              setTime("00:00");
              setStatusClass("colors-done");
              setIsPaused(true);
              return 0;
            }
            return prev - 1;
          });
        }
      }, 1000);

      setIntervalId(newIntervalId);
    } else {
      setTime("00:00");
      setStatusClass("colors-done");
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [remainingSeconds, isPaused]);

  return (
    <div
      className={`w-full min-h-[100vh] flex flex-col justify-center items-center ${statusClass} timer`}
    >
      <h1 className="text-[50px] leading-[56px] mb-4">FOCUS TIMER</h1>

      <div className="mb-10">
        <div className="flex items-center text-[150px]">{time}</div>
        <div className="flex justify-center gap-4">
          <button className="button" onClick={handlePauseResume}>
            {isPaused ? <IconPlay /> : <IconPause />}
          </button>
          <button className="button" onClick={handleStop}>
            <IconStop />
          </button>
        </div>
      </div>

      <div className="flex gap-4">
        <button className="button" onClick={() => handleChangeMinutes(60)}>
          1h
        </button>
        <button className="button" onClick={() => handleChangeMinutes(45)}>
          45m
        </button>
        <button className="button" onClick={() => handleChangeMinutes(30)}>
          30m
        </button>
        <button className="button" onClick={() => handleChangeMinutes(15)}>
          15m
        </button>
        <button className="button" onClick={() => handleChangeMinutes(10)}>
          10m
        </button>
        <button className="button" onClick={() => handleChangeMinutes(5)}>
          5m
        </button>
      </div>
    </div>
  );
}
