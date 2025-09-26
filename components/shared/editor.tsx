import { useTheme } from "next-themes";
import React, { useEffect, useRef } from "react";
import { BlockNoteView, useBlockNote } from "@blocknote/react";
import { BlockNoteEditor, PartialBlock } from "@blocknote/core";
import { useEdgeStore } from "@/lib/edgestore";
import { TabsBlockConfig, insertTabsSlashItem } from "../blocks/tabs-block-config";

interface EditorProps {
  onChange: (value: string) => void;
  initialContent?: string;
  editable?: boolean;
}

const Editor = ({ onChange, editable, initialContent }: EditorProps) => {
  const { resolvedTheme } = useTheme();
  const { edgestore } = useEdgeStore();

  const handleUpload = async (file: File) => {
    const res = await edgestore.publicFiles.upload({ file });

    return res.url;
  };

  const isInitialized = useRef(false);

  const editor: BlockNoteEditor = useBlockNote({
    editable,
    blockSpecs: {
      tabs: TabsBlockConfig,
    },
    slashCommands: [
      insertTabsSlashItem,
    ],
    onEditorContentChange: (editor) => {
      onChange(JSON.stringify(editor.topLevelBlocks, null, 2));
    },
    uploadFile: handleUpload,
  });

  useEffect(() => {
    if (initialContent && editor && !isInitialized.current) {
      try {
        const parsed = JSON.parse(initialContent);
        if (Array.isArray(parsed)) {
          editor.replaceBlocks(editor.topLevelBlocks, parsed);
          isInitialized.current = true;
        }
      } catch (error) {
        console.error("Failed to load initial content:", error);
      }
    }
  }, [initialContent, editor]);

  return (
    <BlockNoteView
      editor={editor}
      theme={resolvedTheme === "dark" ? "dark" : "light"}
    />
  );
};

export default Editor;
