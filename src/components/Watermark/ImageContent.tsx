import { Show, createEffect } from "solid-js";
import logosJson from "./logos.json";

interface Props {
  data: any;
  src: string;
  customInfo: CustomInfoType;
  onReady: (content: HTMLDivElement) => void;
}
interface CustomInfoType {
  [key: string]: string | number;
}
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

  const formatExifTime = (raw: string = "") => {
    let regRes = raw.match(/\d+/g) || [];
    if (regRes.length < 6) return "";
    const [year, month, day, hour, minute, second] = regRes;
    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
  };
  const getMakeLogo = (make: string): LogoType => {
    make = make.toLowerCase();
    let res: LogoType = logos?.[make] || { src: "", name: "", scale: 1 };
    return res;
  };
  const getTag = (key: string): string => {
    if (!props.data) return "";
    let val = props.data?.[key]?.description || "";
    if (key === "FocalLength") val = val.replace(" ", "");
    else if (key === "") val = val.replace(" ", "/");
    return val;
  };

  createEffect(() => {
    if (props.src && imgContent) {
      props.onReady(imgContent);
    }
  });

  return (
    <Show when={props.src} fallback={<div></div>}>
      <div class="flex flex-col pb-4 touch-auto ">
        style={`width: calc(${props.customInfo?.size || "576px"} + 20px)`}
        <div
          class="
           flex flex-col  leading-none relative overflow-hidden drop-shadow-[0.5rem_0.5rem_0px_var(--second-color)]  box-border
          "
          style={`width: ${props.customInfo?.size || "576px"}`}
          ref={imgContent}
        >
          <img
            src={props.src}
            style={`width: ${props.customInfo?.size || "576px"}`}
            class="w-fit inline-block  rounded-tl rounded-tr"
          />
          <div class="w-full p-4 box-border bg-white flex justify-between items-center rounded-bl rounded-br">
            <div class="flex flex-col gap-y-0.5">
              <p class="text-sm text-black font-bold" contenteditable>
                {props.customInfo?.model || getTag("Model")}
              </p>
              <p class="text-sm text-gray-400" contenteditable>
                {formatExifTime(getTag("DateTimeOriginal"))}
              </p>
            </div>
            <div class="flex gap-x-1 items-center pointer-events-none select-none">
              <img
                class="inline-block w-10 origin-right"
                style={{
                  transform: `scale(${
                    getMakeLogo(props.customInfo?.logo || getTag("Make")).scale
                  })`,
                }}
                src={getMakeLogo(props.customInfo?.logo || getTag("Make")).src}
              />
              <Show
                when={getMakeLogo(props.customInfo?.logo || getTag("Make")).src}
              >
                <div class="w-0.5 h-10 bg-gray-400 m-x-1" />
              </Show>
              <div class="text-sm text-black flex flex-col gap-y-0.5 font-semibold">
                <div class="flex gap-x-1.7">
                  <Show when={getTag("FocalLength")}>
                    <p contenteditable>{getTag("FocalLength")}</p>
                  </Show>
                  <Show when={getTag("FNumber")}>
                    <p contenteditable>{getTag("FNumber")}</p>
                  </Show>
                  <Show when={getTag("ExposureTime")}>
                    <p contenteditable>{getTag("ExposureTime")}s</p>
                  </Show>
                  <Show when={getTag("ISOSpeedRatings")}>
                    <p contenteditable>ISO{getTag("ISOSpeedRatings")}</p>
                  </Show>
                </div>

                <div class="flex gap-x-2">
                  {(props.data?.themeColors || [])
                    .slice(0, props.customInfo?.colorNum)
                    .map((v: string) => (
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
      </div>
    </Show>
  );
};
