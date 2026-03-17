import type { Bill, BillItem } from "../../types/bill";
import type { CSSProperties } from "react";

interface BillPreviewProps {
  bill: Bill | null;
}

export default function BillPreview({ bill }: BillPreviewProps) {
  if (!bill) return null;

  // Totals
  const totalQuantity = bill.items.reduce(
    (sum, item) => sum + Number(item.quantity || 0),
    0
  );

  const subtotal = bill.items.reduce(
    (sum, item) => sum + Number(item.unitPrice || 0) * Number(item.quantity || 0),
    0
  );

  const transportCharge = bill.transportType === "road" ? bill.transportCharge || 0 : 0;
  const handlingCharge = bill.transportType === "air" ? bill.handlingCharge || 0 : 0;
  const customDuty = bill.customDuty || 0;
  const doCharge = bill.transportType === "air" ? subtotal * 0.02 : 0; // 2% DO charge
  const total = bill.total || subtotal + transportCharge + handlingCharge + customDuty + doCharge;

  return (
    <div style={containerStyle} id="bill">
      <h2 style={{ textAlign: "center" }}>ALL-SELLER IMPORT EXPORT</h2>

      <h4 style={{ textAlign: "center" }}>
        ESTIMATE PRICE {bill.transportType === "road" ? "BY ROAD 🚛" : "BY AIR ✈️"}
      </h4>

      <p>Registration Number: <b>{bill.registrationNumber}</b></p>
      <p>Date: <b>{new Date().toLocaleDateString()}</b></p>
      <p>Phone: <b>{bill.phoneNumber || "9876567487"}</b></p>
      <p>From Supplier to Kathmandu</p>

      {/* TABLE */}
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={cell}>#</th>
            <th style={cell}>Item Name</th>
            <th style={cell}>HS Code</th>
            <th style={cell}>Image</th>
            <th style={cell}>Per Kg Price (NRS)</th>
            <th style={cell}>Qty (kg)</th>
            <th style={cell}>Amount (NRS)</th>
          </tr>
        </thead>

        <tbody>
          {bill.items.map((item: BillItem, index: number) => {
            const itemTotal = Number(item.unitPrice) * Number(item.quantity);
            return (
              <tr key={index}>
                <td style={cell}>{index + 1}</td>
                <td style={cell}>{item.itemName}</td>
                <td style={cell}>{item.hsCode || "-"}</td>
                <td style={cell}>
                  {item.image ? <img src={item.image} alt="product" style={imageStyle} /> : "No Image"}
                </td>
                <td style={cell}>{item.unitPrice}</td>
                <td style={cell}>{item.quantity}</td>
                <td style={cell}>{itemTotal}</td>
              </tr>
            );
          })}

          {/* SUBTOTAL */}
          <tr>
            <td colSpan={6} style={cell}><b>Subtotal</b></td>
            <td style={cell}><b>{subtotal}</b></td>
          </tr>

          {/* Transport / Handling */}
          {bill.transportType === "road" && (
            <tr>
              <td colSpan={6} style={cell}><b>Transportation Cost</b></td>
              <td style={cell}><b>{transportCharge}</b></td>
            </tr>
          )}
          {bill.transportType === "air" && (
            <tr>
              <td colSpan={6} style={cell}><b>Handling Charge</b></td>
              <td style={cell}><b>{handlingCharge}</b></td>
             
            </tr>
            
          )}
           {bill.transportType === "air" && (    <tr>
      <td colSpan={6} style={cell}><b>DO Charge</b></td>
      <td style={cell}><b>{doCharge}</b></td>
    </tr>)}
       




          {/* Custom Duty */}
          <tr>
            <td colSpan={6} style={cell}><b>Custom Duty</b></td>
            <td style={cell}><b>{customDuty}</b></td>
          </tr>

          {/* TOTAL */}
          <tr>
            <td colSpan={6} style={cell}><b>Amount</b></td>
            <td style={cell}><b>{total}</b></td>
          </tr>

          {/* Total Quantity */}
          <tr>
            <td colSpan={6} style={cell}><b>Total Quantity</b></td>
            <td style={cell}><b>{totalQuantity}</b></td>
          </tr>
        </tbody>
      </table>

      <h3 style={{ marginTop: 20 }}>Customer: {bill.customerName}</h3>
    </div>
  );
}

// -----------------------------
// STYLES
// -----------------------------
const containerStyle: CSSProperties = {
  padding: 20,
  width: 900,
  border: "1px solid black",
};

const tableStyle: CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
  marginTop: 10,
};

const cell: CSSProperties = {
  border: "1px solid black",
  padding: "8px",
  textAlign: "center",
};

const imageStyle: CSSProperties = {
  width: 60,
  height: 60,
  objectFit: "cover",
};