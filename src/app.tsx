import React, { useRef } from 'react'
import ReactDOM from 'react-dom'

import Editor, { EditorRefObj } from './'

const App = () => {
  const ref = useRef<EditorRefObj>()
  return (
    <div>
      <h1>富文本编辑器</h1>
      <Editor
        editor={ref}
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
