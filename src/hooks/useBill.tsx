import { useState } from "react";
import type { Bill } from "../types/bill";

export default function useBill() {
  const [bill, setBill] = useState<Bill | null>(null);

  const generateBill = (data: Bill) => {
    setBill(data);
  };

  return { bill, generateBill };
}