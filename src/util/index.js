// Thanks
// https://stackoverflow.com/a/15030117/1870317

module.exports = {
  flatten: function flatten(arr) {
    return arr.reduce((flat, toFlatten) => (
      flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten)
    ), []);
  },

  zip: function (array1, array2) {
    return array1.map((element, index) => [element, array2[index]]);
  }
}