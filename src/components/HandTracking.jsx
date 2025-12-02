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

  // No global click interceptor - we'll handle navigation prevention in performClick only

  useEffect(() => {
    if (!isActive) return

    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas) {
      console.error('Video or canvas ref not available')
      return
    }

    const ctx = canvas.getContext('2d')
    if (!ctx) {
      console.error('Could not get canvas context')
      return
    }
    
    let hands = null
    let camera = null
    
    // Initialize MediaPipe Hands - use async function
    const initializeMediaPipe = async () => {
      try {
        console.log('Initializing MediaPipe Hands...')
        
        // Dynamically import MediaPipe Hands
        const handsModule = await import('@mediapipe/hands')
        const cameraModule = await import('@mediapipe/camera_utils')
        
        // Log full module structure to understand what Vite is giving us
        console.log('Raw handsModule:', handsModule)
        console.log('handsModule keys:', Object.keys(handsModule))
        console.log('handsModule.getOwnPropertyNames:', Object.getOwnPropertyNames(handsModule))
        console.log('handsModule.default:', handsModule.default)
        console.log('handsModule.Hands:', handsModule.Hands)
        console.log('typeof handsModule:', typeof handsModule)
        
        // Try to access Hands - check all possible locations including non-enumerable
        let Hands = null
        
        // Method 1: Direct property access
        if (handsModule.Hands) {
          Hands = handsModule.Hands
          console.log('Found Hands via handsModule.Hands')
        }
        // Method 2: Check default export with all property descriptors
        else if (handsModule.default) {
          const defaultExport = handsModule.default
          console.log('defaultExport:', defaultExport)
          console.log('defaultExport keys:', Object.keys(defaultExport))
          console.log('defaultExport getOwnPropertyNames:', Object.getOwnPropertyNames(defaultExport))
          console.log('defaultExport.Hands:', defaultExport.Hands)
          console.log('typeof defaultExport:', typeof defaultExport)
          
          // Check if Hands is directly on default (even if non-enumerable)
          if ('Hands' in defaultExport) {
            Hands = defaultExport.Hands
            console.log('Found Hands via defaultExport.Hands (using "in" operator)')
          }
          // Check if default itself is the Hands constructor
          else if (typeof defaultExport === 'function' && defaultExport.prototype) {
            Hands = defaultExport
            console.log('Found Hands - defaultExport is the constructor')
          }
          // Check all enumerable properties
          else {
            console.log('Searching through defaultExport enumerable properties...')
            for (const key in defaultExport) {
              const value = defaultExport[key]
              console.log(`Checking defaultExport.${key}:`, typeof value, value)
              if (value && typeof value === 'function' && value.prototype) {
                console.log(`Found potential Hands constructor at defaultExport.${key}`)
                Hands = value
                break
              }
            }
          }
          
          // Check non-enumerable properties
          if (!Hands) {
            console.log('Checking non-enumerable properties...')
            const allProps = Object.getOwnPropertyNames(defaultExport)
            for (const prop of allProps) {
              if (prop !== 'constructor' && prop !== '__proto__') {
                try {
                  const value = defaultExport[prop]
                  console.log(`Checking non-enumerable ${prop}:`, typeof value, value)
                  if (value && typeof value === 'function' && value.prototype) {
                    console.log(`Found potential Hands constructor at non-enumerable ${prop}`)
                    Hands = value
                    break
                  }
                } catch (e) {
                  console.log(`Cannot access ${prop}:`, e.message)
                }
              }
            }
          }
        }
        
        // Method 3: Try accessing via bracket notation with common names
        if (!Hands) {
          const possibleNames = ['Hands', 'hands', 'HANDS', 'default', 'HandsSolution']
          for (const name of possibleNames) {
            if (handsModule[name] && typeof handsModule[name] === 'function') {
              Hands = handsModule[name]
              console.log(`Found Hands via handsModule['${name}']`)
              break
            }
          }
        }
        
        // Try to get Camera
        let CameraClass = null
        if (cameraModule.Camera) {
          CameraClass = cameraModule.Camera
        } else if (cameraModule.default?.Camera) {
          CameraClass = cameraModule.default.Camera
        } else if (cameraModule.default && typeof cameraModule.default === 'function') {
          CameraClass = cameraModule.default
        } else {
          // Try finding it in all properties
          for (const key in cameraModule) {
            const value = cameraModule[key]
            if (value && typeof value === 'function' && value.prototype) {
              CameraClass = value
              break
            }
          }
        }
        
        console.log('MediaPipe modules loaded:', { 
          Hands: !!Hands,
          HandsType: typeof Hands,
          HandsIsFunction: typeof Hands === 'function',
          Camera: !!CameraClass,
          CameraType: typeof CameraClass,
          handsModuleKeys: Object.keys(handsModule),
          cameraModuleKeys: Object.keys(cameraModule)
        })
        
        if (!Hands) {
          console.error('Hands not found. Full module structure:', {
            keys: Object.keys(handsModule),
            default: handsModule.default,
            hasHands: 'Hands' in handsModule,
            moduleType: typeof handsModule,
            allValues: Object.values(handsModule).map(v => typeof v)
          })
          throw new Error('Hands class not found in MediaPipe module')
        }
        
        if (typeof Hands !== 'function') {
          console.error('Hands is not a function. Type:', typeof Hands, 'Value:', Hands)
          throw new Error(`Hands is not a constructor. Type: ${typeof Hands}`)
        }
        
        // Verify it's actually a constructor
        console.log('Testing Hands constructor...')
        const testProto = Hands.prototype
        console.log('Hands.prototype:', testProto)
        console.log('Creating Hands instance...')
        hands = new Hands({
          locateFile: (file) => {
            const url = `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
            console.log('Loading MediaPipe file:', file, 'from', url)
            return url
          },
        })

        console.log('MediaPipe Hands instance created')

        hands.setOptions({
        maxNumHands: 1,
        modelComplexity: 1,
        minDetectionConfidence: 0.3, // Lowered for easier detection
        minTrackingConfidence: 0.3, // Lowered for easier tracking
      })

      console.log('MediaPipe Hands options set')

      let frameCount = 0
      hands.onResults((results) => {
        try {
          frameCount++
          if (frameCount % 30 === 0) { // Log every 30 frames (about once per second)
            console.log('MediaPipe processing frame #', frameCount)
            console.log('Results:', {
              hasImage: !!results.image,
              hasLandmarks: !!(results.multiHandLandmarks && results.multiHandLandmarks.length > 0),
              landmarkCount: results.multiHandLandmarks ? results.multiHandLandmarks.length : 0
            })
          }
          
          // Debug logging
          if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
            console.log('✅ Hand detected! Landmarks:', results.multiHandLandmarks[0].length)
          }
          
          // Clear canvas
          ctx.save()
          ctx.clearRect(0, 0, canvas.width, canvas.height)
          
          // Draw video frame
          if (results.image) {
            ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height)
          }

          if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
            const landmarks = results.multiHandLandmarks[0]
            handLandmarksRef.current = landmarks

            console.log('Drawing landmarks, canvas size:', canvas.width, 'x', canvas.height)
            
            // Draw hand landmarks
            drawHandLandmarks(ctx, landmarks, canvas.width, canvas.height)
            
            // Process gestures
            processGestures(landmarks, canvas.width, canvas.height)
            
            // Update status to show hand detected (only update once)
            setStatus(prevStatus => {
              if (prevStatus !== 'Hand detected! Move your index finger to control cursor.') {
                return 'Hand detected! Move your index finger to control cursor.'
              }
              return prevStatus
            })
          } else {
            handLandmarksRef.current = null
            setGesture('')
            // Update status to prompt user to show hand
            setStatus(prevStatus => {
              if (prevStatus.includes('Hand detected')) {
                return 'Hand tracking active! Show your hand to the camera.'
              }
              return prevStatus
            })
          }

          ctx.restore()
        } catch (error) {
          console.error('Error in hands.onResults:', error)
        }
      })

      console.log('MediaPipe Hands onResults callback set')
      handsRef.current = hands

      // Wait for video to be ready before initializing camera
      const initializeCamera = () => {
        console.log('Initializing camera, video readyState:', video.readyState)
        
        if (video.readyState >= 2) { // HAVE_CURRENT_DATA or higher
          console.log('Video is ready, creating Camera instance...')
          
          if (!Camera || typeof Camera !== 'function') {
            throw new Error(`Camera class not available. Type: ${typeof Camera}`)
          }
          
          let frameSendCount = 0
          camera = new Camera(video, {
            onFrame: async () => {
              try {
                frameSendCount++
                if (frameSendCount % 30 === 0) { // Log every 30 frames
                  console.log('Sending frame #', frameSendCount, 'to MediaPipe, video readyState:', video.readyState)
                }
                
                if (hands && video.readyState === video.HAVE_ENOUGH_DATA) {
                  await hands.send({ image: video })
                } else {
                  if (frameSendCount % 30 === 0) {
                    console.warn('Video not ready or hands not initialized. readyState:', video.readyState, 'hands:', !!hands)
                  }
                }
              } catch (error) {
                console.error('Error sending frame to MediaPipe:', error)
              }
            },
            width: 640,
            height: 480,
          })
          
          console.log('Camera instance created, starting...')
          
          camera.start().then(() => {
            console.log('✅ Camera started successfully!')
            setStatus('Hand tracking active! Show your hand to the camera.')
          }).catch((error) => {
            console.error('❌ Error starting camera:', error)
            setStatus('Error starting camera: ' + error.message)
          })
          
          cameraRef.current = camera
        } else {
          console.log('Video not ready yet, waiting for loadeddata event...')
          // Wait for video to load
          video.addEventListener('loadeddata', () => {
            console.log('Video loadeddata event fired, readyState:', video.readyState)
            initializeCamera()
          }, { once: true })
          
          // Also try after a short delay in case event doesn't fire
          setTimeout(() => {
            if (video.readyState >= 2 && !cameraRef.current) {
              console.log('Video ready after timeout, initializing camera...')
              initializeCamera()
            }
          }, 1000)
        }
      }
      
      // Wait a bit for MediaPipe to initialize before starting camera
      setTimeout(() => {
        console.log('Starting camera initialization...')
        initializeCamera()
      }, 500)
      
      // Set canvas size
      const updateCanvasSize = () => {
        const rect = canvas.getBoundingClientRect()
        canvas.width = rect.width
        canvas.height = rect.height
      }
        updateCanvasSize()
        window.addEventListener('resize', updateCanvasSize)
      } catch (error) {
        console.error('Error initializing MediaPipe Hands:', error)
        setStatus('Error initializing hand tracking: ' + error.message)
      }
    }
    
    // Call the async initialization function
    initializeMediaPipe()
    
    // Return cleanup function
    return () => {
      if (cameraRef.current) {
        try {
          cameraRef.current.stop()
        } catch (error) {
          console.error('Error stopping camera:', error)
        }
      }
      if (handsRef.current) {
        try {
          handsRef.current.close()
        } catch (error) {
          console.error('Error closing MediaPipe Hands:', error)
        }
      }
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
    if (!landmarks || landmarks.length < 21) {
      console.error('Invalid landmarks:', landmarks)
      return
    }
    
    console.log('Drawing landmarks on canvas:', width, 'x', height)
    
    // Make landmarks more visible - use bright green
    ctx.strokeStyle = '#00ff00'
    ctx.fillStyle = '#00ff00'
    ctx.lineWidth = 4 // Increased line width for visibility

    // Draw connections - MediaPipe hand connections
    const connections = [
      [0, 1, 2, 3, 4], // Thumb
      [0, 5, 6, 7, 8], // Index
      [0, 9, 10, 11, 12], // Middle
      [0, 13, 14, 15, 16], // Ring
      [0, 17, 18, 19, 20], // Pinky
      [5, 9], [9, 13], [13, 17], // Base connections
      [0, 5], [0, 9], [0, 13], [0, 17], // Wrist to finger bases
    ]

    connections.forEach(connection => {
      ctx.beginPath()
      let firstPoint = true
      connection.forEach((pointIndex) => {
        if (pointIndex < landmarks.length) {
          const point = landmarks[pointIndex]
          const x = point.x * width
          const y = point.y * height
          if (firstPoint) {
            ctx.moveTo(x, y)
            firstPoint = false
          } else {
            ctx.lineTo(x, y)
          }
        }
      })
      ctx.stroke()
    })

    // Draw all landmarks as dots
    landmarks.forEach((point, index) => {
      const x = point.x * width
      const y = point.y * height
      
      // Draw a small dot for each landmark
      ctx.fillStyle = '#00ff00'
      ctx.beginPath()
      ctx.arc(x, y, 4, 0, Math.PI * 2)
      ctx.fill()
    })

    // Draw key points with colors
    const keyPoints = [
      { index: 4, color: '#ff0000', label: 'Thumb', size: 12 }, // Thumb tip
      { index: 8, color: '#00ffff', label: 'Index', size: 12 }, // Index tip
      { index: 12, color: '#ffff00', label: 'Middle', size: 12 }, // Middle tip
      { index: 16, color: '#ff00ff', label: 'Ring', size: 12 }, // Ring tip
      { index: 20, color: '#00ff00', label: 'Pinky', size: 12 }, // Pinky tip
      { index: 0, color: '#ffffff', label: 'Wrist', size: 10 }, // Wrist
    ]

    keyPoints.forEach(({ index, color, size }) => {
      if (index < landmarks.length) {
        const point = landmarks[index]
        const x = point.x * width
        const y = point.y * height
        
        ctx.fillStyle = color
        ctx.beginPath()
        ctx.arc(x, y, size, 0, Math.PI * 2)
        ctx.fill()
        
        // Add a border for better visibility
        ctx.strokeStyle = '#000000'
        ctx.lineWidth = 2
        ctx.stroke()
      }
    })
    
    console.log('Finished drawing landmarks')
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
    // Use normalized coordinates for distance calculation
    const thumbIndexDistance = Math.sqrt(
      Math.pow(thumbTip.x - indexTip.x, 2) +
      Math.pow(thumbTip.y - indexTip.y, 2)
    )
    
    // Normalized distance threshold (0-1 scale)
    const clickThreshold = 0.05 // Increased threshold for easier clicking
    
    if (thumbIndexDistance < clickThreshold && now - lastClickTimeRef.current > 500) {
      // Click detected
      performClick(indexX, indexY)
      lastClickTimeRef.current = now
      setGesture('Click!')
      setTimeout(() => setGesture(''), 500)
    }

    // Check for scroll gestures
    // All 4 fingers extended up (scroll up) - tip above PIP
    const fingerExtensionThreshold = 0.03 // Increased threshold for easier detection
    const fingerExtensions = [
      indexTip.y < indexPip.y - fingerExtensionThreshold, // Index extended
      middleTip.y < middlePip.y - fingerExtensionThreshold, // Middle extended
      ringTip.y < ringPip.y - fingerExtensionThreshold, // Ring extended
      pinkyTip.y < pinkyPip.y - fingerExtensionThreshold, // Pinky extended
    ]
    
    // All 4 fingers closed down (scroll down) - tip below PIP
    const fingerClosureThreshold = 0.03
    const fingerClosures = [
      indexTip.y > indexPip.y + fingerClosureThreshold,
      middleTip.y > middlePip.y + fingerClosureThreshold,
      ringTip.y > ringPip.y + fingerClosureThreshold,
      pinkyTip.y > pinkyPip.y + fingerClosureThreshold,
    ]
    
    const allFingersExtended = fingerExtensions.every(extended => extended === true) && fingerExtensions.length === 4
    const allFingersClosed = fingerClosures.every(closed => closed === true) && fingerClosures.length === 4

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

  const isSafeElement = (element) => {
    if (!element) return false
    
    // Don't interact with the cursor itself or video/canvas elements
    if (element.id === 'virtual-hand-cursor' || 
        element.tagName === 'VIDEO' || 
        element.tagName === 'CANVAS' ||
        element.closest('video') ||
        element.closest('canvas')) {
      return false
    }
    
    // Don't interact with links that navigate away
    if (element.tagName === 'A') {
      const href = element.getAttribute('href')
      // Only allow internal links (starting with #) or same-origin links
      if (href && !href.startsWith('#') && !href.startsWith('/')) {
        return false
      }
      // Block external links
      if (href && (href.startsWith('http://') || href.startsWith('https://'))) {
        const linkUrl = new URL(href, window.location.origin)
        if (linkUrl.origin !== window.location.origin) {
          return false
        }
      }
    }
    
    // Don't interact with form elements that might submit
    if (element.tagName === 'FORM' || element.closest('form')) {
      const form = element.tagName === 'FORM' ? element : element.closest('form')
      if (form && form.action && !form.action.startsWith('#')) {
        return false
      }
    }
    
    // Only interact with elements within the main website container
    const mainContainer = document.querySelector('body')
    if (!mainContainer || !mainContainer.contains(element)) {
      return false
    }
    
    return true
  }

  const moveVirtualCursor = (x, y) => {
    // Constrain cursor to viewport
    const constrainedX = Math.max(0, Math.min(x, window.innerWidth))
    const constrainedY = Math.max(0, Math.min(y, window.innerHeight))
    
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
    
    cursor.style.left = `${constrainedX}px`
    cursor.style.top = `${constrainedY}px`

    // Trigger mouse move events only on safe elements
    const elementBelow = document.elementFromPoint(constrainedX, constrainedY)
    if (elementBelow && elementBelow !== cursor && isSafeElement(elementBelow)) {
      const mouseEvent = new MouseEvent('mousemove', {
        view: window,
        bubbles: true,
        cancelable: true,
        clientX: constrainedX,
        clientY: constrainedY,
      })
      elementBelow.dispatchEvent(mouseEvent)
    }
  }

  const performClick = (x, y) => {
    // Constrain click to viewport
    const constrainedX = Math.max(0, Math.min(x, window.innerWidth))
    const constrainedY = Math.max(0, Math.min(y, window.innerHeight))
    
    const elementBelow = document.elementFromPoint(constrainedX, constrainedY)
    
    // Only click on safe elements
    if (elementBelow && isSafeElement(elementBelow)) {
      // Check if it's a link
      const isLink = elementBelow.tagName === 'A' || elementBelow.closest('a')
      let link = null
      let href = null
      
      if (isLink) {
        link = elementBelow.tagName === 'A' ? elementBelow : elementBelow.closest('a')
        href = link.getAttribute('href')
        
        // Block external links (different domain)
        if (href && (href.startsWith('http://') || href.startsWith('https://'))) {
          try {
            const linkUrl = new URL(href, window.location.origin)
            if (linkUrl.origin !== window.location.origin) {
              console.log('Blocked external link click from hand tracking:', href)
              return // Block external links
            }
          } catch (err) {
            // Invalid URL, allow it
          }
        }
        
        // Handle hash links (internal navigation)
        if (href && href.startsWith('#')) {
          const target = document.querySelector(href)
          if (target) {
            target.scrollIntoView({ behavior: 'smooth' })
            return // Don't dispatch click event, we handled it
          }
        }
      }
      
      // Create click event (synthetic, not trusted)
      const clickEvent = new MouseEvent('click', {
        view: window,
        bubbles: true,
        cancelable: true,
        clientX: constrainedX,
        clientY: constrainedY,
      })
      
      // Dispatch the click event
      elementBelow.dispatchEvent(clickEvent)
      
      // Also dispatch mousedown and mouseup for better compatibility
      const mouseDownEvent = new MouseEvent('mousedown', {
        view: window,
        bubbles: true,
        cancelable: true,
        clientX: constrainedX,
        clientY: constrainedY,
      })
      const mouseUpEvent = new MouseEvent('mouseup', {
        view: window,
        bubbles: true,
        cancelable: true,
        clientX: constrainedX,
        clientY: constrainedY,
      })
      
      elementBelow.dispatchEvent(mouseDownEvent)
      setTimeout(() => {
        elementBelow.dispatchEvent(mouseUpEvent)
      }, 50)
    }
  }

  const performScroll = (direction) => {
    // Only scroll within the current page, don't navigate
    const scrollAmount = direction === 'up' ? -100 : 100
    
    // Get the main scrollable container (usually body or html)
    const scrollContainer = document.documentElement.scrollHeight > window.innerHeight 
      ? document.documentElement 
      : document.body
    
    // Calculate new scroll position
    const currentScroll = window.pageYOffset || document.documentElement.scrollTop
    const maxScroll = Math.max(
      document.documentElement.scrollHeight,
      document.body.scrollHeight
    ) - window.innerHeight
    
    const newScroll = Math.max(0, Math.min(maxScroll, currentScroll + scrollAmount))
    
    // Only scroll if we're within bounds
    if (newScroll !== currentScroll) {
      window.scrollTo({
        top: newScroll,
        behavior: 'smooth',
      })
    }
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
      try {
        cameraRef.current.stop()
      } catch (error) {
        console.error('Error stopping camera:', error)
      }
      cameraRef.current = null
    }
    
    if (handsRef.current) {
      try {
        handsRef.current.close()
      } catch (error) {
        console.error('Error closing MediaPipe Hands:', error)
      }
      handsRef.current = null
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
            zIndex: 10, // Ensure canvas is on top of video
            pointerEvents: 'none', // Don't block interactions
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
        <p style={{ 
          marginTop: '10px', 
          padding: '8px', 
          background: 'rgba(0, 255, 255, 0.1)', 
          borderRadius: '5px',
          fontSize: '13px',
          color: '#00ffff'
        }}>
          <strong>Note:</strong> Hand tracking only controls elements within this website. External links and navigation are blocked for safety.
        </p>
      </div>
    </div>
  )
}

export default HandTracking

