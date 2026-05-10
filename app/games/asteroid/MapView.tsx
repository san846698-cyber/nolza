"use client";

import { useEffect, useRef, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Circle,
  Marker,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { ImpactResult } from "./physics";
import type { SectionId } from "./page";
import s from "./asteroid.module.css";

const PIN_ICON = L.divIcon({
  className: "asteroid-pin",
  html: `<div style="
    width:18px;height:18px;border-radius:50%;
    background:#FFD166;border:2px solid #0B0F1A;
    box-shadow:0 0 0 3px rgba(255,209,102,0.35),0 0 12px rgba(255,209,102,0.6);
    transform:translate(-9px,-9px);
  "></div>`,
  iconSize: [0, 0],
});

type LatLng = { lat: number; lng: number };

function ClickCatcher({ onPick }: { onPick: (p: LatLng) => void }) {
  useMapEvents({
    click(e) {
      onPick({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
}

function PanTo({
  target,
  zoom,
  seq,
}: {
  target: LatLng | null;
  zoom: number;
  seq: number;
}) {
  const map = useMap();
  const lastSeq = useRef(-1);
  useEffect(() => {
    if (!target || seq === lastSeq.current) return;
    lastSeq.current = seq;
    map.flyTo([target.lat, target.lng], zoom, { duration: 0.9 });
  }, [target, zoom, seq, map]);
  return null;
}

function PixelReporter({
  target,
  playSeq,
  onFire,
}: {
  target: LatLng | null;
  playSeq: number;
  onFire: (x: number, y: number) => void;
}) {
  const map = useMap();
  const lastSeq = useRef(-1);
  useEffect(() => {
    if (!target || playSeq === lastSeq.current || playSeq < 0) return;
    lastSeq.current = playSeq;
    requestAnimationFrame(() => {
      const p = map.latLngToContainerPoint([target.lat, target.lng]);
      onFire(p.x, p.y);
    });
  }, [target, playSeq, map, onFire]);
  return null;
}

// Auto-fit map bounds to show the radius relevant to the current section.
// Cap at 5,000 km so extinction-level impacts don't zoom the map all the way
// out (which leaves grey space below the world map at zoom 0/1).
const MAX_FIT_RADIUS_M = 5_000_000;

function SectionFit({
  target,
  radiusM,
}: {
  target: LatLng | null;
  radiusM: number;
}) {
  const map = useMap();
  useEffect(() => {
    if (!target || radiusM <= 0) return;
    const r = Math.min(radiusM, MAX_FIT_RADIUS_M);
    const latPad = r / 111_000;
    const lngPad = r / (111_000 * Math.cos((target.lat * Math.PI) / 180));
    const bounds = L.latLngBounds(
      [target.lat - latPad, target.lng - lngPad],
      [target.lat + latPad, target.lng + lngPad],
    );
    map.flyToBounds(bounds, {
      duration: 0.7,
      padding: [40, 40],
      maxZoom: 12,
    });
  }, [target, radiusM, map]);
  return null;
}

// What rings to show + map tint + auto-fit radius for each section.
type SectionConfig = {
  rings: ("crater" | "fireball" | "thermal" | "severe" | "light" | "wind")[];
  fitRadiusM: number;
  tintClass: string;
};

function configFor(sec: SectionId, r: ImpactResult | null): SectionConfig {
  if (!r) {
    return { rings: [], fitRadiusM: 0, tintClass: "" };
  }
  const { craterDiameterM, fireballRadiusM, thermalBurnRadiusM,
          shockwaveSeriousRadiusM, shockwaveLightRadiusM, windRadiusM,
          airburst } = r;

  switch (sec) {
    case "crater":
      if (airburst || craterDiameterM <= 0) {
        return { rings: ["fireball"], fitRadiusM: fireballRadiusM * 1.4, tintClass: "" };
      }
      return {
        rings: ["crater"],
        fitRadiusM: Math.max(craterDiameterM * 1.5, 2000),
        tintClass: s.tintCrater,
      };
    case "fireball":
      return {
        rings: ["fireball"],
        fitRadiusM: fireballRadiusM * 1.4,
        tintClass: s.tintFireball,
      };
    case "thermal":
      return {
        rings: ["fireball", "thermal"],
        fitRadiusM: thermalBurnRadiusM * 1.2,
        tintClass: s.tintThermal,
      };
    case "shockwave":
      return {
        rings: ["fireball", "severe"],
        fitRadiusM: shockwaveSeriousRadiusM * 1.2,
        tintClass: s.tintShock,
      };
    case "shockwaveLight":
      return {
        rings: ["severe", "light"],
        fitRadiusM: shockwaveLightRadiusM * 1.1,
        tintClass: s.tintShockLight,
      };
    case "wind":
      return {
        rings: ["wind"],
        fitRadiusM: windRadiusM * 1.2,
        tintClass: s.tintWind,
      };
    case "earthquake":
      return {
        rings: ["light", "wind"],
        fitRadiusM: Math.max(shockwaveLightRadiusM, windRadiusM) * 1.3,
        tintClass: s.tintQuake,
      };
    case "hero":
    case "final":
    default:
      return {
        rings: ["crater", "fireball", "thermal", "severe", "light"],
        fitRadiusM: shockwaveLightRadiusM * 1.1,
        tintClass: "",
      };
  }
}

export default function MapView({
  center,
  zoom,
  target,
  flyTo,
  flySeq,
  onPick,
  result,
  playSeq,
  activeSection,
}: {
  center: LatLng;
  zoom: number;
  target: LatLng | null;
  flyTo: LatLng | null;
  flySeq: number;
  onPick: (p: LatLng) => void;
  result: ImpactResult | null;
  playSeq: number;
  activeSection: SectionId;
}) {
  const [anim, setAnim] = useState<{ x: number; y: number; key: number; angle: number } | null>(
    null,
  );
  const animKeyRef = useRef(0);
  const angleRef = useRef(45);

  useEffect(() => {
    if (result) angleRef.current = result.inputs.angleDeg;
  }, [result]);

  const cfg = configFor(activeSection, result);
  const wantsRing = (k: SectionConfig["rings"][number]) => cfg.rings.includes(k);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={zoom}
        minZoom={3}
        maxZoom={18}
        style={{ width: "100%", height: "100%" }}
        worldCopyJump={true}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ClickCatcher onPick={onPick} />
        <PanTo target={flyTo} zoom={zoom} seq={flySeq} />
        <PixelReporter
          target={target}
          playSeq={playSeq}
          onFire={(x, y) => {
            animKeyRef.current += 1;
            setAnim({ x, y, key: animKeyRef.current, angle: angleRef.current });
            window.setTimeout(
              () => setAnim((a) => (a?.key === animKeyRef.current ? null : a)),
              2400,
            );
          }}
        />
        {result && target && (
          <SectionFit target={target} radiusM={cfg.fitRadiusM} />
        )}

        {target && <Marker position={[target.lat, target.lng]} icon={PIN_ICON} />}

        {target && result && wantsRing("crater") && !result.airburst && result.craterDiameterM > 0 && (
          <Circle
            center={[target.lat, target.lng]}
            radius={result.craterDiameterM / 2}
            pathOptions={{
              color: "#1A0E08",
              fillColor: "#241612",
              fillOpacity: 0.92,
              weight: 1,
            }}
          />
        )}
        {target && result && wantsRing("fireball") && (
          <Circle
            center={[target.lat, target.lng]}
            radius={result.fireballRadiusM}
            pathOptions={{
              color: "#FFB347",
              fillColor: "#FF7A3D",
              fillOpacity: activeSection === "fireball" ? 0.65 : 0.45,
              weight: 2,
            }}
          />
        )}
        {target && result && wantsRing("thermal") && (
          <Circle
            center={[target.lat, target.lng]}
            radius={result.thermalBurnRadiusM}
            pathOptions={{
              color: "#FFD166",
              fillColor: "#FFB347",
              fillOpacity: activeSection === "thermal" ? 0.4 : 0.2,
              weight: 1.5,
            }}
          />
        )}
        {target && result && wantsRing("severe") && (
          <Circle
            center={[target.lat, target.lng]}
            radius={result.shockwaveSeriousRadiusM}
            pathOptions={{
              color: "#FFFFFF",
              fillColor: "#FFD166",
              fillOpacity: activeSection === "shockwave" ? 0.25 : 0.12,
              weight: 1.5,
            }}
          />
        )}
        {target && result && wantsRing("light") && (
          <Circle
            center={[target.lat, target.lng]}
            radius={result.shockwaveLightRadiusM}
            pathOptions={{
              color: "#5DD9FF",
              fillColor: "#5DD9FF",
              fillOpacity: activeSection === "shockwaveLight" ? 0.2 : 0.06,
              weight: 1.5,
              dashArray: "5 5",
            }}
          />
        )}
        {target && result && wantsRing("wind") && (
          <Circle
            center={[target.lat, target.lng]}
            radius={result.windRadiusM}
            pathOptions={{
              color: "#9B8AFF",
              fillColor: "#9B8AFF",
              fillOpacity: activeSection === "wind" ? 0.25 : 0.1,
              weight: 1.5,
            }}
          />
        )}
      </MapContainer>

      {/* Section tint overlay — colored gel above tiles, below result panel */}
      <div className={`${s.tint} ${cfg.tintClass}`} aria-hidden />

      {/* Impact animation overlay */}
      {anim && (
        <div
          key={anim.key}
          className={s.impactStage}
          style={
            {
              "--target-x": `${anim.x}px`,
              "--target-y": `${anim.y}px`,
              "--entry-angle": `${anim.angle}deg`,
            } as React.CSSProperties
          }
        >
          <div className={s.streakWrap}>
            <div className={s.streak} />
            <div className={s.streakRock} />
          </div>
          <div className={s.impactFlash} />
          <div className={`${s.shockRing} ${s.shockRing1}`} />
          <div className={`${s.shockRing} ${s.shockRing2}`} />
          <div className={`${s.shockRing} ${s.shockRing3}`} />
        </div>
      )}
    </div>
  );
}
