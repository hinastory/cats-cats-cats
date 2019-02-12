/**
* Helper functions for page/post.
*
* @example
*     <%- is_categories(page) %>
*     <%- is_tags(page) %>
*     <%- page_title(page) %>
*     <%- meta(post) %>
*     <%- has_thumbnail(post) %>
*     <%- get_thumbnail(post) %>
*/
module.exports = function (hexo) {
    function trim(str) {
        return str.trim().replace(/^"(.*)"$/, '$1').replace(/^'(.*)'$/, '$1');
    }

    function split(str, sep) {
        var result = [];
        var matched = null;
        while (matched = sep.exec(str)) {
            result.push(matched[0]);
        }
        return result;
    }

    hexo.extend.helper.register('is_categories', function (page = null) {
        return (page === null ? this.page : page).__categories;
    });

    hexo.extend.helper.register('is_tags', function (page = null) {
        return (page === null ? this.page : page).__tags;
    });

    /**
     * Generate html head title based on page type
     */
    hexo.extend.helper.register('page_title', function (page = null) {
        page = page === null ? this.page : page;
        let title = page.title;

        if (this.is_archive()) {
            title = this._p('common.archive', Infinity);
            if (this.is_month()) {
                title += ': ' + page.year + '/' + page.month;
            } else if (this.is_year()) {
                title += ': ' + page.year;
            }
        } else if (this.is_category()) {
            title = this._p('common.category', 1) + ': ' + page.category;
        } else if (this.is_tag()) {
            title = this._p('common.tag', 1) + ': ' + page.tag;
        } else if (this.is_categories()) {
            title = this._p('common.category', Infinity);
        } else if (this.is_tags()) {
            title = this._p('common.tag', Infinity);
        }

        const siteTitle = hexo.extend.helper.get('get_config').bind(this)('title', '', true);
        return [title, siteTitle].filter(str => typeof (str) !== 'undefined' && str.trim() !== '').join(' - ');
    });

    hexo.extend.helper.register('meta', function (post) {
        var metas = post.meta || [];
        var output = '';
        var metaDOMArray = metas.map(function (meta) {
            var entities = split(meta, /(?:[^\\;]+|\\.)+/g);
            var entityArray = entities.map(function (entity) {
                var keyValue = split(entity, /(?:[^\\=]+|\\.)+/g);
                if (keyValue.length < 2) {
                    return null;
                }
                var key = trim(keyValue[0]);
                var value = trim(keyValue[1]);
                return key + '="' + value + '"';
            }).filter(function (entity) {
                return entity;
            });
            return '<meta ' + entityArray.join(' ') + ' />';
        });
        return metaDOMArray.join('\n');
    });

    hexo.extend.helper.register('has_thumbnail', function (post) {
        const getConfig = hexo.extend.helper.get('get_config').bind(this);
        const allowThumbnail = getConfig('article.thumbnail', true);
        if (!allowThumbnail) {
            return false;
        }
        return post.hasOwnProperty('thumbnail') && post.thumbnail;
    });

    hexo.extend.helper.register('no_share', function (post) {
        return post.hasOwnProperty('no_share') && post.no_share;
    });

    hexo.extend.helper.register('no_meta', function (post) {
        return post.hasOwnProperty('no_meta') && post.no_meta;
    });

    hexo.extend.helper.register('get_thumbnail', function (post) {
        const hasThumbnail = hexo.extend.helper.get('has_thumbnail').bind(this)(post);
        return this.url_for(hasThumbnail ? post.thumbnail : 'images/thumbnail.svg');
    });

    hexo.extend.helper.register('htmlGenerator', function(args){
        if(!args || !args.json || args.json.length == 0)return "";

        var returnHTML = "";

        function generateHTML(list){
          var ret = "";
          var data = "";
          ret += "<li class=\"" + args.class + "-item\">";

          if(list.date && list.date != ""){
            date = '<div class="'+args.class+'-date">' + list.date + "</div>";
          }

          if(list.img && list.img != ""){
              ret += '<div class="'+args.class+'-img">' + '<a href="' + list.path + '" title="'+ list.title +'" rel="bookmark">' + '<img src="'+list.img+'" />' + "</a>"  + "</div>";
          }
          ret += '<div class="'+args.class+'-title"><h3>' + date + '<a href="' + list.path + '" title="'+ list.title +'" rel="bookmark">'+ list.title + "</a></h3></div>";
          if(list.excerpt &&  list.excerpt != ""){
              ret += '<div class="'+args.class+'-excerpt"><p>' + list.excerpt + "</p></div>";
          }

          ret +=  "</li>";
          return ret;
        }

        for(var i=0; i<args.json.length; i++){
            returnHTML += generateHTML(args.json[i]);
        }
        let title = this._p('article.related_posts', Infinity);
        if(returnHTML != ""){
            returnHTML = '<div class="' + args.class + '-box">' +'<div class="' + args.class + '-box-title">' + title + '</div>' + '<ul class="' + args.class + '">' + returnHTML + "</ul></div>";
        }
        return returnHTML;
      });

}