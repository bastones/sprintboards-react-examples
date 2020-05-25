class Arr {

  static countOf(array, value) {
    let increment = 0;

    for (const item of array) {
      if (item === value) {
        increment++;
      }
    }

    return increment;
  }

}

export default Arr;
