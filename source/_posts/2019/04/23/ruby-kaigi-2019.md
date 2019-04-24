---
title: RubyKaigi 2019 in 福岡に参加してきた話
thumbnail: /gallery/thumbnails/ruby-kaigi-2019-logo.png
categories:
  - [Tech, Language]
tags:
  - Ruby
  - Event
date: 2019-04-23 08:17:46
---
前代未聞の公式パーティーが開催されたRubyKaigi 2019に参加してきました。去年は仙台、一昨年は広島でしたが今年は福岡での開催でした。自分は広島から連続で参加していますが、このイベントはホスピタリティが高く今年も楽しみにしていました。ただし今年は参加者の`度肝を抜くネタが２つも仕込まれていた`ことから特筆すべき「RubyKaigi」になったといっても過言ではないでしょう。

<!-- more -->

## 目次
<!-- toc -->

{% linkPreview https://rubykaigi.org/2019 %}

## 会場について

日時と場所は以下のとおりです。初日は羽田から飛行機で飛んで、8時半頃に福岡空港に着きました。時間があり天気も良かったので、地下鉄で中洲川端まで出てそこからは徒歩で会場に向かいました。

- 日時
  - 4/18th(木) - 4/20(日) 10:00〜
- 場所
  - 福岡国際会議場

<iframe src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d17000.482536639203!2d130.40277790136145!3d33.60425808551714!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x68f0d80606e3c997!2z56aP5bKh5Zu96Zqb5Lya6K2w5aC0!5e0!3m2!1sja!2sjp!4v1555809476826!5m2!1sja!2sjp" width="600" height="450" frameborder="0" style="border:0" allowfullscreen></iframe>

{% img /gallery/events/ruby-kaigi-2019/ruby-kaigi-1.jpg 250  %}{% img /gallery/events/ruby-kaigi-2019/ruby-kaigi-2.jpg 250  %}

### 会場内の様子

到着は9時半ごろです。すでに受付には行列ができていました。参加証の後ろの紙はCookpadさんで配っていたRubyパズルです。一日一枚配っていて一枚あたり3問出題されていました。写真に写っているProblemsの3-1は何とか解けましたが、その他はあまり解けませんでした。コメントや改行を用いたトリッキーなものが多かった印象です[^1]。

{% img /gallery/events/ruby-kaigi-2019/ruby-kaigi-3.jpg 300  %}{% img /gallery/events/ruby-kaigi-2019/ruby-kaigi-4.jpg 200 %}

[^1]: 問題はExtraステージも含めて{% elink 公開されている https://gist.github.com/mame/76a1dd346b3a2b468a3b9d3d5e9f1a11 %}ので興味がある方はチャレンジしてみてはいかがでしょうか？

## セッション内容

### The Year of Concurrency (Keynote) @yukihiro_matz

初日のキーノートのもちろんRubyの父であるMatzこと「まつもとゆきひろ」さんのキーノートです。

{% img /gallery/events/ruby-kaigi-2019/ruby-kaigi-5.jpg 600 %}

タイトルからして並列性の話かと思いましたが、Ruby3全般の展望のお話が聞けました。個人的に安心したのは静的型付けへの道筋が立ったようだという点です。去年の段階だとかなりもやっとしていた印象ですが、今年は基礎技術が出揃ってアーキテクチャが固まってきたという印象を持ちました[^2]。そしていつもの「型は書きたくない」発言が聞けて大満足です(笑)。

{% details 個人的なメモです。詳細を見たい場合はクリックして開いてください。 %}
- Rubyは良いと言われている
  - 生産性
  - 柔軟性
  - 楽しい！
- Rubyは悪いと言われている
  - 性能
    - 伝統的に遅いと評判だが、年々速度向上している
  - マルチコアを活かしきれない
    - GIL(Giant Interpreter Lock)があるから
  - 大きなチームや大規模プロジェクト向きではない
- Rubyは大抵の用途には十分良い
  - GitHub、Airbnb、Instacart、Cookpadという実例がある
  - Twitterのようなサービスには向いていない。(リアルタイム性や性能要求が高いから？)
    - そもそもTwitterは遅い1.8を続けたから自滅したんじゃない？ 1.9以降を使っていたら未来は変わったかも
- Ruby3の改善点
  - 性能
    - MJITの導入(2.6)
    - ファミコンエミュレータでは速くなるけどRailsでは遅くなる
      - 改善予定
  - 並行性
    - Guild
      - アクターモデル
    - AutoFiber
      - I/O待ちの改善
  - 静的解析
    - 型は書きたくないでござる
      - Rubyソースには型アノテーションは入れずに、別ファイル(.rbi)に型定義を書く
    - 以下の４つをRuby 3で行う予定
      - 型定義文法
      - 標準ライブラリの型定義
      - Type Profiler
      - 静的型チェック
        - Sorbet
        - Steep
- 我々は生き残らなければならない
  - ご飯を食べなければいけない
  - 前進し続けるしかない
  - 賢く進むしかない
    - 自分は天才じゃない。後悔もする(スレッドをいれたこととか)
    - みんなで進むしかない
- Rubyで世界を良くしたい
{% enddetails %}

### 福岡県知事

小川福岡県知事がRubyKaigiに来られて挨拶されました。内容は観光案内とRubyの力に期待を込めた内容でしたが、国際会議の流儀どおりに英語でスピーチしたのはポイントが高いと思います。ただ福岡県がRubyに力を入れていること知っていたので、予想はできたというかこれで度肝を抜かれたというわけではないです[^2]。

{% img /gallery/events/ruby-kaigi-2019/ruby-kaigi-6.jpg 400 %}

[^2]: とは言っても一介の技術イベントで県知事が挨拶するのは異例のことだとは思いますが・・・

### A Type-level Ruby Interpreter for Testing and Understanding @mametter
15:40 - 16:20 / Main Hall (3F) @ rubykaigiA

前述したRuby 3で入る予定Type Profilerの発表です。Type Profilerはタイトルの「型レベルインタプリタ」のとおり、型に関する部分を「実行」して、プロファイリングするもののようです。

{% oembed https://www.slideshare.net/mametter/a-typelevel-ruby-interpreter-for-testing-and-understanding %}

Type ProfilerはRuby 3で提供予定の静的解析のためのコンポーネントの一つです。静的解析の全体像としては以下の図が分かりやすかったです。Type Profilerの主目的は通常のRubyアプリケーションコードからクラスやメソッドの型を推定して型定義ファイルのプロトタイプを生成することです。この型定義は健全ではないので間違うこともあり、手動で修正が必要な場合があります。

{% blockquote Ruby 3の静的解析 https://docs.google.com/presentation/d/1z_5JT0-MJySGn6UGrtdafK1oj9kGSO5sGlTtEQJz0JU/edit#slide=id.g57cf166414_14_5 Ruby 3 Progress Reportより %}
{% img /gallery/events/ruby-kaigi-2019/ruby-kaigi-7.png 600 %}
{% endblockquote %}

Type Profilerの動作については以下の図が分かりやすかったです。従来のインタプリタが「値」に注目して実行しているのとは対照的に、Type Profilerでは呼び出し時の引数の型と戻り値の型に注目して評価し、その結果を型シグネチャとして抽出します。

{% blockquote "Type Profilerの動作" https://www.slideshare.net/mametter/a-typelevel-ruby-interpreter-for-testing-and-understanding セッションスライドより %}
{% img /gallery/events/ruby-kaigi-2019/ruby-kaigi-8.png 500 %}
{% endblockquote %}

このような動作のため実際にテストコードを通さないと型シグネチャは得られないみたいです。またその他にもメタプログラミングに弱かったり、状態爆発して遅かったりまだまだ問題はあるそうですが、とりあえず[動作するもの](https://github.com/mame/ruby-type-profiler)が公開されたので、今後の進捗に期待しつつ自分も少し触ってみたいと思います[^3]。

[^3]: Gitリポジトリの中にpdfのペーパーも入っていたので合わせて読もうと思います。

### Pattern matching - New feature in Ruby 2.7 @k_tsj

これですよ、これ。最近のRubyで一番欲しかったやつ。パターンマッチングです。どうやら発表前日にtrunkに取り込まれたそうなのですでに遊べるようです。

{% oembed https://speakerdeck.com/k_tsj/pattern-matching-new-feature-in-ruby-2-dot-7 %}

その有用性は以下のJSONのパターンマッチングの例を見れば一目瞭然でしょう。

{% blockquote JSONのパターンマッチング例 https://speakerdeck.com/k_tsj/pattern-matching-new-feature-in-ruby-2-dot-7 セッションスライドより %}
{% img /gallery/events/ruby-kaigi-2019/ruby-kaigi-9.png 600 %}
{% endblockquote %}

こういったマッチングはScalaのような静的言語でやろうとすると非常に面倒ですが、Rubyだと本当にシンプルにかけていい感じです。その他にも配列やハッシュで使いやすいように考慮されていたりElixirでいうpin operator(`^`)が実装されていたりするのでかなり実用的な内容になっていました。ただ一つ残念なのはキーにはまだシンボルしか使えないらしいので、そこは今後に期待です。

### その他のセッション

その他も素晴らしいセッションはたくさんありましたが、全てを紹介するのは難しいので簡単な感想(メモレベル)を書きました。
自分の心の声や脳内(誤)変換もそのまま消さずに残しておきました。嘘や間違いが見抜けて優しくスルーできる人だけが読んでください(笑)。

{% details 興味がある方はここをクリックしてご覧ください。 %}
- Matz Keynote
  - テスト嫌いなんだよね
    - DRYじゃないでしょ
- {% elink Ruby 3 Progress Report https://docs.google.com/presentation/d/1z_5JT0-MJySGn6UGrtdafK1oj9kGSO5sGlTtEQJz0JU/edit#slide=id.p %}
  - RubyコアチームからのRuby3に向けての進捗報告
  -  実質Matzの話の続きで少し詳細化した内容
- {% elink How To Use OpenApi3 For Api Developer https://speakerdeck.com/ota42y/how-to-use-openapi3-for-api-developer-rubykaigi-2019 %} @ota42y
  - OpenApi 3の話
  - 分かる人にはSwaggerがそのままOpenAPIに名前を変えたといったほうが分かりやすいかもしれない
  - 個人的にはRESTよりもGraphQLのほうがスマートだと思っているが・・・
- {% elink Pragmatic Monadic Programming in Ruby https://speakerdeck.com/joker1007/pragmatic-monadic-programming-in-ruby %} @joker1007
  - モナドをRubyに実装した話
  - RubyのASTを ~~悪用~~ 活用した素晴らしい例
  - Scalaを ~~パクった~~ インスパイアした素晴らしい例
  - 個人的にはこういうのを待ってた :thumbsup:
  - リポジトリは {% elink こちら https://github.com/joker1007/monar %}。後で遊ぶよ。
- Fibers Are the Right Solution @ioquatix
  - Call back hell！
  - Async/Await Hell！
  - So Fiber is right！
  - Auto Fiberに期待しておこう
- {% elink All bugfixes are incompatibilities (Keynote) @nagachika https://www.slideshare.net/nagachika/all-bugfixes-are-incompatibilities %}
  - リリースブランチのメンテナの6年間の苦労話
  - 「人間は1年に1歳年をとる脆弱性がある」というパワーワードが飛び出る
  - 美しいパッチだと取り込みたくなる
    - 必要のないパッチを入れるのはやめておけ。バグるかもしれない・・・
  - parse.yは魔境
  - Syntax Errorは辛い・・・ 回避不能
    - 括弧つけろよ、と思わなくもない
  - Be Practical
  - コミットログを読もう
  - コンフリクトは2割ぐらい
  - 発生バージョンが細かく書いてあったり、具体的に困っているプロダクトがあると取り込みやすい
- {% elink Six Years of Ruby Performance History: But How to Measure...?  https://www.dropbox.com/s/jfe4yjezpcr2171/RubyKaigiSlides.key?dl=0 %} @codefolio
  - RRB(Ryby Rails Bench)によるとRailsはRuby 2.6は2.0と比較して172%速くなった
  - RRBは実アプリケーションに合わせたマクロなベンチでどの部分が遅いかは教えてくれない
  - そこでRSB(Ryby Simple Bench)の出番
- intimate Chat with Matz and mruby developers about mruby @Hir0_IC
  - 今日4/19はmrubyお誕生日・・・です
  - mrubyはメモリ消費を抑えるのを頑張っている
  - MatzにGCを作って欲しければ、退屈な会議に参加させればよい
  - 捻挫したからセパレートキーボードにした by Matz
  - 回答者よりも先に質問者が回答を述べるスタイル。斬新。
- {% elink Building a game for the Nintendo Switch using Ruby http://slides.com/amirrajan/game-dev-ruby-happiness-part-2#/ %} @amirrajan
  - Nintendo SwitchでRubyを動かしやがった・・・
  - こ、こいつ動くぞ！
- {% elink RubyData Workshop https://docs.google.com/presentation/d/1wYBqdlv-rBqCcjqaT4pbqYnpA9cDlTr2iKpGAQ-Mz-I/edit#slide=id.p %} @mrkn, @284km, @kozo2, @ktou, @znz
  - rubydownは面白そう
  - お菓子とフルーツのデプロイが完了した
- {% elink What is Domain Specific Language? http://www.a-k-r.org/pub/2019-04-19-akr-DSL-rubykaigi2019.pdf %} @tanaka_akr
  - Syntax + Semantics = Language
  - この二つの違いをちゃんと知りたい方はコンピュータサイエンスを学びましょう(笑)
  - Smalltalkの2項演算子には優先順位がない。ま、まじか！
  - 良いことには限界があるが悪いことには限界がない
    - 名言頂きました
- Lightning Talk Sessions
  - {% elink How does TruffleRuby work https://speakerdeck.com/kishida/how-does-truffleruby-work  %} @kis
    - Javaの話をします。Javaを書こう！
    - Graal VMとGraalは違う
    - 第3二村射影がTruffleになるという話。コンパイラジェネレータのお話。
  - {% elink How to Make Bad Source https://speakerdeck.com/oda/how-to-make-bad-source %}
    - ブラックジャックを糞コードにした話と仕様を都合よく変える話(ぉぃ
    - ワレ、{% elink TRICK2018 https://github.com/tric/trick2018  %}ノ、フッカツヲ、ノゾム
    - 奴らクレイジーだな
  - {% elink Dive into middleware with mruby https://speakerdeck.com/yui_knk/dive-into-middleware-with-mruby %} @spikeolaf
    - 人生を生きているとRDBMSを作りたくなる・・・まじか！
  - {% elink From ㍻ to U+32FF https://speakerdeck.com/mitsuboshi/from-heisei-to-u-plus-32ff %} @Y_MITSUBOSHI
    - まぁ令和ネタはあるだろうと思ってた
  - {% elink Invitation to the dark side of Ruby https://www.slideshare.net/tagomoris/invitation-to-the-dark-side-of-ruby %} @tagomoris
    - Rubyには決してマクロは入れない　by Ma●ｚ
    - :point_right: {% elink Maccro https://github.com/tagomoris/maccro %}作りました。てへぺろ。
  - Applying mruby to World-first Small SAR Satellite
    - mrubyのコードを衛生に送る
    - ラーメン屋の行列を見てから行きたいじゃないっすか？
  - {% elink The TracePoint bumb! https://speakerdeck.com/koic/the-tracepoint-bumb %}
    - TracePointを使ったテロの話
    - 頭沸いてるんじゃねーか by ko1
    - 悪とかそういうレベルじゃねえなこれは by usa
    - バグ・オブ・ザ・イヤー by nobu
    - wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww やめろ、こんなん草しか生えんわ！
  - {% elink Make Ruby Differentiable https://www.slideshare.net/nagachika/make-ruby-differentiable %} @nagachika
    - Rubyでも自動微分したい！的な何か
  - {% elink Write ETL or ELT data processing jobs with bricolage https://speakerdeck.com/inohiro/write-etl-or-elt-data-processing-jobs-with-bricolage %}
    - バッチジョブ的な何か
- Ruby Committers vs the World
  - curryはお手本を見せるために作った。使うべきではない。
  - 投票は信じない by Matz
  - 新機能を増やしたい by 観衆
    - わざわざ福岡に来るのはアグレッシブな人なの。真に受けて責任取らされるのは僕なの！ by Matz
  - 公開開発者会議([議事録](https://hackmd.io/RHss7paPR26rV7HaYK4FNA))
    - HackMDは便利。OSS版は[CodiMD](https://github.com/hackmdio/codimd)で自分はこちらをよく使う。
  - Haskellの`$`やElixirの`|>`相当の演算子がRubyにも欲しい
    - :point_right: が演算子の候補になったときは大爆笑。草はやすわ
  - むしろ右代入が欲しい
  - こうしてゆるくてほとんど決まらないのが平常運転
  - もう少しでRubyコアの開発をsubversionからcgitに移行するよ →　{% elink したよ! https://k0kubun.hatenablog.com/entry/ruby-core-2019 %}
- {% elink Cleaning up a huge ruby application https://speakerdeck.com/riseshia/cleaning-up-a-huge-ruby-application %} @riseshia
  - 立ち見が出るほどの超人気セッション(自分も席とれなくて壁際で聴講)
  - Cookpad社で使われているcookpad_allというリポジトリはコード量が50万行以上あり
  - 未使用コードを削りたい
  - KitchenCleanerを開発
    - 1年間更新の無いコード、未実行のコードを自動で見つけ出す
    - GitHubにIssueを立ててgit logからランダムで人を選んでアサイン。まじか！
  - IseqLogger
    - 使われていない命令を洗い出す。要コンパイル
  - Ruby 2.6から入った“oneshot coverage”は一回でも実行されたかどうかを計測。これは便利そう。
- {% elink The challenges behind Ruby type checking  https://speakerdeck.com/soutaro/the-challenges-behind-ruby-type-checking %} @soutaro
  - Rubyの型チェッカーの {% elink Steep https://github.com/soutaro/steep %}の話
  - FontAwesomeでRubyを検索するとアヒルがでてくる。分かっているじゃないか（ニヤリ）
  - アヒルはスケールするよ
  - {% elink Rubyのシグネチャ定義言語 https://github.com/soutaro/ruby-signature %}
    - 後付の型定義言語なのでかなり柔軟に表現できる。TypeScriptの影が見えた・・・
  - `open`の型定義がとんでもないことになってる・・・
- {% elink The future of the Bundled Bundler with RubyGems https://www.slideshare.net/hsbt/the-future-of-bundled-bundler %} @hsbt
  - RubyGemsの多要素認証してください
  - Rubyを使うのにbundlerをまず入れなきゃ、みたいなのは体験が良くないのでやめたい
- Reducing ActiveRecord memory consumption using Apache Arrow @mrkn
  - {% elink Apache Arrow https://arrow.apache.org/ %}を使ってActiveRecordのメモリ削減できるかという話
  - 先日の発表は間違っていました
  - 列指向。Pandasと言われて納得した。データフレームね。
- {% elink Red Chainer and Cumo: Practical Deep Learning in Ruby  https://speakerdeck.com/sonots/red-chainer-and-cumo-practical-deep-learning-in-ruby-at-rubykaigi-2019 %} @sonots @hatappi
  - 現在のPythonのDNNスタックに対応するものがだいたいRubyにも出揃った
    - Chainer-> RedChainer, TensorFlow -> TensorFlow.rb, MXNet -> MXNet.rb, NumPy ->Numo::NArray, CuPy ->  Cumo
  - ONNXを使った連携。ProtocolBuffer使う。
  - numoをcumoにしたら奇跡的に動いた！
  - Ruby3で3倍速いという話をしてますけど、Cumoを使うと75倍速い（ドヤ）
- {% elink Optimization Techniques Used by the Benchmark Winners (Keynote) http://code.jeremyevans.net/presentations/rubykaigi2019/ %} @jeremyevans0
  - SequalやRodaといったベンチマークで高性能を叩き出すフレームワーク作者の最適化術
  - 最適化術も凄かったが解説もわかりやすい。コードの解説はああやればいいのか・・・あとでスライドを見直そう。
{% enddetails %}

## 食事

いつも何がでるか楽しみですが、今年は特にやばかったです。

### 昼食

まさかの屋台！トップページが伏線だったとは・・・
屋台は5軒出ていたのでパノラマ写真にしてみました。

{% img /gallery/events/ruby-kaigi-2019/lunch-1.jpg 600 %}

タイムラプスにした人もいるようです。

{% oembed https://twitter.com/orgil_/status/1119083602589786113 %}

ビーフストロガノフと焼きラーメンを食べました。
とても美味しかったですが、屋台の暖簾はフェイクだったので店を間違えました・・・
Rubyラーメン食べたかった・・・

{% img /gallery/events/ruby-kaigi-2019/lunch-2.jpg 400 %}

一日だけお弁当にしてみました。これも美味しかったです。

{% img /gallery/events/ruby-kaigi-2019/lunch-3.jpg 400 %}

### 間食

お茶やコーヒーはブースで入れてもらいました。
特に八女茶の甘みと旨味のコラボレーションが忘れられない・・・

{% img /gallery/events/ruby-kaigi-2019/after-break-1.jpg 400 %}

お菓子やフルーツも大量にGetできました。

{% img /gallery/events/ruby-kaigi-2019/after-break-2.jpg 350 %}{% img /gallery/events/ruby-kaigi-2019/after-break-3.jpg 350 %}

### Official Party at 川端商店街

技術カンファレンスとしては前代未聞の商店街のアーケードをまるまる使った{% elink 公式パーティー https://rubykaigi.org/2019/docs/rubykaigi-official-party.pdf %}です。
常人の発想じゃない(褒め言葉)ですね。震えが止まりません・・・

{% img /gallery/events/ruby-kaigi-2019/party-1.jpg 350 %}
{% img /gallery/events/ruby-kaigi-2019/party-2.jpg 350 %}

ニュースにもなったみたいです。

{% linkPreview https://headlines.yahoo.co.jp/hl?a=20190419-10424223-kbcv-l40 %}

このパーティーは本当に驚愕でしたが、控えめに言って最高でした。参加できてよかったです。

## 令和時代のRubyKaigi

最後の最後でまさかの令和ネタが飛び出ました。次の開催は長野県松本市です。
この「松本」で開催されるRubyKaigiは名前的に縁起がよく、正しく令和時代の最初のRubyKaigiに相応しい場所と言えると思います。
これがRubyKaigiで一番度肝を抜かれたネタでした。不意打ちすぎる・・・

{% img /gallery/events/ruby-kaigi-2019/reiwa-1.jpg 400 %}
{% img /gallery/events/ruby-kaigi-2019/reiwa-2.jpg 400 %}

## まとめ

RubyKaigiはフレンドリーで活気に満ちた素晴らしい国際カンファレンスです。
この記事を読んでくれた方に、少しでもRubyKaigiの楽しさをお伝えできたなら幸いです。

参加者、関係者の皆様、お疲れ様でした！

{% img /gallery/events/ruby-kaigi-2019/final-1.jpg 330 %}{% img /gallery/events/ruby-kaigi-2019/final-2.jpg 330 %}