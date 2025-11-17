// src/AdSense.jsx
import { useEffect, useRef } from "react";

export default function AdSense({
  slot,                                   // your ad-slot ID
  client = "ca-pub-2170097031678782",     // your publisher ID
  format = "auto",
  fullWidth = true,
  style = { display: "block", minHeight: 250 },
}) {
  const ref = useRef(null);

  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return; // don’t push ads in dev
    if (!window.adsbygoogle || !ref.current) return;

    try {
      window.adsbygoogle.push({});
    } catch {
      /* silently ignore if not ready yet */
    }
  }, [slot]);

  return (
    <ins
      ref={ref}
      className="adsbygoogle"
      style={style}
      data-ad-client={client}
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive={fullWidth ? "true" : "false"}
    />
  );
}
