/**
 * modify open_graph helper
 *
 */
module.exports = function (hexo) {
  hexo.extend.helper.register('open_graph2', function (options) {
    const open_graph = hexo.extend.helper.get('open_graph').bind(this)(options);
    var result = open_graph.replace(/&#x2F;/g, '/');
    return result;
  });
}