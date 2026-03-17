import type { CSSProperties, MouseEventHandler, ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  type?: "button" | "submit" | "reset";
  style?: CSSProperties;
}

export default function Button({
  children,
  onClick,
  type = "button",
  style = {},
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      style={{
        padding: "10px 16px",
        backgroundColor: "#000",
        color: "#fff",
        border: "none",
        cursor: "pointer",
        marginRight: "10px",
        ...style,
      }}
    >
      {children}
    </button>
  );
}