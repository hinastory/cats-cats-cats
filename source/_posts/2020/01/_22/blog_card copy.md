---
title: ブログカードを支える技術
thumbnail: /gallery/thumbnails/blogCards.png
toc: true
categories:
  - Tech
  - Web
tags:
  - OGP
  - Hexo
date: 2020-01-19 07:28:45
---
ブログカードとは以下のようにリンクをちょっとリッチに表示してくれる機能のことです。以前はこれってどうやって実現しているんだろうと不思議に思っていました。

{% img /gallery/daily/others/blogCard.png %}
　
上記のようなブログカードは「はてなブログ」や「WordPress」等のブログサービスでよく見かけますが、基本的にこれらのブログカードは**リンク先のURLを指定するだけ**で自動的に生成されています。本記事では上記のようなブログカードを実際に**JavaScriptで実装してみる**ことで仕組みを深堀りしてみたいと思います。

<!-- more -->
## はじめに

本記事では、ブログカード[^1]の表示に使われる一般的な技術の解説およびJavaScriptによる実装を行います。普段何気なく見たり使ったりしているブログカードの技術に興味がある人におすすめします。

[^1]: リンクカードと呼ばれることもあります。

## ブログカードの基本

### ブログカードの構成

ブログカードは主に「タイトル」、「説明」、「画像」から成ります。オプションで「favicon」、「サイト名」、「ソーシャルカウント」を表示する場合もあります。

{% img /gallery/daily/others/blog-card-parts.png %}

### ブログカードの主な情報源

ブログカードの主な情報源は以下の３つになります。

- Open Graph Protocol
- favicon
- ソーシャルカウント

### Open Graph Protocol

まずはソーシャルグラフについて説明します。**ソーシャルグラフ**とはFacebookやTwitter等のSNS（ソーシャル・ネットワーク・サービス）において、人と人の繋がりである「ソーシャル・ネットワーク」を点と線で可視化したものです。「Graph」の由来は、点と点の結びつきに関する数学理論であるグラフ理論から来ています。

{% img /gallery/daily/others/sns.png %}
　
上記のようなソーシャルグラフの構築には点と点をつないで線にする仕組みが必要です。そのために考案されたのが{% elink Open Graph Protocol(OGP) https://ogp.me/ %}です。ソーシャルグラフにおける「点」と人ですが、インターネットではWebページを人とみなしてソーシャルグラフを構築します。WebページはHTML記述されHTTPプロトコルを用いてやり取りされますが、基本的にはOGPもその仕組みの上に成り立っています。具体的には以下の図のように単純な仕組みでメタデータのフォーマットのみがOGPで規定されていて、それ以外は既存のHTTPやHTMLの仕組みをそのまま利用しています。メタデータに関してはHTTPの`HEAD`メソッドで取得できるのでWebページ全体を取得しなくても済むようになっています。

{% img /gallery/daily/others/ogp.png %}

OGPで必須とされているメタデータは`og:title`、`og:type`、`og:image`、`og:url`の４つですが、`og:site_name`や`og:description`もよく利用されます。具体的なHTMLのヘッダに埋め込まれたメタデータの例は以下のようになります。

{% code lang:html %}
<meta property="og:type" content="article">
<meta property="og:title" content="とにかくかっこいいブログの作り方">
<meta property="og:url" content="https://tonikaku-kakkoii-blog.com/articles/how_to_create_kakkoii_blog/index.html">
<meta property="og:site_name" content="tonikaku-kakkoii-blog.com">
<meta property="og:description" content="とにかくかっこいいブログサイトを作るにはどうすればいいのかお悩みの方も多くいると思います。本記事ではデザイン、技術、記事内容の３つの視点で解説します。">
<meta property="og:image" content="https://https://tonikaku-kakkoii-blog.com/ore_kakkoii.png">
{% endcode %}

### favicon

「favicon」はWebサイトのシンボルとして表示される画像のことでブラウザのタブやブックマークで表示されることがあります[^3]。faviconの画像形式は伝統的にはICO形式でファイル名は`favicon.ico`になっているものが多いです。favicon画像をWebサイトのルートディレクトリに置いておくと自動的に認識されますが、最近は以下のようにHTMLのヘッダで指定することもできます。

{% code lang:html %}
<link rel="icon" href="tonikaku-kakkoii-blog.com/favicon.ico" />
{% endcode %}

MIMEタイプを指定することによってgifやpngといった画像形式にも対応できます[^4]。

{% code lang:html %}
<link rel="icon" type="image/png" href="tonikaku-kakkoii-blog.com/favicon.ico" />
{% endcode %}


<img src="https://hinastory.github.io/cats-cats-cats/favicon.ico"/>

### ソーシャルカウント

ソーシャルカウントは、SNSでシェアされた数のことで例えばはてなブックマークの数とかツイッターのいいねの数になります。

[^3]: faviconはもともとIEでお気に入りに登録されたときに表示されていた画像のことで「favarite icon」が由来とされています。
[^4]: 古いIE等ではICO形式以外は対応していないことがあります。


## ブログカードの実装

今回は以下のようなブログカードをJavaScriptで実装してみたいと思います。

{% img /gallery/daily/others/sample-blog-card.png %}

JavaScriptでHTMLを出力するイメージです。

{% code lang:js blog_card.js %}
getTag({url: "http://localhost:4000/cats-cats-cats/2020/01/05/blog_to_book/"}).then(e => console.log(e))
{% endcode lang:js %}

### HTMLの骨組み

まずはHTMLを出力するにあたって骨組みを考えます。最初は出力するイメージを再現できる素直な入れ子構造を考えます。ポイントはブログカードをクリックしたらリンク先に飛びたいのでリンクを示す`aタグ`でなるべく広く囲むことです。次にスタイル（CSS）を当てることを考えて不足しているレイヤーがあれば調整します。最終的にできた骨組みは以下になりました。

- hbc-blog-card
  - hbc-link-wrap
    - hbc-link(aタグ)
      - hbc-card
        - hbc-info
          - hbc-favicon
          - hbc-site-name
        - hbc-contents
          - hbc-thumbnail
          - hbc-text
            - hbc-title
            - hbc-url
            - hbc-description

{% code lang:js %}
getTag({url: "http://localhost:4000/cats-cats-cats/2020/01/05/blog_to_book/"}).then(e => console.log(e))
{% endcode lang:js %}


{% code lang:js %}

const util = require('hexo-util');
const ogs = require('open-graph-scraper');
const escapeHTML = require('escape-html');
const url = require('url');
const descriptionLength = 140;
const className = 'blog-card';
const faviconAPI = 'http://favicon.hatena.ne.jp/?url=$URL';

function getTag(options){
  return ogs(options)
    .then(function (result) {
      const ogp = result.data;

      const info = getInfo(options, ogp);
      const contents = getContents(options, ogp);

      const card = util.htmlTag('div', { class: 'hbc-card' }, info + contents);
      const link = util.htmlTag('a', { class: 'hbc-link', href: options.url, target: options.target, rel: options.rel }, card);
      const linkWrap = util.htmlTag('div', { class: 'hbc-link-wrap' }, link);
      const tag = util.htmlTag('div', { class: className }, linkWrap);
      return tag;
    })
    .catch(function (error) {
      console.log('error:', error);
      return '';
  });
}

function getInfo(options, ogp) {
  let name = '';
  const urlParsed = url.parse(options.url);

  if (ogp.hasOwnProperty('ogSiteName')) {
    name = ogp.ogSiteName;
  } else {
    name = urlParsed.hostname;
  }

  const siteName = util.htmlTag('div', { class: 'hbc-site-name' }, escapeHTML(name));

  let api = faviconAPI.replace('$DOMAIN', encodeURIComponent(urlParsed.hostname));
  api = api.replace('$URL', encodeURIComponent(options.url));
  const favicon = util.htmlTag('img', { class: 'hbc-favicon', src: api } , '');
  return util.htmlTag('div', { class: 'hbc-info' }, favicon + siteName);
}

function getContents(options, ogp) {
  let contents = '';
  let text = '';

  if (ogp.hasOwnProperty('ogImage')) {
    const image = util.htmlTag('img', { src: ogp.ogImage.url } , '');
    contents = util.htmlTag('div', { class: 'hbc-thumbnail' }, image);
  }

  text += util.htmlTag('div', { class: 'hbc-title' }, escapeHTML(ogp.ogTitle));
  text += util.htmlTag('div', { class: 'hbc-url' }, options.url);

  if (ogp.hasOwnProperty('ogDescription')) {
    const description = adjustLength(ogp.ogDescription);
    text += util.htmlTag('div', { class: 'hbc-description' }, escapeHTML(description));
  }
  contents += util.htmlTag('div', { class: 'hbc-text' }, text);

  return util.htmlTag('div', { class: 'hbc-contents' },  contents);
}

function adjustLength(description) {
  if (description && description.length > descriptionLength) {
    description = description.slice(0, descriptionLength) + '…';
  }
  return description;
}


{% endcode %}


### 最終的な出力(HTML)

最終的な出力は以下になります。

{% gist cd179d3f03728252e50c8859e4d73c5a %}

## まとめ


本記事がブログで「本」を作成してみたい方の一助となれば幸いです。

## 参考文献

- {% elink The Open Graph protocol https://ogp.me/ %}
- {% elink Favicon - Wikipedia https://ja.wikipedia.org/wiki/Favicon %}
- {% elink ファビコン画像を取得する便利なWebサービス（API） | 俺の開発研究所 https://itlogs.net/get-favicon/ %}