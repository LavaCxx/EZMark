import { onMount, createEffect } from "solid-js";
import { toFraction } from "../../utils/index";
export default (props: any) => {
  return (
    <div>
      <p>机型：{props.data.Model || ""}</p>
      <p>品牌：{props.data.Make || ""}</p>
      <p>拍摄时间：{props.data.DateTimeOriginal || ""}</p>
      <p>
        曝光时间：
        {toFraction(props.data.ExposureTime?.valueOf() || 0.00016) || ""}
      </p>
      <p>光圈：{props.data.FNumber?.valueOf() || ""}</p>
      <p>焦距：{props.data.FocalLength?.valueOf() || ""}</p>
      <p>ISO：{props.data.ISOSpeedRatings || ""}</p>
    </div>
  );
};
