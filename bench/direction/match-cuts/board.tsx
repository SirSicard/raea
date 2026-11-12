// The chain's board as a project draws it (MC4): `raea show board.tsx`.
import { Board } from "./checks/match-cuts/board";
import morning from "./good.chain";
import { PLACES } from "./places";

export default () => <Board chain={morning} places={PLACES} />;
