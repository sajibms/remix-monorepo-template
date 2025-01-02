import { useState } from 'react';

import TipTapProvider from './utils/TipTapProvider';

export function MakeTipTapContent({
  content,
  setContent,
  defaultContent,
}: Readonly<{
  content: string | undefined;
  setContent: (html: string) => void;
  defaultContent: string | undefined;
}>) {
  const [viewSource, setViewSource] = useState(false);

  const finalContent = content ?? defaultContent;

  return (
    <div>
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <input
            id="viewSource"
            type="checkbox"
            onChange={(e) => setViewSource(e.target.checked)}
          />
          <label htmlFor="viewSource" className="ml-2">
            View Source
          </label>
        </div>
      </div>
      {viewSource ? (
        <div className="mt-2 border rounded-lg border-gray-300 p-2">
          {finalContent}
        </div>
      ) : (
        <div>
          <TipTapProvider setContent={setContent} content={finalContent} />
          <input type="hidden" name="content" value={finalContent} />
        </div>
      )}
    </div>
  );
}
