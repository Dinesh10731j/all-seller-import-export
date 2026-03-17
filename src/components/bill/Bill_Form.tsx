import type { SubmitHandler } from "react-hook-form";
import { useForm, useFieldArray } from "react-hook-form";
import Input from "../common/Input";
import Button from "../common/Button";
import type { BillFormData, TransportType, BillItem } from "../../types/bill";

interface BillItemForm {
  itemName: string;
  unitPrice: number;
  quantity: number;
  image: FileList;
}

interface BillFormFields {
  transportType: TransportType;
  customerName: string;
  registrationNumber: string;
  phoneNumber?: string;
  date?: string;
  items: BillItemForm[];
}

interface BillFormProps {
  onSubmit: (data: BillFormData) => void;
}

export default function BillForm({ onSubmit }: BillFormProps) {
  const { register, handleSubmit, control, watch } = useForm<BillFormFields>({
    defaultValues: {
      items: [{ itemName: "", unitPrice: 0, quantity: 0, image: {} as FileList }],
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
        data.items.map((item) =>
          new Promise<BillItem>((resolve) => {
            const file = item.image?.[0];
            if (file) {
              const reader = new FileReader();
              reader.onload = () =>
                resolve({ ...item, image: reader.result as string });
              reader.readAsDataURL(file);
            } else {
              resolve({ ...item, image: undefined });
            }
          })
        )
      );

      const subtotal = processedItems.reduce(
        (sum, item) => sum + Number(item.unitPrice) * Number(item.quantity),
        0
      );

      const transportCharge = transportType === "road" ? subtotal * 0.05 : 0;
      const handlingCharge = transportType === "air" ? subtotal * 0.08 : 0;
      const customDuty = subtotal * 0.1;
      const total = subtotal + transportCharge + handlingCharge + customDuty;

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

      {fields.map((field, index) => (
        <div key={field.id} style={{ border: "1px solid #ccc", padding: 10, marginBottom: 10 }}>
          <h4>Item {index + 1}</h4>
          <Input name={`items.${index}.itemName`} placeholder="Item Name" register={register} />
          <Input name={`items.${index}.unitPrice`} type="number" placeholder="Unit Price" register={register} />
          <Input name={`items.${index}.quantity`} type="number" placeholder="Quantity" register={register} />
          <input type="file" {...register(`items.${index}.image`)} />
          {fields.length > 1 && <Button type="button" onClick={() => remove(index)}>Remove Item</Button>}
        </div>
      ))}

      <Button type="button" onClick={() => append({ itemName: "", unitPrice: 0, quantity: 0, image: {} as FileList })}>
        + Add Item
      </Button>
      <Button type="submit">Generate Bill</Button>
    </form>
  );
}