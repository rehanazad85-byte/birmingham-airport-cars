"use client";
import { useState, type FormEvent } from "react";
import Link from "next/link";
import { formatGBP, getIllustrativeFare, type VehicleType } from "@/lib/pricing";
import { testJourneys } from "@/lib/journeys";
import { validateVehicleCapacity, vehicleCapacities } from "@/lib/vehicle-capacity";
import {
 findJourney,
 uniqueJourneyValues,
 validateJourneySelection,
 type JourneyType,
 type QuoteFieldErrors,
} from "@/lib/quote-calculator";

const vehicles: VehicleType[] = ["saloon", "estate", "mpv", "executive", "large-mpv"];

export function QuoteForm({compact=false}:{compact?:boolean}){
 const [pickup,setPickup]=useState(""); const [destination,setDestination]=useState(""); const [vehicle,setVehicle]=useState<VehicleType>("saloon"); const [passengers,setPassengers]=useState(1); const [luggage,setLuggage]=useState(1); const [journeyType,setJourneyType]=useState<JourneyType>("one-way"); const [errors,setErrors]=useState<QuoteFieldErrors>({}); const [show,setShow]=useState(false);
 const journey=findJourney(testJourneys,pickup,destination);
 const capacity=vehicleCapacities[vehicle];
 const capacityValidation=validateVehicleCapacity(vehicle,passengers,luggage);
 const fare=journey&&capacityValidation.valid ? getIllustrativeFare(journey.distanceMiles,vehicle) : null;
 const resetResult=()=>setShow(false);
 const submit=(event:FormEvent<HTMLFormElement>)=>{event.preventDefault();const nextErrors=validateJourneySelection(testJourneys,{pickup,destination,passengers,luggage});if(!capacityValidation.valid)nextErrors.luggage=capacityValidation.message;setErrors(nextErrors);setShow(Object.keys(nextErrors).length===0&&capacityValidation.valid)};
 return <form onSubmit={submit} noValidate className="rounded-2xl bg-white p-5 text-ink shadow-premium sm:p-7">
  <div className={`grid gap-4 ${compact?"lg:grid-cols-4":"md:grid-cols-2"}`}>
   <label className="text-sm font-medium">Pickup address<select value={pickup} onChange={e=>{setPickup(e.target.value);resetResult()}} aria-invalid={Boolean(errors.pickup)} className="mt-1 w-full rounded-lg border border-black/15 bg-white px-3 py-3"><option value="">Select pickup</option>{uniqueJourneyValues(testJourneys,"pickup").map(value=><option key={value} value={value}>{value}</option>)}</select>{errors.pickup&&<span className="mt-1 block text-xs text-red-700">{errors.pickup}</span>}</label>
   <label className="text-sm font-medium">Drop-off airport or address<select value={destination} onChange={e=>{setDestination(e.target.value);resetResult()}} aria-invalid={Boolean(errors.destination)} className="mt-1 w-full rounded-lg border border-black/15 bg-white px-3 py-3"><option value="">Select destination</option>{uniqueJourneyValues(testJourneys,"destination").map(value=><option key={value} value={value}>{value}</option>)}</select>{errors.destination&&<span className="mt-1 block text-xs text-red-700">{errors.destination}</span>}</label>
   <label className="text-sm font-medium">Journey date<input type="date" className="mt-1 w-full rounded-lg border border-black/15 px-3 py-3"/></label>
   <label className="text-sm font-medium">Journey time<input type="time" className="mt-1 w-full rounded-lg border border-black/15 px-3 py-3"/></label>
   <label className="text-sm font-medium">Vehicle type<select value={vehicle} onChange={e=>{setVehicle(e.target.value as VehicleType);resetResult()}} className="mt-1 w-full rounded-lg border border-black/15 px-3 py-3">{vehicles.map(v=><option key={v} value={v}>{vehicleCapacities[v].label}</option>)}</select></label>
   <label className="text-sm font-medium">Passengers<input type="number" min="1" max={capacity.maxPassengers} step="1" value={passengers} onChange={e=>{setPassengers(e.currentTarget.valueAsNumber);resetResult()}} aria-invalid={Boolean(errors.passengers)} className="mt-1 w-full rounded-lg border border-black/15 px-3 py-3"/>{errors.passengers&&<span className="mt-1 block text-xs text-red-700">{errors.passengers}</span>}</label>
   <label className="text-sm font-medium">Luggage<input type="number" min="0" max={capacity.maxLargeSuitcases} step="1" value={luggage} onChange={e=>{setLuggage(e.currentTarget.valueAsNumber);resetResult()}} aria-invalid={Boolean(errors.luggage)} aria-describedby="capacity-message" className="mt-1 w-full rounded-lg border border-black/15 px-3 py-3"/>{errors.luggage&&<span className="mt-1 block text-xs text-red-700">{errors.luggage}</span>}</label>
   <label className="text-sm font-medium">Journey type<select value={journeyType} onChange={e=>{setJourneyType(e.target.value as JourneyType);resetResult()}} className="mt-1 w-full rounded-lg border border-black/15 px-3 py-3"><option value="one-way">One-way</option><option value="return">Return</option></select></label>
  </div>
  {(errors.journey||(!capacityValidation.valid&&!errors.luggage))&&<p id="capacity-message" role="alert" className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{errors.journey??capacityValidation.message}</p>}
  <button type="submit" className="mt-5 w-full rounded-lg bg-gold-500 px-6 py-4 font-semibold text-black hover:bg-gold-400">Calculate estimated fare</button>
  {show&&journey&&fare!==null&&<div className="mt-6 rounded-xl border border-gold-500/30 bg-cream p-5"><h2 className="font-serif text-2xl font-semibold">Journey summary</h2><dl className="mt-4 grid gap-3 sm:grid-cols-2"><div><dt className="text-xs uppercase tracking-wider text-black/50">Pickup</dt><dd className="font-semibold">{journey.pickup}</dd></div><div><dt className="text-xs uppercase tracking-wider text-black/50">Destination</dt><dd className="font-semibold">{journey.destination}</dd></div><div><dt className="text-xs uppercase tracking-wider text-black/50">Vehicle</dt><dd className="font-semibold">{capacity.label}</dd></div><div><dt className="text-xs uppercase tracking-wider text-black/50">Passenger count</dt><dd className="font-semibold">{passengers}</dd></div><div><dt className="text-xs uppercase tracking-wider text-black/50">Luggage</dt><dd className="font-semibold">{luggage} large suitcase{luggage===1?"":"s"}</dd></div><div><dt className="text-xs uppercase tracking-wider text-black/50">Journey type</dt><dd className="font-semibold">{journeyType==="return"?"Return":"One-way"}</dd></div><div><dt className="text-xs uppercase tracking-wider text-black/50">Estimated fare</dt><dd className="font-serif text-3xl font-semibold">{formatGBP(fare)}</dd></div><div><dt className="text-xs uppercase tracking-wider text-black/50">Important notes</dt><dd className="text-sm">{journey.estimatedTime}. {journeyType==="return"?"The estimate shown covers the outward journey; return details will be reviewed separately.":"Journey details will be reviewed before confirmation."}</dd></div></dl><p className="mt-5 border-t border-black/10 pt-5 text-sm font-semibold">This quotation is an estimate based on the information supplied.</p><div className="mt-4 flex flex-col gap-3 sm:flex-row"><Link href="/contact" className="rounded-lg bg-ink px-5 py-3 text-center font-semibold text-white">Request Booking</Link><a href="tel:+441212222222" className="rounded-lg border border-ink px-5 py-3 text-center font-semibold text-ink">Call Now</a></div><p className="mt-5 text-sm text-black/65">The final quotation is confirmed after the complete pickup address, destination, vehicle requirements and journey details have been reviewed.</p></div>}
 </form>
}
