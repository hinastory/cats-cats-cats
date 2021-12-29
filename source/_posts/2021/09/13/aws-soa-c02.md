---
title: AWS認定に追加された実技試験「試験ラボ」をくぐり抜けて合格した話(SOA-C02)
thumbnail: /gallery/daily/others/aws-soa.png
toc: true
categories:
  - Tech
  - CloudNative
tags:
  - AWS
  - Certification
date: 2021-09-13 07:28:45
---
AWS認定は少しずつ移り変わってきました。小さいものでは試験内容の改訂から大きなものでは認定の追加や削除まで色々ありました。しかしここにきてAWS認定は**別次元の進化**を遂げようとしています。なんと試験問題に**AWSの実技試験を織り交ぜてきた**のです。

**「試験ラボ」** と呼ばれるこの試みはAWS認定の**試験対策に根本的な変更**を求めるものであり、また**認定の意義の見直しを迫る**ものでもあります。本記事では2021/7/27に新しく試験ラボが導入されたAWS認定「SysOpsアドミニストレーター - アソシエイト(SOA-C02)」の体験談になります。試験ラボの試し方から試験対策まで書ける範囲で書いていきます。

<!-- more -->

## はじめに

最初にお断りしておきますが、[AWS認定プログラムアグリーメント](https://aws.amazon.com/jp/certification/certification-agreement/)の規約により、認定試験を含む試験関連資料の内容については他言してはいけないことになっているので、その辺はAWSが公開している情報に準拠します。そして試験やAWS自体も今後変わっていくと思われるので、実際に受ける際には最新の情報を確認するようお願いします。

## SysOpsアドミニストレーター - アソシエイト(SOA)試験とは

SysOpsアドミニストレーター - アソシエイト(以降SOAと表記)は11個あるAWS認定資格の中でもアソシエイトレベル(中級)の試験です。アソシエイトレベルの試験は3つありますが、かつては比較的与し易い試験と言われてきました・・・　

![](https://storage.googleapis.com/zenn-user-upload/5f0e4ab05f84e91dbfadd9fc.png)
*[AWS認定](https://aws.amazon.com/jp/certification/?nc2=sb_ce_co)(赤枠は当方で記載)*

SOAは運用の話なので開発やアーキテクトよりは具体的で近づきやすい親しみやすさがあったのかもしれません。しかし、今回の試験改定でその立ち位置が大きく変わってきました。運用とは、とどのつまり**口先だけではなく実務としてAWSを正確に操作できる経験がものを言う世界**であり、今回の試験ラボの導入で正しくその実力が問われるようになったのです。


## SysOpsアドミニストレーター - アソシエイト(SOA)試験の概要

SOA試験の概要は以下の通りです。変更があった点は**強調**しています。

- 試験時間
  - 130分間 -> **180分間**
- 問題数
  - 65問 -> **55問　+ 試験ラボ(複数の可能性あり)**
- 合格ライン
  - 100～1000点の範囲のスコアでレポート
  - 最低合格スコアは720
- 受験料金
  - 15,000 円（税別）/ 模擬試験 2,000円（税別）
- 認定期間
  - 3年
  - 再認定時は同じ試験を50%割引で受けられる
- 合否結果
  - すぐに表示 -> **5営業日以内に通知**

気になる変更点はやはり試験ラボの追加による試験時間の増加だと思います。180分は**プロフェッショナル試験と同じ時間**であり、それだけ体力と集中力が要求されることになります。

あと合否結果がすぐには分からないのも、これまでとは違う所です。今までは試験終了時に画面に合否が表示されていましたが、SOAでは5営業日以内に通知となります。とは言っても**受験後3時間後**には認定バッジが発行された通知が来て、認定アカウントからは試験結果がダウンロードできました。もちろん個人差はあると思いますが、実際にはそこまで遅くなる心配は不要かもしれません。

## 「試験ラボ」とは何なのか？

さて、ここからが本題に深く踏み込んだ内容になります。試験ラボについては[試験ガイド](https://d1.awsstatic.com/ja_JP/training-and-certification/docs-sysops-associate/AWS-Certified-SysOps-Administrator-Associate_Exam-Guide.pdf)の内容に沿って紹介していきます。

> 試験ラボ：提供された AWS アカウントの AWS マネジメントコンソールまたは AWS CLI で、特定のシナリオに必要なタスクを完了します。

試験ラボはブラウザからWindowsの環境にアクセスして(ブラウザ内からリモートデスクトップで繋いでいる感じ[^1])、その中でさらにブラウザを立ち上げてマネジメントコンソールにアクセスする仕組みでした。ブラウザ依存を取り除いたり、ブラウザのアドオンの影響を避けるうまいやり方だなと思いました。

[^1]: Apache Guacamoleのような仕組み。

> 試験が開始すると、多肢選択問題および複数回答問題の設問数と試験ラボセクションの試験ラボ数に関する通知が届きます。また、試験ラボの作業内容により採点されるスコアのパーセンテージも確認できます。各試験ラボの完了に与えられる時間は 20 分と想定してください。

自分の試験では試験ラボ数は2でした。従って40分より多く作業時間を見積もるよう試験の最初の方で画面で指示されました。　試験ラボは選択式の試験が終わった後にあり後戻りはできないので、試験ラボの時間を十分に残しておく必要があります。

> 次の試験ラボに移動する前に、試験ラボのすべての作業を完了する必要があります。前の試験ラボに戻ることはできません。試験ラボでの作業中は、仮想マシンのメモ帳または AWS CLI を使用できます。

どうやら仮想マシン上でAWS CLIも使えるみたいです。自分はたまたま必要なかったので利用はしませんでした。

> 試験ラボの作業を行う方法は、複数ある可能性があります。このような場合、シナリオの正しい終了状態を達成すると、その作業内容に対して最高点が付与されます。試験ラボの一部を完了した場合は、部分点が付与されます。ただし、試験内容およびそれに伴う得点は機密情報です。試験ラボで付与される部分点以外の情報は公開されません。

この採点方法が一番謎が多い所です。試験ラボのサンプルをやってみましたが、部分点をどうやってつけているのか謎な点がありました。多分AWSの秘蔵のタレが仕込んであるのでしょう。

## 試験問題のサンプルより「試験ラボ」を確認してみる

もう少し踏み込んだ試験ラボのイメージを持つには公開されている[試験問題のサンプル](https://d1.awsstatic.com/ja_JP/training-and-certification/docs-sysops-associate/AWS-Certified-SysOps-Administrator-Associate_Sample-Questions_C02.pdf)を見てもらった方が早いでしょう。以下はサンプルとして公開されている試験ラボの画面になります。

![](https://storage.googleapis.com/zenn-user-upload/3ec4edb7ba9c8de4adcf9fc2.png)
*[SOA-C02 試験問題サンプル](https://d1.awsstatic.com/ja_JP/training-and-certification/docs-sysops-associate/AWS-Certified-SysOps-Administrator-Associate_Sample-Questions_C02.pdf)のP7より抜粋*

画面を見てもらうとわかるように右側に指示が書いてあり、左側がマネジメントコンソールになっています。試験ラボに起動には数分かかりますが、起動後にはこの状態になっていました。

試験ラボでは右側の指示通りにリソースを作ったり、パラメータを設定したりします。たまに右側に値を書き込む設問もあります。

試験ラボの難易度は画面を見てもらうとわかる通り**完全な初見殺し**です。AWSマネジメントコンソールに触ったことがない人が簡単に解けるような問題ではありません。普段よく触る人でも実際に操作したことがないような指示があります。

このサンプル問題を見ただけでも試験ラボを甘く見るのが如何に危険かご理解頂けるでしょう。

## 「試験ラボ」のサンプルを試してみる

試験ラボは**2021年12月31日までに試験予約を行うと試験ラボのサンプルを無料で試すことができます。** 試験ラボは試験を予約するとメールでアクセス方法が送られてきます。以下が実際にアクセスした画面です。

![](https://storage.googleapis.com/zenn-user-upload/1a5b3b9203b92c4021bbd640.png)

一番下の「起動」ボタンを押すと新しいブラウザのウィンドウが開いて試験ラボが開始します。試験ラボには最初のアクセスから90日間にわたって、3回試行することができます。3回とも同じ試験ラボで内容が変わることはありません。試験ラボのサンプルで実際にその場で採点もされて部分点も表示されます。

試験ラボの環境は模擬試験でも提供されておらず、この試験ラボのサンプルのみなので受験予定の方は2021/12/31までに予約を行ったほうが良さそうです。


## 「試験ラボ」の対策

試験ラボの対策はやはり**実際にAWSマネジメントコンソールに触って試験範囲の各種サービスの基本操作を試してみる**ことです。主に以下の3つが挙げられます。

- AWSの無料利用枠を活用する
- [セルフペースラボ](https://aws.amazon.com/jp/training/self-paced-labs/)を利用する
- 「試験ラボ」のサンプルを試してみる

一番のオススメは「AWSの無料利用枠」を活用してマネジメントコンソールを触りまくることです。無料利用枠には「1年間限定」のものもあれば、特定の利用量の範囲であれば常に無料のものもあります。実際にAWSに触ってみるとAWSのコストを「肌感覚」で知ることができるのでオススメです。もちろん請求ダッシュボードの確認や請求アラームを活用することは忘れないでください。

{% blogCard https://aws.amazon.com/jp/free/ %}

二番目は[セルフペースラボ](https://aws.amazon.com/jp/training/self-paced-labs/)の活用です。セルフペースラボでは[Qwiklabs](https://www.qwiklabs.com/)のハンズオンラボの仕組みを利用してAWSマネジメントコンソールを利用することができます。一部機能に制限はついていますが試験対策として必要なサービスを試してみることはできるのでうまく活用すればお金をかけずに試験ラボ対策ができます。


{% blogCard https://aws.amazon.com/jp/training/self-paced-labs/ %}

三番目は先程紹介した「試験ラボ」のサンプルです。これはすでに紹介したので説明は割愛します。

具体的にどんなサービスに触った方がよいかというと、試験ガイドで出てくるサービスは一通り触ったほうがよいます。ただ、さすが量が多いので　AWSで良く使われている印象のサービスに星印（★)を付けてみました。あくまで個人的な印象なので参考程度に見て頂けると幸いです。

{% details 試験ガイドに記載されている試験対象のサービス一覧 %}
- アナリティクス
  - Amazon Elasticsearch Service (Amazon ES)
- アプリケーション統合:
  - Amazon EventBridge (Amazon CloudWatch Events) ★
  - Amazon Simple Notification Service (Amazon SNS) ★★★
  - Amazon Simple Queue Service (Amazon SQS) ★★★
- AWS コスト管理:
  - AWS Cost and Usage Report ★★
  - AWS Cost Explorer
  - Savings Plans
- コンピューティング:
  - AWS Application Auto Scaling
  - Amazon EC2 ★★★
  - Amazon EC2 Auto Scaling ★★
  - Amazon EC2 Image Builder
  - AWS Lambda ★★★
- データベース:
  - Amazon Aurora ★★★
  - Amazon ElastiCache ★
  - Amazon RDS ★
- 管理、モニタリング、ガバナンス: 
  - AWS CloudFormation ★★ 
  - AWS CloudTrail ★★
  - Amazon CloudWatch ★★★★ 
  - AWS Command Line Interface (AWS CLI) ★★ 
  - AWS Compute Optimizer 
  - AWS Config ★
  - AWS Control Tower 
  - AWS License Manager 
  - AWS マネジメントコンソール ★★★★★
  - AWS OpsWorks 
  - AWS Organizations 
  - AWS Personal Health Dashboard 
  - AWS Secrets Manager 
  - AWS Service Catalog 
  - AWS Systems Manager 
  - AWS Systems Manager Parameter Store *
  - AWS のツールと SDK *
  - AWS Trusted Advisor
- 移行と転送: 
  - AWS DataSync 
  - AWS Transfer Family
- ネットワークとコンテンツ配信: 
  - AWS Client VPN 
  - Amazon CloudFront ★★
  - Elastic Load Balancing ★★★
  - AWS Firewall Manager 
  - AWS Global Accelerator 
  - Amazon Route 53 ★★★
  - Amazon Route 53 Resolver 
  - AWS Transit Gateway 
  - Amazon VPC ★★★★
  - Amazon VPC トラフィックミラーリング
- セキュリティ、アイデンティティ、コンプライアンス: 
  - AWS Certificate Manager (ACM) 
  - Amazon Detective 
  - AWS Directory Service 
  - Amazon GuardDuty 
  - AWS IAM Access Analyzer 
  - AWS Identity and Access Management (IAM) ★★★★
  - Amazon Inspector
  - AWS Key Management Service (AWS KMS) ★
  - AWS License Manager
  - AWS Secrets Manager ★
  - AWS Security Hub
  - AWS Shield
  - AWS WAF
- ストレージ:
  - Amazon Elastic Block Store (Amazon EBS) ★★★
  - Amazon Elastic File System (Amazon EFS) ★★
  - Amazon FSx
  - Amazon S3 ★★★★
  - Amazon S3 Glacier ★★
  - AWS Backup
  - AWS Storage Gateway 
{% enddetails %}

## 試験(SOA-C02)を受けた感想

正直難しかったです。試験改定後は大抵難しくなるものですが予想を超えていました。アソシエイトレベルの試験ではSAA[^2]もDVA[^3]も持っていてどちらも900点超えでしたが、SOA-C02は754しかとれず想像以上にギリギリの合格でした。プロフェッショナル(SAP[^4])も持っていてその点数よりも低かったので正直甘く見すぎていました。

> DVA > SAA >> SAP > SOA (点数順)

[^2]: SAAは「AWS認定ソリューションアーキテクト - アソシエイト」のことです。
[^3]: DVAは「AWS認定デベロッパー - アソシエイト」のことです。
[^4]: SAPは「AWS認定ソリューションアーキテクト - プロフェッショナル」のことです。

もちろん今回は試験対策は1週間しかしなかったことが低得点の主な要因ですが、それにしても普段そこそこAWSマネジメントコンソールに触っていると思っていても、なかなか対策なしでは厳しいものがあると感じました。

## まとめ

AWS認定SysOpsアドミニストレーター - アソシエイトの試験が2021/7/27に改定され、**「試験ラボ」** が導入されました。「試験ラボ」はいわゆる **「実技試験」** にあたり、今回から選択式の試験と実技試験の二本立てになりました。今後はこの形がAWS認定試験のスタンダードになるかもしれません。

これまでAWS認定は単純なペーパーテストの域を出なかったため、AWSマネジメントコンソールに触ったことがない人でも合格したという話がそこそこ出ており、**その実用性や価値に懐疑的な意見が少なからずありました**。

しかし試験ラボの登場でAWSマネジメントコンソールにまったく触ったことがないというレベルの人はほぼ排除されることになるでしょう。それは**AWS認定が単なるファッションではなくAWSを実用的に使える証明**に一歩近づいた証でもあります。

もちろん、それは試験の難易度が顕著に上がった印でもあり試験ラボの対策はAWSの実環境で十分に成されるべきです。今後はqwiklabs等を用いたハンズオンラボの試験対策も充実してくると思われるので、気軽にAWSの実技を磨く機会が増えるのではないかと推察しております。

そして試験ラボの有用性が証明されれば、**AWSを超えてIT資格のスタンダートになる潜在的な力**を秘めています。もちろんそれはまだ先の話かもしれませんが直近ではAWS認定デベロッパー - Associate(DVA)なんかで、Cloud9でコーディングしてCodeCommitにコミットしてAIでコードが採点されたり、実行結果をラムダやコンテナで自動チェックする試験が追加されると面白いのではないかと想像したりしていて、個人的には **「試験ラボ」** のこれからに非常に期待しています。

本記事が、「試験ラボ」や「AWS認定SysOpsアドミニストレーター - アソシエイト(SOA-C02)」に興味を持っている方の一助になれば幸いです。

# 参考文献

- [AWS Certified SysOps Administrator - Associate 認定](https://aws.amazon.com/jp/certification/certified-sysops-admin-associate/)
- [ラボを含む新しい AWS 認定 SysOps アドミニストレーターアソシエイト試験の受験 Tips | Amazon Web Services ブログ](https://aws.amazon.com/jp/blogs/news/tips-for-an-aws-certification-exam-with-exam-labs/)
- [SOA新試験（SOA-C02）受験レポート | DevelopersIO](https://dev.classmethod.jp/articles/aws-certification-soa-c02/)




