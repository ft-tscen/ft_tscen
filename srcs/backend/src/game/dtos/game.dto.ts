import { Ball } from './ball.dto';
import { P1 } from './p1.dto';
import { P2 } from './p2.dto';
import { Score } from './score.dto';

export class GameOutput {
  constructor(private  ball: Ball, private p1: P1, private p2: P2, private score: Score) {}
}
