import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'

import { convertToRaw, EditorState } from 'draft-js'
import draftToHtml from 'draftjs-to-html'
import React, { useImperativeHandle, useState } from 'react'
import { Editor as EditorCore } from 'react-draft-wysiwyg'

export interface BaseEditorProps {
  onImageUpload?(file: File): string | Promise<string>
  editorClassName?: string
  toolbarClassName?: string
  wrapperClassName?: string
}

export interface EditorRefObj {
  toHTMLString(): string
}

export interface EditorProps extends BaseEditorProps {
  forwardedRef?: { current: EditorRefObj }
}

export const parseEditorValue = (value: EditorState) =>
  draftToHtml(convertToRaw(value.getCurrentContent()))

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
        return parseEditorValue(value)
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

export interface EditorControledProps extends BaseEditorProps {
  value: EditorState
  onChange: (editorState: EditorState) => void
}

/**
 * 提供受控组件，以支持Antd Form
 */
export const EditorControled = ({
  onImageUpload = URL.createObjectURL,
  editorClassName,
  toolbarClassName,
  wrapperClassName,
  value,
  onChange,
}: EditorControledProps) => {
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
