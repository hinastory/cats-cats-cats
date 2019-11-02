'use strict';

const util = require('hexo-util');
const htmlTag = util.htmlTag;

/**
* GitHub card
*
* Syntax:
*   {% gh-card user/repo [flags] %}
*   flags: s = short (default: full name), p = png (default: svg)
*/

function ghCardTag(args) {
  const name = args[0]
  const flags = args[1] ? args[1] : ""
  const fullname = flags.indexOf('s') == -1 ? '?fullname' : ''
  const format = flags.indexOf('p') == -1 ? 'svg' : 'png'

  var img = htmlTag('img', {src: `https://gh-card.dev/repos/${name}.${format}` + fullname}, '');
  return htmlTag('a', {href: `https://github.com/${name}`}, img);
}

module.exports = function (hexo) {
  hexo.extend.tag.register('ghCard', ghCardTag);
}
