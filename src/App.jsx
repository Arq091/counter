import supabase from "./client";
import { useState, useEffect } from "react";
import "./styles/button.css";

function App() {
  const [count, setCount] = useState(0);
  const [lcount, setLcount] = useState(0);
  const [loading, setLoading] = useState(false);

  let plusnum;

  if ("localCount" in localStorage) {
    console.log("ur mom");
    plusnum = 1;
  } else {
    localStorage.setItem("localCount", lcount);
    plusnum = 0;
  }
  const localCount = localStorage.getItem("localCount");

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
    setLcount(parseInt(localCount));
    fetchCount();
  }, []);

  const handleClick = async () => {
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
      <h1 className="text-4xl mb-8 font-bold text-center">Clicking Counter</h1>
      <p className="mb-2 font-semibold text-lg text-purple-700">
        press the button!👇
      </p>
      <button className="pushable mb-4 select-none">
        <span className="shadow"></span>
        <span className="edge"></span>
        <span className="front " onClick={handleClick}>
          Push me
        </span>
      </button>
      <h2 className="font-semibold text-lg">Stats:</h2>
      <p className="m-1">
        total clicks - ww:
        <span className=" bg-gray-300 p-1 ml-1 rounded font-mono">
          {loading ? "loading..." : count}
        </span>
      </p>
      <p>
        total clicks - this machine:
        <span className=" bg-gray-300 p-1 ml-1 rounded font-mono">
          {loading ? "loading..." : lcount}
        </span>
      </p>

      <p className="bg-red-50 p-1 text-red-600 border border-red-600 max-w-sm text-center m-4">
        <h2 className="font-semibold inline mr-2 ">Note:</h2>May take 1 - 2
        seconds for changes to register to database.
      </p>
    </div>
  );
}

export default App;
