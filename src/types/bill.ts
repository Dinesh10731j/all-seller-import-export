// -----------------------------
// types/bill.ts
// -----------------------------

export type TransportType = "road" | "air";

// -----------------------------
// Single item in the bill
// -----------------------------
export interface BillItem {
  itemName: string;
  hsCode: string;          // HS Code for customs
  unitPrice: number;       // Price per kg or per unit
  quantity: number;        // Quantity in kg or pcs
  image?: string;          // Base64 or URL of image
  doCharge: number;        // Delivery Order charge (applies only for air)
}

// -----------------------------
// Full Bill
// -----------------------------
export interface Bill {
  transportType: TransportType;
  registrationNumber: string;
  customerName: string;
  phoneNumber?: string;
  date?: string;
  items: BillItem[];
  subtotal: number;
  transportCharge: number;   // Applies for road
  handlingCharge: number;    // Applies for air
  customDuty: number;        // Always applies
  doCharge: number;          // Total DO charge for the whole bill (air only)
  total: number;             // Sum of all charges
}

// -----------------------------
// Data from the form submission
// -----------------------------
export interface BillFormData {
  transportType: TransportType;
  registrationNumber: string;
  customerName: string;
  phoneNumber?: string;
  date?: string;
  items: {
    itemName: string;
    hsCode: string;
    unitPrice: number;
    quantity: number;
    image?: string;
    doCharge: number; // per item DO charge (air only)
  }[];
  subtotal: number;
  transportCharge: number;
  handlingCharge: number;
  customDuty: number;
  doCharge: number; // total DO charge
  total: number;
}

// -----------------------------
// Form field representation for react-hook-form
// -----------------------------
export interface BillItemForm {
  itemName: string;
  hsCode: string;
  unitPrice: number;
  quantity: number;
  image: FileList;
}

export interface BillFormFields {
  hsCode: string;
  transportType: TransportType;
  customerName: string;
  registrationNumber: string;
  phoneNumber?: string;
  date?: string;
  items: BillItemForm[];

  // Dynamic charges
  transportChargePercent?: number; // for road
  handlingChargePercent?: number;  // for air
  doChargePercent?: number;        // for air
  customDutyPercent?: number;      // for all
}

// -----------------------------
// Props for BillForm component
// -----------------------------
export interface BillFormProps {
  onSubmit: (data: BillFormData) => void;
}