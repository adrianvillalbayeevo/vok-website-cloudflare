import { Link } from "react-router-dom";
import { ASSETS } from "@/config/assets";

interface VokLogoProps {
  className?: string;
  height?: number;
  variant?: "light" | "dark";
}

export default function VokLogo({ className = "", height = 32, variant = "light" }: VokLogoProps) {
  // "light" = white wordmark (dark backgrounds); "dark" = navy wordmark (light backgrounds)
  const logoSrc = variant === "dark" ? ASSETS.logoNavy : ASSETS.logoWhite;
  return (
    <Link to="/" className={`inline-flex items-center ${className}`}>
      <img src={logoSrc} alt="VOK" className="block" style={{ height: `${height}px`, width: "auto" }} />
    </Link>
  );
}
