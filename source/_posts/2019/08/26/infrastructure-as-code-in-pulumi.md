---
title: Pulumiでプログラマのための「Infrastructure as Code」を実践する
thumbnail: /gallery/thumbnails/pulumi.png
categories:
  - Tech
  - Cloud
tags:
  - AWS
  - pulumi
  - IaC
date: 2019-08-26 07:28:45
---
「Infrastructure as Code」という言葉が生まれてから大分立ちました。Infrastructure as Code (IaC)は簡単に言えば**インフラをコード化する**という概念です。この言葉に触れた当時はインフラをプログラミングできる時代がやってくるのだと思い、プログラマとして非常に心躍る気持ちになりました。ただその気持は長くは続きませんでした。Ansible, Chef, Puppet, CloudFormation, AWS SDK, Docker, Terraform・・・ これらの技術はどれも素晴らしいものですが、プログラマとしての自分が告げるのです。欲しいのは**「コレジャナイ」**と・・・ そして長い旅路の末にようやく巡りあえたのです。{% elink Pulumi https://www.pulumi.com/ %}という希望の星に。

<!-- more -->

## 目次
<!-- toc -->

## はじめに

本記事では{% elink Pulumi https://www.pulumi.com/ %}で「Infrastructure as Code」を実践します。具体的にはAWS上に以下の2層構造のWebアプリケーション[^1]のインフラを100行未満のTypescriptで記述します。

{% img /gallery/daily/cloud/aws/two-tier-web.png %}

## 実践 Infrastructure as Code

Pulumiではインフラの状態が内部で管理されているので、インフラを簡単に作ったり、壊したりすることができます。また、TypeScriptなので、インフラの「型」を簡単に確認できたり、インフラをライブラリ化したり、インフラをループで大量に生成できます。正しくプログラミング感覚でインフラが構成できて、いらなくなったら簡単に破棄できるので`プログラマのためのIaC`を実践するのにPulumiはうってつけです。

[^1]: 一般的には{% elink AWSのリファレンスアーキテクチャ https://media.amazonwebservices.com/architecturecenter/AWS_ac_ra_web_01.pdf %}にある通り、Webサーバとアプリケーションサーバを分離した構成をとることが多いです。またDNSであるRoute53やCDNのCloudFrontもWebサーバの構成として入れるのが妥当ですが、今回はなるべく応用可能な「基礎」を提示したかったのでこの構成になっています。

### pulumiの導入

Pulumiの[Get Started](https://www.pulumi.com/docs/get-started/)に従って、Pulumi CLI、AWS CLI、Node.jsをインストールしてください。
(「Configure AWS」まで進めてください。)

### pulumiログイン

以下のコマンドでpulumiにログインしてください。

{% code lang:bash %}
$ pulumi login
{% endcode %}

ブラウザでログインする場合は上記のコマンド後に「`Enter`」キーを押します。するとブラウザ側でサインインできます。自分はGitHubでPulumiにサインインしましたが、他にもGitLabやE-mail等でもサインインできます[^2]。

[^2]: Pulumiにサインインせずにローカルだけで完結させる方法もあります。

### プロジェクトとスタックの作成

次にプロジェクトとスタックの作成をします。以下のコマンドで実行します。

{% code lang:bash %}
$ mkdir aws-ts-twe-tier-web && cd aws-ts-twe-tier-web
$ pulumi new aws-typescript
{% endcode %}


`purumi new`は基本的にはデフォルトでOKなので`Enter`で進めますが以下の質問だけ「`ap-northeast-1`」にして`Enter`を押してください。

- `aws:region: The AWS region to deploy into: (us-east-1)`

### index.tsの作成

メインファイルである`index.ts`ファイルに以下を記述してください。

{% code lang:ts index.ts %}
{% raw %}
import * as pulumi from "@pulumi/pulumi"
import * as awsx from "@pulumi/awsx"
import * as utils from "./utils"

const vpcPrefix = "custom"
const vpc = new awsx.ec2.Vpc(vpcPrefix)
const db = utils.createRDSInstance(vpcPrefix, vpc)
const alb = utils.createApplicationLoadBalancer(vpcPrefix, vpc)
const targetGroup = alb.createTargetGroup(`${vpcPrefix}-web-tg`, { port: 80, targetType: "instance" })
const listener = targetGroup.createListener(`${vpcPrefix}-web-listener`, { port: 80 })
const autoScalingGroup = utils.createAutoScalingGroup(vpcPrefix, vpc, alb)
autoScalingGroup.scaleToTrackAverageCPUUtilization("keepAround50Percent", { targetValue: 50 })

export const endpoint = listener.endpoint.hostname
{% endraw %}
{% endcode %}

### utils.tsの作成

同じフォルダに`utils.ts`を作成して、ファイルに以下を記述してください。コーディングは以上です。

{% code lang:ts utils.ts %}
{% raw %}
import * as aws from "@pulumi/aws"
import * as awsx from "@pulumi/awsx"

export function getAmazonLinux(): Promise<string> {
  return aws.getAmi({
    filters: [
      { name: "name", values: ["amzn-ami-hvm-*"] },
      { name: "virtualization-type", values: ["hvm"] },
      { name: "architecture", values: ["x86_64"] },
      { name: "root-device-type", values: ["ebs"] },
      { name: "block-device-mapping.volume-type", values: ["gp2"] }
    ],
    mostRecent: true,
    owners: ["amazon"]
  }).then(ami => ami.id)
}

export function createRDSInstance(vpcPrefix: string, vpc: awsx.ec2.Vpc): aws.rds.Instance {
  const dbSg = new awsx.ec2.SecurityGroup(`${vpcPrefix}-db-sg`,
    {
      vpc,
      ingress: [{ protocol: "tcp", fromPort: 3306, toPort: 3306, cidrBlocks: ["0.0.0.0/0"] }],
      egress: [{ protocol: "-1", fromPort: 0, toPort: 0, cidrBlocks: ["0.0.0.0/0"] }],
    })

  const dbSubnets = new aws.rds.SubnetGroup(`${vpcPrefix}-dbsubnets`, {
    subnetIds: vpc.privateSubnetIds,
  })

  return new aws.rds.Instance(`${vpcPrefix}-db`, {
    engine: "mysql",
    instanceClass: "db.t2.micro",
    allocatedStorage: 10,
    dbSubnetGroupName: dbSubnets.id,
    vpcSecurityGroupIds: [dbSg.id],
    name: `${vpcPrefix}DbInstance`,
    username: "testdb",
    password: "testdb123",
    multiAz: true,
    skipFinalSnapshot: true,
  })
}

export function createApplicationLoadBalancer(vpcPrefix: string, vpc: awsx.ec2.Vpc): awsx.elasticloadbalancingv2.ApplicationLoadBalancer {
  const albSg = new awsx.ec2.SecurityGroup(`${vpcPrefix}-alb-sg`,
    {
      vpc, egress: [{ protocol: "-1", fromPort: 0, toPort: 0, cidrBlocks: ["0.0.0.0/0"] }],
    })

  return new awsx.lb.ApplicationLoadBalancer(`${vpcPrefix}-web-traffic`, { vpc, securityGroups: [albSg] });
}

function getRunCmd(title: string, content: string): string {
  return `az=$(curl -s http://169.254.169.254/latest/meta-data/placement/availability-zone)
echo "&lt;html&gt;&lt;head&gt;&lt;title&gt;${title}&lt;/title&gt;&lt;/head&gt;&lt;body&gt;&lt;h1&gt;${content} from $az&lt;/h1&gt;&lt;/body&gt;&lt;/html&gt;" > index.html
nohup python -m SimpleHTTPServer 80 &`
}

export function createAutoScalingGroup(vpcPrefix: string, vpc: awsx.ec2.Vpc, alb: awsx.elasticloadbalancingv2.ApplicationLoadBalancer): awsx.autoscaling.AutoScalingGroup {
  const userDataLines = getRunCmd("My Web Site", "Hello World").split(`\n`).map(e => ({ contents: `    ${e}`, }) as awsx.autoscaling.UserDataLine)

  return new awsx.autoscaling.AutoScalingGroup(`${vpcPrefix}-web-asg`, {
    vpc,
    subnetIds: vpc.publicSubnets.map(e => e.id),
    targetGroups: alb.targetGroups,
    templateParameters: {
      minSize: 2,
      maxSize: 4,
    },
    launchConfigurationArgs: {
      instanceType: "t2.micro",
      imageId: getAmazonLinux(),
      securityGroups: alb.securityGroups,
      userData: { extraRuncmdLines: () => userDataLines }
    }
  })
}
{% endraw %}
{% endcode %}


これで見事に冒頭で示した構成が`index.ts`と`utils.ts`を合わせて100行弱のコードで作成できました。

### インフラのデプロイ

以下を実行してください。途中で本当に実行してよいか聞かれるので「`yes`」を選択して`Enter`を押してください。インフラの作成には数分かかります。

{% code lang:bash %}
$ pulumi up
{% endcode %}


### デプロイ結果の確認

`pulumi up`が成功すると最後の出力結果に`endpoint`が表示されるので、そのURLにブラウザからアクセスしてみてください。

「`Hello, World! from ap-northeast-1a`」が表示されたら成功です。ロードバランサを挟んでいるのでリロードでするごとにAZの部分(`from ap-northeast-1a`)が変わります。また実際にAWSのコンソールにログインしてEC2やRDSやVPCの構成も確認してみてください[^3]。

[^3]: AWSのマネジメントコンソール側でPulumiで作成したリソースの変更をしないでください。Pulumi側が管理している状態とAWSの状態がずれるとこの後説明するリソースの後片付けで失敗する可能性があります。

### リソースの後片付け

確認が終わったら以下のコマンドでリソースを破棄してください。リソースの破棄をしないとAWSの料金が発生し続けるので不要になったらすぐに破棄するようにしてください[^4]。

{% code lang:bash %}
$ pulumi destroy
{% endcode %}

[^4]: 特にRDSのマルチAZ構成はお高いので注意してください。


### コードの解説

短いのであまり解説する必要もないかもしれませんが、`index.ts`だけ一応簡単にコメントします。魔法はライブラリの「`awsx`」にあります。これは「Pulumi Crosswalk for AWS」というライブラリで、AWSのwell-architectedなベストプラクティスを実装しています。以下のコードでは「`new awsx.ec2.Vpc(vpcPrefix)`」が凄い仕事をしていて、二つのパブリックサブネットと二つのプライベートサブネットとインターネットゲートウェイ、NATゲートウェイやそれに付随するセキュリティグループ等さまざまなものを生成しています。それ以外はAWSの知識があれば割合素直に読めるのではないかと思います。

{% code lang:ts index.ts %}
import * as pulumi from "@pulumi/pulumi"
import * as awsx from "@pulumi/awsx"
import * as utils from "./utils"

const vpcPrefix = "custom" // VPCの名前を設定
const vpc = new awsx.ec2.Vpc(vpcPrefix) // VPCの作成(二つのパブリックサブネット、二つのプライベートサブネット、インターネットゲートウェイ、NATゲートウェイの作成)
const db = utils.createRDSInstance(vpcPrefix, vpc) // RDSインスタンスの作成
const alb = utils.createApplicationLoadBalancer(vpcPrefix, vpc) // アプリケーションロードバランサーの作成
const targetGroup = alb.createTargetGroup(`${vpcPrefix}-web-tg`, { port: 80, targetType: "instance" }) // ターゲットグループの作成
const listener = targetGroup.createListener(`${vpcPrefix}-web-listener`, { port: 80 }) // リスナーを作成
const autoScalingGroup = utils.createAutoScalingGroup(vpcPrefix, vpc, alb) // オートスケーリンググループの作成
autoScalingGroup.scaleToTrackAverageCPUUtilization("keepAround50Percent", { targetValue: 50 }) // スケーリングポリシーの作成

export const endpoint = listener.endpoint.hostname // "endpoint"の出力
{% endcode %}

`util.ts`も含めた全体の処理の流れは以下のとおりです。

1. VPCの作成
   - VPCの作成
   - ２つのパブリックサブネットの作成
     - NATゲートウェイの作成
   - ２つのプライベートサブネットの作成
     - NATゲートウェイの作成
   - インターネットゲートウェイの作成
   - 必要なルートテーブルやセキュリティグループの作成
2. RDSインスタンスを作成
   - セキュリティグループの作成
   - ふたつのプライベートサブネットを対象にサブネットグループの作成
   - サブネットグループにRDSインスタンスの生成
3. アプリケーションロードバランサの作成
   - セキュリティグループの作成
   - アプリケーションロードバランサの生成
4. ターゲットグループの作成
   - ロードバランサ用のターゲットグループを作成
5. リスナーを作成
   - ロードバランサ用のリスナーを作成し、転送先に上記で作成したターゲットグループを設定
6. オートスケーリンググループの作成
  - 起動設定の作成
    - 最新のAmazonLinuxを検索してAMIのIDを取得
    - 起動設定のユーザデータとして起動コマンドを渡してpythonの`SimpleHttpServer`が立ち上がるようにする
  - パブリックサブネットとロードバランサを指定してオートスケーリンググループの生成
    - オートスケーリングは2から4インスタンスの幅に設定
7. スケーリングポリシーの設定
  - CPU使用率が50%を基準にスケーリングするように設定
8. "endpoint"の出力


注意にすべきは、実際にPulumiが**上記の流れどおりにリソースを作成しているわけではない**ということです。プログラマはあくまでリソースの依存関係だけを気にしてプログラムを作成すればよく、実際のリソースの作成はPulumiが依存関係を賢く判断して**並列に作成できるリソースは並列に作成してくれます。** さらに言えば、Pulumiは上記のプログラムを「実行」して実際に必要なリソースを確定し、**現在すでに存在するリソースとの差分を計算して**差分のリソースだけをAWS側に作成してくれます。つまり一旦上記のコードを`pulumi up`で実行したあとにEC2インスタンスを作成するコードを付け足して再実行した場合には、**差分であるEC2インスタンスの作成のみ**が行われるということです。これは例えるならPulumiは**キャッシュ付きの自動並列化コンパイラ**のような役割を果たしていると考えられると思います。

一番最後の「"endpoint"の出力」は分かりづらいかもしれませんが、変数を`export`しておくと`pulumi up`した最後の結果として変数の値を出力してくれます。また「`pulumi stack output <変数名>`」を実行することで変数の値を出力することができるので、外部のプログラムとの連携が容易になります。

## Pulumiのいいところ

Pulumiのいいところは以下のとおりです。

- マルチクラウド
  - AWS
  - Azure
  - Google Cloud Platform
  - Kubernetes
  - OpenStack
- 複数の汎用言語をサポート
  - Node.js - JavaScript, TypeScriptやその他のNode.js互換言語(JSに変換可能)
  - Python 3 - Python 3.6 or greater
  - Go(PREVIEW)
- インフラのリソースの状態を管理している
  - `purumi up`したとき前回実行時からの差分のリソースだけを作成する
  - `purumi destroy`で作成済みのリソースを破棄する
- 複数のプロジェクト、スタックを使い分けられる
  - スタックごとに変数を定義できる
  - Secretの管理もできる

1つ目はマルチクラウドなところです。AWSやAzureやGCPのようなパブリッククラウドだけではなくOpenStackもサポートしています。またKubernetesのようなコンテナオーケストレーションもPulumiでコード化することができるので、Pulumiを覚えるだけで非常に広範囲のインフラ構築を自動化できることが分かると思います。

2つ目は複数の汎用言語をサポートしていることです。現在はJavaScriptやTypeScriptやPythonがサポートされており、Go言語も仲間入りする予定です。また拡張可能なように作られていて自分のお気に入りの言語を追加することも可能です[^5]。

3つ目はインフラのリソースの状態をPulumi側で管理していることです。このことでプログラマは最終的にあるべき状態だけをインフラをプログラミングできます。もしこれが現在のリソース作成状況を意識しながらプログラムを考えなければ行けないとすると非常に大変です。インフラの最終状態だけを思い浮かべて**ロジックに集中できる**ということはプログラマにとってありがたいことです。

もう一つプログラマに取ってありがたいのはリソースの削除が`purumi destroy`で簡単にできることです。プログラマは基本的にはトライアル&エラーでプログラムを作成することに慣れています。しかしリソースの破棄が面倒であれば試行錯誤する気にもならないかもしれません。実際のインフラではリソースに複雑な依存関係がついており順番を守らなければリソースの削除に失敗することもよくあります。しかし、Pulumiはリソースの状態を管理して、依存関係を把握することで、大量かつ複雑な依存関係のリソース郡を一括で削除できます。

4つ目は複数のプロジェクトおよびスタックを使い分けられることです。プロジェクトは再利用の単位にもなっていて「自分が作成したインフラ」を簡単に公開して共有することができます。今回作成したコードも以下にGitHubで公開してあるので、ぜひ試してみてください。

{% linkPreview https://github.com/hinastory/aws-ts-two-tier-web %}

また、プロジェクトの中でスタックを作成でき、コードの中で利用可能な「設定」を定義できます。例えばリージョン情報やユーザ名やパスワード等を「設定」としてコードから外出しすれば再利用性が高まり、スタックの切り替えで「設定」の切り替えもできるので非常に便利です。一番よくある使い方は開発用のスタックと本番用のスタックを分けるやり方です。その他にもパスワードを暗号化して管理する方法も提供されているので安全にインフラを共有することが可能です。

[^5]: 言語エンジンは外部プロセスと実行されgRPCを介してPulumiエンジンやリソースプロバイダと通信します。つまり通信プロトコルさえ守れば、Pulumi本体に手を入れることなく簡単に別の言語サポートを追加できるということです。

## Pulumiの仕組み

Pulumiの仕組みは以下のとおりです。

{% img /gallery/daily/others/how-pulumi-works.png 500 %}

***{% elink How Pulumi Works https://www.pulumi.com/docs/intro/concepts/how-pulumi-works/ %}より引用***

まず言語ホストがTypeScript等のコードを実行して、その結果をPulumiのエンジンに伝えます。Pulumiのエンジンは最後のデプロイの情報を確認して、必要に応じてクラウド上のリソースの作成、更新、削除を行い、その結果をまたデプロイの最終結果として保存します。最終結果の保存先はデフォルトでは {% elink Pulumiのサービス https://app.pulumi.com/ %}になりますが、ローカルやクラウドストレージ上に保存することも可能です。

## まとめ

本記事ではPulumiを利用して100行未満のTypeScriptで高可用な2層構造のWebアプリケーションのインフラを作成しました。Pulumiを利用した利点は以下のとおりであり、正しくプログラマが「Infrastracture As Code」を実践するのに最適なツールだと感じました。

- マルチクラウド
  - AWS, Azure, GCP, OpenStack, Kubernetes
- TypeScriptで記述できる
  - 型情報があるので、IDE(VSCode等)の補完や定義の確認等の機能の恩恵を受けられる
  - 汎用言語としてフル機能が使える
    - jsonやyamlやその他DSLのような関数やロジックを記述する上での制約が少ない
  - PythonやGoなどその他の言語で書くこともできる
- 状態を管理している
  - リソースの差分だけを自動で更新してくれる
  - リソースの依存関係を理解して並列でリソースの作成をするので処理が速い
  - リソースの状態や依存関係を理解しているので関連リソースの安全な削除が可能
- インフラのコードの再利用性のための枠組みがある
  - 今回作成したコードは {% elink aws-ts-two-tier-web - GitHub https://github.com/hinastory/aws-ts-two-tier-web  %}で公開中

自分はずっとインフラに苦手意識を感じていました。その理由は失敗したら簡単には元に戻せないことと、物理的な制約により抽象化が難しいからです。プログラマとしての自分はこれらの理由によりずっとインフラは苦手なままなんだなと思っていました。しかし時は流れてその考えが間違っていたことに気づきました。汎用言語の力を纏い、インフラの煩わしい状態管理からの解放を告げたPulumiの出現により、プログラマのためのIaCがようやく登場したことを確信したのです。

もはやインフラが「ハード」と思われる時代は過ぎ去り、プログラマが柔軟に抽象化し、ライブラリ化し、複雑なインフラ構成をも再利用可能にしていく時代が到来しようとしています。そしてPulumiはその先頭を走るプロダクトであり、自分は多くのPulumiプロジェクトがネット上に公開され、多くのインフラコードのエコシステムが生まれてくることを願って止みません。

本記事が、Pulumiの普及、そしてプログラマのためのIaCの一助になれば幸いです。

## 参考文献

- {% elink Pulumi Documentation https://www.pulumi.com/docs/ %}
- {% elink Pulumi Advances DevOps on AWS - DevOps.com https://devops.com/pulumi-advances-devops-on-aws/ %}
- {% elink Pulumi Crosswalk Aims to Simplify Deploying to AWS - The New Stack https://thenewstack.io/pulumi-crosswalk-aims-to-simplify-deploying-to-aws/ %}
- {% elink Infrastructure as Code - Wikipedia https://ja.wikipedia.org/wiki/Infrastructure_as_Code %}
- {% elink 私は Infrastructure as Code をわかっていなかった - メソッド屋のブログ http://simplearchitect.hatenablog.com/entry/2016/02/18/165917 %}
- {% elink Infrastructure as Code: Chef, Ansible, Puppet, or Terraform? | IBM https://www.ibm.com/cloud/blog/chef-ansible-puppet-terraform %}
- {% elink まだTerraform使ってるの？未来はPulumiだよ | apps-gcp.com https://www.apps-gcp.com/terraform-to-pulumi/ %}
- {% elink Terraform と Pulumiを比較する | apps-gcp.com https://www.apps-gcp.com/terraform-pulumi-comparison/ %}
- {% elink これが次世代プロビジョニングツールの実力か！？ PulumiでAWSリソースを作成してみた ｜ DevelopersIO https://dev.classmethod.jp/cloud/aws/pulumi-aws/ %}
- {% elink Pulumi で AWS Application Load Balancer を構築する - Qiita https://qiita.com/suzuki_sh/items/69abd7bebcda0d1aa6e1 %}
- {% elink 昨今話題?の Pulumi を使ってみた - Qiita https://qiita.com/keiichi-hikita/items/e21713716840aca6292c %}
- {% elink pulumiのチュートリアルをやってみた - Qiita https://qiita.com/sirotosiko/items/91490b22aa39b9705b0a %}
