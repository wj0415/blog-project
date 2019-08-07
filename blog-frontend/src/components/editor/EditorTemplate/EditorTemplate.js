import React, { Component } from "react";

import styles from "./EditorTemplate.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

class EditorTemplate extends Component {
  state = { leftPercentage: 0.5 };

  handleMouseMove = e => {
    this.setState({
      leftPercentage: e.clientX / window.innerWidth
    });
  };
  handleMouseUp = e => {
    document.body.removeEventListener("mousemove", this.handleMouseMove);
    window.removeEventListener("mouseup", this.handleMouseUp);
  };
  handleSeperatorMouseDown = e => {
    document.body.addEventListener("mousemove", this.handleMouseMove);
    window.addEventListener("mouseup", this.handleMouseUp);
  };
  render() {
    const { header, editor, preview } = this.props;
    const { leftPercentage } = this.state;
    const { handleSeperatorMouseDown } = this;

    //각 영역에 flex 값 적용
    const leftStyle = {
      flex: leftPercentage
    };
    const rightStyle = {
      flex: 1 - leftPercentage
    };
    const seperatorStyle = {
      left: `${leftPercentage * 100}%`
    };
    return (
      <div className={cx("editor-template")}>
        {header}
        <div className={cx("panes")}>
          <div className={cx("pane", "editor")} style={leftStyle}>
            {editor}
          </div>
          <div className={cx("pane", "preview")} style={rightStyle}>
            {preview}
          </div>
          <div
            className={cx("seperator")}
            style={seperatorStyle}
            onMouseDown={handleSeperatorMouseDown}
          />
        </div>
      </div>
    );
  }
}

export default EditorTemplate;
