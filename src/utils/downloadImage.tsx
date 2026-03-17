import html2canvas from "html2canvas";

export const downloadImage = async (id: string): Promise<void> => {
  const element = document.getElementById(id);

  if (!element) {
    throw new Error(`Element with id "${id}" not found`);
  }

  const canvas = await html2canvas(element);

  const link = document.createElement("a");

  link.download = "bill.png";
  link.href = canvas.toDataURL();

  link.click();
};