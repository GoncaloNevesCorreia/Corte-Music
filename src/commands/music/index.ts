import { category } from "../../utils";
import pause from "./pause";
import play from "./play";
import repeat from "./repeat";
import resume from "./resume";
import setup from "./setup";
import shuffle from "./shuffle";
import skip from "./skip";
import stop from "./stop";

export default category("Music", [
  pause,
  play,
  repeat,
  resume,
  setup,
  shuffle,
  skip,
  stop,
]);
