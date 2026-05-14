import { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Vector3, type OrthographicCamera } from 'three';
import type { CampusModel, BuildingModel } from '../shared';

interface CampusBackgroundProps {
  align?: 'center' | 'right';
  campus?: CampusModel | null;
  colorMode?: 'light' | 'dark';
  focus?: 'center' | 'top';
  highlightColor?: string;
  highlightedBuildingKeys?: string[];
}

const SCALE = 0.08;

function CampusCamera({
  align = 'center',
  buildings,
  focus = 'center',
}: {
  align?: 'center' | 'right';
  buildings: BuildingModel[];
  focus?: 'center' | 'top';
}) {
  const { camera, size } = useThree();
  const initialized = useRef(false);
  const lookAt = useRef(new Vector3());

  const bounds = useMemo(() => {
    const points = buildings
      .map((building) => building.metadata)
      .filter((metadata) => Boolean(metadata));

    if (points.length === 0) {
      return { centerX: 0, centerZ: 0, span: 18 };
    }

    const xs = points.map((metadata) => metadata!.relativeX * SCALE);
    const zs = points.map((metadata) => metadata!.relativeY * SCALE);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minZ = Math.min(...zs);
    const maxZ = Math.max(...zs);

    return {
      centerX: (minX + maxX) / 2,
      centerZ: (minZ + maxZ) / 2,
      span: Math.max(maxX - minX, maxZ - minZ, 18),
    };
  }, [buildings]);

  const target = useMemo(() => {
    const zoom = (500 / bounds.span) * (focus === 'top' ? 0.8 : 1);
    const visibleWidth = size.width / zoom;
    const visibleHeight = size.height / zoom;
    const lookAtX = align === 'right'
      ? bounds.centerX - visibleWidth * 0.25
      : bounds.centerX;
    const lookAtY = focus === 'top' ? -visibleHeight * 0.22 : 0;

    return {
      lookAt: new Vector3(lookAtX, lookAtY, bounds.centerZ),
      position: new Vector3(
        lookAtX + bounds.span * 0.45,
        bounds.span * 0.8 + lookAtY,
        bounds.centerZ + bounds.span * 0.9,
      ),
      zoom,
    };
  }, [align, bounds, focus, size.height, size.width]);

  useEffect(() => {
    if (initialized.current) return;

    const orthographicCamera = camera as OrthographicCamera;
    camera.position.copy(target.position);
    lookAt.current.copy(target.lookAt);
    camera.lookAt(lookAt.current);
    orthographicCamera.zoom = target.zoom;
    camera.updateProjectionMatrix();
    initialized.current = true;
  }, [camera, target]);

  useFrame((_state, delta) => {
    if (!initialized.current) return;

    const orthographicCamera = camera as OrthographicCamera;
    const ease = 1 - Math.exp(-delta * 4.5);

    camera.position.lerp(target.position, ease);
    lookAt.current.lerp(target.lookAt, ease);
    orthographicCamera.zoom += (target.zoom - orthographicCamera.zoom) * ease;
    camera.lookAt(lookAt.current);
    camera.updateProjectionMatrix();
  });

  return null;
}

function CampusScene({
  align,
  campus,
  colorMode = 'light',
  focus,
  highlightColor = '#2563eb',
  highlightedBuildingKeys = [],
}: CampusBackgroundProps) {
  const buildings = campus?.buildings ?? [];
  const buildingsWithMetadata = buildings.filter((building) => building.metadata);
  const highlightedKeys = useMemo(
    () => new Set(highlightedBuildingKeys.map(String)),
    [highlightedBuildingKeys],
  );
  const dark = colorMode === 'dark';

  return (
    <>
      <color attach="background" args={[dark ? '#101318' : '#f7f8f7']} />
      <ambientLight intensity={dark ? 0.55 : 0.95} />
      <directionalLight
        castShadow
        intensity={dark ? 1.55 : 2.1}
        position={[12, 18, 8]}
        shadow-camera-bottom={-45}
        shadow-camera-left={-45}
        shadow-camera-right={45}
        shadow-camera-top={45}
        shadow-mapSize-height={2048}
        shadow-mapSize-width={2048}
      />
      <hemisphereLight args={[dark ? '#d8e2ff' : '#ffffff', dark ? '#21242b' : '#d6ddd8', dark ? 0.45 : 0.7]} />
      <CampusCamera align={align} buildings={buildings} focus={focus} />
      <mesh receiveShadow position={[0, -0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[90, 90]} />
        <meshStandardMaterial color={dark ? '#1a1d23' : '#f1f3f1'} roughness={0.92} />
      </mesh>
      <gridHelper args={[90, 45, dark ? '#343944' : '#c8d1ca', dark ? '#242832' : '#dfe5e0']} position={[0, 0, 0]} />
      {buildingsWithMetadata.map((building) => {
        const metadata = building.metadata!;
        const width = Math.max(metadata.width * SCALE, 0.2);
        const depth = Math.max(metadata.depth * SCALE, 0.2);
        const height = Math.max(metadata.height * SCALE, 0.25);
        const highlighted = highlightedKeys.has(String(building.key));

        return (
          <mesh
            castShadow
            receiveShadow
            key={building.key}
            position={[
              metadata.relativeX * SCALE,
              height / 2,
              metadata.relativeY * SCALE,
            ]}
            rotation={[0, (metadata.rotation * Math.PI) / 180, 0]}
          >
            <boxGeometry args={[width, height, depth]} />
            <meshStandardMaterial
              color={highlighted ? highlightColor : dark ? '#e9e1ea' : '#ffffff'}
              emissive={highlighted ? highlightColor : '#000000'}
              emissiveIntensity={highlighted ? (dark ? 1.9 : 1.35) : 0}
              toneMapped={false}
            />
          </mesh>
        );
      })}
    </>
  );
}

export function CampusBackground({
  align = 'center',
  campus,
  colorMode,
  focus = 'center',
  highlightColor,
  highlightedBuildingKeys,
}: CampusBackgroundProps) {
  return (
    <Canvas
      orthographic
      camera={{ near: 0.1, far: 200, zoom: 2.3 }}
      dpr={[1, 1.5]}
      shadows
      style={{
        height: '100%',
        left: 0,
        pointerEvents: 'none',
        position: 'fixed',
        top: 0,
        width: '100%',
        zIndex: 0,
      }}
    >
      <CampusScene
        align={align}
        campus={campus}
        colorMode={colorMode}
        focus={focus}
        highlightColor={highlightColor}
        highlightedBuildingKeys={highlightedBuildingKeys}
      />
    </Canvas>
  );
}
