import supabase from "./client";
import sound from "./sound/click sound.mp3";

import { useState, useEffect, useRef } from "react";

import "./styles/button.css";

function App() {
  const [count, setCount] = useState(0);
  const [lcount, setLcount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  let plusnum;

  //checks if localcount exists
  if ("localCount" in localStorage) {
    console.log("ur mom");
    plusnum = 1;
  } else {
    localStorage.setItem("localCount", lcount);
    plusnum = 0;
  }

  //get localcount
  const localCount = localStorage.getItem("localCount");

  //fetch the data and save local clicks
  useEffect(() => {
    const fetchCount = async () => {
      setLoading(true);
      let { data, error } = await supabase
        .from("count")
        .select("currentcount")
        .eq("id", 1);
      setCount(data[0].currentcount);
      setLoading(false);
    };

    if ("ontouchstart" in window) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }

    setLcount(parseInt(localCount));
    fetchCount();
  }, []);

  //play sound
  const playSound = () => {
    const audio = new Audio(sound);
    audio.currentTime = 0;
    audio.play();
  };

  //handle click
  const handleClick = async () => {
    playSound();
    setCount(count + 1);
    setLcount(lcount + 1);
    localStorage.setItem("localCount", lcount + plusnum);

    const { data, error } = await supabase
      .from("count")
      .update({ currentcount: count + 1 })
      .eq("id", 1);
  };

  return (
    <div className="flex flex-col items-center justify-center h-[100vh] w-full">
      <h1 className="text-[2rem] mb-4 font-bold text-center">
        Clicking Counter
      </h1>
      <p className="mb-2 font-semibold text-lg text-purple-700">
        press the button!👇
      </p>
      <button className="pushable mb-8 select-none" onClick={handleClick}>
        <span className="shadow"></span>
        <span className="edge"></span>
        <span className="front ">Push me</span>
      </button>
      <h2 className="font-semibold text-lg">Stats:</h2>
      <p className="m-1">
        total clicks - ww:
        <span className=" bg-gray-300 p-1 ml-1 rounded font-mono">
          {loading ? "loading..." : count}
        </span>
      </p>
      <p>
        total clicks - this {isMobile ? "phone" : "pc"}:
        <span className=" bg-gray-300 p-1 ml-1 rounded font-mono">
          {loading ? "loading..." : lcount}
        </span>
      </p>

      <p className="bg-red-50 p-1 text-red-600 border border-red-600 max-w-sm text-center m-4">
        <span className="font-semibold inline mr-2 ">Note:</span>May take 1 - 2
        seconds for changes to register to database.
      </p>
    </div>
  );
}

export default App;
