import clsx from "clsx";

// Usa las clases globales de globals.css: .btn, .secundario, .peligro y .chico
export default function Button({ variante, chico, type = "button", className, children, ...props }) {
  return (
    <button type={type} className={clsx("btn", variante, { chico }, className)} {...props}>
      {children}
    </button>
  );
}
