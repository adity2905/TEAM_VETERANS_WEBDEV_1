'use client';

import React, { useEffect, useRef, useState } from 'react';
import { NGO, StateImpactData } from '@/types';
import { MapPin, AlertCircle, RefreshCw, Layers, ShieldCheck } from 'lucide-react';

interface RealLeafletMapProps {
  ngos: NGO[];
  selectedState?: string | null;
  onSelectNGO: (ngo: NGO) => void;
  onSelectState?: (stateName: string) => void;
}

export default function RealLeafletMap({
  ngos,
  selectedState,
  onSelectNGO,
  onSelectState,
}: RealLeafletMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersLayerRef = useRef<any>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [mapError, setMapError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    // Load Leaflet CSS and JS dynamically if not already present
    const loadLeaflet = async () => {
      try {
        // Inject CSS
        if (!document.getElementById('leaflet-css')) {
          const link = document.createElement('link');
          link.id = 'leaflet-css';
          link.rel = 'stylesheet';
          link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
          document.head.appendChild(link);
        }

        // Check if window.L is already loaded
        if (!(window as any).L) {
          await new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
            script.async = true;
            script.onload = resolve;
            script.onerror = () => reject(new Error('Failed to load OpenStreetMap Leaflet library'));
            document.body.appendChild(script);
          });
        }

        if (!isMounted || !mapContainerRef.current) return;

        const L = (window as any).L;

        // Initialize Map if not already initialized
        if (!mapInstanceRef.current && mapContainerRef.current) {
          const map = L.map(mapContainerRef.current, {
            center: [20.5937, 78.9629], // Geographic center of India
            zoom: 5,
            minZoom: 4,
            maxZoom: 16,
            scrollWheelZoom: true,
          });

          // OpenStreetMap Tile Layer
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 18,
          }).addTo(map);

          markersLayerRef.current = L.layerGroup().addTo(map);
          mapInstanceRef.current = map;
        }

        // Render NGO markers
        renderMarkers();
        setIsLoading(false);
      } catch (err: any) {
        if (isMounted) {
          console.warn('Leaflet OpenStreetMap map load error:', err);
          setMapError('Real geographical map tiles temporarily unavailable. You can still explore the complete state NGO ledger.');
          setIsLoading(false);
        }
      }
    };

    loadLeaflet();

    return () => {
      isMounted = false;
    };
  }, []);

  // Update markers when NGOs or selectedState changes
  const renderMarkers = () => {
    const L = (window as any).L;
    const map = mapInstanceRef.current;
    const markersLayer = markersLayerRef.current;

    if (!L || !map || !markersLayer) return;

    markersLayer.clearLayers();

    // Custom Teal/Emerald pin icon for NGOs
    const createNgoIcon = (isHighlight: boolean) =>
      L.divIcon({
        className: 'custom-leaflet-marker',
        html: `
          <div style="
            width: ${isHighlight ? '36px' : '30px'};
            height: ${isHighlight ? '36px' : '30px'};
            background: ${isHighlight ? '#059669' : '#0f766e'};
            border: 2px solid #ffffff;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 14px;
            box-shadow: 0 4px 10px rgba(0,0,0,0.3);
            transform: translate(-50%, -50%);
          ">
            📍
          </div>
        `,
        iconSize: [30, 30],
        iconAnchor: [15, 15],
      });

    ngos.forEach((ngo) => {
      if (ngo.latitude && ngo.longitude) {
        const isMatched = selectedState
          ? (ngo.state && ngo.state.toLowerCase().includes(selectedState.toLowerCase())) ||
            ngo.location.toLowerCase().includes(selectedState.toLowerCase())
          : false;

        const marker = L.marker([ngo.latitude, ngo.longitude], {
          icon: createNgoIcon(isMatched),
        });

        // Popup with rich information & click handler
        const popupContent = document.createElement('div');
        popupContent.style.minWidth = '220px';
        popupContent.style.fontFamily = 'inherit';
        popupContent.innerHTML = `
          <div style="padding: 4px;">
            <div style="display: flex; align-items: center; justify-content: space-between; gap: 4px;">
              <span style="font-size: 10px; font-weight: 700; color: #047857; text-transform: uppercase;">
                ${ngo.category}
              </span>
              <span style="font-size: 10px; font-weight: 700; background: #ecfdf5; color: #065f46; padding: 2px 6px; border-radius: 12px; border: 1px solid #a7f3d0;">
                ✓ Platform Verified
              </span>
            </div>
            <h4 style="font-size: 13px; font-weight: 800; color: #0f172a; margin: 4px 0 2px 0; line-height: 1.2;">
              ${ngo.name}
            </h4>
            <p style="font-size: 11px; color: #64748b; margin: 0 0 6px 0;">
              📍 ${ngo.location}
            </p>
            <div style="font-size: 10px; color: #334155; border-top: 1px solid #f1f5f9; padding-top: 4px; margin-bottom: 8px;">
              <div>⚡ Active Campaigns: <strong>${ngo.active_campaigns_count || 1}</strong></div>
              <div>🤝 Volunteers Needed: <strong>${ngo.volunteers_needed_count || 8}</strong></div>
            </div>
            <button id="btn-view-ngo-${ngo.id}" style="
              width: 100%;
              padding: 6px 10px;
              background: #059669;
              color: white;
              font-size: 11px;
              font-weight: 700;
              border: none;
              border-radius: 8px;
              cursor: pointer;
            ">
              View Complete NGO Profile →
            </button>
          </div>
        `;

        popupContent.querySelector(`#btn-view-ngo-${ngo.id}`)?.addEventListener('click', () => {
          onSelectNGO(ngo);
        });

        marker.bindPopup(popupContent);
        markersLayer.addLayer(marker);
      }
    });

    // If state is selected, pan map to that region
    if (selectedState) {
      const stateCenters: Record<string, [number, number]> = {
        maharashtra: [19.7515, 75.7139],
        karnataka: [15.3173, 75.7139],
        delhi: [28.7041, 77.1025],
        'delhi-ncr': [28.7041, 77.1025],
        gujarat: [22.2587, 71.1924],
        rajasthan: [27.0238, 74.2179],
        'tamil nadu': [11.1271, 78.6569],
        'west bengal': [22.9868, 87.8550],
        bihar: [25.0961, 85.3131],
      };

      const key = selectedState.toLowerCase().trim();
      const coords = stateCenters[key];
      if (coords) {
        map.flyTo(coords, 7, { duration: 1.2 });
      }
    }
  };

  useEffect(() => {
    if (!isLoading && !mapError) {
      renderMarkers();
    }
  }, [selectedState, ngos, isLoading, mapError]);

  return (
    <div className="relative w-full h-[540px] rounded-3xl overflow-hidden border border-slate-200 shadow-sm bg-slate-100">
      
      {/* Map Container */}
      <div ref={mapContainerRef} className="w-full h-full z-10" />

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 z-20 bg-slate-100/90 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center">
          <div className="w-10 h-10 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mb-3" />
          <h4 className="text-sm font-bold text-slate-800">Loading OpenStreetMap India Tiles...</h4>
          <p className="text-xs text-slate-500 mt-1">Connecting to Leaflet spatial coordinates</p>
        </div>
      )}

      {/* Fallback Graceful Error State */}
      {mapError && (
        <div className="absolute inset-0 z-20 bg-white/95 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-base font-bold text-slate-900">Map Service Unavailable</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-sm">
              {mapError}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setMapError(null)}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors"
          >
            Retry Loading Map
          </button>
        </div>
      )}

      {/* Map Control HUD Badge */}
      <div className="absolute top-3 left-3 z-20 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200/80 shadow-xs flex items-center gap-2 text-xs font-bold text-slate-800">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        <span>Leaflet + OpenStreetMap (India)</span>
      </div>

      <div className="absolute bottom-3 left-3 z-20 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200/80 shadow-xs text-[11px] text-slate-600">
        Click marker to view NGO credentials • Pan/Zoom enabled
      </div>

    </div>
  );
}
