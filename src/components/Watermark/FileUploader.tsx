import { createSignal, Show, onMount } from "solid-js"
type Props = {
  onChange: (files: FileList) => void
  loading: boolean
}
export default (props: Props) => {
  const accept = ".jpg,.jpeg,.png,.webp,.heic"
  let uploader: HTMLInputElement | undefined
  const [isDragging, setIsDragging] = createSignal<boolean>(false)
  const clickUpload = () => {
    if (props.loading) return
    if (uploader) {
      uploader.click()
    }
  }
  const dragEnter = (e: DragEvent) => {
    if (props.loading) return
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(() => true)
  }
  const dragLeave = (e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(() => false)
  }
  const drop = (e: DragEvent) => {
    if (props.loading) return
    e.preventDefault()
    e.stopPropagation()
    const files: FileList | undefined = e.dataTransfer?.files
    if (files) {
      props.onChange(files)
    }
    setIsDragging(() => false)
  }
  const disableDefaultEvents = () => {
    const doc = document.documentElement
    doc.addEventListener("dragleave", (e) => e.preventDefault())
    doc.addEventListener("drop", (e) => e.preventDefault())
    doc.addEventListener("dragenter", (e) => e.preventDefault())
    doc.addEventListener("dragover", (e) => e.preventDefault())
  }
  onMount(() => {
    disableDefaultEvents()
  })
  return (
    <>
      <div
        class={`w-full bg-blank h-auto py-4 md:h-60  border-dashed border-2 border-secondary rounded flex items-center justify-center cursor-pointer transition-all hover:shadow-inner${isDragging() ? " shadow-inner bg-desc" : ""
          } ${props.loading ? " cursor-not-allowed border-solid brightness-75" : ""
          }`}
        onClick={clickUpload}
        onDragEnter={dragEnter}
        onDragLeave={dragLeave}
        onDrop={drop}
      >
        <Show
          when={isDragging()}
          fallback={
            <>
              <span class="text-secondary select-none hidden md:block">
                {props.loading ? "Processing..." : "Drop or Click"}
              </span>
              <span class="text-secondary select-none block md:hidden">
                {props.loading ? "Processing..." : "Choose image"}
              </span>
            </>
          }
        >
          <span class="text-secondary select-none pointer-events-none">
            Drop image here
          </span>
        </Show>
      </div>
      <input
        class="hidden"
        type="file"
        ref={uploader}
        accept={accept}
        onChange={(e) => {
          const files: FileList | null = e.target.files
          if (files) {
            props.onChange(files)
            if (uploader) uploader.value = ""
          }
        }}
      />
    </>
  )
}
