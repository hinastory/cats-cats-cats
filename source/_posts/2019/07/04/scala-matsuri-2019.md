---
title: ScalaMatsuri 2019に参加してきました
thumbnail: /gallery/thumbnails/scala-matsuri-logo.png
toc: true
categories:
  - Tech
  - Event
tags:
  - Scala
  - Event
date: 2019-07-04 07:28:45
---
ScalaMatsuri 2019に参加してきました。毎年何気に楽しみにしているお祭りです。今年も面白い発表がたくさんあり、お祭り気分も充分に味わえたので満足の行くカンファレンスでした。

{% blogCard https://2019.scalamatsuri.org/ %}

<!-- more -->
## ScalaMatsuriとは

プログラミング言語Scalaをテーマにした日本最大級のカンファレンスです。今年は「Scala Conference in Japan 2013」から数えて６回目の開催になります。ScalaMatsuriの特色としてはセッションの決定がチケット購入者の投票によって決まること、海外スピーカの招待に力を入れておりセッションに日英同時通訳が入っていること、アンカンファレンスがあることなどが挙げられます。また、その名の通り「お祭り」の雰囲気を出すための工夫が随所に見られ、非常に親しみやすいカンファレンスとなっています。

## 会場について

{% img /gallery/events/scala-matsuri-2019/scala-matsuri-001.jpg 350 %}{% img /gallery/events/scala-matsuri-2019/scala-matsuri-002.jpg 350 %}

日時と場所は以下のとおりです。自分は6/28のカンファレンスから参加しました[^1]。場所はお台場です。ビッグサイトの近くと言ったほうが分かる人にはわかるかもしれません（笑）。新橋からゆりかもめに乗って行ったのですが、`東京国際クルーズターミナル駅`と言う聞き慣れないアナウンスが流れて来て仰天しました。どうやら最寄り駅の駅名が変わっていたみたいです・・・[^2]

- 日時
  - 6/27(木) - 6/29(土) 10:00〜
- 場所
  - 東京国際交流館

<iframe src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d12973.11305993688!2d139.776089!3d35.620866!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x580ab4984e28a750!2z5p2x5Lqs5Zu96Zqb5Lqk5rWB6aSoIOODl-ODqeOCtuW5s-aIkA!5e0!3m2!1sja!2sjp!4v1562014029950!5m2!1sja!2sjp" width="600" height="450" frameborder="0" style="border:0" allowfullscreen></iframe>

[^1]: 6/27はワークショップDAYです。 {% elink お絵かきで学ぶScala教室 https://scalaconfjp.doorkeeper.jp/events/91443 %}と {% elink OSS ハッカソン https://scalaconfjp.doorkeeper.jp/events/91355 %}が開催されていました。OSSハッカソンはよく見たらチューターがガチですね。どんなコントリビュートがされたのか気になります。

[^2]: 2019年3月16日に「船の科学館駅」から「東京国際クルーズターミナル駅」に改称したようです。また「東京国際展示場正門駅」も「東京ビッグサイト駅」に変更されています。こちらはまだ分かりやすい気がしますが、東京国際クルーズターミナルの開業は2020年7月ということらしいので、寝耳に水でした。

### 行動規範

到着したのは10:00頃で、ちょうど行動規範[^3]のアニメが流れているときでした。このアニメは毎年クマくんのところで笑ってしまいます。アニメが流れ終わったところで、次のオススメ動画に子供向け動画（３匹の子豚？）が出てきて会場が爆笑していました。

{% oembed https://www.youtube.com/watch?v=lIfOQNTWdxI %}

[^3]: 行動規範(Code of Conduct/Universal Access)はカンファレンス参加者が守るべきルールです。内容はハラスメントフリーで参加者全員を尊重しつつ、みんなが気持ちよくカンファレンスを楽しめるようにするための取り決めになっています。行動規範はイベントごとに微妙に違うので事前に目を通しておくことをおすすめします。

## カンファレンスDAY

ScalaMatsuriは27日(金)がカンファレンスDAYでした。ScalaMatsuriで凄いと思うのは３本のセッションが並行して走っていてそのうち２つの部屋では同時通訳が行われていたことです。そのため翻訳レシーバを借りれば英語のセッションでも問題なく楽しめました。[^4]。

{% img /gallery/events/scala-matsuri-2019/scala-matsuri-018.jpg 600 %}

以下が27日に自分が聴講したセッション一覧です。ちょっとこじらせているので関数型プログラミングに偏っています（笑）。

- Scala 3って、私にはどんな影響があるの? @joang38 (Joan Goyeau)
- 再帰:スキーム,代数,finally tagless,データ型. 統合されたビジョン @alexknvl (Alexander Konovalov)
- プロジェクトで引き回す型をEffにするメリット @wing_007 (ma2k8)
- こんなに違う！<-ScalaとKotlin-> @_kaelaela (前川裕一)
- DOT計算をやさしく説明する @kmizu (水島宏太)
- Making Logic Monad @halcat0x15a (ねこはる)
- sbt コア・コンセプト @eed3si9n (Eugene Yokota)
- 継続とDI @gakuzzzz (中村学（がくぞ）)

ここからは少し長くなりますがセッションの感想を一つずつ述べていきます。

[^4]: この同時通訳は日本語->英語だけではなく、英語->日本語も行われています。したがって英語話者に対して日本語で質問ができたりその逆も可能です。RubyKaigiでも同時通訳はありましたが日本語->英語だけだったので、その点ScalaMatsuriの方が英語が苦手な人でも楽しめると思います。またスライドに日本語訳が付いているのも有難かったです。

### Scala 3って、私にはどんな影響があるの? @joang38 (Joan Goyeau)

Scala3(Dotty)の影響についての発表でした。以下が言及があった機能一覧です[^5]。概ね知っていましたが、いくつか新しい発見もあったので有意義なセッションでした。

- {% elink Enumerations https://dotty.epfl.ch/docs/reference/enums/enums.html %}, {% elink Algebraic Data Types https://dotty.epfl.ch/docs/reference/enums/adts.html %}
  - やっとScalaにまともなEnumurationが来るといった話です。今までは`case object`で書いていたものが`enum`キーワードで大分シンプルに書けるようになります[^6]。
- {% elink 交差型 https://dotty.epfl.ch/docs/reference/new-types/intersection-types.html %}, {% elink 合併型 https://dotty.epfl.ch/docs/reference/new-types/union-types.html %}
  - ようやくTypeScriptでできた型表現がScalaでもできるようになりました
  - 交差型に関しては`with`もあったけど交換可能でなかったので、ようやく本物がDottyにも入ったということです
- NULLは100万ドルの間違い
  - たぶん[#5747](https://github.com/lampepfl/dotty/pull/5747)の話だったと思います
  - 現在でもOptionがありヌルポを見る機会はあまりありませんが、将来的には本当に見る機会がなくなるかもしれません
- {% elink Opaque 型エイリアス https://dotty.epfl.ch/docs/reference/other-new-features/opaques.html %}
  - `AnyVal`は、いけてないよねという話[^7]。`opaque`で本物の型エイリアス（いわゆるゼロコスト抽象化）が手に入ります
- {% elink 拡張メソッド https://dotty.epfl.ch/docs/reference/contextual/extension-methods.html %}
  - 型が定義された後にメソッドを追加できる機能
  - 拡張メソッドの構文はすごいGo言語チックだと思いました[^8]
- {% elink デリゲート https://dotty.epfl.ch/docs/reference/contextual/delegates.html %}
  - 今までの型クラスのためのハックがまともな構文として定義されましたというお話
- {% elink マルチバーサル等価性 https://dotty.epfl.ch/docs/reference/contextual/multiversal-equality.html %}
- {% elink トレイトパラメータ https://dotty.epfl.ch/docs/reference/other-new-features/trait-parameters.html %}
  - givenが使えるのは大きいです
- {% elink Parameter Untupling https://dotty.epfl.ch/docs/reference/other-new-features/parameter-untupling.html  %}
  - mapでcaseのあのパターンがいらなくなるお話。これは地味に便利
- TASTy
  - コンパイル時の成果物の新しいフォーマットです
  - クロスコンパイルが容易になります

上記の機能のいくつかはこのブログでも言及しているので参考にしてください。

{% blogCard https://hinastory.github.io/cats-cats-cats/2019/02/24/scala-dotty-contextual-abstractions/ %}

[^5]: 軽くメモしただけなので間違っているかもしれません。Dottyドキュメントのリンクは自分調べて貼りました。
[^6]: Enumerationクラスは本当に使えない子なので見なかったことにしてあげてください。
[^7]: `AnyVal`がなぜいけていないかは {% elink SIP-35 https://docs.scala-lang.org/sips/opaque-types.html %}を参照してください。
[^8]: ~~拡張メソッドの構文は[#6760](https://github.com/lampepfl/dotty/pull/6760)で変わるかもしれません・・・~~ マージされずにクローズされました。ただまたいつかこの話題が再燃するかもしれません・・・


### 再帰:スキーム,代数,finally tagless,データ型. 統合されたビジョン @alexknvl (Alexander Konovalov)

ScalaMatsuriでは例年話される関数型プログラミングネタです。最初の方はずっと同型（Isomorphism）について話していたので、どこに向かうのかよく分かりませんでしたが終わってみれば関数型プログラミングの流行りのテクニックの総集編みたいな内容でした。結論は以下のような感じです。

```
folds(畳み込み) ≈ 再帰スキーム ≈ Final Tagless ≈ Free
```

「folds(畳み込み) ≈ 再帰スキーム」と「Final Tagless ≈ Free」は予想は付いていましたが全てが同型だとは思っていませんでした。まぁ「代数」というくくりで見ると確かに同じ気がします。

### プロジェクトで引き回す型をEffにするメリット @wing_007 (ma2k8)

この話も毎年恒例になってきたEff(Extensible Effects)のお話です。Effを簡単に説明するとモナドの合成と評価を柔軟に行うためのテクニックです。

{% oembed https://speakerdeck.com/ma2k8/the-advantage-of-using-eff-in-scala-project %}

上記スライドでEffと対比されていた型は以下です。

1. `Future[A]`
2. `Future[Try[A]]`
3. `Future[E Either A]`
4. `EitherT[Future, E, A]`
5. `Eff[R,A]`

この中で自分がよく使うのは1です。2,3,4は使ったことはありますが型合わせが面倒なので部分的にしか使ったことはないです。5はEffそのものですが写経したくらいで実践で使ったことはありません。いずれ使って見たいと思いますが、問題はチーム全員が使いこなせるかどうかですね・・・

### こんなに違う！<-ScalaとKotlin-> @kaelaela (前川裕一)

ScalaをコンパイルするとシンプルでKotlinをデコンパイルすると複雑だというのが面白かったです。あと似ている型も注意が必要そうです。デコンパイルしよう。

{% oembed https://speakerdeck.com/kaelaela/konnaniwei-u-scalatokotlin  %}

### DOT計算をやさしく説明する @kmizu (水島宏太)
- {% elink スライド https://kmizu.github.io/ScalaMatsuri2019/ %}

kmizuさん[^9]によるScala3の理論基盤であるDOT計算のお話です。現実のプログラミング言語を厳密に理論基盤に載せるのは難しいので、妥当な言語のサブセットを作ってモデル化したものを「核計算」というらしいです。DOTはScala3の核計算であり、健全性が厳密に証明されているようです。残念ながらDOT計算の詳細は時間がなかったので翌日のアンカンファレンスに持ち越されました。

[^9]: {% elink 退職エントリ http://kmizu.hatenablog.com/entry/2019/06/28/223313 %}が話題になっていました。他にもドワンゴの退職エントリを見かけたので、本気でやばそうですね・・・

### Making Logic Monad @halcat0x15a (ねこはる)

論理プログラミング言語としてはPrologが有名ですが、その一部の機能をScalaで実現しようというものでした。自分は論理プログラミングはあまり知らなかったのですが、論理的に可能な組み合わせが全て解として求めることができるというのは面白いと思いました。

{% oembed https://www.slideshare.net/mobile/SanshiroYoshida/making-logic-monad %}

具体的なモナドの構成はスライドを見たほうがいいと思いますが、印象に残った`パワーワード`は以下の２つです。

- バックトラッキングはモナドプラス
- FizzBuzzは実践的アプリケーション

あとはType-aligned sequenceというデータ構造も知らなかったので後で調べて見ようと思います。

### sbt コア・コンセプト @eed3si9n (Eugene Yokota)

scalaで最もよく使われているビルドツールである{% elink sbt https://www.scala-sbt.org/index.html %}の解説でした。いつもお世話になっているsbtですが、いつもなんとなくというかその場しのぎで調べて動かしていたので、いろいろと勉強になりました。内容はおそらく6/11-23に開催されていた {% elink Scala Days 2019 https://www.scaladays.org/ %}で発表されたものと同じではないかと思います。

<script id="klewel-embed" type="text/javascript" src="https://portal.klewel.com/static/widgets/klewel-embed.js"></script><div data-klewel-widget="player" id="player-jDCXCiCxGXqJYAraQxVw7F" data-klewel-conf-shortuuid="nsWEhX26rHQcywKsB9nMi7" data-klewel-talk-shortuuid="GjyUSS37EReYB9r3is5hqL" data-klewel-talk-seek="0" data-klewel-talk-popup="false" data-klewel-talk-endSeek="0">Player is loading...</div>
以下はメモです。

- 空でも動く
- 流れを堰き止めるのがcommand
- commandよりtaskがオススメ
- キーは4次元
- デリゲーションルール
- Zero
- キーは最も広いスコープで定義して、最も狭いスコープで参照

### 継続とDI @gakuzzzz　(中村学 (がくぞ）)

- {% elink  スライド https://gakuzzzz.github.io/slides/cps_or_di %}

継続渡しスタイル(Continuation Passing Style/CPS)とDI(Dependency Injection)を比較する非常に興味深いセッションでした。自分の継続のイメージはSchemeから来ていてどちらかと言うと`goto`と比較されるプリミティブだったのですが[^10]、確かに言われて見ればDIだなと納得しました。あとSchemeでCPSを使うとネストが深くなりますが継続モナドを使うとネストを潰せてDSLっぽくなるのも面白かったです。CPSとDIのどちらを使うべきかという問いに対しては、使い分けが必要でCPSはアドホックな場面で使いましょうということでした。個人的に気になった点は似たような使い方ができるリーダーモナドやMinimal Cake PatternやEffなどと比較した場合はどうなんだろうということでした。また時間があったら自分で考察してみたいと思います。そういえば大昔にScala本体にも継続が実装されていていつの間にか標準から切り離されていたけど今も息をしているのだろうか・・・

[^10]: Schemeでは継続が第一級オブジェクトで、機能名から`call/cc`ともよく呼ばれています。`goto`（または`setjmp`/`longjmp`）と呼ばれる理由は「{% elink Scheme/継続の種類と利用例 - Wikibooks https://ja.wikibooks.org/wiki/Scheme/%E7%B6%99%E7%B6%9A%E3%81%AE%E7%A8%AE%E9%A1%9E%E3%81%A8%E5%88%A9%E7%94%A8%E4%BE%8B %}」を参照するとよく分かると思います。

## アンカンファレンスDAY

アンカンファレンスはカンファレンスのカウンターパートです。つまり、カンファレンスほど形式張らずにアドホックにセッションを決定しようという比較的軽いノリですが、まさしく「お祭り」の雰囲気に相応しいワイワイした感じがとても印象的です。

{% img /gallery/events/scala-matsuri-2019/scala-matsuri-003.jpg 350 %}{% img /gallery/events/scala-matsuri-2019/scala-matsuri-004.jpg 350 %}

アンカンファレンスが具体的にどのように進むかというと、前日から用意されたホワイトボードに付箋で聞きたいネタや喋りたいネタを貼って、セッションに参加したいと思ったら赤いシールを貼ります。そして当日の朝会や昼会で投票が多くて発表者やファシリテータがいるものを優先してセッション枠を埋めていきます。上の写真はホワイトボードの様子と昼会でセッション枠を決めている様子です。

以下参加したセッションです。どれも非常に面白かったのですが長くなるのでメモベースの記載になります。

- {% elink 仕事でScalaを使おう - Arm Treasure DataでのAirframe活用事例 https://www.slideshare.net/taroleo/how-to-use-scala-at-work-airframe-in-action-at-arm-treasure-data %} @taroleo (Taro L. Saito )
  - 最近よく聞く {% elink Airframe https://wvlet.org/airframe/ %}のお話です
  - AirframeはDIコンテナだと思いこんでいましたが、どうやらDIだけではなく様々な便利ツールの集合体のようです
  - MessagePackがTreasure Data発だと初めて知りました。MessagePackを使いたくなったらAirframe
  - logとlauncherは後で試してみよう
- Bengal: Dotty Cats @ Walter Chang
  - {% elink Bengal: A less than minimal functional library in the spirit of cats in Scala 3. https://github.com/weihsiu/bengal/tree/master %}
  - Scala Taiwanから来日された方の発表です
  - Scalaで型クラスを使う場合に広く使われている{% elink cats https://typelevel.org/cats/ %}ライブラリをScala 3で実装するとどうなるかという発表でした
  - 個人的に面白かったのは {% elink shapeless https://github.com/milessabin/shapeless %}を使って型クラスを導出する部分でした
- DOT Calculus I didn't explain yesterday @kmizu (水島宏太)
  - DOTは難しいということが分かりました
  - 特にサブタイプは鬼門だと・・・
  - DOTは健全らしいです　（参考: {% elink dot soundness http://lampwww.epfl.ch/~amin/dot/soundness_oopsla16.pdf %})
- {% elink Fast & Functional https://speakerdeck.com/miciek/fast-and-functional-scala-matsuri-jp %}
  - 最初の１時間だけ聴講しました
  - パワーワード「`制限は開放し、自由は制限する`」
- {% elink WiFi x Scala: Implementing Captive Portal in Scala and deploy into #ScalaMatsuri https://speakerdeck.com/kurochan/wifi-x-scala-implementing-captive-portal-in-scala-and-deploy-into-number-scalamatsuri  %}  @ kuro_m88
  - Captive Portalという仕組みを初めてしり勉強になりました
  - 今回のWifi事情はおそらく他のカンファレンスと比べても非常に良かったと言えるくらい安定して繋がりやすかったです
  - その裏舞台を聞けて非常によかったです
-  {% elink Write stacksafe non-tailrec recursions https://speakerdeck.com/jooohn/write-stack-safe-non-tailrec-recursive-functions %} @jooohn1234
  - 再帰 is cool
  - Stack overflowを避けるためにトランポリンを使おうという話
- Fujitask meets Extensible Effects  @ y-yu
  - [Extensible Effectsでトランザクションモナド“Fujitask”を作る - Qiita](https://qiita.com/yyu/items/fbd6edc00abb6395dabb)
  - トランザクションを型レベルの計算に落とせるというのは面白い
  - kits-effを利用している
    - [進捗大陸05](https://booth.pm/ja/items/1309694)にねこはるさんのkits-effの記事があります。自分も前回の技術書典で購入していました
- From Go To Scala Easy vs Simple
  - 個人的にはアンカンファレンスのなかで一番熱いプロレスでした
  - KotlinやC++やSwiftも参戦してきて、カオスな雰囲気がいい味を出していました
- Applicative Functor - Selective Functor - Monad
  -  Selective Functorという聞き慣れない言葉に誘われて聴講しました
  -  なんとなく仕組みはわかりましたが、どういうときに使うものかイマイチわからなかったので後で勉強します・・・

## 聞きたかったけど聞けなかったセッションたち

あとで見るために資料のリンクだけ載せておきます。

- {% elink Using Akka Cluster for a payment service https://speakerdeck.com/negokaz/using-akka-cluster-for-a-payment-service  %}
- {% elink Running Scala on AWS Lambda in a Snappy Way https://speakerdeck.com/todokr/running-scala-on-aws-lambda-in-a-snappy-way %}
- {% elink 同僚の登壇資料作成をScalaで手伝った話 https://speakerdeck.com/bakenezumi/scalamatsuri-2019-lt  %}
- {% elink How we replaced a 10-year-old Perl product using Scala https://speakerdeck.com/tanishiking/how-we-replaced-a-10-year-old-perl-product-using-scala %}
- {% elink ScalaのOSSに貢献しよう ~ Phil Bagwell Award記念講演 https://xuwei-k.github.io/slides/Matsuri-2019/#1)
how-we-replaced-a-10-year-old-perl-product-using-scala  %}
- {% elink High Performance Scala/high_performance_scala https://speakerdeck.com/hiroki6/high-performance-scala  %}
- {% elink How to build an Event-Sourcing system using Akka with EKS https://speakerdeck.com/j5ik2o/how-to-build-an-event-sourcing-system-using-akka-with-eks %}
- {% elink  [Running in 'PRODUCTION' Reactive Systems with cloud services https://speakerdeck.com/mananan/running-in-production-reactive-systems-with-cloud-services %}
- {% elink ScalaでGANをスクラッチ開発した話@ScalaMatsuri https://www.slideshare.net/mobile/ssuser3a8b3b/scalaganscalamatsuri %}
- {% elink コードで理解するPlayframeworkの脆弱性 https://speakerdeck.com/kumagoro_alice/kototeli-jie-suruplayframeworkfalsecui-ruo-xing  %}
- {% elink Functional Concurrency in Scala 101 https://slides.com/avasil/fp-concurrency-scalamatsuri2019#/  %}
- {% elink 悩める開発者に贈る〜 サービスの継続的な成長を支える分析設計手法 https://gitpitch.com/s10myk4/scalamaturi2019-slide %}
- {% elink Clean Architecture in Practice https://speakerdeck.com/yoshiyoshifujii/clean-architecture-in-practice-at-scalamatsuri2019 %}
- {% elink Intro to typeclass in Scala https://speakerdeck.com/phenan/intro-to-typeclass-in-scala %}
- {% elink Scala Driven Management https://speakerdeck.com/hiraiva/scala-driven-management %}
- {% elink Case of Ad Delivery System is Implemented by Scala and DDD https://speakerdeck.com/atty303/case-of-ad-delivery-system-is-implemented-by-scala-and-ddd  %}
- {% elink ピュアなドメインを支える技術/pure domain model and the technology behind it https://speakerdeck.com/petitviolet/pure-domain-model-and-the-technology-behind-it %}
- {% elink How to test proper{t,l}y (Scala Matsuri edition) https://speakerdeck.com/larsrh/how-to-test-proper-t-l-y-scala-matsuri-edition %}

## 食事

ScalaMatsuriの魅力には食事もあります。以下の写真は昼食のお弁当です。お弁当はいくつかの種類があってちゃんとベジタリアン向けのお弁当も用意されていました。多分以下は鳥がメインのお弁当だったと思います。

{% img /gallery/events/scala-matsuri-2019/scala-matsuri-010.jpg 350 %}

ScalaMaturiで「祭り」の気分が味わえるのは屋台の存在も大きいです。カンファレンスDAYにはたこ焼き屋が出ていて、アンカンファレンスDAYにはかき氷屋が出ていました。

{% img /gallery/events/scala-matsuri-2019/scala-matsuri-011.jpg 600 %}

懇親会も盛り上がりました。途中でLTもありました。

{% img /gallery/events/scala-matsuri-2019/scala-matsuri-013.jpg 600 %}

左下はアンカンファレンスDAYの朝食で、右下はデプロイされていたうまい棒です。コーヒーとお菓子は豊富に配備されており、セッションの合間に飲んだり食べたりしていました。

{% img /gallery/events/scala-matsuri-2019/scala-matsuri-014.jpg 350 %}{% img /gallery/events/scala-matsuri-2019/scala-matsuri-013.png 350 %}

## カフェスペース

今年から1階にカフェスペースが設けられていました。カフェスペースの入り口でScalaのシンボルである螺旋階段がお出迎えをしてくれました（笑）。カフェスペースなのでコーヒーやお菓子がデプロイされていましたが、それ以外にもScala関連書籍が置かれており自由に読めるようになっていました。

{% img /gallery/events/scala-matsuri-2019/scala-matsuri-021.jpg 300 %}{% img /gallery/events/scala-matsuri-2019/scala-matsuri-020.jpg 300 %}

## まとめ

ScalaMatsuriは本格的なカンファレンスでありながらその名の通り「お祭り」気分が味わえる素晴らしいカンファレンスです。もっとScalaMatsuriを知りたい方は[ScalaMatsuri運営ブログ](https://blog.scalamatsuri.org/)やTwitterの[ハッシュタグ #ScalaMatsuri](https://twitter.com/hashtag/scalamatsuri)もチェックしてみてください。

この記事を読んでくれた方に、少しでもScalaMatsuriの楽しさをお伝えできたなら幸いです。

参加者、関係者の皆様、お疲れ様でした！

{% img /gallery/events/scala-matsuri-2019/scala-matsuri-016.jpg 600 %}

## 戦利品

たくさんの記念品を頂きました。今年も型安全でありますように・・・

{% img /gallery/events/scala-matsuri-2019/scala-matsuri-017.jpg 600 %}
