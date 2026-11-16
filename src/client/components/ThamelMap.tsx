import { useCallback, useState } from 'react';
import {
  APIProvider,
  AdvancedMarker,
  InfoWindow,
  Map as GoogleMap,
  Pin,
  useAdvancedMarkerRef,
} from '@vis.gl/react-google-maps';
import { ExternalLink, MapPin } from 'lucide-react';

const THAMEL_COORDS = { lat: 27.7153706, lng: 85.3088386 };

function ThamelCafeMarker() {
  const [markerRef, marker] = useAdvancedMarkerRef();
  const [infoOpen, setInfoOpen] = useState(true);

  const handleClose = useCallback(() => setInfoOpen(false), []);

  return (
    <>
      <AdvancedMarker
        ref={markerRef}
        position={THAMEL_COORDS}
        onClick={() => setInfoOpen((prev) => !prev)}
        title="Himalayan Arabica Beans — Saat Ghumti Marg, Thamel"
      >
        <Pin background="#C8872E" borderColor="#1C110A" glyphColor="#1C110A" scale={1.15} />
      </AdvancedMarker>

      {infoOpen && marker && (
        <InfoWindow anchor={marker} onCloseClick={handleClose} maxWidth={260}>
          <div className="p-1 text-espresso font-sans">
            <p className="font-serif font-semibold text-sm text-espresso">
              Himalayan Arabica Beans
            </p>
            <p className="text-xs text-roasted mt-1">
              Saat Ghumti Marg, Thamel, Kathmandu 44600, Nepal
            </p>
            <p className="text-xs text-himalayan font-medium mt-1">
              Open Daily · 7:00 AM – 9:00 PM
            </p>
          </div>
        </InfoWindow>
      )}
    </>
  );
}

export function ThamelMap() {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined;

  if (!apiKey) {
    return (
      <div className="relative h-[420px] w-full rounded-2xl overflow-hidden border border-mocha/20 dark:border-crema/15 bg-gradient-to-br from-roasted via-espresso to-roasted flex flex-col items-center justify-center p-8 text-center text-snow">
        <MapPin className="w-10 h-10 text-caramel mb-3" aria-hidden="true" />
        <h3 className="font-serif text-2xl font-semibold">
          Saat Ghumti Marg, Thamel
        </h3>
        <p className="mt-2 text-sm text-crema/80 max-w-md">
          In the heart of Thamel, Kathmandu 44600, Nepal · Coordinates 27.715371° N, 85.308839° E
        </p>
        <a
          href="https://www.google.com/maps/search/?api=1&query=27.7153706,85.3088386"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-caramel px-5 py-2.5 text-sm font-semibold text-espresso hover:bg-caramel/90 transition-colors"
        >
          <span>Open in Google Maps</span>
          <ExternalLink className="w-4 h-4" aria-hidden="true" />
        </a>
      </div>
    );
  }

  return (
    <div className="relative h-[420px] w-full rounded-2xl overflow-hidden border border-mocha/20 dark:border-crema/15 shadow-lg">
      <APIProvider apiKey={apiKey} language="en" region="NP">
        <GoogleMap
          mapId="DEMO_MAP_ID"
          defaultCenter={THAMEL_COORDS}
          defaultZoom={16}
          gestureHandling="cooperative"
          internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
          style={{ width: '100%', height: '100%' }}
        >
          <ThamelCafeMarker />
        </GoogleMap>
      </APIProvider>
    </div>
  );
}
