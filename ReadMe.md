# @saber2pr/react-richtext

> richtext for react.

```bash
yarn add @saber2pr/react-richtext
```

# Feature

1. 富文本编辑，可插入图片

2. 提供图片上传接口，可扩展

3. 提供序列化 html 接口

# Start

示例 1：

```tsx
import React from 'react'
import ReactDOM from 'react-dom'

import { Editor } from '@saber2pr/react-richtext'

const App = () => {
  return <Editor />
}

ReactDOM.render(<App />, document.querySelector('#root'))
```

示例 2：

```tsx
import React, { useRef } from 'react'
import ReactDOM from 'react-dom'

import { EditorRefObj, Editor } from '@saber2pr/react-richtext'

// in nextjs
// import dynamic from 'next/dynamic'
// const EditorControled = dynamic(() => import('@saber2pr/react-richtext'), { ssr: false })

const App = () => {
  const ref = useRef<EditorRefObj>()
  return (
    <div>
      <h1>富文本编辑器</h1>
      <Editor
        forwardedRef={ref}
        onImageUpload={async file => {
          // 上传到阿里云oss，返回cdn url
          console.log('file', file)
          return 'https://img.alicdn.com/tfs/TB13DzOjXP7gK0jSZFjXXc5aXXa-212-48.png'
        }}
      />
      <button
        onClick={() => {
          // 获取编辑器内容html，提交到服务器保存，或前端插入展示
          const html = ref.current.toHTMLString()
          console.log(html)
        }}
      >
        提交
      </button>
    </div>
  )
}

ReactDOM.render(<App />, document.querySelector('#root'))
```

# Dependencies

react-draft-wysiwyg
