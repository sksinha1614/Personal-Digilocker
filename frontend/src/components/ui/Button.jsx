export default function Button({ className = "", variant = "primary", children, ...props }) {
  const base = {
    primary: "vault-btn-primary",
    secondary: "vault-btn-secondary",
    outline: "vault-btn-outline",
    danger: "vault-btn-danger",
  };
  return (
    <button className={`${base[variant] || base.primary} ${className}`} {...props}>
      {children}
    </button>
  );
}
