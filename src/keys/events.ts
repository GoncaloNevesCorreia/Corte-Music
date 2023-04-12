import { HelpInteractionOnClick } from "../commands/general/help/interactions/onClick";
import { HelpInteractionOnSelect } from "../commands/general/help/interactions/onSelect";
import { SetupInteractionOnSelect } from "../commands/music/setup/interactions/onSelect";

export const EVENT_NAMESPACES = {
  help: {
    name: "Help",
    root: "help_category_root",
    select: "help_category_select",
    action: "help_category_action",
    actions: {
      next: "+",
      back: "-",
    },
    onClick: HelpInteractionOnClick,
    onSelect: HelpInteractionOnSelect,
  },
  setup: {
    name: "Setup",
    select: "setup_channel_select",
    onSelect: SetupInteractionOnSelect,
  },
};
