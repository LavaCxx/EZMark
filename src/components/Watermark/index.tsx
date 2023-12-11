import { onMount, createSignal, Show } from "solid-js";

import ImageContent from "./ImageContent.tsx";
import FileUploader from "./FileUploader.tsx";
// import ExifTable from "./ExifTable.tsx";
import SaveButton from "./SaveButton.tsx";
import * as ExifReader from "exifreader";
import getThemeColor from "./getThemeColor.ts";
import html2canvas from "html2canvas";
import logosJson from "./logos.json";

interface LogoType {
  src: string;
  name: string;
  scale: number;
}
interface LogosType {
  [key: string]: LogoType;
}
export default () => {
  let canvas: HTMLCanvasElement | undefined;
  let ctx: CanvasRenderingContext2D | null = null;
  const maxSize = 10 * 1024 * 1024;

  const imageSizes = [
    {
      name: "small",
      value: "512px",
    },
    {
      name: "medium",
      value: "576px",
    },
    {
      name: "large",
      value: "672px",
    },
    {
      name: "extra large",
      value: "896px",
    },
  ];

  let logos: LogosType = logosJson || [];
  const [imgSrc, setImgSrc] = createSignal("");
  const [fileName, setFileName] = createSignal("");
  const [exifInfo, setExifInfo] = createSignal({});
  const [currentResult, setCurrentResult] = createSignal<
    HTMLElement | undefined
  >();
  const [customInfo, setCustomInfo] = createSignal({
    model: "",
    colorNum: 4,
    logo: "",
    size: "576px",
  });

  const [loading, setLoading] = createSignal(false);

  // 图片上传监听
  const fileChange = async (files: FileList): Promise<void> => {
    setLoading(() => true);
    const file = files[0];
    let heicBlob: Blob | undefined;
    if (!file) return;
    if (file.name) {
      let fileName = file.name.replace(/\.[^/.]+$/, "");
      setFileName(() => fileName || "image");
    }
    if (file.type === "image/heic") {
      const heic2any = (await import("heic2any")).default;
      heicBlob = await heic2any({
        blob: file,
        toType: "image/png",
      });
    }
    let fileUrl = "";
    const Compressor = (await import("compressorjs")).default;
    new Compressor(heicBlob || file, {
      retainExif: true,
      convertSize: maxSize,
      success: async (result) => {
        fileUrl = URL.createObjectURL(result);
        let tags = null;
        try {
          tags = await ExifReader.load(file, {
            expanded: true,
          });
          console.log("tags", tags);
        } catch (err) {
          console.log(err);
        }
        const exif = tags?.exif || null;
        setExifInfo(() => exif);
        setImgSrc(() => fileUrl);
        drawImg();
      },
    });
  };

  // 绘制隐藏canvas用于取色
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
      setExifInfo((prev) => {
        return {
          ...prev,
          themeColors: result.map((v) => {
            let [r, g, b] = v.color.split(",");
            return `rgb(${r},${g},${b})`;
          }),
        };
      });
    };
  };
  // 设置下载ref
  const setDownload = (content: HTMLElement | undefined) => {
    if (!content) return;
    setLoading(() => {
      return false;
    });

    setCurrentResult(() => content);
  };
  // 触发保存
  const download = () => {
    if (!currentResult() || loading()) return;
    html2canvas(currentResult()).then((canvas) => {
      const link = document.createElement("a");
      link.download = `${fileName()}.png`;
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
  // customSetting
  const modelChange = (e: Event) => {
    setCustomInfo((prev) => {
      return {
        ...prev,
        model: (e.target as HTMLInputElement).value,
      };
    });
  };
  const colorNumChange = (e: Event) => {
    setCustomInfo((prev) => {
      return {
        ...prev,
        colorNum: +(e.target as HTMLInputElement).value,
      };
    });
  };
  const logoChange = (e: Event) => {
    setCustomInfo((prev) => {
      return {
        ...prev,
        logo: (e.target as HTMLInputElement).value,
      };
    });
  };
  const sizeChange = (e: Event) => {
    setCustomInfo((prev) => {
      return {
        ...prev,
        size: (e.target as HTMLInputElement).value,
      };
    });
  };

  onMount(() => {
    ctx = canvas?.getContext("2d") || null;
  });
  return (
    <main class="w-full h-auto overflow-y-auto bg-blank py-5 px-10 box-border block md:grid grid-rows-2 gap-y-5 md:grid-rows-none md:grid-cols-[25%_1fr] md:gap-x-10 items-start md:justify-center">
      <div class="flex flex-col gap-y-2 self-start">
        <FileUploader onChange={fileChange} loading={loading()} />
        <Show when={imgSrc()}>
          <SaveButton
            loading={loading()}
            disabled={!imgSrc()}
            onClick={download}
          />
          {/* TODO: save as component */}
          <label for="model">Model</label>
          <input
            name="model"
            class="px-2"
            placeholder={exifInfo()?.Model?.description || ""}
            onInput={modelChange}
            maxlength={25}
          />
          <label for="colorNum">Theme color number</label>
          <select class="px-2" name="colorNum" onChange={colorNumChange}>
            {[...new Array(7).keys()].map((v, index) => {
              return (
                <option selected={index === 4} value={index}>
                  {index}
                </option>
              );
            })}
          </select>
          <label for="logo">Logo</label>
          <select class="px-2" name="logo" onChange={logoChange}>
            {["<none>", ...Object.keys(logos)].map((v) => {
              return (
                <option
                  selected={
                    (exifInfo()?.Make?.description || "").toLowerCase() === v
                  }
                  value={v}
                >
                  {v}
                </option>
              );
            })}
          </select>
          <label for="logo">Logo</label>
          <select class="px-2" name="logo" onChange={logoChange}>
            {["<none>", ...Object.keys(logos)].map((v) => {
              return (
                <option
                  selected={
                    (exifInfo()?.Make?.description || "").toLowerCase() === v
                  }
                  value={v}
                >
                  {v}
                </option>
              );
            })}
          </select>
          <label for="size">Size</label>
          <select class="px-2" name="size" onChange={sizeChange}>
            {imageSizes.map((v, index) => {
              return (
                <option selected={index === 1} value={v.value}>
                  {v.name}
                </option>
              );
            })}
          </select>
        </Show>
        {/* <Show when={imgSrc()}> */}
        {/* <ExifTable data={exifInfo()} /> */}
        {/* </Show> */}
      </div>
      <div class="mt-5 md:mt-0 flex flex-col gap-y-5 overflow-auto box-border">
        <canvas ref={canvas} class="hidden" />
        <ImageContent
          src={imgSrc()}
          data={exifInfo()}
          customInfo={customInfo()}
          onReady={setDownload}
        />
      </div>
    </main>
  );
};
