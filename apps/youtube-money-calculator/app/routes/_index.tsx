import { MakeTipTapContent, NewsLetterSection } from '@acme/UI';
import { useState } from 'react';

export default function Index() {
  const [content, setContent] = useState('');

  return (
    <div>
      <NewsLetterSection />

      <MakeTipTapContent content={content} setContent={setContent} defaultContent={undefined} />
    </div>
  );
}
