---
title: 無料でRustのJupyterLab機械学習環境を作る in AWS
thumbnail: /gallery/thumbnails/rust-sagemaker-studio-lab.png
toc: true
categories:
  - Tech
  - MachineLearning
tags:
  - AWS
  - MachineLearning
  - Rust
  - Jupyter
date: 2021-12-23 07:28:45
---

この記事は[Rust Advent Calendar 2021](https://qiita.com/advent-calendar/2021/rust)の23日目の記事です。

Rustで機械学習をやってみたいという方は少数派かもしれません。PythonやRの環境が圧倒的過ぎて他の追随を許さないからです。しかしそれが**タダで手に入る**となったらいかがでしょうか？　ブラウザだけでどこでも利用できるRustの機械学習環境を**クラウド上に**持てるのであれば試す価値があるかもしれません。本記事では**Amazon SageMaker Studio Lab**を利用して、無料でRustの機械学習環境を作る方法にチャレンジします。

<!-- more -->

## はじめに

本記事では**Amazon SageMaker Studio Lab**を利用して、Rustの機械学習環境を構築する試みを紹介します。無料のJupyterLab環境をRustで利用しようという狙いです。

{% blogCard  https://aws.amazon.com/jp/blogs/news/now-in-preview-amazon-sagemaker-studio-lab-a-free-service-to-learn-and-experiment-with-ml/ %}

単にJupyter Notebookの環境が欲しいだけならVisual Studio Codeでも[対応しています](https://code.visualstudio.com/docs/datascience/jupyter-notebooks)し、Googleの[Colaboratory](https://research.google.com/colaboratory/)というサービスもあります。しかし**高機能で拡張可能なJupyterLabの最新の3系バージョン**を試せるとなると話が違ってきます。しかも**GPUインスタンス**も選択できるという太っ腹です。最強のNotebook環境を**無料でクラウド上に**維持できるのなら試してみない手はありません。

**Amazon SageMaker Studio Lab**はPythonやRで機械学習の定番環境を構築するのは簡単なのですが、**Rust**をJupyterLabで利用できるようにするのには苦戦しました。それは**sudo**や**Root**アカウントが利用できないからです。本記事ではその辺りを乗り越えつつ、Rustで利用できる機械学習クレートを紹介していきます。

# Amazon SageMaker Studio Labとは

**Amazon SageMaker Studio Lab**は[AWS re:Invent 2021](https://aws.amazon.com/jp/about-aws/events/2021/reinvent/)で発表された、無料で利用できる機械学習環境です[^1]。メールアドレス一つで簡単に利用登録できるオンラインの機械学習環境であり、クレジットカードの登録もいりません。　具体的な利用条件や環境は以下のとおりです。

[^1]: **Amazon SageMaker Studio Lab** はAWS re:Invent 2021で発表されましたが、正確にはAWSのアカウントなしで使えるのでAWSのサービスではありません。しかし既存のAWSのサービスであるSageMakerとの関連も深く、 **「AWS re:Invent」** で発表されたということもあり、タイトルには **「in AWS」** と付けさせて頂きました。

- 利用について
    - クレジットカードの登録はいらない
    - AWSのアカウントもいらない
    - 必要なのはメールアドレスのみ
- 利用対象者
    - データサイエンティスト、エンジニア、科学者、教師、学生
- 利用目的
    - Jupyterノートブックを使用したディープラーニングの学習または実験
        - **言語の制限はないのでRustも問題なし!**
    - 本番タスクには使用してはならない
        - 会社での利用でもディープラーニングの学習や実験のためであれば問題ないが、業務用の本番環境としての利用は駄目だということだと思われる
- インスタンスについて
    - CPUインスタンス・GPUインスタンスが選択できる
    - CPUインスタンス
        - 1セッションで**12時間**の利用が可能
        - T3.xlargeインスタンス
    - GPUインスタンス
        - 1セッションで**4時間**の利用が可能
        - G4dn.xlargeインスタンス
    - インスタンスは**x86_64のAmazonLinux**ベース
- セッションで利用可能な時間が過ぎると自動でインスタンスが終了する
    - **1回終了しても手動ですぐに再開可能**
    - **残りの利用時間は起動ページに表示されている**
    - **インスタンスを一旦手動でストップして、再開すれば残りの利用時間はリセットされる**
- 環境のカスタマイズ
    - `pip`と`conda`が利用可能
    - `git`が利用可能
    - `sudo`,`apt`は利用できない
    - **JupyterLab や Jupyter Server拡張をインストール可能**
- メモリ・ストレージ
    - **15GBの永続ストレージ**と**16GBのRAM** 
- 暗号通貨をマイニングできますか？
    - 禁止です。違反したら垢BANされます。

さらに詳しく知りたい方は以下のFAQもご確認ください。

{% blogCard https://studiolab.sagemaker.aws/faq %}

## Amazon SageMaker Studio Labの利用方法

まずはAmazon SageMaker Studio Labのアカウントを取得します。以下のページの`Request free account`ボタンを押してください。

{% blogCard https://studiolab.sagemaker.aws %}

以下のような入力フォームが出ますが、必須はEメールアドレスだけです。入力完了したら`Submit request`ボタンを押してアカウントの要求を行います。

![](https://storage.googleapis.com/zenn-user-upload/a16efb9109b2-20211222.png)

しばらくするとEメールアドレスの確認メールが飛んできます。メールの`Veryfy email`ボタンで確認を行うと、「Account request confirmed」というタイトルのメールが飛んできて、アカウント要求が受け付けられます。ここから作成されるまでには**1〜5営業日**かかります。私の場合は翌日に利用可能になりました。「Your account is ready」というタイトルのメールが来るのでサインインを行って利用が開始できます。サインイン後の画面は以下のとおりです。CPUインスタンスかGPUインスタンスを選択して、`Start Runtime`を押すことでインスタンスが開始します。

![](https://storage.googleapis.com/zenn-user-upload/993d4b511fee-20211222.png)

しばらくするとランタイムが利用可能になるので`Open Project`を押すと別タブでJupyterLabの画面を開くことができます。「Getting Started.ipynb」というノートブックには利用方法が書いてあります。(`hinastory`というディレクトリは私が作成したものです)
s

![](https://storage.googleapis.com/zenn-user-upload/64ee04fc7019-20211222.png)

## JupyterLabでRustを利用可能にする

ここからがこの記事の本番です。赤枠で囲った`+`ボタンをクリックするとLancherタブが開きますが、デフォルトでは`default:Python`と書かれたPython環境だけが利用可能なことが分かります。目的はここにRust環境を表示させることです。

![](https://storage.googleapis.com/zenn-user-upload/74b28056e84f-20211222.png)

### Rustのインストール

まずはLancherから`Terminal`ボタンをクリックし、ターミナルを立ち上げます。

![](https://storage.googleapis.com/zenn-user-upload/c61543496c5a-20211222.png)

Rustの[インストール](https://www.rust-lang.org/ja/tools/install)は以下で可能です。

```sh
$ curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

さらに以下を実行することで現行のシェルにPATHを通すことができます。
```sh
$ source $HOME/.cargo/env
```

### evcxr_jupyterのインストール

RustをJupyterLabから利用可能にするためには`evcxr_jupyter`のインストールが必要です。

{% blogCard https://github.com/google/evcxr/blob/main/evcxr_jupyter/README.md %}

ただここで一つ問題が起こります。インストールに`cmake`が必要でこれを`apt`でインストールせよとあります。しかしSageMaker Studio Labの環境ではsudoもRootアカウントも使えないので別の方法でインストールする必要があります。

幸いにも`conda`に`cmake`があったので`conda`で`cmake`をインストールした後に`evcxr_jupyter`をインストールします。

```sh
$ conda install cmake
$ rustup component add rust-src
$ cargo install evcxr_jupyter
$ evcxr_jupyter --install
```

さて、ここまですればJupyterLabのランチャーにRustのボタンが現れてくれるはずでしたが、残念ながら**表示はされませんでした。**

### RustカーネルがJupyterLabで利用できない原因を色々調べる

とりあえず`jupyter kernelspec list`で表示してみるとRustカーネルは認識されているみたいですが、なぜかJupyterLabからは表示されないし、カーネルも選択できない状態でした。

```sh
(studiolab) studio-lab-user@default:~$ jupyter kernelspec list
[ListKernelSpecs] WARNING | Config option `kernel_spec_manager_class` not recognized by `ListKernelSpecs`.
Available kernels:
  rust       /home/studio-lab-user/.local/share/jupyter/kernels/rust
  python3    /home/studio-lab-user/.conda/envs/studiolab/share/jupyter/kernels/python3
(studiolab) studio-lab-user@default:~$ 
```

よくよく調べてみると`conda`で環境を作成して`ipykernel`を`conda`でインストールすればJupyterLabに認識させられるとのことだったので、とりあえずそこに突破口がありそうでした。

### 最終的にうまくいった方法

大分苦戦しましたが以下がうまく行った方法です。

```sh
$ conda create -n <my-rust-env>
$ mkdir -p ~/.conda/envs/<my-rust-env>/share/jupyter/kernels
$ cp -rf ~/.local/share/jupyter/kernels/rust  ~/.conda/envs/<my-rust-env>/share/jupyter/kernels
$ ln -s ~/.cargo/bin ~/.conda/envs/<my-rust-env>/bin
```

まずはcondaで新しい環境を作成し、Rustカーネルをその環境下にコピーします。ただこれだけだとJupyterLabにRust環境のbinへのパスが通らないので無理やりシンボリックリンクを貼りました。ここまでの作業を実施しランチャーを開くとRustの環境が追加されていることが分かります。（ランチャーに表示されるまでには１分程かかりました）

![](https://storage.googleapis.com/zenn-user-upload/0828588026f3-20211222.png)

とりあえずこれで動きましたが、注意点としてはシンボリックリンクで`bin`を無理やり書き換えているのでこの環境にアクティベートして`conda　install`すると`~/.cargo/bin`配下に`conda`のバイナリがインストールされてしまうことです。

もっとスマートなやり方があるとは思っていますが、とりあえず今回はこれでRustの機械学習環境の構築を完了とします。

## Rustで使える機械学習関連のクレート紹介

ここからはRustで利用可能な機械学習関連のクレートをノートブックの実行結果で紹介していきたいと思います。

### ベクトル、行列を扱う - ndarray

まずは[ndarray](https://github.com/rust-ndarray/ndarray)クレートを使ってベクトル、行列を表示してみます。`ndarray`はPythonでいう`numpy`相当です。以下がノートブックの実行結果です。見て頂くと大体どんな雰囲気で利用できるかご理解頂けるとおもいます。

![](https://storage.googleapis.com/zenn-user-upload/28589f19f607-20211222.png)

いくつか補足しますと`:dep`は`evcxr_jupyter`の組み込みのコマンドでRustのクレートを`cargo`コマンドでインストールすることなしにノートブックで利用できます。この機能は超絶便利で他のノートブックに干渉しないのも魅力です。しかし毎回クレートのビルドが走るのでクレートによっては超絶重いのは覚悟してください。

あと`showata`というクレートも利用していますがこれは`ndarray`の出力をJupyterLabできれいに出力するためのものです。

### データフレームを扱う - polars

次は[polars](https://github.com/pola-rs/polars)クレートを用いてデータフレームを利用してみたいと思います。`polars`はPythonの`pandas`相当です。`pandas`を利用したことがある方であれば以下の実行結果はなんとなくわかるのではないかと思います。

![](https://storage.googleapis.com/zenn-user-upload/29a506d528a8-20211222.png)

![](https://storage.googleapis.com/zenn-user-upload/ad39929d672d-20211222.png)

表がアスキーアートなのがイケていませんがevcxr_jupyterでは[カスタム出力](https://github.com/google/evcxr/blob/main/evcxr_jupyter/README.md#custom-output)ができるので、簡単にHTMLで表示するようにできそうです。

### グラフを扱う - plotters

データフレームの次は定番のグラフ描画に行きたいと思います。Rustではグラフ描画のクレートはいくつかあるのですがここでは[plotters](https://github.com/38/plotters)クレートを利用します。`plotters`はPythonのMatplotlib相当です。以下はplottersのサンプルを実行したものです。

![](https://storage.googleapis.com/zenn-user-upload/1547276c237b-20211222.png)

![](https://storage.googleapis.com/zenn-user-upload/7ce5775706cc-20211222.png)

![](https://storage.googleapis.com/zenn-user-upload/0982bd18d0ac-20211222.png)

ここまででRustの機械学習関連のクレートの紹介はおしまいです。本当はもっと色々試すつもりだったのですが今回は時間がなかったのでまた次の機会に記事にしてみたいと思います。

## おまけ

Rustで機械学習の記事としては中途半端になってしまったお詫びにRustをJupyterLabで利用するにあたって超絶に便利な機能を3つほどご紹介します。

### :dep

最初はすでにご紹介した`:dep`です。ノートブックの途中で好きなクレートを読み込むことができます。この機能は非常に便利ですが、裏ではライブラリのダウンロードとビルドが走るので激重です。Jupyterカーネルを再起動するとダウンロードとビルドがまた走るのでキャッシュみたいなことはしていないようです。

```
:dep showata = { version = "0.3.2", features=["show_ndarray"]}
:dep ndarray = "0.14"
```

### :vars

`:vars`は現在利用している変数を表示してくれます。型も表示してくれるので非常に重宝します。

![](https://storage.googleapis.com/zenn-user-upload/3fa98d43fa06-20211223.png)

ちなみにJupyterLab 3.0から標準搭載された**ビジュアルデバッガ**は非常に便利で変数表示はもちろん**ブレークポイント**や**コールスタック**表示もできるのですが、Rustでは現状**ビジュアルデバッガは使えません**。Pythonを使うときにはぜひお試しください。

### :timing

`:timing`はセルの実行時間を実行結果とともに表示してくれます。ちょっと時間を計測したいときには便利に使えます。トグル式なので一回実行するとその後のセルも実行時間が表示されます。もう一度`:timing`を実行するとオフにできます。

![](https://storage.googleapis.com/zenn-user-upload/b89c71bc6ba5-20211223.png)

## まとめ

本記事ではAWS re:Invent 2021で発表された**Amazon SageMaker Studio Lab**を利用して無料でRustの機械学習環境を手に入れる方法を紹介しました。またRustの機械学習関連のクレートである**ndarray**(numpy相当)、**polars**(pandas相当)、**plotters**(matplotlib相当)を紹介し、ノートブックの実行結果をお見せしました。おまけとしてはJupyterLabでRustを利用するときに死ぬほど便利な`:dep`、`:vars`、`:timing`もご紹介しました。この記事で紹介したノートブックはGitHubに上げたので興味がある方はご覧ください。

{% blogCard https://github.com/hinastory/rust_ml_notebook_sample/blob/main/rust_ml_base.ipynb %}

本当は**TensorflowのRustバインディング**も試してGPUインスタンスの性能チェックまで行ってみたかったのですが、意外とRustをAmazon SageMaker Studio Labで利用するまでに時間を使いすぎてしまったため、タイムアップとなってしまいました。機会があればそちらの方も継続してチャレンジして記事にしてみたいと思います。

最後になりましたが**Amazon SageMaker Studio Lab**は本当に素晴らしい環境です。Rust環境の作成には多少苦労しましたが、**PythonやR**の機械学習環境としては申し分ないと思います。まだプレビュー版ですが、**JupyterLab　3.0**でカスタマイズ性も高く**GPUを無料**で自由に触れる砂場としては**最高の環境**なので、これからがっつり遊び倒していきたいと思います。

本記事がAmazon SageMaker Studio LabやRustで機械学習に興味がある方の一助になれば幸いです。

