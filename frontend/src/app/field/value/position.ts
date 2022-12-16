export class Position {
  private _position: number;

  constructor(position: number) {
    if (position < 1 || position > 6) {
      throw new Error("Player position must be between 1 and 6.");
    }
    this._position = position;
  }

  get value(): number {
    return this._position;
  }

  public rotate(other: Position): Position {
    const offset = other._position - 1;
    let newPosition = this._position + offset;
    if (newPosition > 6) {
      newPosition = newPosition - 6;
    }
    return new Position(newPosition);
  }
}
