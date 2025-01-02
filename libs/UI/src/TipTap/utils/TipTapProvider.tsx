import { EditorContent, useEditor } from '@tiptap/react';

import TipTapMenuBar from './TipTapMenuBar';
import { extensions } from './TipTapUtils';

export default function TipTapProvider({
  setContent,
  content,
}: Readonly<{
  setContent: (html: string) => void;
  content: string;
}>) {
  // * Tiptap editor configuration
  const editor = useEditor({
    extensions,
    content,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'prose prose-lg focus:outline-none focus:border-none',
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setContent(html);
    },
  });

  if (!editor) {
    return null; // * Ensure the editor is ready before rendering
  }
  return (
    <div className="my-2 rounded-xl border border-gray-300 p-2 relative">
      {/* Sticky menu bar container */}
      <TipTapMenuBar editor={editor} />
      {/* Editor content */}
      <div className="relative mt-2">
        <EditorContent
          editor={editor}
          className="w-full max-w-none border rounded-md p-2 min-h-[200px] prose prose-lg focus:outline-none focus:border-none"
        />
      </div>
      {/* Bubble menu container */}
      {/* <BubbleMenu editor={editor} className="bg-blue-200 rounded-lg mx-auto">
        <TipTapMenuBar editor={editor} />
      </BubbleMenu> */}
    </div>
  );
}
