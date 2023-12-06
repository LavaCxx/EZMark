import { createSignal, Show, onMount } from "solid-js";
type Props = {
  change: (files: FileList) => void;
};
export default (props: Props) => {
  let uploader: HTMLInputElement | undefined;
  const [isDragging, setIsDragging] = createSignal<boolean>(false);
  const clickUpload = () => {
    if (uploader) {
      uploader.click();
    }
  };
  const dragEnter = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(() => true);
  };
  const dragLeave = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(() => false);
  };
  const drop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const files: FileList | undefined = e.dataTransfer?.files;
    if (files) {
      props.change(files);
    }
    setIsDragging(() => false);
  };
  const disableDefaultEvents = () => {
    const doc = document.documentElement;
    doc.addEventListener("dragleave", (e) => e.preventDefault());
    doc.addEventListener("drop", (e) => e.preventDefault());
    doc.addEventListener("dragenter", (e) => e.preventDefault());
    doc.addEventListener("dragover", (e) => e.preventDefault());
  };
  onMount(() => {
    disableDefaultEvents();
  });
  return (
    <>
      <div
        class={
          "w-80 h-60 border-dashed border-2 border-secondary rounded flex items-center justify-center cursor-pointer transition-all hover:shadow-inner hover:border-solid " +
          (isDragging() && "shadow-inner border-solid")
        }
        onClick={clickUpload}
        onDragEnter={dragEnter}
        onDragLeave={dragLeave}
        onDrop={drop}
      >
        <Show
          when={isDragging()}
          fallback={
            <span class="text-secondary select-none">拖拽或点击上传</span>
          }
        >
          <span class="text-secondary select-none pointer-events-none">
            将图片拖到此处
          </span>
        </Show>
      </div>
      <input
        class="hidden"
        type="file"
        ref={uploader}
        onChange={(e) => {
          const files: FileList | null = e.target.files;
          if (files) {
            props.change(files);
            if (uploader) uploader.value = "";
          }
        }}
      />
    </>
  );
};
