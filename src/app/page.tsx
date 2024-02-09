"use client"

import React, { MutableRefObject, useEffect, useRef, useState } from "react";
import AudioInput from "./components/AudioInput";
import styles from "./page.module.css";
import ColorInput from "./components/ColorInput";
import { clamp, toBase64 } from "@/lib/utils";

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvasContext, setCanvasContext] = useState<CanvasRenderingContext2D | null>(null);
  const audioRefs = useRef<(HTMLAudioElement | null)[]>([]);
  const audioLoaded = useRef([false, false]);

  // variables
  const colorL = useRef("#80BCBD");
  const [colorLState, setColorLState] = useState(colorL.current);
  const colorR = useRef("#F9F3CC");
  const [colorRState, setColorRState] = useState(colorR.current);
  const ballX = useRef(100);
  const ballY = useRef(100);
  const ballVX = useRef(2);
  const ballVY = useRef(2);
  const mouseX = useRef(-1);
  const mouseY = useRef(-1);
  const mousePress = useRef(false);
  const blocksL = useRef<number[]>([]);
  const blocksR = useRef<number[]>([]);

  const handleAudio = async (file: File, id: string) => {
    if (!audioRefs.current) return;
		const result = await toBase64(file);

    const index = id == "L" ? 0 : 1;
    audioRefs.current[index]!.src = result;
    audioLoaded.current[index] = true;
  }

  const playSound = (id: string) => {
    // console.log("play sound: " + id);
    const index = id == "L" ? 0 : 1;
    if (audioRefs.current[index] && audioLoaded.current[index]) {
      audioRefs.current[index]!.pause();
      audioRefs.current[index]!.currentTime = 0;
      audioRefs.current[index]!.play();
    }
  }

  const mouseMoveHandler = (event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    mouseX.current = event.clientX - rect.left;
    mouseY.current = event.clientY - rect.top;
  }

  const mouseDownHandler = () => mousePress.current = true;
  const mouseUpHandler = () => mousePress.current = false;

  useEffect(() => {
    window.addEventListener("mousedown", mouseDownHandler);
    window.addEventListener("mouseup", mouseUpHandler);

    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d") as CanvasRenderingContext2D;
    setCanvasContext(ctx);
    const r = 16;
    const blockHeight = 32;
    blocksL.current = (new Array(Math.ceil(window.innerHeight / blockHeight))).fill(0)
    blocksR.current = [...blocksL.current]

    const animate = () => {
      const width = Math.floor(window.innerWidth * 0.4);
      const height = window.innerHeight;
      ctx.canvas.width = width;
      ctx.canvas.height = height;
      ctx.fillStyle = "#D7E5CA";
      ctx.rect(0, 0, width, height);
      ctx.fill();

      const centerX = width / 2;
      // mouse
      if (mousePress.current) {
        if (mouseX.current < centerX) {
          const index = Math.floor(blocksL.current.length * mouseY.current / height)
          blocksL.current[index] = clamp(mouseX.current, 0, centerX);
        } else {
          const index = Math.floor(blocksL.current.length * mouseY.current / height)
          blocksR.current[index] =  clamp(width - mouseX.current, 0, centerX);
        }
      }

      // blocks
      for (let i = 0; i < blocksL.current.length; i++) {
        blocksL.current[i] =  clamp(blocksL.current[i], 0, centerX);
        ctx.fillStyle = colorL.current;
        ctx.fillRect(0, blockHeight * i, blocksL.current[i], blockHeight);
      }

      for (let i = 0; i < blocksR.current.length; i++) {
        blocksR.current[i] =  clamp(blocksR.current[i], 0, centerX);
        ctx.fillStyle = colorR.current;
        ctx.fillRect(width, blockHeight * i, - blocksR.current[i], blockHeight);
      }

      // ball
      ballX.current += ballVX.current;
      ballY.current += ballVY.current;

      const percent = ballY.current / height;
      if (ballVX.current < 0) {
        if (blocksL.current[Math.floor(percent * blocksL.current.length)] >= ballX.current - r) {
          ballVX.current *= -1;
          playSound("L");
        }
      } else {
        if (width - blocksR.current[Math.floor(percent * blocksR.current.length)] <= ballX.current + r) {
          ballVX.current *= -1;
          playSound("R");
        }
      }

      ballX.current = (ballX.current + width) % width;
      ballY.current = (ballY.current + height) % height;

      ctx.beginPath();
      ctx.arc(ballX.current, ballY.current, r, 0, 2 * Math.PI, false);
      ctx.fillStyle = "white";
      // ctx.closePath();
      ctx.fill();

      requestAnimationFrame(animate);
    }
    animate();

    return () => {
      window.removeEventListener("mousedown", mouseDownHandler);
      window.removeEventListener("mouseup", mouseUpHandler);
    }
  }, []);

  return (
    <main className={styles.main}>
      {/* <h1>Bound Sampler</h1> */}
      <div className={styles.playground}>
        <div
          className={styles.column}
          style={{background: colorLState}}
        >
          <AudioInput onChange={(file) => handleAudio(file, "L")} />
          <audio ref={ref => audioRefs.current[0] = ref} src=""></audio>
          <ColorInput
            size={32}
            defaultColor={colorLState}
            onChange={(color) => {
              colorL.current = color;
              setColorLState(color);
            }}
          />
        </div>
        <canvas
          ref={canvasRef}
          className={styles.canvas}
          onMouseMove={mouseMoveHandler}
        ></canvas>
        <div
          className={styles.column}
          style={{background: colorRState}}
        >
          <AudioInput onChange={(file) => handleAudio(file, "R")} />
          <audio ref={ref => audioRefs.current[1] = ref} src=""></audio>
          <ColorInput
            size={32}
            defaultColor={colorRState}
            onChange={(color) => {
              colorR.current = color;
              setColorRState(color);
            }}
          />
        </div>
      </div>
    </main>
  );
}
