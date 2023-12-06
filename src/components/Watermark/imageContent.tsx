import { Show } from "solid-js";
import html2canvas from "html2canvas";
import logosJson from "./logos.json";
type Props = {
  data: any;
  src: string;
};
interface LogoType {
  src: string;
  name: string;
  scale: number;
}
interface LogosType {
  [key: string]: LogoType;
}
export default (props: Props) => {
  let imgContent: HTMLDivElement | undefined;
  const logos: LogosType = logosJson;
  const download = () => {
    if (!imgContent) return;
    html2canvas(imgContent).then((canvas) => {
      const link = document.createElement("a");
      link.download = "image.png";
      link.href = canvas.toDataURL();
      link.click();
    });
  };
  const formatExifTime = (raw: string = "") => {
    let regRes = raw.match(/\d+/g) || [];
    if (regRes.length < 6) return "";
    const [year, day, month, hour, minute, second] = regRes;
    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
  };
  const getMakeLogo = (make: string): LogoType => {
    make = make.toLowerCase();
    let res: LogoType = logos?.[make] || { src: "", name: "", scale: 1 };
    return res;
  };
  const getTag = (key: string): string => {
    if (!props.data) return "";
    let val = props.data[key].description || "";
    if (key === "FocalLength") val = val.replace(" ", "");
    return val;
  };
  const isShowVr = (exif: any, logo: string = "") => {
    if (!exif) return false;
    const { FocalLength, FNumber, ExposureTime, ISOSpeedRatings } = exif;
    if ((FocalLength || FNumber || ExposureTime || ISOSpeedRatings) && logo) {
      return true;
    }
    return false;
  };
  return (
    <Show when={props.src}>
      <div class="flex flex-col gap-y-5">
        <div
          class="flex flex-col min-w-xl leading-none relative rounded drop-shadow-[1rem_1rem_0px_var(--main-color)]"
          ref={imgContent}
          contenteditable
        >
          <img src={props.src} class="inline-block max-w-xl" />
          <div class="w-full p-4 box-border bg-white flex justify-between items-center">
            <div class="flex flex-col gap-y-1">
              <p class="text-base text-black font-bold">{getTag("Model")}</p>
              <p class="text-sm text-gray-400">
                {formatExifTime(getTag("DateTimeOriginal"))}
              </p>
            </div>
            <div class="flex gap-x-1 items-center pointer-events-none select-none">
              <img
                class="inline-block w-10 origin-right"
                style={{
                  transform: `scale(${getMakeLogo(getTag("Make")).scale})`,
                }}
                src={getMakeLogo(getTag("Make")).src}
              />
              <Show
                when={isShowVr(props.data, getMakeLogo(getTag("Make")).src)}
              >
                <div class="w-0.5 h-10 bg-gray-400 m-x-1" />
              </Show>
              <div class="text-base text-black flex flex-col gap-y-1 font-bold">
                <div class="flex gap-x-1.7">
                  <Show when={getTag("FocalLength")}>
                    <p>{getTag("FocalLength")}</p>
                  </Show>
                  <Show when={getTag("FNumber")}>
                    <p>{getTag("FNumber")}</p>
                  </Show>
                  <Show when={getTag("ExposureTime")}>
                    <p>{getTag("ExposureTime")}</p>
                  </Show>
                  <Show when={getTag("ISOSpeedRatings")}>
                    <p>ISO</p>
                    <p>{getTag("ISOSpeedRatings")}</p>
                  </Show>
                </div>

                <div class="flex gap-x-2">
                  {(props.data?.themeColors || []).map((v: string) => (
                    <span
                      class="w-4 h-4 rounded-full"
                      style={{ background: v }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <button
            class="px-4 py-2 bg-desc  shadow-md text-blank hover:bg-secondary transition-all"
            onClick={download}
          >
            下载
          </button>
        </div>
      </div>
    </Show>
  );
};
