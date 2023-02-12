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




## 試験結果

ここからどういう学習をして合格したのかを語っていこうと思いますが、何はともあれ試験結果をお見せしないと説得力に欠けますので、**エア受験**でないこと証拠を始めに提示いたします。

{% img /gallery/daily/cloud/aws/sap-on-aws-result1.png %}
{% img /gallery/daily/cloud/aws/sap-on-aws-result2.png %}

試験準備は1月18日〜2月4日の2週間強でした。学習時間は40時間程だと思います。

## 前提条件



## 試験対策


## まとめ


SAP on AWSは正統派の応用編
実力　腕試し

AWSのリテラシーがダイレクトに試されている感じがしました。
少ない情報から効率よく学習する方法　細切れの情報源を繋ぎ合わせて自分でストーリーをつくる能力
武者修行

## 余談　〜テストセンターの様子と初詣〜



