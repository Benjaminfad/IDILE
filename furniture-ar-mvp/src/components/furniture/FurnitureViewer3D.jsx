import React, { Suspense, useEffect, useMemo, useState } from 'react'
import * as THREE from 'three'
import { Canvas } from '@react-three/fiber'
import {
  Environment,
  Html,
  OrbitControls,
  useGLTF,
  useProgress,
  useTexture,
} from '@react-three/drei'

function Spinner() {
  const { progress } = useProgress()

  return (
    <Html center>
      <div className="rounded-xl bg-white/90 px-4 py-3 shadow">
        <div className="flex items-center gap-3 text-sm text-slate-700">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-emerald-600" />
          Loading 3D model... {Math.round(progress)}%
        </div>
      </div>
    </Html>
  )
}

function LowResPreview({ lowBandwidthMode = false }) {
  const lowTexture = useTexture('/textures/model-preview-low.svg')
  const [activeTexture, setActiveTexture] = useState(lowTexture)

  useEffect(() => {
    lowTexture.colorSpace = THREE.SRGBColorSpace
    lowTexture.minFilter = THREE.LinearFilter
    lowTexture.magFilter = THREE.LinearFilter

    if (lowBandwidthMode) return undefined

    let loadedHighTexture
    const loader = new THREE.TextureLoader()
    loader.load('/textures/model-preview-high.svg', (highTexture) => {
      highTexture.colorSpace = THREE.SRGBColorSpace
      highTexture.anisotropy = 4
      loadedHighTexture = highTexture
      setActiveTexture(highTexture)
    })

    return () => {
      if (loadedHighTexture) {
        loadedHighTexture.dispose()
      }
    }
  }, [lowTexture, lowBandwidthMode])

  return (
    <group>
      <mesh position={[0, -0.1, 0]}>
        <boxGeometry args={[1.8, 1, 1]} />
        <meshStandardMaterial map={activeTexture} roughness={0.7} metalness={0.1} />
      </mesh>
      <mesh position={[0, -0.7, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[4, 4]} />
        <meshStandardMaterial color="#cbd5e1" />
      </mesh>
    </group>
  )
}

function ModelLoadingFallback({ lowBandwidthMode }) {
  return (
    <>
      <LowResPreview lowBandwidthMode={lowBandwidthMode} />
      <Spinner />
    </>
  )
}

function Model({ modelPath, materialColor, materialProps }) {
  const { scene } = useGLTF(modelPath)
  const modelScene = useMemo(() => scene.clone(true), [scene])
  const materials = useMemo(() => {
    const collectedMaterials = []

    modelScene.traverse((node) => {
      if (!node.isMesh) return

      if (Array.isArray(node.material)) {
        node.material = node.material.map((mat) => (mat?.clone ? mat.clone() : mat))
        node.material.forEach((mat) => {
          if (mat) collectedMaterials.push(mat)
        })
      } else if (node.material?.clone) {
        node.material = node.material.clone()
        collectedMaterials.push(node.material)
      }
    })

    return collectedMaterials
  }, [modelScene])

  useEffect(() => {
    materials.forEach((mat) => {
      if (mat.color) {
        mat.color.set(materialColor)
      }

      if ('roughness' in mat && typeof materialProps.roughness === 'number') {
        mat.roughness = materialProps.roughness
      }

      if ('metalness' in mat && typeof materialProps.metalness === 'number') {
        mat.metalness = materialProps.metalness
      }

      mat.needsUpdate = true
    })
  }, [materials, materialColor, materialProps])

  return <primitive object={modelScene} scale={1.2} />
}

class ModelErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-full items-center justify-center rounded-xl border border-red-200 bg-red-50 p-6 text-center">
          <p className="text-sm font-medium text-red-700">
            We could not load this 3D model. Please try another product.
          </p>
        </div>
      )
    }

    return this.props.children
  }
}

function FurnitureViewer3D({
  modelPath,
  className = '',
  materialColor = '#9CA3AF',
  materialProps = { roughness: 0.6, metalness: 0.2 },
  lowBandwidthMode = false,
}) {
  if (!modelPath) {
    return (
      <div className="flex h-full items-center justify-center rounded-xl border border-amber-200 bg-amber-50 p-6 text-center">
        <p className="text-sm font-medium text-amber-700">
          3D model is not available yet for this product.
        </p>
      </div>
    )
  }

  return (
    <div className={`h-[420px] overflow-hidden rounded-xl border border-slate-200 bg-slate-100 ${className}`}>
      <ModelErrorBoundary>
        <Canvas
          camera={{ position: [2.5, 1.8, 2.8], fov: 50 }}
          dpr={lowBandwidthMode ? [0.6, 1] : [1, 2]}
          shadows={!lowBandwidthMode}
        >
          <color attach="background" args={['#e2e8f0']} />

          <ambientLight intensity={lowBandwidthMode ? 0.8 : 0.7} />
          <directionalLight
            position={[4, 5, 2]}
            intensity={lowBandwidthMode ? 0.85 : 1.1}
            castShadow={!lowBandwidthMode}
          />
          <directionalLight position={[-3, 3, -2]} intensity={0.5} />

          <gridHelper
            args={[10, lowBandwidthMode ? 10 : 20, '#94a3b8', '#cbd5e1']}
          />
          {!lowBandwidthMode && <Environment preset="city" background />}

          <Suspense
            fallback={<ModelLoadingFallback lowBandwidthMode={lowBandwidthMode} />}
          >
            <Model
              modelPath={modelPath}
              materialColor={materialColor}
              materialProps={materialProps}
            />
          </Suspense>

          <OrbitControls
            enablePan={!lowBandwidthMode}
            enableRotate
            enableZoom
          />
        </Canvas>
      </ModelErrorBoundary>
    </div>
  )
}

export default FurnitureViewer3D
