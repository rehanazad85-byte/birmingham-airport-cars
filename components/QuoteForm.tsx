"use client";
import { useCallback, useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { calculateFinalFare, formatGBP, getIllustrativeFare, getRouteAwareIllustrativeFare, getVehicleAdjustedFixedFare, type FareCalculation, type VehicleType } from "@/lib/pricing";
import { testJourneys } from "@/lib/journeys";
import { validateVehicleCapacity, vehicleCapacities } from "@/lib/vehicle-capacity";
import { getJourneyAirports, mapPlacesToJourney, type SelectedPlace } from "@/lib/places";
import { getJourneyAirportCharges, type BirminghamAccessOption } from "@/lib/airport-access";
import { formatLocalDate, validateAddressSelections, validateJourneyDateTime, type JourneyType, type QuoteFieldErrors } from "@/lib/quote-calculator";
import { PlacesAutocompleteInput } from "@/components/PlacesAutocompleteInput";

const vehicles: VehicleType[] = ["saloon", "estate", "mpv", "executive", "large-mpv"];
const pickups = ["Walsall", "Sutton Coldfield", "Wolverhampton"];
const destinations = ["Birmingham Airport", "Heathrow Airport"];

export function QuoteForm({compact=false}:{compact?:boolean}){
 const [pickup,setPickup]=useState(""); const [pickupPlace,setPickupPlace]=useState<SelectedPlace|null>(null); const [destination,setDestination]=useState(""); const [destinationPlace,setDestinationPlace]=useState<SelectedPlace|null>(null); const [journeyDate,setJourneyDate]=useState(""); const [journeyTime,setJourneyTime]=useState(""); const [vehicle,setVehicle]=useState<VehicleType>("saloon"); const [passengers,setPassengers]=useState(1); const [luggage,setLuggage]=useState(1); const [journeyType,setJourneyType]=useState<JourneyType>("one-way"); const [errors,setErrors]=useState<QuoteFieldErrors>({}); const [show,setShow]=useState(false);
 const [fareCalculation,setFareCalculation]=useState<FareCalculation|null>(null); const [routeDurationSeconds,setRouteDurationSeconds]=useState<number|null>(null); const [isCalculating,setIsCalculating]=useState(false); const [birminghamAccess,setBirminghamAccess]=useState<BirminghamAccessOption>("free");
 const [minimumJourneyDate,setMinimumJourneyDate]=useState("");
 useEffect(()=>setMinimumJourneyDate(formatLocalDate(new Date())),[]);
 const journey=pickupPlace&&destinationPlace?mapPlacesToJourney(testJourneys,pickupPlace,destinationPlace):undefined;
 const journeyAirports=pickupPlace&&destinationPlace?getJourneyAirports(pickupPlace,destinationPlace):{pickupAirport:null,destinationAirport:null};
 const birminghamDirection=journeyAirports.pickupAirport==="BHX"?"pickup":journeyAirports.destinationAirport==="BHX"?"drop-off":null;
 const capacity=vehicleCapacities[vehicle]; const capacityValidation=validateVehicleCapacity(vehicle,passengers,luggage);
 const resetResult=()=>{setShow(false);setFareCalculation(null);setRouteDurationSeconds(null)};
 const updatePickup=useCallback((value:string,place:SelectedPlace|null)=>{setPickup(value);setPickupPlace(place);setShow(false);setErrors(current=>({...current,pickup:undefined,journey:undefined}))},[]);
 const updateDestination=useCallback((value:string,place:SelectedPlace|null)=>{setDestination(value);setDestinationPlace(place);setShow(false);setErrors(current=>({...current,destination:undefined,journey:undefined}))},[]);
 const submit=async(event:FormEvent<HTMLFormElement>)=>{
  event.preventDefault();
  if(isCalculating)return;
  const nextErrors=validateAddressSelections({pickup:{inputValue:pickup,place:pickupPlace},destination:{inputValue:destination,place:destinationPlace},passengers,luggage});
  Object.assign(nextErrors,validateJourneyDateTime(journeyDate,journeyTime));
  if(!capacityValidation.valid)nextErrors.luggage=capacityValidation.message;
  setErrors(nextErrors);
  if(Object.keys(nextErrors).length>0||!pickupPlace||!destinationPlace)return resetResult();

  setIsCalculating(true);setShow(false);setFareCalculation(null);setRouteDurationSeconds(null);
  try{
   const response=await fetch("/api/route-distance",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({origin:{latitude:pickupPlace.latitude,longitude:pickupPlace.longitude},destination:{latitude:destinationPlace.latitude,longitude:destinationPlace.longitude}})});
   if(!response.ok)throw new Error("Route unavailable");
   const route=await response.json() as {distanceMiles?:unknown;durationSeconds?:unknown};
   if(typeof route.distanceMiles!=="number"||!Number.isFinite(route.distanceMiles)||route.distanceMiles<0||typeof route.durationSeconds!=="number"||!Number.isFinite(route.durationSeconds)||route.durationSeconds<0)throw new Error("Invalid route result");
   const vehicleAdjustedFare=journey?.fixedSaloonFare!==undefined?getVehicleAdjustedFixedFare(journey.fixedSaloonFare,vehicle):getRouteAwareIllustrativeFare(journey?.distanceMiles,route.distanceMiles,vehicle);
   const underlyingJourneyFare=journey?.fixedSaloonFare??getIllustrativeFare(journey?.distanceMiles??route.distanceMiles,"saloon");
   const airportCharges=getJourneyAirportCharges(journeyAirports.pickupAirport,journeyAirports.destinationAirport,birminghamAccess);
   setFareCalculation(calculateFinalFare(underlyingJourneyFare,vehicleAdjustedFare,airportCharges));
   setRouteDurationSeconds(route.durationSeconds);
  }catch{
   setFareCalculation(null);setRouteDurationSeconds(null);
  }finally{
   setIsCalculating(false);setShow(true);
  }
 };
 return <form onSubmit={submit} noValidate className="rounded-2xl bg-white p-5 text-ink shadow-premium sm:p-7">
  <div className={`grid gap-4 ${compact?"sm:grid-cols-2":"md:grid-cols-2"}`}>
   <PlacesAutocompleteInput label="Pickup address" value={pickup} selectedPlace={pickupPlace} onChange={updatePickup} error={errors.pickup} placeholder="Enter pickup address or postcode" fallbackOptions={pickups}/>
   <PlacesAutocompleteInput label="Drop-off airport or address" value={destination} selectedPlace={destinationPlace} onChange={updateDestination} error={errors.destination} placeholder="Enter airport, address or postcode" fallbackOptions={destinations}/>
   <label className="text-sm font-medium">Journey date<input type="date" min={minimumJourneyDate} value={journeyDate} onChange={e=>{setJourneyDate(e.currentTarget.value);resetResult();setErrors(current=>({...current,journeyDate:undefined,journeyTime:undefined}))}} aria-invalid={Boolean(errors.journeyDate)} className="mt-1 w-full rounded-lg border border-black/15 px-3 py-3"/>{errors.journeyDate&&<span className="mt-1 block text-xs text-red-700">{errors.journeyDate}</span>}</label>
   <label className="text-sm font-medium">Journey time<input type="time" value={journeyTime} onChange={e=>{setJourneyTime(e.currentTarget.value);resetResult();setErrors(current=>({...current,journeyTime:undefined}))}} aria-invalid={Boolean(errors.journeyTime)} className="mt-1 w-full rounded-lg border border-black/15 px-3 py-3"/>{errors.journeyTime&&<span className="mt-1 block text-xs text-red-700">{errors.journeyTime}</span>}</label>
   <label className="text-sm font-medium">Vehicle type<select value={vehicle} onChange={e=>{setVehicle(e.target.value as VehicleType);resetResult()}} className="mt-1 w-full rounded-lg border border-black/15 px-3 py-3">{vehicles.map(v=><option key={v} value={v}>{vehicleCapacities[v].label}</option>)}</select></label>
   <label className="text-sm font-medium">Passengers<input type="number" min="1" max={capacity.maxPassengers} step="1" value={passengers} onChange={e=>{setPassengers(e.currentTarget.valueAsNumber);resetResult()}} aria-invalid={Boolean(errors.passengers)} className="mt-1 w-full rounded-lg border border-black/15 px-3 py-3"/>{errors.passengers&&<span className="mt-1 block text-xs text-red-700">{errors.passengers}</span>}</label>
   <label className="text-sm font-medium">Luggage<input type="number" min="0" max={capacity.maxLargeSuitcases} step="1" value={luggage} onChange={e=>{setLuggage(e.currentTarget.valueAsNumber);resetResult()}} aria-invalid={Boolean(errors.luggage)} aria-describedby="capacity-message" className="mt-1 w-full rounded-lg border border-black/15 px-3 py-3"/>{errors.luggage&&<span className="mt-1 block text-xs text-red-700">{errors.luggage}</span>}</label>
   <label className="text-sm font-medium">Journey type<select value={journeyType} onChange={e=>{setJourneyType(e.target.value as JourneyType);resetResult()}} className="mt-1 w-full rounded-lg border border-black/15 px-3 py-3"><option value="one-way">One-way</option><option value="return">Return</option></select></label>
  </div>
  {birminghamDirection&&<fieldset className="mt-4 rounded-xl border border-black/10 bg-cream/60 p-4"><legend className="px-1 text-sm font-semibold">{birminghamDirection==="pickup"?"Airport collection":"Airport drop-off"}</legend><label className="mt-2 flex cursor-pointer gap-3"><input type="radio" name="birmingham-access" value="free" checked={birminghamAccess==="free"} onChange={()=>{setBirminghamAccess("free");resetResult()}}/><span><strong>{birminghamDirection==="pickup"?"Free Pick-up":"Free Drop-off"} — Included</strong><span className="block text-sm text-black/65">Approx. 5-minute walk {birminghamDirection==="pickup"?"from":"to"} the terminal.</span></span></label><label className="mt-3 flex cursor-pointer gap-3"><input type="radio" name="birmingham-access" value="drop-and-go" checked={birminghamAccess==="drop-and-go"} onChange={()=>{setBirminghamAccess("drop-and-go");resetResult()}}/><span><strong>Drop &amp; Go — +£8</strong><span className="block text-sm text-black/65">Convenient {birminghamDirection==="pickup"?"collection":"drop-off"} closer to the terminal.{birminghamDirection==="pickup"&&" Maximum 15-minute waiting period."}</span></span></label>{birminghamDirection==="pickup"&&<p className="mt-3 text-sm text-black/70">After collecting your luggage and clearing border control where applicable, contact your driver to coordinate collection.</p>}</fieldset>}
  {!capacityValidation.valid&&!errors.luggage&&<p id="capacity-message" role="alert" className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{capacityValidation.message}</p>}
  <button type="submit" disabled={isCalculating} className="mt-5 w-full rounded-lg bg-gold-500 px-6 py-4 font-semibold text-black hover:bg-gold-400 disabled:cursor-wait disabled:opacity-70">{isCalculating?"Calculating fare…":"Calculate estimated fare"}</button>
  {show&&fareCalculation===null&&<div className="mt-6 rounded-xl border border-gold-500/30 bg-cream p-5"><h2 className="font-serif text-2xl font-semibold">Quotation review required</h2><p className="mt-3">We can provide a confirmed quotation for this journey once the pickup and destination details have been reviewed.</p><div className="mt-4 flex flex-col gap-3 sm:flex-row"><Link href="/contact" className="rounded-lg bg-ink px-5 py-3 text-center font-semibold text-white">Request Booking</Link><a href="tel:+441212222222" className="rounded-lg border border-ink px-5 py-3 text-center font-semibold text-ink">Call Now</a></div></div>}
  {show&&fareCalculation!==null&&<div className="mt-6 rounded-xl border border-gold-500/30 bg-cream p-5"><h2 className="font-serif text-2xl font-semibold">Journey summary</h2><dl className="mt-4 grid gap-3 sm:grid-cols-2"><div><dt className="text-xs uppercase tracking-wider text-black/50">Pickup</dt><dd className="font-semibold">{pickupPlace?.displayAddress}</dd></div><div><dt className="text-xs uppercase tracking-wider text-black/50">Destination</dt><dd className="font-semibold">{destinationPlace?.displayAddress}</dd></div><div><dt className="text-xs uppercase tracking-wider text-black/50">Vehicle</dt><dd className="font-semibold">{capacity.label}</dd></div><div><dt className="text-xs uppercase tracking-wider text-black/50">Passenger count</dt><dd className="font-semibold">{passengers}</dd></div><div><dt className="text-xs uppercase tracking-wider text-black/50">Luggage</dt><dd className="font-semibold">{luggage} large suitcase{luggage===1?"":"s"}</dd></div><div><dt className="text-xs uppercase tracking-wider text-black/50">Journey type</dt><dd className="font-semibold">{journeyType==="return"?"Return":"One-way"}</dd></div><div><dt className="text-xs uppercase tracking-wider text-black/50">Estimated fare</dt><dd className="font-serif text-3xl font-semibold">{formatGBP(fareCalculation.finalFare)}</dd>{fareCalculation.airportCharges.length>0&&<p className="mt-1 text-sm text-black/65">Airport access charge included.</p>}</div><div><dt className="text-xs uppercase tracking-wider text-black/50">Important notes</dt><dd className="text-sm">{journey?.estimatedTime??(routeDurationSeconds!==null?"Journey duration has been calculated from the selected addresses":"Journey duration will be reviewed before confirmation")}. {journeyType==="return"?"The estimate shown covers the outward journey; return details will be reviewed separately.":"Journey details will be reviewed before confirmation."}</dd></div></dl><p className="mt-5 border-t border-black/10 pt-5 text-sm font-semibold">This quotation is an estimate based on the information supplied.</p><div className="mt-4 flex flex-col gap-3 sm:flex-row"><Link href="/contact" className="rounded-lg bg-ink px-5 py-3 text-center font-semibold text-white">Request Booking</Link><a href="tel:+441212222222" className="rounded-lg border border-ink px-5 py-3 text-center font-semibold text-ink">Call Now</a></div><p className="mt-5 text-sm text-black/65">The final quotation is confirmed after the complete pickup address, destination, vehicle requirements and journey details have been reviewed.</p></div>}
 </form>
}
