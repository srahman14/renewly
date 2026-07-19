"use client";

import { useState } from "react";
import { Contract, CATEGORIES } from "@/lib/contracts";
import { format } from "date-fns";
import { ChevronDownIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";


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
  monthlySpend: initialData?.monthlySpend?.toString() ?? "",
  cycle: initialData?.cycle ?? "",
  renewalDate: initialData?.renewsOn
    ? new Date(initialData.renewsOn).toISOString().split("T")[0]
    : "",
  owner: initialData?.owner ?? "",
  team: initialData?.team ?? "",
  category: initialData?.category ?? "",
  noticeDays: initialData?.noticeDays?.toString() ?? "",
});


  const [error,setError] = useState("");



  function update(
  field: string,
  value: string | number | null
){
  setForm(previous => ({
    ...previous,
    [field]: value ?? ""
  }));
}




  function submit(e:React.FormEvent){

    e.preventDefault();


    if(
      !form.company ||
      form.monthlySpend === "" ||
      form.monthlySpend === null ||
      !form.renewalDate ||
      !form.owner ||
      !form.category ||
      form.noticeDays === "" ||
      form.noticeDays === null
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
        : "active",


      // keep the original creation date when editing, stamp a new one when adding
      createdAt:
        initialData?.createdAt ??
        new Date().toISOString()

    };



    onSave(contract);

  }




  function clearForm(){

  setForm({
    company: "",
    name: "",
    monthlySpend: "",
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
  min="0"
  step="0.01"
  placeholder="Monthly cost *"

  value={form.monthlySpend}

  onChange={
    e=>update(
      "monthlySpend",
      e.target.value === ""
      ? ""
      : Number(e.target.value)
    )
  }

  className="w-full rounded border px-3 py-2"
/>






<Select
  value={form.cycle}
  onValueChange={(value) => update("cycle", value)}
>
  <SelectTrigger className="w-full">
    <SelectValue placeholder="Billing cycle *" />
  </SelectTrigger>

  <SelectContent>
    <SelectItem value="Monthly">
      Monthly
    </SelectItem>

    <SelectItem value="Quarterly">
      Quarterly
    </SelectItem>

    <SelectItem value="Annual">
      Annual
    </SelectItem>
  </SelectContent>
</Select>




<Select
  value={form.category}
  onValueChange={(value) => update("category", value)}
>
  <SelectTrigger className="w-full">
    <SelectValue placeholder="Category *" />
  </SelectTrigger>

  <SelectContent>
    {CATEGORIES.map(({ value, label, icon: Icon }) => (
      <SelectItem key={value} value={value}>
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-ink/60" />
          {label}
        </div>
      </SelectItem>
    ))}
  </SelectContent>
</Select>





<Popover>
  <PopoverTrigger>
    <Button
      type="button"
      variant="outline"
      className="w-full justify-between text-left font-normal"
    >
      {form.renewalDate ? (
        format(new Date(form.renewalDate), "PPP")
      ) : (
        <span className="text-gray-500">
          Pick renewal date *
        </span>
      )}

      <ChevronDownIcon className="h-4 w-4" />
    </Button>
  </PopoverTrigger>

  <PopoverContent className="w-auto p-0" align="start">
    <Calendar
      mode="single"
      selected={
        form.renewalDate
          ? new Date(form.renewalDate)
          : undefined
      }
      onSelect={(date) => {
        update(
          "renewalDate",
          date
            ? date.toISOString().split("T")[0]
            : ""
        );
      }}
    />
  </PopoverContent>
</Popover>


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

placeholder="Team (optional)"

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
min = "0"

placeholder="Cancellation notice days *"

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