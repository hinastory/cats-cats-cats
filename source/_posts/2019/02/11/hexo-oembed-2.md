---
title: HexoのoEmbedプラグインをnpmに公開した話(後編)
thumbnail: /gallery/thumbnails/npm-logo.png
categories:
  - [Tech, Web]
tags:
  - Hexo
  - Web
  - npm
  - Git
  - oEmbed
date: 2019-02-11 08:36:19
---
HexoにYouTubeなどのサイトを記事に埋め込むためのプラグインを作成して、npmに公開しました。この記事はその後編にあたります。前編は以下になります。

{% post_link hexo-oembed-1 %}

<!-- more -->

## 目次
<!-- toc -->

## Hexoタグの制作

前回はコンテンツ埋め込みのための業界標準である{% elink oEmbed https://oembed.com/ %}の説明まで行いました。今回はいよいよoEmbedを利用したHexoタグの制作と公開を行います。ここからはこれから実際にHexoタグを作ってみたい方や、OSS貢献に興味がある方向けに丁寧に書いてみたいと思います。

### 完成形をイメージする

制作を始める前に完成形をイメージします。今回Hexoのタグ名は`oembed`にして、後ろにパーマリンクを渡せるものとします。
パーマリンクがスライドの場合、oEmbedのレスポンスとしてはtypeがrichのものが帰ってくるので、パラメータのhtmlの値をそのまま表示すればよいだけです。大抵の場合htmlの中身はiframeタグになっています。あとは外側をdivタグで囲ってクラスを指定しておきます。こうすることで後で簡単にスタイルを適用できるようになります。outerとinnerで二重に囲っているのは要素をセンタリングしたい場合にinnerクラスが指定してあったほうが便利だからです。最初はouterだけだったのですが、htmlパラメータで返ってくるのがiframeかどうか保証はできないので念の為囲うことにしました。

{% code Hexo タグ%}
{% raw %}{% oembed http://slide.com/slides/123456 %}{% endraw %}
{% endcode %}

{% code lang:html  実際に展開されるHTML %}
<div class="oembed-outer">
  <div class="oembed-inner">
    <iframe width="560" height="315" src="http://slide.com/slides/xxxxx/yyyyy" ></iframe>
  </div>
</div>
{% endcode %}

もう一つ例を見てみましょう。今度は写真の場合です。写真の場合はoEmbedのtypeがphotoになるので自分でタグを生成します。といっても、aタグとimgタグを入れ子にするだけの単純なものです。aタグで囲うのは写真をクリックした際にもとのパーマリンク先に飛べるようにするためです。あとはoEmbedにtitleパラメータがあればimgのalt属性に指定するようにしておきます。あと、oEmbedの仕様ではオプションで`maxwidth`と`maxheight`を渡せるので、これもHexoタグにオプションとして渡せるようにします。以下の例ではmaxwidthに300、maxheightに400を指定しています。

{% code Hexoタグ %}
{% raw %}{ oembed http://phote.com/photos/456789 300 400 %}{% endraw %}
{% endcode %}

{% code lang:html 実際に展開されるHTML %}
<div class="oembed-outer">
  <a class="oembed-inner" href="http://phote.com/photos/456789">
    <img src="http://photo.com/abcde.png" alt="きれいな写真">
  </a>
</div>
{% endcode%}

### モデルを探す

ある程度仕様がイメージできたら、次は~~パクリ元~~リスペクト元を探してきます。ライセンスには十分注意しましょう。公式のサンプルを参考にしたり一般的な構成を真似るくらいであれば特に言及はいらないと思いますが、ソースコードを流用する場合はライセンスに則って処理してください。ソースの流用がなくても独創的な機能を真似る場合は、READMEに謝辞を述べるのが礼儀だと思います。今回は以下を参考にさせて頂きました。

- {% elink Hexo公式のタグプラグイン https://hexo.io/docs/tag-plugins.html %}
  - 公式のタグプラグインです。本体に取り込まれているためプラグインとしての参考にはなりませんでしたが、タグの作り方の参考にしました
- {% elink linkPreviewプラグイン https://github.com/minamo173/hexo-tag-link-preview %}
  - 本ブログでもお世話になっているタグです。構成の参考にしました
- {% elink hexo-tag-oembed https://github.com/monsier-oui/hexo-tag-oembed %}
  - 前編で紹介したoEmbed対応タグです。 今回作ろうとしているタグはこれのパワーアップ版みたいなものです
  - ソースコードの流用はしていませんが、構成の参考にしました
- {% elink node-oembed https://www.npmjs.com/package/oembed %}
  - ライブラリとして利用させて頂きました
  - Discoveryに対応しています

### 一番簡単なタグを作ってみる

{% elink 公式のドキュメント https://hexo.io/api/tag  %}を参考に一番簡単なタグを作ってみます。以下は単なる`hoge`と表示するだけのタグです。`hoge.js`というファイルに保存して`[hexo dir]/themes/scripts`配下に配置します。

{% code lang:js hoge.js %}
hexo.extend.tag.register('hoge', function(){
  return '<span>hoge</span>';
});
{% endcode %}

配置ができたらHexoサーバを再起動して、ブログの記事で`hoge`タグを使ってみましょう。
レンダリングした投稿に「hoge」と表示されていて、HTMLが以下のようになっていれば、成功です。HTMLはChromeのデベロッパーツール等で確認してください。

{% code Hexo タグ%}
{% raw %}{% oembed hoge %}{% endraw %}
{% endcode %}

{% code lang:html 実際に展開されるHTML %}
<span>hoge</span>
{% endcode %}

### プラグイン化してみる

Hexoはプラグイン機能を持っています。プラグイン化するとソースコードを外出しできて、npmでインストールすることができるようになります。npmで公開するための必須の手順ですが、単に外出しできるだけでもGitによるソース管理が行いやすくなるので、早めにやったほうがいいと思われます。プラグイン化の方法は {% elink 公式 https://hexo.io/docs/plugins  %}に描いてあるとおり、驚くほど簡単です。適当なディレクトリ(hexo-tag-hoge)を作って、メインのソースファイルである`index.js`とnpmのメタファイルである`package.json`を配置するだけです。

{% code lang:js index.js %}
hexo.extend.tag.register('hoge', function(){
  return '<span>hoge</span>';
});
{% endcode %}

{% code lang:json package.json %}
{
  "name": "hexo-hoge-plugin",
  "version": "0.0.1",
  "main": "index"
}
{% endcode %}

さっそく作成したパッケージをnpmでインストールしてみましょう。

{% code lang:bash %}
$ npm install --save <パッケージのディレクトリのパス>
{% endcode %}

Hexoサーバを再起動してhogeタグが利用できれば成功です。このとき前節で作成したhoge.jsファイルをscriptsディレクトリから削除しておくことを忘れないでください(笑)。npmは一般的にはネット上のnpmリポジトリからダウンロードしてインストールしますが、このようにローカルのパスを指定してインストールすることも可能です。このときインストール先のnode_modules配下にはパッケージディレクトリへのシンボリックリンクが張られるだけなので、一度インストールをすればパッケージディレクトリのファイルを修正が同期します。したがって更新のたびにインストールするとかは必要ないです[^1]。

[^1]:  ちなみに`npm link`というコマンドもあってこちらはさらに便利で、複数の非公開パッケージを開発するときに真価を発揮します。興味がある方はぜひ調べてみることをオススメします。

### ソースコードをGit管理してみる

Gitにおけるファイル管理は非常に心強いです。こまめにコミットしておくことで至福の安心感が得られます。特に新しいモノを作ろうとしているときは試行錯誤の連続なのでバージョン管理があるとないとでは効率で大きな差がつくのでなるべく早い段階でGit管理に以降するようにしましょう。以下はおまじないのようなものです。反射的に打てるようになるまで写経しましょう(笑)。ちなみに公開予定のリポジトリのコミットログは英語だけで書くことをオススメします。拙くても日本語で書かれるよりはより多くの人に理解してもらえます[^2]。


{% code lang:bash %}
$ cd <hexo_hote_pluginディレクトリ> # 管理対象のソースコードの一番上のディレクトリに移動
$ git init                        # Gitのレポジトリとして初期化
$ echo node_modules > .gitignore  # .gitignoreにnode_modules配下を無視するように記述
$ git add .                       # カレントディレクトリ配下のファイルをステージング
$ git status                      # 余計なファイルが入っていないか確認
$ git commit -m "initial commit"    # メッセージ付きでコミット
{% endcode %}

[^2]: 自分も頑張れば読めはしますが、書くのは苦手です・・・　話すのはもっと無理です・・・

### oEmbedを利用したタグを作ってみる

さて、いよいよoEmbedを利用したタグ作りに取り掛かります。まず、oEmbedのプロトコルをどのように実装するかです。HTTPクライアントを使って素直に実装する手もありますが、Discoveryも含めるとちょっと面倒なので公開されているパッケージの中に良いものがないか探してみたところ、`node-oembed`パッケージがありました。これを使えば比較的ラクにoEmbedを実装できそうです。

{% linkPreview https://www.npmjs.com/package/oembed %}

あともう一つ決めなければいけないことは、エンドポイントの設定方法です。幸いにもHexoにはディレクトリのトップに_config.ymlという設定ファイルがあり、これに自由に設定を加えていけます。具体的には以下のような設定があったとします。`className`は冒頭で述べたCSSのクラス名の設定です。`endpoints`が具体的のoEmbedプロバイダを設定する箇所で、`match`パラメータがパーマリンクのURLのホスト名に部分一致していたらそのエンドポイントの`url`を利用するという仕様にします。正確なスキーマの検査をしなくても多分このレベルで実用になるだろうと判断しました。手を抜いたわけじゃないよ！

{% code lang:yaml _config.yml %}
oembed:
  className: oembed
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

上記の設定ファイルには`hexo.config`でアクセスできます。例えばインスタグラムのエンドポイントのURLが欲しい場合は`hexo.config.oembed.endpoints.instagram.url`です。これで、oEmbedのタグを実装する上での主要な情報と仕様が出揃いました。あとは基本的はWebプログラミングの知識があれば解ける問題です。Let's Try!

### 答え合わせ

さて、皆様の出来栄えはいかがしょうか？以下のCodePenに自分のソースコードを日本語のコメント付きで載せたので参考にしてみてください。`RunPen`をクリックしてJSタブを開けばソースコードが見れます。また当然ですがこの埋込には今回作成してタグを用いています。

{% oembed https://codepen.io/hinastory/pen/ZwxjvK %}

{% code 上記の埋め込みに利用したタグ %}
{% raw %}{ oembed https://codepen.io/hinastory/pen/ZwxjvK %}{% endraw %}
{% endcode %}

## Hexoタグの公開

せっかく作ったの公開して多くの人に使ってもらいたいと思います。そのための手順を簡単に説明したいと思います。

### GitHubでリポジトリを作成する

まずは、 {% elink GitHub https://github.com/ %}にリポジトリを作成します。もしまだアカウントを作成していない方はSignUpから始めてください[^3]。以前に以下の記事でプライベートリポジトリの作り方を説明しましたが、今回は公開用のパブリックリポジトリです。

{% linkPreview https://hinastory.github.io/cats-cats-cats/2019/01/13/github/ %}

リポジトリ名はダイレクトに`hexo-oembed`にしました。ライセンスは特にこだわりがなければHexoと同じMITライセンスにしておけばいいと思います。.gitignoreファイルはもうすでに作成済みなのでここであえて作成する必要はないです。リポジトリの作成自体は十秒もかからず終わります。以下が今回作成したGitHubのリポジトリです。

{% linkPreview https://github.com/hinastory/hexo-oembed %}

リポジトリの作成が終わったらローカルのリポジトリとGitHubのリポジトリをリンクさせます。

{% code lang:bash %}
$ git remote set-url origin {new url}
{% endcode %}

[^3]: 認証周りの設定とかいろいろ面倒くさいのでそこそこ時間ががかかると思います・・・この記事の余白に書くのは狭すぎるのでGoogle先生のお力をお借りください・・・・

### README.mdを書く

`README.md`は公開したパッケージの説明や利用法をMarkdownで書くファイルです。リポジトリのトップにこのファイルを置いておけばGitHubのリポジトリのトップページに表示してくれるので、公開時にはほぼ必須のファイルです。書き方も大体以下のように`リポジトリ名`->`リポジトリの簡単な説明` -> `特徴` -> `インストール方法` -> `利用方法` -> `設定`(あれば)　-> `謝辞`(利用or参考にしたものがあれば) -> `ライセンス`の順に書いていけばOKです。

{% code lang:md %}
# hexo-oembed

Embed [oEmbed](https://oembed.com/) item on your [Hexo](https://hexo.io/) article.

Features
--------

- Supports A
- Supports B

## Installation

`npm install hexo-oembed --save`

## Usage

・・・

## Configuration

...

## Thanks

## License

MIT

{% endcode %}

実はここが今回一番苦労したところです。oEmbedはともかくoEmbed Discoveryとかエンドポイントの設定方法とか説明しなければいけない部分がそこそこあるので、どうしたものかと悩みました。特に英語が苦手なのでGoogle先生のお力も拝借したのですがイマイチ自信がありません・・・

### package.jsonを書く

すでにnpmでインストールするために最低限のpackage.jsonは記述していると思いますが、npmに公開するためにはさらに追加の記述が必要です。以下がほぼ最低限の公開用package.jsonです。特に気をつけなければ行けないのはバージョン番号です。{% elink セマンティック バージョニング https://semver.org/lang/ja/  %}になるべく厳密に従うようにしてください。あと、ファーストバージョンは1未満のバージョンから初めるのが慣例です。ある程度成熟したと感じたときにバージョン1をリリースしてください。

{% code lang:json %}
{
  "name": "hexo-oembed",
  "version": "0.1.5",
  "description": "embed oEmbed item on your Hexo article.",
  "main": "index.js",
  "repository": {
    "type": "git",
    "url": "git@github.com:hinastory/hexo-oembed.git"
  },
  "bugs": {
    "url": "https://github.com/hinastory/hexo-oembed/issues"
  },
  "keywords": [
    "hexo", "blog","plugin","helper","tag","oembed","youtube","slideshare","speakerdeck","twitter","vimeo","codepen","pixiv","instagram","flickr","gyazo"
  ],
  "author": "hinastory",
  "license": "MIT",
  "dependencies": {
    "hexo-util": "^0.6.3",
    "oembed": "^0.1.2"
  }
}
{% endcode %}

あと、お気づきだと思いますがキーワード盛り盛りですね(笑)。ここのキーワードはnpmの検索時に参照されるので、嘘偽りがなければできるだけ多く記載したほうが良いです。特に今回の`hexo-oembed`みたいにパッケージ名だけだと具体的に何をするものか分からない場合はkeywordに力を入れましょう。

### GitHubに公開する

GitHubに公開するのは簡単です。`git push`するだけです。簡単なんですが、以下のコマンドを打った瞬間に全世界に公開されしまうので`git diff`や`git show`で余計なファイルやコミットがないか再確認してからpushしましょう。一番ありがちなのは必要なファイルを`git add`し忘れてpushすることです。他にもプライベートアクセスキーとか重要な情報も一緒にコミットしてしまったりとかあります。もし間違ったコミットをしてしまった場合は、早い段階であればforce pushでもみ消せますがマナーとしては最低ですので最後の手段としましょう。

{% code lang:bash %}
$ git push origin master
{% endcode %}

ブランチをプッシュしたら忘れずにタグもプッシュしておきましょう。GitHubの場合タグのプッシュが新バージョンのリリースとみなされるので、リリース直前には必ずタグを打つようにします。

{% code lang:bash %}
$ git tag v0.1.5
$ git push origin v0.1.5
{% endcode %}

### npmに公開する

npmに公開するのはもっと簡単です。公開するパッケージ直下で`npm publish`を打つだけです。npmのアカウントを持っていなければ作成する必要がありますが、GitHubのアカウントでログインできるので手間はそれほどかかりません。アバターの設定には{% elink Gravatar https://ja.gravatar.com/  %}が利用できます。これも持っていなければWordPress.comにログインしてすぐに作ることができます。

`npm publish`に成功したらnpmからページを確認してみます。自分のアバターのメニューの`Packages`からも確認できますし、パッケージ名やキーワードで検索をかければ出てきます。

{% linkPreview https://www.npmjs.com/package/hexo-oembed %}

ページの確認ができたら`npm install`してパッケージがネットからインストールできるか試してみましょう。このときローカルバージョンをインストールしている場合は一旦`npm uninstall`してから実行してください。

### READMEにバッジをつける

GitHubのリポジトリを眺めているとREADME.mdにイカすバッジが着いているのを見かけることがあります。{% img https://img.shields.io/npm/l/hexo-oembed.svg?style=flat %}や {% img https://api.codeclimate.com/v1/badges/ddfce94fa04983a9c7c7/maintainability %}みたいな奴です。

これらのバッジはカッコいいだけでなく、必要な情報が視覚的にわかりやすいという実用面も大きいのでぜひ貼りましょう。まず一番目に紹介するのはnpmパッケージをかっこよく表示してくれる {% elink NodeICO https://nodei.co/ %}です。ドメイン名にこだわりが感じられます(笑)。npmのパッケージ名を指定するだけですぐに作ってくれるので張らない手はないです。

{% img https://nodei.co/npm/hexo-oembed.png %}

次に紹介したいのは {% elink Shields.io https://shields.io/ %}です。Shields.ioではOSS向けに高いクオリティのバッジを提供しています。種類も豊富でカスタマイズも可能なので、大抵の用途のバッジはここで作成することができます。上記のlicenseのバッジはここで作成しました。

最後に紹介したいのは{% elink Code Climite https://codeclimate.com/ %}です。ここはGitHubのリポジトリからOSSの品質を測定するサービスを提供しています。そしてその結果はバッジとして表示可能になっています。上記のこのバッジ{% img https://api.codeclimate.com/v1/badges/ddfce94fa04983a9c7c7/maintainability %}はCode Climiteを利用しています。{% elink hexo-oembedのページ  https://codeclimate.com/github/hinastory/hexo-oembed %}には、測定結果の詳細が載っているのでパッケージの改善に役立てる事ができます。

### Hexo本家のプラグイン一覧に載せてもらう

ようやく公開の最終工程の一歩手前です。実は拡張の公開は以下のとおり大きく分けて4段階あって、今までおこなったのは2段階目までです。3番目は見逃されがちですが利用者の観点からすれば非常に重要です。ここに載せてもらえるか否かでリーチできるターゲット規模が大きく変わるので手を抜かずにやり遂げましょう。

1. パブリックソースリポジトリに公開する
  - {% elink GitHub https://github.com/ %}, {% elink GitLab https://about.gitlab.com/ %}, {% elink Bitbucket https://bitbucket.org/ %}, {% elink Mercurial https://www.mercurial-scm.org/ %}・・・
2. パブリックパッケージリポジトリに公開する
  - {% elink npm https://www.npmjs.com/ %}, {% elink RubyGems https://rubygems.org/ %}, {% elink PyPI https://pypi.org/ %} {% elink CPAN https://www.cpan.org/ %}, {% elink MvnRepository https://mvnrepository.com/ %}, {% elink NuGet https://www.nuget.org/ %}, {% elink OS系パッケージ管理システム https://ja.wikipedia.org/wiki/%E3%83%91%E3%83%83%E3%82%B1%E3%83%BC%E3%82%B8%E7%AE%A1%E7%90%86%E3%82%B7%E3%82%B9%E3%83%86%E3%83%A0  %}・・・
3. 公式の拡張リストに記載してもらう
4. ブログやツイッター等で告知する

とはいっても、気負う必要はまったくありません。最近は公式のサイト自体GitHubで管理でしているところが増えてきているので、ドキュメントを修正してプルリクエストを投げるだけです。バグ修正のプルリクエストと変わらないというかむしろそれより敷居は低いといっても過言ではありません。
さらにHexoの場合には公式サイト自体がHexoで構築されているため、ドキュメントの修正確認に新しい知識は不要です。具体的には{% elink 公式の手順 https://hexo.io/docs/plugins#Publishing %}を確認してもらう必要がありますが、たった5ステップで通常のバグ修正とほぼ変わりないことがわかると思います。

注意点としては、プルリクエストには各リポジトリにマナーがあるのでコントリビューションガイドにはよく目をとおすことと、過去のクローズ済みのプルリクエストを確認して自分のプルリクエストに問題ないか確認することを忘れないようにしましょう。マナー違反のプルリクは優しく注意してくれる場合もありますが、問題が多ければ放置や強制クローズもありえます。ちなみに今回のプルリクは半日程度でマージしてもらえました[^4]。

マージしてもらったら{% elink 公式のプラグイン一覧 https://hexo.io/plugins/index.html%}で`oembed`で検索して、問題なく掲載されているか確認します。自分の1件しか引っかからなかったので、どうやら`hexo-tag-oembed`の方は公式への登録を行っていなかったみたいです。もったいない・・・

[^4]: {% elink このプルリク https://github.com/hexojs/site/pull/884 %}です。

### ブログやツイッター等で告知する

まさしくこの記事です・・・

### hexo-oembedの今後

結構ニッチなプラグインかなと思っていますが、公開から一週間も立たないうちにダウンロード数が150を超えたので意外とニーズはあったみたいです。ということでしっかり開発およびメンテナンスはしていきたいと思います。

まず開発の基本方針として、サイト固有の対応を入れるつもりはないです。それやりだすとキリがないので・・・実は{% elink jquery-oembed-all https://github.com/support-project/jquery-oembed-all %}というライブラリも見つけていたのですが、更新が止まっていたし自分がこのようなものを作ろうと思ってもメンテナンスが辛そうなので正直やりたくありません。しかもこのライブラリのフォールバック先のYQL (Yahoo! Query Language)は2019/1/3で終了したみたいです。

ただちょっと面白いなと思ったのはフォールバック先に{% elink Open Graph protocol http://ogp.me/ %}があることです。OGP対応は割とメジャーなSEO対策でリンク先のサムネイルや説明の表示でお馴染みだとおもいます。もちろんこのページもOGPには対応しています。hexo-oembedのフォールバック先として一応Embed.lyには対応していますが[^5]、OGPへのフォールバックは今後検討しようかと思います。

[^5]: 一応利用しているライブラリ(node-oembed)が対応していたので、対応コードは入れてみたけど実際に動かしてはいないです・・・

## まとめ

既存のOSSへの貢献としてメジャーなのはバグ報告したりプルリクを出したりすることだと思いますが、プラグインを作って公開して公式の載せてもらうまでを丁寧に解説した入門記事は意外と少ないと感じました。断片的な記事は多いのですが、それだとどういう流れなのか入門者にわかりづらいかなと思い、本記事ではhexo-oembedをテーマにOSSへの貢献への流れを要点を絞って解説するようにしました。

実際に既存のOSSへの貢献を始めるには、いきなり本体に手をだすよりもプラグインから手をだした方がうまくいく場合が多いです。プラグインを通して本体を見たほうが理解しやすいですし、プラグインを作ってる最中に本体のバグを見つけることも多いので本体へのプルリクを書く動機にもなります(笑)。そのうちプルリクを送り続けていれば本体側にも十分詳しくなってコラボレーターとして招待されるかもしれません。実際にプラグインから始めてそのOSSへのメンテナーになった人は数多くいるので、まずOSSに貢献してみたいと思ったら気に入ったOSSを見つけてプラグイン機能を探して、実際に作ってみることをオススメします。

最初はHexoタグの作り方を簡単に紹介する記事にする予定でしたが、もしかしたら既存のOSSへの貢献の入門記事としてもニーズがあるのではないかと思ったのが今回の記事を書こうと思った動機です。長くなってしまいましたが本当にここまで読んで頂いてありがとうございました。この記事が読んでくれた方のOSS貢献の一助となれば幸いです。