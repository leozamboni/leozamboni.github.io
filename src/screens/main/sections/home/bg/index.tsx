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

function Shader() {
  const isMobile = useIsMobile();
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
  
  
  
  void mainImage( out vec4 fragColor, in vec2 fragCoord) {
    vec2 uv = fragCoord / iResolution;
  
    // Corrige a proporção da tela
    vec2 aspectRatio = vec2(iResolution.x / iResolution.y, 1.0);
  
    // Adicione um deslocamento para mover o círculo
    vec2 offset = vec2(${
      isMobile ? "0.5,0.5" : "0.0,0.0"
    }); // Move o círculo 20% para a direita e mantém o mesmo eixo vertical
  
    vec2 centeredUV = (uv - 0.5 - offset) * aspectRatio;
  
    float dist = length(centeredUV);
  
    // Circle
    float radius = ${isMobile ? "0.45" : "0.32"};
    float smoothness = 0.03;
  
    vec3 circleColorA = vec3(0.31,0.38,1.00); // Vermelho
    vec3 circleColorB = vec3(0.76,0.78,1.00); // Azul
    vec3 circleColor = mix(circleColorA, circleColorB, uv.y + .2);
  
    float circle = smoothstep(radius + smoothness, radius - smoothness, dist);
  
    // Background
    vec2 bgCenter = vec2(0.5, 0.5); 
  
    vec3 bgColorA = vec3(0.76,0.78,1.00); // Vermelho
    vec3 bgColorB = vec3(0.76,0.78,1.00); // Azul
    vec3 bgColor = mix(bgColorA, bgColorB, uv.y);
  
    // Light
    vec2 lightPos = iMouse.xy / iResolution.xy; // Posição da luz (normalizada)
    float lightIntensity = 0.2;    // Intensidade da luz
    float lightRadius = 0.5;       // Raio de impacto da luz
  
    vec2 lightDir = lightPos - uv;
    float lightDist = length(lightDir);
  
    // Atenua a luz com base na distância
    float lightEffect = smoothstep(lightRadius, 0.0, lightDist) * lightIntensity;
  
    // Aplica a luz ao círculo (adiciona brilho)
    vec3 lightColor = vec3(0.76,0.78,1.00); // Luz amarelada
    vec3 litCircleColor = circleColor + lightColor * lightEffect;
  
   
    // Combina o círculo iluminado com o fundo
    vec3 finalColor = mix(bgColor, litCircleColor, circle);
  
    // Define a cor de saída
    fragColor = vec4(finalColor, 1.0);
  }
  
  
  void main() { 
    mainImage(gl_FragColor, gl_FragCoord.xy); 
  }
  `;

  const materialRef = useRef<ShaderMaterial>(null);
  let mouseCords = { x: 0, y: 0 };
  let mouseClick = false;

  const uniforms = useMemo(
    () => ({
      iResolution: {
        value: new Vector2(window.innerWidth, window.innerHeight),
      },
      iTime: { value: 0 },
      iMouse: { value: new Vector3() },
      iFrame: { value: 0 },
    }),
    []
  );

  useFrame(({ clock, size }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.iResolution.value.set(
        size.width,
        size.height
      );
      materialRef.current.uniforms.iTime.value = clock.elapsedTime;
      materialRef.current.uniforms.iFrame.value++;
      if (isMobile) return
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

  useEffect(() => {
    const updateResolution = () => {
      uniforms.iResolution.value.set(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", updateResolution);

    // Garante que a resolução está correta no início
    updateResolution();

    return () => {
      window.removeEventListener("resize", updateResolution);
    };
  }, [uniforms]);

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
  return (
    <Canvas
      ref={ref}
      style={{
        width: "100vw",
        height: "100vh",
        position: "absolute",
        top: 0,
        left: 0,
      }}
    >
      <Shader />
    </Canvas>
  );
}
