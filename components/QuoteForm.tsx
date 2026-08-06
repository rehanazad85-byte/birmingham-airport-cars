"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { formatGBP, getIllustrativeFare, type VehicleType } from "@/lib/pricing";
import { testJourneys } from "@/lib/journeys";
import { validateVehicleCapacity, vehicleCapacities } from "@/lib/vehicle-capacity";

const vehicles: VehicleType[] = ["saloon", "estate", "mpv", "executive", "large-mpv"];

export function QuoteForm({compact=false}:{compact?:boolean}){
 const [journeyId,setJourneyId]=useState(testJourneys[0].id); const [vehicle,setVehicle]=useState<VehicleType>("saloon"); const [passengers,setPassengers]=useState(1); const [luggage,setLuggage]=useState(1); const [show,setShow]=useState(false);
 const journey=useMemo(()=>testJourneys.find(j=>j.id===journeyId) ?? testJourneys[0],[journeyId]);
 const capacity=vehicleCapacities[vehicle];
 const capacityValidation=validateVehicleCapacity(vehicle,passengers,luggage);
 const fare=capacityValidation.valid ? getIllustrativeFare(journey.distanceMiles,vehicle) : null;
 return <div className="rounded-2xl bg-white p-5 text-ink shadow-premium sm:p-7">
  <div className={`grid gap-4 ${compact?"lg:grid-cols-4":"md:grid-cols-2"}`}>
   <label className="text-sm font-medium">Pickup address<select value={journeyId} onChange={e=>{setJourneyId(e.target.value);setShow(false)}} className="mt-1 w-full rounded-lg border border-black/15 bg-white px-3 py-3">{testJourneys.map(j=><option key={j.id} value={j.id}>{j.pickup}</option>)}</select></label>
   <label className="text-sm font-medium">Drop-off airport or address<input readOnly value={journey.destination} className="mt-1 w-full rounded-lg border border-black/15 bg-stone-50 px-3 py-3"/></label>
   <label className="text-sm font-medium">Journey date<input type="date" className="mt-1 w-full rounded-lg border border-black/15 px-3 py-3"/></label>
   <label className="text-sm font-medium">Journey time<input type="time" className="mt-1 w-full rounded-lg border border-black/15 px-3 py-3"/></label>
   <label className="text-sm font-medium">Vehicle type<select value={vehicle} onChange={e=>setVehicle(e.target.value as VehicleType)} className="mt-1 w-full rounded-lg border border-black/15 px-3 py-3">{vehicles.map(v=><option key={v} value={v}>{vehicleCapacities[v].label}</option>)}</select></label>
   <label className="text-sm font-medium">Passengers<input type="number" min="1" max={capacity.maxPassengers} step="1" value={passengers} onChange={e=>setPassengers(e.currentTarget.valueAsNumber)} className="mt-1 w-full rounded-lg border border-black/15 px-3 py-3"/></label>
   <label className="text-sm font-medium">Luggage<input type="number" min="0" max={capacity.maxLargeSuitcases} step="1" value={luggage} onChange={e=>setLuggage(e.currentTarget.valueAsNumber)} aria-describedby="capacity-message" className="mt-1 w-full rounded-lg border border-black/15 px-3 py-3"/></label>
   <label className="text-sm font-medium">Journey type<select className="mt-1 w-full rounded-lg border border-black/15 px-3 py-3"><option>One-way</option><option>Return</option></select></label>
  </div>
  {!capacityValidation.valid&&<p id="capacity-message" role="alert" className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{capacityValidation.message}</p>}
  <button onClick={()=>setShow(capacityValidation.valid)} className="mt-5 w-full rounded-lg bg-gold-500 px-6 py-4 font-semibold text-black hover:bg-gold-400">Check journey estimate</button>
  {show&&fare!==null&&<div className="mt-6 rounded-xl border border-gold-500/30 bg-cream p-5"><div className="grid gap-3 sm:grid-cols-2"><div><p className="text-xs uppercase tracking-wider text-black/50">Journey</p><p className="font-semibold">{journey.pickup} → {journey.destination}</p></div><div><p className="text-xs uppercase tracking-wider text-black/50">Distance</p><p className="font-semibold">{journey.distanceMiles} miles</p></div><div><p className="text-xs uppercase tracking-wider text-black/50">Estimated journey time</p><p className="font-semibold">{journey.estimatedTime}</p></div><div><p className="text-xs uppercase tracking-wider text-black/50">Selected vehicle</p><p className="font-semibold">{capacity.label}</p></div></div><div className="mt-5 flex flex-col justify-between gap-4 border-t border-black/10 pt-5 sm:flex-row sm:items-end"><div><p className="text-sm text-black/60">Journey estimate</p><p className="font-serif text-4xl font-semibold">{formatGBP(fare)}</p><p className="mt-1 text-xs text-black/55">This is an indication for the selected journey. Request a confirmed quotation using your complete journey details.</p></div><Link href="/book-now" className="rounded-lg bg-ink px-5 py-3 text-center font-semibold text-white">Request a quotation</Link></div></div>}
 </div>
}
