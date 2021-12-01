---
title: サーバーレスワークフローをTypeScriptで作成しよう 〜Step FunctionsとCDKによるLambdaの実行順序制御入門〜
thumbnail: /gallery/thumbnails/ts-sfn-cdk.png
toc: true
categories:
  - Tech
  - CloudNative
tags:
  - CDK
  - AWS
  - StepFunctions
  - TypeScript
  - AdventCalendar
date: 2020-12-08 07:28:45
---
この記事は[AWS Advent Calendar 2020 - Qiita](https://qiita.com/advent-calendar/2020/aws)の8日目の記事です。
(Qiitaの記事と同一です。)

ワークフロー型のアーキテクチャはAWSでよく見られるイベント駆動型のアーキテクチャと補完関係にあるアーキテクチャです。その考え方はシンプルで明示的に実行順序を記述することで処理の流れを表現します。本記事ではサーバーレスの中核を担う **Lambda関数のワークフロー型の実行順序制御** を実現する方法、特に **インフラ構築、ワークフロー作成、関数作成と呼び出しを全てTypeScriptで完結させる方法** について、その実現方法と利点を記載したいと思います。

<!-- more -->
## イベント駆動とワークフロー

最初にイベント駆動型とワークフロー型のアーキテクチャについて簡単に説明します。すでにご存じの方は飛ばしていただいても構いません。

イベント駆動型のシンプルな構成は以下のとおりです。プロデューサがイベントを生成し、ブローカーがイベントを受け取り、コンシューマにイベントを渡します。

{% img /gallery/daily/others/event-driven.png  %}

ここで重要なのはブローカはイベントを貯めてもいいし、フィルタして減らしてもいいし、逆に増やしても構いません。またイベントの宛先であるコンシューマを変えたり、複数のコンシューマにイベントを複製して配っても問題ありません。また、ブローカを多段に構成することもできます。要はプロデューサとコンシューマの間にイベントを自由に扱えるブローカをいくつも挟んで良い（挟まなくてももちろんOK）というのがこのアーキテクチャの肝であり、柔軟性やスケーラビリティの根源になっています。

対してワークフロー型は以下のように処理の順番が明白に決まっており処理順序は分かりやすいですが、イベント駆動型ほどの柔軟性はありません。

{% img /gallery/daily/others/workflow.png  %}

一般的には処理順序の分かりやすさやデバッグのしやすさを優先するならワークフロー型が適しており、柔軟性やスケーラビリティが必要であればイベント駆動型が適しておりお互いに補完関係にあるアーキテクチャだと言うことができます[^1]。

AWSはアーキテクチャとしてスケーラブルな非同期分散処理に力を入れてきたのでイベント駆動型のアーキテクチャを支えるサービス（SQS, SNS, EventBridge, Kinesis, MQ, MSK等）が充実しています。しかし近年はStep Functionsの登場によりワークフロー型のアーキテクチャも広く使われるようになってきました[^2]。


[^1]: この観点はあくまで利用者側の視点です。実装的にはワークフロー型の方が複雑になりやすく、ワークフローの可視化も望まれるので色々と難しい面が多いです。
[^2]: ワークフロー型を実現したサービスとしてAmazon SWFもありますが、新規の利用には推奨されていないので本記事では割愛します。

## サーバーレスワークフローとは

サーバーレスは **EC2のような仮想サーバを使わずにアプリケーションを開発するアーキテクチャ** のことを指しますが、慣習的にはSaaSをLambda(FaaS)で連携させたり補完したりしてアプリケーションを構築するアーキテクチャを指します。サーバーレスワークフローは **そのサーバーレスにワークフロー制御のSaaSであるStep Functionsを加えてワークフロー制御を実現したアーキテクチャ** になります。

## Step Functionsの弱点

Step Functionsの弱点は端的に言うとワークフローのビジュアルエディターが公式にはリリースされていないことです[^3]。ワークフローを作成・編集するには[Amazon ステートメント言語](https://docs.aws.amazon.com/ja_jp/step-functions/latest/dg/concepts-amazon-states-language.html)(ASL)というJSONベースの言語で記述する必要があります。だたJSONで記述したワークフローの可視化は行えます。以下はAWS公式のサンプルのHelloWorldのステートマシンをStep Functionsのグラフインスペクターで可視化したものです。

{% img /gallery/daily/others/hello-world-stepfunctions.png  %}

上記のワークフローをASLで記述したものが以下になります。さすがにこれを記述するのは厳しいと感じる方が多でしょう。

{% code lang:json %}
{
  "Comment": "A Hello World example demonstrating various state types of the Amazon States Language",
  "StartAt": "Pass",
  "States": {
    "Pass": {
      "Comment": "A Pass state passes its input to its output, without performing work. Pass states are useful when constructing and debugging state machines.",
      "Type": "Pass",
      "Next": "Hello World example?"
    },
    "Hello World example?": {
      "Comment": "A Choice state adds branching logic to a state machine. Choice rules can implement 16 different comparison operators, and can be combined using And, Or, and Not",
      "Type": "Choice",
      "Choices": [
        {
          "Variable": "$.IsHelloWorldExample",
          "BooleanEquals": true,
          "Next": "Yes"
        },
        {
          "Variable": "$.IsHelloWorldExample",
          "BooleanEquals": false,
          "Next": "No"
        }
      ],
      "Default": "Yes"
    },
    "Yes": {
      "Type": "Pass",
      "Next": "Wait 3 sec"
    },
    "No": {
      "Type": "Fail",
      "Cause": "Not Hello World"
    },
    "Wait 3 sec": {
      "Comment": "A Wait state delays the state machine from continuing for a specified time.",
      "Type": "Wait",
      "Seconds": 3,
      "Next": "Parallel State"
    },
    "Parallel State": {
      "Comment": "A Parallel state can be used to create parallel branches of execution in your state machine.",
      "Type": "Parallel",
      "Next": "Hello World",
      "Branches": [
        {
          "StartAt": "Hello",
          "States": {
            "Hello": {
              "Type": "Pass",
              "End": true
            }
          }
        },
        {
          "StartAt": "World",
          "States": {
            "World": {
              "Type": "Pass",
              "End": true
            }
          }
        }
      ]
    },
    "Hello World": {
      "Type": "Pass",
      "End": true
    }
  }
}
{% endcode %}

従ってASL使わずに楽にワークフローを構築したいのですが、その選択肢の一つが本記事で紹介したいAWS CDKを利用したTypeScriptによるワークフローの構築になります。TypeScriptで記述することにより型の補完が使えたり、CDKがワークフローを抽象化してくれていたりするので生のJSONよりも大分書きやすくなっています。

AWS CDKについて簡単に補足すると、AWS CDKは、使い慣れたプログラミング言語を使用してクラウドアプリケーションリソースを定義するためのソフトウェア開発フレームワークです。CDKはいくつかのプログラミング言語をサポートしていますが、本記事ではTypeScriptを用います。

[^3]: 一応、公式外では次のようなdraw.ioを用いたワークフローのエディタもあるみたいです。　[sakazuki/step-functions-draw.io](https://github.com/sakazuki/step-functions-draw.io)

## サーバーレスワークフローをTypeScriptで作成しよう

### セットアップ

前提条件としてAWS CLIのセットアップとNode.jsのインストールは済んでいるものとします。

まず、CDKをインストールします。

{% code lang:bash %}
$ npm install -g aws-cdk
{% endcode %}

次にTypeScriptをインストールします。

{% code lang:bash %}
$ npm install -g typescript
{% endcode %}

アプリケーションのディレクトリを作成します。

{% code lang:bash %}
$ mkdir cdk-sfn
$ cd cdk-sfn
{% endcode %}

TypeScriptで初期アプリを作成します。

{% code lang:bash %}
$ cdk init app --language typescript
{% endcode %}

これでセットアップは完了です。

### 初めてのワークフローの作成から実行まで

ワークフローはcdk-sfn-stack.tsに書いていきます。コード編集にはVisualStudio Code等を用います。
以下が初期のファイルで、とりあずはコンストラクタにガシガシ書いていきます。

{% code lang:typescript lib/cdk-sfn-stack.ts %}
import * as cdk from '@aws-cdk/core';

export class CdkSfnStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
  }
}
{% endcode %}

コードを書き始める前に依存関係のあるライブラリをインストールしておきます。

{% code lang:bash %}
$ npm install @aws-cdk/aws-stepfunctions
{% endcode %}

次のコードは空の処理を３つ逐次実行するワークフローです。空の処理は`sfn.Pass`で作成し、`next`メソッドで繋いでいきます。

{% code lang:typescript %}
import * as cdk from "@aws-cdk/core";
import * as sfn from "@aws-cdk/aws-stepfunctions";

export class CdkSfnStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const start = new sfn.Pass(this, "Start", {});
    const step1 = new sfn.Pass(this, "Step 1", {});
    const end = new sfn.Pass(this, "End", {});

    const definition = start.next(step1).next(end);  // 処理を順番に繋ぐ

    const stateMachine = new sfn.StateMachine(this, "cdk-sfn-state-machine", {
      stateMachineName: "cdk-sfn-state-machine",
      definition,
    });
  }
}
{% endcode %}

`deploy`コマンドでAWS上にStep Functionsをデプロイします。以下ターミナルから実行するとしばらくしてデプロイが完了します。

{% code lang:bash %}
$ cdk deploy
{% endcode %}

AWSマネジメントコンソールから**「cdk-sfn-state-machiene」**ステートマシーンが作成されていることを確認します。

{% img /gallery/daily/others/sfn-ex-1.png  %}

対象をクリックしてステートマシンを開いた後に以下の赤枠で囲った「実行の開始」ボタンを押して実行します。

{% img /gallery/daily/others/sfn-ex-2.png  %}

以下の実行開始ダイアログが出るので`「実行の開始」`を押して実行開始します。

{% img /gallery/daily/others/sfn-ex-3.png  %}

実行が完了したら以下の画面が表示されます。「Start」 →　「Step 1」 →　「End」というワークフローが実行されていることがわかると思います。

{% img /gallery/daily/others/sfn-ex-4.png  %}

### Step1をLambda関数に変更してみる

次にStep1をLambda関数にしてみたいと思います。Lambda関数は受け取ったJSONに格納された名前に対して挨拶するものとします。

まずは関連モジュールをインストールします。インストールする「aws-lambda-nodejs」はTypeScriptをビルドしてLambda関数を作成してくれる便利なものですが、注意点が２つあってまだ実験的なモジュールであることと、利用にはDockerが必要になることです。

{% code lang:bash %}
$ npm install @aws-cdk/aws-stepfunctions-tasks @aws-cdk/aws-lambda-nodejs @types/aws-lambda
{% endcode %}

Lambda関数は`labmbda/hello`というディレクトリを作成し、その下に`index.ts`という名前で以下のLambda関数を作成します。

{% code lang:typescript lambda/hello/index.ts %}
import * as lambda from "aws-lambda";

export async function handler(
  event: Event,
  context: lambda.Context,
  callback: lambda.Callback
) {
  return `hello ${event.name}`;
}

type Event = {
  name: string;
};
{% endcode %}

そして、ワークフローの中身を以下のように書き換えます。変化している箇所はLambda関数をソースの場所を指定して作成していることと、そのLambda関数を呼び出すStep Functionsのタスクを作成しているところです。注目すべきは`Start`の出力結果としてJSONオブジェクトを生成しているところです。Step Functionsでは前の処理の出力結果を次の処理の入力として利用することができます。

{% code lang:typescript %}
import * as cdk from "@aws-cdk/core";
import * as sfn from "@aws-cdk/aws-stepfunctions";
import * as tasks from "@aws-cdk/aws-stepfunctions-tasks";
import { NodejsFunction } from "@aws-cdk/aws-lambda-nodejs";

export class CdkSfnStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const start = new sfn.Pass(this, "Start", {
      result: sfn.Result.fromObject({ // 次のタスクのインプットとしてにJsonオブジェクト(`{"name": "hinastory"}`)を渡す
        name: "hinastory",
      }),
    });

    const helloFunc = new NodejsFunction(this, "hello", { // Lambda関数の作成
      entry: "lambda/hello/index.ts",
      handler: "handler",
    });

    const helloTask = new tasks.LambdaInvoke(this, "helloTask", { // Lambda関数を呼び出すタスクの作成
      lambdaFunction: helloFunc,
      payloadResponseOnly: true,
    });

    const end = new sfn.Pass(this, "End", {});

    const definition = start.next(helloTask).next(end);

    const stateMachine = new sfn.StateMachine(this, "cdk-sfn-state-machine", {
      stateMachineName: "cdk-sfn-state-machine",
      definition,
    });
  }
}
{% endcode %}

ここまで定義は完成です。このあとは前回と同じように`cdk deplory`をしてステートマシンを実行してみてください。
以下のようにグラフインスペクターのビジュアルの「helloTask」をクリックして、「ステップ出力」のタブで「"hello hinastory"」が出力されていたら成功です。

{% img /gallery/daily/others/sfn-hello-task.png  %}

ここまでがStep Functionsの基本となります。あとはStep Functions分岐や繰り返し、並列処理等さまざま部品が用意されているのでそれらを用いて様々なワークフローが定義できます。

### 応用編

次はちょとした応用編です。S3にテスト用のzipファイルをアップロードして、lambda関数でs3内のディレクトリを探し、さらにそのディレクトリの中にあるzipファイルを並列に処理するサンプルです。ちょっと何言っているかわからないかもしれませんが、ワークフローは以下のようになります。

{% img /gallery/daily/others/sfn-advanced-state-machine.png  %}

s3のバケット内に含まれるオブジェクトまたはディレクトリをリストするLambda関数は以下のとおりです。

{% code lang:typescript lambda/list-s3/index.ts %}
import * as lambda from "aws-lambda";
import * as aws from "aws-sdk";
import { delimiter } from "path";

export async function handler(
  event: Event,
  context: lambda.Context,
  callback: lambda.Callback
) {
  console.log(event);
  const s3 = new aws.S3();
  const params: aws.S3.ListObjectsV2Request = event.location;
  const res = await s3.listObjectsV2(params).promise();
  console.log(res);
  return res;
}

type Event = {
  location: {
    Bucket: string;
    Prefix: string;
  };
};
{% endcode %}

そしてテストデータをアップロードして実際のワークフローを構築するコードが以下です。ポイントはS3内のオブジェクトをラムダ関数で一覧化し、そのデータでMapを用いて動的な並列処理を実行しているところです。

{% code lang:typescript %}
import * as cdk from "@aws-cdk/core";
import * as sfn from "@aws-cdk/aws-stepfunctions";
import * as tasks from "@aws-cdk/aws-stepfunctions-tasks";
import { NodejsFunction } from "@aws-cdk/aws-lambda-nodejs";
import * as s3 from "@aws-cdk/aws-s3";
import { BlockPublicAccess } from "@aws-cdk/aws-s3";
import * as s3deploy from "@aws-cdk/aws-s3-deployment";
import { RemovalPolicy } from "@aws-cdk/core";
import * as lambda from "@aws-cdk/aws-lambda";
import * as iam from "@aws-cdk/aws-iam";

export class CdkSfnStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this.createWorkLoad("sfn-s3-test");
  }

  // S3にテスト用のZIPファイルをアップロードする。ローカルのassets/test/配下にはテスト用のZIPファイルをいくつか置いておく
  // ファイルは指定したバケットのdestinationKeyPrefix配下にアップロードされる
  // この機能は"@aws-cdk/aws-s3-deployment"を使っているがまだExperimentalなので留意すること
  private createTestData(bucketName: string) {
    const bucket = new s3.Bucket(this, bucketName, {
      bucketName: bucketName,
      removalPolicy: RemovalPolicy.DESTROY,
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
    });

    new s3deploy.BucketDeployment(this, "deploy1", {
      sources: [s3deploy.Source.asset("assets/test")],
      destinationBucket: bucket,
      retainOnDelete: false,
      destinationKeyPrefix: "private/aaa/001",
    });

    new s3deploy.BucketDeployment(this, "deploy2", {
      sources: [s3deploy.Source.asset("assets/test")],
      destinationBucket: bucket,
      retainOnDelete: false,
      destinationKeyPrefix: "private/aaa/002",
    });

    new s3deploy.BucketDeployment(this, "deploy3", {
      sources: [s3deploy.Source.asset("assets/test")],
      destinationBucket: bucket,
      retainOnDelete: false,
      destinationKeyPrefix: "private/bbb/023",
    });
  }

  private createWorkLoad(stackPrefix: string) {
    const bucketName = `${stackPrefix}-sfn-test`;
    const first = new sfn.Pass(this, "First", {
      result: sfn.Result.fromObject({
        Bucket: bucketName,
        Prefix: "private/",
        Delimiter: "/",
      }),
      resultPath: "$.location",
    });

    this.createTestData(bucketName);

    const listObjects = new NodejsFunction(this, "list-s3", {
      entry: "lambda/list-s3/index.ts",
      handler: "handler",
    });

    listObjects.addToRolePolicy(
      new iam.PolicyStatement({
        resources: ["*"],
        actions: ["s3:*"],
      })
    );

    const listFirstDirTask = new tasks.LambdaInvoke(this, "listFirstDirTask", {
      lambdaFunction: listObjects,
      payloadResponseOnly: true,
    });

    const firstDirMap = new sfn.Map(this, "firstDirMap", { // 動的な並列処理
      maxConcurrency: 3,
      itemsPath: sfn.JsonPath.stringAt("$.CommonPrefixes"),
    });

    const testLambda = lambda.Function.fromFunctionArn(
      this,
      "test-func",
      "arn:aws:lambda:ap-northeast-1:071000381825:function:cats-cats-cats" // 定義済みのLambda関数の呼び出し
    );

    const listPayload = sfn.TaskInput.fromObject({
      location: {
        Bucket: bucketName,
        Prefix: sfn.JsonPath.stringAt("$.Prefix"),
        Delimiter: "/",
      },
    });

    const testTask = new tasks.LambdaInvoke(this, "testLambda", {
      lambdaFunction: testLambda,
      payloadResponseOnly: true,
    });

    const listSecondDirTask = new tasks.LambdaInvoke(
      this,
      "listSecondDirTask",
      {
        lambdaFunction: listObjects,
        payload: listPayload,
        payloadResponseOnly: true,
      }
    );

    const secondDirMap = new sfn.Map(this, "secondDirMap", { // 動的な並列処理
      maxConcurrency: 3,
      itemsPath: sfn.JsonPath.stringAt("$.CommonPrefixes"),
    });

    const done = new sfn.Pass(this, "Done", {});

    const definition = first
      .next(listFirstDirTask)
      .next(firstDirMap)
      .next(done);

    firstDirMap.iterator(
      listSecondDirTask.next(secondDirMap.iterator(testTask))
    );

    const stateMachine = new sfn.StateMachine(
      this,
      `${stackPrefix}-state-machine`,
      {
        stateMachineName: `${stackPrefix}-state-machine`,
        definition,
      }
    );
  }
}
{% endcode %}

## インフラ構築(CDK)とワークフロー作成(StepFunctins)と関数作成(Lmabda)をアイソモーフィックにする利点

アイソモーフィックとは「同型」という意味です。この記事ではインフラ構築(CDK)とワークフロー作成(StepFunctins)と関数作成(Lmabda)を同じ言語で作成することを指しています。例えば、インフラ構築をCloudFormation(YAML)で行い、StepFunctionsのフローをASL(JSON)で記述し、Lambda関数をPythonで記述するとします。この場合３つの異なる言語の習得が必要となり、仮に習得できたとしても実作業においてコンテキストスイッチのオーバーヘッドが高く、作業効率が格段に落ちます。

このような場合に本記事のようにTypeScriptでアイソモーフィックにすることで、ストレスなく開発ができ開発体験がかなり向上します。またTypeScript以外でもCDKとLambdaがサポートしている言語であれば同じ言語にしやすいと思うのでぜひ試してみてください。

## まとめ

サーバレスワークフローの紹介とCDKとTypeScriptを用いたワークフローの構築方法を紹介しました。StepFunctionsとLambdaはとても相性が良く、サーバレスアプリケーションを簡単に実行制御できる便利な道具なので、色々な場で活躍できると思い紹介しました。本記事で紹介したコードもGitHubに公開したのでご利用ください。

<a href="https://github.com/hinastory/cdk-step-functions-sample"><img src="https://github-link-card.s3.ap-northeast-1.amazonaws.com/hinastory/cdk-step-functions-sample.png" width="460px"></a>

本記事がサーバレスワークフローに興味がある方の一助になれば幸いです。

## おまけ

[Rust 2 Advent Calendar 2020 - Qiita](https://qiita.com/advent-calendar/2020/rust2)の6日目で、[RustとLambdaの相性が良い7つの理由 〜RustでLambdaをやっていく〜](https://zenn.dev/hinastory/articles/b603b76bf01ccc)という記事も書いています。興味があれば御覧ください。



