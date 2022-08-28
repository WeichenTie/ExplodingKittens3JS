import { Canvas, extend, useFrame, useLoader} from '@react-three/fiber'
import { OrbitControls, Stats, RoundedBox, OrthographicCamera, shaderMaterial } from "@react-three/drei";
import { Face3, ExtrudeGeometry, ExtrudeBufferGeometry, Shape, BoxGeometry} from 'three';
import * as THREE from 'three';
import { TextureLoader } from 'three/src/loaders/TextureLoader'
import { useRef } from 'react';


function CreateCardGeometry() {
  const aspectRatio = 1.6 / 2.1;
  const height = 200;
  const width = height * aspectRatio;
  const radius = 10;
  const shape = new Shape();
  shape.moveTo( - width / 2 + radius , height / 2); 
  shape.lineTo(width / 2 - radius , height / 2); //top line
  shape.arc( 0, -radius , radius, Math.PI / 2, 0, true ); // Top right arc

  shape.lineTo(width / 2 , -height / 2 + radius ); // right line
  shape.arc( -radius, 0 , radius, 0, -Math.PI / 2, true ); // bottom right arc

  shape.lineTo(   -width / 2 + radius, - height / 2); // bottom line
  shape.arc(0, radius, radius, -Math.PI / 2, - Math.PI, true); // bottom left arc

  shape.lineTo( - width / 2 , height / 2 - radius ); // left line
  shape.arc(radius, 0, radius, Math.PI, Math.PI / 2, true); // bottom left arc
  return shape;
}
const extrudeSettings = {
  steps: 1,
  depth: 1.5,
  bevelEnabled: false
};



const CardShaderMaterial = shaderMaterial(
  {},
  // Vertex Shader
  `
    void main() {
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  `
    void main() {
      gl_FragColor = vec4(0,1,1,1);
    }
  `

);
extend({CardShaderMaterial})


function Card() {
  const colorMap = useLoader(TextureLoader, 'card-back.jpg')
  const depth = 0.01;

  const ref = useRef();

  let flag = false;
  useFrame(()=>{
    if (flag) {
      return;
    }
    flag = true;
    //console.log(ref.current);
  })

  return (
    <group position={[0, 0, 0]}>
      <mesh ref={ref} scale={[1,1,1]} position={[0,0,0]}>
        <extrudeBufferGeometry  attach="geometry" args={[CreateCardGeometry(), extrudeSettings]} />

        <meshBasicMaterial attach="material-0" color="red" />
        <meshBasicMaterial attach="material-1" color="white" />
        {/* <cardShaderMaterial/> */}
      </mesh>
    </group>
  );
}

function arcArray(aX, aY, radius, startAngle, endAngle, resolution) {
  if (resolution <= 1) {
    throw new Error("resolution must be greater than 1");
  }
  const arr = [];
  const dTheta = (endAngle - startAngle) / (resolution - 1);
  let curTheta = startAngle;
  for (let i = 0; i < resolution; i++) {
    let x = Math.cos(curTheta) * radius + aX;
    let y = Math.sin(curTheta) * radius + aY;
    arr.push({x, y});
    curTheta += dTheta;
  }
  return arr; 
}

function calcCardTopFace(cardGeomCW) {
  const faces = [];
  const n = cardGeomCW.length - 1;
  for (let i = 0; i < cardGeomCW.length / 2; i++) {
    // top left tri
    // bot right tri
  }
}

function Cardv2(width, height, depth, bezelRadius, bezelResolution) {
  const halfWidth = width / 2;
  const halfHeight = height / 2;
  const topLeft = arcArray(-halfWidth + bezelRadius, halfHeight - bezelRadius, bezelRadius, Math.PI, Math.PI / 2, bezelResolution);
  const topRight = arcArray(halfWidth - bezelRadius, halfHeight - bezelRadius, bezelRadius, Math.PI / 2, 0, bezelResolution);
  const botRight = arcArray(halfWidth - bezelRadius, -halfHeight + bezelRadius, bezelRadius, 0, -Math.PI / 2, bezelResolution);
  const botLeft = arcArray(-halfWidth + bezelRadius, -halfHeight + bezelRadius, bezelRadius, -Math.PI / 2, -Math.PI, bezelResolution);

  // in clockwise order
  const topVerts = [...topLeft, ...topRight];
  const botVerts = [...botRight, ...botLeft];

  const cardGeomCW = [...topVerts, ...botVerts];

  console.log(cardGeomCW);

  // Generate card verts for top
  const cardTopVerts = cardGeomCW.map(v => new THREE.Vector3(v.x, v.y, depth / 2)); 
  const cardBotVerts = cardGeomCW.map(v => new THREE.Vector3(v.x, v.y, -depth / 2));
  // card front

  // card side

  // card back 

  return (
    <mesh>
      <meshBasicMaterial attachArray="material" color="yellow" />
    </mesh>
);
}
Cardv2(10,10,1,1,10);

function TestBox() {
  const colorMap = useLoader(TextureLoader, 'card-back.jpg')
  const ref = useRef();
  let flag = false;
  useFrame(()=>{
    if (flag) {
      return;
    }
    flag = true;
    //console.log(ref.current);
  })

  return (
    <mesh ref={ref} scale={[1,1,1]} position={[0,0,0]}>
      <boxBufferGeometry attach="geometry" args={[60, 60, 60]}/>
      <meshBasicMaterial attachArray="material" color="red" />
      <meshBasicMaterial attachArray="material" color="green" />
      <meshBasicMaterial attachArray="material" color="blue" />
      <meshBasicMaterial attachArray="material" color="cyan" />
      <meshBasicMaterial attachArray="material" color="magenta" />
      <meshBasicMaterial attachArray="material" color="yellow" />
    </mesh>
  );
}


function TestBox2() {
  const colorMap = useLoader(TextureLoader, 'card-back.jpg')
  const ref = useRef();
  let flag = false;
  useFrame(()=>{
    if (flag) {
      return;
    }
    flag = true;
    console.log(ref.current);
  })

  const vertices = new Float32Array( [
      -100.0, -100.0,  100.0,
      100.0, -100.0,  100.0,
      100.0,  100.0,  100.0,
      -100.0,  100.0,  100.0,
  ] );

  const indices = new Uint32Array([
    0,1,2,0,2,3
  ]);

  return (
    <mesh ref={ref}>
      <bufferGeometry attach={"geometry"} >
        <bufferAttribute
          array={indices}
          attach="index"
          count={indices.length}
          itemSize={1}
        />
        <bufferAttribute attach={"attributes-position"} array={vertices} itemSize={3} count={4} />
        
      </bufferGeometry>
      <meshBasicMaterial attachArray="material" color="yellow" />
    </mesh>
  );
}



function Game() {
    return (
      <>
        <Canvas>
          <ambientLight intensity={1}></ambientLight>

          <directionalLight
            intensity={1}
            position={[0, 0, 200]}
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
            castShadow
          />

          <pointLight position={[-100, -150, -5]} color={"green"} />
          {/* <Card></Card> */}
          {/* <TestBox></TestBox> */}
          <TestBox2/>
          <OrthographicCamera
            makeDefault
            zoom={1}
            near={1}
            far={2000}
            position={[0, 0, 200]}
          />
          <pointLight position={[0, 0, 200]}  intensity={2}/>
          <pointLight position={[0, 0, -100]}  intensity={1}/>
          <OrbitControls />
          <Stats />
        </Canvas>
      </>
    );
  }
  
  export default Game;