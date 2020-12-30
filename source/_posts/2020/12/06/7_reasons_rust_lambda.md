---
title: RustとLambdaの相性が良い7つの理由 〜RustでLambdaをやっていく〜
thumbnail: /gallery/thumbnails/rust_heart_lambda.png
categories:
  - Tech
  - CloudNative
tags:
  - Rust
  - AWS
date: 2020-12-06 07:28:45
---
この記事は[Rust 2 Advent Calendar 2020 - Qiita](https://qiita.com/advent-calendar/2020/rust2)の6日目の記事です。
(Zennの記事と同一です。)

[AWS re:Invent 2020](https://aws.amazon.com/jp/about-aws/events/2020/reinvent/)、初のオンライン開催ですが盛り上がってますねー
毎日ありえなくらいのアップデートが発表されて興奮の日々を送っています。
しかし、さすがクラウドのシェアNo.1のAWS、王者の貫禄というか凄みを感じます。

{% blogCard https://aws.amazon.com/jp/about-aws/events/2020/reinvent/ %}
　
さて今回はその盛り上がりの勢いを借りて私の大好きなRustを盛り上げたいと思い筆を執りました。RustとLambdaは相性抜群という話を書いてみたいと思います。

<!-- more -->

# 目次

<!-- toc -->

# はじめに

まずはRustとLambdaの簡単な紹介です。
すでにご存じの方は飛ばして頂いても構いません。

## RustとLambda

Rustは2020年のStack Overflowの調査で **5年連続で開発者から最も愛されているプログラミング言語** になりました。GCを採用しない等の工夫でメモリ効率が高く、豊かな型システムと所有権モデルでメモリ安全性を保証し、便利なツールチェーンとエコシステムで人気を博しています。

{% img /gallery/daily/others/rust_love.png %}

LambdaはAWSサービスのひとつで、**「関数」** という単位でプログラムを実行できるサービスです。FaaS(Function as a Service)の代表的なサービスとも言われています。Lambdaの主な用途は200以上あるAWSサービスを繋いだり、補完したりする **「糊の役目」** です。AWSのサービス単体では使い途が弱くても複数組み合わせたり、ちょっとした補完コードを入れるだけで便利なサービスを生み出せることが多々あります。このような場合にLambdaを使えば、各サービス間に「関数」で好きな処理を挟んで連携させたり、Lambdaで足りない機能を補完をすることができます。ポピュラーな用途としては **API GatewayとLambdaを連携させてREST APIをお手軽に実装** というものがあります。API Gateway単体だとREST APIの結果としてダイナミックな処理結果を返すことができませんが、Lambdaで補完することによって動的な処理結果を返すことができるようになります。

{% img /gallery/daily/others/lambda_is_paste.png %}

Lambdaは近年注目度を増していますが、その主な理由に **「サーバーレス」** と **「クラウドネイティブ」** があります。サーバーレスはEC2のような仮想サーバを使わずにアプリケーションを開発するアーキテクチャのことを指します。サーバーレスの基本的な考え方としては各種のIaaSやSaaSなどのいわゆるXaaSを連携させることでアプリケーションを構築しますが、単純な連携ができない場合はLambdaを使うことで柔軟性が増して実用的なアプリケーションの構築が可能になります。つまり **Lambdaはサーバーレスを語る上で重要なピース** になっています。

サーバーレスが重要な理由はもう一つのキーワードである **「クラウドネイティブ」** を実現する上での重要なアーキテクチャの一つだからです。[Cloud Native Computing Foundation](https://www.cncf.io/)(CNCF)というクラウドネイティブを推進する団体が定義するクラウドネイティブは以下のとおりです。

> クラウドネイティブ技術は、パブリッククラウド、プライベートクラウド、ハイブリッドクラウドなどの近代的でダイナミックな環境において、スケーラブルなアプリケーションを構築および実行するための能力を組織にもたらします。 このアプローチの代表例に、コンテナ、サービスメッシュ、マイクロサービス、イミュータブルインフラストラクチャ、および宣言型APIがあります。
>
> これらの手法により、回復性、管理力、および可観測性のある疎結合システムが実現します。 これらを堅牢な自動化と組み合わせることで、エンジニアはインパクトのある変更を最小限の労力で頻繁かつ予測どおりに行うことができます。
*[CNCFが定義するクラウドネイティブ](https://github.com/cncf/toc/blob/master/DEFINITION.md#%E6%97%A5%E6%9C%AC%E8%AA%9E%E7%89%88)*

定義の中に「回復性、管理力、および可観測性のある疎結合システム」という言葉が出てきますが、  **「疎結合」** にはまさしく「Lambda」の **「糊の役割」** が重要な役目を果たします。またXaaSを最大限活用するサーバーレスは「回復性」、「管理力」においてもAWSの機能の恩恵をフルに活用できることから **クラウドネイティブを実現する上で一番楽ができるアーキテクチャ** だと考えられます。

クラウドネイティブが近年注目されている理由はクラウドネイティブの定義の最後に以下のように書いてあります。

> エンジニアはインパクトのある変更を最小限の労力で頻繁かつ予測どおりに行うことができます。

要するにクラウドネイティブは  **費用対効果が高く、安定したリリースを頻繁に行える** ということです。

さて、ここまでの話を踏まえてこれからしたい話は **「コスパが良く安定したリリースを頻繁に行えるクラウドネイティブは最高で、それを楽に実現できるサーバーレスはもっと最高で、そのサーバーレスの中核を担うLambdaはとても重要で、そんな重要なLambdaに開発者に最も愛されているRustを使えば世の中ハッピーになるのではないか」** になります。前置きが長くなってしまいましたが、次の節からが本題なので是非ともお読みください。

# RustとLambdaの相性が良い7つの理由

それでは具体的にRustとLambdaが相性良い7つの理由を述べていきたいと思います。

## RustはAWSが本気で投資している言語

LambdaはAWSのサービスの一つですが、そのAWSがRustとどのような関係にあるかは相性を語る上で非常に興味深い話です。結論から言うと、**AWSとRustは相性抜群** です。AWSは2019年にオープンソースのRustプロジェクトを支援すると発表し、今年はRustへの投資を強化するとブログで公表しました。Rustおよび関連プロジェクトへのさらなる貢献とAWS自体でのRust開発者の雇用を増やすようです。

{% blogCard https://aws.amazon.com/jp/blogs/opensource/why-aws-loves-rust-and-how-wed-like-to-help/ %}

RustはAWSが推している言語なのだから、当然AWSのサービスのLambdaとの相性も考えられているものと思われます。反論としてはLambdaの公式サポート言語にはRustがないというものが考えられますが、それはRustのサポートがカスタムランタイム[^1]で十分、もしくはそちらのほうが便利だからだとAWSが考えているからではないかと個人的には推察しています。

[^1]: RustのカスタムランタイムはAWS公式のものが用意されています。（[awslabs/aws-lambda-rust-runtime: A Rust runtime for AWS Lambda](https://github.com/awslabs/aws-lambda-rust-runtime)）

## Lambdaは時間課金だからRustと相性が良い

Lambdaはプログラムの実行時間に対する課金ですがその単位が非常に細かく100ms単位でした。つまりLambdaでは **「時は金なり」** という諺どおり、10倍処理が遅くなれば、10倍の料金が取られることになります[^2]。そして今年のre:Inventの発表でさらに細かくなり **1ms単位** になりました。これがどういうことかというと **Rustとさらに相性が良くなった** ということです。

{% blogCard https://aws.amazon.com/jp/blogs/aws/new-for-aws-lambda-1ms-billing-granularity-adds-cost-savings/ %}
 
Rustはもともと実行性能の高さで注目を浴び、その性能はC/C++に匹敵すると言われています。これは他の人気のある言語と比較しても **数倍から数十倍** は高速であるということを意味しています[^3]。

もちろん、その高速性があまり活かされない場合はそれほどメリットはありませんが、Lambdaでは1ms単位で料金に跳ね返ってくるのでRustの性能は確実にコストパフォーマンスに貢献することになります。ただ実際にはLambdaの実行時間にはIO待ち等の時間も含まれるため、単純に言語性能のみでコストを語れるものではありませんが、それでも **Rustを使うだけで他の人気言語よりも大幅に料金を節約できるケースは多々ある** と思われます。

従って従来性能にそこまでシビアでなかったプログラムでもLambdaで実現するとなった途端に料金に跳ね返ってくるので、他の言語と比較して相対的に実行性能のよいRustは **コスパの観点でLambdaと相性が良い** と言うことができると思います。

[^2]: Lambdaの無料枠を考慮しなかった場合の話です。

[^3]: もちろん性能の指標に絶対はありえないのであくまで目安ですが、言語性能の参考としては次の資料があります。[Which benchmark programs are fastest? | Computer Language Benchmarks Game](https://benchmarksgame-team.pages.debian.net/benchmarksgame/which-programs-are-fastest.html)

## Rustはメモリフットプリントが小さいからLambdaと相性が良い

RustはGC(ガベージコレクション)を採用していない数少ない言語です。そしてスタック領域を有効に使うための仕組みもあるのでGCを採用する言語と比較してメモリ使用量（メモリフットプリント）が小さいという特徴があります。そして **Lambdaはメモリ量に応じた課金** になっているので、メモリ使用量が少ないRustは有利です[^4]。またGCがある言語ではメモリプレッシャーが強くなるとGCが頻発して性能低下に繋がるので、前節の時間課金とも絡めてもメモリ資源が逼迫している環境ではRustはコスト的に有利になります。

ただここにはLambdaの落とし穴があって、 **Lambdaはメモリ量に比例したCPUパワーを割り当てる** ので、メモリ量を少なくしすぎてCPUパワーが落ちてLambdaの実行時間が伸びた結果、前節の時間課金と絡んで料金が増したということが起こり得ます。

つまりプログラムがCPU律速でもメモリ律速でもLambdaでは **メモリ量を増やせば性能ボトルネックを改善できる** ことになり、ある意味チューニングのパラメータは単純になっていますが、コストパフォーマンス的には最適解が分かりづらい状況になってしまっているので、試行錯誤して分岐点を見極めるしかありません。

しかし、どのみちメモリ使用量が相対的に少ないRustは、Lambdaにおいてコスト的に有利な面が多いという結論には変わりありません。

[^4]: 正確に言うとLambdaの課金は実際のメモリ使用量への課金ではなく、最初にLambdaに設定したメモリ量に応じて単位時間当たりの金額が変わるという料金体系になっています。

## Lambdaには時間制限(15分)があるから、Rustと相性が良い

Lambdaは非常に便利です。いちいちサーバを立てたりせずともよく気軽に使えるからです。コンテナと比較してもコンテナイメージの管理をしなくていいという利点があり、コストパフォーマンス的にもLambdaが有利なケースが多いです。そんなLambdaにもいくつか弱点（制限）があって、その内のひとつが **実行時間に15分** という制限があることです。

この制限は **ハードリミット** でありお金の力では現状解決できません。つまり、Lambdaを使いたい場合何としても関数で実行される処理を15分以内に完了させる必要があります。もちろん前節のとおりメモリ量を上げればCPUパワーも増えて実行時間の短縮が期待できます。ただその場合でもRustのような実行性能の良い言語を使うだけで、Lambdaに任せられるタスクの幅が増えることは明白です。具体的には画像や音声等の変換処理や、ビッグデータの前処理のような **非常に重いタスクでもLambdaが適用できる** ケースが増えると思われます。

従って性能的に遅い言語よりも **より多彩なタスクをLambdaに任せられる** という点でRustとLambdaの相性は良いと言えると思います。

## Rustは実行環境依存が小さいからLambdaと相性が良い

RustはLambdaの公式サポート言語ではないということはすでにこの記事でも触れたと思いますが、それがRustにとって問題にならない理由のひとつにLambdaの機能の一つである **「カスタムランタイム」** があります。これはbootstrapという名前の実行可能ファイルの形式を実行できて、実行可能ファイルがAmazon Linuxで動作して且つカスタムランタイムのインタフェースを実装していればLambdaの関数として動作可能となるものです。この機能を使えば **Rustを含めたLinux上で動作可能な大抵の言語をLambdaで実行できます。**

この点がどのようにLambdaとの相性に関わってくるかと言うと、**公式のサポート言語はLambda上でサポートされる言語ランタイムのバージョンに依存している** という点です。例えばJavaでは2020年11月現在はすでにJava6,7はサポートされていません。Node.jsは10と12のみサポートされています。これはつまり言語の最新バージョンが使えなかったり、逆に古いバージョンのメンテナンスを打ち切られる可能性があることを意味しています。

もちろんAWSは現在使われているメジャーなバージョンはサポートすると思われますが、**アップデートのタイミングは完全にAWSに依存する** ので常にLambdaの動向に気を使う必要があり、長期的な開発やメンテナンスが必要なサービスでは特に気をつける必要があります。

つまり逆説的にはなりますがRustはLambdaの公式サポート言語に含まれておらずカスタムランタイムを利用しているために **Lambdaの実行環境に対する依存が小さくLambdaのアップデートを気にせずに気兼ねなく開発・メンテナンスできる** ということです。

ただ公式サポート言語に関してもカスタムランタイムを使うことはできるので、Rustと同じ土俵に立つことはできるのですが現実的にはLambdaのデプロイパッケージのサイズのハードリミットである **ZIP圧縮時で50MB、展開時で250MBという制限** もあるのでその戦略を取ろうという気にはあまりならないでしょう。Rustのデプロイサイズに関しては次節で検証したいと思います。

## Rustはデプロイサイズが小さいからLambdaと相性が良い

RustはカスタムランタイムでLambdaにデプロイするという話をしましたが、そうなると今度はデプロイサイズが気になってきます。Lambdaで実行する関数は自分で書いたコードのみならず必要なライブラリも含めてZIP圧縮してAWSにアップロードする必要がありますが、カスタムランタイムということは **Rustを実行する上で必要なライブラリやランタイムを全てまとめてアップロードする必要がある** ということになります。公式サポート言語はランタイム自体はLambdaで用意されているものを使うのでデプロイパッケージに含める必要がありませんが、Rustは違うので実際にどうなのか検証してみました。

まず、Rustで動かすプログラムとしてZIP解凍して中身のjsonファイルを取り出してCSVに変換し、ちょっとした変換をかけてS3やDynamoDBに格納するプログラムを書いてみました。600行程度で以下のとおり20のクレート(いわゆるライブラリ)に依存しています。Cargo.lockを開いてみると220の依存クレートが記載されていたので意外と大きな依存関係を持っていることが分かりました。

{% code lang:toml %}{% raw %}
[dependencies]
tokio = { version = "0.2", features = ["macros"] }
lambda = {git = "https://github.com/awslabs/aws-lambda-rust-runtime/", branch = "master"}
serde = { version = "1.0", features = ["derive"] }
serde_json = "1.0"
rusoto_core = {version = "0.45", default_features = false, features=["rustls"]}
rusoto_dynamodb = {version = "0.45", default_features = false, features=["rustls"]}
rusoto_s3 = {version = "0.45", default_features = false, features=["rustls"]}
rusoto_events = {version = "0.45", default_features = false, features=["rustls"]}
regex = "1"
http = "0.2"
chrono = "0.4"
rand = "0.7"
log = "0.4"
simple_logger = "1.6"
percent-encoding = "2.1"
zip  = { git = "https://github.com/mvdnes/zip-rs" }
scopeguard = "1.1"
rand_distr = "0.2"
glob = "0.3"
csv = "1.1"
{% endraw %}{% endcode %}

さて、これだけ多くの依存性を抱えたプログラムをビルドするとさぞかし大きなバイナリができると思いきや、たったの **9.3MB** しかありませんでした[^5]。ZIP圧縮すると **3.6MB** でAWSにインターネット経由でデプロイしても気にならないサイズ感です。またこのサイズ感であればLambdaのデプロイパッケージのサイズのハードリミットである **ZIP圧縮時で50MB、展開時で250MBという制限** もLambdaの一般的なユースケースではあまり気にしないで良さそうです。

さて、このサイズ感を **「小さい」** と表現するには比較対象が必要ですが、まずはJavaをターゲットにしてみます。aws-serverless-java-containerを使用して、LambdaでSpring Boot2を動かすパッケージを作成してみたら **16MB** になりました。シンプルなプログラムですがRustより明らかに大きなパッケージができました。次にGoを試してみました。Severless Frameworkのaws-go-modテンプレートでパッケージを作成しました。API Gateway経由で応答を返せる単純なプログラムですが **圧縮前で7.2MBで圧縮後で2.8MB** になりました。こちらはRustより小さいですが依存パッケージがaws-lambda-goのひとつだけなので、Rust並の外部パッケージ依存をさせるとRust以上の大きさのパッケージになる予感がします。

従って、サンプル数2で恐縮ですが **Rustは多くの外部依存があっても比較的コンパクトなバイナリが生成できる** という感触を得ました。少なくともLambdaの用途を考えると実用上サイズで問題になるケースは少ないと思われます。

さて、ここまで書いて現在開催中のAWS re:Invent 2020で大きな発表があったことを思い出しました。 **Lambdaでコンテナイメージが利用できるようになる** というものです。

{% blogCard https://aws.amazon.com/jp/blogs/aws/new-for-aws-lambda-container-image-support/ %}
 
この機能を使えば言語に関係なく依存関係をコンテナに閉じ込めることができるようになります。またコンテナイメージは10GBまで利用可能なのでパッケージのサイズもそこまでシビアに気にしなくても良くなるかも知れません。いい世の中になったものです。

[^5]: このサイズは当然リリースビルドのものです。デバッグビルドは29MBありました。

## Lambdaの基盤はRustだから相性が良い

前提条件を述べているので誤解される余地は少ないと思われますが、実行性能やメモリ効率を理由にした相性の良さは **C/C++でも言えること** です。そこでRustにはあってC/C++にはないLambdaとの相性の良さは何かないかと考えてみたらありました！

**Lambdaの基盤が実のところRustで書かれている**のです。実装はOSSとして公開されており **Firecracker** と言います。

{% blogCard https://github.com/firecracker-microvm/firecracker %}
 
**Lambdaの基盤がRustで書かれているから、Lambda関数の言語がRustだと相性が良いに違いない！！** と、思いたいですが、若干こじつけなのは理解しているのでツッコミは不要です。

ただAWSがLambdaの基盤として **C/C++を採用せずRustを採用したという事実** は、Rustの採用に迷っている方やRustを使い続けて問題ないか不安に思っている方にとって力強い後押しになったと思います。そしてもちろん私も背中を押されました。

Lambdaの基盤はRustなんだから、**RustでLambdaをやっていく👊**と。

# おまけ

本節はRustとLambdaを触ってみたい方向けのちょっとしたおまけです。
興味がなければ飛ばして最後の「まとめ」に進んでください。

## 其の1 〜でも面倒くさいんでしょ？〜

RustでLambdaは思ったより簡単に始められました[^6]。

AWS CLIが使える状態でRustとNode.jsとDockerがインストールされている環境であればコマンド一発ですぐに始められます。以下をターミナルから実行するだけで導入完了です。

```bash
$ npx serverless install \
  --url https://github.com/softprops/serverless-aws-rust \
  --name my-new-app \
  && cd my-new-app \
  && npm install --silent
```

次に以下のコマンドでビルドしてAWSにデプロイを行います。

```bash
$ npx serverless deploy
```

デプロイが完了したら早速helloという名前のLambda関数にJSONのデータを渡して呼び出して見ましょう。


```bash
$ npx serverless invoke -f hello -d '{"foo":"bar"}'
```

以下のようにLambda関数から応答が返ってきました。echoプログラムなので渡した引数をそのまま返してくれます。

```json
{
    "foo": "bar"
}
```

参考までにLambda関数の中身を載せておきます。

```rust
use lambda::{handler_fn, Context};
use serde_json::Value;

type Error = Box<dyn std::error::Error + Sync + Send + 'static>;

#[tokio::main]
async fn main() -> Result<(), Error> {
    lambda::run(handler_fn(handler)).await?;
    Ok(())
}

async fn handler(event: Value, _: Context) -> Result<Value, Error> {
    Ok(event) // 受け取ったデータをそのまま返す
}
```


またecho以外にも以下のとおりいくつかのテンプレートがで公開されているので[^7]用途にあったものを選ぶことができます。

- 上記で紹介したEchoアプリのテンプレート https://github.com/softprops/serverless-aws-rust
- HTTPアプリのテンプレート - https://github.com/softprops/serverless-aws-rust-http
- 複数アプリのテンプレート - https://github.com/softprops/serverless-aws-rust-multi
- WebSocketアプリのテンプレート - https://github.com/softprops/serverless-aws-rust--websockets
- Kinesisアプリのテンプレート - https://github.com/softprops/serverless-aws-rust-kinesis

以上が簡単な導入ですが、これ以上は[Serverless Framework](https://www.serverless.com/)の知識も必要になるので、ぜひチャレンジしてみてください。

[^6]: これ以降の手順は次のAWS Rust Runtimeのページで紹介されている手順を踏襲しています。　[awslabs/aws-lambda-rust-runtime: A Rust runtime for AWS Lambda](https://github.com/awslabs/aws-lambda-rust-runtime#serverless-framework)

[^7]: テンプレート一覧は次のserverless-rustのページに掲載されています。　[softprops/serverless-rust: ⚡ 🦀 a serverless framework plugin for rustlang applications](https://github.com/softprops/serverless-rust)


## 其の2 〜RustでAWSサービスの利用ってどうやるの？〜

RustでAWSの各種サービスを利用するには[Rusoto](https://github.com/rusoto/rusoto)を使います。AWS公式のSDKではありませんが、サービスのAPIは **AWS公式のPython SDKであるboto[^8]のAPI定義から作成** されています。そのおかげもあってか現在[160を超えるサービス](https://www.rusoto.org/supported-aws-services.html)がRustから利用可能です。以下はS3からzipファイルをダウンロードしてtmpディレクトリに保存するサンプルコードです。


```rust
use rusoto_s3::{
    GetObjectRequest, S3Client, S3,
};

type Error = Box<dyn std::error::Error + Sync + Send + 'static>;

async fn get_object() -> Result<(), Error> {
  let target_bucket = "test-bucket123";
  let target_key = "result.zip";
  let tmp_dir = Path::new("/tmp/etl");
  let tmp_zip = tmp_dir.join("tmp.zip");

  // S3クライアントの作成
  let s3_cli = S3Client::new("ap-northeast-1".parse().unwrap());

  // リクエストの作成
  let req = GetObjectRequest {
    bucket: target_bucket.to_owned(),
    key: target_key.to_owned(),
    ..Default::default()
  };

  // S3オブジェクトの取得
  let mut res = s3_cli.get_object(req).await?;
  let body = res.body.take().expect("The object has no body");

  // データをS3から/tmp/etl/tmp.zipに非同期で書き出し
  let mut body = body.into_async_read();
  let mut file = File::create(&tmp_zip).await?;
  io::copy(&mut body, &mut file).await?;

  Ok(())
}
```

初見は難しそうに見えますが **Rustの型システムのおかげで型定義を見れば大抵使える** ようになっていて、一度使ってみると他のサービスも大体同じノリで使えるので思った以上に便利です。ぜひ試してみてください。


[^8]: botoとはアマゾンカワイルカから命名されたそうです。

# まとめ

長文を読んで頂きありがとうございました。

Rustはその実行性能の高さ故に今までの低レイヤーの実装で注目を浴びてきましたが[^9]、**Lambdaのような計算資源の使用量に対して課金されるFaaSでは非常に高いコストパフォーマンスが出せて、しかもLambdaの様々な制約下でも多様なタスクに対応できるので** RustとLambdaの組み合わせはもっと注目されてもいいのではと思いこの記事を書きました。

本記事を読んで **「RustでLambdaをやっていく」** となってくれた方が少しでも増えれば嬉しいです。

[^9]: 最近はWebAssemblyにおける活用も活発ですね。どんどんRustの活躍の場が広がっている感じがします。

