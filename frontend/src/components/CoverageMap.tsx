import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { ServiceArea } from "@/types";
import { Navigation, Layers, ZoomIn, ZoomOut, Maximize2 } from "lucide-react";

interface CoverageMapProps {
  areas: ServiceArea[];
  selectedAreaId: string | null;
  onSelectArea: (id: string) => void;
}

// Coordinate lookup for supported metropolitan and industrial zones
function getCoordinatesForArea(name: string, index: number): [number, number] {
  const lower = name.toLowerCase();
  if (lower.includes("cbd") || lower.includes("city centre") || lower.includes("commercial core")) {
    return [-17.8292, 31.0522];
  }
  if (lower.includes("industrial") || lower.includes("graniteside") || lower.includes("workington")) {
    return [-17.8540, 31.0380];
  }
  if (lower.includes("northern") || lower.includes("borrowdale") || lower.includes("avondale") || lower.includes("residential")) {
    return [-17.7600, 31.0850];
  }
  if (lower.includes("airport") || lower.includes("transit")) {
    return [-17.9318, 31.0928];
  }
  // Fallback with radial dispersion around central coordinates
  const angle = (index * (2 * Math.PI)) / 4;
  return [-17.8292 + Math.sin(angle) * 0.04, 31.0522 + Math.cos(angle) * 0.04];
}

export function CoverageMap({ areas, selectedAreaId, onSelectArea }: CoverageMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Record<string, L.Marker>>({});
  const circlesRef = useRef<L.Circle[]>([]);
  const [showRadius, setShowRadius] = useState(true);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    // Default center on central metropolitan hub
    const defaultCenter: [number, number] = [-17.8292, 31.0522];

    const map = L.map(mapContainerRef.current, {
      center: defaultCenter,
      zoom: 12,
      zoomControl: false,
      attributionControl: true,
      scrollWheelZoom: false, // Prevent accidental scrolling while browsing page
    });

    // High quality OpenStreetMap tiles with dark/clean aesthetic
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Markers, Circles, and Bounds when areas change
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear existing markers and circles
    Object.values(markersRef.current).forEach((marker) => marker.remove());
    markersRef.current = {};
    circlesRef.current.forEach((circle) => circle.remove());
    circlesRef.current = [];

    if (areas.length === 0) return;

    const bounds = L.latLngBounds([]);

    areas.forEach((area, index) => {
      const coords = getCoordinatesForArea(area.name, index);
      bounds.extend(coords);

      const isSelected = selectedAreaId === area.id;

      // Delivery radius zone circle
      if (showRadius) {
        const circle = L.circle(coords, {
          color: isSelected ? "#E53935" : "#111111",
          fillColor: isSelected ? "#E53935" : "#E53935",
          fillOpacity: isSelected ? 0.22 : 0.08,
          weight: isSelected ? 2.5 : 1.5,
          dashArray: isSelected ? undefined : "4, 6",
          radius: 3500, // 3.5 km delivery radius
        }).addTo(map);
        circlesRef.current.push(circle);
      }

      // Custom Modern HTML Marker Icon
      const customIcon = L.divIcon({
        className: "custom-delivery-marker",
        html: `
          <div class="relative flex items-center justify-center cursor-pointer transition-transform duration-200 ${
            isSelected ? "scale-125 z-50" : "hover:scale-110"
          }">
            <div class="w-8 h-8 rounded-full bg-brand-black text-white flex items-center justify-center shadow-lg border-2 ${
              isSelected ? "border-brand-red bg-brand-red" : "border-white"
            }">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
            </div>
            ${
              isSelected
                ? `<span class="absolute -bottom-1 w-2 h-2 bg-brand-red rotate-45"></span>`
                : ""
            }
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
      });

      const marker = L.marker(coords, { icon: customIcon }).addTo(map);

      // Popup with rich hub details
      const popupContent = `
        <div style="font-family: inherit; padding: 4px; max-width: 240px;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
            <span style="font-size: 10px; font-weight: 700; text-transform: uppercase; background: #fee2e2; color: #b91c1c; padding: 2px 6px; border-radius: 4px;">
              Active Hub
            </span>
            <span style="font-size: 10px; color: #64748b; font-family: monospace;">GD-Z${index + 1}</span>
          </div>
          <h4 style="font-weight: 700; font-size: 14px; margin: 0 0 4px 0; color: #0f172a;">
            ${area.name}
          </h4>
          ${
            area.address
              ? `<p style="font-size: 11px; color: #475569; margin: 0 0 6px 0;">${area.address}</p>`
              : ""
          }
          <div style="font-size: 11px; color: #334155; margin-bottom: 8px; line-height: 1.4;">
            ${area.operatingHours ? `<div><strong style="color: #64748b;">Hours:</strong> ${area.operatingHours}</div>` : ""}
            ${area.contactPhone ? `<div><strong style="color: #64748b;">Phone:</strong> ${area.contactPhone}</div>` : ""}
          </div>
          <a href="/booking" style="display: block; text-align: center; background: #E53935; color: white; padding: 6px 10px; border-radius: 6px; font-size: 11px; font-weight: 600; text-decoration: none;">
            Book from this Hub ›
          </a>
        </div>
      `;

      marker.bindPopup(popupContent);

      marker.on("click", () => {
        onSelectArea(area.id);
      });

      markersRef.current[area.id] = marker;
    });

    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 13 });
    }
  }, [areas, selectedAreaId, showRadius, onSelectArea]);

  // Pan to selected area when changed
  useEffect(() => {
    if (!selectedAreaId || !mapInstanceRef.current) return;
    const selectedIdx = areas.findIndex((a) => a.id === selectedAreaId);
    if (selectedIdx === -1) return;

    const coords = getCoordinatesForArea(areas[selectedIdx].name, selectedIdx);
    mapInstanceRef.current.flyTo(coords, 13, { duration: 1.2 });

    const marker = markersRef.current[selectedAreaId];
    if (marker) {
      marker.openPopup();
    }
  }, [selectedAreaId, areas]);

  const handleZoomIn = () => mapInstanceRef.current?.zoomIn();
  const handleZoomOut = () => mapInstanceRef.current?.zoomOut();
  const handleRecenter = () => {
    if (!mapInstanceRef.current || areas.length === 0) return;
    const bounds = L.latLngBounds(
      areas.map((a, i) => getCoordinatesForArea(a.name, i))
    );
    if (bounds.isValid()) {
      mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50], maxZoom: 13 });
    }
  };

  return (
    <div className="relative rounded-2xl overflow-hidden border border-slate-200/90 shadow-lg bg-slate-900">
      {/* Top Map Header / Overlay Bar */}
      <div className="absolute top-4 left-4 right-4 z-[400] flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        <div className="bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-slate-200 shadow-md flex items-center gap-2 pointer-events-auto">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-bold text-slate-800">
            {areas.length} Active Dispatch Zones
          </span>
          <span className="text-[11px] text-slate-500 font-mono">· City Coverage</span>
        </div>

        {/* Layer Controls */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            onClick={() => setShowRadius(!showRadius)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold backdrop-blur-md border shadow-md flex items-center gap-1.5 transition-colors ${
              showRadius
                ? "bg-brand-red text-white border-brand-red"
                : "bg-white/95 text-slate-700 border-slate-200 hover:bg-white"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{showRadius ? "Hide Coverage Radii" : "Show Radii"}</span>
          </button>
        </div>
      </div>

      {/* Map Container */}
      <div
        ref={mapContainerRef}
        className="w-full h-[420px] sm:h-[480px] lg:h-[540px] z-0"
        tabIndex={0}
        aria-label="Service area interactive map"
      />

      {/* Map Floating Controls */}
      <div className="absolute bottom-4 right-4 z-[400] flex flex-col gap-1.5">
        <button
          onClick={handleZoomIn}
          className="w-8 h-8 rounded-lg bg-white/95 hover:bg-white text-slate-800 shadow-md border border-slate-200 flex items-center justify-center transition-transform active:scale-95"
          aria-label="Zoom in"
          title="Zoom in"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={handleZoomOut}
          className="w-8 h-8 rounded-lg bg-white/95 hover:bg-white text-slate-800 shadow-md border border-slate-200 flex items-center justify-center transition-transform active:scale-95"
          aria-label="Zoom out"
          title="Zoom out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={handleRecenter}
          className="w-8 h-8 rounded-lg bg-white/95 hover:bg-white text-slate-800 shadow-md border border-slate-200 flex items-center justify-center transition-transform active:scale-95"
          aria-label="Recenter map"
          title="Fit all hubs in view"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>

      {/* Bottom Hint Banner */}
      <div className="absolute bottom-4 left-4 z-[400] hidden sm:flex items-center gap-2 bg-slate-900/80 backdrop-blur-md text-slate-300 text-[11px] px-3 py-1.5 rounded-lg border border-white/10 pointer-events-none">
        <Navigation className="w-3 h-3 text-brand-red" />
        <span>Click on any hub marker or circle to view dispatch details</span>
      </div>
    </div>
  );
}

export default CoverageMap;
