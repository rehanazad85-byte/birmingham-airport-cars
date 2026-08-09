import { describe, expect, it, vi } from "vitest";
import { mountPlaceAutocomplete } from "../components/PlacesAutocompleteInput";

class MockAutocompleteElement extends EventTarget {
  includedRegionCodes: string[] = [];
  placeholder = "";
  value = "";
  className = "";
  attributes = new Map<string, string>();
  removed = false;
  setAttribute(name: string, value: string) { this.attributes.set(name, value); }
  parent: MockHost | null = null;
  remove() { this.removed = true; this.parent?.remove(this); }
}

class MockHost {
  children: MockAutocompleteElement[] = [];
  appendChild(element: MockAutocompleteElement) { this.children.push(element); element.parent = this; return element; }
  remove(element: MockAutocompleteElement) { this.children = this.children.filter((child) => child !== element); }
}

describe("Places API (New) autocomplete initialisation", () => {
  it("mounts one GB-restricted widget and cleans it up", () => {
    const element = new MockAutocompleteElement();
    const host = new MockHost();
    const mounted = mountPlaceAutocomplete({ host: host as unknown as HTMLElement, library: { PlaceAutocompleteElement: class { constructor() { return element; } } as never }, label: "Pickup address", placeholder: "Enter pickup", value: "", onInput: vi.fn(), onPlace: vi.fn() });

    expect(host.children).toEqual([element]);
    expect(element.includedRegionCodes).toEqual(["gb"]);
    expect(element.attributes.get("aria-label")).toBe("Pickup address");
    mounted.destroy();
    expect(element.removed).toBe(true);
    expect(host.children).toEqual([]);
  });

  it("retains each independently mounted widget until its own lifecycle cleanup", () => {
    const pickupElement = new MockAutocompleteElement();
    const destinationElement = new MockAutocompleteElement();
    const pickupHost = new MockHost();
    const destinationHost = new MockHost();
    const library = { PlaceAutocompleteElement: class {
      constructor() { return pickupHost.children.length === 0 ? pickupElement : destinationElement; }
    } as never };

    const pickup = mountPlaceAutocomplete({ host: pickupHost as unknown as HTMLElement, library, label: "Pickup address", placeholder: "Enter pickup", value: "", onInput: vi.fn(), onPlace: vi.fn() });
    expect(pickupHost.children).toEqual([pickupElement]);

    const destination = mountPlaceAutocomplete({ host: destinationHost as unknown as HTMLElement, library: { PlaceAutocompleteElement: class { constructor() { return destinationElement; } } as never }, label: "Destination", placeholder: "Enter destination", value: "", onInput: vi.fn(), onPlace: vi.fn() });
    expect(pickupHost.children).toEqual([pickupElement]);
    expect(destinationHost.children).toEqual([destinationElement]);

    destination.destroy();
    expect(pickupHost.children).toEqual([pickupElement]);
    expect(destinationHost.children).toEqual([]);
    pickup.destroy();
  });

  it("uses gmp-select, fetches fields and returns structured place data", async () => {
    const element = new MockAutocompleteElement();
    const onPlace = vi.fn();
    const fetchFields = vi.fn().mockResolvedValue(undefined);
    const selectedPlace = { fetchFields, formattedAddress: "Birmingham Airport, Birmingham B26 3QJ, UK", id: "bhx", displayName: "Birmingham Airport", types: ["airport"], location: { lat: () => 52.4524, lng: () => -1.7435 }, addressComponents: [{ longText: "Birmingham", shortText: "Birmingham", types: ["postal_town"] }, { longText: "B26 3QJ", shortText: "B26 3QJ", types: ["postal_code"] }, { longText: "United Kingdom", shortText: "GB", types: ["country"] }] };
    mountPlaceAutocomplete({ host: { appendChild: vi.fn() } as unknown as HTMLElement, library: { PlaceAutocompleteElement: class { constructor() { return element; } } as never }, label: "Destination", placeholder: "Enter destination", value: "", onInput: vi.fn(), onPlace });

    const event = new Event("gmp-select") as Event & { placePrediction: { toPlace(): typeof selectedPlace } };
    event.placePrediction = { toPlace: () => selectedPlace };
    element.dispatchEvent(event);
    await vi.waitFor(() => expect(onPlace).toHaveBeenCalledOnce());

    expect(fetchFields).toHaveBeenCalledWith({ fields: ["formattedAddress", "location", "addressComponents", "displayName", "id", "types"] });
    expect(onPlace).toHaveBeenCalledWith(expect.objectContaining({ placeId: "bhx", postcode: "B26 3QJ", country: "GB" }));
  });
});
