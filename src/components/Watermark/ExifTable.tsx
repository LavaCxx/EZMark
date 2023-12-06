export default (props: any) => {
  const getTag = (key: string) => {
    if (!props.data) return "";
    return props.data[key]?.description || "";
  };
  return (
    <div>
      <p>机型：{getTag("Model")}</p>
      <p>品牌：{getTag("Make")}</p>
      <p>拍摄时间：{getTag("DateTimeOriginal")}</p>
      <p>
        曝光时间：
        {getTag("ExposureTime")}
      </p>
      <p>光圈：{getTag("FNumber")}</p>
      <p>焦距：{getTag("FocalLength")}</p>
      <p>ISO：{getTag("ISOSpeedRatings")}</p>
    </div>
  );
};
