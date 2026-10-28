import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function StudentHologramCanvas({ className = '' }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 4.2;
    camera.position.y = 0.4;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // 2. Lighting - Subtle Royal Violet & Ambient
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const pointLightViolet = new THREE.PointLight(0x9303C5, 2.8, 10);
    pointLightViolet.position.set(2, 3, 3);
    scene.add(pointLightViolet);

    const pointLightCyan = new THREE.PointLight(0xA855F7, 1.8, 10);
    pointLightCyan.position.set(-2, -1, 2);
    scene.add(pointLightCyan);

    // 3. Hologram Group
    const hologramGroup = new THREE.Group();
    scene.add(hologramGroup);

    // --- Object A: 3D Graduation Mortarboard Cap ---
    // Diamond cap top
    const capTopGeo = new THREE.BoxGeometry(1.6, 0.08, 1.6);
    const capMaterial = new THREE.MeshStandardMaterial({
      color: 0x9303C5,
      metalness: 0.4,
      roughness: 0.2,
      emissive: 0x4A006A,
      emissiveIntensity: 0.4
    });
    const capTop = new THREE.Mesh(capTopGeo, capMaterial);
    capTop.rotation.y = Math.PI / 4; // diamond angle
    capTop.position.y = 0.35;
    hologramGroup.add(capTop);

    // Cap Skullcap Base
    const skullCapGeo = new THREE.CylinderGeometry(0.5, 0.55, 0.4, 24);
    const skullCapMat = new THREE.MeshStandardMaterial({
      color: 0x070D19,
      metalness: 0.6,
      roughness: 0.3,
      emissive: 0x2E0045,
      emissiveIntensity: 0.3
    });
    const skullCap = new THREE.Mesh(skullCapGeo, skullCapMat);
    skullCap.position.y = 0.15;
    hologramGroup.add(skullCap);

    // Button & Tassel Ribbon on top
    const buttonGeo = new THREE.SphereGeometry(0.08, 16, 16);
    const buttonMat = new THREE.MeshStandardMaterial({
      color: 0xE9D5FF,
      metalness: 0.8,
      roughness: 0.1,
      emissive: 0x9303C5,
      emissiveIntensity: 0.8
    });
    const button = new THREE.Mesh(buttonGeo, buttonMat);
    button.position.y = 0.42;
    hologramGroup.add(button);

    // Tassel hanging string
    const tasselCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0.42, 0),
      new THREE.Vector3(0.6, 0.38, 0.6),
      new THREE.Vector3(0.75, 0.1, 0.75),
      new THREE.Vector3(0.8, -0.2, 0.8)
    ]);
    const tasselGeo = new THREE.TubeGeometry(tasselCurve, 20, 0.02, 8, false);
    const tasselMat = new THREE.MeshStandardMaterial({
      color: 0xC084FC,
      emissive: 0x9303C5,
      emissiveIntensity: 0.5
    });
    const tassel = new THREE.Mesh(tasselGeo, tasselMat);
    hologramGroup.add(tassel);

    // --- Object B: Inner Floating Knowledge Core (Octahedron crystal) ---
    const crystalGeo = new THREE.OctahedronGeometry(0.35, 0);
    const crystalMat = new THREE.MeshPhysicalMaterial({
      color: 0xC084FC,
      emissive: 0x9303C5,
      emissiveIntensity: 0.7,
      transparent: true,
      opacity: 0.85,
      roughness: 0.1,
      metalness: 0.1,
      transmission: 0.6
    });
    const crystal = new THREE.Mesh(crystalGeo, crystalMat);
    crystal.position.y = -0.3;
    hologramGroup.add(crystal);

    // --- Object C: Orbiting Holographic Rings ---
    const ringGeo1 = new THREE.TorusGeometry(1.2, 0.015, 16, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xA855F7,
      transparent: true,
      opacity: 0.55
    });
    const ring1 = new THREE.Mesh(ringGeo1, ringMat);
    ring1.rotation.x = Math.PI / 3;
    hologramGroup.add(ring1);

    const ringGeo2 = new THREE.TorusGeometry(1.4, 0.012, 16, 64);
    const ringMat2 = new THREE.MeshBasicMaterial({
      color: 0x9303C5,
      transparent: true,
      opacity: 0.4
    });
    const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
    ring2.rotation.x = -Math.PI / 3.5;
    ring2.rotation.y = Math.PI / 6;
    hologramGroup.add(ring2);

    // --- Object D: Particle Aura / Knowledge Sparks ---
    const particlesCount = 70;
    const posArray = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount * 3; i += 3) {
      posArray[i] = (Math.random() - 0.5) * 3.5;
      posArray[i + 1] = (Math.random() - 0.5) * 2.5;
      posArray[i + 2] = (Math.random() - 0.5) * 3.5;
    }
    const particlesGeo = new THREE.BufferGeometry();
    particlesGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particlesMat = new THREE.PointsMaterial({
      size: 0.035,
      color: 0xC084FC,
      transparent: true,
      opacity: 0.7
    });
    const particleSystem = new THREE.Points(particlesGeo, particlesMat);
    hologramGroup.add(particleSystem);

    // 4. Mouse reactivity tracking
    let targetRotationX = 0;
    let targetRotationY = 0;
    let mouseX = 0;
    let mouseY = 0;

    const onMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      mouseX = (x / rect.width) * 2 - 1;
      mouseY = -(y / rect.height) * 2 + 1;
      targetRotationY = mouseX * 0.4;
      targetRotationX = -mouseY * 0.3;
    };

    container.addEventListener('mousemove', onMouseMove);

    // 5. Animation loop
    let clock = new THREE.Clock();
    let animationFrameId;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Gentle floating motion (sine wave)
      hologramGroup.position.y = Math.sin(elapsedTime * 1.5) * 0.08;

      // Slow elegant continuous rotation
      hologramGroup.rotation.y += 0.006;

      // Inner crystal counter-rotation
      crystal.rotation.y -= 0.015;
      crystal.rotation.x += 0.008;

      // Orbiting rings
      ring1.rotation.z += 0.004;
      ring2.rotation.z -= 0.003;

      // Smooth mouse follow interpolation
      hologramGroup.rotation.x += (targetRotationX - hologramGroup.rotation.x) * 0.05;
      camera.position.x += (mouseX * 0.3 - camera.position.x) * 0.05;

      renderer.render(scene, camera);
    };

    animate();

    // 6. Handle resize
    const handleResize = () => {
      if (!container) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(animationFrameId);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      scene.clear();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full min-h-[220px] flex items-center justify-center cursor-grab active:cursor-grabbing ${className}`}
    >
      {/* Subtle radial ambient glow behind model */}
      <div className="absolute w-40 h-40 rounded-full bg-royal-600/25 blur-3xl pointer-events-none -z-10" />
    </div>
  );
}

