import React, { createRef, PureComponent } from 'react';
import classnames from 'classnames';
import { CSSTransition } from 'react-transition-group';

import style from './Note.module.css';

class Note extends PureComponent {
  editorRef = createRef();

  componentDidMount() {
    const { isSelected } = this.props;

    if (!isSelected) return;

    this.focusEditor();
  }

  focusEditor = () => {
    this.editorRef.current.focus();
  };

  resizeEditor = () => {
    const el = this.editorRef.current;

    el.style.height = `${el.scrollHeight}px`;
  };

  handleClickNote = (e) => {
    if (e.target.matches('textarea')) return;

    this.focusEditor();
  };

  handleFocusNote = () => {
    const { id } = this.props;

    this.props.onFocus(id);
  };

  handleBlurNote = (e) => {
    const { id } = this.props;
    const { value } = e.target;

    this.props.onBlur(id, value);
  };

  handleChangeNote = (e) => {
    const { id } = this.props;
    const { value } = e.target;

    this.props.onChange(id, value);
    this.resizeEditor();
  };

  handleDeleteNote = (e) => {
    const { id } = this.props;

    e.stopPropagation();
    this.props.onDelete(id);
  };

  render() {
    const { in: transitionIn, isLocked, isSelected, onExited, value } = this.props;

    const className = classnames({
      [style.note]: true,
      [style.disabled]: isLocked,
      [style.selected]: isSelected,
    });

    const transitionClassNames = {
      enter: style.enter,
      enterActive: style.enterActive,
      exitActive: style.exitActive,
    };

    return (
      <CSSTransition
        classNames={transitionClassNames}
        in={transitionIn}
        onExited={onExited}
        timeout={1000}>
        <li className={className} onClick={this.handleClickNote}>
        
            <button className={style.close} onClick={this.handleDeleteNote}>
              ✕<span>Delete</span>
            </button>

          <textarea
            className={style.editor}
            columns="1"
            onBlur={this.handleBlurNote}
            onChange={this.handleChangeNote}
            onFocus={this.handleFocusNote}
            ref={this.editorRef}
            rows="1"
            value={value}>
          </textarea>
        </li>
      </CSSTransition>
    )
  }
}

export default Note;
