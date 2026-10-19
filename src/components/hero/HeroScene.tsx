"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  AdditiveBlending,
  type Group,
  type ShaderMaterial,
  Vector3,
} from "three";
import {
  particlesFragmentShader,
  particlesVertexShader,
  sphereFragmentShader,
  sphereVertexShader,
} from "@/components/hero/shaders";
import { REDUCED_MOTION, useMediaQuery } from "@/hooks/useMediaQuery";

// ShaderMaterial は色空間変換を通さないため、sRGB の値をそのまま渡す
const toVec3 = (hex: number) =>
  new Vector3(
    ((hex >> 16) & 255) / 255,
    ((hex >> 8) & 255) / 255,
    (hex & 255) / 255,
  );

const COLORS = {
  core: toVec3(0x2a2620),
  shade: toVec3(0x0e0d0c),
  accent: toVec3(0xc9a96e),
};

type Pointer = { x: number; y: number };

function NoiseSphere({ still }: { still: boolean }) {
  const material = useRef<ShaderMaterial>(null);
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uAmplitude: { value: 0.14 },
      uCore: { value: COLORS.core },
      uShade: { value: COLORS.shade },
      uAccent: { value: COLORS.accent },
    }),
    [],
  );

  useFrame((_, delta) => {
    if (still || !material.current) return;
    material.current.uniforms.uTime.value += delta;
  });

  return (
    <mesh>
      <icosahedronGeometry args={[1, 64]} />
      <shaderMaterial
        ref={material}
        uniforms={uniforms}
        vertexShader={sphereVertexShader}
        fragmentShader={sphereFragmentShader}
      />
    </mesh>
  );
}

function Particles({ count, still }: { count: number; still: boolean }) {
  const material = useRef<ShaderMaterial>(null);

  const attributes = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const seeds = new Float32Array(count);
    const sizes = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      // 球の周りの殻（半径 1.35〜2.1）に散らす
      const radius = 1.35 + Math.random() * 0.75;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.cos(phi);
      positions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
      seeds[i] = Math.random();
      sizes[i] = 1 + Math.random() * 2.2;
    }
    return { positions, seeds, sizes };
  }, [count]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPixelRatio: { value: 1 },
      uColor: { value: COLORS.accent },
    }),
    [],
  );

  useFrame((state, delta) => {
    if (!material.current) return;
    material.current.uniforms.uPixelRatio.value = state.viewport.dpr;
    if (!still) material.current.uniforms.uTime.value += delta;
  });

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[attributes.positions, 3]}
        />
        <bufferAttribute
          attach="attributes-aSeed"
          args={[attributes.seeds, 1]}
        />
        <bufferAttribute
          attach="attributes-aSize"
          args={[attributes.sizes, 1]}
        />
      </bufferGeometry>
      <shaderMaterial
        ref={material}
        uniforms={uniforms}
        vertexShader={particlesVertexShader}
        fragmentShader={particlesFragmentShader}
        transparent
        depthWrite={false}
        blending={AdditiveBlending}
      />
    </points>
  );
}

function Scene({
  pointer,
  particleCount,
  still,
}: {
  pointer: React.RefObject<Pointer>;
  particleCount: number;
  /** 動きを減らす設定のとき。揺らぎ・傾き・沈み込みを止めて静止画にする */
  still: boolean;
}) {
  const group = useRef<Group>(null);
  const particles = useRef<Group>(null);

  useFrame((_, delta) => {
    const g = group.current;
    if (!g || still) return;

    // マウスの位置へ緩やかに傾ける
    const ease = 1 - Math.exp(-delta * 2);
    g.rotation.y += (pointer.current.x * 0.35 - g.rotation.y) * ease;
    g.rotation.x += (-pointer.current.y * 0.2 - g.rotation.x) * ease;

    // Hero をスクロールで抜けるにつれて奥へ沈める
    const progress = Math.min(window.scrollY / window.innerHeight, 1);
    g.position.z += (-progress * 2.4 - g.position.z) * ease;
    g.position.y += (-progress * 0.4 - g.position.y) * ease;

    if (particles.current) particles.current.rotation.y += delta * 0.03;
  });

  return (
    <group ref={group}>
      <NoiseSphere still={still} />
      <group ref={particles}>
        <Particles count={particleCount} still={still} />
      </group>
    </group>
  );
}

export default function HeroScene() {
  const container = useRef<HTMLDivElement>(null);
  const pointer = useRef<Pointer>({ x: 0, y: 0 });
  const [visible, setVisible] = useState(true);
  const [ready, setReady] = useState(false);
  const still = useMediaQuery(REDUCED_MOTION);
  const [compact] = useState(
    () => window.matchMedia("(width < 48rem)").matches,
  );

  useEffect(() => {
    const onPointerMove = (event: PointerEvent) => {
      pointer.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (event.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    // 画面外にあるあいだは描画を止める
    const observer = new IntersectionObserver(([entry]) =>
      setVisible(entry.isIntersecting),
    );
    if (container.current) observer.observe(container.current);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={container}
      className={`size-full transition-opacity duration-[1500ms] ease-out motion-reduce:transition-none ${ready ? "opacity-100" : "opacity-0"}`}
    >
      <Canvas
        camera={{ position: [0, 0, 5.2], fov: 35 }}
        dpr={compact ? [1, 1.5] : [1, 2]}
        // 静止画のときは、サイズが変わったときなどに必要な分だけ描く
        frameloop={still ? "demand" : visible ? "always" : "never"}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        onCreated={() => setReady(true)}
      >
        <Scene
          pointer={pointer}
          particleCount={compact ? 120 : 260}
          still={still}
        />
      </Canvas>
    </div>
  );
}
