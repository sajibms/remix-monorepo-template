/* eslint-disable import/no-named-as-default */
import Color from "@tiptap/extension-color";
import Image from '@tiptap/extension-image';
import ListItem from "@tiptap/extension-list-item";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import TextStyle from "@tiptap/extension-text-style";
import StarterKit from "@tiptap/starter-kit";
import ImageResize from 'tiptap-extension-resize-image';

import { CustomImage } from "./TipTapImage";

// * Defining Extensions Array
export const extensions = [
  Color.configure({ types: [TextStyle.name, ListItem.name] }),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TextStyle.configure({ types: [ListItem.name] } as any),
  TextAlign.configure({
    types: ['heading', 'paragraph'],
  }),
  StarterKit.configure({
    bulletList: {
      keepMarks: true,
      keepAttributes: false,
    },
    orderedList: {
      keepMarks: true,
      keepAttributes: false,
    },
  }),
  ImageResize,
  CustomImage,
  Image.configure({
    inline: true,
    allowBase64: true,
  }),
  Placeholder.configure({
    placeholder: 'Start typing or drag an image...'
  })
];
