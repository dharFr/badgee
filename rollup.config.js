import buble from 'rollup-plugin-buble';

export default {
  useStrict: false,
  sourceMap: true,
  entry: 'src/badgee.js',
  moduleContext: {
    'src/console.js': 'window'
  },
  plugins: [
    buble()
  ]
};
