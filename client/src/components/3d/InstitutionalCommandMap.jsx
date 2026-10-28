import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export default function InstitutionalCommandMap({
  departments = [],
  selectedDepartment = null,
  onSelectDepartment = () => {},
  className = ''
}) {
  const containerRef = useRef(null);
  const [hoveredDept, setHoveredDept] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let width = container.clientWidth || 800;
    let height = container.clientHeight || 520;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 5.2, 9.5);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // 2. Lighting - Royal Violet + Deep Navy Command Center Ambient
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const mainPoint = new THREE.PointLight(0x9303C5, 3.5, 25);
    mainPoint.position.set(0, 6, 4);
    scene.add(mainPoint);

    const accentPoint = new THREE.PointLight(0xA855F7, 2.0, 20);
    accentPoint.position.set(-5, -2, 4);
    scene.add(accentPoint);

    // 3. Central Institutional Hub / Command Core
    const coreGroup = new THREE.Group();
    scene.add(coreGroup);

    // Grid Floor
    const gridHelper = new THREE.GridHelper(16, 24, 0x9303C5, 0x1E1B4B);
    gridHelper.position.y = -1.2;
    gridHelper.material.opacity = 0.35;
    gridHelper.material.transparent = true;
    scene.add(gridHelper);

    // Central Pillar (Institution HQ)
    const centralPillarGeo = new THREE.CylinderGeometry(0.8, 1.1, 0.8, 32);
    const centralPillarMat = new THREE.MeshStandardMaterial({
      color: 0x070D19,
      metalness: 0.8,
      roughness: 0.2,
      emissive: 0x581C87,
      emissiveIntensity: 0.4
    });
    const centralPillar = new THREE.Mesh(centralPillarGeo, centralPillarMat);
    centralPillar.position.y = -0.7;
    coreGroup.add(centralPillar);

    // Central Floating Crystal (Institution Diamond)
    const coreCrystalGeo = new THREE.OctahedronGeometry(0.7, 0);
    const coreCrystalMat = new THREE.MeshPhysicalMaterial({
      color: 0xC084FC,
      emissive: 0x9303C5,
      emissiveIntensity: 0.9,
      transparent: true,
      opacity: 0.9,
      roughness: 0.1,
      metalness: 0.2,
      transmission: 0.5
    });
    const coreCrystal = new THREE.Mesh(coreCrystalGeo, coreCrystalMat);
    coreCrystal.position.y = 0.3;
    coreGroup.add(coreCrystal);

    // Central Orbital Ring
    const coreRingGeo = new THREE.TorusGeometry(1.5, 0.02, 16, 64);
    const coreRingMat = new THREE.MeshBasicMaterial({ color: 0xA855F7, transparent: true, opacity: 0.7 });
    const coreRing = new THREE.Mesh(coreRingGeo, coreRingMat);
    coreRing.rotation.x = Math.PI / 2.2;
    coreGroup.add(coreRing);

    // 4. Department Nodes & Dynamic Network Connections
    const deptMeshes = [];
    const connectionLines = [];

    // Fallback departments if none passed
    const deptsList = departments.length > 0 ? departments : [
      { id: 'dept_cse', code: 'CSE', name: 'Computer Science & Engineering', position: [-3.2, 0.4, 0.5], color: '#9303C5', studentCount: 420, facultyCount: 28, avgAttendance: 88.2, avgPerformance: 81.4, atRiskCount: 7 },
      { id: 'dept_csec', code: 'Cyber Security', name: 'CSE Cyber Security', position: [-1.8, 1.8, -0.6], color: '#A855F7', studentCount: 180, facultyCount: 14, avgAttendance: 86.5, avgPerformance: 83.2, atRiskCount: 4 },
      { id: 'dept_aids', code: 'AI & DS', name: 'Artificial Intelligence & Data Science', position: [1.8, 1.8, -0.6], color: '#C084FC', studentCount: 260, facultyCount: 18, avgAttendance: 89.1, avgPerformance: 84.6, atRiskCount: 3 },
      { id: 'dept_it', code: 'IT', name: 'Information Technology', position: [3.2, 0.4, 0.5], color: '#7E02A9', studentCount: 290, facultyCount: 19, avgAttendance: 84.8, avgPerformance: 79.5, atRiskCount: 5 },
      { id: 'dept_ece', code: 'ECE', name: 'Electronics & Communication', position: [2.2, -1.2, 1.2], color: '#38BDF8', studentCount: 260, facultyCount: 20, avgAttendance: 82.4, avgPerformance: 77.8, atRiskCount: 6 },
      { id: 'dept_eee', code: 'EEE', name: 'Electrical & Electronics', position: [0.0, -1.8, 1.8], color: '#F59E0B', studentCount: 180, facultyCount: 15, avgAttendance: 85.0, avgPerformance: 78.4, atRiskCount: 4 },
      { id: 'dept_mech', code: 'Mechanical', name: 'Mechanical Engineering', position: [-2.2, -1.2, 1.2], color: '#EC4899', studentCount: 210, facultyCount: 16, avgAttendance: 83.1, avgPerformance: 76.2, atRiskCount: 5 },
      { id: 'dept_civil', code: 'Civil', name: 'Civil Engineering', position: [0.0, 2.4, -1.4], color: '#10B981', studentCount: 140, facultyCount: 12, avgAttendance: 86.0, avgPerformance: 75.9, atRiskCount: 3 }
    ];

    deptsList.forEach((dept) => {
      const pos = dept.position || [0, 0, 0];
      const deptGroup = new THREE.Group();
      deptGroup.position.set(pos[0], pos[1], pos[2]);

      // Base Station Cylinder
      const baseGeo = new THREE.CylinderGeometry(0.42, 0.52, 0.35, 24);
      const baseMat = new THREE.MeshStandardMaterial({
        color: 0x070D19,
        metalness: 0.7,
        roughness: 0.3,
        emissive: 0x2E0045,
        emissiveIntensity: 0.3
      });
      const baseMesh = new THREE.Mesh(baseGeo, baseMat);
      deptGroup.add(baseMesh);

      // Node Diamond Crystal
      const nodeGeo = new THREE.DodecahedronGeometry(0.38, 0);
      const nodeColorHex = parseInt((dept.color || '#9303C5').replace('#', '0x'), 16);
      const nodeMat = new THREE.MeshStandardMaterial({
        color: nodeColorHex,
        emissive: nodeColorHex,
        emissiveIntensity: 0.65,
        roughness: 0.2,
        metalness: 0.4
      });
      const nodeMesh = new THREE.Mesh(nodeGeo, nodeMat);
      nodeMesh.position.y = 0.45;
      deptGroup.add(nodeMesh);

      // Glowing Aura Ring around node
      const auraRingGeo = new THREE.RingGeometry(0.55, 0.62, 32);
      const auraRingMat = new THREE.MeshBasicMaterial({
        color: nodeColorHex,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.5
      });
      const auraRing = new THREE.Mesh(auraRingGeo, auraRingMat);
      auraRing.rotation.x = Math.PI / 2;
      auraRing.position.y = -0.15;
      deptGroup.add(auraRing);

      // Save references for raycasting & animation
      deptGroup.userData = { dept, nodeMesh, auraRing, baseMesh };
      deptMeshes.push(deptGroup);
      scene.add(deptGroup);

      // Connecting energy link from Institution core to Department
      const points = [
        new THREE.Vector3(0, 0.3, 0),
        new THREE.Vector3(pos[0] * 0.5, 0.1, pos[2] * 0.5),
        new THREE.Vector3(pos[0], pos[1] - 0.1, pos[2])
      ];
      const linkCurve = new THREE.CatmullRomCurve3(points);
      const linkGeo = new THREE.TubeGeometry(linkCurve, 20, 0.014, 8, false);
      const linkMat = new THREE.MeshBasicMaterial({
        color: 0x9303C5,
        transparent: true,
        opacity: 0.35
      });
      const linkMesh = new THREE.Mesh(linkGeo, linkMat);
      scene.add(linkMesh);
      connectionLines.push({ linkMesh, linkMat, baseOpacity: 0.35 });
    });

    // 5. Floating Energy Sparks / Command Telemetry Particles
    const sparkCount = 90;
    const sparkPos = new Float32Array(sparkCount * 3);
    for (let i = 0; i < sparkCount * 3; i += 3) {
      sparkPos[i] = (Math.random() - 0.5) * 12;
      sparkPos[i + 1] = Math.random() * 4 - 1;
      sparkPos[i + 2] = (Math.random() - 0.5) * 10;
    }
    const sparkGeo = new THREE.BufferGeometry();
    sparkGeo.setAttribute('position', new THREE.BufferAttribute(sparkPos, 3));
    const sparkMat = new THREE.PointsMaterial({
      size: 0.04,
      color: 0xC084FC,
      transparent: true,
      opacity: 0.6
    });
    const sparkPoints = new THREE.Points(sparkGeo, sparkMat);
    scene.add(sparkPoints);

    // 6. Raycaster for Interactivity
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2(-1000, -1000);
    let currentHoveredGroup = null;

    const onPointerMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      mouse.x = (x / rect.width) * 2 - 1;
      mouse.y = -(y / rect.height) * 2 + 1;
      setMousePos({ x, y });
    };

    const onClick = () => {
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(deptMeshes, true);
      if (intersects.length > 0) {
        let root = intersects[0].object;
        while (root.parent && !root.userData?.dept) {
          root = root.parent;
        }
        if (root.userData?.dept) {
          onSelectDepartment(root.userData.dept);
        }
      }
    };

    container.addEventListener('mousemove', onPointerMove);
    container.addEventListener('click', onClick);

    // 7. Animation Loop
    const clock = new THREE.Clock();
    let animId;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Slow institutional core rotation & pulse
      coreCrystal.rotation.y += 0.008;
      coreCrystal.rotation.x = Math.sin(elapsed * 1.2) * 0.06;
      coreRing.rotation.z -= 0.004;

      // Animate department nodes
      deptMeshes.forEach((dg, i) => {
        const { nodeMesh, auraRing, dept } = dg.userData;
        if (nodeMesh) {
          nodeMesh.rotation.y += 0.012 + (i * 0.001);
          nodeMesh.position.y = 0.45 + Math.sin(elapsed * 1.5 + i) * 0.05;
        }
        if (auraRing) {
          auraRing.rotation.z += 0.008;
          // Pulse selected or hovered
          const isSelected = selectedDepartment?.id === dept.id;
          const isHovered = hoveredDept?.id === dept.id;
          if (isSelected || isHovered) {
            auraRing.scale.setScalar(1.2 + Math.sin(elapsed * 4) * 0.1);
          } else {
            auraRing.scale.setScalar(1.0);
          }
        }
      });

      // Raycasting check
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(deptMeshes, true);

      if (intersects.length > 0) {
        let root = intersects[0].object;
        while (root.parent && !root.userData?.dept) {
          root = root.parent;
        }
        if (root.userData?.dept) {
          if (currentHoveredGroup !== root) {
            currentHoveredGroup = root;
            setHoveredDept(root.userData.dept);
            container.style.cursor = 'pointer';
          }
        }
      } else {
        if (currentHoveredGroup) {
          currentHoveredGroup = null;
          setHoveredDept(null);
          container.style.cursor = 'default';
        }
      }

      // Smooth camera subtle parallax
      camera.position.x += (mouse.x * 0.8 - camera.position.x) * 0.03;
      camera.position.y += ((mouse.y * 0.5 + 5.2) - camera.position.y) * 0.03;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    animate();

    // 8. Handle Resize
    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth;
      height = container.clientHeight;
      if (width === 0 || height === 0) return;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      container.removeEventListener('mousemove', onPointerMove);
      container.removeEventListener('click', onClick);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      scene.clear();
    };
  }, [departments, selectedDepartment]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-[480px] sm:h-[540px] rounded-2xl overflow-hidden bg-gradient-to-b from-[#070D19]/90 to-[#02060E]/95 border border-royal-600/25 shadow-2xl ${className}`}
    >
      {/* 3D Map Header Overlay */}
      <div className="absolute top-4 left-5 z-10 pointer-events-none">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-royal-400 animate-ping" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-white">
            INSTITUTIONAL COMMAND MAP
          </h2>
        </div>
        <p className="text-[11px] text-slate-400 mt-0.5">
          Interactive 3D Digital Twin • Hover for telemetry • Click node to open department dossier
        </p>
      </div>

      {/* 3D Controls hint badge */}
      <div className="absolute top-4 right-5 z-10 pointer-events-none hidden sm:flex items-center gap-3 text-[11px] font-mono text-royal-300 bg-royal-950/60 border border-royal-600/30 px-3 py-1 rounded-xl">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        <span>Live WebGL 3D Network</span>
      </div>

      {/* Floating Hover Telemetry HUD */}
      {hoveredDept && (
        <div
          className="absolute z-20 pointer-events-none transform -translate-x-1/2 -translate-y-full mb-3"
          style={{
            left: Math.max(140, Math.min(mousePos.x, (containerRef.current?.clientWidth || 800) - 140)),
            top: Math.max(120, mousePos.y)
          }}
        >
          <div className="p-3.5 rounded-xl bg-[#070D19]/95 backdrop-blur-2xl border border-royal-500/50 shadow-2xl shadow-black/80 text-xs w-64 animate-in fade-in zoom-in-95 duration-100">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10">
              <span className="font-bold text-white tracking-wide">{hoveredDept.code}</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-royal-600/30 text-royal-200 font-mono">
                Click to inspect
              </span>
            </div>
            <p className="text-slate-300 font-medium text-[11px] mb-2">{hoveredDept.name}</p>

            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div>
                <span className="text-slate-400 block">Enrolled Students:</span>
                <span className="text-white font-bold">{hoveredDept.studentCount}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Faculty Staff:</span>
                <span className="text-white font-bold">{hoveredDept.facultyCount}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Avg Attendance:</span>
                <span className="text-emerald-400 font-bold">{hoveredDept.avgAttendance}%</span>
              </div>
              <div>
                <span className="text-slate-400 block">Avg Performance:</span>
                <span className="text-royal-300 font-bold">{hoveredDept.avgPerformance}%</span>
              </div>
            </div>

            <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between text-[11px]">
              <span className="text-slate-400">At-Risk Cohort:</span>
              <span className="text-rose-400 font-bold">{hoveredDept.atRiskCount} Students</span>
            </div>
          </div>
        </div>
      )}

      {/* Subtle Bottom Status Bar */}
      <div className="absolute bottom-3 left-5 right-5 z-10 pointer-events-none flex items-center justify-between text-[11px] text-slate-500 font-mono border-t border-white/5 pt-2">
        <span>Topology: 8 Department Nodes // Central Core Active</span>
        <span>Click node to highlight & examine</span>
      </div>
    </div>
  );
}

