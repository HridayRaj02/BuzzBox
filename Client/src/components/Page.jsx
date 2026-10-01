export default function Page({ title, eyebrow, description, children }) {
  return (
    <section className="page">
      <div className="page-heading">
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p className="lede">{description}</p>
      </div>
      {children}
    </section>
  );
}
