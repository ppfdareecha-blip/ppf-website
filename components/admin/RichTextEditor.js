"use client";

import dynamic from "next/dynamic";
import { useRef, useMemo } from "react";

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
  loading: () => (
    <div className="w-full min-h-[300px] p-4 bg-vibrant-offwhite rounded-2xl border-2 border-transparent animate-pulse flex items-center justify-center text-vibrant-charcoal/40 text-sm uppercase tracking-wider">
      Loading Editor...
    </div>
  ),
});

// Import Quill CSS - only on client
if (typeof window !== "undefined") {
  require("react-quill-new/dist/quill.snow.css");
}

/**
 * RichTextEditor - A WYSIWYG editor for opinion descriptions.
 *
 * Supports:
 * - Rich text formatting (bold, italic, underline, headers)
 * - Ordered & unordered lists
 * - Tables (Insert > Table via toolbar)
 * - Inline images (uploaded as base64, displayed inline)
 * - Links, blockquotes, code blocks
 * - Charts/graphs can be embedded as images (screenshot and insert)
 *
 * Usage:
 *   <RichTextEditor value={html} onChange={setHtml} />
 *
 * The `value` and `onChange` deal with HTML strings.
 * Store this HTML in the `description` field of AdminOpinion.
 */
export default function RichTextEditor({ value, onChange, placeholder }) {
  const quillRef = useRef(null);

  // Custom image handler: converts uploaded file to base64 and inserts inline
  const imageHandler = () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = () => {
      const file = input.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result;
        const quill = quillRef.current?.getEditor();
        if (quill) {
          const range = quill.getSelection(true);
          quill.insertEmbed(range.index, "image", base64);
          quill.setSelection(range.index + 1);
        }
      };
      reader.readAsDataURL(file);
    };
  };

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, 3, 4, false] }],
          ["bold", "italic", "underline", "strike"],
          [{ color: [] }, { background: [] }],
          [{ list: "ordered" }, { list: "bullet" }],
          [{ indent: "-1" }, { indent: "+1" }],
          [{ align: [] }],
          ["blockquote", "code-block"],
          ["link", "image"],
          [{ table: "insert-table" }],
          ["clean"],
        ],
        handlers: {
          image: imageHandler,
        },
      },
      clipboard: {
        matchVisual: false,
      },
    }),
    []
  );

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "color",
    "background",
    "list",
    "indent",
    "align",
    "blockquote",
    "code-block",
    "link",
    "image",
    "table",
  ];

  return (
    <div className="rich-editor-wrapper">
      <style>{`
        /* Override Quill styles to match the admin panel aesthetic */
        .rich-editor-wrapper .ql-toolbar {
          background: #f4f4f6;
          border: none;
          border-bottom: 2px solid #e5e7eb;
          border-radius: 1rem 1rem 0 0;
          padding: 10px 12px;
          font-family: inherit;
        }
        .rich-editor-wrapper .ql-container {
          border: none;
          min-height: 280px;
          font-size: 15px;
          font-family: inherit;
          background: #f4f4f6;
          border-radius: 0 0 1rem 1rem;
        }
        .rich-editor-wrapper .ql-editor {
          min-height: 280px;
          padding: 1.25rem 1.5rem;
          color: #1a1a2e;
          line-height: 1.7;
        }
        .rich-editor-wrapper .ql-editor.ql-blank::before {
          color: #9ca3af;
          font-style: normal;
          font-size: 14px;
        }
        .rich-editor-wrapper .ql-editor table {
          border-collapse: collapse;
          width: 100%;
          margin: 1rem 0;
        }
        .rich-editor-wrapper .ql-editor table td,
        .rich-editor-wrapper .ql-editor table th {
          border: 1px solid #d1d5db;
          padding: 8px 12px;
          text-align: left;
        }
        .rich-editor-wrapper .ql-editor table th {
          background: #f4f4f6;
          font-weight: 700;
        }
        .rich-editor-wrapper .ql-editor img {
          max-width: 100%;
          border-radius: 0.5rem;
          margin: 0.5rem 0;
        }
        .rich-editor-wrapper .ql-editor pre {
          background: #1e1e2e;
          color: #cdd6f4;
          border-radius: 0.5rem;
          padding: 1rem;
          font-size: 13px;
        }
        .rich-editor-wrapper .ql-editor blockquote {
          border-left: 4px solid #8B5CF6;
          margin: 0.5rem 0;
          padding: 0.25rem 0 0.25rem 1rem;
          color: #6b7280;
          font-style: italic;
        }
        .rich-editor-wrapper .ql-toolbar button:hover,
        .rich-editor-wrapper .ql-toolbar button:focus {
          color: #8B5CF6 !important;
        }
        .rich-editor-wrapper .ql-toolbar button.ql-active {
          color: #8B5CF6 !important;
        }
        .rich-editor-wrapper .ql-toolbar .ql-stroke {
          stroke: #4b5563;
        }
        .rich-editor-wrapper .ql-toolbar button:hover .ql-stroke,
        .rich-editor-wrapper .ql-toolbar button.ql-active .ql-stroke {
          stroke: #8B5CF6 !important;
        }
        .rich-editor-wrapper .ql-toolbar .ql-fill {
          fill: #4b5563;
        }
        .rich-editor-wrapper .ql-toolbar button:hover .ql-fill,
        .rich-editor-wrapper .ql-toolbar button.ql-active .ql-fill {
          fill: #8B5CF6 !important;
        }
        .rich-editor-wrapper .ql-snow .ql-picker {
          color: #4b5563;
        }
        .rich-editor-wrapper .ql-snow .ql-picker:hover .ql-picker-label {
          color: #8B5CF6;
        }
        .rich-editor-wrapper .ql-snow.ql-toolbar:after {
          content: none;
        }
      `}</style>

      <div className="border-2 border-transparent focus-within:border-vibrant-violet rounded-2xl overflow-hidden transition-all duration-200">
        <ReactQuill
          ref={quillRef}
          theme="snow"
          value={value}
          onChange={onChange}
          modules={modules}
          formats={formats}
          placeholder={
            placeholder ||
            "Write the opinion description here...\n\nYou can:\n• Format text (bold, italic, headers)\n• Insert tables via the toolbar\n• Upload images inline\n• Add blockquotes and code blocks\n• Paste chart screenshots as images"
          }
        />
      </div>

      {/* Helper tip */}
      <p className="text-[11px] text-vibrant-charcoal/40 mt-2 uppercase tracking-wider">
        💡 Tip: Use the toolbar to insert tables, images, and format text. For graphs/charts, take a screenshot and insert it as an image.
      </p>
    </div>
  );
}
