import { useEffect, useState } from "react"
import Navbar from "./Navbar"

function App() {
  const [isARReady, setIsARReady] = useState(false)
  const [sceneStarted, setSceneStarted] = useState(false)
  const [arStatus, setArStatus] = useState("Initializing AR...")

  /* Load A-Frame + MindAR */
  useEffect(() => {
    const interval = setInterval(() => {
      if (window.AFRAME && window.MINDAR) {
        setIsARReady(true)
        setArStatus("AR Ready – Allow camera access")
        clearInterval(interval)
      }
    }, 100)

    const timeout = setTimeout(() => {
      if (!isARReady) {
        setArStatus("Failed to load AR libraries")
        clearInterval(interval)
      }
    }, 10000)

    return () => {
      clearInterval(interval)
      clearTimeout(timeout)
    }
  }, [isARReady])

  /* MindAR events */
  useEffect(() => {
    if (!isARReady) return

    const sceneEl = document.querySelector("a-scene")
    if (!sceneEl) return

    const onReady = () => {
      setSceneStarted(true)
      setArStatus("AR Started – Point camera at target image")
    }

    const onError = (e) => {
      setArStatus(`AR Error: ${e.detail?.error || "Unknown error"}`)
    }

    sceneEl.addEventListener("arReady", onReady)
    sceneEl.addEventListener("arError", onError)

    return () => {
      sceneEl.removeEventListener("arReady", onReady)
      sceneEl.removeEventListener("arError", onError)
    }
  }, [isARReady])

  /* Loading screen */
  if (!isARReady) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center bg-zinc-900 text-white">
        <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-zinc-700 border-t-blue-600" />
        <h2 className="text-lg font-semibold">{arStatus}</h2>
      </div>
    )
  }

  return (
    <div className="relative h-screen w-screen bg-black">
      {/* Navbar fixed on top */}
      <Navbar />

      {/* StatusBar below navbar */}
      <div
        className={`fixed top-8 left-0 right-0 p-3 text-center text-sm font-bold text-white ${
          sceneStarted ? "bg-green-600" : "bg-orange-600"
        }`}
        style={{ zIndex: 50 }}
      >
        {arStatus}
      </div>

      {/* AR instructions below StatusBar */}
      <div
        className="fixed top-32 left-5 right-5 mx-auto max-w-md rounded-xl bg-black bg-opacity-85 p-5 text-sm text-white"
        style={{ zIndex: 40 }}
      >
        <h3 className="mb-2 text-base font-semibold">How to Test:</h3>
        <ol className="list-decimal space-y-2 pl-5">
          <li>Allow camera access</li>
          <li>
            Open the target image:
            <a
              href="https://cdn.jsdelivr.net/gh/hiukim/mind-ar-js@1.2.5/examples/image-tracking/assets/card-example/card.png"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 block text-green-400 underline break-all"
            >
              View Target Image
            </a>
          </li>
          <li>Point your camera at the image</li>
          <li>A 3D model should appear</li>
        </ol>
      </div>

      {/* AR Scene filling the rest */}
      <a-scene
        mindar-image="imageTargetSrc: https://cdn.jsdelivr.net/gh/hiukim/mind-ar-js@1.2.5/examples/image-tracking/assets/card-example/card.mind;"
        renderer="colorManagement: true, physicallyCorrectLights"
        color-space="sRGB"
        vr-mode-ui="enabled: false"
        device-orientation-permission-ui="enabled: false"
        embedded
        className="absolute top-0 left-0 h-full w-full"
      >
        <a-assets>
          <img
            id="card"
            src="https://cdn.jsdelivr.net/gh/hiukim/mind-ar-js@1.2.5/examples/image-tracking/assets/card-example/card.png"
            crossOrigin="anonymous"
          />
          <a-asset-item
            id="avatarModel"
            src="https://cdn.jsdelivr.net/gh/hiukim/mind-ar-js@1.2.5/examples/image-tracking/assets/card-example/softmind/scene.gltf"
          />
        </a-assets>

        <a-camera look-controls="enabled: false" />

        <a-entity mindar-image-target="targetIndex: 0">
          <a-plane src="#card" height="0.552" width="1" />
          <a-gltf-model
            src="#avatarModel"
            position="0 0 0.1"
            scale="0.005 0.005 0.005"
            animation="property: position; to: 0 0.1 0.1; dur: 1000; easing: easeInOutQuad; loop: true; dir: alternate"
          />
        </a-entity>
      </a-scene>
    </div>
  )
}

export default App
