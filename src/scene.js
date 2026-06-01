import * as THREE from 'three';

const projectTargets = {
  '01': { hue: 0.52, z: 0 },
  '02': { hue: 0.03, z: 1.2 },
  '03': { hue: 0.28, z: -1.3 },
};

export function createScene(canvas) {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance',
  });
  renderer.setClearColor(0x050505, 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.35));

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x07090d, 0.05);

  const camera = new THREE.PerspectiveCamera(48, window.innerWidth / window.innerHeight, 0.1, 120);
  camera.position.set(0, 0.9, 11);

  const pointer = new THREE.Vector2(0.5, 0.5);
  const scroll = { value: 0 };
  const focus = { hue: 0.52, z: 0 };
  let paused = false;
  let quality = 'high';
  let frame = 0;
  let animationFrame = 0;

  const ambient = new THREE.AmbientLight(0x7acfff, 0.36);
  scene.add(ambient);

  const keyLight = new THREE.PointLight(0x8ff5ff, 70, 24);
  keyLight.position.set(-5, 4, 8);
  scene.add(keyLight);

  const coralLight = new THREE.PointLight(0xff765f, 45, 18);
  coralLight.position.set(6, -2, 5);
  scene.add(coralLight);

  const logo = makeLogoCore();
  const { core, logoMaterials, logoGeometries, glints } = logo;
  scene.add(core);

  const orbitSystem = makeOrbitSystem();
  scene.add(orbitSystem.group);

  const particles = makeParticles();
  scene.add(particles.points);

  const resize = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  };
  window.addEventListener('resize', resize);
  resize();

  const clock = new THREE.Clock();

  function animate() {
    animationFrame = requestAnimationFrame(animate);
    if (paused) return;

    const elapsed = clock.getElapsedTime();
    frame += 1;

    if (quality === 'low' && frame % 2 === 0) return;

    const px = (pointer.x - 0.5) * 2;
    const py = (pointer.y - 0.5) * 2;
    const pulse = Math.sin(elapsed * 1.3) * 0.08;
    const scrollOrbit = scroll.value * Math.PI * 2.2;

    core.rotation.x = Math.sin(elapsed * 0.42) * 0.08 + py * 0.12;
    core.rotation.y = Math.sin(elapsed * 0.34) * 0.12 + px * 0.18 + scrollOrbit * 0.07;
    core.rotation.z = Math.sin(elapsed * 0.24) * 0.04 + scroll.value * 0.18;
    core.position.z += (focus.z - core.position.z) * 0.035;
    const logoScale = 1.02 + pulse * 0.38 + scroll.value * 0.08;
    core.scale.set(logoScale, logoScale, logoScale);
    glints.forEach((glint, index) => {
      glint.material.opacity = 0.12 + Math.sin(elapsed * 1.7 + index * 0.8 + px) * 0.045;
      glint.position.x = glint.userData.baseX + Math.sin(elapsed * 0.8 + index) * 0.18 + px * 0.08;
      glint.rotation.z = glint.userData.baseRotation + Math.sin(elapsed * 0.45 + index) * 0.08;
    });

    updateOrbitSystem(orbitSystem, elapsed, px, py, scroll.value, focus.hue);

    if (particles.points.visible) {
      particles.material.color.setHSL(focus.hue, 0.75, 0.63);
      particles.points.rotation.y = elapsed * 0.025 + scroll.value * 0.95;
      particles.points.rotation.x = py * 0.09;
    }

    camera.position.x += (px * 1.25 - camera.position.x) * 0.045;
    camera.position.y += (0.9 - py * 0.72 - camera.position.y) * 0.045;
    camera.position.z += (10.8 - scroll.value * 2.2 - camera.position.z) * 0.035;
    camera.lookAt(0, 0, 0);

    keyLight.position.x = -5 + px * 2.5;
    coralLight.position.y = -2 + py * 2;

    renderer.render(scene, camera);
  }

  animate();

  return {
    setScroll(value) {
      scroll.value += (Math.max(0, Math.min(1, value)) - scroll.value) * 0.6;
    },
    setPointer(x, y) {
      pointer.set(x, y);
    },
    setQuality(value) {
      quality = value;
      renderer.setPixelRatio(value === 'high' ? Math.min(window.devicePixelRatio, 1.35) : 1);
      particles.points.visible = value === 'high';
    },
    setPaused(value) {
      paused = value;
      if (!paused) clock.start();
    },
    focusProject(id) {
      const target = projectTargets[id] || projectTargets['01'];
      focus.hue = target.hue;
      focus.z = target.z;
    },
    setArchiveFocus(value) {
      orbitSystem.activeKeys = new Set(
        [value?.label, value?.alias, value?.remixAlias, value?.releaseArtist, value?.releaseTitle, value?.remixArtist]
          .filter(Boolean),
      );
    },
    destroy() {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener('resize', resize);
      logoGeometries.forEach((geometry) => geometry.dispose());
      logoMaterials.all.forEach((material) => {
        if (material.map) material.map.dispose();
        material.dispose();
      });
      orbitSystem.geometries.forEach((geometry) => geometry.dispose());
      orbitSystem.materials.forEach((material) => {
        if (material.map) material.map.dispose();
        material.dispose();
      });
      particles.geometry.dispose();
      particles.material.dispose();
      renderer.dispose();
    },
  };
}

function makeOrbitSystem() {
  const group = new THREE.Group();
  group.position.set(1.46, -0.06, -0.72);
  group.rotation.set(-0.12, -0.08, -0.06);

  const materials = [];
  const geometries = [];
  const rings = [];
  const nodes = [];
  const sparks = [];
  const releaseThreads = [];

  const loader = new THREE.TextureLoader();
  const glowTexture = makeGlowTexture();
  const discTexture = loader.load('/orbit-disc-node.png');
  discTexture.colorSpace = THREE.SRGBColorSpace;
  discTexture.anisotropy = 8;

  const orbits = [
    {
      name: 'Higher State Records',
      keys: ['Higher State Records', 'Higher State', 'Higher State Era', 'Groovoid', 'Sound Environment', 'Disco Biscuit', 'Spacebase', 'Upstate'],
      radius: 3.0,
      yScale: 0.48,
      hue: 0.52,
      phase: 0.1,
      nodes: [
        ['Groovoid', 0.08],
        ['Sound Environment', 0.22],
        ['Disco Biscuit', 0.38],
        ['Spacebase', 0.57],
        ['Upstate', 0.76],
      ],
    },
    {
      name: '99 North',
      keys: ['99 North', '99 North Era', '99 Allstars', 'Ninety Nine Allstars', 'DPD', 'Illicit', 'MURK', 'FPI Project'],
      radius: 3.48,
      yScale: 0.56,
      hue: 0.49,
      phase: 0.75,
      nodes: [
        ['99 Allstars', 0.13],
        ['DPD', 0.31],
        ['Ninety Nine Allstars', 0.49],
        ['MURK', 0.68],
        ['Illicit', 0.83],
      ],
    },
    {
      name: '99 Degrees',
      keys: ['99 Degrees', 'T-Total', 'Tallulah', 'Sweet Peach', 'Bounce', 'Orienta Rhythm'],
      radius: 3.94,
      yScale: 0.43,
      hue: 0.56,
      phase: 1.6,
      nodes: [
        ['T-Total', 0.18],
        ['Sweet Peach', 0.35],
        ['Tallulah', 0.55],
        ['Bounce', 0.72],
        ['Orienta Rhythm', 0.9],
      ],
    },
    {
      name: 'Higher State Imports',
      keys: ['Higher State Imports', 'Miss Stuck-Up', 'Johnny X', 'Cluedo'],
      radius: 4.38,
      yScale: 0.5,
      hue: 0.53,
      phase: 2.25,
      nodes: [
        ['Cluedo', 0.1],
        ['Miss Stuck-Up', 0.46],
        ['Johnny X', 0.78],
      ],
    },
    {
      name: 'Illicit',
      keys: ['Illicit', 'Illicit Era', 'Kylie Minogue', 'Cher', 'Alcazar', 'Usher', 'Mary J. Blige', 'Girls Aloud'],
      radius: 4.82,
      yScale: 0.62,
      hue: 0.47,
      phase: 3.05,
      nodes: [
        ['Madison Avenue', 0.06],
        ['Kylie Minogue', 0.2],
        ['Cher', 0.36],
        ['Alcazar', 0.52],
        ['Usher', 0.7],
        ['Girls Aloud', 0.88],
      ],
    },
  ];

  orbits.forEach((orbit, orbitIndex) => {
    const ringMaterial = new THREE.LineBasicMaterial({
      color: new THREE.Color().setHSL(orbit.hue, 0.86, 0.68),
      transparent: true,
      opacity: 0.18,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    materials.push(ringMaterial);

    const shadowMaterial = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.045,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    materials.push(shadowMaterial);

    const geometry = makeGrooveGeometry(orbit.radius, orbit.yScale, orbit.phase, orbitIndex);
    const innerGeometry = makeGrooveGeometry(orbit.radius - 0.08, orbit.yScale * 0.985, orbit.phase + 0.45, orbitIndex + 7);
    geometries.push(geometry, innerGeometry);

    const ring = new THREE.LineLoop(geometry, ringMaterial);
    ring.userData = { ...orbit, orbitIndex, baseOpacity: 0.14 + orbitIndex * 0.02 };
    group.add(ring);

    const ringGhost = new THREE.LineLoop(innerGeometry, shadowMaterial);
    ringGhost.userData = { ...orbit, orbitIndex, isGhost: true, baseOpacity: 0.035 };
    group.add(ringGhost);
    rings.push(ring, ringGhost);

    orbit.nodes.forEach(([key, progress], nodeIndex) => {
      const material = new THREE.SpriteMaterial({
        map: discTexture,
        color: 0xffffff,
        transparent: true,
        opacity: 0.72,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      materials.push(material);

      const node = new THREE.Sprite(material);
      node.userData = {
        key,
        keys: [key, ...orbit.keys],
        nodeKeys: [key],
        radius: orbit.radius,
        yScale: orbit.yScale,
        progress,
        phase: orbit.phase,
        orbitIndex,
        nodeIndex,
      };
      positionOnOrbit(node, node.userData, 0);
      node.scale.set(0.24, 0.24, 0.24);
      group.add(node);
      nodes.push(node);

      const sparkMaterial = new THREE.SpriteMaterial({
        map: glowTexture,
        color: new THREE.Color().setHSL(orbit.hue, 0.95, 0.68),
        transparent: true,
        opacity: 0.24,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      materials.push(sparkMaterial);

      const spark = new THREE.Sprite(sparkMaterial);
      spark.userData = node.userData;
      spark.scale.set(0.22, 0.22, 0.22);
      spark.position.copy(node.position);
      group.add(spark);
      sparks.push(spark);
    });
  });

  for (let index = 0; index < 34; index += 1) {
    const radius = 2.72 + index * 0.07;
    const material = new THREE.LineBasicMaterial({
      color: new THREE.Color().setHSL(0.52 + (index % 5) * 0.006, 0.72, 0.64),
      transparent: true,
      opacity: 0.018 + (index % 4) * 0.006,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    materials.push(material);
    const geometry = makeGrooveGeometry(radius, 0.52, index * 0.17, index + 20, 150);
    geometries.push(geometry);
    const thread = new THREE.LineLoop(geometry, material);
    thread.userData = { baseOpacity: material.opacity, index };
    group.add(thread);
    releaseThreads.push(thread);
  }

  return {
    group,
    rings,
    nodes,
    sparks,
    releaseThreads,
    geometries,
    materials,
    textures: [discTexture],
    activeKeys: new Set(['Higher State Records', 'Higher State']),
  };
}

function makeGrooveGeometry(radius, yScale, phase, seed, segments = 240) {
  const positions = new Float32Array(segments * 3);
  const random = seededRandom(320 + seed * 97);

  for (let index = 0; index < segments; index += 1) {
    const t = index / segments;
    const angle = t * Math.PI * 2;
    const warp =
      Math.sin(angle * 3 + phase) * 0.018 +
      Math.sin(angle * 7.5 + phase * 0.7) * 0.012 +
      (random() - 0.5) * 0.006;
    const currentRadius = radius + warp;
    positions[index * 3] = Math.cos(angle) * currentRadius;
    positions[index * 3 + 1] = Math.sin(angle) * currentRadius * yScale;
    positions[index * 3 + 2] = Math.sin(angle * 2 + phase) * 0.08 + Math.cos(angle * 5 + phase) * 0.022;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  return geometry;
}

function updateOrbitSystem(orbitSystem, elapsed, px, py, scrollValue, focusHue) {
  orbitSystem.group.rotation.x = -0.16 + py * 0.16 + scrollValue * 0.36;
  orbitSystem.group.rotation.y = -0.08 + px * 0.22 + Math.sin(elapsed * 0.16) * 0.04;
  orbitSystem.group.rotation.z = -0.06 + scrollValue * 0.72 + Math.sin(elapsed * 0.12) * 0.018;
  orbitSystem.group.position.z = -0.72 + Math.sin(elapsed * 0.26) * 0.08;

  orbitSystem.rings.forEach((ring) => {
    const isActive = ring.userData.keys?.some((key) => orbitSystem.activeKeys.has(key));
    const shimmer = Math.sin(elapsed * 1.25 + ring.userData.phase) * 0.03;
    ring.rotation.z = elapsed * (ring.userData.isGhost ? -0.018 : 0.026) + ring.userData.orbitIndex * 0.08;
    ring.material.opacity = isActive
      ? 0.38 + shimmer
      : ring.userData.baseOpacity + shimmer * 0.35;
    ring.material.color.setHSL(isActive ? focusHue + 0.015 : ring.userData.hue, isActive ? 0.95 : 0.76, isActive ? 0.74 : 0.62);
  });

  orbitSystem.releaseThreads.forEach((thread) => {
    thread.rotation.z = -elapsed * (0.008 + thread.userData.index * 0.0004);
    thread.material.opacity = thread.userData.baseOpacity + Math.sin(elapsed * 0.8 + thread.userData.index) * 0.004;
  });

  orbitSystem.nodes.forEach((node, index) => {
    const isActive = node.userData.nodeKeys.some((key) => orbitSystem.activeKeys.has(key));
    const isOrbitActive = node.userData.keys.some((key) => orbitSystem.activeKeys.has(key));
    const orbitTime = elapsed * (0.018 + node.userData.orbitIndex * 0.002) + scrollValue * 0.38;
    positionOnOrbit(node, node.userData, orbitTime);
    const beat = 1 + Math.max(0, Math.sin(elapsed * 2.7 + index)) * (isActive ? 0.72 : 0.22);
    const nodeScale = (isActive ? 0.42 : isOrbitActive ? 0.31 : 0.23) * beat;
    node.scale.set(nodeScale, nodeScale, nodeScale);
    node.material.opacity = isActive ? 1 : isOrbitActive ? 0.72 : 0.42;
    node.material.color.setHSL(isActive ? focusHue + 0.02 : 0.52, isActive ? 0.22 : 0.12, isActive ? 0.96 : isOrbitActive ? 0.84 : 0.72);

    const spark = orbitSystem.sparks[index];
    spark.position.copy(node.position);
    spark.scale.setScalar(isActive ? 0.46 + Math.sin(elapsed * 2 + index) * 0.05 : isOrbitActive ? 0.28 : 0.16);
    spark.material.opacity = isActive ? 0.5 : isOrbitActive ? 0.22 : 0.08;
    spark.material.color.setHSL(isActive ? focusHue + 0.03 : 0.52, 0.95, isActive ? 0.7 : 0.56);
  });
}

function positionOnOrbit(object, data, offset) {
  const angle = (data.progress + offset) * Math.PI * 2 + data.phase;
  const radius = data.radius + Math.sin(angle * 4 + offset) * 0.035;
  object.position.set(
    Math.cos(angle) * radius,
    Math.sin(angle) * radius * data.yScale,
    Math.sin(angle * 2 + data.phase) * 0.13 + data.orbitIndex * 0.03,
  );
}

function makeGlowTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 96;
  canvas.height = 96;
  const context = canvas.getContext('2d');
  const gradient = context.createRadialGradient(48, 48, 0, 48, 48, 48);
  gradient.addColorStop(0, 'rgba(255,255,255,0.95)');
  gradient.addColorStop(0.24, 'rgba(170,248,255,0.55)');
  gradient.addColorStop(0.58, 'rgba(55,205,230,0.14)');
  gradient.addColorStop(1, 'rgba(0,0,0,0)');
  context.fillStyle = gradient;
  context.fillRect(0, 0, canvas.width, canvas.height);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function makeLogoCore() {
  const loader = new THREE.TextureLoader();
  const higherStateTexture = loadLogoTexture(loader, '/higher-state-records.png');
  const northTexture = loadLogoTexture(loader, '/99-north.png');
  const degreesTexture = loadLogoTexture(loader, '/99-degrees.png');

  const core = new THREE.Group();
  core.position.set(1.48, 0, 0);

  const northLogo = makeLogoPlane(northTexture, 2.96, 1.85);
  northLogo.mesh.position.set(0, 1.92, -0.03);
  core.add(northLogo.mesh);
  const northGlint = makeSunGlint(2.22, 0.26, -0.12);
  northGlint.position.set(0.1, 2.23, 0.01);
  northGlint.userData.baseX = northGlint.position.x;
  northGlint.userData.baseRotation = northGlint.rotation.z;
  core.add(northGlint);

  const higherStateLogo = makeLogoPlane(higherStateTexture, 4.52, 2.64);
  higherStateLogo.mesh.position.set(0, -0.08, 0.03);
  core.add(higherStateLogo.mesh);
  const higherStateGlint = makeSunGlint(3.2, 0.34, -0.12);
  higherStateGlint.position.set(0.14, 0.36, 0.08);
  higherStateGlint.userData.baseX = higherStateGlint.position.x;
  higherStateGlint.userData.baseRotation = higherStateGlint.rotation.z;
  core.add(higherStateGlint);

  const degreesLogo = makeLogoPlane(degreesTexture, 3.0, 1.75);
  degreesLogo.mesh.position.set(0, -2.28, 0.01);
  core.add(degreesLogo.mesh);
  const degreesGlint = makeSunGlint(2.12, 0.24, -0.12);
  degreesGlint.position.set(0.12, -2.06, 0.06);
  degreesGlint.userData.baseX = degreesGlint.position.x;
  degreesGlint.userData.baseRotation = degreesGlint.rotation.z;
  core.add(degreesGlint);

  return {
    core,
    glints: [northGlint, higherStateGlint, degreesGlint],
    logoMaterials: {
      all: [
        northLogo.material,
        higherStateLogo.material,
        degreesLogo.material,
        northGlint.material,
        higherStateGlint.material,
        degreesGlint.material,
      ],
    },
    logoGeometries: [
      northLogo.geometry,
      higherStateLogo.geometry,
      degreesLogo.geometry,
      northGlint.geometry,
      higherStateGlint.geometry,
      degreesGlint.geometry,
    ],
  };
}

function loadLogoTexture(loader, path) {
  const texture = loader.load(path);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}

function makeLogoPlane(texture, width, height) {
  const radius = 0.11;
  const geometry = new THREE.PlaneGeometry(width, height, 18, 10);
  roundPlaneCorners(geometry, width, height, radius);

  const material = new THREE.MeshBasicMaterial({
    map: texture,
    color: 0xffffff,
    transparent: true,
  });

  return {
    geometry,
    material,
    mesh: new THREE.Mesh(geometry, material),
  };
}

function makeSunGlint(width, height, rotation) {
  const geometry = new THREE.PlaneGeometry(width, height, 1, 1);
  const texture = makeGlintTexture();
  const material = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    opacity: 0.14,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.rotation.z = rotation;
  return mesh;
}

function makeGlintTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 32;
  const context = canvas.getContext('2d');
  const gradient = context.createLinearGradient(0, 0, canvas.width, 0);
  gradient.addColorStop(0, 'rgba(255,255,255,0)');
  gradient.addColorStop(0.36, 'rgba(255,255,255,0.08)');
  gradient.addColorStop(0.5, 'rgba(255,255,255,0.72)');
  gradient.addColorStop(0.64, 'rgba(255,255,255,0.08)');
  gradient.addColorStop(1, 'rgba(255,255,255,0)');
  context.fillStyle = gradient;
  context.fillRect(0, 0, canvas.width, canvas.height);

  const verticalFade = context.createLinearGradient(0, 0, 0, canvas.height);
  verticalFade.addColorStop(0, 'rgba(0,0,0,0)');
  verticalFade.addColorStop(0.5, 'rgba(0,0,0,1)');
  verticalFade.addColorStop(1, 'rgba(0,0,0,0)');
  context.globalCompositeOperation = 'destination-in';
  context.fillStyle = verticalFade;
  context.fillRect(0, 0, canvas.width, canvas.height);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function roundPlaneCorners(geometry, width, height, radius) {
  const position = geometry.attributes.position;
  const halfWidth = width / 2;
  const halfHeight = height / 2;

  for (let index = 0; index < position.count; index += 1) {
    const x = position.getX(index);
    const y = position.getY(index);
    const clampedX = THREE.MathUtils.clamp(x, -halfWidth + radius, halfWidth - radius);
    const clampedY = THREE.MathUtils.clamp(y, -halfHeight + radius, halfHeight - radius);
    const dx = x - clampedX;
    const dy = y - clampedY;
    const distance = Math.hypot(dx, dy);

    if (distance > radius) {
      const ratio = radius / distance;
      position.setXY(index, clampedX + dx * ratio, clampedY + dy * ratio);
    }
  }

  position.needsUpdate = true;
  geometry.computeVertexNormals();
}

function makeParticles() {
  const count = 760;
  const positions = new Float32Array(count * 3);
  const random = seededRandom(12);

  for (let i = 0; i < count; i += 1) {
    const radius = 3.8 + random() * 12;
    const theta = random() * Math.PI * 2;
    const phi = Math.acos(2 * random() - 1);
    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta) * 0.55;
    positions[i * 3 + 2] = radius * Math.cos(phi);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const material = new THREE.PointsMaterial({
    size: 0.026,
    color: 0x9af6ff,
    transparent: true,
    opacity: 0.62,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  return { points: new THREE.Points(geometry, material), geometry, material };
}

function seededRandom(seed) {
  let value = seed;
  return () => {
    value = (value * 16807) % 2147483647;
    return (value - 1) / 2147483646;
  };
}
