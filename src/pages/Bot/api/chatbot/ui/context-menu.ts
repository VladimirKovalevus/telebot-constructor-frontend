import { Presets } from "rete-react-plugin";
import styled from "styled-components";
import { $fontfamily } from "./consts";

export const Menu = styled(Presets.contextMenu.Menu)`
  width: 160px;
`;

export const Item = styled(Presets.contextMenu.Item)`
  background: #39393add;
  border-color: #ffffffc4;
  font-family: ${$fontfamily};
`;

export const Common = styled(Presets.contextMenu.Common)`
  background: #39393add;
  border-color: #ffffffc4;
  font-family: ${$fontfamily};
`;

export const Search = styled(Presets.contextMenu.Search)`
  border-color: #ffffffc4;
`;

export const Subitems = Presets.contextMenu.Subitems;
