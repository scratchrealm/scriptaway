import React, { HTMLAttributes, PropsWithChildren } from "react";

import classnames from "classnames";

interface CellMenuProps extends React.FC<HTMLAttributes<HTMLDivElement>> {
  visible: boolean;
}

export type Props = React.FC<HTMLAttributes<HTMLUListElement>>;

interface MenuItemProps extends React.FC<HTMLAttributes<HTMLLIElement>> {
  className?: string;
  onClick?: () => void;
  focusWithin?: boolean;
  tabIndex?: number;
}

// jfm added PropsWithChildren
export const CellMenuSection: PropsWithChildren<Props> = ({ children }) => {
  return <ul className="cell-menu-section">{children}</ul>;
};

// jfm added PropsWithChildren
export class CellMenuItem extends React.PureComponent<PropsWithChildren<MenuItemProps>, {}> {
  element: any = React.createRef();

  handleKeypress = (e: KeyboardEvent) => {
    if (e.keyCode === 13 || e.keyCode === 32) {
      this.props.onClick && this.props.onClick();
    }
  };

  handleFocus = () => {
    if (this.props.focusWithin) {
      this.element.current.querySelector(":first-child").focus();
    }
  };

  componentDidMount() {
    this.element.current.addEventListener("focus", this.handleFocus);
    this.element.current.addEventListener("keypress", this.handleKeypress);
  }

  componentWillUnmount() {
    this.element.current.removeEventListener("focus", this.handleFocus);
    this.element.current.removeEventListener("keypress", this.handleKeypress);
  }

  render() {
    const { children, className, focusWithin, ...props } = this.props;

    return (
      <li
        ref={this.element}
        className={classnames("cell-menu-item", className)}
        {...props}
      >
        {children}
      </li>
    );
  }
}

// jfm added PropsWithChildren
export const CellMenu: React.FC<PropsWithChildren<CellMenuProps>> = ({ visible, children }) => {
  return (
    <div className={visible ? "cell-menu" : "cell-menu-hidden cell-menu"}>
      {children}
    </div>
  );
};
