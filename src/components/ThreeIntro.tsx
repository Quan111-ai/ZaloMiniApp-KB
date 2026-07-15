import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface ThreeIntroProps {
  active: boolean;
}

// Dynamically generate a crisp 3D glass bubble texture with a sharp border and specular highlight
const createBubbleTexture = () => {
  if (typeof document === 'undefined') return null;
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.clearRect(0, 0, 64, 64);

    // Transparent gold fill for glass body
    ctx.fillStyle = 'rgba(197, 168, 128, 0.12)';
    ctx.beginPath();
    ctx.arc(32, 32, 28, 0, Math.PI * 2);
    ctx.fill();

    // Sharp golden border rim
    ctx.strokeStyle = 'rgba(255, 225, 180, 0.95)';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(32, 32, 28, 0, Math.PI * 2);
    ctx.stroke();

    // Specular highlight reflection dot
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.beginPath();
    ctx.arc(22, 22, 4.5, 0, Math.PI * 2);
    ctx.fill();
  }
  const texture = new THREE.CanvasTexture(canvas);
  return texture;
};

export default function ThreeIntro({ active }: ThreeIntroProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const [useCssFallback, setUseCssFallback] = useState(false);

  // Performance-based spec detection
  useEffect(() => {
    if (typeof navigator !== 'undefined') {
      const ram = navigator.deviceMemory;
      const cores = navigator.hardwareConcurrency;
      
      // If low-spec phone (RAM <= 3GB or CPU Cores <= 4), fallback to high-performance CSS animations
      const isLow = (ram && ram <= 3) || (cores && cores <= 4);
      if (isLow) {
        setUseCssFallback(true);
      }
    }
  }, []);

  useEffect(() => {
    if (useCssFallback || !canvasRef.current || !active) return;

    let renderer: THREE.WebGLRenderer | null = null;
    let animationId: number;
    let resizeObserver: ResizeObserver | null = null;
    let waterGeometry: THREE.PlaneGeometry | null = null;
    let waterMaterial: THREE.MeshStandardMaterial | null = null;
    let wireMaterial: THREE.MeshBasicMaterial | null = null;
    let bubbleGeometry: THREE.BufferGeometry | null = null;
    let bubbleMaterial: THREE.PointsMaterial | null = null;
    let bubbleTexture: THREE.CanvasTexture | null = null;

    try {
      const canvas = canvasRef.current;
      const parent = canvas.parentElement;
      if (!parent) return;

      const width = parent.clientWidth;
      const height = parent.clientHeight;

      // 1. Scene setup
      const scene = new THREE.Scene();

      // 2. Camera setup - Positioned straight ahead
      const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 100);
      camera.position.set(0, 0, 5.0);

      // 3. WebGL Renderer (high-performance parameters)
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: false, // Turn off antialiasing on mobile to double rendering speed
        powerPreference: "high-performance"
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit pixel ratio to 2 to prevent mobile rendering bottlenecks

      // 4. Lights: High-contrast cinematic sunset lights
      const ambientLight = new THREE.AmbientLight(0x1a1215, 0.35);
      scene.add(ambientLight);

      const goldSun = new THREE.DirectionalLight(0xc5a880, 3.5);
      goldSun.position.set(5, 5, 3);
      scene.add(goldSun);

      const redLight = new THREE.PointLight(0x9e1a1e, 4.0, 12);
      redLight.position.set(-3, -3, 2);
      scene.add(redLight);

      const reflectionLight = new THREE.PointLight(0xff3b30, 4.0, 10);
      reflectionLight.position.set(0, 3, 2);
      scene.add(reflectionLight);

      // 5. Geometry & Material: Optimized Waving Water Surface (reduced segments from 32x24 to 16x12)
      waterGeometry = new THREE.PlaneGeometry(12, 16, 16, 12);
      const originalPositions = waterGeometry.attributes.position.clone();

      // Semi-transparent deep burgundy-black standard material
      waterMaterial = new THREE.MeshStandardMaterial({
        color: 0x160a0d,
        metalness: 0.8,
        roughness: 0.1,
        transparent: true,
        opacity: 0.4,
        side: THREE.DoubleSide
      });

      const waterMesh = new THREE.Mesh(waterGeometry, waterMaterial);
      waterMesh.position.set(0, 0, -0.5);
      scene.add(waterMesh);

      // Elegant gold wireframe lines overlay for technical vector ripple effect
      wireMaterial = new THREE.MeshBasicMaterial({
        color: 0xc5a880,
        wireframe: true,
        transparent: true,
        opacity: 0.14,
        depthWrite: false
      });
      const waterWireframe = new THREE.Mesh(waterGeometry, wireMaterial);
      waterWireframe.position.copy(waterMesh.position);
      scene.add(waterWireframe);

      // 6. Particles: Rising Crisp Bubbles (reduced count from 80 to 45 for lighter processing)
      const bubbleCount = 45;
      bubbleGeometry = new THREE.BufferGeometry();
      const positions = new Float32Array(bubbleCount * 3);

      for (let i = 0; i < bubbleCount * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 5.0; 
        positions[i + 1] = (Math.random() - 0.5) * 9.0; 
        positions[i + 2] = (Math.random() - 0.5) * 2.0; 
      }

      bubbleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

      bubbleTexture = createBubbleTexture();
      bubbleMaterial = new THREE.PointsMaterial({
        color: 0xfff3e0,
        size: 0.32,
        transparent: true,
        opacity: 0.8,
        map: bubbleTexture || undefined,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });

      const bubbles = new THREE.Points(bubbleGeometry, bubbleMaterial);
      scene.add(bubbles);

      // 7. Track mouse movement
      const handleMouseMove = (event: MouseEvent) => {
        const rect = canvas.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        mouseRef.current = { x, y };
      };

      window.addEventListener('mousemove', handleMouseMove);

      // 8. Animation loop
      const clock = new THREE.Clock();

      const animate = () => {
        animationId = requestAnimationFrame(animate);

        const elapsedTime = clock.getElapsedTime();
        const time = elapsedTime * 0.9; 

        // A. Waving the water surface plane on Z axis
        const posAttribute = waterGeometry!.attributes.position;
        const origAttribute = originalPositions;
        const vertex = new THREE.Vector3();

        for (let i = 0; i < posAttribute.count; i++) {
          vertex.fromBufferAttribute(origAttribute, i);
          
          // Dynamic horizontal ripples
          const wave = 
            Math.sin(vertex.x * 1.4 + time) * Math.cos(vertex.y * 1.4 + time * 0.8) * 0.15 +
            Math.sin(vertex.x * 0.6 - time * 0.5) * Math.cos(vertex.y * 0.6 + time * 0.4) * 0.08;

          posAttribute.setZ(i, wave);
        }
        posAttribute.needsUpdate = true;
        
        // B. Bubbles movement
        const posArr = bubbleGeometry!.attributes.position.array as Float32Array;
        for (let i = 0; i < bubbleCount * 3; i += 3) {
          posArr[i + 1] += 0.008 + Math.sin(elapsedTime * 0.3 + i) * 0.002;
          posArr[i] += Math.sin(elapsedTime * 0.5 + posArr[i + 1] * 1.5) * 0.004;

          if (posArr[i + 1] > 4.5) {
            posArr[i + 1] = -4.5; 
            posArr[i] = (Math.random() - 0.5) * 5.0; 
            posArr[i + 2] = (Math.random() - 0.5) * 2.0; 
          }
        }
        bubbleGeometry!.attributes.position.needsUpdate = true;

        // C. Shifting highlight point light
        reflectionLight.position.x = Math.sin(elapsedTime * 0.75) * 2.5;
        reflectionLight.position.z = Math.cos(elapsedTime * 0.75) * 2.5;

        // D. Smooth mouse tilt
        const targetX = mouseRef.current.x * 0.4;
        const targetY = mouseRef.current.y * 0.4;
        waterMesh.rotation.y += (targetX * 0.1 - waterMesh.rotation.y) * 0.04;
        waterMesh.rotation.x += (targetY * 0.1 - waterMesh.rotation.x) * 0.04;
        waterWireframe.rotation.copy(waterMesh.rotation);

        renderer!.render(scene, camera);
      };

      animate();

      // 9. Resize
      const handleResize = () => {
        if (!camera || !renderer) return;
        const w = parent.clientWidth;
        const h = parent.clientHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };

      resizeObserver = new ResizeObserver(handleResize);
      resizeObserver.observe(parent);

      return () => {
        cancelAnimationFrame(animationId);
        window.removeEventListener('mousemove', handleMouseMove);
        if (resizeObserver) resizeObserver.disconnect();
        if (waterGeometry) waterGeometry.dispose();
        if (waterMaterial) waterMaterial.dispose();
        if (wireMaterial) wireMaterial.dispose();
        if (bubbleGeometry) bubbleGeometry.dispose();
        if (bubbleMaterial) bubbleMaterial.dispose();
        if (bubbleTexture) bubbleTexture.dispose();
        if (renderer) renderer.dispose();
      };
    } catch (e) {
      console.warn("WebGL/Three.js error detected on startup. Safely falling back to CSS animation:", e);
      setUseCssFallback(true);
    }
  }, [active, useCssFallback]);

  if (useCssFallback) {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-1 bg-gradient-to-br from-[#160a0d] via-black to-[#241316]">
        {/* Embedded style tag for self-contained, hardware-accelerated rendering */}
        <style>{`
          @keyframes floatUp {
            0% {
              transform: translateY(0) rotate(0deg);
              opacity: 0;
            }
            10% {
              opacity: 0.7;
            }
            90% {
              opacity: 0.7;
            }
            100% {
              transform: translateY(-105vh) rotate(360deg);
              opacity: 0;
            }
          }
        `}</style>
        
        {/* Luxury ambient vector glow points */}
        <div className="absolute top-[20%] left-[25%] w-64 h-64 rounded-full bg-[#9e1a1e]/8 blur-[90px] animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="absolute bottom-[25%] right-[20%] w-72 h-72 rounded-full bg-[#c5a880]/8 blur-[110px] animate-pulse" style={{ animationDuration: '6s' }} />
        
        {/* Floating CSS Gold particles */}
        <div className="absolute inset-0">
          {[...Array(15)].map((_, i) => {
            const size = Math.random() * 12 + 5; 
            const left = Math.random() * 100; 
            const duration = Math.random() * 14 + 14; 
            const delay = Math.random() * -20; 
            return (
              <div
                key={i}
                className="absolute rounded-full border border-[#c5a880]/35 bg-[#c5a880]/5 shadow-[0_0_8px_rgba(197,168,128,0.1)] flex items-center justify-center"
                style={{
                  width: `${size}px`,
                  height: `${size}px`,
                  left: `${left}%`,
                  bottom: `-20px`,
                  animation: `floatUp ${duration}s linear infinite`,
                  animationDelay: `${delay}s`,
                }}
              >
                <div className="absolute top-[20%] left-[20%] w-[25%] h-[25%] rounded-full bg-white/60" />
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full z-1 pointer-events-none"
    />
  );
}
