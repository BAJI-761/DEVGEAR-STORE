export default function StaticPage({ title, description }) {
  return (
    <section className="card">
      <h2>{title}</h2>
      <p className="lead">{description}</p>
    </section>
  );
}