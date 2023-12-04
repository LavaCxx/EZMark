import { onMount, createSignal } from "solid-js";

import ImageContent from "./imageContent.tsx";
import FileUploader from "./FileUploader.tsx";
import ExifTable from "./ExifTable.tsx";
import EXIF from "exif-js";
import dayjs from "dayjs";
export default () => {
  let canvas: HTMLCanvasElement | undefined;
  let ctx: CanvasRenderingContext2D | null = null;
  const infoHeight = 60;
  const [imgSrc, setImgSrc] = createSignal("");
  const [exifInfo, setExifInfo] = createSignal({});
  const fileChange = (files: FileList) => {
    const file = files[0];
    console.log(file);
    EXIF.getData(file, function () {
      EXIF.getAllTags(this);
      setExifInfo(() => file.exifdata);
      setImgSrc(() => URL.createObjectURL(file));
    });
  };

  onMount(() => {
    ctx = canvas?.getContext("2d") || null;
  });
  return (
    <main class="w-full h-screen bg-blank flex flex-col items-center justify-center">
      <ImageContent src={imgSrc()} data={exifInfo()} />
      <FileUploader change={fileChange} class="mt-10" />
      {/* <ExifTable data={exifInfo()} /> */}
    </main>
  );
};
