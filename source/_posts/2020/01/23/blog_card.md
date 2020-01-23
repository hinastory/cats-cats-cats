---
title: ブログカードを支える技術
thumbnail: /gallery/thumbnails/blogCards.png
categories:
  - Tech
  - Web
tags:
  - OGP
  - Hexo
date: 2020-01-23 07:28:45
---
ブログカードとは以下のようにリンクをちょっとリッチに表示してくれる機能のことです。以前はこれってどうやって実現しているんだろうと不思議に思っていました。

{% img /gallery/daily/others/blogCard.png %}
　
上記のようなブログカードは「はてなブログ」や「WordPress」等のブログサービスでよく見かけますが、基本的にこれらのブログカードは**リンク先のURLを指定するだけ**で自動的に生成されています。本記事では上記のようなブログカードを支える技術について解説します。

<!-- more -->

## 目次
<!-- toc -->

## はじめに

本記事では、ブログカード[^1]の表示に使われる一般的な技術の解説およびJavaScriptによる実装を行います。普段何気なく見たり使ったりしているブログカードの技術に興味がある人におすすめします。

[^1]: リンクカードと呼ばれることもあります。

## ブログカードの要素技術

まずはブログカードを実現するための要素技術について解説します。

### ブログカードの構成

ブログカードは主に「タイトル」、「説明」、「画像」から成ります。オプションで「favicon」、「サイト名」、「ソーシャルカウント」を表示する場合もあります。

{% img /gallery/daily/others/blog-card-parts.png %}

### ブログカードの主な情報源

ブログカードの主な情報源は以下の３つになりますが、メインの「タイトル」、「説明」、「画像」といった情報を提供しているのはOpen Graph Protocolになります。

- Open Graph Protocol(OGP)
- favicon
- ソーシャルカウント

### Open Graph Protocol

Open Graph Protocolの説明の前提知識として、まずはソーシャルグラフについて説明します。**ソーシャルグラフ**とはFacebookやTwitter等のSNS（ソーシャル・ネットワーク・サービス）において、人と人の繋がりである「ソーシャル・ネットワーク」を点と線で可視化したものです。「Graph」の由来は、点と点の結びつきに関する数学理論であるグラフ理論から来ています。

{% img /gallery/daily/others/sns.png %}
　
上記のようなソーシャルグラフの構築には点と点をつないで線にする仕組みが必要です。そのために考案されたのが{% elink Open Graph Protocol(OGP) https://ogp.me/ %}です。ソーシャルグラフにおける「点」は「人」を表していますが、Webの世界ではWebページを「人」とみなしてソーシャルグラフを構築します。WebページはHTMLで記述されHTTPプロトコルを用いてやり取りされますが、基本的にはOGPもその仕組みの上に成り立っています。具体的には以下の図のように単純な仕組みでメタデータのフォーマットのみがOGPで規定されていて、それ以外は既存のHTTPやHTMLの仕組みをそのまま利用しています。

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

「favicon」はWebサイトのシンボルとして表示される画像のことでブラウザのタブやブックマークで表示されます。もともとInternet Explorer 5で「お気に入り」に画像を表示するための技術で、「favicon」の由来は「favarite icon」だとされています。

{% img /gallery/daily/others/favicon.png %}
　
faviconの画像形式には特に決まりがなくブラウザ依存ですが、伝統的にはICO形式です。ICO形式はWindowsのアイコン形式で、以下のように正方形の任意の画像サイズを複数格納できるようになっています[^2]。
　
{% img /gallery/daily/others/ico.png %}
　
Webサイトにfaviconを設定する伝統的な手法はWebサイトのルートディレクトリに`favicon.ico`というファイル名でICO形式のファイルを配置することです。しかし近年のブラウザではそれ以外にも以下のようにHTMLのヘッダでfaviconを指定することもできます。

{% code lang:html %}
<link rel="icon" href="tonikaku-kakkoii-blog.com/favicon.ico" />
{% endcode %}

MIMEタイプを指定することによってgifやpngといった画像形式にも対応できます[^4]。

{% code lang:html %}
<link rel="icon" type="image/png" href="tonikaku-kakkoii-blog.com/favicon.png" />
{% endcode %}

[^2]: ここではICO形式の一般的な特徴のみ説明しており、フォーマットの詳細については割愛させて頂きます。

### favicon取得用API

faviconはこれまで説明してきたとおり画像形式も配置場所もばらばらなので、単純にブログカードに表示させることはできません。JavaScriptでもある程度はできるかもしれませんがICO形式等のマルチ画像のフォーマットがあると厳しいです。そこでブログカード用にfavicon取得用のAPIをサーバサイドで実装するのが一般的です。favicon取得用APIではfaviconを取得してブログカードの表示に適切は画像フォーマットとサイズに変換してクライアントに返却します。このようなAPIは自作することも公開されているサービスを利用することもできます。以下にfavicon取得用APIの例を掲載します[^3]。

- GoogleのAPI
  - 書式
    - http://www.google.com/s2/favicons?domain=<ドメイン名>
  - 例
    - http://www.google.com/s2/favicons?domain=www.google.co.jp
- HatenaのAPI
  - 書式
    - http://favicon.hatena.ne.jp/?url=<サイトURL>
  - 例
    - http://favicon.hatena.ne.jp/?url=https://hatenablog.com/

### ソーシャルカウント

ソーシャルカウントは一般的にSNSにおける「人気」を表す指標のことで、例えば**はてなブックマークの数**とかFacebookの**いいねの数**になります。ソーシャルカウントを取得する方法は、サービスによってそれぞれ異なります。具体例として以下にはてなブックマーク数を取得するAPIを掲載します。

- はてなブックマークの取得API
  - 書式
    - https://bookmark.hatenaapis.com/count/entry?url=<サイトURL>
  - 例
    - https://bookmark.hatenaapis.com/count/entry?url=http%3A%2F%2Fwww.hatena.ne.jp%2F

[^3]: ここではfavicon取得用APIの説明用の参考例として掲載しています。おそらく非公式なのでご利用にはお気を付けください。


## ブログカードの実装

今回は以下のようなブログカードをサーバサイドJavaScript(Node.js)で実装してみたいと思います。

{% img /gallery/daily/others/sample-blog-card.png %}

JavaScriptでHTMLを出力するイメージです。今回は`getTag`関数を実装し、戻り値はPromiseとします。利用方法は以下のとおりです

{% code lang:js %}
getTag({url: "https://hinastory.github.io/cats-cats-cats/2019/12/29/visualize_ruby_development_by_file/"}).then(e => console.log(e))
{% endcode %}

### HTMLの骨組み

まずはHTMLを出力するにあたって骨組みを考えます。最初は出力するイメージを再現できる素直な入れ子構造を考えます。ポイントはブログカードをクリックしたらリンク先に飛びたいのでリンクを示す`aタグ`でなるべく広く囲むことです。次にスタイル（CSS）を当てることを考えて不足しているレイヤーがあれば調整します。最終的にできた骨組みは以下になりました。aタグと書かれた箇所以外は全てdivタグで、class属性の骨格を示しています。

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

### JavaScriptにおける実装

実装は以下のとおりです。基本的には上記の骨格どうりにHTMLタグを組み立てているだけです。今回はソーシャルリンクの実装は行っていませんが、実装はそれほど難しくはないはずです。

{% code lang:js blog_card.js %}
const util = require('hexo-util');
const ogs = require('open-graph-scraper'); // Open Graph Protocol解析用
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

      const card = util.htmlTag('div', { class: 'hbc-card' }, info + contents, false);
      const link = util.htmlTag('a', { class: 'hbc-link', href: options.url, target: options.target, rel: options.rel }, card, false);
      const linkWrap = util.htmlTag('div', { class: 'hbc-link-wrap' }, link, false);
      const tag = util.htmlTag('div', { class: className }, linkWrap, false);
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

  // ogSiteNameがなかった場合にホスト名を表示
  if (ogp.hasOwnProperty('ogSiteName')) {
    name = ogp.ogSiteName;
  } else {
    name = urlParsed.hostname;
  }

  const siteName = util.htmlTag('div', { class: 'hbc-site-name' }, name);

  let api = faviconAPI.replace('$DOMAIN', encodeURIComponent(urlParsed.hostname));
  api = api.replace('$URL', encodeURIComponent(options.url));
  const favicon = util.htmlTag('img', { class: 'hbc-favicon', src: api } , '');
  return util.htmlTag('div', { class: 'hbc-info' }, favicon + siteName, false);
}

function getContents(options, ogp) {
  let contents = '';
  let text = '';

  if (ogp.hasOwnProperty('ogImage')) {
    const image = util.htmlTag('img', { src: ogp.ogImage.url } , '');
    contents = util.htmlTag('div', { class: 'hbc-thumbnail' }, image, false);
  }

  text += util.htmlTag('div', { class: 'hbc-title' }, escapeHTML(ogp.ogTitle), false);
  text += util.htmlTag('div', { class: 'hbc-url' }, options.url, false);

  if (ogp.hasOwnProperty('ogDescription')) {
    const description = adjustLength(ogp.ogDescription);
    text += util.htmlTag('div', { class: 'hbc-description' }, description);
  }
  contents += util.htmlTag('div', { class: 'hbc-text' }, text, false);

  return util.htmlTag('div', { class: 'hbc-contents' },  contents, false);
}

// 内容が長い場合に切り詰める
function adjustLength(description) {
  if (description && description.length > descriptionLength) {
    description = description.slice(0, descriptionLength) + '…';
  }
  return description;
}

// 実行したい場合は以下のようにする
// getTag({url: "https://hinastory.github.io/cats-cats-cats/2019/12/29/visualize_ruby_development_by_file/"}).then(e => console.log(e))

{% endcode %}


### 実行結果

上記のプログラムの実行にはnode.jsとnpmによるライブラリ（`hexo-util`と`open-graph-scraper`)のインストールが必要ですが、興味がある方は実行してみてください。実行結果(HTML)は以下のとおりです。適当にスタイルを当てています。

<p class="codepen" data-height="265" data-theme-id="default" data-default-tab="html,result" data-user="hinastory" data-slug-hash="ZEYwQmN" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="blog_card">
  <span>See the Pen <a href="https://codepen.io/hinastory/pen/ZEYwQmN">
  blog_card</a> by hinastory (<a href="https://codepen.io/hinastory">@hinastory</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

## まとめ

本記事ではブログカードで使われている技術として以下の３つの技術について解説を行い、JavaScriptによるブログカードの実装例を紹介しました。

- Open Graph Protocol
- favicon
- ソーシャルカウント

本記事がブログカードを支える技術の理解の一助となれば幸いです。

# おまけ（1/24追記）

記事本文では触れませんでしたが、ブログカードに使われる技術の一つとして{% elink oEmbed https://oembed.com/ %}というものもあります。これはWebサイトに動画や写真を埋め込むためのプロトコルで、YouTubeやInstagram等のリッチコンテンツを提供しているサイトが対応しています。一部のブログカードの実装ではWebサイトがoEmbedに対応していたらoEmbedを優先するという動作をします。

現在(2020年)時点では、oEmbedに対応しているサイトはOGPに対応しているサイトと比較するとごく一部であり、oEmbedに対応しているサイトも自分が調べた限りではOGPに対応していたので[^4]、本記事ではOGPメインの構成にしています。oEmbedも非常に興味深い技術なので興味がある方は調べてみてください。

[^4]: YouTube、Twitter、Instagram、Flickr、Gyazo、Vimeo、Speaker Deck、SlideShareはOGPに対応していることを確認しています。

## 参考文献

- {% elink The Open Graph protocol https://ogp.me/ %}
- {% elink Favicon - Wikipedia https://ja.wikipedia.org/wiki/Favicon %}
- {% elink ICO (ファイルフォーマット) - Wikipedia https://ja.wikipedia.org/wiki/ICO_(%E3%83%95%E3%82%A1%E3%82%A4%E3%83%AB%E3%83%95%E3%82%A9%E3%83%BC%E3%83%9E%E3%83%83%E3%83%88) %}
- {% elink ファビコン画像を取得する便利なWebサービス（API） | 俺の開発研究所 https://itlogs.net/get-favicon/ %}
- [はてなブックマーク件数取得API - Hatena Developer Center](http://developer.hatena.ne.jp/ja/documents/bookmark/apis/getcount)