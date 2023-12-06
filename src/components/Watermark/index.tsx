import { onMount, createSignal, Show } from "solid-js";

import ImageContent from "./imageContent.tsx";
import FileUploader from "./FileUploader.tsx";
import ExifTable from "./ExifTable.tsx";
import * as ExifReader from "exifreader";
import getThemeColor from "./getThemeColor.ts";
export default () => {
  let canvas: HTMLCanvasElement | undefined;
  let ctx: CanvasRenderingContext2D | null = null;
  const infoHeight = 60;
  const [imgSrc, setImgSrc] = createSignal("");
  const [exifInfo, setExifInfo] = createSignal({});
  const fileChange = async (files: FileList): Promise<void> => {
    const file = files[0];
    if (!file) return;
    const tags = await ExifReader.load(file, {
      expanded: true,
    });
    const exif = tags.exif || null;
    setExifInfo(() => exif);
    setImgSrc(() => URL.createObjectURL(file));
    drawImg();
  };
  const clearImg = () => {};

  const drawImg = () => {
    const img = new Image();
    img.src = imgSrc();
    img.onload = () => {
      const targetPixels = 50000;
      const originalPixels = img.width * img.height;
      const scale = Math.sqrt(targetPixels / originalPixels);
      if (!canvas || !ctx) return;

      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      ctx.drawImage(
        img,
        0,
        0,
        img.width,
        img.height,
        0,
        0,
        canvas.width,
        canvas.height,
      );
      const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imageData.data;
      let res: number[][] = [];
      for (let i = 0; i < pixels.length; i += 4) {
        res.push([pixels[i], pixels[i + 1], pixels[i + 2]]);
      }
      const result = getThemeColor(res);
      console.log(result);
      setExifInfo((prev) => {
        return {
          ...prev,
          themeColors: result.slice(0, 4).map((v) => {
            let [r, g, b] = v.color.split(",");
            return `rgb(${r},${g},${b})`;
          }),
        };
      });
    };
  };
  onMount(() => {
    ctx = canvas?.getContext("2d") || null;
  });
  return (
    <main class="w-full h-screen bg-blank flex gap-x-10 items-center justify-center">
      <div class="flex flex-col">
        <canvas ref={canvas} class="hidden" />
        <ImageContent src={imgSrc()} data={exifInfo()} />
      </div>
      <div class="flex flex-col gap-y-5">
        <FileUploader change={fileChange} />
        <Show when={imgSrc()}>
          <ExifTable data={exifInfo()} />
        </Show>
      </div>
    </main>
  );
};
