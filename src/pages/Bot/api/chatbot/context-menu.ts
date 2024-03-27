import { render } from "react-dom";
import { Presets } from "rete-react-plugin";
import styled from "styled-components";

const { Menu, Common, Search, Item, Subitems } = Presets.contextMenu;

const CustomMenu = styled(Menu)`
  width: 320px;
`;

const CustomItem = styled(Item)`
  background: grey;
`;

render.addPreset(
  Presets.contextMenu.setup({
    customize: {
      main: () => CustomMenu,
      item: () => CustomItem,
      common: () => Common,
      search: () => Search,
      subitems: () => Subitems,
    },
  }),
);
