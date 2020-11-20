import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'

import { ContentState, convertToRaw, EditorState } from 'draft-js'
import draftToHtml from 'draftjs-to-html'
import htmlToDraft from 'html-to-draftjs'
import React, { useImperativeHandle, useState } from 'react'
import { ContentBlock, Editor as EditorCore } from 'react-draft-wysiwyg'

import { BlockRenderer } from '../blockRenderer'

export interface BaseEditorProps {
  onImageUpload?(file: File): string | Promise<string>
  editorClassName?: string
  toolbarClassName?: string
  wrapperClassName?: string
  placeholder?: string
  customBlockRenderFunc?(block: ContentBlock): any
}

export interface EditorRefObj {
  toHTMLString(): string
}

export interface EditorProps extends BaseEditorProps {
  forwardedRef?: { current: EditorRefObj }
}

export const parseEditorValue = (value: EditorState) =>
  draftToHtml(convertToRaw(value.getCurrentContent()))

export const restoreEditorValue = (html: string) => {
  const blocksFromHtml = htmlToDraft(html)
  const { contentBlocks, entityMap } = blocksFromHtml
  const contentState = ContentState.createFromBlockArray(
    contentBlocks,
    entityMap
  )
  return EditorState.createWithContent(contentState)
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
  placeholder,
  customBlockRenderFunc = BlockRenderer,
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
      placeholder={placeholder}
      onEditorStateChange={onChange}
      customBlockRenderFunc={customBlockRenderFunc}
      uploadCallback={async (file: File) => ({
        data: {
          link: await onImageUpload(file),
        },
      })}
    />
  )
}

export interface EditorControledProps extends BaseEditorProps {
  value?: EditorState
  onChange?: (editorState: EditorState) => void
  customBlockRenderFunc?(block: ContentBlock): any
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
  placeholder,
  customBlockRenderFunc = BlockRenderer,
}: EditorControledProps) => {
  return (
    <EditorCore
      editorClassName={editorClassName}
      toolbarClassName={toolbarClassName}
      wrapperClassName={wrapperClassName}
      editorState={value}
      onEditorStateChange={onChange}
      placeholder={placeholder}
      customBlockRenderFunc={customBlockRenderFunc}
      uploadCallback={async (file: File) => ({
        data: {
          link: await onImageUpload(file),
        },
      })}
    />
  )
}

export default Editor
