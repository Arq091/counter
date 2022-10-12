import supabase from "./client"
import sound from "./sound/click sound.mp3"

import { useState, useEffect, memo } from "react"

import "./styles/button.css"

function App() {
  const [count, setCount] = useState(0)
  const [lcount, setLcount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  let plusnum

  //checks if localcount exists
  if ("localCount" in localStorage) {
    plusnum = 1
  } else {
    localStorage.setItem("localCount", lcount)
    plusnum = 0
  }

  //get localcount
  const localCount = localStorage.getItem("localCount")

  //fetch the data and save local clicks
  useEffect(() => {
    const fetchCount = async () => {
      setLoading(true)
      let { data, error } = await supabase
        .from("count")
        .select("currentcount")
        .eq("id", 1)
      setCount(data[0].currentcount)
      setLoading(false)
    }

    if ("ontouchstart" in window) {
      setIsMobile(true)
    } else {
      setIsMobile(false)
    }

    setLcount(parseInt(localCount))
    fetchCount()
  }, [])

  //play sound
  const playSound = () => {
    const audio = new Audio(sound)
    audio.currentTime = 0
    audio.play()
  }

  //handle click
  const handleClick = async () => {
    playSound()
    setCount(count + 1)
    setLcount(lcount + 1)
    localStorage.setItem("localCount", lcount + plusnum)

    const { data, error } = await supabase
      .from("count")
      .update({ currentcount: count + 1 })
      .eq("id", 1)
  }

  return (
    <div className="flex flex-col items-center justify-center h-[100vh] w-full">
      <header className=" mb-8 text-center">
        <h1 className="text-[2rem] font-bold">Clicking Counter</h1>
        <a
          href="https://github.com/Arq091/counter"
          target="blank"
          className="flex justify-center gap-1 items-center text-gray-600 fill-gray-600"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="21"
            height="21"
            viewBox="0 0 24 24"
            className=""
          >
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
          </svg>
          Github Repo
        </a>
      </header>
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

      <p className="bg-red-50 p-1 text-red-700 border border-red-700 max-w-sm text-center m-4">
        <span className="font-semibold inline mr-2 ">Warning:</span>May take 2 -
        3 seconds for changes to register to database.
      </p>
    </div>
  )
}

export default App
