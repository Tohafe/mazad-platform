interface SellerDocumentProps {
  document: string;
}

export function SellerDocument({ 
  document,
}: SellerDocumentProps) {
  //If document is null, undefined, or just empty spaces, render nothing.
  if (!document || document.trim() === '') {
    return null;
  }

  return (
    <div className="pb-2">
        <h2 className="text-base font-semibold uppercase tracking-widest text-secondary mb-3">
          Item document
        </h2>
        <a href={document} target="_blank" rel="noopener noreferrer" style={{ color: "blue" }}>
          Open Document
        </a>
        <div className="flex items-center gap-4">
        </div>
      </div>
  );
}