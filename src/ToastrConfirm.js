import React, {Component, PropTypes} from 'react';
import CSSCore from 'fbjs/lib/CSSCore';
import {onCSSTransitionEnd, _bind, keyCode} from './utils';
import Button from './Button';

const ENTER = 13;
const ESC = 27;

class ToastrConfirm extends Component {
  constructor(props) {
    super(props);
    const {
      confirmOption,
      confirm
    } = this.props;

    const {
      okText,
      cancelText,
      transitionIn,
      transitionOut
    } = confirm.options;

    this.okText = okText || confirmOption.okText;
    this.cancelText = cancelText || confirmOption.cancelText;
    this.transitionIn = transitionIn || confirmOption.transitionIn;
    this.transitionOut = transitionOut || confirmOption.transitionOut;

    _bind('setTransition removeConfirm handleOnKeyUp handleOnKeyDown', this);
    this.isKeyDown = false;
  }

  componentDidMount() {
    this.isHiding = false;
    this.hasClicked = false;

    if (this.props.confirm.show) {
      this.setTransition(true);
    }
    if (window) {
      window.addEventListener('keyup', this.handleOnKeyUp);
      window.addEventListener('keydown', this.handleOnKeyDown);
    }
  }

  componentWillUnmount() {
    if (window) {
      window.removeEventListener('keyup', this.handleOnKeyUp);
      window.removeEventListener('keydown', this.handleOnKeyDown);
    }
  }

  handleOnKeyDown(e) {
    if (keyCode(e) == ENTER) {
      e.preventDefault();
    }
    this.isKeyDown = true;
  }

  handleConfirmClick() {
    if (this.hasClicked) return;
    this.hasClicked = true;

    const {options} = this.props.confirm;
    const onAnimationEnd = () => {
      this.removeConfirm();
      if (options && options.onOk) {
        options.onOk();
      }
    };

    this.setTransition();
    onCSSTransitionEnd(this.confirm, onAnimationEnd);
  }

  handleCancelClick() {
    if (this.hasClicked) return;
    this.hasClicked = true;

    const {options} = this.props.confirm;
    const onAnimationEnd = () => {
      this.removeConfirm();
      if (options && options.onCancel) {
        options.onCancel();
      }
    };

    this.setTransition();
    onCSSTransitionEnd(this.confirm, onAnimationEnd);
  }

  setTransition(add) {
    const body = document.querySelector('body');

    if (add) {
      this.isHiding = false;
      CSSCore.addClass(body, 'toastr-confirm-active');
      CSSCore.addClass(this.confirm, this.transitionIn);
      return;
    }

    this.isHiding = true;
    CSSCore.addClass(this.confirm, this.transitionOut);
  }

  removeConfirm() {
    this.isHiding = false;
    this.props.hideConfirm();
    const body = document.querySelector('body');
    CSSCore.removeClass(body, 'toastr-confirm-active');
  }

  handleOnKeyUp(e) {
    const code = keyCode(e);
    if (code == ESC) {
      this.handleCancelClick();
    } else if (code == ENTER && this.isKeyDown) {
      this.isKeyDown = false;
      this.handleConfirmClick();
    }
  }

  render() {
    return (
      <div className="confirm-holder">
          <div className="confirm animated" ref={ref => this.confirm = ref}>
            <div className="message">{this.props.confirm.message}</div>
            <Button onClick={this.handleConfirmClick.bind(this)}>
              {this.okText}
            </Button>
            <Button onClick={this.handleCancelClick.bind(this)}>
              {this.cancelText}
            </Button>
          </div>
        <div className="shadow"></div>
      </div>
    );
  }
}

ToastrConfirm.displayName = 'ToastrConfirm';
ToastrConfirm.propTypes = {
  confirm: PropTypes.object.isRequired
};

export default ToastrConfirm;
