import type { SubmitHandler } from "react-hook-form";
import { useForm, useFieldArray } from "react-hook-form";
import Input from "../common/Input";
import Button from "../common/Button";
import type { BillItem } from "../../types/bill";
import type { BillFormFields, BillFormProps } from "../../types/bill";

export default function BillForm({ onSubmit }: BillFormProps) {
  const { register, handleSubmit, control, watch } = useForm<BillFormFields>({
    defaultValues: {
      items: [{ itemName: "", hsCode: "", unitPrice: 0, quantity: 0, image: {} as FileList }],
      transportType: "road",
      registrationNumber: "",
      phoneNumber: "",
      date: new Date().toISOString().split("T")[0],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "items" });
  const transportType = watch("transportType");

  const submitHandler: SubmitHandler<BillFormFields> = (data) => {
    const processItems = async () => {
      const processedItems: BillItem[] = await Promise.all(
      data.items.map(
    (item) =>
      new Promise<BillItem>((resolve) => {
        const file = item.image?.[0];
        const doChargePerItem =
          transportType === "air" ? Number(item.unitPrice) * Number(item.quantity) * 0.02 : 0;

        if (file) {
          const reader = new FileReader();
          reader.onload = () =>
            resolve({
              ...item,
              image: reader.result as string,
              doCharge: doChargePerItem,
            });
          reader.readAsDataURL(file);
        } else {
          resolve({ ...item, image: undefined, doCharge: doChargePerItem });
        }
      })
  )
);

const round = (num: number) => Math.round(num * 100) / 100;

// ✅ FIRST calculate subtotal
const subtotal = processedItems.reduce(
  (sum, item) => sum + Number(item.unitPrice) * Number(item.quantity),
  0
);

// ✅ THEN percentages
const transportPercent = Number(data.transportChargePercent || 0) / 100;
const handlingPercent = Number(data.handlingChargePercent || 0) / 100;
const doPercent = Number(data.doChargePercent || 0) / 100;
const customPercent = Number(data.customDutyPercent || 10) / 100;

// ✅ THEN round subtotal
const safeSubtotal = round(subtotal);

// ✅ Charges
const transportCharge =
  transportType === "road" ? round(safeSubtotal * transportPercent) : 0;

const handlingCharge =
  transportType === "air" ? round(safeSubtotal * handlingPercent) : 0;

const doCharge =
  transportType === "air" ? round(safeSubtotal * doPercent) : 0;

const customDuty = round(safeSubtotal * customPercent);

// ✅ Total
const total = round(
  safeSubtotal + transportCharge + handlingCharge + doCharge + customDuty
);
      onSubmit({
        transportType: data.transportType,
        registrationNumber: data.registrationNumber,
        customerName: data.customerName,
        phoneNumber: data.phoneNumber,
        date: data.date,
        items: processedItems,
        subtotal,
        transportCharge,
        handlingCharge,
        customDuty,
        total,
        doCharge,
      });
    };

    processItems();
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)}>
  <select {...register("transportType")} style={{ marginBottom: 10 }}>
    <option value="road">BY ROAD</option>
    <option value="air">BY AIR</option>
  </select>

  <Input name="registrationNumber" placeholder="Registration Number" register={register} />
  <Input name="customerName" placeholder="Customer Name" register={register} />
  <Input name="phoneNumber" placeholder="Phone Number" register={register} />
  <Input name="date" type="date" placeholder="Date" register={register} />

  {/* Dynamic charge inputs */}
  {transportType === "road" && (
    <Input
      name="transportChargePercent"
      type="number"
      placeholder="Transport Charge %"
      register={register}
    />
  )}
  {transportType === "air" && (
    <>
      <Input
        name="handlingChargePercent"
        type="number"
        placeholder="Handling Charge %"
        register={register}
      />
      <Input
        name="doChargePercent"
        type="number"
        placeholder="DO Charge %"
        register={register}
      />
    </>
  )}
  <Input name="customDutyPercent" type="number" placeholder="Custom Duty %" register={register} />

  {/* Items */}
  {fields.map((field, index) => (
    <div key={field.id} style={{ border: "1px solid #ccc", padding: 10, marginBottom: 10 }}>
      <h4>Item {index + 1}</h4>
      <Input name={`items.${index}.itemName`} placeholder="Item Name" register={register} />
      <Input name={`items.${index}.hsCode`} placeholder="HS Code" register={register} />
      <Input name={`items.${index}.unitPrice`} type="number" placeholder="Unit per PCS (NRS)" register={register} />
      <Input name={`items.${index}.quantity`} type="number" placeholder="Quantity (PCS)" register={register} />
      <input type="file" {...register(`items.${index}.image`)} />
      {fields.length > 1 && <Button type="button" onClick={() => remove(index)}>Remove Item</Button>}
    </div>
  ))}

  <Button type="button" onClick={() => append({ itemName: "", hsCode: "", unitPrice: 0, quantity: 0, image: {} as FileList })}>
    + Add Item
  </Button>

  <Button type="submit">Generate Bill</Button>
</form>
  );
}