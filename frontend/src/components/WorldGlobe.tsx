
import { getFresnelMat } from '@/utils/getFresnelMat';
import getStarfield from '@/utils/getStarfield';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const WorldGlobe = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [loadedTextureCount, setLoadedTextureCount] = useState(0);
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  const totalTextures = 3; // Earth, bump, and clouds textures

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, containerRef.current.clientWidth / containerRef.current.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance"
    });

    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);

    // Load manager to track texture loading
    const loadManager = new THREE.LoadingManager();
    loadManager.onLoad = () => {
      setIsLoading(false);
    };
    loadManager.onProgress = (url, itemsLoaded, itemsTotal) => {
      setLoadedTextureCount(itemsLoaded);
    };

    // Add starfield
    const starfield = getStarfield({ numStars: 2000 });
    scene.add(starfield);

    // Create globe
    const globeRadius = 5;
    const geometry = new THREE.SphereGeometry(globeRadius, 64, 64);

    // Load Earth textures
    const textureLoader = new THREE.TextureLoader(loadManager);

    // High-quality Earth texture with visible countries and oceans
    const earthTexture = textureLoader.load('https://raw.githubusercontent.com/turban/webgl-earth/master/images/2_no_clouds_4k.jpg');

    // Bump map for terrain depth
    const bumpMap = textureLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_bumpmap.jpg');

    // Specular map for water reflection
    const specularMap = textureLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_specular_2048.jpg');

    // Earth material with realistic textures
    const material = new THREE.MeshPhongMaterial({
      map: earthTexture,
      bumpMap: bumpMap,
      bumpScale: 0.05,
      specularMap: specularMap,
      specular: new THREE.Color(0x333333),
      shininess: 15,
    });

    // Create Earth globe
    const globe = new THREE.Mesh(geometry, material);
    globe.userData = { type: 'globe' };
    scene.add(globe);

    // Add fresnel effect for atmosphere glow
    const fresenelMat = getFresnelMat({
      rimHex: 0x0099ff,
      facingHex: 0x000000
    });
    const atmosphereGeo = new THREE.SphereGeometry(globeRadius * 1.08, 64, 64);
    const atmosphere = new THREE.Mesh(atmosphereGeo, fresenelMat);
    scene.add(atmosphere);

    // Define clickable countries with their geographic bounds
    const countries = [
      {
        name: 'India',
        center: { lat: 20.5937, lng: 78.9629 },
        bounds: { latMin: 8, latMax: 35, lngMin: 68, lngMax: 97 },
        color: 0xff6600,
        flag: '🇮🇳'
      },
      {
        name: 'China',
        center: { lat: 35.8617, lng: 104.1954 },
        bounds: { latMin: 18, latMax: 54, lngMin: 73, lngMax: 135 },
        color: 0xff0000,
        flag: '🇨🇳'
      },
      {
        name: 'United States',
        center: { lat: 37.0902, lng: -95.7129 },
        bounds: { latMin: 25, latMax: 49, lngMin: -125, lngMax: -66 },
        color: 0x0033ff,
        flag: '🇺🇸'
      },
      {
        name: 'Brazil',
        center: { lat: -14.2350, lng: -51.9253 },
        bounds: { latMin: -34, latMax: 5, lngMin: -74, lngMax: -34 },
        color: 0x00ff00,
        flag: '🇧🇷'
      },
      {
        name: 'Australia',
        center: { lat: -25.2744, lng: 133.7751 },
        bounds: { latMin: -44, latMax: -10, lngMin: 113, lngMax: 154 },
        color: 0xffff00,
        flag: '🇦🇺'
      },
      {
        name: 'Russia',
        center: { lat: 61.5240, lng: 105.3188 },
        bounds: { latMin: 41, latMax: 82, lngMin: 19, lngMax: 180 },
        color: 0xff00ff,
        flag: '🇷🇺'
      },
      {
        name: 'Japan',
        center: { lat: 36.2048, lng: 138.2529 },
        bounds: { latMin: 24, latMax: 46, lngMin: 123, lngMax: 146 },
        color: 0xff3366,
        flag: '🇯🇵'
      },
      {
        name: 'United Kingdom',
        center: { lat: 55.3781, lng: -3.4360 },
        bounds: { latMin: 49, latMax: 61, lngMin: -8, lngMax: 2 },
        color: 0x0066ff,
        flag: '🇬🇧'
      },
      {
        name: 'France',
        center: { lat: 46.2276, lng: 2.2137 },
        bounds: { latMin: 41, latMax: 51, lngMin: -5, lngMax: 10 },
        color: 0x0033cc,
        flag: '🇫🇷'
      },
      {
        name: 'Egypt',
        center: { lat: 26.8206, lng: 30.8025 },
        bounds: { latMin: 22, latMax: 32, lngMin: 25, lngMax: 37 },
        color: 0xffaa00,
        flag: '🇪🇬'
      }
    ];

    // Function to check if a point is within country bounds
    const getCountryFromCoordinates = (lat: number, lng: number) => {
      for (const country of countries) {
        if (lat >= country.bounds.latMin && lat <= country.bounds.latMax &&
          lng >= country.bounds.lngMin && lng <= country.bounds.lngMax) {
          return country;
        }
      }
      return null;
    };

    // Create visual markers for countries
    const countryMarkers: any[] = [];
    countries.forEach(country => {
      const phi = (90 - country.center.lat) * Math.PI / 180;
      const theta = (country.center.lng + 180) * Math.PI / 180;

      const x = -globeRadius * Math.sin(phi) * Math.cos(theta) * 1.02;
      const y = globeRadius * Math.cos(phi) * 1.02;
      const z = globeRadius * Math.sin(phi) * Math.sin(theta) * 1.02;

      // Create marker
      const markerGeometry = new THREE.SphereGeometry(0.15, 16, 16);
      const markerMaterial = new THREE.MeshBasicMaterial({
        color: country.color,
        transparent: true,
        opacity: 0.8
      });
      const marker = new THREE.Mesh(markerGeometry, markerMaterial);
      marker.position.set(x, y, z);

      // Create pulse effect
      const pulseGeometry = new THREE.SphereGeometry(0.2, 16, 16);
      const pulseMaterial = new THREE.MeshBasicMaterial({
        color: country.color,
        transparent: true,
        opacity: 0.4
      });
      const pulse = new THREE.Mesh(pulseGeometry, pulseMaterial);
      pulse.position.set(x, y, z);

      scene.add(marker);
      scene.add(pulse);

      countryMarkers.push({ marker, pulse, country });
    });

    // Focus on India region
    const indiaPosition = {
      lat: 20.5937,
      lng: 78.9629
    };

    // Position camera for India view
    const focusOnIndia = () => {
      const targetPhi = (90 - indiaPosition.lat) * Math.PI / 180;
      const targetTheta = (indiaPosition.lng + 180) * Math.PI / 180;

      const targetX = -15 * Math.sin(targetPhi) * Math.cos(targetTheta);
      const targetY = 15 * Math.cos(targetPhi) * 0.5; // Offset to show more of the region
      const targetZ = 15 * Math.sin(targetPhi) * Math.sin(targetTheta);

      camera.position.set(targetX, targetY, targetZ);
      camera.lookAt(0, 0, 0);
      controls.update();
    };

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 1);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 1.5);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);

    // Sunlight effect
    const sunLight = new THREE.DirectionalLight(0xffffff, 1);
    sunLight.position.set(-15, 10, 15);
    scene.add(sunLight);

    // Camera position
    camera.position.z = 15;

    // Add orbit controls for interactivity
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.rotateSpeed = 0.5;
    controls.enableZoom = true;
    controls.minDistance = 6.5;
    controls.maxDistance = 20;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.5;

    // Focus on India after a short delay
    setTimeout(() => {
      focusOnIndia();
      controls.autoRotate = false; // Stop auto-rotation when focused
    }, 500);

    // Raycaster for click detection
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    // Handle mouse move for hover effect
    const onMouseMove = (event: MouseEvent) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObject(globe);

      if (intersects.length > 0) {
        const intersect = intersects[0];
        const point = intersect.point;

        // Convert 3D point to lat/lng
        const lat = 90 - (Math.acos(point.y / globeRadius)) * 180 / Math.PI;
        const lng = ((270 + (Math.atan2(point.x, point.z)) * 180 / Math.PI) % 360) - 180;

        // Check if we're over a country
        const country = getCountryFromCoordinates(lat, lng);

        if (country) {
          setHoveredCountry(`${country.flag} ${country.name}`);
          document.body.style.cursor = 'pointer';
        } else {
          setHoveredCountry(null);
          document.body.style.cursor = 'default';
        }
      } else {
        setHoveredCountry(null);
        document.body.style.cursor = 'default';
      }
    };

    // Handle click
    const onClick = (event: MouseEvent) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObject(globe);

      if (intersects.length > 0) {
        const intersect = intersects[0];
        const point = intersect.point;

        // Convert 3D point to lat/lng
        const lat = 90 - (Math.acos(point.y / globeRadius)) * 180 / Math.PI;
        const lng = ((270 + (Math.atan2(point.x, point.z)) * 180 / Math.PI) % 360) - 180;

        // Check if we clicked on a country
        const country = getCountryFromCoordinates(lat, lng);

        if (country) {
          console.log(`Clicked on ${country.name} at lat: ${lat.toFixed(2)}, lng: ${lng.toFixed(2)}`);

          // Navigate to exploration page
          navigate(`/exploration?country=${country.name.toLowerCase().replace(/\s+/g, '-')}`);
        }
      }
    };

    // Add event listeners
    renderer.domElement.addEventListener('mousemove', onMouseMove);
    renderer.domElement.addEventListener('click', onClick);

    // Animation
    let rotation = 0;
    const animate = () => {
      requestAnimationFrame(animate);

      // Auto-rotation when not interacting
      rotation += 0.001;

      // Update starfield rotation
      starfield.rotation.y = rotation * 0.2;

      // Pulse country markers
      countryMarkers.forEach(({ pulse }) => {
        pulse.scale.setScalar(1 + 0.2 * Math.sin(Date.now() * 0.002));
      });

      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current) return;
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('mousemove', onMouseMove);
      renderer.domElement.removeEventListener('click', onClick);
      document.body.style.cursor = 'default';
      if (containerRef.current?.contains(renderer.domElement)) {
        containerRef.current.removeChild(renderer.domElement);
      }
      scene.clear();
      controls.dispose();
    };
  }, [navigate]);

  return (
    <div ref={containerRef} className="w-full h-full relative">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 border-4 border-t-teal-500 border-teal-200 rounded-full animate-spin"></div>
            <p className="mt-4 text-teal-500 font-semibold">
              Loading 3D Globe... {Math.round((loadedTextureCount / totalTextures) * 100)}%
            </p>
          </div>
        </div>
      )}

      {/* Hover tooltip */}
      {hoveredCountry && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black/80 text-white px-6 py-3 rounded-lg shadow-lg z-20 pointer-events-none">
          <p className="text-lg font-semibold">🇮🇳 {hoveredCountry}</p>
          <p className="text-sm text-gray-300">Click to explore</p>
        </div>
      )}

      {/* Instructions */}
      {!isLoading && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/60 text-white px-4 py-2 rounded-lg text-sm z-20 pointer-events-none">
          <p>🌍 Click on any country to explore its culture</p>
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background pointer-events-none" />
    </div>
  );
};

export default WorldGlobe;
