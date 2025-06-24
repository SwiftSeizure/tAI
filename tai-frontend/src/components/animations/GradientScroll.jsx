import { useEffect, useState } from "react";

export default function GradientScroll() {
  const [scrollOffset, setScrollOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setScrollOffset(y * 0.5); // adjust speed factor here
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className="h-screen w-screen bg-gradient-to-b from-blue-200 via-green-200 to-blue-200 bg-[length:100%_200%] animate-scrollGradient fixed top-0 left-0 -z-10"
      style={{ backgroundPositionY: `${scrollOffset}px` }}
    />
  );
}
