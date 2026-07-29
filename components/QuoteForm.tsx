"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { formatGBP, getIllustrativeFare, type VehicleType } from "@/lib/pricing";
import { testJourneys } from "@/lib/journeys";

const vehicles: {value:VehicleType;label:string}[]=[{value:"saloon",label:"Saloon"},{value:"estate",label:"Estate"},{value:"mpv",label:"MPV"},{value:"executive",label:"Executive"},{value:"large-mpv",label:"Large MPV"}];

export function QuoteForm({compact=false}:{compact?:boolean}){
 const [journeyId,setJourneyId]=useState(testJourneys[0].id); const [vehicle,setVehicle]=useState<VehicleType>("saloon"); const [show,setShow]=useState(false);
 const journey=useMemo(()=>testJourneys.find(j=>j.id===journeyId) ?? testJourneys[0],[journeyId]);
 const fare=getIllustrativeFare(journey.distanceMiles,vehicle);
 return <div className="rounded-2xl bg-white p-5 text-ink shadow-premium sm:p-7">
  <div className={`grid gap-4 ${compact?"lg:grid-cols-4":"md:grid-cols-2"}`}>
   <label className="text-sm font-medium">Pickup address<select value={journeyId} onChange={e=>{setJourneyId(e.target.value);setShow(false)}} className="mt-1 w-full rounded-lg border border-black/15 bg-white px-3 py-3">{testJourneys.map(j=><option key={j.id} value={j.id}>{j.pickup}</option>)}</select></label>
   <label className="text-sm font-medium">Drop-off airport or address<input readOnly value={journey.destination} className="mt-1 w-full rounded-lg border border-black/15 bg-stone-50 px-3 py-3"/></label>
   <label className="text-sm font-medium">Journey date<input type="date" className="mt-1 w-full rounded-lg border border-black/15 px-3 py-3"/></label>
   <label className="text-sm font-medium">Journey time<input type="time" className="mt-1 w-full rounded-lg border border-black/15 px-3 py-3"/></label>
   <label className="text-sm font-medium">Vehicle type<select value={vehicle} onChange={e=>setVehicle(e.target.value as VehicleType)} className="mt-1 w-full rounded-lg border border-black/15 px-3 py-3">{vehicles.map(v=><option key={v.value} value={v.value}>{v.label}</option>)}</select></label>
   <label className="text-sm font-medium">Passengers<input type="number" min="1" defaultValue="1" className="mt-1 w-full rounded-lg border border-black/15 px-3 py-3"/></label>
   <label className="text-sm font-medium">Luggage<input type="number" min="0" defaultValue="1" className="mt-1 w-full rounded-lg border border-black/15 px-3 py-3"/></label>
   <label className="text-sm font-medium">Journey type<select className="mt-1 w-full rounded-lg border border-black/15 px-3 py-3"><option>One-way</option><option>Return</option></select></label>
  </div>
  <button onClick={()=>setShow(true)} className="mt-5 w-full rounded-lg bg-gold-500 px-6 py-4 font-semibold text-black hover:bg-gold-400">Calculate Illustrative Fare</button>
  {show&&<div className="mt-6 rounded-xl border border-gold-500/30 bg-cream p-5"><div className="grid gap-3 sm:grid-cols-2"><div><p className="text-xs uppercase tracking-wider text-black/50">Journey</p><p className="font-semibold">{journey.pickup} → {journey.destination}</p></div><div><p className="text-xs uppercase tracking-wider text-black/50">Distance</p><p className="font-semibold">{journey.distanceMiles} miles</p></div><div><p className="text-xs uppercase tracking-wider text-black/50">Estimated journey time</p><p className="font-semibold">{journey.estimatedTime}</p></div><div><p className="text-xs uppercase tracking-wider text-black/50">Selected vehicle</p><p className="font-semibold">{vehicles.find(v=>v.value===vehicle)?.label}</p></div></div><div className="mt-5 flex flex-col justify-between gap-4 border-t border-black/10 pt-5 sm:flex-row sm:items-end"><div><p className="text-sm text-black/60">Illustrative estimated fare</p><p className="font-serif text-4xl font-semibold">{formatGBP(fare)}</p><p className="mt-1 text-xs text-black/55">Development estimate only. The final fare will depend on verified journey details.</p></div><Link href="/book-now" className="rounded-lg bg-ink px-5 py-3 text-center font-semibold text-white">Continue to Book</Link></div></div>}
 </div>
}
