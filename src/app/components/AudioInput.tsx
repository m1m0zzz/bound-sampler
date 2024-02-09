import { ChangeEvent, useRef, useState } from "react";

interface Props {
  onChange: (file: File) => void;
}

export default function AudioInput({ onChange }: Props) {
  const [file, setFile] = useState<File>();
  const inputRef = useRef<HTMLInputElement>(null);
  const handler = (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    setFile(event.target.files[0]);
    onChange(event.target.files[0]);
  }

  return (
    <>
      <div onClick={() => inputRef.current?.click()} >
        <button>ファイルを選択</button>
        <text>{file ? file.name : "(.mp3, .wav, .ogg ...)"}</text>
      </div>
      <input ref={inputRef} type="file" accept="audio/*" onChange={handler} style={{display: "none"}} />
    </>
  )
}
