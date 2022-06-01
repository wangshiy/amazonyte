import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import {
  Environment,
  OrbitControls,
  Html,
  useGLTF,
  useProgress,
} from "@react-three/drei";
import { Progress } from "@arco-design/web-react";

const remoteGlbUrl = "https://thinkuldeep.com/modelviewer/Astronaut.glb";

const Model = () => {
  const gltf = useGLTF(remoteGlbUrl);
  return <primitive object={gltf.scene} />;
};

const Loading = () => {
  const { progress } = useProgress();
  return (
    <Html center>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <Progress percent={progress} />
      </div>
    </Html>
  );
};

const GLTF = () => {
  return (
    <Canvas>
      <Suspense fallback={<Loading />}>
        <Model />
        <ambientLight />
        <OrbitControls />
        <Environment preset="sunset" background />
      </Suspense>
    </Canvas>
  );
};

export default GLTF;
