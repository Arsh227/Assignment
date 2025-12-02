import { useEffect, useRef, useState } from 'react'
import { Hands } from '@mediapipe/hands'
import { Camera } from '@mediapipe/camera_utils'

const HandTracking = () => {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const handsRef = useRef(null)
  const cameraRef = useRef(null)
  const [isActive, setIsActive] = useState(false)
  const [status, setStatus] = useState('Click Start to begin')
  const [gesture, setGesture] = useState('')
  const [showHelp, setShowHelp] = useState(false)
  
  // Hand tracking state
  const handLandmarksRef = useRef(null)
  const virtualCursorRef = useRef({ x: 0, y: 0 })
  const lastClickTimeRef = useRef(0)
  const scrollCooldownRef = useRef(0)

  useEffect(() => {
    if (!isActive) return

    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas) return

    const ctx = canvas.getContext('2d')
    
    // Initialize MediaPipe Hands
    const hands = new Hands({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
      },
    })

    hands.setOptions({
      maxNumHands: 1,
      modelComplexity: 1,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    })

    hands.onResults((results) => {
      // Clear canvas
      ctx.save()
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height)

      if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        const landmarks = results.multiHandLandmarks[0]
        handLandmarksRef.current = landmarks

        // Draw hand landmarks
        drawHandLandmarks(ctx, landmarks, canvas.width, canvas.height)
        
        // Process gestures
        processGestures(landmarks, canvas.width, canvas.height)
      } else {
        handLandmarksRef.current = null
        setGesture('')
      }

      ctx.restore()
    })

    handsRef.current = hands

    // Initialize camera
    const camera = new Camera(video, {
      onFrame: async () => {
        await hands.send({ image: video })
      },
      width: 640,
      height: 480,
    })
    camera.start()
    cameraRef.current = camera

    // Set canvas size
    const updateCanvasSize = () => {
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width
      canvas.height = rect.height
    }
    updateCanvasSize()
    window.addEventListener('resize', updateCanvasSize)

    return () => {
      camera.stop()
      window.removeEventListener('resize', updateCanvasSize)
      // Cleanup virtual cursor
      const cursor = document.getElementById('virtual-hand-cursor')
      if (cursor) {
        cursor.remove()
      }
    }
  }, [isActive])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (cameraRef.current) {
        cameraRef.current.stop()
      }
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop())
        videoRef.current.srcObject = null
      }
      const cursor = document.getElementById('virtual-hand-cursor')
      if (cursor) {
        cursor.remove()
      }
    }
  }, [])

  const drawHandLandmarks = (ctx, landmarks, width, height) => {
    ctx.strokeStyle = '#00ff00'
    ctx.fillStyle = '#00ff00'
    ctx.lineWidth = 2

    // Draw connections
    const connections = [
      [0, 1, 2, 3, 4], // Thumb
      [0, 5, 6, 7, 8], // Index
      [0, 9, 10, 11, 12], // Middle
      [0, 13, 14, 15, 16], // Ring
      [0, 17, 18, 19, 20], // Pinky
      [5, 9], [9, 13], [13, 17], // Base connections
    ]

    connections.forEach(connection => {
      ctx.beginPath()
      connection.forEach((pointIndex, i) => {
        const point = landmarks[pointIndex]
        const x = point.x * width
        const y = point.y * height
        if (i === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      })
      ctx.stroke()
    })

    // Draw key points
    const keyPoints = [
      { index: 4, color: '#ff0000', label: 'Thumb' }, // Thumb tip
      { index: 8, color: '#00ffff', label: 'Index' }, // Index tip
      { index: 12, color: '#ffff00', label: 'Middle' }, // Middle tip
      { index: 16, color: '#ff00ff', label: 'Ring' }, // Ring tip
      { index: 20, color: '#00ff00', label: 'Pinky' }, // Pinky tip
    ]

    keyPoints.forEach(({ index, color }) => {
      const point = landmarks[index]
      const x = point.x * width
      const y = point.y * height
      
      ctx.fillStyle = color
      ctx.beginPath()
      ctx.arc(x, y, 8, 0, Math.PI * 2)
      ctx.fill()
    })
  }

  const processGestures = (landmarks, width, height) => {
    const now = Date.now()
    
    // Get key points
    const thumbTip = landmarks[4]
    const indexTip = landmarks[8]
    const middleTip = landmarks[12]
    const ringTip = landmarks[16]
    const pinkyTip = landmarks[20]
    const indexPip = landmarks[6] // Index finger PIP joint
    const middlePip = landmarks[10]
    const ringPip = landmarks[14]
    const pinkyPip = landmarks[18]

    // Get canvas position relative to viewport
    const canvas = canvasRef.current
    if (!canvas) return
    
    const rect = canvas.getBoundingClientRect()
    
    // Convert normalized coordinates to viewport coordinates
    // MediaPipe gives normalized coordinates (0-1), we need to map to viewport
    const indexX = rect.left + (indexTip.x * rect.width)
    const indexY = rect.top + (indexTip.y * rect.height)
    
    // Update virtual cursor position (index finger controls cursor)
    virtualCursorRef.current = { x: indexX, y: indexY }
    
    // Move virtual cursor (visual indicator)
    moveVirtualCursor(indexX, indexY)

    // Check for click gesture (index finger touches thumb)
    const thumbIndexDistance = Math.sqrt(
      Math.pow((thumbTip.x - indexTip.x) * rect.width, 2) +
      Math.pow((thumbTip.y - indexTip.y) * rect.height, 2)
    )
    
    if (thumbIndexDistance < 30 && now - lastClickTimeRef.current > 500) {
      // Click detected
      performClick(indexX, indexY)
      lastClickTimeRef.current = now
      setGesture('Click!')
      setTimeout(() => setGesture(''), 500)
    }

    // Check for scroll gestures
    // All 4 fingers extended up (scroll up) - tip significantly above PIP
    const fingerExtensions = [
      indexTip.y < indexPip.y - 0.02, // Index extended
      middleTip.y < middlePip.y - 0.02, // Middle extended
      ringTip.y < ringPip.y - 0.02, // Ring extended
      pinkyTip.y < pinkyPip.y - 0.02, // Pinky extended
    ]
    
    // All 4 fingers closed down (scroll down) - tip below PIP
    const fingerClosures = [
      indexTip.y > indexPip.y + 0.02,
      middleTip.y > middlePip.y + 0.02,
      ringTip.y > ringPip.y + 0.02,
      pinkyTip.y > pinkyPip.y + 0.02,
    ]
    
    const allFingersExtended = fingerExtensions.every(extended => extended) && fingerExtensions.length === 4
    const allFingersClosed = fingerClosures.every(closed => closed) && fingerClosures.length === 4

    if (allFingersExtended && now - scrollCooldownRef.current > 500) {
      performScroll('up')
      scrollCooldownRef.current = now
      setGesture('Scroll Up ↑')
      setTimeout(() => setGesture(''), 800)
    } else if (allFingersClosed && now - scrollCooldownRef.current > 500) {
      performScroll('down')
      scrollCooldownRef.current = now
      setGesture('Scroll Down ↓')
      setTimeout(() => setGesture(''), 800)
    }
  }

  const moveVirtualCursor = (x, y) => {
    // Create or update virtual cursor element
    let cursor = document.getElementById('virtual-hand-cursor')
    if (!cursor) {
      cursor = document.createElement('div')
      cursor.id = 'virtual-hand-cursor'
      cursor.style.cssText = `
        position: fixed;
        width: 20px;
        height: 20px;
        border: 2px solid #00ffff;
        border-radius: 50%;
        background: rgba(0, 255, 255, 0.3);
        pointer-events: none;
        z-index: 99999;
        transform: translate(-50%, -50%);
        transition: transform 0.1s ease-out;
      `
      document.body.appendChild(cursor)
    }
    
    cursor.style.left = `${x}px`
    cursor.style.top = `${y}px`

    // Trigger mouse move events on elements under cursor
    const elementBelow = document.elementFromPoint(x, y)
    if (elementBelow && elementBelow !== cursor) {
      const rect = elementBelow.getBoundingClientRect()
      const mouseEvent = new MouseEvent('mousemove', {
        view: window,
        bubbles: true,
        cancelable: true,
        clientX: x,
        clientY: y,
      })
      elementBelow.dispatchEvent(mouseEvent)
    }
  }

  const performClick = (x, y) => {
    const elementBelow = document.elementFromPoint(x, y)
    if (elementBelow) {
      const clickEvent = new MouseEvent('click', {
        view: window,
        bubbles: true,
        cancelable: true,
        clientX: x,
        clientY: y,
      })
      elementBelow.dispatchEvent(clickEvent)
      
      // Also try mousedown and mouseup for better compatibility
      const mouseDownEvent = new MouseEvent('mousedown', {
        view: window,
        bubbles: true,
        cancelable: true,
        clientX: x,
        clientY: y,
      })
      const mouseUpEvent = new MouseEvent('mouseup', {
        view: window,
        bubbles: true,
        cancelable: true,
        clientX: x,
        clientY: y,
      })
      elementBelow.dispatchEvent(mouseDownEvent)
      setTimeout(() => {
        elementBelow.dispatchEvent(mouseUpEvent)
      }, 50)
    }
  }

  const performScroll = (direction) => {
    const scrollAmount = direction === 'up' ? -100 : 100
    window.scrollBy({
      top: scrollAmount,
      behavior: 'smooth',
    })
  }

  const checkPermissions = async () => {
    if (!navigator.permissions || !navigator.permissions.query) {
      return null
    }
    
    try {
      const result = await navigator.permissions.query({ name: 'camera' })
      return result.state // 'granted', 'denied', or 'prompt'
    } catch (error) {
      return null
    }
  }

  const startTracking = async () => {
    try {
      // Check if getUserMedia is available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setStatus('Camera API not available. Please use a modern browser.')
        return
      }

      // Check if we're in a secure context (HTTPS or localhost)
      const isSecureContext = window.isSecureContext || 
        window.location.protocol === 'https:' || 
        window.location.hostname === 'localhost' || 
        window.location.hostname === '127.0.0.1'
      
      if (!isSecureContext) {
        setStatus('⚠️ Camera requires HTTPS or localhost. Current: ' + window.location.protocol + '//' + window.location.hostname)
        return
      }

      // Check current permission status
      const permissionStatus = await checkPermissions()
      if (permissionStatus === 'denied') {
        setStatus('Camera permission denied. Please enable it in browser settings and refresh the page.')
        return
      }

      setStatus('Requesting camera access...')
      
      // Request camera with more permissive constraints
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640, min: 320 },
          height: { ideal: 480, min: 240 },
          facingMode: { ideal: 'user' },
        },
      })
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        
        // Wait for video to be ready
        await new Promise((resolve) => {
          if (videoRef.current) {
            videoRef.current.onloadedmetadata = () => {
              videoRef.current.play()
              resolve()
            }
          }
        })
        
        setIsActive(true)
        setStatus('Hand tracking active! Show your hand to the camera.')
      }
    } catch (error) {
      console.error('Error accessing camera:', error)
      
      let errorMessage = 'Camera access denied.'
      
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        errorMessage = 'Camera permission denied. Please allow camera access in your browser settings and try again.'
      } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
        errorMessage = 'No camera found. Please connect a camera and try again.'
      } else if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
        errorMessage = 'Camera is already in use by another application. Please close other apps using the camera.'
      } else if (error.name === 'OverconstrainedError' || error.name === 'ConstraintNotSatisfiedError') {
        errorMessage = 'Camera does not support required settings. Trying with basic settings...'
        // Retry with minimal constraints
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true })
          if (videoRef.current) {
            videoRef.current.srcObject = stream
            await new Promise((resolve) => {
              if (videoRef.current) {
                videoRef.current.onloadedmetadata = () => {
                  videoRef.current.play()
                  resolve()
                }
              }
            })
            setIsActive(true)
            setStatus('Hand tracking active!')
            return
          }
        } catch (retryError) {
          errorMessage = 'Failed to access camera. Please check your browser permissions.'
        }
      } else {
        errorMessage = `Camera error: ${error.message || 'Unknown error'}. Please check your browser settings.`
      }
      
      setStatus(errorMessage)
    }
  }

  const stopTracking = () => {
    if (cameraRef.current) {
      cameraRef.current.stop()
    }
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop())
      videoRef.current.srcObject = null
    }
    
    // Remove virtual cursor
    const cursor = document.getElementById('virtual-hand-cursor')
    if (cursor) {
      cursor.remove()
    }
    
    setIsActive(false)
    setStatus('Hand tracking stopped')
    setGesture('')
  }

  return (
    <div className="playground-game-container">
      <div className="hand-tracking-controls" style={{ marginBottom: '20px' }}>
        <div className="status-display" style={{ 
          padding: '10px', 
          background: 'rgba(0, 0, 0, 0.3)', 
          borderRadius: '8px',
          marginBottom: '10px',
          textAlign: 'center'
        }}>
          <p style={{ margin: '5px 0', color: '#fff' }}>Status: {status}</p>
          {gesture && (
            <p style={{ margin: '5px 0', color: '#00ffff', fontSize: '18px', fontWeight: 'bold' }}>
              Gesture: {gesture}
            </p>
          )}
        </div>
        
        <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
          {!isActive ? (
            <button onClick={startTracking} className="btn btn-primary" style={{ flex: 1 }}>
              Start Hand Tracking
            </button>
          ) : (
            <button onClick={stopTracking} className="btn btn-secondary" style={{ flex: 1 }}>
              Stop Hand Tracking
            </button>
          )}
          <button 
            onClick={() => setShowHelp(!showHelp)} 
            className="btn btn-secondary"
            style={{ padding: '8px 15px' }}
          >
            {showHelp ? 'Hide' : 'Help'}
          </button>
        </div>

        {showHelp && (
          <div style={{
            padding: '15px',
            background: 'rgba(0, 0, 0, 0.5)',
            borderRadius: '8px',
            marginBottom: '10px',
            fontSize: '14px',
            color: '#ccc'
          }}>
            <h4 style={{ color: '#fff', marginBottom: '10px' }}>Camera Permission Help:</h4>
            <div style={{ marginBottom: '10px' }}>
              <strong style={{ color: '#fff' }}>Current URL:</strong> {window.location.protocol}//{window.location.hostname}
              {window.location.protocol === 'http:' && window.location.hostname !== 'localhost' && (
                <span style={{ color: '#ff6b6b', display: 'block', marginTop: '5px' }}>
                  ⚠️ You're on HTTP. Camera requires HTTPS or localhost.
                </span>
              )}
            </div>
            <ul style={{ margin: '5px 0', paddingLeft: '20px' }}>
              <li><strong>Chrome/Edge:</strong> Click the camera icon in the address bar → Allow</li>
              <li><strong>Firefox:</strong> Click the camera icon in the address bar → Allow</li>
              <li><strong>Safari:</strong> Safari → Settings → Websites → Camera → Allow</li>
              <li><strong>If blocked:</strong> Check browser settings → Privacy → Camera permissions</li>
            </ul>
            <div style={{ marginTop: '10px', padding: '10px', background: 'rgba(255, 107, 107, 0.1)', borderRadius: '5px' }}>
              <strong style={{ color: '#ff6b6b' }}>Troubleshooting:</strong>
              <ul style={{ margin: '5px 0', paddingLeft: '20px' }}>
                <li>Make sure no other app is using your camera</li>
                <li>Try refreshing the page after granting permissions</li>
                <li>If on HTTP (not localhost), use <code style={{ background: 'rgba(0,0,0,0.3)', padding: '2px 4px', borderRadius: '3px' }}>localhost</code> or enable HTTPS</li>
                <li>Check browser console (F12) for detailed error messages</li>
              </ul>
            </div>
          </div>
        )}
      </div>

      <div style={{ 
        position: 'relative', 
        width: '100%', 
        borderRadius: '12px', 
        overflow: 'hidden',
        background: 'rgba(0, 0, 0, 0.5)'
      }}>
        <video
          ref={videoRef}
          style={{
            width: '100%',
            height: 'auto',
            display: isActive ? 'block' : 'none',
            transform: 'scaleX(-1)', // Mirror for better UX
          }}
          playsInline
          muted
        />
        <canvas
          ref={canvasRef}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            transform: 'scaleX(-1)', // Mirror to match video
          }}
        />
        {!isActive && (
          <div style={{
            padding: '100px 20px',
            textAlign: 'center',
            color: '#888'
          }}>
            <p>Camera feed will appear here</p>
            <p style={{ fontSize: '14px', marginTop: '10px' }}>
              Use your index finger as a mouse cursor
            </p>
          </div>
        )}
      </div>

      <div className="hand-tracking-instructions" style={{ 
        marginTop: '20px', 
        padding: '15px', 
        background: 'rgba(0, 0, 0, 0.3)', 
        borderRadius: '8px' 
      }}>
        <h4 style={{ color: '#fff', marginBottom: '10px' }}>How to Use:</h4>
        <ul style={{ color: '#ccc', paddingLeft: '20px', margin: 0 }}>
          <li><strong style={{ color: '#00ffff' }}>Index Finger:</strong> Move your index finger to control the cursor</li>
          <li><strong style={{ color: '#00ff00' }}>Click:</strong> Touch your index finger to your thumb</li>
          <li><strong style={{ color: '#ffff00' }}>Scroll Up:</strong> Raise all 4 fingers (index, middle, ring, pinky)</li>
          <li><strong style={{ color: '#ff00ff' }}>Scroll Down:</strong> Lower all 4 fingers</li>
        </ul>
      </div>
    </div>
  )
}

export default HandTracking

