import type { ReactNode } from "react";

type SectionHeadingProps = {
  eyebrow?: string;
  title: ReactNode;
  intro?: ReactNode;
  align?: "left" | "center";
  as?: "h1" | "h2" | "h3";
  className?: string;
  id?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  intro,
  align = "left",
  as: Tag = "h2",
  className = "",
  id,
}: SectionHeadingProps) {
  const alignment = align === "center" ? "mx-auto text-center items-center" : "";
  return (
    <div className={`flex max-w-2xl flex-col gap-4 ${alignment} ${className}`}>
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <Tag
        id={id}
        className={
          Tag === "h1"
            ? "text-6xl sm:text-7xl lg:text-8xl"
            : "text-5xl sm:text-6xl lg:text-7xl"
        }
      >
        {title}
      </Tag>
      {intro ? <div className="prose-gym">{intro}</div> : null}
    </div>
  );
}
