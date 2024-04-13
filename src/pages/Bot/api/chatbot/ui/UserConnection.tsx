import { css } from "styled-components";
import { ClassicScheme, Presets } from "rete-react-plugin";

const { Connection } = Presets.classic;

const styles = css`
  stroke: #ffffff66;
`;

export function UserConnectionComponent(props: {
  data: ClassicScheme["Connection"] & { isLoop?: boolean };
}) {
  return <Connection {...props} styles={() => styles} />;
}
