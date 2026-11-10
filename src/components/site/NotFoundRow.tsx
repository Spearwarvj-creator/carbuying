/** A row of payment tiles with one missing: the page that is not here. Decorative. */
export function NotFoundRow() {
  return (
    <div className="nf-row" aria-hidden="true">
      {Array.from({ length: 12 }, (_, i) => (
        <i key={i} className="nf-tile" data-gap={i === 7} />
      ))}
    </div>
  );
}
