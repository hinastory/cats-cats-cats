---
title: hexo-tag-detailsを公開しました。
thumbnail: /gallery/thumbnails/hexo-logo.png
categories:
  - [Tech, Web]
tags:
  - Hexo
  - Web
  - npm
  - html5
date: 2019-03-09 08:12:19
---
HexoにHTML5の {% elink detailsタグ https://developer.mozilla.org/ja/docs/Web/HTML/Element/details %}[^1]を記事に埋め込むためのプラグインを作成して、npmに公開しました。この記事はそのプラグインの紹介記事です。

{% linkPreview https://www.npmjs.com/package/hexo-tag-details %}

[^1]: 流石に今どきHTML5のタグをサポートしていないブラウザなんてないと思っていましたが、IEとEdgeはだめなようです・・・もちろん表示されないわけではなく、タグが無視されて表示されるので見れないわけではないです。誰もIEやEdgeなんて使っていないですよね？少なくともこのブログのアクセス解析の結果、賢明な読者様の中にはそういう方はいらっしゃらなかったようなので遠慮なく`details`タグを使えました。まぁ、IEはすでに非推奨ですしEdgeもChromeベースになるらしいので将来的には`details`タグの互換性を気にする必要はなくなるはずです。

<!-- more -->

## 目次
<!-- toc -->

## hexo-tag-detailsについて

hexo-tag-detailsはブログ構築ツール{% elink Hexo https://hexo.io/ %}のプラグインで、投稿にHTML5のdetailsタグを埋め込むためのタグを提供します。detailsタグを使うと以下のようなUIを追加できます。

{% details 猫は好きです？ %}
1. 好き
2. 大好き
3. 愛している
{% enddetails %}

## インストール

npmコマンドでインストールしてください。

{% code lang:bash %}
$ npm install hexo-tag-details --save
{% endcode %}

## 使い方

要約文と詳細文を書くだけです。ページを表示したしたときに詳細文を開いておく場合には、`mode:open`を指定します。指定しない場合は詳細文は閉じて表示されます。`mode:close`は後で説明する設定でデフォルトを詳細文を開くにした場合に利用します。


```
{% details [mode:open/close] summary text %}
detail text
{% enddetails %}
```

例1:

{% code %}
{% raw %}{% details あなたの出身はどこですか? %}
私は地球出身です。 水の惑星です!
{% enddetails %}{% endraw %}
{% endcode %}

上の例は以下のようなHTMLを生成します。
{% code lang:html %}
<details>
  <summary>あなたの出身はどこですか?</summary>
  私は地球出身です。 水の惑星です!
</details>
{% endcode %}


表示は以下のようになります。
{% details あなたの出身はどこですか? %}
私は地球出身です。 水の惑星です!
{% enddetails %}

----
例2(`mode:open`を指定した場合):

{% code %}
{% raw %}{% details mode:open あなたの好きな食べ物は何ですか? %}
1. お寿司
2. 天ぷら
3. すき焼き
{% enddetails %}{% endraw %}
{% endcode %}

上の例は以下のようなHTMLを生成します。
{% code lang:html %}
<details open="open">
  <summary>あなたの好きな食べ物は何ですか?</summary>
  <ol>
    <li>お寿司</li>
    <li>天ぷら</li>
    <li>すき焼き</li>
  </ol>
</details>
{% endcode %}

表示は以下のようになります。
{% details mode:open あなたの好きな食べ物は何ですか? %}
1. お寿司
2. 天ぷら
3. すき焼き
{% enddetails %}

## 設定

### className
`className` はCSSクラス名を指定します。 (デフォルト: なし)

### open

`open`最初から詳細文を開いておくかどうかを指定します(デフォルト: false)

{% code lang:yaml _config.yml %}
tag_details:
  className:
  open: false
{% endcode %}

## リポジトリ

以下のリポジトリで開発しています。バグ報告、ご要望はIssuesへどうぞ。プルリクエストも歓迎です。

{% linkPreview https://github.com/hinastory/hexo-tag-details %}

## 最後に

このタグを作ったきっかけは「10の質問」をこのサイトでやってみようと思ったことです。

{% link 10の質問 https://hinastory.github.io/cats-cats-cats/about/#hinastory%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6 %}をやろうと思うと質問の解答が質問よりボリュームが多くて全体的に見づらくなることが分かりました。そこで質問の解答部分を折り畳めるようにしようとおもったのですが、HTML5の`details`タグを直接HexoのMarkdownに埋め込むとうまく動作しないことが分かりました。改行を有効にしていたので途中で`<br>`が入ってしまったのです。

もしかしたら、すでに`details`のタグプラグインを作っている人がいるかも知れないと思って探して見ましたが、なかったので自分で作ってしまいました。大したことないタグですが、使って頂ければ幸いです。
