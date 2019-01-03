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

  render() {
    const { isLocked, isSelected, onBlur, onChange, onFocus, value, ...rest } = this.props;

    const className = classnames({
      [style.note]: true,
      [style.disabled]: isLocked,
      [style.selected]: isSelected,
    });

    const transitionClassNames = {
      enter: style.enter,
      enterActive: style.enterActive,
    };

    return (
      <CSSTransition {...rest} classNames={transitionClassNames} timeout={1000}>
        <li className={className} onClick={this.handleClickNote}>
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