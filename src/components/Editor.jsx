import React, { useRef, useMemo } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const Editor = ({ value, onChange, readOnly = false }) => {
  const quillRef = useRef();

  const imageHandler = () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = () => {
        const base64Image = reader.result;
        const editor = quillRef.current.getEditor();
        const range = editor.getSelection();
        editor.insertEmbed(range?.index || 0, "image", base64Image);
      };
      reader.readAsDataURL(file);
    };
  };

  const modules = useMemo(() => {
    if (readOnly) return { toolbar: false };

    return {
      toolbar: {
        container: [
          [{ header: [1, 2, 3, false] }],
          ["bold", "italic", "underline", "strike"],
          [{ color: [] }, { background: [] }],
          [{ font: [] }],
          [{ align: [] }],
          [{ indent: "-1" }, { indent: "+1" }],
          [{ list: "ordered" }, { list: "bullet" }],
          ["link", "image"],
          ["clean"],
        ],
        handlers: {
          image: imageHandler,
        },
      },
      keyboard: {
        bindings: {
          tab: {
            key: 9,
            handler: function () {
              const quill = quillRef.current.getEditor();
              quill.format("indent", "+1");
              return false;
            },
          },
          shiftTab: {
            key: 9,
            shiftKey: true,
            handler: function () {
              const quill = quillRef.current.getEditor();
              quill.format("indent", "-1");
              return false;
            },
          },
        },
      },
    };
  }, [readOnly]);

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "color",
    "background",
    "font",
    "align",
    "indent",
    "list",
    "bullet",
    "link",
    "image",
  ];

  return (
    <ReactQuill
      ref={quillRef}
      value={value}
      onChange={onChange}
      modules={modules}
      formats={formats}
      readOnly={readOnly}
      theme="snow"
      style={{
        backgroundColor: readOnly ? "#f5f5f5" : "#fff",
        borderRadius: "6px",
      }}
    />
  );
};

export default Editor;
