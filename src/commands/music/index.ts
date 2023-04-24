import { category } from "../../utils";
import filter from "./filter";
import pause from "./pause";
import play from "./play";
import repeat from "./repeat";
import resume from "./resume";
import setup from "./setup";
import shuffle from "./shuffle";
import skip from "./skip";
import stop from "./stop";
import volume from "./volume";

export default category("Music", [
  filter,
  pause,
  play,
  repeat,
  resume,
  setup,
  shuffle,
  skip,
  stop,
  volume,
]);
