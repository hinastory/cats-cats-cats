'use strict';

const util = require('hexo-util');
const htmlTag = util.htmlTag;
let ctx;

/**
* Details tag
*
* Syntax:
*   {% details summary %}
%    detail text
*   {% enddetails %}
*/

function detailsTag(args, content) {
  let summary = htmlTag('summary', {}, args.join(' '));
  let rendered = ctx.render.renderSync({text: content, engine: 'markdown'});
  return htmlTag('details', {}, summary + rendered);
}

module.exports = function (hexo) {
  ctx = hexo;
  hexo.extend.tag.register('details', detailsTag, {ends: true});
}
