import clsx from "clsx";

export default function Button({ variante, chico, type = "button", className, children, onClick, disabled }) {
  return (
    <button
      type={type}
      className={clsx("btn", variante, { chico }, className)}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
