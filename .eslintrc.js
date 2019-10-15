module.exports = {
  root: true,
  'extends': [
     'plugin:vue/essential',
      '@vue/standard'
  ],
  rules: {
    // allow async-await
    'generator-star-spacing': 'off',
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'vue/no-parsing-error': [2, { 'x-invalid-end-tag': false }],
    'no-undef': 'off',
    'eqeqeq': 0,
    'no-unused-vars': [0, {
      // 允许声明未使用变量
      'vars': 'local',
      // 参数不检查
      'args': 'none'
    }],
    'no-extend-native': 0,//扩展native对象
    'no-cond-assign': 0, //条件语句的条件中不允许出现赋值运算符
    'no-constant-condition': 0, //条件语句的条件中不允许出现恒定不变的量
    'one-var':["error", {  const: "never" }]
  }
}
