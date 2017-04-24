const filter = {
  include : null,
  exclude : null
};

export function isFiltered(str) {
  const isntIncluded = (filter.include != null) && !filter.include.test(str);
  const isExcluded = (filter.exclude != null) && filter.exclude.test(str);
  return isntIncluded || isExcluded
}

export function getFilter(onFilterChange) {
  return {
    none() {
      filter.include = null
      filter.exclude = null

      onFilterChange()
      return this;
    },

    include(matcher = null) {
      if (matcher !== filter.include) {
        filter.include = matcher;
        onFilterChange()
      }
      return this;
    },

    exclude(matcher = null) {
      if (matcher !== filter.exclude) {
        filter.exclude = matcher;
        onFilterChange();
      }
      return this;
    }
  };
}
