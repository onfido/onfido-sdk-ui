import React from 'react'

declare global {
  namespace React {
    interface ReactElement {
      nodeName: any
      attributes: any
      children: any
    }
  }
}
