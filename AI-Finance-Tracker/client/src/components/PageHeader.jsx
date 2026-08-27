export default function PageHeader({ title, description }) {
  return (
    <header className="page-header">
      <div>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>

      <span className="phase-tag"></span>
    </header>
  );
}
