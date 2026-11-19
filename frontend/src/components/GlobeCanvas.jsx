import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

// Convert Lat/Lon to 3D Sphere Vector3
function latLonToVector3(lat, lon, radius = 2.05) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
}

export default function GlobeCanvas({ geoPoints = [] }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth || 400;
    const height = container.clientHeight || 360;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 5.2;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.replaceChildren(renderer.domElement);

    // 2. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0x38bdf8, 1.8);
    dirLight.position.set(5, 5, 5);
    scene.add(dirLight);

    const blueLight = new THREE.PointLight(0x06b6d4, 2.5, 50);
    blueLight.position.set(-5, -5, -2);
    scene.add(blueLight);

    // 3. Globe Group
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    // Inner Dark Core Sphere
    const coreGeo = new THREE.SphereGeometry(2, 48, 48);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x050b14,
      roughness: 0.3,
      metalness: 0.9,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    globeGroup.add(coreMesh);

    // Wireframe Matrix Lattice
    const wireGeo = new THREE.SphereGeometry(2.03, 32, 32);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x0284c7,
      wireframe: true,
      transparent: true,
      opacity: 0.22,
    });
    const wireMesh = new THREE.Mesh(wireGeo, wireMat);
    globeGroup.add(wireMesh);

    // Tactical Surface Point Cloud
    const particleCount = 1400;
    const posArray = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = 2.04;
      const sinPhi = Math.sin(phi);
      posArray[i * 3] = r * sinPhi * Math.cos(theta);
      posArray[i * 3 + 1] = r * Math.cos(phi);
      posArray[i * 3 + 2] = r * sinPhi * Math.sin(theta);
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particleMat = new THREE.PointsMaterial({
      size: 0.04,
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    globeGroup.add(particles);

    // Orbital Shield Ring
    const ringGeo = new THREE.RingGeometry(2.45, 2.5, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.35,
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI / 3;
    globeGroup.add(ringMesh);

    // Live Geolocation Attack Vector / IP Pins
    const beaconsGroup = new THREE.Group();
    globeGroup.add(beaconsGroup);

    geoPoints.forEach((pt) => {
      if (!pt.lat || !pt.lon) return;
      const pos = latLonToVector3(pt.lat, pt.lon, 2.06);

      const beaconGeo = new THREE.SphereGeometry(0.08, 16, 16);
      const beaconMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
      const beacon = new THREE.Mesh(beaconGeo, beaconMat);
      beacon.position.copy(pos);

      // Outer Pulse Aura
      const auraGeo = new THREE.SphereGeometry(0.16, 16, 16);
      const auraMat = new THREE.MeshBasicMaterial({
        color: 0xf87171,
        transparent: true,
        opacity: 0.45,
      });
      const aura = new THREE.Mesh(auraGeo, auraMat);
      aura.position.copy(pos);

      beaconsGroup.add(beacon);
      beaconsGroup.add(aura);
    });

    // 4. Mouse Interactive Rotation
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    const onMouseDown = (e) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseMove = (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;
      globeGroup.rotation.y += deltaX * 0.005;
      globeGroup.rotation.x += deltaY * 0.005;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // 5. Animation Loop
    let animId;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (!isDragging) {
        globeGroup.rotation.y += 0.003;
      }
      ringMesh.rotation.z += 0.002;
      renderer.render(scene, camera);
    };
    animate();

    // 6. Resize handling
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      dom.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, [geoPoints]);

  return (
    <div className="w-full h-full relative cursor-grab active:cursor-grabbing select-none">
      <div ref={containerRef} className="w-full h-full min-h-[350px]" />
      <div className="absolute bottom-2 left-2 flex items-center gap-2 text-[11px] text-cyan-400 font-mono bg-slate-950/80 backdrop-blur px-2.5 py-1 rounded border border-cyan-800/40 pointer-events-none">
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
        Interactive Three.js 3D Cyber Globe · Drag to Rotate
      </div>
    </div>
  );
}
