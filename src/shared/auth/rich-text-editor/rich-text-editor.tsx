// import { Link, RichTextEditor } from "@mantine/tiptap";
// import Highlight from "@tiptap/extension-highlight";
// import Subscript from "@tiptap/extension-subscript";
// import Superscript from "@tiptap/extension-superscript";
// import TextAlign from "@tiptap/extension-text-align";
// import Underline from "@tiptap/extension-underline";
// import { useEditor } from "@tiptap/react";
// import StarterKit from "@tiptap/starter-kit";

// export interface RichTextEditorProps {
//   value?: string;
//   onChange?: (value: string) => void;
//   placeholder?: string;
// }

// export function CustomRichTextEditor({
//   value = "",
//   onChange,
//   placeholder,
// }: RichTextEditorProps) {
//   const editor = useEditor({
//     extensions: [
//       StarterKit,
//       Underline,
//       Link,
//       Superscript,
//       Subscript,
//       Highlight,
//       TextAlign.configure({ types: ["heading", "paragraph"] }),
//     ],
//     content: value,
//     onUpdate: ({ editor }) => {
//       onChange?.(editor.getHTML());
//     },
//   });

//   return (
//     <RichTextEditor editor={editor}>
//       <RichTextEditor.Toolbar sticky stickyOffset={60}>
//         <RichTextEditor.ControlsGroup>
//           <RichTextEditor.Bold />
//           <RichTextEditor.Italic />
//           <RichTextEditor.Underline />
//           <RichTextEditor.Strikethrough />
//           <RichTextEditor.ClearFormatting />
//           <RichTextEditor.Highlight />
//           <RichTextEditor.Code />
//         </RichTextEditor.ControlsGroup>

//         <RichTextEditor.ControlsGroup>
//           <RichTextEditor.H1 />
//           <RichTextEditor.H2 />
//           <RichTextEditor.H3 />
//           <RichTextEditor.H4 />
//         </RichTextEditor.ControlsGroup>

//         <RichTextEditor.ControlsGroup>
//           <RichTextEditor.BulletList />
//           <RichTextEditor.OrderedList />
//           <RichTextEditor.Subscript />
//           <RichTextEditor.Superscript />
//         </RichTextEditor.ControlsGroup>

//         <RichTextEditor.ControlsGroup>
//           <RichTextEditor.Link />
//           <RichTextEditor.Unlink />
//         </RichTextEditor.ControlsGroup>

//         <RichTextEditor.ControlsGroup>
//           <RichTextEditor.AlignLeft />
//           <RichTextEditor.AlignCenter />
//           <RichTextEditor.AlignJustify />
//           <RichTextEditor.AlignRight />
//         </RichTextEditor.ControlsGroup>

//         <RichTextEditor.ControlsGroup>
//           <RichTextEditor.Undo />
//           <RichTextEditor.Redo />
//         </RichTextEditor.ControlsGroup>
//       </RichTextEditor.Toolbar>

//       <RichTextEditor.Content />
//     </RichTextEditor>
//   );
// }
