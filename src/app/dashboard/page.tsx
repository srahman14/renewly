"use client";

import { useEffect, useMemo, useState } from "react";
import ContractForm from "@/components/ContractForm";
import Navbar from "@/components/DashboardNavbar";

type Status = "active" | "flagged" | "cancelled";
type Cycle = "Monthly" | "Quarterly" | "Annual";

export interface Contract {
  id: string;
  company: string;
  name: string;
  owner: string;
  team: string;
  monthlySpend: number;
  cycle: Cycle;
  renewsOn: string;
  noticeDays: number;
  deadline: string;
  daysLeft: number;
  status: Status;
  category: string;
}

const STATUS_LABEL: Record<Status, string> = {
  active: "Tracked",
  flagged: "Flagged",
  cancelled: "Cancelled",
};


function urgency(daysLeft: number): "critical" | "soon" | "clear" {
  if (daysLeft <= 21) return "critical";
  if (daysLeft <= 60) return "soon";
  return "clear";
}


function currency(value:number){
  return `£${value.toLocaleString("en-GB")}`;
}


function calculateDaysLeft(date:string){

  const today = new Date();
  const renewal = new Date(date);

  const difference =
    renewal.getTime() - today.getTime();

  return Math.max(
    0,
    Math.ceil(
      difference / (1000 * 60 * 60 * 24)
    )
  );
}


const TABS: {key:"all"|Status;label:string}[] = [
  {
    key:"all",
    label:"All"
  },
  {
    key:"active",
    label:"Tracked"
  },
  {
    key:"flagged",
    label:"Flagged"
  },
  {
    key:"cancelled",
    label:"Cancelled"
  }
];


export default function DashboardPage(){

  const [contracts,setContracts] =
    useState<Contract[]>([]);


  const [showForm,setShowForm] =
    useState(false);


  const [editingContract,setEditingContract] =
    useState<Contract | null>(null);


  const [tab,setTab] =
    useState<(typeof TABS)[number]["key"]>("all");


  const [query,setQuery] =
    useState("");


  /*
    Load saved contracts.
    Empty for a new customer.
  */

  useEffect(()=>{

    const saved =
      localStorage.getItem("renewal-contracts");


    if(saved){
      setContracts(JSON.parse(saved));
    }

  },[]);



  /*
    Save whenever contracts change.
  */

  useEffect(()=>{

    localStorage.setItem(
      "renewal-contracts",
      JSON.stringify(contracts)
    );

  },[contracts]);



  function saveContract(contract:Contract){

    setContracts(previous=>{

      const exists =
        previous.some(
          item=>item.id === contract.id
        );


      if(exists){

        return previous.map(item=>
          item.id === contract.id
          ? contract
          : item
        );

      }


      return [
        ...previous,
        contract
      ];

    });


    setShowForm(false);
    setEditingContract(null);

  }



  function deleteContract(id:string){

    setContracts(previous=>
      previous.filter(
        item=>item.id !== id
      )
    );

  }



  const filtered =
    useMemo(()=>{

      return contracts
      .filter(contract=>{

        const matchesTab =
          tab === "all" ||
          contract.status === tab;


        const matchesSearch =
          query.length === 0 ||
          contract.name
          .toLowerCase()
          .includes(
            query.toLowerCase()
          ) ||
          contract.company
          .toLowerCase()
          .includes(
            query.toLowerCase()
          );


        return matchesTab && matchesSearch;

      })
      .sort(
        (a,b)=>
        a.daysLeft-b.daysLeft
      );


    },[
      contracts,
      tab,
      query
    ]);



  const totals =
    useMemo(()=>{

      const active =
        contracts.filter(
          c=>c.status !== "cancelled"
        );


      return {

        count:
          active.length,


        monthlySpend:
          active.reduce(
            (sum,c)=>
            sum+c.monthlySpend,
            0
          ),


        upcoming:
          active.filter(
            c=>c.daysLeft <= 30
          ).length,


        flagged:
          contracts.filter(
            c=>c.status==="flagged"
          ).length

      };


    },[contracts]);
    function StatCard({
  label,
  value,
  footnote,
}: {
  label:string;
  value:string;
  footnote?:string;
}) {

  return (
    <div className="bg-paper px-6 py-8">
      <dt className="sr-only">
        {label}
      </dt>

      <dd className="font-mono text-3xl text-ink sm:text-[2.25rem]">
        {value}
      </dd>

      <p className="mt-3 font-body text-sm leading-relaxed text-ink/60">
        {label}
      </p>

      {footnote && (
        <p className="mt-1 font-mono text-[11px] text-ink/35">
          {footnote}
        </p>
      )}

    </div>
  );
}



function DeadlinePill({
  daysLeft
}:{
  daysLeft:number
}){

  const level = urgency(daysLeft);


  if(level==="critical"){

    return (
      <span className="inline-flex items-center gap-1.5 rounded-[4px] bg-navy px-2.5 py-1 font-mono text-[11px] text-amber-light">
        {daysLeft}d left
      </span>
    );

  }


  if(level==="soon"){

    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber/10 px-2.5 py-1 font-mono text-[11px] text-amber">
        {daysLeft}d left
      </span>
    );

  }


  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-teal/10 px-2.5 py-1 font-mono text-[11px] text-teal">
      {daysLeft}d left
    </span>
  );

}



function StatusDot({
  status
}:{
  status:Status
}){

  const color =
    status==="active"
    ? "bg-teal"
    : status==="flagged"
    ? "bg-amber"
    : "bg-ink/25";


  return (
    <span
      className={`inline-block h-1.5 w-1.5 rounded-full ${color}`}
    />
  );

}




function DeadlineCard({
  contract
}:{
  contract:Contract
}){


return (

<div className="rounded-md border border-ink/10 bg-white shadow-[0_20px_45px_-25px_rgba(18,20,28,0.35)]">


<div className="flex items-center justify-between px-5 pt-4">

<span className="font-mono text-[11px] uppercase tracking-[0.1em] text-ink/40">
{contract.team}
</span>


<span className="rounded-full bg-teal/10 px-2 py-0.5 font-mono text-[11px] text-teal">
{STATUS_LABEL[contract.status]}
</span>


</div>



<div className="px-5 pb-4 pt-2">

<p className="font-display text-lg font-medium text-ink">
{contract.company}
</p>


<p className="mt-1 font-body text-sm text-ink/50">
{contract.name}
</p>


<p className="mt-1 font-body text-sm text-ink/50">
Owner: {contract.owner}
</p>


</div>



<div className="perforated-edge"/>



<div className="mx-4 my-4 rounded-[4px] bg-navy px-4 py-3">


<p className="font-mono text-[10px] uppercase tracking-[0.1em] text-amber-light/80">
Last safe cancel date
</p>



<div className="mt-1 flex items-baseline justify-between">

<p className="font-mono text-base text-paper">
{contract.deadline}
</p>


<p className="font-mono text-[11px] text-amber-light">
{contract.daysLeft}d left
</p>


</div>


</div>


</div>

);

}
return (
<div className="min-h-screen bg-paper-muted">

<Navbar />


<main className="mx-auto max-w-7xl px-6 py-10 md:px-10 md:py-14">


{/* Header */}

<div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">

<div>

<p className="font-mono text-[12px] uppercase tracking-[0.1em] text-ink/45">
Overview
</p>


<h1 className="mt-3 font-display text-3xl font-medium tracking-tight text-ink sm:text-4xl">
Good morning.
</h1>


<p className="mt-2 max-w-lg font-body text-[15px] leading-relaxed text-ink/60">

{contracts.length === 0
? "Start tracking your subscriptions and avoid unexpected renewals."
: `${totals.upcoming} contract${totals.upcoming === 1 ? "" : "s"} need a decision in the next 30 days.`}

</p>

</div>



<button
onClick={()=>setShowForm(true)}
className="inline-block self-start rounded-[4px] bg-amber px-5 py-2.5 font-body text-[15px] font-medium text-ink transition-colors hover:bg-amber-light"
>
+ Add contract
</button>


</div>




{/* Empty state */}


{contracts.length === 0 ? (

<div className="mt-14 rounded-md border border-line bg-white px-6 py-16 text-center">


<h2 className="font-display text-2xl font-medium text-ink">
Welcome to Renewal Radar
</h2>


<p className="mx-auto mt-3 max-w-md font-body text-sm text-ink/60">

You don't have any contracts yet.
Add your first subscription to start tracking renewals.

</p>



<button
onClick={()=>setShowForm(true)}
className="mt-6 rounded-[4px] bg-ink px-5 py-3 font-body text-sm font-medium text-paper hover:bg-navy"
>
Add your first contract
</button>


</div>


) : (


<>


{/* Stats */}


<dl className="mt-10 grid grid-cols-1 gap-px overflow-hidden rounded-md border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">


<StatCard
label="Tracked contracts"
value={String(totals.count)}
/>


<StatCard
label="Monthly recurring spend"
value={currency(totals.monthlySpend)}
footnote="normalised monthly cost"
/>


<StatCard
label="Deadlines in 30 days"
value={String(totals.upcoming)}
/>


<StatCard
label="Flagged for review"
value={String(totals.flagged)}
/>


</dl>





{/* Closest deadlines */}


<section className="mt-14">


<h2 className="font-display text-xl font-medium text-ink">
Closest deadlines
</h2>



<div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">


{contracts
.filter(c=>c.status!=="cancelled")
.sort((a,b)=>a.daysLeft-b.daysLeft)
.slice(0,3)
.map(contract=>(

<DeadlineCard
key={contract.id}
contract={contract}
/>

))}


</div>


</section>





{/* Contracts */}


<section className="mt-14">


<div className="flex flex-col gap-4 sm:flex-row sm:justify-between">


<h2 className="font-display text-xl font-medium text-ink">
All contracts
</h2>




<input

value={query}

onChange={(e)=>setQuery(e.target.value)}

placeholder="Search contracts..."

className="rounded-[4px] border border-line bg-white px-3 py-2 text-sm"

 />



</div>






<div className="mt-6 overflow-hidden rounded-md border border-line bg-white">


<div className="divide-y divide-line">


{filtered.map(contract=>(


<div
key={contract.id}
className="grid gap-4 px-6 py-5 md:grid-cols-[2fr_1fr_1fr_1fr_auto] md:items-center"
>



<div className="flex items-center gap-3">


<StatusDot status={contract.status}/>


<div>

<p className="font-body font-medium text-ink">
{contract.company}
</p>


<p className="text-sm text-ink/50">
{contract.name}
</p>


</div>


</div>




<p className="font-mono text-sm text-ink/60">
£{contract.monthlySpend}/mo
</p>



<p className="font-mono text-sm text-ink/60">
{contract.renewsOn}
</p>



<DeadlinePill daysLeft={contract.daysLeft}/>





<div className="flex gap-3">


<button

onClick={()=>{

setEditingContract(contract);
setShowForm(true);

}}

className="text-sm text-ink/60 hover:text-ink"

>
Edit
</button>



<button

onClick={()=>deleteContract(contract.id)}

className="text-sm text-red-500"

>
Delete
</button>



</div>




</div>


))}



</div>


</div>



</section>

</>
)}

{showForm && (
  <ContractForm
    initialData={editingContract}
    onSave={saveContract}
    onClose={() => {
      setShowForm(false);
      setEditingContract(null);
    }}
  />
)}

</main>

</div>
);
}