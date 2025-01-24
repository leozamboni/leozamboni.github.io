import { useSafeLayoutEffect } from "@chakra-ui/react";
import { Canvas, useFrame } from "@react-three/fiber";
import React, {
  useRef,
  useState,
  useEffect,
  CSSProperties,
  useMemo,
  Ref,
} from "react";
import { ShaderMaterial, Vector2, Vector3 } from "three";
import * as THREE from "three";
import { useIsMobile } from "../../../../../utils/isMobile";

const vertexShader = `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = vec4(position, 1.0);
}
`;

const fragmentShader = `
uniform vec2 iResolution;
uniform float iTime;
uniform vec3 iMouse;
uniform float iFrame;

vec3 getSky(vec2 uv)
{
    float atmosphere = sqrt(1.0-uv.y);
    vec3 skyColor = vec3(0.2,0.4,0.8);
    
    float scatter = pow(iMouse.y / iResolution.y,1.0 / 15.0);
    scatter = 1.0 - clamp(scatter,0.8,1.0);
    
    vec3 scatterColor = mix(vec3(1.0),vec3(1.0,0.3,0.0) * 1.5,scatter);
    return mix(skyColor,vec3(scatterColor),atmosphere / 1.3);
    
}

vec3 getSun(vec2 uv){
	float sun = 1.0 - distance(uv,iMouse.xy / iResolution.y);
    sun = clamp(sun,0.0,1.0);
    
    float glow = sun;
    glow = clamp(glow,0.0,1.0);
    
    // sun = pow(sun,100.0);
    sun = pow(sun,150.0);
    sun *= 100.0;
    sun = clamp(sun,0.0,1.0);
    
    // glow = pow(glow,6.0) * 1.0;
    glow = pow(glow,10.0) * 1.0;
    glow = pow(glow,(uv.y));
    glow = clamp(glow,0.0,1.0);
    
    sun *= pow(dot(uv.y, uv.y), 1.0 / 1.65);
    
    glow *= pow(dot(uv.y, uv.y), 1.0 / 2.0);
    
    sun += glow;
    
    vec3 sunColor = vec3(1.0,0.6,0.05) * sun;
    
    return vec3(sunColor);
}

float hash(float c) { 
  return fract(sin(c * 12.9898) * 43758.5453); 
}

const float W = 1.2;
const float TZ = 7.5;

float filmic_reinhard_curve(float x) {
  float q = (TZ*TZ + 1.0)*x*x;
  return q / (q + x + TZ*TZ);
}

vec3 filmic_reinhard(vec3 x) {
  float w = filmic_reinhard_curve(W);
  return vec3(
      filmic_reinhard_curve(x.r),
      filmic_reinhard_curve(x.g),
      filmic_reinhard_curve(x.b)
  ) / w;
}

// Noise function for organic shape
float noise(vec3 p) {
  return hash(dot(p, vec3(127.1, 311.7, 74.7)));
}

float sdf(vec3 p) {
  // Base shape
  float d = length(p) - 1.0;
  
  // Add organic deformation
  float time = iTime * 0.5;
  for(int i = 1; i < 5; i++) {
      float fi = float(i);
      d += sin(p.x*fi*.9 + time) * sin(p.y*fi*.8 + time) * sin(p.z*fi*1.2 + time) * 0.1 / fi;
  }
  
  return d * 0.5;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
  vec2 uv = (fragCoord.xy / iResolution.xy) * 2.0 - 1.0;
  uv.x *= iResolution.x / iResolution.y;
  
  vec3 ro = vec3(0.0, 0.0, -3.0);
  vec3 rd = normalize(vec3(uv,1.5));
  
  vec3 light = normalize(vec3(0.5, 1.0, -0.3));
  vec3 blob = vec3(0.0);
  
  float t = 0.0;
  for(int i = 0; i < 128; i++) {
      vec3 p = ro + rd * t;
      float d = sdf(p);
      
      if(d < 0.001) {
          vec3 normal = normalize(vec3(
              sdf(p + vec3(0.001, 0.0, 0.0)) - sdf(p - vec3(0.001, 0.0, 0.0)),
              sdf(p + vec3(0.0, 0.001, 0.0)) - sdf(p - vec3(0.0, 0.001, 0.0)),
              sdf(p + vec3(0.0, 0.0, 0.001)) - sdf(p - vec3(0.0, 0.0, 0.001))
          ));
          
          float diff = max(0.0, dot(normal, light));
          vec3 baseColor = vec3(0.0,0.5,0.0);
          float sss = pow(max(0.0, dot(-rd, light)), 3.0) * 0.8;
          
          blob = baseColor * (diff + sss);
          break;
      }
      
      t += d;
      if(t > 20.0) break;
  }

  vec2 uv2 = fragCoord.xy / iResolution.y;
    
  vec3 sky = getSky(uv2);
  vec3 sun = getSun(uv2);


  fragColor = vec4(sun+sky+blob, 1.0);
}
void main() { 
    mainImage(gl_FragColor, gl_FragCoord.xy); 
}
`;

function Shader() {
  const materialRef = useRef<ShaderMaterial>(null);
  let mouseCords = { x: 0, y: 0 };
  let mouseClick = false;

  useFrame(({ clock, size }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.iResolution.value.set(
        size.width,
        size.height
      );
      materialRef.current.uniforms.iTime.value = clock.elapsedTime;
      materialRef.current.uniforms.iFrame.value++;
      materialRef.current.uniforms.iMouse.value = {
        x: mouseCords.x,
        y: size.height - mouseCords.y,
        z: mouseClick,
      };
    }
  });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      mouseCords.x = event.clientX;
      mouseCords.y = event.clientY;
    };

    const handleMouseDown = () => (mouseClick = true);
    const handleMouseUp = () => (mouseClick = false);

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  const uniforms = {
    iResolution: { value: new Vector2() },
    iTime: { value: new Vector2() },
    iMouse: { value: new Vector3() },
    iFrame: { value: 0.0 },
  };

  return (
    <mesh>
      <planeGeometry args={[10, 10]} />
      <shaderMaterial
        ref={materialRef}
        attach="material"
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
      />
    </mesh>
  );
}

interface BgProps {
  ref: Ref<HTMLCanvasElement> | undefined;
}

export default function Bg({ ref }: BgProps) {
  const isMobile = useIsMobile();

  return (
    <Canvas
      ref={ref}
      style={{
        width: "100vw",
        height: isMobile ? "200vh" : "100vh",
        marginTop: isMobile ? "-100vh" : "",
        position: "absolute",
        top: 0,
        left: 0,
      }}
    >
      <Shader />
    </Canvas>
  );
}
