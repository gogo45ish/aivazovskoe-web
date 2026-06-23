// Renders one or more Schema.org JSON-LD blocks into the document. Server
// component — the markup is part of the prerendered HTML so crawlers (Yandex,
// Google) see it without executing JavaScript.
export default function JsonLd({
  data,
}: {
  data: Record<string, unknown> | Record<string, unknown>[];
}) {
  const blocks = Array.isArray(data) ? data : [data];
  return (
    <>
      {blocks.map((block, i) => (
        <script
          key={i}
          type="application/ld+json"
          // Schema is built from our own trusted data, not user input.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(block) }}
        />
      ))}
    </>
  );
}
