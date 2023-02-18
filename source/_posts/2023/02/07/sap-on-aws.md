---
title: 新しいAWS認定「SAP on AWS - 専門知識」は曲者だが役に立つという話 〜合格体験談と試験後の余談〜
thumbnail: /gallery/thumbnails/hofukuzenshin.png
toc: true
categories:
  - Tech
  - CloudNtive
tags:
  - AWS
date: 2023-02-07 07:28:45
---

2022年の4月に新しいAWS認定「SAP on AWS - 専門知識」が登場しました。これまではリタイアした認定を除けば11種類のAWS認定が受験可能だったわけですが、大抵のヒトには謎の資格が加わった訳です。

AWS認定のSAPといえば、Solutions Architect - Professional試験、通称「SAP」のことですが、「SAP on AWS」の「SAP」はSAP社が提供するビジネス向けソフトウェアで企業のことで、基幹システムに導入される代表的なパッケージ製品です。

本記事ではこの「SAP」の謎に迫りつつ、合格体験談を語りたいと思います。AWS認定を持っていない人やSAPを触ったことがない人にも読んで頂けるように配慮したので少しでも興味が湧いた方はぜひお読み下さい。

<!-- more -->
## SAPとは

SAPは、ドイツに本社を置く世界最大のERPソフトウェア企業です。ERPとは、Enterprise Resource Planning (エンタープライズリソースプランニング) の略で、企業内の資源（人的資源、製品、財務資源など）を効率的に統合管理するためのシステムのことを指します。SAPは、企業の財務管理、人事管理、物流管理、顧客管理など、多岐に渡るビジネスプロセスにおいて活用することができます。

{% img /gallery/daily/cloud/aws/SAP.png %}

もともとSAPといえばR/3とABAP[^1]の印象が強かったですが、時代は代わりS/4 HANA全盛期になってレトロなSAP GUIからFioriに置き換わろうとしています。私がSAPを仕事で少し触る機会があった10数年前の世界とは様変わりしていることに驚きました。

|登場年|製品名|アーキテクチャ|データベース|特徴|
|---|---|---|---|---|
|1972|R/1|メインフレーム|DBMS|会計システム。通貨の違いを柔軟に吸収|
|1979|R/2|メインフレーム|RDBMS|ABAP登場によりアドオン開発が容易に|
|1992|R/3|オープンシステム|RDBMS|ERPパッケージのスタンダードの地位を確立|
|2015|S/4HANA|オープンシステム|HANA|インメモリデータベースのHANAを中核に高速化を実現|

またSuccessFactors(人材管理), Concur(経費精算), Ariba(購買)などのクラウドベースのサービスも増えていました。これらはこれらはもともとSAPにはなかったアセットですが、企業買収によってSAPソリューションに取り込まれたサービス群になります。SAP on AWSもそうですがERPのリーディングカンパニーもクラウドが主戦場になったことに時代の流れの速さを感じています。

[^1]: R/3はSAP社のERPパッケージ製品名で、UNIXやWindows上で動作するクライアント/サーバ型のソフトウェアです。R/3はモジュール化されていて、財務会計、販売管理、人事管理、購買・在庫、生産管理等の企業の様々な基幹業務を支える製品になっています。ABAP（Advanced Business Application Programming）はR/3を拡張するためのSAP社の独自言語です。

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

もちろんこれらのソリューションはアドホックに組み立てられる訳ではなく、AWSのベストプラクティスである{% elink 「AWS Well-Architected」 https://aws.amazon.com/jp/architecture/well-architected/?wa-lens-whitepapers.sort-by=item.additionalFields.sortDate&wa-lens-whitepapers.sort-order=desc&wa-guidance-whitepapers.sort-by=item.additionalFields.sortDate&wa-guidance-whitepapers.sort-order=desc %}に沿った自然な選択が重要視されることはいうまでもありません。従って「SAP on AWS」とはSAPという歴史あるアーキテクチャをいかにAWSというクラウドにベストな方法で適用するかという「実践的な課題」と捉え直すことができます。この「実践的」という部分が他のAWS認定と異なる際立った特徴であり、新たに認定に仲間入りした真の理由だと個人的に推察しています。

## AWS認定　SAP on AWS - 専門知識とは

{% img /gallery/daily/cloud/aws/aws-cert-new.png %}



## 試験結果

ここからどういう学習をして合格したのかを語っていこうと思いますが、何はともあれ試験結果をお見せしないと説得力に欠けますので、**エア受験**でないこと証拠を始めに提示いたします。

{% img /gallery/daily/cloud/aws/sap-on-aws-result1.png %}
{% img /gallery/daily/cloud/aws/sap-on-aws-result2.png %}

試験準備は1月18日〜2月4日の2週間強でした。学習時間は30〜40hだと思います。

## 前提条件

ここから試験対策について語っていきますが、前提条件として私はこのSAP on AWSを取得してAWS認定12冠になったのでその視点からの解説になっているかもしれません。少なくとも「AWS素人がXX週間で合格してみた」のノリではありません。

SAP on AWSは応用的な試験でまだ試験登場から間もないこともあって、決定打となる学習方法はまだ出ていない状況です。一番の学習リソースはAWSが出している情報になるのでここを丁寧に掘り下げるのが一番の近道だと感じました。

## 試験対策

SAP on AWSの試験対策は以下の順で行うのが良いと感じました。

1. 試験ガイドで試験内容を把握
    * {% elink AWS Certified: SAP on AWS - Specialty
(PAS-C01) 試験ガイド https://d1.awsstatic.com/ja_JP/training-and-certification/docs-sap-on-aws-specialty/SAP-on-AWS-Specialty_Exam-Guide.pdf %}
2. サンプル問題で問題に慣れる
    * {% elink  AWS Certified: SAP on AWS - Specialty
(PAS-C01) 試験問題サンプル https://d1.awsstatic.com/ja_JP/training-and-certification/docs-sap-on-aws-specialty/SAP-on-AWS-Specialty_Sample-Questions.pdf %}
    * ブログや動画の解説を出している方がいるので合わせてみると効果的です
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
    * {% elink AWS Certified: SAP on AWS - Specialty Official Practice Question Set (PAS-C01 - Japanese) aws-certified-sap-on-aws-specialty-official-practice-question-set-pas-c01-japanesehttps://explore.skillbuilder.aws/learn/course/12875/ %}
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

以下は試験のキーワードです。一つでも分からない用語やサービスがあれば危険信号なので深堀りしておくことをオススメします。

Snowball、backint、Oracle XTTS DataGuard、IAMロール、最小インスタンス数、ハイメモリインスタンスタイプ、Config、VPC、SAP Router、DMS/SMS/Endure/MGN、CloudFront、Global Accelerator、SWPM(DMO)、Control Tower、ストレージ(EBS/EFS/Fsx/S3)、IMDS、パッシブDR、パイロットライト、ウォームスタンバイDR、プレイスメントグループ、ピークメモリ、S3 File gateway、anyDBからHANAの移行、オーバーレイIP(Transit Gateway、NLB)、データ階層化、SAPラインセンス(ハードウェアキー)、Launch Wizard for SAP、専有ホスト、Data Provider for SAP、SAP Fiori、SAP HANA、logreplay、delta_datashipping、SAP EarlyWatchAlert、HANA Studio、FSxファイルゲートウェイ

上記の学習で一番重要なのは「6. SAP on AWSの公式ドキュメント、ブログを読む」になります。合格ラインを超えるにはここのドキュメントの理解度が一番効いてくるのでしっかりと読み込みましょう。

## まとめ

SAPという


基本的にはSAP on AWSの学習は近道がなく、正攻法の学習方法を書いているので面白みはありませんが、ポイントを押さえて流れを意識して試験対策を書きました。SAP on AWSは応用度の高い試験なので正直どこから学習を始めたらいいか分からない方がほとんどだと思います。だからこそ、



SAP on AWSは正統派の応用編
実力　腕試し

AWSのリテラシーがダイレクトに試されている感じがしました。
少ない情報から効率よく学習する方法　細切れの情報源を繋ぎ合わせて自分でストーリーをつくる能力
武者修行

## 余談　〜テストセンターの様子と初詣〜



