// module.exports = {
//   extends: [require.resolve('@umijs/lint/dist/config/eslint')],
//   globals: {
//     page: true,
//     REACT_APP_ENV: true,
//   },
// };
// .eslintrc.js
module.exports = {
  // Umi 项目
  extends: require.resolve('umi/eslint'),

  // Umi Max 项目
  extends: require.resolve('@umijs/max/eslint'),
}
