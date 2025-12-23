import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [isARReady, setIsARReady] = useState(false)
  const [arStatus, setArStatus] = useState('Initializing AR...')
  const [sceneStarted, setSceneStarted] = useState(false)

  useEffect(() => {
    // Wait for A-Frame and MindAR to load
    const checkAFrameLoaded = setInterval(() => {
      if (window.AFRAME && window.MINDAR) {
        setIsARReady(true)
        setArStatus('AR Ready - Allow camera access')
        clearInterval(checkAFrameLoaded)
      }
    }, 100)

    const timeout = setTimeout(() => {
      if (!isARReady) {
        setArStatus('Failed to load AR libraries')
        clearInterval(checkAFrameLoaded)
      }
    }, 10000)

    return () => {
      clearInterval(checkAFrameLoaded)
      clearTimeout(timeout)
    }
  }, [isARReady])

  useEffect(() => {
    if (!isARReady) return

    // Listen for MindAR events
    const sceneEl = document.querySelector('a-scene')
    
    if (sceneEl) {
      sceneEl.addEventListener('arReady', () => {
        setSceneStarted(true)
        setArStatus('AR Started - Point camera at target image')
      })

      sceneEl.addEventListener('arError', (event) => {
        setArStatus(' AR Error: ' + event.detail.error)
      })
    }
  }, [isARReady])

  if (!isARReady) {
    return (
      <div style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1a1a1a',
        color: 'white',
        fontFamily: 'system-ui'
      }}>
        <div style={{
          width: '50px',
          height: '50px',
          border: '5px solid #f3f3f3',
          borderTop: '5px solid #3498db',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          marginBottom: '20px'
        }} />
        <h2>{arStatus}</h2>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    )
  }

  return (
    <>
      {/* Status overlay */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: sceneStarted ? '#4CAF50' : '#FF9800',
        color: 'white',
        padding: '12px',
        textAlign: 'center',
        zIndex: 9999,
        fontFamily: 'system-ui',
        fontSize: '14px',
        fontWeight: 'bold'
      }}>
        {arStatus}
      </div>

      {/* Instructions */}
      <div style={{
        position: 'fixed',
        bottom: 20,
        left: 20,
        right: 20,
        backgroundColor: 'rgba(0,0,0,0.85)',
        color: 'white',
        padding: '20px',
        borderRadius: '12px',
        zIndex: 9999,
        fontFamily: 'system-ui',
        fontSize: '14px',
        maxWidth: '400px',
        margin: '0 auto'
      }}>
        <h3 style={{ margin: '0 0 10px 0', fontSize: '16px' }}>
           How to Test:
        </h3>
        <ol style={{ margin: '10px 0', paddingLeft: '20px', lineHeight: '1.6' }}>
          <li>Allow camera access when prompted</li>
          <li>Open this target image on another device or print it: 
            <a 
              href="https://cdn.jsdelivr.net/gh/hiukim/mind-ar-js@1.2.5/examples/image-tracking/assets/card-example/card.png"
              target="_blank"
              rel="noopener noreferrer"
              style={{ 
                color: '#4CAF50', 
                display: 'block',
                marginTop: '5px',
                wordBreak: 'break-all'
              }}
            >
              View Target Image
            </a>
          </li>
          <li>Point your camera at the image</li>
          <li>A 3D model should appear on top of the image!</li>
        </ol>
      </div>

      {/* A-Frame Scene with MindAR */}
      <a-scene
        mindar-image="imageTargetSrc: https://cdn.jsdelivr.net/gh/hiukim/mind-ar-js@1.2.5/examples/image-tracking/assets/card-example/card.mind;"
        color-space="sRGB"
        renderer="colorManagement: true, physicallyCorrectLights"
        vr-mode-ui="enabled: false"
        device-orientation-permission-ui="enabled: false"
        embedded
        style={{ width: '100vw', height: '100vh' }}
      >
        {/* Assets */}
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

        {/* Camera */}
        <a-camera position="0 0 0" look-controls="enabled: false" />

        {/* Image Target */}
        <a-entity mindar-image-target="targetIndex: 0">
          {/* The card image as background */}
          <a-plane 
            src="#card" 
            position="0 0 0" 
            height="0.552" 
            width="1" 
            rotation="0 0 0"
          />
          
          {/* 3D Model */}
          <a-gltf-model 
            rotation="0 0 0" 
            position="0 0 0.1" 
            scale="0.005 0.005 0.005" 
            src="#avatarModel"
            animation="property: position; to: 0 0.1 0.1; dur: 1000; easing: easeInOutQuad; loop: true; dir: alternate"
          />
        </a-entity>
      </a-scene>
    </>
  )
}

export default App