import React from 'react'
import PropTypes from 'prop-types'
import BraftEditor from 'braft-editor'
import 'braft-editor/dist/index.css'

class RichTextEditor extends React.Component {
  static propTypes = {
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    onChange: PropTypes.func,
    placeholder: PropTypes.string,
    height: PropTypes.number
  }

  static defaultProps = {
    placeholder: '请输入正文内容...',
    height: 400
  }

  state = {
    editorState: BraftEditor.createEditorState(this.props.value || '')
  }

  handleChange = editorState => {
    this.setState({ editorState })
    if (this.props.onChange) {
      this.props.onChange(editorState.toHTML())
    }
  }

  render() {
    const { editorState } = this.state
    const { placeholder, height } = this.props

    const excludeControls = ['media', 'fullscreen']

    return (
      <div className="rich-text-editor" style={{ border: '1px solid #e8e8e8', borderRadius: 4 }}>
        <BraftEditor
          value={editorState}
          onChange={this.handleChange}
          placeholder={placeholder}
          contentStyle={{ height }}
          excludeControls={excludeControls}
        />
      </div>
    )
  }
}

export default RichTextEditor
