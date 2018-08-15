import buble from 'rollup-plugin-buble';

export default {
  output: {
    sourcemap: true,
  },
  input: 'src/badgee.js',
  moduleContext: {
    'src/console.js': '(typeof window !== "undefined" ? window : global)'
    // The line below also works (and results in a smaller bundle) but breaks the tests
    // suite and I didn't find any workarround yet... PR welcome ^^
    // 'src/console.js': 'this'
  },
  plugins: [
    buble()
  ]
};
