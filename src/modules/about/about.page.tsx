export default function AboutPage() {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">INFO</h2>
      <p>Staretz és un lloc estrany on no sé bé què pot passar.</p>
      <p>
        Versió: <span>1.0.0</span>
      </p>
      <p>
        Autor: <span>Vania</span>
      </p>
      <p>
        Any: <span>{new Date().getFullYear()}</span>
      </p>
    </div>
  );
}
