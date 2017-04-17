import buble from 'rollup-plugin-buble';
export default {
  useStrict: false,
  entry: 'src/badgee.js',
  moduleContext: {
    console: 'window'
  },
  plugins: [
    buble()
  ]
};
