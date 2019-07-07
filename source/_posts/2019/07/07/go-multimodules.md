---
title: Go Modulesとマルチモジュール構成でGo Homeする方法
thumbnail: /gallery/thumbnails/Go-Logo_LightBlue.png
categories:
  - Tech
  - Language
tags:
  - Go
date: 2019-07-07 07:28:45
---
Go Modulesでマルチモジュールにする方法がわからなくて調べました。発端は単に`go.mod`がある別モジュールのパッケージをインポートしようとしても出来なかったことです。そこで、Go Modulesでマルチモジュールを実現するためのシナリオを説明してみたいと思います。

<!-- more -->

## TL;DR
- Go Modulesは便利なので使おう
- Go Modulesでマルチモジュール化する場合はgo.modファイルで`replace`ディレクティブを使おう

## 目次
<!-- toc -->

## Go Modulesとは

とりあえず、`Go Modules is 何？`という方の為に簡単に説明します。ご存知の方はこの節を飛ばしてください。

Go ModulesはGo 1.11から試験的に導入され、Go 1.13からデフォルトで有効になる予定の新しいパッケージ依存関係の管理方法です。使ってみた実感としてはすでに充分実用的なので新規にプロジェクトを作成する場合はGo Modulesを使って作成することをオススメします。Go 1.12はGo Modulesを有効にするためにはGOPATH以外のパスで作業をするか以下で環境変数を設定します。

```
export GO111MODULE=on
```

この記事ではGo 1.12の前提で解説します。

## Go Modulesで管理を始める

基本はディレクトリを作成して`go mod init <モジュール名>`で始められます、

$ mkdir go-multi-modules
$ cd go-multi-modules
$ go mod init go-multi-modules

`go.mod`というファイルが作成されています。これが依存関係を管理するファイルになります。

{% code go.mod %}
module go-multi-modules

go 1.12
{% endcode %}

### まずは基本のおはようの挨拶から

早速ですが、基本どおり`Hello World`から初めて見ます。ただし、依存関係を入れるために {% elink go-figure https://github.com/common-nighthawk/go-figure %}を利用して挨拶をしてみます。ソースコードは以下の通りです。

{% code lang:go main.go %}
package main

import(
  "github.com/common-nighthawk/go-figure"
)

func main() {
  myFigure := figure.NewFigure("Hello World", "", true)
  myFigure.Print()
}
{% endcode %}

`go build`をすると依存関係があるパッケージがダウンロードされて、ビルドされます。事前に`go get`する必要がないので、これだけでもGo Modulesの良さがわかります。`./go-multi-modules`で実行して無事挨拶ができれば成功です。

{% code lang:sh %}
$ go build
go: finding github.com/common-nighthawk/go-figure latest
$  ./go-multi-modules
  _   _          _   _            __        __                 _       _
 | | | |   ___  | | | |   ___     \ \      / /   ___    _ __  | |   __| |
 | |_| |  / _ \ | | | |  / _ \     \ \ /\ / /   / _ \  | '__| | |  / _` |
 |  _  | |  __/ | | | | | (_) |     \ V  V /   | (_) | | |    | | | (_| |
 |_| |_|  \___| |_| |_|  \___/       \_/\_/     \___/  |_|    |_|  \__,_|
{% endcode %}

`go.mod`ファイルを見てみると`require`の行が追加されて依存関係が追跡されているのが分かります。

{% code go.mod %}
module go-multi-modules

go 1.12

require github.com/common-nighthawk/go-figure v0.0.0-20190529165535-67e0ed34491a
{% endcode %}

また、go.sumというファイルも生成されます。依存関係の管理はgo.modだけでもできますが、`go.sum`は検査用に必要なようです。詳しくは {% elink ここ https://github.com/golang/go/wiki/Modules#should-i-commit-my-gosum-file-as-well-as-my-gomod-file %}を参照してください。

{% code go.sum %}
github.com/common-nighthawk/go-figure v0.0.0-20190529165535-67e0ed34491a h1:kTv7wPomOuRf17BKQKO5Y6GrKsYC52XHrjf26H6FdQU=
github.com/common-nighthawk/go-figure v0.0.0-20190529165535-67e0ed34491a/go.mod h1:mk5IQ+Y0ZeO87b858TlA645sVcEcbiX6YqP98kt+7+w=
{% endcode %}

### おはようの挨拶をパッケージにしてみる

さて、挨拶は毎日するものです。せっかくなので再利用可能なようにパッケージとして分離してみます。`pkg`ディレクトリを作成し[^1]、その下に`hello-world`ディレクトリを作成して、その下に`hello-world.go`ファイルを作成します。ディレクトリ構成は以下の通りです。今回は`helloworld`というパッケージを作成します。

{% code ディレクトリ構成 %}
.
├── go-multi-modules // `go build`で生成された実行ファイル
├── go.mod // `go mod init` で生成されたモジュール管理ファイル
├── go.sum // `go build`で生成されたモジュール管理ファイル（検査用）
├── main.go // メインファイル
└── pkg
    └── hello-world
        └── hello-world.go // 新規追加
{% endcode %}


`hello-world.go`ファイルの中身は以下の通りです。

{% code lang:go hello-world.go %}
package helloworld

import(
	"github.com/common-nighthawk/go-figure"
)

func HelloWorld() {
	myFigure := figure.NewFigure("Hello World", "", true)
  myFigure.Print()
}
{% endcode %}

`main.go`ファイルは以下のように書き換えます。

{% code lang:go hello-world.go %}
package main

import (
	"go-multi-modules/pkg/hello-world"
)

func main() {
	helloworld.HelloWorld()
}
{% endcode %}

`go build`でビルドして`./go-multi-modules`で実行して同じように挨拶ができたら成功です。

[^1]: `pkg`ディレクトリはGo Modulesを使う上で必須ではありませんが、ここでは[Goの標準レイアウト](https://github.com/golang-standards/project-layout)を採用しています。

### Go Homeしようとして失敗する

さて、挨拶も済んだのでもう用はありません。帰宅したくなってきたとします。ただし、帰宅時間まで細かく管理されたくないので別モジュールで管理することを考えます。この場合、`pkg`ディレクトリ配下に`go-home`ディレクトリを作成して、`go-home`ディレクトリに移動してから`go mod init gohome`を実行します。
ディレクトリ構成は以下のようになります。

{% code ディレクトリ構成 %}
.
├── go-multi-modules // `go build`で生成された実行ファイル
├── go.mod // `go mod init` で生成されたモジュール管理ファイル
├── go.sum // `go build`で生成されたモジュール管理ファイル（検査用）
├── main.go // メインファイル
└── pkg
    ├── go-home // このディレクトリ配下は別モジュールになる
    │   ├── go.mod // `go mod init`で生成される
    │   └── home.go // 新規追加
    └── hello-world
        └── hello-world.go // 挨拶パッケージ
{% endcode %}

`go-home`配下の`go.mod`は以下のようになります。初期化しただけなので`require`はありません。

{% code go.mod %}
module gohome

go 1.12
{% endcode %}

`home.go`は以下のようになります。

{% code lang:go home.go %}
package gohome

import("github.com/common-nighthawk/go-figure")

func GoHome() {
	figure.NewFigure("Go Home!", "basic", true).Scroll(30000, 400, "right")
}
{% endcode %}

`main.go`は以下のように書き換えます。

{% code lang:go main.go %}
package main

import (
	"go-multi-modules/pkg/hello-world"
	"go-multi-modules/pkg/go-home"
)

func main() {
	helloworld.HelloWorld()
	gohome.GoHome()
}
{% endcode %}

これをトップディレクトリ(`go-multi-modules`ディレクトリ)で`go build`でビルドしようとしたところ以下のようなエラーが出てうまくいきませんでした。どうやらモジュールの読み込みに失敗したようです。

{% code lang:sh %}
$ go build
build go-multi-modules: cannot load go-multi-modules/pkg/go-home: cannot find module providing package go-multi-modules/pkg/go-home
{% endcode %}

### `replace`のおかげでGo Homeに成功する

解決方法は簡単で親の`go.mod`に以下の`replace`ディレクティブを記述することでした。

`replace go-multi-modules/pkg/go-home => ./pkg/go-home`

`replace`ディレクティブを記述して`go build`をするとビルドが成功します。
以下は`go build`後の`go.mod`です。依存関係(`require`)が追加されています。

{% code go.mod %}
module go-multi-modules

go 1.12

require (
        github.com/common-nighthawk/go-figure v0.0.0-20190529165535-67e0ed34491a
        go-multi-modules/pkg/go-home v0.0.0-00010101000000-000000000000
)

replace go-multi-modules/pkg/go-home => ./pkg/go-home //追加
{% endcode %}


さて、ビルドできたら`./go-multi-modules`で実行してみましょう。一瞬Hello Worldが表示されてその後Go Home!が実行されます。

{% img /gallery/daily/others/go-home.gif 500 %}

我々はようやく成し遂げたのです（笑）。

## なぜ、マルチモジュール化したかったのか？

さて、ここまででマルチモジュール化の方法が分かったわけですが、問題の発端のなぜ自分がマルチプロジェクトにしたかったのかをまだ説明していませんでした。

理由としてはC言語のライブラリをビルドして{% elink cgo https://golang.org/cmd/cgo/ %}で呼び出すモジュールを書いたのですが、makeでビルドする必要があったのでgitのサブモジュールでローカルに取り込もうとして、必然的にマルチモジュールになりました。ただ{% elink 本家のFAQ https://github.com/golang/go/wiki/Modules#should-i-have-multiple-modules-in-a-single-repository  %}では一つのリポジトリに一つのモジュールをススメているので、一般的にはマルチモジュールの採用には慎重になったほうがいいと思われます。

## まとめ

本記事ではGo Modulesにおける「マルチモジュール構成」に焦点を当てて、以下についてストーリ仕立てで解説しました。

- Go Modulesを使って依存関係を管理する方法
- パッケージに分割して呼び出す方法
- マルチモジュール化する方法
- Go Home! する方法[^2]

またこの記事を書くために作成したコードは以下に置きました。

{% linkPreview https://github.com/hinastory/go-multi-modules %}

この記事がGo Modulesを使ってモジュール管理を始めようという方、マルチモジュールで躓いた方の参考になれば幸いです。

[^2]: Go Homeはネタなので優しくスルーして頂けると幸いです。

## 参考文献

- {% elink Using Go Modules - The Go Blog https://blog.golang.org/using-go-modules %}　({% elink 和訳 https://qiita.com/pokeh/items/139d0f1fe56e358ba597  %})
- {% elink Modules · golang/go Wiki · GitHub https://github.com/golang/go/wiki/Modules#faqs--multi-module-repositories  %}
- {% elink Go Modulesの概要とGo1.12に含まれるModulesに関する変更 #golangjp #go112party - My External Storage https://budougumi0617.github.io/2019/02/15/go-modules-on-go112/  %}
- {% elink Go Modules https://qiita.com/propella/items/e49bccc88f3cc2407745 %}