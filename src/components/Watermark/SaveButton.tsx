interface Props {
  loading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}
export default (props: Props) => {
  return (
    <button
      onClick={props.onClick}
      class={`px-4 py-2 bg-desc shadow-md text-blank hover:bg-secondary transition-all ${
        (props.loading || props.disabled) &&
        "cursor-not-allowed bg-secondary hover:bg-desc"
      }`}
    >
      {props.loading ? "Loading..." : "Save"}
    </button>
  );
};
