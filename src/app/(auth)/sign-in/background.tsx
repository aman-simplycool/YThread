import { useEffect } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three-stdlib";
import './style.css';

const RocketScene = () => {
  useEffect(() => {
    let scene: THREE.Scene, camera: THREE.PerspectiveCamera, fieldOfView, aspectRatio, nearPlane, farPlane, renderer: THREE.WebGLRenderer, container: HTMLElement | null, rocket: THREE.Object3D<THREE.Object3DEventMap>;
    let HEIGHT = window.innerHeight;
    let WIDTH = window.innerWidth;

    const createScene = () => {
      scene = new THREE.Scene();
      scene.fog = new THREE.Fog(0x5d0361, 10, 1500);

      aspectRatio = WIDTH / HEIGHT;
      fieldOfView = 60;
      nearPlane = 1;
      farPlane = 10000;
      camera = new THREE.PerspectiveCamera(fieldOfView, aspectRatio, nearPlane, farPlane);

      camera.position.x = 0;
      camera.position.z = 500;
      camera.position.y = -10;

      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setSize(WIDTH, HEIGHT);
      renderer.shadowMap.enabled = true;

      container = document.getElementById("canvas");
      container?.appendChild(renderer.domElement);

      window.addEventListener("resize", handleWindowResize, false);

      const loader = new GLTFLoader();
      loader.load("/rocket.gltf", (gltf) => {
        rocket = gltf.scene;
        rocket.position.y = 50;
        scene.add(rocket);
      });
    };

    const handleWindowResize = () => {
      HEIGHT = window.innerHeight;
      WIDTH = window.innerWidth;
      renderer.setSize(WIDTH, HEIGHT);
      camera.aspect = WIDTH / HEIGHT;
      camera.updateProjectionMatrix();
    };

    const createLights = () => {
      const ambientLight = new THREE.HemisphereLight(0x404040, 0x404040, 1);
      const directionalLight = new THREE.DirectionalLight(0xdfebff, 1);
      directionalLight.position.set(-300, 0, 600);

      const pointLight = new THREE.PointLight(0xa11148, 2, 1000, 2);
      pointLight.position.set(200, -100, 50);

      scene.add(ambientLight, directionalLight, pointLight);
    };

    const loop = () => {
      const animationDuration = 2000;
      const targetRocketPosition = 40;
      const t = (Date.now() % animationDuration) / animationDuration;

      renderer.render(scene, camera);

      const delta = targetRocketPosition * Math.sin(Math.PI * 2 * t);
      if (rocket) {
        rocket.rotation.y += 0.1;
        rocket.position.y = delta;
      }

      requestAnimationFrame(loop);
    };

    const main = () => {
      createScene();
      createLights();
      renderer.render(scene, camera);
      loop();
    };

    main();
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="fire-wrapper">
        <img className="fire" src="/fire.svg" alt="fire"/>
      </div>
      <div className="rain rain1"></div>
      <div className="rain rain2"></div>
      <div className="rain rain3"></div>
      <div className="rain rain4"></div>
      <div className="rain rain5"></div>
      <div id="canvas" className="absolute inset-0" />;
    </div>
  )
};

export default RocketScene;
