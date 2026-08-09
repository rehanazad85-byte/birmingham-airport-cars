"use client";

import { useEffect, useId, useRef } from "react";
import { getSafeFallbackPlace, normaliseGooglePlaceNew, type GooglePlaceNewLike, type SelectedPlace } from "@/lib/places";

interface PlaceNew extends GooglePlaceNewLike {
  fetchFields(options: { fields: string[] }): Promise<void>;
}

interface PlacePrediction {
  toPlace(): PlaceNew;
}

interface PlacePredictionSelectEvent extends Event {
  placePrediction: PlacePrediction;
}

interface PlaceAutocompleteElement extends HTMLElement {
  includedRegionCodes: string[];
  placeholder: string;
  value: string;
}

interface PlacesLibrary {
  PlaceAutocompleteElement: new () => PlaceAutocompleteElement;
}

declare global {
  interface Window {
    google?: {
      maps: { importLibrary(name: "places"): Promise<PlacesLibrary> };
    };
    __bacGooglePlacesPromise?: Promise<void>;
    __bacGoogleMapsReady?: () => void;
  }
}

export function loadGoogleMaps(apiKey: string): Promise<void> {
  if (window.google?.maps.importLibrary) return Promise.resolve();
  if (window.__bacGooglePlacesPromise) return window.__bacGooglePlacesPromise;
  window.__bacGooglePlacesPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    const finish = () => {
      delete window.__bacGoogleMapsReady;
      if (window.google?.maps.importLibrary) resolve();
      else reject(new Error("Google Maps could not be initialised"));
    };
    window.__bacGoogleMapsReady = finish;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}&loading=async&callback=__bacGoogleMapsReady`;
    script.async = true;
    script.onerror = () => {
      delete window.__bacGoogleMapsReady;
      reject(new Error("Places could not be loaded"));
    };
    document.head.appendChild(script);
  });
  return window.__bacGooglePlacesPromise;
}

interface MountOptions {
  host: HTMLElement;
  library: PlacesLibrary;
  label: string;
  placeholder: string;
  value: string;
  onInput(value: string): void;
  onPlace(place: SelectedPlace): void;
}

export function mountPlaceAutocomplete({ host, library, label, placeholder, value, onInput, onPlace }: MountOptions) {
  const element = new library.PlaceAutocompleteElement();
  element.includedRegionCodes = ["gb"];
  element.placeholder = placeholder;
  element.setAttribute("aria-label", label);
  element.className = "bac-place-autocomplete";
  element.value = value;

  const handleInput = () => onInput(element.value);
  const handleSelect = async (event: Event) => {
    const place = (event as PlacePredictionSelectEvent).placePrediction.toPlace();
    await place.fetchFields({ fields: ["formattedAddress", "location", "addressComponents", "displayName", "id", "types"] });
    const selected = normaliseGooglePlaceNew(place);
    if (selected) onPlace(selected);
  };
  element.addEventListener("input", handleInput);
  element.addEventListener("gmp-select", handleSelect);
  host.appendChild(element);

  return {
    element,
    destroy() {
      element.removeEventListener("input", handleInput);
      element.removeEventListener("gmp-select", handleSelect);
      element.remove();
    },
  };
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
  const hostRef = useRef<HTMLDivElement>(null);
  const id = useId();
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const autocompleteRef = useRef<ReturnType<typeof mountPlaceAutocomplete> | null>(null);
  const initialValueRef = useRef(value);
  const onChangeRef = useRef(onChange);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    if (!apiKey || !hostRef.current) return;
    let cancelled = false;
    loadGoogleMaps(apiKey).then(async () => {
      if (cancelled || !hostRef.current || !window.google) return;
      const library = await window.google.maps.importLibrary("places");
      if (cancelled || !hostRef.current || autocompleteRef.current) return;
      autocompleteRef.current = mountPlaceAutocomplete({
        host: hostRef.current, library, label, placeholder, value: initialValueRef.current,
        onInput: (nextValue) => onChangeRef.current(nextValue, null),
        onPlace: (place) => onChangeRef.current(place.displayAddress, place),
      });
    }).catch(() => undefined);
    return () => {
      cancelled = true;
      autocompleteRef.current?.destroy();
      autocompleteRef.current = null;
    };
  }, [apiKey, label, placeholder]);

  useEffect(() => {
    if (autocompleteRef.current && autocompleteRef.current.element.value !== value) {
      autocompleteRef.current.element.value = value;
    }
  }, [value]);

  const fallbackListId = `${id}-fallback`;
  return <label htmlFor={!apiKey ? id : undefined} className="text-sm font-medium">{label}
    {apiKey ? <div ref={hostRef} className="bac-place-autocomplete-host mt-1 min-w-0" /> : <input
      id={id}
      type="text"
      value={value}
      placeholder={placeholder}
      autoComplete="off"
      list={fallbackListId}
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
    />}
    {!apiKey && <datalist id={fallbackListId}>{fallbackOptions.map((option) => <option key={option} value={option}/>)}</datalist>}
    {error && <span id={`${id}-error`} className="mt-1 block text-xs text-red-700">{error}</span>}
    {process.env.NODE_ENV !== "production" && !apiKey && <span className="mt-1 block text-xs text-black/55">Google Places is not configured; supported locations remain available.</span>}
    {apiKey && <span className="sr-only" aria-live="polite">Address suggestions load in the field above.</span>}
  </label>;
}
