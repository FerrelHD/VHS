"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { CRT_CONSTANTS } from "@/lib/math";

interface BentPostProcessingProps {
  paused?: boolean;
}

const VERTEX_SHADER = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const FRAGMENT_SHADER = `
  uniform sampler2D map;
  uniform float k;
  uniform float fade;
  varying vec2 vUv;

  void main() {
    // Slight scale factor (zoom ~1.07) so distorted texture completely covers the pillowed corners
    vec2 p = (vUv * 2.0 - 1.0) * 0.935;

    // Subtle barrel distortion formula
    vec2 st = vec2(
      p.x * (1.0 + k * p.y * p.y),
      p.y * (1.0 + k * p.x * p.x)
    ) * 0.5 + 0.5;

    // Edge fade vignette
    vec2 edge = smoothstep(vec2(0.0), vec2(fade), st) * smoothstep(vec2(0.0), vec2(fade), 1.0 - st);
    vec4 tex = texture2D(map, clamp(st, 0.0, 1.0));

    gl_FragColor = vec4(tex.rgb * (edge.x * edge.y), tex.a);
  }
`;

/**
 * Offscreen FBO Barrel Distortion Screen Quad.
 * Calibrated with gentle curvature (K=0.09) and UV scaling to fill the pillowed bezel seamlessly.
 */
export function BentPostProcessing({ paused = false }: BentPostProcessingProps) {
  const fallbackRef = useRef(false);

  const { target, screenScene, screenCamera, material } = useMemo(() => {
    const renderTarget = new THREE.WebGLRenderTarget(1, 1, {
      type: THREE.HalfFloatType,
      samples: 1,
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
    });

    const mat = new THREE.ShaderMaterial({
      uniforms: {
        map: { value: renderTarget.texture },
        k: { value: CRT_CONSTANTS.K },
        fade: { value: CRT_CONSTANTS.FADE },
      },
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
      depthTest: false,
      depthWrite: false,
      blending: THREE.NoBlending,
    });

    const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), mat);
    quad.frustumCulled = false;

    const scene = new THREE.Scene();
    scene.add(quad);

    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    return {
      target: renderTarget,
      screenScene: scene,
      screenCamera: camera,
      material: mat,
    };
  }, []);

  useEffect(() => {
    return () => {
      target.dispose();
      material.dispose();
      screenScene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry?.dispose();
        }
      });
    };
  }, [target, material, screenScene]);

  const bufferSize = useMemo(() => new THREE.Vector2(), []);

  useFrame(({ gl, scene, camera }) => {
    if (paused) return;

    if (!fallbackRef.current) {
      try {
        gl.getDrawingBufferSize(bufferSize);
        const w = Math.max(1, bufferSize.x);
        const h = Math.max(1, bufferSize.y);

        if (target.width !== w || target.height !== h) {
          target.setSize(w, h);
        }

        // 1. Render 3D Scene into offscreen FBO
        gl.setRenderTarget(target);
        gl.render(scene, camera);

        // 2. Render Screen Quad with subtle Barrel Distortion to screen
        gl.setRenderTarget(null);
        gl.render(screenScene, screenCamera);
        return;
      } catch (err) {
        fallbackRef.current = true;
        console.warn("[CRT Optic Pipeline] WebGLRenderTarget error, falling back to straight render:", err);
      }
    }

    gl.setRenderTarget(null);
    gl.render(scene, camera);
  }, 1);

  return null;
}
