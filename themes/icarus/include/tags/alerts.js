'use strict';

const util = require('hexo-util');
const htmlTag = util.htmlTag;
var hexoGlobal;

/**
* warning
*
* Syntax:
*   {% alerts warn %}
    message
*   {% endalerts %}
*   flags: s = short (default: full name), p = png (default: svg)
*/

function alertsTag(args, content) {
  const name = args[0]

  let rendered = hexoGlobal.render.renderSync({ text: content, engine: 'markdown' });
  const body = htmlTag('div', { class: `message-body` }, rendered, false);
  const article = htmlTag('article', { class: `message message-immersive  ${name}` }, body, false);

  return article;
}

module.exports = function (hexo) {
  hexoGlobal = hexo;
  hexo.extend.tag.register('alerts', alertsTag, { ends: true });
}
