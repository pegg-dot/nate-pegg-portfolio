type Item = {
  label: "WHAT" | "WHY" | "HOW" | "WHEN";
  text: string;
};

export default function ProjectBrief({ items }: { items: Item[] }) {
  return (
    <section className="caseBand caseBriefBand">
      <div className="caseBriefGrid">
        {items.map((item) => (
          <article key={item.label}>
            <span>{item.label}</span>
            <p>{item.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
