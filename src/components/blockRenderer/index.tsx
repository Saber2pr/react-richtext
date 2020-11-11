import React, { Component } from 'react'

class MediaComponent extends Component<any> {
  render() {
    const { block, contentState } = this.props
    const data = contentState.getEntity(block.getEntityAt(0)).getData()
    const emptyHtml = ' '
    return (
      <div>
        {emptyHtml}
        <img
          src={data.src}
          alt={data.alt || ''}
          style={{ height: data.height || 'auto', width: data.width || 'auto' }}
        />
      </div>
    )
  }
}

export function BlockRenderer(contentBlock) {
  const type = contentBlock.getType()

  // 图片类型转换为mediaComponent
  if (type === 'atomic') {
    return {
      component: MediaComponent,
      editable: false,
    }
  }
}
