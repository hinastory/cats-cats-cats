---
title: hexo-oembedを公開しました
thumbnail: /gallery/thumbnails/hexo-logo.png
categories:
  - [Tech, Web]
tags:
  - Hexo
  - Web
  - npm
  - oEmbed
date: 2019-02-07 08:36:19
---
HexoにYouTubeなどのサイトを記事に埋め込むためのプラグインを作成して、npmに公開しました。この記事はそのプラグインの紹介記事です。

{% linkPreview https://www.npmjs.com/package/hexo-oembed %}

プラグイン制作記事は以下に書きました。興味があればそちらも読んで頂けると嬉しいです。

- {% post_link hexo-oembed-1 %}
- {% post_link hexo-oembed-2 %}

<!-- more -->

## 目次
<!-- toc -->

## hexo-oembedについて

hexo-oembedはブログ構築ツールの{% elink https://hexo.io/ %}プラグインで、投稿にYouTubeやSlideShareやSpeaker Deckやインスタグラム等さまざまなメディアをパーマリンクを指定するだけで埋め込むためのタグを提供します。埋め込みのための業界標準として{% elink oEmbed https://oembed.com/ %}というものがありますが、この仕様を利用しているため`hexo-oembed`という名前になっています。特徴は以下です。

- oEmbed Discoveryのサポート
  - YouTube, Vimeo, Twitter, SlideShare, Speaker Deck, CodePen, TED, pixiv等、oEmbed Discoveryに対応している様々なメディアを埋め込むことができます
  - パーマリンクがoEmbed Discoveryに対応しているかどうかは、[oEmbed Tester](http://oembed.frdnspnzr.de/)でしらべることができます
- oEmbedのエンドポイントを設定ファイルで指定可能
  - oEmbed Discoveryに対応していないサイトでも、oEmbedに対応していればoEmbedのエンドポイントを個別に設定ファイル(_config.yml)に指定することで埋め込めます
  - Instagram, Gyazo, FlickrなどはoEmbedに対応しています
  - エンドポイントは{% elink oEmbedのサイト https://oembed.com/#section7  %}から入手可能です

## インストール

npmコマンドでインストールしてください。

{% code lang:bash %}
$ npm install hexo-oembed --save
{% endcode %}

## 使い方

埋め込みたいページのパーマリンクを指定するだけです。[maxwidth]と[maxheight]は埋め込みのオブジェクトに期待する最大幅と最大高を数値(ピクセル)で指定します。サイトが対応していればこの値を超えない埋め込みコンテンツを返してくれます。

{% code %}
{% raw %}{% oembed permlink [maxwidth] [maxheight] %}{% endraw %}
{% endcode %}

## デモ
貼ろうと思えば楽しくていくらでも貼れる感じですが重くなるので3つにしておきます。
もっと見たい方は {% link デモページ https://hinastory.github.io/cats-cats-cats/hexo-oembed-demo/ %}をご覧ください。

### YouTube
ちょうどこれを書いているときに3億再生いきました。マトリョシカの頃から応援してたけどまさかここまで人気になるとは・・・
{% code %}
{% raw %}{% oembed https://www.youtube.com/watch?v=SX_ViT4Ra7k %}{% endraw %}
{% endcode %}

{% oembed https://www.youtube.com/watch?v=SX_ViT4Ra7k %}

### Twitter
{% code %}
{% raw %}{% oembed https://twitter.com/hinastory999/status/1089514744174632960 %}{% endraw %}
{% endcode %}

{% oembed https://twitter.com/hinastory999/status/1089514744174632960 %}

### Speaker Deck

{% code %}
{% raw %}{% oembed https://speakerdeck.com/ladicle/recap-kubecon-plus-cloud-nativecon-north-america-2018-overview %}{% endraw %}
{% endcode %}

{% oembed https://speakerdeck.com/ladicle/recap-kubecon-plus-cloud-nativecon-north-america-2018-overview %}

## 設定

Hexoの設定ファイル(_config.yml)に以下の設定が可能です。

### className

埋め込まれたコンテンツに付与されるCSSクラスのベース名を指定できます。
(デフォルト: `oembed`)

### endpoints

oEmbedプロバイダのエンドポイントを指定できます。
(デフォルト: なし)

oEmbedプロバイダは以下から取得できます。

https://oembed.com/#section7

oEmbedプロバイダのエンドポイントとして`match`と`url`が定義できます。パーマリンクのホスト名が`match`を含んでいた場合、そのエンドポイントが選択され,`url`のアドレスでプロバイダに問い合わせます。

もしエンドポイントの定義にマッチしなかった場合は {% elink oEmbed Discovery https://oembed.com/#section4 %}を利用してエンドポイントを探します。

例えばYouTubeはoEmbed Discoveryに対応しているので`endpoints`にYouTubeの定義は必要ありません。

### embedlyKey

もし、`embedlyKey`を指定すればEmbed.lyにフォールバックします。

Embed.lyはoEmbedに対応していないサイトのoEmbed情報の提供も行っています。利用したい場合は{% elink サインアップ https://app.embed.ly/pricing/free  %}して、APIキーの設定してください。

### 設定サンプル

{% code lang:yaml _config.yml: %}
oembed:
  className: oembed
  embedlyKey:
  endpoints:
    instagram:
      match: instagram
      url: http://api.instagram.com/oembed/
    gyazo:
      match: gyazo
      url: https://api.gyazo.com/api/oembed/
    flickr:
      match: flickr
      url: http://www.flickr.com/services/oembed/
{% endcode %}

## リポジトリ

以下のリポジトリで開発しています。バグ報告、ご要望はIssuesへどうぞ。プルリクエストも歓迎です。

{% linkPreview https://github.com/hinastory/hexo-oembed %}
