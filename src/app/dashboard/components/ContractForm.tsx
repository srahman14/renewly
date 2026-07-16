"use client";

import { useState } from "react";
import { Contract } from "../page";


interface Props {
  initialData: Contract | null;
  onSave: (contract: Contract) => void;
  onClose: () => void;
}


export default function ContractForm({
  initialData,
  onSave,
  onClose,
}: Props) {


  const [form, setForm] = useState({

  company: initialData?.company ?? "",
  name: initialData?.name ?? "",
  monthlySpend: initialData?.monthlySpend ?? 0,
  cycle: initialData?.cycle ?? "",
  renewalDate: "",
  owner: initialData?.owner ?? "",
  team: initialData?.team ?? "",
  category: initialData?.category ?? "",
  noticeDays: initialData?.noticeDays ?? "",

});



  const [error,setError] = useState("");



  function update(
    field:string,
    value:string | number
  ){

    setForm(previous=>({
      ...previous,
      [field]:value
    }));

  }




  function submit(e:React.FormEvent){

    e.preventDefault();


    if(
      !form.company ||
      !form.monthlySpend ||
      !form.renewalDate ||
      !form.owner
    ){

      setError(
        "Please complete all required fields."
      );

      return;

    }



    const daysLeft =
      Math.max(
        0,
        Math.ceil(
          (
            new Date(form.renewalDate).getTime()
            -
            new Date().getTime()
          )
          /
          (1000*60*60*24)
        )
      );



    const contract:Contract = {

      id:
        initialData?.id ??
        crypto.randomUUID(),


      company:
        form.company,


      name:
        form.name,


      owner:
        form.owner,


      team:
        form.team,


      category:
        form.category,


      monthlySpend:
        Number(form.monthlySpend),


      cycle:
        form.cycle as Contract["cycle"],


      renewsOn:
        new Date(form.renewalDate)
        .toLocaleDateString(
          "en-GB",
          {
            day:"numeric",
            month:"short",
            year:"numeric"
          }
        ),


      noticeDays:
        Number(form.noticeDays),


      deadline:
        new Date(
          new Date(form.renewalDate)
          .getTime()
          -
          Number(form.noticeDays)
          *
          86400000
        )
        .toLocaleDateString(
          "en-GB",
          {
            day:"numeric",
            month:"short",
            year:"numeric"
          }
        ),


      daysLeft,


      status:
        daysLeft <= 30
        ? "flagged"
        : "active"

    };



    onSave(contract);

  }




  function clearForm(){

  setForm({
    company: "",
    name: "",
    monthlySpend: 0,
    cycle: "",
    renewalDate: "",
    owner: "",
    team: "",
    category: "",
    noticeDays: "",
  });

  setError("");

}

return (

    

<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">


<div className="w-full max-w-lg rounded-md bg-white p-6 shadow-xl">


<div className="flex items-center justify-between">


<h2 className="font-display text-xl font-medium text-ink">

{initialData
? "Edit Contract"
: "Add Contract"}

</h2>



<button

onClick={onClose}

className="text-ink/50 hover:text-ink"

>
✕
</button>


</div>




<form
onSubmit={submit}
className="mt-6 space-y-4"
>



<input

placeholder="Company name *"

value={form.company}

onChange={
e=>update(
"company",
e.target.value
)
}

className="w-full rounded border px-3 py-2"

/>




<input

placeholder="Contract name "

value={form.name}

onChange={
e=>update(
"name",
e.target.value
)
}

className="w-full rounded border px-3 py-2"

/>





<input

type="number"

placeholder="Monthly cost *"

value={form.monthlySpend === 0 ? "" : form.monthlySpend}

onChange={
e=>update(
"monthlySpend",
Number(e.target.value)
)
}

className="w-full rounded border px-3 py-2"

/>






<select

value={form.cycle}

onChange={
e=>update(
"cycle",
e.target.value
)
}

className={`w-full rounded border px-3 py-2 ${
  form.cycle ? "text-grey" : "text-gray-500"
}`}

>

<option value="" disabled>
Billing cycle
</option>

<option value="Monthly">
Monthly
</option>

<option value="Quarterly">
Quarterly
</option>

<option value="Annual">
Annual
</option>

</select>






<input
  type="date"
  value={form.renewalDate}
  onChange={(e)=>{
    console.log("DATE VALUE:", e.target.value);
    update("renewalDate", e.target.value);
  }}
  className="w-full rounded border border-line px-3 py-2 text-ink"
/>





<input

placeholder="Owner *"

value={form.owner}

onChange={
e=>update(
"owner",
e.target.value
)
}

className="w-full rounded border px-3 py-2"

/>






<input

placeholder="Team / Category"

value={form.team}

onChange={
e=>update(
"team",
e.target.value
)
}

className="w-full rounded border px-3 py-2"

/>






<input

type="number"

placeholder="Cancellation notice days"

value={form.noticeDays}

onChange={
e=>update(
"noticeDays",
e.target.value === "" ? "" : Number(e.target.value)
)
}

className="w-full rounded border px-3 py-2"

/>






{error && (

<p className="text-sm text-red-500">
{error}
</p>

)}





<div className="flex justify-end gap-3 pt-6">


<button
type="button"
onClick={clearForm}
className="rounded-md border border-red-200 px-4 py-2 text-sm font-medium text-red-500 transition hover:bg-red-50"
>
Clear
</button>



<button
type="button"
onClick={onClose}
className="rounded-md border border-ink/20 px-4 py-2 text-sm font-medium text-ink/60 transition hover:bg-ink/5 hover:text-ink"
>
Cancel
</button>



<button
type="submit"
className="rounded-md bg-ink px-5 py-2 text-sm font-medium text-white transition hover:bg-navy"
>
Save Contract
</button>


</div>



</form>


</div>


</div>

);

}