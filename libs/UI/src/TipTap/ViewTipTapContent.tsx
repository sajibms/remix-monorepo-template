import { useEffect, useState } from 'react';

export function ViewTipTapContent({ content }: { readonly content: string }) {
  const [currentContent, setCurrentContent] = useState(content);

  // * Update the current content when the content prop changes
  useEffect(() => {
    setCurrentContent(content);
  }, [content]);

  return (
    <div
      className="prose prose-lg w-full max-w-none"
      dangerouslySetInnerHTML={{ __html: currentContent }}
    />
  );
}
