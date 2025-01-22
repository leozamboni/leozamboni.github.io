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
    
    sun = pow(sun,100.0);
    sun *= 100.0;
    sun = clamp(sun,0.0,1.0);
    
    glow = pow(glow,6.0) * 1.0;
    glow = pow(glow,(uv.y));
    glow = clamp(glow,0.0,1.0);
    
    sun *= pow(dot(uv.y, uv.y), 1.0 / 1.65);
    
    glow *= pow(dot(uv.y, uv.y), 1.0 / 2.0);
    
    sun += glow;
    
    vec3 sunColor = vec3(1.0,0.6,0.05) * sun;
    
    return vec3(sunColor);
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
	vec2 uv = fragCoord.xy / iResolution.y;
    
    vec3 sky = getSky(uv);
    vec3 sun = getSun(uv);
    
	fragColor = vec4(sky + sun,1.0);
}
void main() { 
    mainImage(gl_FragColor, gl_FragCoord.xy); 
}

`;

function Shader() {
  const materialRef = useRef<ShaderMaterial>(null);
  let mouseCords = {x:0,y:0};
  let mouseClick = false;

  useFrame(({ clock, size }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.iResolution.value.set(
        size.width,
        size.height
      );
      materialRef.current.uniforms.iTime.value = clock.elapsedTime;
      materialRef.current.uniforms.iFrame.value++;
      if (mouseClick) {
        materialRef.current.uniforms.iMouse.value = {
          x: mouseCords.x,
          y: size.height - mouseCords.y,
          z: mouseClick
        };
      }
    }
  });

  document.addEventListener("mousemove", (event) => {
    mouseCords.x = event.clientX
    mouseCords.y = event.clientY
  });

  document.addEventListener("mousedown", (event) => {
    mouseClick = true
  });

  document.addEventListener("mouseup", (event) => {
    mouseClick = false
  });

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
  style: CSSProperties;
}

export default function Bg({ ref, style }: BgProps) {
  return (
    <Canvas
      ref={ref}
      style={style}
    >
      <Shader />
    </Canvas>
  );
}
