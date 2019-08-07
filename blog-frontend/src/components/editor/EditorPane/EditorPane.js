import React, { Component } from "react";
import styles from "./EditorPane.scss";
import classNames from "classnames/bind";

import CodeMirror from "codemirror";

//마크다운 문법색상
import "codemirror/mode/markdown/markdown";
//마크다운 내부에 들어가는 코드 색상
import "codemirror/mode/javascript/javascript";
import "codemirror/mode/jsx/jsx";
import "codemirror/mode/css/css";
import "codemirror/mode/shell/shell";

//CodeMirror를 위한 CSS 스타일링
import "codemirror/lib/codemirror.css";
import "codemirror/theme/monokai.css";

const cx = classNames.bind(styles);

class EditorPane extends Component {
  editor = null; //editor ref
  codeMirror = null; //codeMirror인스턴스
  cursor = null; //에디터의 텍스트 커서 위치
  initializeEditor = () => {
    this.codeMirror = CodeMirror(this.editor, {
      mode: "markdown",
      theme: "monokai",
      lineNumbers: true, //왼쪽에 라인 넘버띄우기 ,
      lineWrapping: true //내용이 너무길면 다음줄에 작성
    });
    this.codeMirror.on("change", this.handleChangeMarkdown);
  };
  componentDidMount() {
    this.initializeEditor();
  }
  handleChange = e => {
    const { onChangeInput } = this.props;
    const { value, name } = e.target;
    onChangeInput({ name, value });
  };
  handleChangeMarkdown = doc => {
    const { onChangeInput } = this.props;
    this.cursor = doc.getCursor(); //텍스트 cursor위치 저장
    onChangeInput({
      name: "markdown",
      value: doc.getValue()
    });
  };
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.markdown !== this.props.markdown) {
      const { codeMirror, cursor } = this;
      if (!codeMirror) return; //인스턴스를 아직 만들지 않았을때
      codeMirror.setValue(this.props.markdown);
      if (!cursor) return; //커서가 없을때
      codeMirror.setCursor(cursor);
    }
  }
  render() {
    const { handleChange } = this;
    const { tags, title } = this.props;
    return (
      <div className={cx("editor-pane")}>
        <input
          className={cx("title")}
          placeholder="제목을 입력하세요"
          name="title"
          value={title}
          onChange={handleChange}
        />
        <div className={cx("code-editor")} ref={ref => (this.editor = ref)} />
        <div className={cx("tags")}>
          <div className={cx("description")}>태그</div>
          <input
            name="tags"
            placeholder="태그를 입력하세요 (쉼표로 구분)"
            value={tags}
            onChange={handleChange}
          />
        </div>
      </div>
    );
  }
}

export default EditorPane;