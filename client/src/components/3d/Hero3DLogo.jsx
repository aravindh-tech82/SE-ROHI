import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function Hero3DLogo({ className = '' }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene setup
    const scene = new THREE.Scene();
    const width = container.clientWidth || 380;
    const height = container.clientHeight || 380;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 4.4);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // 2. Lighting - Soft Royal Violet & Cyan Accents
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const pointLightViolet = new THREE.PointLight(0x9303C5, 3.2, 12);
    pointLightViolet.position.set(2.5, 3, 3);
    scene.add(pointLightViolet);

    const pointLightPurple = new THREE.PointLight(0xA855F7, 2.2, 12);
    pointLightPurple.position.set(-2.5, -2, 2.5);
    scene.add(pointLightPurple);

    // 3. Central Hologram Group
    const group = new THREE.Group();
    scene.add(group);

    // --- Object A: 3D Graduation Mortarboard Diamond ---
    const capTopGeo = new THREE.BoxGeometry(1.65, 0.09, 1.65);
    const capMaterial = new THREE.MeshStandardMaterial({
      color: 0x9303C5,
      metalness: 0.45,
      roughness: 0.25,
      emissive: 0x581C87,
      emissiveIntensity: 0.45
    });
    const capTop = new THREE.Mesh(capTopGeo, capMaterial);
    capTop.rotation.y = Math.PI / 4;
    capTop.position.y = 0.38;
    group.add(capTop);

    // Skull cap base
    const skullGeo = new THREE.CylinderGeometry(0.52, 0.58, 0.42, 32);
    const skullMat = new THREE.MeshStandardMaterial({
      color: 0x070D19,
      metalness: 0.6,
      roughness: 0.3,
      emissive: 0x3B0764,
      emissiveIntensity: 0.35
    });
    const skull = new THREE.Mesh(skullGeo, skullMat);
    skull.position.y = 0.16;
    group.add(skull);

    // Gold/Violet tassel bead
    const buttonGeo = new THREE.SphereGeometry(0.09, 16, 16);
    const buttonMat = new THREE.MeshStandardMaterial({
      color: 0xF3E8FF,
      emissive: 0x9303C5,
      emissiveIntensity: 0.8
    });
    const button = new THREE.Mesh(buttonGeo, buttonMat);
    button.position.y = 0.45;
    group.add(button);

    // Ribbon curve
    const tasselCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0.45, 0),
      new THREE.Vector3(0.65, 0.4, 0.65),
      new THREE.Vector3(0.8, 0.12, 0.8),
      new THREE.Vector3(0.85, -0.22, 0.85)
    ]);
    const tasselGeo = new THREE.TubeGeometry(tasselCurve, 20, 0.022, 8, false);
    const tasselMat = new THREE.MeshStandardMaterial({
      color: 0xC084FC,
      emissive: 0x9303C5,
      emissiveIntensity: 0.6
    });
    const tassel = new THREE.Mesh(tasselGeo, tasselMat);
    group.add(tassel);

    // --- Object B: Inner Floating Knowledge Core (Octahedron) ---
    const crystalGeo = new THREE.OctahedronGeometry(0.42, 0);
    const crystalMat = new THREE.MeshPhysicalMaterial({
      color: 0xC084FC,
      emissive: 0x9303C5,
      emissiveIntensity: 0.75,
      transparent: true,
      opacity: 0.9,
      roughness: 0.1,
      metalness: 0.15,
      transmission: 0.6
    });
    const crystal = new THREE.Mesh(crystalGeo, crystalMat);
    crystal.position.y = -0.32;
    group.add(crystal);

    // --- Object C: Orbiting Energy Rings ---
    const ring1Geo = new THREE.TorusGeometry(1.28, 0.016, 16, 64);
    const ring1Mat = new THREE.MeshBasicMaterial({
      color: 0xA855F7,
      transparent: true,
      opacity: 0.6
    });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1.rotation.x = Math.PI / 3;
    group.add(ring1);

    const ring2Geo = new THREE.TorusGeometry(1.48, 0.012, 16, 64);
    const ring2Mat = new THREE.MeshBasicMaterial({
      color: 0x9303C5,
      transparent: true,
      opacity: 0.45
    });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.x = -Math.PI / 3.4;
    ring2.rotation.y = Math.PI / 5;
    group.add(ring2);

    // --- Object D: Soft Particle Aura ---
    const particlesCount = 80;
    const posArray = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount * 3; i += 3) {
      posArray[i] = (Math.random() - 0.5) * 3.6;
      posArray[i + 1] = (Math.random() - 0.5) * 2.8;
      posArray[i + 2] = (Math.random() - 0.5) * 3.6;
    }
    const particlesGeo = new THREE.BufferGeometry();
    particlesGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particlesMat = new THREE.PointsMaterial({
      size: 0.038,
      color: 0xC084FC,
      transparent: true,
      opacity: 0.65
    });
    const particleSystem = new THREE.Points(particlesGeo, particlesMat);
    group.add(particleSystem);

    // 4. Mouse movement tracking (Parallax)
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const onMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      mouseX = (x / rect.width) * 2 - 1;
      mouseY = -(y / rect.height) * 2 + 1;
      targetY = mouseX * 0.35;
      targetX = -mouseY * 0.25;
    };

    window.addEventListener('mousemove', onMouseMove);

    // 5. Animation loop
    const clock = new THREE.Clock();
    let animId;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Gentle floating animation
      group.position.y = Math.sin(elapsed * 1.6) * 0.09;

      // Slow elegant continuous rotation
      group.rotation.y += 0.005;

      // Crystal counter-rotation
      crystal.rotation.y -= 0.012;
      crystal.rotation.x += 0.007;

      // Rings
      ring1.rotation.z += 0.003;
      ring2.rotation.z -= 0.0025;

      // Smooth mouse follow / parallax interpolation
      group.rotation.x += (targetX - group.rotation.x) * 0.05;
      camera.position.x += (mouseX * 0.25 - camera.position.x) * 0.04;

      renderer.render(scene, camera);
    };

    animate();

    // 6. Resize handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w === 0 || h === 0) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      scene.clear();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className={`relative flex items-center justify-center cursor-grab active:cursor-grabbing select-none ${className}`}
    >
      {/* Soft royal violet radial glow behind 3D logo */}
      <div className="absolute w-48 h-48 rounded-full bg-royal-600/25 blur-3xl pointer-events-none -z-10 animate-subtle-glow" />
    </div>
  );
}

