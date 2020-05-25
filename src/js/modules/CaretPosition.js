class CaretPosition {

  constructor(input) {
    this.input = input;

    this.startPosition = this.input.selectionStart;
    this.endPosition = this.input.selectionEnd;

    // WebKit browsers set the startPosition to 0 by default
    if (this.startPosition === 0 && this.endPosition === 0) {
      this.startPosition = this.input.value.length;
      this.endPosition = this.input.value.length;
    }
  }

  getLeftCharacter() {
    return this.input.value.substring(this.startPosition - 1, this.startPosition);
  }

  getRightCharacter() {
    return this.input.value.substring(this.startPosition, this.startPosition + 1);
  }

  appendValue(value) {
    return new Promise(resolve => {
      if (/[^\s]/.test(this.getLeftCharacter())) {
        value = ` ${value}`;
      }

      if (!this.getLeftCharacter().length) {
        value = `${value} `;
      }

      if (/[a-zA-Z0-9]+/.test(this.getRightCharacter())) {
        value = `${value} `;
      }

      this.input.value = this.input.value.substring(0, this.startPosition) + value + this.input.value.substring(this.endPosition, this.input.value.length);

      let setCaretPosition = () => {
        let selectionRange = this.startPosition + value.length;
        this.input.setSelectionRange(selectionRange, selectionRange);

        setImmediate(() => {
          this.input.focus();
          
          resolve(this.input.value);
        });
      };

      setImmediate(() => {
        setCaretPosition();
      });
    });
  }

}

export default CaretPosition;
