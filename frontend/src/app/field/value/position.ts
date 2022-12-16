export class Position {

  private _position: number;

  constructor(position: number) {
    if (position < 1 || position > 6) {
      throw "Player position must be between 1 and 6.";
    }
    this._position = position;
  }

  get value(): number {
    return this._position;
  }

  public rotate(other: Position): Position {
    return new Position((this._position + other._position) % 6 + 1);
  }

}
