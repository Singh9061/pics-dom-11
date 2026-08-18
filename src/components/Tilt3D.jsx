import { useRef } from "react";

/**
 * Mouse-follow 3D tilt wrapper. Hero should NOT use this.
 */
export default function Tilt3D({
  children,
  className = "",
  max = 12,
  scale = 1.03,
  glare = true,
}) {
  const ref = useRef(null);
  const glareRef = useRef(null);

  const onMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    const rotY = (x - 0.5) * max * 2;
    const rotX = (0.5 - y) * max * 2;
    el.style.transform =
      "perspective(900px) rotateX(" +
      rotX +
      "deg) rotateY(" +
      rotY +
      "deg) scale3d(" +
      scale +
      "," +
      scale +
      "," +
      scale +
      ")";

    if (glare && glareRef.current) {
      glareRef.current.style.opacity = "0.35";
      glareRef.current.style.background =
        "radial-gradient(circle at " +
        x * 100 +
        "% " +
        y * 100 +
        "%, rgba(255,255,255,0.35), transparent 55%)";
    }
  };

  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transform =
      "perspective(900px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)";
    if (glareRef.current) glareRef.current.style.opacity = "0";
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={"relative transform-gpu transition-transform duration-200 ease-out will-change-transform " + className}
      style={{ transformStyle: "preserve-3d" }}
    >
      {children}
      {glare && (
        <div
          ref={glareRef}
          className="pointer-events-none absolute inset-0 z-20 opacity-0 transition-opacity duration-300"
        />
      )}
    </div>
  );
}
