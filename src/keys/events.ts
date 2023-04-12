import { HelpInteractionCallback } from "../events/interactionCreate/interactions/help";
import { SetupInteractionCallback } from "../events/interactionCreate/interactions/setup";

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
    callback: HelpInteractionCallback,
  },
  setup: {
    name: "Setup",
    select: "setup_channel_select",
    callback: SetupInteractionCallback,
  },
};
