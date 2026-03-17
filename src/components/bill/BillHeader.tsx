type TransportType = "road" | "air";

interface BillHeaderProps {
  transportType: TransportType;
}

export default function BillHeader({ transportType }: BillHeaderProps) {
  return (
    <div style={{ textAlign: "center", marginBottom: 20 }}>
      <h1>ALL-SELLER IMPORT EXPORT</h1>
      <p>"Keep Growing, Keep Supporting"</p>
      <h3>
        ESTIMATE PRICE {transportType === "road" ? "BY ROAD 🚛" : "BY AIR ✈️"}
      </h3>
      <p>From Supplier to Kathmandu</p>
    </div>
  );
}