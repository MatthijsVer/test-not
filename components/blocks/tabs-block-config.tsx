import { createReactBlockSpec } from "@blocknote/react";
import { TabsBlock, TabData } from "./tabs-block";

// Define the tabs block using createReactBlockSpec
export const TabsBlockConfig = createReactBlockSpec(
  {
    type: "tabs",
    propSchema: {
      tabs: {
        default: [
          {
            id: "tab-1",
            label: "Tab 1", 
            content: "",
          },
        ] as TabData[],
      },
    },
    content: "none",
  },
  {
    render: (props) => (
      <TabsBlock
        tabs={props.block.props.tabs}
        onTabsChange={(tabs) => {
          props.editor.updateBlock(props.block, {
            props: { tabs },
          });
        }}
        readOnly={!props.editor.isEditable}
      />
    ),
  }
);

// Slash menu item for inserting tabs
export const insertTabsSlashItem = {
  name: "Tabs",
  execute: (editor: any) => {
    editor.insertBlocks(
      [
        {
          type: "tabs",
          props: {
            tabs: [
              {
                id: `tab-${Date.now()}-1`,
                label: "Tab 1",
                content: "",
              },
              {
                id: `tab-${Date.now()}-2`,
                label: "Tab 2", 
                content: "",
              },
            ],
          },
        },
      ],
      editor.getTextCursorPosition().block,
      "after"
    );
  },
  aliases: ["tabs", "tab"],
  group: "Advanced",
  icon: "Tabs",
  hint: "Insert interactive tabs",
};