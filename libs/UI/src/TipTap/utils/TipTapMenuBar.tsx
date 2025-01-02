import { useFetcher } from "@remix-run/react";
import { Editor } from "@tiptap/core";
import { useEffect, useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import { AiOutlineAlignLeft, AiOutlineClose, AiOutlineOrderedList, AiOutlinePicture } from "react-icons/ai";
import { BiRedo, BiUndo } from "react-icons/bi";
import { BsTypeH1, BsTypeH2, BsTypeH3, BsTypeH4, BsTypeH5, BsTypeH6 } from "react-icons/bs";
import { FiAlignRight, FiBold, FiItalic } from "react-icons/fi";
import { GrBlockQuote } from "react-icons/gr";
import { MdFormatListBulleted, MdOutlineFormatAlignCenter, MdOutlineLayersClear } from "react-icons/md";
import { RiAlignJustify, RiStrikethrough } from "react-icons/ri";

export default function TipTapMenuBar({ editor }: { readonly editor: Editor }) {
  const [imageURL, setImageURL] = useState<string | null>(null);
  const [imageAlt, setImageAlt] = useState('');

  const fetcher = useFetcher();

  const isActive = "font-medium p-1 rounded-lg mr-1 mt-1 text-white bg-red-500";
  const notActive = "font-medium p-1 rounded-lg mr-1 mt-1";

  // * Effect to update the image URL
  useEffect(() => {
    if ((fetcher.data as { success: boolean; fileUrl: string })?.success && (fetcher.data as { success: boolean; fileUrl: string })?.fileUrl) {
      setImageURL((fetcher.data as { success: boolean; fileUrl: string }).fileUrl);
    }
  }, [fetcher.data]);

  if (!editor) return null;


  const handleFileUpload = (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", "Uploaded Image");

    fetcher.submit(formData, {
      method: "post",
      action: "/api/tiptap-image-upload",
      encType: "multipart/form-data",
    });
  };

  return (
    <div className="my-2 p-2 text-lg border rounded-md mx-auto flex flex-wrap items-center gap-1 sticky top-3">
      {/* Headings */}
      {[1, 2, 3, 4, 5, 6].map((level) => (
        <button
          key={level}
          type="button"
          onClick={(e) => {
            e.preventDefault()
            editor.chain().focus().toggleHeading({ level: level as 1 | 2 | 3 | 4 | 5 | 6 }).run()
          }}
          className={editor.isActive("heading", { level }) ? isActive : notActive}
        >
          {level === 1 ? <BsTypeH1 /> : null}
          {level === 2 ? <BsTypeH2 /> : null}
          {level === 3 ? <BsTypeH3 /> : null}
          {level === 4 ? <BsTypeH4 /> : null}
          {level === 5 ? <BsTypeH5 /> : null}
          {level === 6 ? <BsTypeH6 /> : null}
        </button>
      ))}

      {/* Formatting buttons */}
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault()
          editor.chain().focus().toggleBold().run()
        }}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={editor.isActive("bold") ? isActive : notActive}
      >
        <FiBold />
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault()
          editor.chain().focus().toggleItalic().run()
        }}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={editor.isActive("italic") ? isActive : notActive}
      >
        <FiItalic />
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault()
          editor.chain().focus().toggleStrike().run()
        }}
        disabled={!editor.can().chain().focus().toggleStrike().run()}
        className={editor.isActive("strike") ? isActive : notActive}
      >
        <RiStrikethrough />
      </button>
      {/* Paragraph */}
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault()
          editor.chain().focus().setParagraph().run()
        }}
        className={editor.isActive("paragraph") ? isActive : notActive}
      >
        P
      </button>

      {/* Bullet & Number list options */}
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault()
          editor.chain().focus().toggleBulletList().run()
        }}
        className={editor.isActive("bulletList") ? isActive : notActive}
      >
        <MdFormatListBulleted />
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault()
          editor.chain().focus().toggleOrderedList().run()
        }}
        className={editor.isActive("orderedList") ? isActive : notActive}
      >
        <AiOutlineOrderedList />
      </button>

      {/* Text Align */}
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault()
          editor.chain().focus().setTextAlign('left').run()
        }}
        className={editor.isActive({ textAlign: 'left' }) ? isActive : notActive}
      >
        <AiOutlineAlignLeft />
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault()
          editor.chain().focus().setTextAlign('center').run()
        }}
        className={editor.isActive({ textAlign: 'center' }) ? isActive : notActive}
      >
        <MdOutlineFormatAlignCenter />
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault()
          editor.chain().focus().setTextAlign('right').run()
        }}
        className={editor.isActive({ textAlign: 'right' }) ? isActive : notActive}
      >
        <FiAlignRight />
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault()
          editor.chain().focus().setTextAlign('justify').run()
        }}
        className={editor.isActive({ textAlign: 'justify' }) ? isActive : notActive}
      >
        <RiAlignJustify />
      </button>

      {/* Blockquote */}
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault()
          editor.chain().focus().toggleBlockquote().run()
        }}
        className={editor.isActive("blockquote") ? isActive : notActive}
      >
        <GrBlockQuote />
      </button>

      {/* Undo and Redo */}
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault()
          editor.chain().focus().undo().run()
        }}
        disabled={!editor.can().chain().focus().undo().run()}
        className={notActive}
      >
        <BiUndo />
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault()
          editor.chain().focus().redo().run()
        }}
        disabled={!editor.can().chain().focus().redo().run()}
        className={notActive}
      >
        <BiRedo />
      </button>

      {/* Clear options */}
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault()
          editor.chain().focus().unsetAllMarks().run()
        }}
        disabled={!editor.can().chain().focus().unsetAllMarks().run()}
        className={notActive}
      >
        <MdOutlineLayersClear />
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault()
          editor.chain().focus().clearNodes().run()
        }}
        disabled={!editor.can().chain().focus().clearNodes().run()}
        className={notActive}
      >
        <AiOutlineClose />
      </button>

      {/* Open the modal using document.getElementById('ID').showModal() method */}
      <button
        onClick={(e) => {
          e.preventDefault();
          (document.getElementById('my_modal_1') as HTMLDialogElement)?.showModal();
        }}
      >
        <AiOutlinePicture />
      </button>
      <dialog id="my_modal_1" className="modal">
        <div className="modal-box space-y-4">
          <div>
            {/* File Uploader */}
            <FileUploader
              handleChange={handleFileUpload}
              name="file"
              label="Upload Or Drop Image"
              multiple={false}
              uploadedLabel="Uploaded Successfully"
            />
          </div>
          {/* Alt Text */}
          <label htmlFor="altText" aria-label="Alt Text" className="form-control w-full">
            <div className="label">
              <span className="label-text">Add Alt Text</span>
            </div>
            <input
              type="text"
              placeholder="Alt Text"
              value={imageAlt}
              onChange={(e) => setImageAlt(e.target.value)}
              className="input input-bordered w-full"
            />
          </label>

          <div className="modal-action">
            {/* Confirm Insert */}
            <button
              className="btn btn-primary"
              onClick={(e) => {
                e.preventDefault();
                if (imageURL && imageAlt) {
                  editor.commands.setImage({ src: imageURL, alt: imageAlt });
                  setImageURL(null); // Reset after insertion
                  setImageAlt(""); // Clear Alt Text
                  (document?.getElementById('my_modal_1') as HTMLDialogElement)?.close(); // Close modal
                }
              }}
              disabled={!imageURL || !imageAlt} // Disable until both fields are filled
            >
              Insert Image
            </button>
            {/* Close Modal */}
            <form method="dialog">
              <button className="btn btn-success btn-outline">Close Modal</button>
            </form>
          </div>
        </div>
      </dialog>

    </div>
  );
}