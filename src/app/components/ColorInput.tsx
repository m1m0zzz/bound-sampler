import { ChangeEvent, useRef, useState } from "react";
import { hexToHsv } from "@/lib/color";

interface Props {
  defaultColor?: string;
  size?: number | {x: number, y: number};
  onChange?: (color: string) => void;
}

export default function ColorInput({ defaultColor, size, onChange }: Props) {
  const [color, setColor] = useState(defaultColor || "#000000");
  const ref = useRef<HTMLInputElement>(null);
  const handler = (event: ChangeEvent<HTMLInputElement>) => {
    if (onChange) onChange(event.target.value);
    setColor(event.target.value);
  }

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        style={{
          background: color,
          borderStyle: "solid",
          borderWidth: "2px",
          borderRadius: "50%",
          borderColor: hexToHsv(color).v < 0.5 ? "white" : "black",
          width: (typeof size == "number") ? size : size?.x || 16,
          height: (typeof size == "number") ? size : size?.y || 16
        }}
        onClick={() => ref.current?.click()}
      ></div>
      <input
        type="color"
        ref={ref}
        value={color}
        onChange={handler}
        style={{
          display: "none"
        }}
      />
    </>
  )
}