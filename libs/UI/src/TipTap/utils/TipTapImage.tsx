import Image from '@tiptap/extension-image';

export const CustomImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      name: {
        default: null,
        parseHTML: (element) => element.getAttribute('data-name'),
        renderHTML: (attributes) => {
          if (!attributes.name) return {};
          return { 'data-name': attributes.name };
        }
      },
      alt: {
        default: null,
        parseHTML: (element) => element.getAttribute('alt'),
        renderHTML: (attributes) => {
          if (!attributes.alt) return {};
          return { alt: attributes.alt };
        }
      },
    };
  },
});
