type Props = {
  id: string;
  no: string;
  title: string;
};

// セクション番号＋見出し。Desktop は番号を上、Mobile は左に置く
export function SectionHeading({ id, no, title }: Props) {
  return (
    <div className="flex items-baseline gap-3.5 md:flex-col md:items-start md:gap-3">
      <span className="font-mono text-[11px] tracking-label text-accent md:text-xs">
        {no}
      </span>
      <h2
        id={id}
        className="font-display text-heading-md font-light tracking-heading md:text-heading-xl"
      >
        {title}
      </h2>
    </div>
  );
}
