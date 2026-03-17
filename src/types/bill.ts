export type TransportType = "road" | "air";

export interface BillItem {
  itemName: string;
  unitPrice: number;
  quantity: number;
  image?: string;
}

export interface Bill {
  transportType: TransportType;
  registrationNumber: string;
  customerName: string;
  phoneNumber?: string;
  date?: string;
  items: BillItem[];
  subtotal: number;
  transportCharge: number;
  handlingCharge: number;
  customDuty: number;
  total: number;
}

export interface BillFormData {
  transportType: TransportType;
  registrationNumber: string;
  customerName: string;
  phoneNumber?: string;
  date?: string;
  items: BillItem[];
  subtotal: number;
  transportCharge: number;
  handlingCharge: number;
  customDuty: number;
  total: number;
}