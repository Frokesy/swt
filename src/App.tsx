import { Canvas } from "@react-three/fiber"
import { Suspense } from "react"
import Three from "./components/Three"
import "./App.css"
function App() {
  // bg-[#f1f1f1]
  return (
    <Canvas className="bg-[#000]" id="canvas" shadows>
      <Suspense fallback={null}>
        <Three />
      </Suspense>
    </Canvas>
  )
}

export default App
