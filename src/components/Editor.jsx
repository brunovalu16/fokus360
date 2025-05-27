import React, { useMemo, useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storageFokus360 } from "../data/firebase-config";

const Editor = ({ value, onChange, readOnly = false }) => {
  const quillRef = useRef();

  const handleImageUpload = () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input.files?.[0];
      if (file) {
        const caminho = `quill_uploads/${Date.now()}_${file.name}`;
        const storageRef = ref(storageFokus360, caminho);

        try {
          await uploadBytes(storageRef, file);
          const url = await getDownloadURL(storageRef);

          const editor = quillRef.current.getEditor();
          const range = editor.getSelection();
          editor.insertEmbed(range?.index || 0, "image", url);
        } catch (error) {
          console.error("Erro no upload da imagem:", error);
          alert("❌ Erro ao fazer upload da imagem.");
        }
      }
    };
  };

  const modules = useMemo(() => {
    if (readOnly) {
      return { toolbar: false }; // 🔥 Remove toolbar quando estiver bloqueado
    }

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
          image: handleImageUpload,
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
      theme="snow"
      value={value}
      onChange={onChange}
      modules={modules}
      formats={formats}
      placeholder="Digite aqui..."
      readOnly={readOnly} // 🔥 Aqui ativa o modo somente leitura
      style={{ backgroundColor: readOnly ? "#f3f3f3" : "#fff", borderRadius: "8px" }}
    />
  );
};

export default Editor;
