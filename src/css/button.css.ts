import {css} from "lit";

export const buttonCss = css`
button {
  display: flex;
  cursor: pointer;
  background: transparent;
  padding: 0 12px;
  border: 1px solid #fff;
  border-left: 0;
  border-radius: 0 8px 8px 0;
  align-items: center;
}
button:active {
  padding-top: 3px;
}`;