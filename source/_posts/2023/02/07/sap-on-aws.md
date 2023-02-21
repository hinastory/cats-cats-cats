---
title: 新しいAWS認定「SAP on AWS - 専門知識」は異質だが役に立つという話 〜合格体験談〜
thumbnail: /gallery/daily/cloud/aws/sap-on-aws.png
toc: true
categories:
  - Tech
  - CloudNative
tags:
  - AWS
date: 2023-02-07 07:28:45
---

2022年の4月に新しいAWS認定「SAP on AWS - 専門知識」が登場しました。これまではリタイアした認定を除けば11種類のAWS認定が受験可能でしたが、それに加えてぱっと見良く分からない謎の資格[^1]が12個目として加わった訳です。

AWS認定のSAPといえば、Solutions Architect - Professional試験、通称「SAP」のことですが、「SAP on AWS」の「SAP」はSAP社が提供するビジネス向けソフトウェアのことで、基幹システムに導入される代表的なパッケージ製品です。

本記事ではこの「SAP」の謎に迫りつつ、合格体験談を語りたいと思います。AWS認定を持っていない人やSAPを触ったことがない人にも読んで頂けるように配慮したので少しでも興味が湧いた方はぜひお読み下さい。

[^1]: SAPの認知度がそこまで高くないということを揶揄しただけです。SAP Loveの方の気分を害してしまったら申し訳ございません。認知度は別としてSAPが社会を支えている**偉大なソフトウェア**であることに疑問の余地はありません。

<!-- more -->

## はじめに

最初にお断りしておきますが、{% elink AWS 認定プログラムアグリーメント https://aws.amazon.com/jp/certification/certification-agreement/ %}の規約により、認定試験を含む試験関連資料の内容については他言してはいけないことになっているので、その辺はAWSが公開している情報に準拠します。そして試験やAWS自体も今後変わっていくと思われるので、実際に受ける際には最新の情報を確認するようお願いします。

また、本記事は筆者の体験談になります。筆者のプロフィールは以下のとおりです。

* **AWS認定12冠**
* SAPは10年以上昔に評価で少し触った程度
* AWS歴は本格的に触りだしてから5年程度

上記のとおり私はAWSの初心者ではないので **「AWS素人がXX週間で合格してみた」** のノリの記事ではありませんが、なるべくSAPやAWSを詳しく知らなくても全容が分かるように配慮して書いたつもりです。SAP on AWSを受ける予定はないけどSAPやAWS認定に興味がある方は試験対策の章だけ飛ばして読んでいただいても構いません。**記事タイトルの意味は「まとめ」に書いた**ので結論を急ぐ方はそちらへどうぞ。

## SAPとは

SAP[^2]はドイツに本社を置く世界最大のERPソフトウェア企業です。ERPとは、**Enterprise Resource Planning**の略で、企業内の資源（人的資源、製品、財務資源など）を効率的に統合管理するためのシステムのことを指します。SAPは、企業の財務管理、人事管理、物流管理、顧客管理など、多岐に渡るビジネスプロセスにおいて活用することができます。

{% img /gallery/daily/cloud/aws/SAP.png %}

もともとSAPといえばR/3とABAP[^3]の印象が強かったですが、時代は代わりS/4 **HANA**全盛期になってレトロなSAP GUIから**Fiori**[^4]に置き換わろうとしています。私がSAPを仕事で少し触る機会があった10数年前の世界とは様変わりしていることに驚きました。

|登場年|製品名|アーキテクチャ|データベース|特徴|
|---|---|---|---|---|
|1972|R/1|メインフレーム|DBMS|会計システム。通貨の違いを柔軟に吸収|
|1979|R/2|メインフレーム|RDBMS|ABAP登場によりアドオン開発が容易に|
|1992|R/3|オープンシステム|RDBMS|ERPパッケージのスタンダードの地位を確立|
|2015|S/4HANA|オープンシステム|HANA|インメモリデータベースのHANAを中核に高速化を実現|

またSuccessFactors(人材管理), Concur(経費精算), Ariba(購買)などのクラウドベースのサービスも増えていました。これらはこれらはもともとSAPにはなかったアセットですが、企業買収によってSAPソリューションに取り込まれたサービス群になります。SAP on AWSもそうですがERPのリーディングカンパニーもクラウドが主戦場になったことに時代の流れの速さを感じています。

[^2]: SAPはドイツ語のSystemanalyse und Programmentwicklungの省略形で、意味は **「システム分析とプログラム開発」** になります。1972年の設立時は省略しない社名でしたが、1976年に社名をSAPに変更しています。
[^3]: R/3はSAP社のERPパッケージ製品名で、UNIXやWindows上で動作するクライアント/サーバ型のソフトウェアです。R/3はモジュール化されていて、財務会計、販売管理、人事管理、購買・在庫、生産管理等の企業の様々な基幹業務を支える製品になっています。ABAP（Advanced Business Application Programming）はR/3を拡張するためのSAP社の独自言語です。
[^4]: Fioriは **「フィオーリ」** と読みます。一般的には押し出し式パスタの装飾形の一つで、イタリア語の **「花」** に由来します。SAPにはインメモリデータベースのHANAもあるので何か「花」に思い入れがあるのかも知れません。

## SAP on AWSとは

「SAP on AWS」はAWS上で動作するSAP製品のことです。新規でAWS上に構築する場合もありますが、現在は既存のオンプレミスで動作するSAP製品をAWS上に移行(マイグレーション)がビジネス上の課題になることが多いです。クラウドへ移行には{% elink 6つの戦略  https://aws.amazon.com/jp/blogs/enterprise-strategy/6-strategies-for-migrating-applications-to-the-cloud/ %}がよく知られており、SAP on AWSでも重要な考え方です。

|"R" 移行戦略|方法論|
|---|---|
|リホスト|アプリケーションをそのまま移行|
|リプラットフォーム|アプリケーションを変更して移行|
|再購入|クラウド上の別のソリューションへ移行|
|引退|アプリケーションの利用を止める|
|維持|アプリケーションをオンプレでそのまま利用継続|

「SAP on AWS」ではこの移行の課題を中心にSAPパッケージ製品をAWSに扱う上での様々な課題があります。そこでそれらの課題の解決のための一連のソリューションが必要になり、AWS認定に新しく登場した「SAP on AWS - 専門知識」ではそこが問われることになります。

もちろんこれらのソリューションはアドホックに組み立てられる訳ではなく、AWSのベストプラクティスである{% elink 「AWS Well-Architected」 https://aws.amazon.com/jp/architecture/well-architected/ %}に沿った自然な選択が重要視されることはいうまでもありません。以下のアーキテクチャ図はSAPシステムの一般的な構成ですが、AWSでもよく見る3層アーキテクチャに近い構成になっているのが分かると思います[^5]。

{% img /gallery/daily/cloud/aws/sap-overview-all-on-aws.png %}
***[General SAPガイドより](https://docs.aws.amazon.com/sap/latest/general/overview-sap-planning.html)***

従って「SAP on AWS」とはSAPという歴史あるアーキテクチャをいかにAWSというクラウドにベストな方法で適用するかという **「実践的な課題」** と捉え直すことができます。この「実践的」という部分が他のAWS認定と異なる際立った特徴であり、新たに認定に仲間入りした理由の一つだと個人的に推察しています。

[^5]: 厳密に言えば下の図はWeb3層アーキテクチャではありませんが、近い構成に変更は可能だと思っています。

## AWS認定　SAP on AWS - 専門知識とは

2022年4月に新しく登場した{% elink AWS認定 SAP on AWS - 専門知識 https://aws.amazon.com/jp/certification/certified-sap-on-aws-specialty/ %}は、AWS認定の中でも際立った特徴を持っています。それは「SAP」というAWSから見てサードパーティのソフトウェアを主軸とした認定だからです。

この認定は現在12個あるAWS認定試験の内の専門知識に当たる試験です。以下の図では赤枠で強調しました。SAP on AWSだけが **「異質」** であることがこの図からも見て取れると思います。

{% img /gallery/daily/cloud/aws/aws-cert-new.png %}
***[AWS 認定より](https://aws.amazon.com/jp/certification/)***


この試験は「5 年以上の SAP 経験」と「1 年以上の SAP on AWS での作業経験」を満たすことが推奨されていますが、無くても問題なく受験可能です[^6]。とはいえ **「専門知識」** の資格なのでAWSの知識無しでは歯が立たないと思っておいた方が良いです。少なくともソリューションアーキテクト - アソシエイトぐらいは取得して望むべきでしょう。

SAP on AWSの試験の概要は以下のとおりです。

|項目|内容|
|---|---|
|試験時間|170分|
|料金|300USD|
|問題数|65問|
|回答形式|多肢選択方式(単一回答or複数回答)|
|受験場所|テストセンターor自宅|

170分という長丁場の試験で300USD[^7]というなかなかなお値段の試験です。難易度的には専門知識の中ではトップクラスでAWS認定全体でも5本の指に入るほど厳し目の設定になっています(個人の感想です)。

受験場所は自宅かテストセンターを選択できます。自宅の場合はカメラで監視付きが条件でシステムトラブルも多いので注意が必要です。今回のように長丁場のテストではテストセンターでの受験が無難です。私も休日でも空いていた西新宿テストセンターで受験しました。

### 認定試験のサンプル問題を味見してみる

それでは実際に試験問題のサンプルを見てみます。以下の問題を約2分半で回答する必要があります。

{% blockquote AWS認定より https://d1.awsstatic.com/ja_JP/training-and-certification/docs-sap-on-aws-specialty/SAP-on-AWS-Specialty_Sample-Questions.pdf (PAS-C01) 試験問題サンプル %}
ある企業は、SAP HANA on AWS のデータ保護に backint を使用するサードパーティーのバックアップツールを使用しています。専用のバックアップサーバーを維持するためにコストも労力もかかることから、同社は AWS Backint Agent for SAP HANA の使用を検討しています。SAP HANA システムは、SAP HANA データボリュームとログボリュームに汎用 SSD (gp2) AmazonElastic Block Store (Amazon EBS) ボリュームを使用します。バックアップファイルは Amazon S3バケットに保存されます。SAP ソリューションアーキテクトは、この新しい環境の概念実証に向けたデプロイをセットアップしており、データベースのバックアップおよび復元手順の速度を向上させる必要があります。これらの要件を満たすソリューションはどれですか。 (2 つ選択してください)

**A)** S3 バケットのサイズを増やす。S3 バケットへのアクセスが、同じ AWS リージョンの AmazonEC2 インスタンスから取得されていることを確認する。
**B)** parallel_data_backup_backint_channels SAP HANA パラメータの値を引き上げて、並列バックアップチャネルの数を調整する。
**C)** S3 Transfer Acceleration を使用して、バックアップファイルの転送を設定する。
**D)** SAP HANA EBS データボリューム (/hana/data) で使用できるストレージスループットの量を確認する。SAP HANA EBS データボリュームをプロビジョンド IOPS SSD ボリュームタイプに変更し、バックアップを再試行する。
**E)** バックアップファイルの重複排除を有効にする。
{% endblockquote %}

この問題はAWSの知識さえあれば**瞬殺できる問題**です。消去法で考えるとあの２つの選択肢しか残りません。このように全ての問題でSAPの知識が不要というわけではありませんが、AWS上級者であれば初見でも結構戦える印象です。

逆を言えば、ぱっと見でこの問題が分からないのであればSAP以前に**AWSの実力が足りていない**ので、専門知識以外の認定がまだ未取得であればそちらを優先したほうが良いと思われます。

[^6]: そもそもSAPシステムに触れるエンジニア自体が限られているので、この条件を満たすエンジニアは他の資格と比べても圧倒的に少ないでしょう。
[^7]: 認定のページには300USDと書いてありますが、実際に請求されるのは30,000円+消費税3,000円の33,000円になります。円安になっても試験価格が変わらないのは喜ばしいですね。ちなみに{% elink バウチャーチケット購入センター https://voucherticket.jp/ %}で購入すると31,350円になります。私は以前の合格特典の半額のバウチャーを持っていたので実際に払ったのは15,000円+消費税1,500円で16,500円になります。

## 試験結果

ここからどういう学習をして合格したのかを語っていこうと思いますが、何はともあれ試験結果をお見せしないと説得力に欠けますので、**エア受験**でないことの証拠をお見せいたします[^8]。

{% img /gallery/daily/cloud/aws/sap-on-aws-result1.png %}
{% img /gallery/daily/cloud/aws/sap-on-aws-result2.png %}

試験準備は1月18日〜2月4日の2週間強でした。学習時間は30〜40hだと思います。何とか合格点は取れましたが、見込みよりは低かったので現実を思い知らされました。これからも気を抜かずにAWSの実力向上に力を入れたい所存です。

[^8]: 見せるといいつつ大事な所はプライバシーの関係上黒塗りにさせて頂いたので、 **「信じてください」** というお願いです(笑)。

## 試験対策

SAP on AWSの試験対策は以下の順で行うのが良いと感じました。

1. 試験ガイドで試験内容を把握
    * {% elink AWS Certified: SAP on AWS - Specialty
(PAS-C01) 試験ガイド https://d1.awsstatic.com/ja_JP/training-and-certification/docs-sap-on-aws-specialty/SAP-on-AWS-Specialty_Exam-Guide.pdf %}
2. サンプル問題で問題に慣れる
    * {% elink  AWS Certified: SAP on AWS - Specialty
(PAS-C01) 試験問題サンプル https://d1.awsstatic.com/ja_JP/training-and-certification/docs-sap-on-aws-specialty/SAP-on-AWS-Specialty_Sample-Questions.pdf %}
    * ブログでサンプル問題の解説を出している方がいるので合わせてみると効果的です
        * {% elink AWS Certified: SAP on AWS – Specialty のサンプル問題を解いてみた(1/4) – TechHarmony https://blog.usize-tech.com/aws-certified-sap-on-aws-specialty-01/ %}
3. Skill BuilderでSAP on AWSの基礎学習
    * {% elink SAP on AWS (Technical) (Japanese) (日本語字幕版) https://explore.skillbuilder.aws/learn/course/12528/ %}
    * AWSパートナーネットワーク（APN）のアカウントをお持ちの方はSkill Builderでより多くのSAP on AWSのコンテンツを利用できます
      * AWS Partner: SAP on AWS (Business) (Japanese/日本語)
      * AWS PartnerCast-SAP on AWS Specialty Certification Journey -Session 1～9 (英語) (PDF資料ダウンロード可) (模擬問題あり)
4. SAP on AWSの構築手順の確認
    * {% elink SAP on AWS - Immersion Day https://catalog.us-east-1.prod.workshops.aws/workshops/754ba343-2704-404a-8abe-be7b21c4d9d5/ja-JP %}
        * 実際のSAP on AWSの構築手順を学ぶことができます。本当に構築するにはSAPのインストールメディアが必要ですが、手順だけでも見ておくとSAP on AWSの構成が頭に入るようになるのでおすすめです
5. 模擬試験を受けてみる
    * {% elink AWS Certified: SAP on AWS - Specialty Official Practice Question Set (PAS-C01 - Japanese) https://explore.skillbuilder.aws/learn/course/12875/ %}
        * 基礎をやったらまず模擬試験を受けてみることがおすすめです。それは模擬試験を受けてみないと何が足りないかが感覚的に分からないからです
6. SAP on AWSの公式ドキュメント、ブログを読む
    * {% elink SAP on AWS 技術文書 https://aws.amazon.com/jp/sap/docs/ %}
        * 翻訳にかけて一通り読んでおくことをおすすめします。特にトラブルシューティングは試験に出やすいので見落とさないようにしましょう
    * {% elink SAP on AWS | Amazon Web Services ブログ https://aws.amazon.com/jp/blogs/news/category/sap/ %}
        * このブログも一通り目を通しておくことをおすすめします。といっても分量が多いのでタイトルとまとめを読んで、重要そうなものから読む戦略もありです
    * {% elink AWS | SAP のよくある質問 https://aws.amazon.com/jp/sap/faq/ %}
        * SAP on AWSで何が問われるのかの判断材料になるのでざっと目を通しておく必要があります
7. その他の学習リソース
    * 公式ではないですが優秀なSAP on AWSの学習リソースだと個人的に思ったものを紹介します
        * {% elink AWS 認定 SAP on AWS - 専門知識(AWS Certified: SAP on AWS - Specialty)の学習方法 - NRIネットコムBlog https://tech.nri-net.com/entry/aws_certified_sap_on_aws_specialty %}
        * {% elink AWS SAP on AWS Speciality 受験対策その1「学習リソース」 – TechHarmony https://blog.usize-tech.com/aws-sap-on-aws-speciality-study1/ %}
        * {% elink 【AWS認定資格】SAP on AWS Specialty（PAS-C01）試験問題対策 - YouTube https://www.youtube.com/playlist?list=PLrbutKlth8WG7Fp7AOP_LGHIjRuWnRBI1 %}
8. 先達の合格体験談を読む
    * 合格体験記は学習後半で読むと効果的です。というのも1回目は落ちたか合格したとしてもギリギリのようなので、学習が進まないときのカンフル剤として有効です（笑）
    * {% elink AWS SAP on AWS(PAS)合格記(2022/05/24投稿) - Qiita https://qiita.com/handy-dd18/items/18e8a856906f97bbb964 %}
    * {% elink AWS Certified: SAP on AWS - Specialty 試験に合格しました！ - サーバーワークスエンジニアブログ https://blog.serverworks.co.jp/sap-on-aws-specialty-passed-2 %}
    * [「sap on aws」の検索結果 - Qiita](https://qiita.com/search?q=sap+on+aws)

以下は試験のキーワードです(順不同)。一つでも分からない用語やサービスがあれば危険信号なので確認しておくことをオススメします。

{% blockquote %}
Snowball、backint、Oracle XTTS DataGuard、IAMロール、最小インスタンス数、ハイメモリインスタンスタイプ、Config、VPC、SAP Router、DMS/SMS/Endure/MGN、CloudFront、Global Accelerator、SWPM(DMO)、Control Tower、ストレージ(EBS/EFS/FSx/S3)、IMDS、パッシブDR、パイロットライト、ウォームスタンバイDR、プレイスメントグループ、ピークメモリ、Storage Gateway(S3 File Gateway, FSx File Gateway, Volume Gateway)、anyDBからHANAの移行、オーバーレイIP(Transit Gateway、NLB)、データ階層化、SAPラインセンス(ハードウェアキー)、Launch Wizard for SAP、専有ホスト、Data Provider for SAP、SAP Fiori、SAP HANA、logreplay、delta_datashipping、SAP EarlyWatchAlert、HANA Studio, SAP Web Dispatcher, SAP NetWeaver, Secure Network Communications(SNC), PAS/AAS/ASCS/ERS, SAP Solution Manager, BOBI
{% endblockquote %}

学習方法のポイントは **「6. SAP on AWSの公式ドキュメント、ブログを読む」** になります。合格ラインを超えるにはここのドキュメントの理解度が一番効いてくるのでしっかりと読み込みましょう。

## まとめ

2022年4月に新しく登場したAWS認定 SAP on AWS - 専門知識は、AWS認定の中でも際立った特徴を持っています。それは「SAP」というAWSから見てサードパーティのソフトウェアを対象とした認定だからであり、普段SAPを扱うことのない自分が**認定を取得するべきかどうか**葛藤しました[^9]。

しかし結論としては**取得して正解**でした。なぜそう思ったのかというと、このSAP on AWSがAWS認定の唯一の **「実践的な応用編」** と位置づけることができると感じたからです。実際に本試験を受けて見て、{% elink 「AWS Well-Architected」 https://aws.amazon.com/jp/architecture/well-architected/ %}を理解して**実践する力**がないと合格が難しいと思ったのは、AWSの全認定の中でこの認定だけです。そういう意味ではカテゴリ的には「専門知識」ではなく「プロフェッショナルレベル」の次を見据えた資格のように感じました。それは**プロフェッショナルレベルの次の段階は実践を見据えた応用力**だと考えているからなのですが、正に「SAP on AWS」がその応用力を養う場としてうってつけなわけです。

「SAP」は歴史のあるソフトウェアであり、かつ広く使われており基幹業務に欠かせないビジネスソフトウェアです。そのためAWSへの移行に問題を抱えているビジネスソフトウェアの**格好のモデルケース**になります。つまり従来の認定に欠けていた具体的で実践的な **「道場」** としてこの認定を位置づけることで「SAP」という特定ベンダーの領域を超えた**普遍的な価値**を見出すことができるのです。

普遍的な価値の例として「SAP on AWS」の中にはAWSを具体的に実践した場合の豊富な事例が散りばめられており、**実務に通じる感覚を養うことができる**というものがあります。また別の価値としてこの認定を他の認定で得た知識の具体的な応用を発見する旅だと捉え直すと学習もなかなか楽しいものに思えてきます。実際に私はSAPソフトウェアの長い歴史とAWSの最新テクノロジーが融合する過程を読み解くことができたので**単体のストーリとしても楽しむことができました。**

もちろん「SAP on AWS」は移行のシナリオやVPCベースの3層アーキテクチャとそのHA/DRが主なので最新のクラウドネイティブな知見を得ることは少ないのですが、**「オンプレの発想をクラウドに切り替えるとこうなる」**という訓練はなかなか汎用的で役に立つと思うので、「SAP」を知らない、「触る機会がない」といってこの試験を敬遠するのは**もったいない**気がします。そして、その「もったいない」と思った気持ちこそが本記事を書こうと思った**直接のきっかけ**になります。

本記事は、私のようなこれまで「SAP」とそれほど縁がない人にも興味もってもらえるように「SAP」や「SAP on AWS」の説明も加えて**ストーリー**として読めるように心がけました。他の記事ではいきなり試験対策に入っているものが多いので、本記事では試験の全容が掴めるようになるべく前提知識がなくても読めるようにしたということです。もちろん**「試験対策」も私の経験を踏まえてしっかりと書いた**ので役立てて頂けると嬉しいです。

まとめると**新しいAWS認定「SAP on AWS - 専門知識」は(AWS認定の中では)異質だが、(SAPと縁がなくても)役に立つ**ということを感じた合格体験談でした。

本記事がSAPやAWS認定に興味がある方の一助になれば幸いです。

[^9]: AWS認定12冠達成という別の目的があったとはいえ、普段はほぼ縁のない「SAP」の学習にはモチベーションが湧きづらかったのです。

