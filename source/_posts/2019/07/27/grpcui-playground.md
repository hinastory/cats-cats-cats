---
title: gRPC UIを使ってみんなが触れるgRPCの遊び場を作りました
thumbnail: /gallery/thumbnails/grpc-horizontal-color.png
categories:
  - Tech
  - Miscellaneous
tags:
  - gRPC
  - Go
date: 2019-07-27 07:28:45
---
`gRPC`は近年非常によく使われるようになったRPCフレームワーク[^1]ですが、その柔軟なメッセージフォーマットに対応するリッチなGUIクライアントに欠けていました。REST APIでいう{% elink Postman https://www.getpostman.com/ %}的な存在です。このようなツールがなければgRPCを利用した開発が面倒なのですが、その問題は現在においてはほぼ払拭されたといっても過言ではありません。{% elink gRPC UI https://github.com/fullstorydev/grpcui %}が登場したからです。

(2019/10/4 追記)
gRPC UI playgroundの運用に利用していたArukasが2020年1月31日で{% elink 終了 https://arukas.io/updates/20190930-terminate-of-service/ %}するようです。今後gRPC UI playgroundをどうするかは検討中です。

(2020/2/2 追記)
gRPC UI playgroundの運用に利用していたArukasが2020年1月31日で終了したので、gRPC UI playgroundを以下の場所に移動しました。

- http://grpcui.hinastory.com

[^1]: RPC(Remote Procedure Call)は、簡単に言えばプログラムの中から内部の関数を呼ぶのと似たような感覚で、外部のネットワーク上の関数や手続きを呼べるようにする技術のことです。他のRPCにはSOAPやJSON-RPCなどがあります。

<!-- more -->

## 目次
<!-- toc -->

## TL;DR

- gRPC UIで作成した遊び場はこちらです :point_right: {% elink  gRPC UI playground http://grpcui.hinastory.com %}
- gRPC UIはgRPCサーバへの要求と応答がWebで簡単にできるので、今後のgRPCを利用した開発に広く使われるツールとなりそうです
- gRPC UI playground´は以下のサービスを利用して、無料で立ち上げました。当面はみんなが遊べるようにしておくつもりです
  - {% elink GitHub https://github.com/ %}
  - {% elink Docker Hub https://hub.docker.com/ %}
  - {% elink Arukas https://arukas.io/ %}
- Arukasは正式に終了しました。Arukas関連の説明はそのままにしておきますが試すことはできません。gRPC UI playgroudは以下の場所に移転して稼働させています。
  - http://grpcui.hinastory.com


## はじめに

本記事は`gRPC`のWeb UIである`gRPC UI`の紹介記事です。gRPCに興味がある方、gRPCを利用している方を対象にしています。実際にgRPC UIを触れる遊び場も作ったのでgRPCに興味がある方は遊んでいってください。また本記事ではこの遊び場をどうやって作ったのかも簡単に解説します。


## gRPCとは

gRPCはGoogleが開発してオープンソースとして公開したRPCフレームワークです。IDL[^2]としてProtocol Buffers[^3]が利用可能です[^4]。gRPCは基本的には以下の図ように単純で、クライアントから要求(`Proto Request`)を送ってサーバが応答(`Proto Response`)を返すというものです。クライアントやサーバの記述には、Protocol Buffersが対応している様々な言語(C++, Ruby, Java等)が利用可能です。

{% img /gallery/daily/tools/grpcui/grpc-overview.png 500 %}

　***[What is gRPC](https://www.grpc.io/docs/guides/)より引用***

gRPCは上記のように単純な要求/応答型以外にも様々なやりとりに対応できます。具体的には以下の４つです。

- Unary RPC(単純な要求/応答型)
- Server streaming RPC(サーバが複数の応答を返すことができる)
- Client streaming RPC(クライアントが複数の応答を返すことができる)
- Bidirectional streaming RPC(クライアントとサーバがそれぞれ複数の要求/応答ができる。一般的な双方向通信)

上記のような柔軟な呼び出しはHTTP/2[^5]の基盤に支えられて実現されています。

[^2]: IDLはインタフェース記述言語(Interface Description Language)のことです。簡単に言えば関数呼び出しの宣言部分を定義する際に使う言語です。
[^3]: {% elink Protocol Buffers https://github.com/protocolbuffers/protobuf %}はGoogleが開発したシリアライズフォーマットです。IDLは独自の言語でシンプルで分かりやすいのが特徴です。IDLのファイルは`.proto`の拡張子を持っており、`protoc`というコンパイラを用いてIDLファイルからGo言語やRuby、Python、Java等様々な言語のバインディングを生成できます。現在のProtocol Buffersのバージョンは3になります。
[^4]: JSONも利用可能みたいですが、自分は使ったことはありません。
[^5]: HTTP2はHTTP/1.1の後継バージョンでRFC7540で定義されています。HTTP/1.1と比べてヘッダーの圧縮やバイナリメッセージ構造、双方向通信のサポート等様々な改善がなされています。

## gRPC UIについて

{% elink gRPC UI https://github.com/fullstorydev/grpcui %}はgRPCサーバとブラウザでやりとりできるツールです。百聞は一見にしかず。以下の画面を御覧ください。

{% img /gallery/daily/tools/grpcui/grpcui.png %}

この画面を見て震えたのはやはり要求の入力画面(`Request Form`)の充実っぷりです。gRPCは自分でデータの型を定義して入れ子のようなメッセージを定義できますが、そのような入力も簡単にできます。上記の図のでは`test.TestMessage`というメッセージの中にperson(`test.Person`というメッセージの型)が内包されています。また複数のデータが入力可能なフィールドは「`Add Item`」で簡単に追加できます。その他の注目すべき点は赤字で説明を入れておいたので参考にしてください。基本的にはgRPC(Protocol Buffers)で定義されている入力形式はほぼ網羅されています。

また、驚いたのはgRPCには基本的なスカラ値(`string`や`int64`等)以外にも「{% elink Well-Known Types https://developers.google.com/protocol-buffers/docs/reference/google.protobuf %}」と呼ばれる型が定義されていますが、gRPC UIにはこれらにもリッチなインタフェースが提供されていたことです。以下の画面は`timestamp`型に対するインタフェースです。

{% img /gallery/daily/tools/grpcui/grpcui-timestamp.png 400 %}

またリッチなフォームだけではなく、JSON形式でリクエストを投げることもできます。

{% img /gallery/daily/tools/grpcui/grpcui-req-json.png 400 %}

JSON形式で便利なのはコピペが容易なところです。また省略されているフィールドは出力されないので見やすくなります。フォーム型の編集画面とも連動しているので、非常に使いやすいです。リクエストは「Invoke」ボタンを押すことでサーバに投げることができます。このボタンはフォーム型のリクエストにも一番下にあります。以下が「Invoke」を押して返ってきた応答になります。

{% img /gallery/daily/tools/grpcui/grpcui-res.png 400 %}

この画面も特に説明がいらないくらい分かりやすいものになっています。gRPC UIで対応できないのは双方向の複雑なやり取りです。これは従来どおりCUI等を利用して行うしかありません。

## gRPC UIで遊ぼう！　〜 gRPC UI playground 〜

さて、ここまで来たらgRPC UIで遊んでみたくなったと思います。以下にみんなが遊べるように「遊び場」を立ち上げたのでぜひいろいろ遊んでみてください。

- {% elink gRPC UI playground http://grpcui.hinastory.com %}

gRPC UIはバックグラウンドで起動している{% elink gRPC UIのテストサーバ(testsvr) https://github.com/fullstorydev/grpcui/tree/master/testing/cmd/testsvr %}とやりとりしています。プロトコルは「{% elink test.proto https://github.com/fullstorydev/grpcui/blob/master/testing/cmd/testsvr/test.proto %}」、サーバの実装は「{% elink testsvr.go https://github.com/fullstorydev/grpcui/blob/master/testing/cmd/testsvr/testsvr.go %}」に記述されています。実際にgRPC UIを動かしながらソースやIDLを読むとgRPCの理解が深まると思います。

メソッドに関しては「`DoManyThings`」が全部詰めになっていて、残りのメソッドはそれを機能単位で分割したものになっています。たぶん・・・

## grpcui-playgroundの作り方

さて、ここからはおまけです。上記の遊び場(以降、`grpcui-playground`と記載)の構築方法の興味がある方を対象に簡単に説明したいと思います。grpcui-playgroundは3つのサービスを利用して無料で立ち上げました。以下がその構成になります。

{% img /gallery/daily/tools/grpcui/grpcui-playground-arch.jpg %}

上の図をざっくり説明すると、基本的にはDockerを使ってサービス提供しています。一つのコンテナの中にgPPC UIとgRPC Server(`testsvr`)という二つのプロセスが動いています。一つのコンテナに二つのプロセスはあまりお行儀がよくありませんが、今回は遊び場ということと無料で立ち上げることを重視したのでこのような構成になっています。
利用したコンテナホスティングサービスはArukas[^6]になります。今回はFreeプランを利用しています。Arukasにコンテナイメージを提供するためにはDocker Hubも利用しました。Docker HubにはGitHubと連携しておくとGitHubの変更を検知してコンテナをビルドする機能があるのでそれも利用しています。

[^6]: {% elink Arukas https://arukas.io/ %}はさくらインターネットが提供しているDockerのホスティングサービスです。Arukasを反対から読むと・・・

### Dockerfileを書く

Dockerfileを書くときの注意点は二つです。まず、ビルドイメージを小さくするためにAlpine Linux[^7]をベースイメージにします。次にgRPC UIが提供しているテストサーバ(`testsvr`)はgoで書かれているのでgoのビルド環境が必要です。ただしgoのビルド環境は動作には必要ないのでマルチステージビルドを活用して、なるべく小さなイメージにするようにしましょう[^8]。

{% code lang:docker Dockerfile %}
FROM golang:1.12.7-alpine as build-env
MAINTAINER hinastory

WORKDIR /testsvr
COPY testsvr /testsvr

RUN apk update && apk add --no-cache git

RUN go build

RUN go get -x github.com/fullstorydev/grpcui
RUN go install -x github.com/fullstorydev/grpcui/cmd/grpcui

FROM alpine
WORKDIR /
COPY --from=build-env /testsvr/testsvr /bin/testsvr
COPY --from=build-env /go/bin/grpcui /bin/grpcui
COPY start.sh /start.sh

EXPOSE 8080

ENTRYPOINT [ "/start.sh" ]
{% endcode %}

[^7]: Alpine Linuxは軽量、シンプル、セキュアをコンセプトにしたLinuxディストリビューションです。組み込み系で実績のあるmusl libcとbusyboxをベースにしています。その軽量さからコンテナのベースイメージとしてよく利用されています。
[^8]: 最初は無邪気にベースイメージを`stretch`にしてシングルステージでビルドしたため、イメージのサイズが400MBを超えてしまいました・・・現在のサイズは {% elink 18MB https://hub.docker.com/r/hinastory/grpcui-playground/tags %}です。特にパブリックなレジストリに登録する際はコンテナイメージのサイズに充分気を配り、リソースを無駄にしないように心掛けましょう(自戒)。

### GitHubでDockerfileを公開する

ここは特に説明はしませんが、GitHubに公開レジストリを作成し、Dockerfileと`testsvr`のソースと起動スクリプトをpushします。pushした自分のリポジトリは以下になります。

{% ghCard hinastory/grpcui-playground %}

### Docker Hubでイメージをビルド & 公開する

Docker Hubでイメージをビルドするのには、GitHubと連携しておいたほうが楽です。GitHubと連携しておけばGitHubのレポジトリをDocker HubのUIから選択できるようになり、GitHubにpushするだけでDockerfileをビルドしてくれるようになります。

注意すべき点はDockerイメージのタグの付け方です。デフォルトだとブランチを監視してlatestタグを付けるようになっていますが、Arukasはイメージをキャッシュする場合があるようなのでバージョンが入った適切なタグをつけることが望ましいです。そしてDockerのイメージタグはGitHubのタグと連動しているとよいと思われます。

{% img /gallery/daily/tools/grpcui/grpcui-dockerhub.png %}

Docker Hubでその設定をするのは簡単でDockerHubのリポジトリの`Builds`の画面からビルドルールを設定でき、`Source Type`を`Tag`にして、`Source`と`Docker Tag`を正規表現で記述することでお望みのタグが構成できると思います。またここでDockerfileの位置やビルドコンテキストも指定可能なので、少し複雑なリポジトリ構成でも対応出来ます。

ここの設定が終わったらGitHubにタグをpushしてビルドが始まるか確認します。基本的には検知はすぐに行われて`In Progress`の状態にすぐに変わりますがビルドが終わるまでには時間がかかるので、コーヒーでも飲んでまったりと待ちましょう(笑)。自分のコンテナイメージは以下に公開してあります。

- [hinastory/grpcui-playground - Docker Hub ](https://hub.docker.com/r/hinastory/grpcui-playground)

### ArukasでDockerコンテナを公開する

最後にArukasuでコンテナを公開します。FreeプランはO.1vCPUと128MB RAMの非力な環境ですが、今回のような遊び場には充分だと思われます。また「転送量課金」がないのでDDoSとかの心配がまったくいらないのも嬉しいところです。もちろん最悪サービスは落とされますが、料金に怯える心配は無いわけです。ちなみにFreeプランでも電話認証とクレジットカードの登録は必須です。このアカウント登録が最大の難関でコンテナの起動は驚くほどあっけなく終わりました。アプリ起動の詳細は「{% elink アプリの作成 – Arukas Help Center https://support.arukas.io/hc/ja/articles/115012662888-%E3%82%A2%E3%83%97%E3%83%AA%E3%81%AE%E4%BD%9C%E6%88%90 %}」を参照してください。以下は起動したコンテナの管理画面です。`Endpoint`はアプリの再起動で変わることが無いURLです。`Port`はインスタンスの起動毎に変わります。ちなみにgRPC UIは8080ポートでHTTPでサービスを公開していますが、エンドポイントではHTTPSになっているので自動でArukasがHTTPSに包んでくれるみたいです。

{% img /gallery/daily/tools/grpcui/arukas.png 500 %}

## まとめ

本記事では、gRPCサーバとブラウザでやり取りできる{% elink gRPC UI https://github.com/fullstorydev/grpcui %}を紹介しました。gRPC UIは非常に便利なので今後gRPC関連の開発で広く使われていくものと思われます。そして実際にgRPC UIを触れる遊び場を作成して以下に公開しました。

- 遊び場
  - {% elink gRPC UI playground http://grpcui.hinastory.com %}
  - プロトコルは「{% elink test.proto https://github.com/fullstorydev/grpcui/blob/master/testing/cmd/testsvr/test.proto %}」、サーバの実装は「{% elink testsvr.go https://github.com/fullstorydev/grpcui/blob/master/testing/cmd/testsvr/testsvr.go %}」
  - 遊び場は当面は公開予定ですが、ある日突然告知なしで死ぬ可能性があるのでご容赦ください
- Dockerfile
  - {% elink hinastory/grpcui-playground -GutHub https://github.com/hinastory/grpcui-playground %}
- コンテナイメージ
  - [hinastory/grpcui-playground - Docker Hub ](https://hub.docker.com/r/hinastory/grpcui-playground)

また、おまけとしてその遊び場の作り方を(無料でコンテナサービスを立ち上げる手順)を簡単に説明しました。
本記事がgRPCを理解し、より便利に使えるようになるための一助になれば幸いです。

## 参考文献

- {% elink gRPC Documentation https://grpc.io/docs/ %}
- {% elink Developer Guide  |  Protocol Buffers https://developers.google.com/protocol-buffers/docs/overview %}
- {% elink RFC 7540 - Hypertext Transfer Protocol Version 2 (HTTP/2) https://tools.ietf.org/html/rfc7540 %}({% elink 日本語訳 https://summerwind.jp/docs/rfc7540/ %})
- {% elink about Alpine Linux https://alpinelinux.org/about/ %}
- {% elink Docker Hub Documentation https://docs.docker.com/docker-hub/ %}
- {% elink Arukas Help Center https://support.arukas.io/hc/ja %}
- {% elink 遠隔手続き呼出し - Wikipedia https://ja.wikipedia.org/wiki/%E9%81%A0%E9%9A%94%E6%89%8B%E7%B6%9A%E3%81%8D%E5%91%BC%E5%87%BA%E3%81%97  %}
- {% elink インタフェース記述言語 - Wikipedia https://ja.wikipedia.org/wiki/%E3%82%A4%E3%83%B3%E3%82%BF%E3%83%95%E3%82%A7%E3%83%BC%E3%82%B9%E8%A8%98%E8%BF%B0%E8%A8%80%E8%AA%9E %}
