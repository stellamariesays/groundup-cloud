import { useEffect, useRef } from 'react'
import * as THREE from 'three'

/**
 * Country coordinates (lat/lng → 3D sphere positions)
 */
const HOTSPOTS = [
  { name: 'Djibouti', lat: 11.5, lng: 43.0, impact: 76, fuse: 100 },
  { name: 'South Africa', lat: -29.0, lng: 24.0, impact: 42, fuse: 100 },
  { name: 'Eswatini', lat: -26.5, lng: 31.5, impact: 53, fuse: 79 },
  { name: 'Libya', lat: 27.0, lng: 17.0, impact: 45, fuse: 100 },
  { name: 'Congo', lat: -1.5, lng: 15.5, impact: 84, fuse: 100 },
  { name: 'Botswana', lat: -22.0, lng: 24.0, impact: 51, fuse: 78 },
  { name: 'Tunisia', lat: 34.0, lng: 9.0, impact: 40, fuse: 65 },
  { name: 'Jordan', lat: 31.0, lng: 36.0, impact: 40, fuse: 66 },
  { name: 'Namibia', lat: -22.0, lng: 17.0, impact: 64, fuse: 78 },
  { name: 'St. Vincent', lat: 13.2, lng: -61.2, impact: 52, fuse: 100 },
]

function latLngToVector3(lat, lng, radius) {
  const phi = (90 - lat) * (Math.PI / 180)
  const theta = (lng + 180) * (Math.PI / 180)
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  )
}

export default function GlobeBackground() {
  const mountRef = useRef(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    // Scene setup
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, mount.clientWidth / mount.clientHeight, 0.1, 1000)
    camera.position.z = 5

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(mount.clientWidth, mount.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)
    mount.appendChild(renderer.domElement)

    // Globe wireframe
    const globeRadius = 2
    const globeGeo = new THREE.SphereGeometry(globeRadius, 40, 40)
    const globeMat = new THREE.MeshBasicMaterial({
      color: 0x1e293b,
      wireframe: true,
      transparent: true,
      opacity: 0.12,
    })
    const globe = new THREE.Mesh(globeGeo, globeMat)
    scene.add(globe)

    // Atmosphere glow
    const atmosGeo = new THREE.SphereGeometry(globeRadius * 1.02, 40, 40)
    const atmosMat = new THREE.MeshBasicMaterial({
      color: 0xef4444,
      transparent: true,
      opacity: 0.03,
      side: THREE.BackSide,
    })
    scene.add(new THREE.Mesh(atmosGeo, atmosMat))

    // Particle field (dust / stars)
    const particleCount = 2000
    const particleGeo = new THREE.BufferGeometry()
    const positions = new Float32Array(particleCount * 3)
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    const particleMat = new THREE.PointsMaterial({
      color: 0x475569,
      size: 0.01,
      transparent: true,
      opacity: 0.6,
    })
    scene.add(new THREE.Points(particleGeo, particleMat))

    // Hotspot markers
    const markers = []
    HOTSPOTS.forEach(spot => {
      const pos = latLngToVector3(spot.lat, spot.lng, globeRadius)
      const intensity = spot.impact / 100

      // Core dot
      const dotGeo = new THREE.SphereGeometry(0.03 + intensity * 0.04, 8, 8)
      const dotMat = new THREE.MeshBasicMaterial({
        color: spot.fuse >= 80 ? 0xef4444 : 0xf97316,
        transparent: true,
        opacity: 0.8 + intensity * 0.2,
      })
      const dot = new THREE.Mesh(dotGeo, dotMat)
      dot.position.copy(pos)
      globe.add(dot)

      // Glow ring
      const ringGeo = new THREE.RingGeometry(0.04 + intensity * 0.03, 0.06 + intensity * 0.05, 16)
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0xef4444,
        transparent: true,
        opacity: 0.2,
        side: THREE.DoubleSide,
      })
      const ring = new THREE.Mesh(ringGeo, ringMat)
      ring.position.copy(pos)
      ring.lookAt(new THREE.Vector3(0, 0, 0))
      globe.add(ring)

      markers.push({ dot, ring, intensity })
    })

    // Connection arcs between hotspots
    const arcGroup = new THREE.Group()
    for (let i = 0; i < HOTSPOTS.length - 1; i++) {
      const a = latLngToVector3(HOTSPOTS[i].lat, HOTSPOTS[i].lng, globeRadius)
      const b = latLngToVector3(HOTSPOTS[i + 1].lat, HOTSPOTS[i + 1].lng, globeRadius)
      const mid = new THREE.Vector3().addVectors(a, b).multiplyScalar(0.5)
      mid.normalize().multiplyScalar(globeRadius + 0.3)

      const curve = new THREE.QuadraticBezierCurve3(a, mid, b)
      const arcGeo = new THREE.BufferGeometry().setFromPoints(curve.getPoints(20))
      const arcMat = new THREE.LineBasicMaterial({
        color: 0xef4444,
        transparent: true,
        opacity: 0.08,
      })
      arcGroup.add(new THREE.Line(arcGeo, arcMat))
    }
    globe.add(arcGroup)

    // Scroll-linked rotation
    let scrollY = 0
    const onScroll = () => { scrollY = window.scrollY || window.pageYOffset }
    window.addEventListener('scroll', onScroll, { passive: true })

    // Animation
    let frame
    const clock = new THREE.Clock()
    const animate = () => {
      frame = requestAnimationFrame(animate)
      const t = clock.getElapsedTime()

      // Base rotation + scroll-linked tilt
      globe.rotation.y = t * 0.08 + scrollY * 0.0003
      globe.rotation.x = Math.sin(t * 0.02) * 0.1 + scrollY * 0.0001

      // Pulse markers
      markers.forEach((m, i) => {
        const pulse = 1 + Math.sin(t * 2 + i * 0.7) * 0.15 * m.intensity
        m.dot.scale.setScalar(pulse)
        m.ring.scale.setScalar(pulse * 1.5)
        m.ring.material.opacity = 0.1 + Math.sin(t * 2 + i * 0.7) * 0.1
      })

      renderer.render(scene, camera)
    }
    animate()

    // Resize
    const onResize = () => {
      const w = mount.clientWidth
      const h = mount.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      mount.removeChild(renderer.domElement)
      renderer.dispose()
    }
  }, [])

  return (
    <div
      ref={mountRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  )
}
