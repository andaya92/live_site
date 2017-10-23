exports.default = function * (task) {
  yield task.parallel(['styles', 'scripts']);
}
 
exports.styles = function * (task) {
  yield task.source('src/**/*.css').autoprefixer().target('dist/css');
}
 
exports.scripts = function * (task) {
  yield task.source('src/**/*.js').babel({
    presets: [
      ['es2015', { loose:true, modules:false }]
    ]
  }).target('dist/js');
}