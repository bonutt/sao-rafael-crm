import logoSR from "@/assets/logo-sr.png";

export function Logo({ size = 40 }: { size?: number }) {
  return (
    <img
      src={logoSR}
      alt="Hospital São Rafael"
      style={{ width: size, height: size, objectFit: "contain" }}
    />
  );
}
