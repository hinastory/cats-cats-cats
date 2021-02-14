const { Component, Fragment } = require('inferno');

module.exports = class extends Component {
  render() {
    const { post, helper } = this.props;
    const { __ } = helper;

    function gen(args) {
      if(!args || !args.json || args.json.length == 0)return "";

      var returnHTML = "";

      function generateHTML(list){
        let ret = "";
        let date = "";
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
      let title = __('article.related_posts', Infinity);
      if(returnHTML != ""){
          returnHTML = '<div class="' + args.class + '-box">' +'<div class="' + args.class + '-box-title">' + title + '</div>' + '<ul class="' + args.class + '">' + returnHTML + "</ul></div>";
      }
      return returnHTML;
    }
    const html = gen(helper.popular_posts_json({ maxCount: 6, isDate: true, isImage: true }, post));

    return <Fragment>
      <div dangerouslySetInnerHTML={{ __html: html }}></div>
    </Fragment>;
  }
}