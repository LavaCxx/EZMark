import { Show } from "solid-js";
import { toFraction } from "../../utils/index";
import Nikon from "../../assets/svgs/Nikon.svg";
import Canon from "../../assets/svgs/Canon.svg";
import SONY from "../../assets/svgs/SONY.svg";
import html2canvas from "html2canvas";
export default (props) => {
  const makeSet = {
    Canon: Canon,
    SONY: SONY,
    Nikon: Nikon,
  };
  let imgContent;
  const download = () => {
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
  const getMakeLogo = (make: string) => {
    console.log(makeSet);
    return makeSet?.[make]?.src || "";
  };
  const isShowVr = ({
    FocalLength,
    FNumber,
    ExposureTime,
    ISOSpeedRatings,
  }) => {
    if (FocalLength || FNumber || ExposureTime || ISOSpeedRatings) {
      return true;
    }
    return false;
  };
  return (
    <Show when={props.src}>
      <div
        class="flex flex-col min-w-lg leading-none"
        onClick={download}
        ref={imgContent}
      >
        <img src={props.src} class="inline-block max-w-xl" />
        <div class="w-full p-4 box-border bg-white flex justify-between items-center">
          <div class="flex flex-col gap-y-1">
            <p class="text-base text-black font-bold">{props.data.Model}</p>
            <p class="text-sm text-gray-400">
              {formatExifTime(props.data.DateTimeOriginal)}
            </p>
          </div>
          <div class="flex gap-x-1 items-center pointer-events-none select-none">
            <img class="h-4 inline-block" src={getMakeLogo(props.data.Make)} />
            <Show when={isShowVr(props.data)}>
              <div class="w-0.5 h-10 bg-gray-400 m-x-1" />
            </Show>
            <div class="text-base text-black flex gap-x-1.5 font-bold">
              <Show when={props.data.Make}>
                <p>{props.data.FocalLength?.valueOf()}mm</p>
              </Show>
              <Show when={props.data.FNumber}>
                <p>f/{props.data.FNumber?.valueOf()}</p>
              </Show>
              <Show when={props.data.ExposureTime}>
                <p>{toFraction(props.data.ExposureTime?.valueOf())}</p>
              </Show>
              <Show when={props.data.ISOSpeedRatings}>
                <p>ISO</p>
                <p>{props.data.ISOSpeedRatings?.valueOf()}</p>
              </Show>
            </div>
          </div>
        </div>
      </div>
    </Show>
  );
};
