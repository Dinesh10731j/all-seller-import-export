import BillForm from "../components/bill/Bill_Form";
import BillPreview from "../components/bill/BillPreview";
import useBill from "../hooks/useBill";
import { downloadPDF } from "../utils/downloadPDF";
import { downloadImage } from "../utils/downloadImage";

export default function Dashboard() {

  const { bill, generateBill } = useBill();

  return (
    <div style={{ padding: 30 }}>

      <h1>Billing System</h1>

      <BillForm onSubmit={generateBill} />

      <BillPreview bill={bill} />

      {bill && (
        <>
          <button onClick={() => downloadPDF("bill")}>
            Download PDF
          </button>

          <button onClick={() => downloadImage("bill")}>
            Download Image
          </button>
        </>
      )}

    </div>
  );
}