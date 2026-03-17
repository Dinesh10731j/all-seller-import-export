import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export const downloadPDF = async (id: string): Promise<void> => {
  const element = document.getElementById(id);

  if (!element) {
    throw new Error(`Element with id "${id}" not found`);
  }

  const canvas = await html2canvas(element, { scale: 2 });

  const imgData = canvas.toDataURL("image/png");

  const pdf = new jsPDF("p", "mm", "a4");

  const width = 210;
  const height = (canvas.height * width) / canvas.width;

  pdf.addImage(imgData, "PNG", 0, 0, width, height);

  pdf.save("bill.pdf");
};