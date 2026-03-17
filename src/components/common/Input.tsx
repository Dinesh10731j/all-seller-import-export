import type { UseFormRegister, FieldValues, Path } from "react-hook-form";

interface InputProps<T extends FieldValues> {
  placeholder: string;
  type?: string;
  register: UseFormRegister<T>;
  name: Path<T>;
}

export default function Input<T extends FieldValues>({
  placeholder,
  type = "text",
  register,
  name,
}: InputProps<T>) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      {...register(name)}
      style={{
        padding: "10px",
        marginBottom: "10px",
        width: "100%",
        border: "1px solid #ccc",
      }}
    />
  );
}