"use client";

import { useEffect, useId, useRef, useState } from "react";
import { getSafeFallbackPlace, normaliseGooglePlace, type GooglePlaceLike, type SelectedPlace } from "@/lib/places";

declare global {
  interface Window {
    google?: {
      maps: { places: { Autocomplete: new (input: HTMLInputElement, options: object) => {
        addListener(event: string, callback: () => void): { remove(): void };
        getPlace(): GooglePlaceLike;
      } } };
    };
    __bacGooglePlacesPromise?: Promise<void>;
  }
}

function loadPlaces(apiKey: string): Promise<void> {
  if (window.google?.maps.places) return Promise.resolve();
  if (window.__bacGooglePlacesPromise) return window.__bacGooglePlacesPromise;
  window.__bacGooglePlacesPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}&libraries=places&loading=async`;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Places could not be loaded"));
    document.head.appendChild(script);
  });
  return window.__bacGooglePlacesPromise;
}

interface Props {
  label: string;
  value: string;
  selectedPlace: SelectedPlace | null;
  onChange(value: string, place: SelectedPlace | null): void;
  error?: string;
  placeholder: string;
  fallbackOptions: string[];
}

export function PlacesAutocompleteInput({ label, value, selectedPlace, onChange, error, placeholder, fallbackOptions }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const id = useId();
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const [placesEnabled, setPlacesEnabled] = useState(false);

  useEffect(() => {
    if (!apiKey || !inputRef.current) return;
    let listener: { remove(): void } | undefined;
    let cancelled = false;
    loadPlaces(apiKey).then(() => {
      if (cancelled || !inputRef.current || !window.google) return;
      const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
        componentRestrictions: { country: "gb" },
        fields: ["address_components", "formatted_address", "geometry", "name", "place_id", "types"],
      });
      setPlacesEnabled(true);
      listener = autocomplete.addListener("place_changed", () => {
        const place = normaliseGooglePlace(autocomplete.getPlace());
        if (place) onChange(place.displayAddress, place);
      });
    }).catch(() => setPlacesEnabled(false));
    return () => { cancelled = true; listener?.remove(); };
  }, [apiKey, onChange]);

  const fallbackListId = `${id}-fallback`;
  return <label htmlFor={id} className="text-sm font-medium">{label}
    <input
      ref={inputRef}
      id={id}
      type="text"
      value={value}
      placeholder={placeholder}
      autoComplete="off"
      list={!apiKey ? fallbackListId : undefined}
      aria-invalid={Boolean(error)}
      aria-describedby={error ? `${id}-error` : undefined}
      onChange={(event) => onChange(event.target.value, null)}
      onBlur={() => {
        if (!apiKey && !selectedPlace) {
          const fallback = getSafeFallbackPlace(value);
          if (fallback) onChange(fallback.displayAddress, fallback);
        }
      }}
      className="mt-1 w-full min-w-0 rounded-lg border border-black/15 bg-white px-3 py-3 focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/30"
    />
    {!apiKey && <datalist id={fallbackListId}>{fallbackOptions.map((option) => <option key={option} value={option}/>)}</datalist>}
    {error && <span id={`${id}-error`} className="mt-1 block text-xs text-red-700">{error}</span>}
    {process.env.NODE_ENV !== "production" && !apiKey && <span className="mt-1 block text-xs text-black/55">Google Places is not configured; supported locations remain available.</span>}
    {apiKey && !placesEnabled && <span className="sr-only" aria-live="polite">Address suggestions are loading.</span>}
  </label>;
}
