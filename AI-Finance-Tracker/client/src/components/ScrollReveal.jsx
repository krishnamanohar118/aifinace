import { useEffect, useRef, useState } from "react";

export default function ScrollReveal({
  as: Component = "div",
  children,
  className = "",
  delay = 0,
  style,
  ...props
}) {
  const elementRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = elementRef.current;

    if (!element) return undefined;

    const reduceMotion = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reduceMotion) {
      setVisible(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        rootMargin: "0px 0px -8% 0px",
        threshold: 0.12,
      },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <Component
      ref={elementRef}
      className={`scroll-reveal ${visible ? "is-visible" : ""} ${className}`.trim()}
      style={{
        ...style,
        "--reveal-delay": typeof delay === "number" ? `${delay}ms` : delay,
      }}
      {...props}
    >
      {children}
    </Component>
  );
}
