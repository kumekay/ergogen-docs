import React, {useEffect, useRef, useState} from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';

// Interactive STL preview (drag to orbit, scroll to zoom). three.js is
// imported dynamically on the client, so SSR never touches WebGL.
export default function StlViewer({model, height = 360}) {
  const mountRef = useRef(null);
  const url = useBaseUrl(model);
  const [error, setError] = useState(null);

  useEffect(() => {
    let disposed = false;
    let cleanup = () => {};
    (async () => {
      try {
        const three = await import('three');
        const {STLLoader} = await import('three/examples/jsm/loaders/STLLoader.js');
        const {OrbitControls} = await import('three/examples/jsm/controls/OrbitControls.js');
        const geometry = await new STLLoader().loadAsync(url);
        if (disposed || !mountRef.current) return;

        geometry.computeVertexNormals();
        geometry.center();
        geometry.computeBoundingSphere();
        const radius = geometry.boundingSphere.radius;

        // the viewer often mounts hidden (collapsed <details>, inactive tab),
        // where clientWidth is 0 -- a ResizeObserver below picks up the real
        // size once it becomes visible
        const width = mountRef.current.clientWidth || 600;
        const scene = new three.Scene();
        scene.background = new three.Color(0xffffff);

        const camera = new three.PerspectiveCamera(40, width / height, radius / 100, radius * 20);
        camera.position.set(radius * 1.4, -radius * 1.8, radius * 1.6);
        camera.up.set(0, 0, 1);

        scene.add(new three.HemisphereLight(0xffffff, 0x777788, 1.6));
        const dir = new three.DirectionalLight(0xffffff, 1.2);
        dir.position.set(1, -1.5, 2);
        scene.add(dir);

        const mesh = new three.Mesh(
          geometry,
          new three.MeshStandardMaterial({color: 0xb9bdc4, metalness: 0.1, roughness: 0.75}),
        );
        scene.add(mesh);

        const renderer = new three.WebGLRenderer({antialias: true});
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(width, height);
        mountRef.current.appendChild(renderer.domElement);

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;

        let frame;
        const animate = () => {
          frame = requestAnimationFrame(animate);
          controls.update();
          renderer.render(scene, camera);
        };
        animate();

        const onResize = () => {
          if (!mountRef.current) return;
          const w = mountRef.current.clientWidth;
          if (!w) return;
          camera.aspect = w / height;
          camera.updateProjectionMatrix();
          renderer.setSize(w, height);
        };
        const observer = new ResizeObserver(onResize);
        observer.observe(mountRef.current);

        cleanup = () => {
          cancelAnimationFrame(frame);
          observer.disconnect();
          controls.dispose();
          renderer.dispose();
          geometry.dispose();
          renderer.domElement.remove();
        };
      } catch (e) {
        if (!disposed) setError(String(e));
      }
    })();
    return () => {
      disposed = true;
      cleanup();
    };
  }, [url, height]);

  if (error) {
    return <p>Could not load 3D preview: {error}</p>;
  }
  return (
    <div
      ref={mountRef}
      style={{borderRadius: '8px', overflow: 'hidden', background: '#ffffff', minHeight: height}}
      title="Drag to orbit, scroll to zoom"
    />
  );
}
