import { Presets, ClassicScheme, RenderEmit } from "rete-react-plugin";
import { css } from "styled-components";
import { $fontfamily } from "./consts";

const styles = css<{ selected?: boolean }>`
  background: #39393add;
  padding: 0px;
  border: 5px #ffffffc4 solid;
  border-radius: 25px;
  transition: all 0.4s;

  .title {
    color: white;
    text-align: center;
    border-radius: 20px 20px 0 0;
    border-bottom: 5px #ffffffc4 solid;
    font-family: ${$fontfamily};
    font-weight: 100;
    font-size: 1.2em;
    transition: all 0.4s;
  }

  &:hover {
    background: #6b6b6e;
  }

  .input-title,
  .output-title {
    font-weight: 100;
    font-family: ${$fontfamily};
  }

  .output-socket {
    margin-right: -1px;
  }

  .input-socket {
    margin-left: -1px;
  }

  .input {
    display: flex;
    align-items: center;
    background-color: transparent !important;
  }

  ${(props) =>
    props.selected &&
    css`
      border-color: #2c2b2bc4;
      .title {
        border-color: #2c2b2bc4;
      }
    `}
`;

type Props<S extends ClassicScheme> = {
  data: S["Node"];
  styles?: () => any;
  emit: RenderEmit<S>;
};

export function CustomNodeComponent<S extends ClassicScheme>(props: Props<S>) {
  return <Presets.classic.Node styles={() => styles} {...props} />;
}
