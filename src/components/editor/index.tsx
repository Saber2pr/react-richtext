import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'

import { convertToRaw, EditorState } from 'draft-js'
import draftToHtml from 'draftjs-to-html'
import React, { useImperativeHandle, useState } from 'react'
import { Editor as EditorCore } from 'react-draft-wysiwyg'

export interface EditorProps {
  onImageUpload(file: File): Promise<string>
  forwardedRef?: { current: EditorRefObj }
}

export interface EditorRefObj {
  toHTMLString(): string
}

/**
 * 这里不用forwardRef的原因是为了支持next/dynamic
 */
export const Editor = ({ onImageUpload, forwardedRef }: EditorProps) => {
  const [value, onChange] = useState<EditorState>()
  useImperativeHandle(forwardedRef, () => ({
    toHTMLString: () => draftToHtml(convertToRaw(value.getCurrentContent())),
  }))
  return (
    <EditorCore
      editorState={value}
      onEditorStateChange={onChange}
      uploadCallback={async (file: any) => ({
        data: {
          link: await onImageUpload(file),
        },
      })}
    />
  )
}

export default Editor
