import { onMount, createSignal, Show } from "solid-js";

import ImageContent from "./imageContent.tsx";
import FileUploader from "./FileUploader.tsx";
import ExifTable from "./ExifTable.tsx";
import SaveButton from "./SaveButton.tsx";
import * as ExifReader from "exifreader";
import getThemeColor from "./getThemeColor.ts";
import * as heic2any from "heic2any";
import html2canvas from "html2canvas";

export default () => {
  let canvas: HTMLCanvasElement | undefined;
  let ctx: CanvasRenderingContext2D | null = null;

  const [imgSrc, setImgSrc] = createSignal("");
  const [exifInfo, setExifInfo] = createSignal({});
  const [currentResult, setCurrentResult] = createSignal<
    HTMLElement | undefined
  >();
  const [loading, setLoading] = createSignal(false);

  const fileChange = async (files: FileList): Promise<void> => {
    setLoading(() => true);
    const file = files[0];
    if (!file) return;
    let fileUrl = URL.createObjectURL(file);
    let tags = null;
    try {
      tags = await ExifReader.load(file, {
        expanded: true,
      });
    } catch (err) {
      console.log(err);
    }
    console.log("tags", file, tags);
    if (tags?.file?.FileType.value === "heic") {
      const blob = await heic2any({
        blob: file,
        toType: "image/png",
      });
      fileUrl = URL.createObjectURL(blob);
    }
    const exif = tags?.exif || null;
    setExifInfo(() => exif);
    setImgSrc(() => fileUrl);
    drawImg();
  };

  const drawImg = () => {
    const img = new Image();
    img.src = imgSrc();
    img.onload = () => {
      const targetPixels = 50000;
      const originalPixels = img.width * img.height;
      const scale = Math.sqrt(targetPixels / originalPixels);
      console.log("ratio", img.width / img.height);
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

  const setDownload = (content: HTMLElement | undefined) => {
    if (!content) return;
    setLoading(() => {
      return false;
    });

    setCurrentResult(() => content);
  };
  const download = () => {
    if (!currentResult() || loading()) return;
    html2canvas(currentResult()).then((canvas) => {
      const link = document.createElement("a");
      link.download = "image.png";
      link.href = canvas.toDataURL();
      link.click();
      setLoading(() => {
        return true;
      });
      setTimeout(() => {
        setLoading(() => {
          return false;
        });
      }, 500);
    });
  };

  onMount(() => {
    ctx = canvas?.getContext("2d") || null;
  });
  return (
    <main class="w-full h-full overflow-y-auto bg-blank p-y-5 p-x-10 box-border grid grid-rows-2 gap-y-5 md:grid-rows-none md:grid-cols-[25%_1fr] md:gap-x-10 items-center md:justify-center">
      <div class="flex flex-col gap-y-2 self-start">
        <FileUploader onChange={fileChange} loading={loading()} />
        <Show when={imgSrc()}>
          <SaveButton
            loading={loading()}
            disabled={!imgSrc()}
            onClick={download}
          />
        </Show>
        {/* <Show when={imgSrc()}> */}
        {/* <ExifTable data={exifInfo()} /> */}
        {/* </Show> */}
      </div>
      <div class="flex flex-col gap-y-5 h-full overflow-y-auto pb-5">
        <canvas ref={canvas} class="hidden" />
        <ImageContent src={imgSrc()} data={exifInfo()} onReady={setDownload} />
      </div>
    </main>
  );
};
