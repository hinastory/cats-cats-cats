---
title: Serverless Days Tokyo 2019 に参加してきました
thumbnail: /gallery/thumbnails/serverless-days-tokyo-thumbnail-min.png
toc: true
categories:
  - Tech
  - CloudNative
tags:
  - Serverless
  - AWS
  - Azure
date: 2019-10-27 07:28:45
---
Serverless Days Tokyo 2019に初参加してきました。サーバーレスの息吹を感じられる素晴らしいカンファレンスでした。

{% blogCard https://tokyo.serverlessdays.io/ %}

<!-- more -->
## ServerlessDays Tokyoとは

ServerlessDays Tokyoは、サーバーレス[^1]に関する技術を扱う技術者のためのカンファレンスです。2016年が第一回で今年で4回目ですが、ServerlessDays Tokyoになったのは今年からで去年まではserverlessconf Tokyoという名称で行われていました[^2]。カンファレンスの規模は400名弱であり、1トラック形式です。コーヒーとドーナツがデプロイされており、スポンサーブースを全て回って缶バッジを集めるとイベントTシャツが貰えるなど色々と工夫されたカンファレンスだと感じました。

[^1]: ここで言う「サーバーレス」とは、サーバーレスアーキテクチャを基軸にしたパラダイムを指しています。サーバーレスアーキテクチャはイベントを契機に「関数」を実行するアーキテクチャで、「関数」を実行するためのリソースはインフラストラクチャが自動的に割り当てることを**前提**としています。つまり、「関数」側はインフラ(サーバ)を意識しない設計が可能なので「サーバーレス」という命名となっています。Function as a Service(FaaS)も「サーバーレス」と同じ意味合いで使われています。
[^2]: 変更理由に関しては{% elink こちらのブログ https://yoshidashingo.hatenablog.com/entry/sdays2019 %}に詳細が書いてあったので興味がある方は参考にしてください。

## 会場について

会場はもともと印刷工場だったものを商業施設に転用した「{% elink TABLOID http://www.tabloid-tcd.com/ %}」で行われました。元が印刷工場だけあって独特の味がある建物で「ものづくり」を意識させる工場の造りはエンジニアの魂に訴えかけるものがあり、今回のカンファレンスにはうってつけの会場でした。

{% img /gallery/events/serverless-days-tokyo-2019/serverless-days-tokyo-2019-1.jpg 600 %}

- 日時
  - 10/21(月) ワークショップ、10/22(火・祝) カンファレンス
- 場所
  - {% elink TABLOID http://www.tabloid-tcd.com/ %}
- 参加人数
  - 370名(10/22)

<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3242.1265650784076!2d139.75658121574108!3d35.64925323933166!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x60188bcc42bb35e5%3A0x8ea7e1f945212f14!2z44K_44OW44Ot44Kk44OJ!5e0!3m2!1sja!2sjp!4v1572057613092!5m2!1sja!2sjp" width="600" height="450" frameborder="0" style="border:0;" allowfullscreen=""></iframe>


## 午前のセッション

会場には8:40頃に到着しました。イベント開始の20分前です。参加者用のリストバンドを渡されたのでそれを手首に巻いてセッションが始まるのを静かに待ちました。

{% img /gallery/events/serverless-days-tokyo-2019/serverless-days-tokyo-2019-2.jpg 250 %}
{% img /gallery/events/serverless-days-tokyo-2019/serverless-days-tokyo-2019-3.jpg 250 %}

### 10x Serverless Product Development for a Startup with Microsoft Azure @ Yutaka Tachibana(EBILAB)

一発目のセッションは{% elink ゑびや http://www.ise-ebiya.com/ %}さんのMicrosoft Azureを活用したサーバーレスの事例でした。{% elink ゑびや http://www.ise-ebiya.com/ %}さんはもともとは伊勢の食堂をやっている会社でしたが、社長が変わったのを機にITを経営に取り入れ始めて、たった数年でITソリューションを外販するようになった驚きの企業です。

プロダクトは{% elink TOUCH POINT BI https://ebilab.jp/service/ %}で、実店舗経営のためのBIツールでその開発ノウハウの紹介でした。BIツールに関しては一から作り込むのではなく、MicrosoftのPower BIを利用してBI部分をiframeを利用して埋め込み、メニュー部分をNuxt.jsやLaravelを利用して作り込んでいる点です。これによってBI部分の作成にエンジニアは必要なくなり、実際にゑびやさんではカスタマーサクセスチームが作成を行っているそうです。

また全体的にAzureとサーバーレスを全面活用しているのもポイントだと思いました。特にAzure Functionsの利用においてはPythonをGAになる前から利用しており、必要に応じてFunctionを{% elink ランサーズ https://www.lancers.jp/ %}に外注している話は関心を持ちました。もともと機能の外注は使用のすり合わせでいろいろと面倒な面がありますが、Azure Functionsの制約のもとでの依頼であれば非機能面を含めての仕様の要求、提示がしやすくお互い楽に交渉できそうです。またTOUCH POINT BIはAI活用もAI専門の会社と協力して開発しておりAzure Functionsが役にたったそうです。

結果として本セッションのタイトルにある「10倍の生産性」はAzureとAzure Functionを使って開発全体を疎結合にして、外注できる部分はどんどん外に出して自社のエンジニアは外に出せない経営分析や全体のアーキテクチャに専念することでスピード感のある開発で実現していました。一番印象に残った言葉は**「なるべくエンジニアがボトルネックにならないように」**であり、まさしくサーバーレスの開発に必要な考え方だと思いました。

### Keynote @ Keisuke Nishitani (AWS)

2番目のセッションはAWSさんでした。発表内容はAWSのLambdaの歴史とLambdaのネットワーキングについてとモダンアプリケーションの開発についてでした。Lambdaの歴史に関しては、LambdaはもともとはEvent Drivenなアーキテクチャを実現するためのサービスとして発表されたそうです。今はすっかりサーバーレスの代名詞となったLambdaもRe:Inventを重ねるごとにパワーアップしているのが分かって面白かったです。

Lambdaのネットワーキングについては、LambdaはAWSサービスチームのVPCで稼働しており、ユーザのVPCにつなぐ際には課題があるという内容でした。具体的にはユーザのVPCにつなぐ際にENI(Elastic Netowrk Interface)の作成に時間がかかり、またENIというリソース消費も問題になるという内容でした。しかし、この問題は「AWS Hyperplane」を用いてつい最近大幅に改善されたそうです[^3]。

モダンアプリケーションに関しては、イベントドリブンな開発手法でメッセージングを通してステートを取り除くことが重要だという話には納得しました。パワーワードとして**「all you need is code」**、**「全てはサーバーレスになる」**が印象に残りました。

[^3]: {% elink この記事 https://aws.amazon.com/jp/blogs/news/announcing-improved-vpc-networking-for-aws-lambda-functions/ %}の内容のことを話されていました。


### グローバル展開のコネクティッドカーを支える大規模サーバーレスシステム事例 @ Yuya Urayama (TOYOTA), Takanori Suzuki (Acroquest Technology) and Eiichiro Uchiumi (AWS)

本イベントで一番気になっていたTOYOTAさんのセッションです。TOYOTAと言えばカイゼンが文化なのである意味サーバーレスの選択には納得しました。サーバーレスは無駄を低減し、無駄をマネージドする手法としては非常に合理的だからです。事例に関しては「コネクティッドカー」がテーマで、車、ドライバー、保険事業者、環境庁をIoTで結ぶものです。

ただこのプロジェクトが初めてのアジャイル、初めてのサーバーレスで若手主体で行われたというのは驚きました。そしてAWSが直接サポートというのも驚愕で、こういうユーザとクラウドベンダーが組んで、ITベンダーが「中抜き」される案件が今後も増えてくることを予想される案件でした。

面白かったのはアーキテクチャスタイルの解説とテスト関連です。アーキテクチャスタイルに関しては、「Nティアー」と「ウェブキュー・ワーカー/イベント・ドリブン」、「マイクロサービス」の３パターンが主にあり、トヨタはいずれも使っているとのことでした。また、サービスやリクエストの性質に合わせてリアクティブなスケーリング(Lambda)とプロアクティブなスケーリングを組み合わせて使うのも面白いと思いました。基本的にはリアクティブなスケーリングを使い、それでは要件を満たせない場合にプロアクティブなスケーリングを検討します。プロアクティブなスケーリングでは事前にリクエストが大量に来ると分かった時点でコンテナを大量に立ててあらかじめスケールしておく等の手法をとります。

サーバーレスのテストのしずらさにも言及があり、{% elink LocalStack https://github.com/localstack/localstack %}を使ってモックの作成を行ったり、{% elink Karate https://github.com/intuit/karate %}で連携テストを行っていると言う話が印象に残りました。サーバーレスは非同期な処理が多いので連携テストは難しいと感じていましたがきちんとツールを使って連携テストを実施している事例は非常に参考になりました。

### 昼食の様子

昼食の場所は同会場のカフェでビュッフェ形式で提供され、イベントに来られていた同じ会社の方とご一緒しました。下の写真のように洒落たカフェのような雰囲気で美味しく頂きました。

{% img /gallery/events/serverless-days-tokyo-2019/serverless-days-tokyo-2019-4.jpg 600 %}


## 午後のセッション

自分の場合昼食をとった後は強烈な眠気に襲われるので、ある意味ここからが本番です・・・

### All You Need Is JavaScript @ Jensen Hussey / Cloudflare

CDN(コンテンツデリバリーネットワーク)の事業者の{% elink Cloudflare https://www.cloudflare.com/ja-jp/ %}さんの発表です。CDNと言えばAkamaiとAmazon CloudFlontしか知らなかったので、Cloudflareの発表には非常に興味がありました。発表内容に関しては、独自FaaSのCloudflare Workersについてでした。

Cloudflare Workersの特徴的なところは、FaaSの利用言語をJavaScript固定にしているところです。Lambmda等の他のFaaSではコンテナベースで複数の言語をさぽーとしているところが多かったので以外でした。もちろんJavaScriptに固定しているのには十分な理由があって、JavaScriptは世界で最も使われており、JavaScriptのVMであるChrome V8は性能がよく、多くのテストがされ、WebAssemblyをサポートしているからとのことでした。あとコンテナと比較しての一番の利点はコールドスタートが非常に速いということです。具体的にはWorkersの実装はV8のIsolateインスタンスになっていて、数値は忘れてしまいましたが「コールドスタート」というより「ホットスタンバイ」といっても過言でないほどの速さでした。

### Zero Scale Abstraction in Knative Serving @ Tsubasa Nagasawa (CyberAgent)

CyberAgentさんの発表は「ゼロスケール」をKnativeで以下に実現しているかでした。KnativeはFaaSやPaaSをKubernetes上で実現するためのOSSですが、「ゼロスケール」という言葉は耳慣れないかもしれません。

{% oembed https://speakerdeck.com/toversus/zero-scale-abstraction-in-knative-serving %}
　
ゼロスケールは例えばコンテナで言うと最初はコンテナ数が0から始まり、要求が来ると自動的にスケールアウトしてコンテナ数を増やし、要求が少なくなると自動的にコンテナ数を0まで減らす仕組みです。概念としては単純ですが実装するとなると大変です。基本的にはイベントをキューでためておいて、ローリングアップデート時のルーティングを工夫してスケーリングを実現しているようでした。

Knativeを使うと複雑なYamlを書かなくても簡単にサーバーレスアプリケーションが書けそうなので試してみたいと思いました。

### 空調設備向けIoTシステムにおけるクラウドランニングコスト @ 野原 健太 / ダイキン工業株式会社

ダイキンの事例はIoTをサーバーレスで行う事例でした。もともとIoTは需要が読めないのでサーバーレスと相性が良いというのは納得です。このセッションで面白かったのはサーバーレスのランニングコストに言及していた点です。

{% oembed https://speakerdeck.com/nohara/kong-diao-she-bei-xiang-keiotsisutemuniokerukuraudoranningukosuto %}
　
一般的にはサーバーレスは従量課金がメインなのでコスト最適化の余地は少ないのですが、DynamoDBのコスト最適化という視点は今まであまりなかったので斬新でした。具体的にはDynamoDBはWCU(書き込みキャパシティ単位)の料金が高いので、必要な分だけ個別書き込みできるようにすることと、必要な情報を一括で読み込めるようにキーを工夫する必要があるという内容でした。

余談としてEC2インスタンスを停止し忘れと、ログの出しすぎでCloudWatch Logsの料金が跳ね上がったという、いわゆるクラウド破産に気をつけようという話もされました。

### ISPがサーバレスに手を出した @ 伊藤良哉 & 松田丈司 (NTTコミュニケーションズ)

NTTコミュニケーションズさんの話は少し特殊な部類でISP(インターネットサービスプロバイダー)がサーバーレスに取り組んだお話でした。

{% oembed https://speakerdeck.com/georgeorge/isp-challenges-serverless %}
　
面白いのはNTTコミュニケーションズはパブリッククラウドの「Cloudn」や企業向けの「Enterprise Cloud」をすでに持っているのにAWSを使うという点です。曰く「自社クラウドがあるとAWSが使いづらい」そうで、なんと今回のプロジェクトが初AWSで与信審査まで経験できたそうです(笑)。

技術的にはISPらしくIPv6に取り組んだ話とか、信頼性を担保するためにマルチクラウド（AWSとAzure）にした話とかいろいろと興味深い話が聞けました。肝心のサーバーレスに関しては{% elink serverless framework powered https://serverless.com/ %}を利用しており、テストにはScala製の{% elink Gatling https://gatling.io/ %}を使っているとのことでした。Gatlingは自分も愛用しており非常に簡単にテストが書けてレポートも充実しているのでオススメです。

### ドーナツのデプロイの様子

会場にはコーヒーとドーナツが大量にデプロイされており、美味しくいただきました。 :smile:

<blockquote class="twitter-tweet"><p lang="ja" dir="ltr">😋😋😋😋😋😋😋<br>ド ー ナ ッ ツ<br>再 デ プ ロ イ の<br>お 知 ら せ 🍩<br>😋😋😋😋😋🎃😋<a href="https://twitter.com/hashtag/serverlessdays?src=hash&amp;ref_src=twsrc%5Etfw">#serverlessdays</a><a href="https://twitter.com/hashtag/serverlessdtokyo?src=hash&amp;ref_src=twsrc%5Etfw">#serverlessdtokyo</a> <a href="https://t.co/ZGz1QHr2Zq">pic.twitter.com/ZGz1QHr2Zq</a></p>&mdash; Serverless(JP) (@serverlessjp) <a href="https://twitter.com/serverlessjp/status/1186513565890408449?ref_src=twsrc%5Etfw">October 22, 2019</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

### AWS Lake Formation で実現、マイクロサービスのサーバーレスな分散トレーシング @ 江藤武司 & 岩井良和 (Sony Corporation)

Sonyさんの発表は分散トレーシングの話でした。AWSで分散トレーシングといえば{% elink AWS X-Ray https://aws.amazon.com/jp/xray/ %}ですが、X-Rayは非同期のトレーシングには向いておらず、ログの長期保存や複数アカウントのログ収集といった課題もあったのでそれをいかに解決したかという話でした。

具体的には{% elink AWS Lake Formation https://aws.amazon.com/jp/lake-formation/ %}を利用したという話です。データレイクの概念は知っていましたが、AWS Lake Formationは使ったことがなかったので興味深い内容でした。面白かったのは非同期のトランザクションが多い中でどうやってトレースIDを伝播させるかという内容でした。具体的にはサービスごとに異なり、例えばAPI GatewayｈではCustom HTTP Headerを用い、SNS/SQSではmessage attributeを使うといった具合です。さすがのSonyで最新のサービスと難しい課題に正面から取り組んだ素晴らしい内容でした。

### Don’t think Serverless Security, think Application Security @ Ido Neeman (Nuweba)

- {% elink PDF https://www.nuweba.com/ebooks/Nuweba-Whitepaper-Dont-think-serverless-security-think-application-secuirty.pdf %}

Nuwebaさんの発表はサーバーレスのセキュリティについてです。サーバーレスというとセキュリティに漠然とした不安を抱える人も多いけど、基本的には関数は短期間しか実行されないし、異常を見つけやすく制限を適用しやすいので安全というものでした。

確かにサーバーレスは個人で管理する部分が少なく、サーバーの管理自体をクラウド事業者にオフロードしているので普通のサーバー運用が必要なアプリケーションと比較した場合にセキュリティ的に安全というのも分かります。なのでサーバーレス固有のセキュリティ問題は特にないから、アプリケーションのセキュリティに集中しようというのが本セッションの趣旨でした。

### Azure でサーバーレス、 Infrastructure as Code どうしてますか？ @ Kazumi Ohira

大平さんの発表はAzureでInfrastructure as Code(IaC)をどのように行うかといった内容でした。IaCはインフラのリソース構成の構成・管理をコードで行うことです。このことによりインフラの自動化やバージョン管理やレビューのしやすさが向上したりなど様々なメリットがあります。

{% oembed https://www.slideshare.net/dzeyelid/iac-on-azure-for-serverless %}
　
基本的な内容はAzureなのでARM Templateでした。ARM(Azure Resource Manager)は冪等性の管理や、リソースの差分デプロイ、並列デプロイができて非常に使い勝手が良さそうです。また日本語ドキュメントが充実しておりVisual Studio Codeの拡張機能が便利なので実用的です。ただ「すでにお使いなら、断然Terraform」だそうです(笑)。しかし、ここは個人的には[Pulumi](https://hinastory.github.io/cats-cats-cats/2019/08/26/infrastructure-as-code-in-pulumi/)を押しておきたい・・・

### The hidden cost and technical debt of running huge Serverless service on production @ James Nguyen / MaaS Global

このセッションは大規模なサーバーレスのシステムにおける隠れたコストと技術的負債の話でした。まずクラウドだから障害が起こらないというのは間違いで、AWSでも何回も障害が起きているので障害への備えは当然必要になるということです。また技術的負債の話でいくと、クラウドだと最新のOSSが利用できるまで待たされるかもしれないという話とサービスの進化に追従しなければ行けないという点から技術的負債が生まれるという話も興味深かったです。

## スポンサーセッション & Lightning Talk

ここからは気になったスポンサーセッションとLightningTarkの内容になります

### Oracle も Serverless サービスやっています @ Sugiyama Suguru (スポンサーセッション)

OracleさんのスポンサーセッションはOracleのFaaSであるOracle Fanctionsの内容でした。

{% oembed https://www.slideshare.net/SuguruSugiyama/oracle-serverless %}

Oracle Fanctionsは、OracleがOSSとして公開している[Fn Project](https://github.com/fnproject)というOSSベースがベースでオンプレでもクラウドでも動くそうです。実装はコンテナベースで関数の公開はDockerイメージをアップロードして行います。

### 「サーバーレス」な同人誌の紹介 @ めもおきば(nekoruri) (Lightning Talk)

Lightning Talkで一番気になったのは、めもおきば(nekoruri)さんの、マニアックな同人誌紹介です。個人的には**「SERVERLESSを支える技術」**を含め以前に何冊か購入させて頂いたので、間違いなく紹介される本は良本だと確信が持てました。

{% oembed https://www.slideshare.net/nekoruri/20191022-serverless-books %}

- [「サーバーレス」な同人誌を #ServerlessDays で紹介しました - めもおきば](https://d.nekoruri.jp/entry/2019/10/22/serverlessdays)

とりあえず、すでに何冊か持っている本もありましたが、気になる本もたくさんあったので後で購入を検討しようと思います。

- 持っている本
  - Knativeソースコードリーディング入門
  - 雰囲気でOAuth2.0を使っているエンジニアがOAuth2.0を整理して、理解できる本
  - Pragmatic Terraform on AWS
- 欲しい本
  - Goで学ぶGoogleCloud Functionsの使い方
  - ゼロから始めるNetlify
  - OAuth、OAuth認証、OpenID Connectの違いを整理して、理解できる本
  - Microservices architecture よろず本 その三（初版は持っていたが３まで出ていたのか・・・）
  - NATSによるPub/Subメッセージング入門

### 目つぶり検証作成期 @ Kana Kitagawa (Lightning Talk)

大学4年生で写真専門の方の発表です。プログラミングの初心者がServerless FrameworkとAmazon Recognitionを使って目つぶり検証を行ったという内容です。普通にすごいというかこういうことにチャレンジできるいい時代になったなと思いました。あと、まとめで**「公式ドキュメントが読むこと」**という内容があったので、この学びは素晴らしいと思いました。ブログや記事は興味を持つきっかけにはいいですが、手を動かす際に参照するのは圧倒的に**公式ドキュメントが正義**です。

### SERVERLELESSなエンジニアのためのSERVERLESSなオンラインサロンをVUE/NUXT/COGNITO/STRIPEで作った話 @藤本竜之介 (Lightning Talk)

オンラインサービスをSERVERLELESSで立ち上げた話でした。だいたい知っている技術でしたが、STRIPEだけ唯一知りませんでした。STRIPEは[インターネットビジネスのためのオンライン決済処理](https://stripe.com/jp)だそうです。

## 懇親会の様子

懇親会も大分盛り上がりました。料理もとても美味しかったです。

<blockquote class="twitter-tweet"><p lang="und" dir="ltr">🍻🍻🍻<a href="https://twitter.com/hashtag/serverlessdays?src=hash&amp;ref_src=twsrc%5Etfw">#serverlessdays</a><a href="https://twitter.com/hashtag/serverlesstokyo?src=hash&amp;ref_src=twsrc%5Etfw">#serverlesstokyo</a> <a href="https://t.co/a9FNYnq7pP">pic.twitter.com/a9FNYnq7pP</a></p>&mdash; Serverless(JP) (@serverlessjp) <a href="https://twitter.com/serverlessjp/status/1186585831756062722?ref_src=twsrc%5Etfw">October 22, 2019</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

## まとめ

今回ServerlessDays Tokyoは初参加でしたが、Serverlessの息吹を感じられ学びしかない一日でした。またサーバーレスはよりクラウドを使いやすくし、ユーザとクラウド事業者を直接結びつける効果もあり、今後ITベンダーはうかうかしていられないということも感じました。**「全てがサーバーレスになる」**、この言葉を胸にに今後のことを考えて行きたいと思います。次回は12/14に{% elink 福岡 https://fukuoka.serverlessdays.io/ %}でやるそうなので、興味がある方はオススメです！

関係者、参加者の皆様、本当にお疲れさまでした。本記事がサーバーレスに興味がある方の一助になれば幸いです。

<blockquote class="twitter-tweet"><p lang="ja" dir="ltr"><a href="https://twitter.com/hashtag/ServerlessDays?src=hash&amp;ref_src=twsrc%5Etfw">#ServerlessDays</a> <a href="https://twitter.com/hashtag/serverlesstokyo?src=hash&amp;ref_src=twsrc%5Etfw">#serverlesstokyo</a> おつかれさまでした！ <a href="https://t.co/rxmlKB3sAM">pic.twitter.com/rxmlKB3sAM</a></p>&mdash; 真吾 / Shingo (@yoshidashingo) <a href="https://twitter.com/yoshidashingo/status/1186749432185815040?ref_src=twsrc%5Etfw">October 22, 2019</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

## おまけ

入手したものです。目玉はスポンサーブースを全て回って缶バッジを手に入れると貰えるイベントTシャツ(黄色の方)です。

{% img /gallery/events/serverless-days-tokyo-2019/serverless-days-tokyo-2019-5.jpg 600 %}


## 参考文献

- {% elink ServerlessDays Tokyo 2019 https://tokyo.serverlessdays.io/ %}
- {% elink ServerlessDays Tokyo / Fukuoka 2019 を開催します - yoshidashingo https://yoshidashingo.hatenablog.com/entry/sdays2019 %}
- {% elink ServerlessDays Tokyo 2019を開催しました - yoshidashingo https://yoshidashingo.hatenablog.com/entry/2019/10/26/191417 %}
- {% elink ServerlessDays Tokyoを終えて振り返りというか単なる感想です。 | 技術的な何か。 https://level69.net/archives/26677 %}
- [ServerlessDays Tokyo 2019 - Togetter](https://togetter.com/li/1420455)
- {% elink [発表] Lambda 関数が VPC 環境で改善されます | Amazon Web Services ブログ https://aws.amazon.com/jp/blogs/news/announcing-improved-vpc-networking-for-aws-lambda-functions/ %}
- {% elink Serverless Days Tokyo 2019 トヨタ自動車・ダイキン工業 事例覚書 - Qiita https://qiita.com/hiroeorz@github/items/c91851b23750d01a60a4 %}