import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'

import { convertToRaw, EditorState } from 'draft-js'
import draftToHtml from 'draftjs-to-html'
import React, { useImperativeHandle, useState } from 'react'
import { Editor as EditorCore } from 'react-draft-wysiwyg'

export interface EditorProps {
  onImageUpload?(file: File): string | Promise<string>
  forwardedRef?: { current: EditorRefObj }
  editorClassName?: string
  toolbarClassName?: string
  wrapperClassName?: string
}

export interface EditorRefObj {
  toHTMLString(): string
}

/**
 * 这里不用forwardRef的原因是为了支持next/dynamic
 */
export const Editor = ({
  onImageUpload = URL.createObjectURL,
  forwardedRef,
  editorClassName,
  toolbarClassName,
  wrapperClassName,
}: EditorProps) => {
  const [value, onChange] = useState<EditorState>()
  useImperativeHandle(forwardedRef, () => ({
    toHTMLString: () => {
      if (value) {
        return draftToHtml(convertToRaw(value.getCurrentContent()))
      }
    },
  }))
  return (
    <EditorCore
      editorClassName={editorClassName}
      toolbarClassName={toolbarClassName}
      wrapperClassName={wrapperClassName}
      editorState={value}
      onEditorStateChange={onChange}
      uploadCallback={async (file: File) => ({
        data: {
          link: await onImageUpload(file),
        },
      })}
    />
  )
}

export default Editor
