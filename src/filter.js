let include = null
let exclude = null

export const isFiltered = (str) => {
  return ((include != null) && !include.test(str)) //isntIncluded
    || ((exclude != null) && exclude.test(str)) // isExcluded
}

export const getFilter = (onFilterChange) => {
  return {
    none() {
      include = null
      exclude = null

      onFilterChange()
      return this;
    },

    include(matcher) {
      if (matcher !== include) {
        include = matcher
        onFilterChange()
      }
      return this
    },

    exclude(matcher) {
      if (matcher !== exclude) {
        exclude = matcher
        onFilterChange()
      }
      return this
    }
  };
}
