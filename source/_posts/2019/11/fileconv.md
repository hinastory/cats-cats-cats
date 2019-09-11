---
title: 長年育て続けた秘蔵の一括ファイル変換ライブラリを晒してみる
thumbnail: /gallery/thumbnails/files.png
categories:
  - Tech
  - Tool
tags:
  - Ruby
date: 2019-09-11 07:28:45
---
時々、複数のCSVファイルやJSONファイルを変換したい場面に遭遇します。そういうときはよくRubyで使い捨てのスクリプトを書いて済ませていました。しかし、複数のファイルを読み込む処理や行を分割して改行コードを取り除いたり等、同じ処理を何回も書いていることに気づきました。そして次第に「変換処理」だけに集中したいと思うようになり、自前のライブラリ`fileconv`を作り始めました・・・

<!-- more -->

## 目次
<!-- toc -->

## はじめに

本記事は拡張可能な一括ファイル変換ライブラリ`fileconv`の紹介記事です。`fileconv`を使えばファイルのオープンや読み書きに手を煩わせることなく、簡単に複数ファイルの変換処理を実装することができます。またデフォルトでCSVやJSONフォーマットにも対応しており、他のフォーマットに対応するのも簡単です。

- {% elink fileconv - RubyGems https://rubygems.org/gems/fileconv %}
- {% elink fileconv - GitHub https://github.com/hinastory/fileconv/ %}

## インストール

以下の行をGemfileに加えてください。

{% code lang:ruby %}
gem 'fileconv'
{% endcode %}

それから以下を実行してください。

{% code %}
$ bundle
{% endcode %}


もしくは以下のようにgemコマンドで直接インストールしてください。

{% code lang:sh %}
$ gem install fileconv
{% endcode %}


## 使い方

「コンバータ」を作成するには以下の2つをする必要があります。

- `MetaConvertor`(例: `Fileconv::Line`)を`include`する
- 必要に応じていくつかのフック(e.g. `input_ext`)を定義する

まずは簡単な例から紹介します。以下はテキストファイル(拡張子が`txt`のもの)を選択して行番号を付加するコンバータです。

{% code lang:ruby %}
require 'fileconv'

class AddLinenoConvertor
  include Fileconv::Line
  def input_ext
    "txt"
  end

  def init_acc(acc)
    acc[:lineno] = 0
  end

  def convert_line(line, acc)
    acc[:lineno] += 1
    "#{acc[:lineno]}: #{line}"
  end
end
{% endcode %}

あとは以下のようにインスタンスを生成して`#conv`メソッドを実行するだけです。このスクリプトを実行するとカレントディレクトリのテキストファイル(拡張子が`txt`のもの)を選択して、カレントディレクトリの"output"ディレクトリ配下にファイルの変換結果(行番号を付加したもの)を同じファイル名で出力します。

{% code lang:ruby %}
convertor = AddLinenoConvertor.new
convertor.conv
{% endcode %}

つまり以下の2つのファイルがあるとすると、


{% code aaa.txt %}
aaa
bbb
ccc
{% endcode %}

{% code bbb.txt %}
111
222
333
{% endcode %}

コンバータの実行後には以下のような2つのファイルが変換結果として生成されます。

{% code output/aaa.txt %}
1: aaa
2: bbb
3: ccc
{% endcode %}

{% code output/bbb.txt %}
1: 111
2: 222
3: 333
{% endcode %}

### コンバータのフック

前出の例では最低限のフックしかオーバーライドしていませんでしたが、必要に応じて様々なフックをオーバーライドできます。フックを一つもオーバーライドしない場合のデフォルトのアクションでは、カレントディレクトリのすべてのファイルを"output"ディレクトリにコピーします[^1]。

|フック|デフォルト|説明|
|---|---|---|
|input_dir|"."(カレントディレクトリ)|入力元ディレクトリ|
|input_ext|`nil` (全ファイル)|入力ファイルの拡張子|
|output_dir|"output"|出力先ディレクトリ|
|input_files(files)|`files`|入力ファイル|
|init_conv|`nil`|コンバータの初期化用フック|
|init_acc(acc)|`nil`|アキュームレータ(`acc`)の初期化用フック|
|read_file(filename, acc)|`nil` (デフォルトのリーダ)|ファイル読み込み用フック|
|convert_line(line, acc)|`line`|行変換用フック|
|convert_file(file, acc)|`file`|ファイル変換用フック|
|output_filename(filename, acc)|`filename`|出力ファイル名変更用フック|
|result_filename|"result.txt"|結果ファイル変更用フック|
|conv_result|`nil`|変換結果出力用フック|

よく使われるフックは以下のとおりです。

- `#input_ext`
- `#convert_line`
- `#convert_file`
- `#conv_result`

`#input_ext`は対象ファイルの拡張子を返します。オーバーライドしない場合のデフォルトは`nil`でこの場合は「全ファイル」が対象となります。ディレクトリは対象外です。このフックをオーバーライドして"csv"を返すと拡張子が`csv`のファイルが選択されます。自分で選択ファイルを直接したい場合は`input_files`フックで上書きでききます。

`#convert_line`フックは前述の例でも利用されていましたが、基本的に引数の`line`をそのまま返せば「コピー」と同じ動作になります。そして行を変更したければ`line`を加工して戻り値として返せば行が変更されます。もし行を削除したければnilを返すか空の配列(`[]`)を返してください。行を増やしたい場合は必要な行を配列で返してください。

`#convert_file`フックにはファイル全体に対する処理を記述します。引数の`file`には読み込んだ一つのファイル全体のデータが入っているので[^2]、これを加工して戻り値にします。

`#conv_result`フックは複数のファイルを処理した後の一番最後に呼ばれるフックです。デフォルトでは`nil`を返して何も出力しませんが、このフックをオーバーライドして文字列を返すと、それが"output/result.txt"に出力されます。出力先ディレクトリと出力結果のファイル名はそれぞれ`#output_dir`フックと`#result_filename`フックで変更可能です。

[^1]: カレントディレクトリに"output"ディレクトリが無かった場合には作成します。"output"ディレクトリに同名のファイルが存在した場合は上書きします。
[^2]: `file`に格納されるものは後述するメタコンバータの種類によって異なります。

### コンバータの変数

コンバータ内で利用できる主な変数は`acc`,`@meta`,`@opts`の３つで、全てHash型です。これらの変数はスコープを持っています。`acc`はいくつかのフックの引数として渡されますが、スコープとしては一つのファイルを処理する間の共通の変数として使えます。そして一つのファイルの処理が終わると初期化されます。`@opts`と`@meta`はコンバータ全体で有効な変数です。 `@opts`はオプション引数を保持するのに使われます。オプションは`#conv`メソッドの引数として渡されます。`@meta`はどんな目的にも使える変数として用意しています。一般的にはファイル処理全体に関わる情報を保持しておいて`#conv_result`フックの出力用に利用します。

|変数|スコープ|説明|
|---|---|---|
|acc|ファイル|単一ファイル用の変数|
|@meta|コンバータ|多目的変数|
|@opts|コンバータ|オプション用変数|

### デフォルトのメタコンバータ

メタコンバータは主にコンバータに`include`して利用されることを目的にしたコンバータです。`fileconv`にデフォルトで用意されているメタコンバータは以下のとおりです。

|メタコンバータ|モード|説明|
|---|---|---|
|Line|行|行の生データを取得|
|CSV|行|CSVの1行を取得(ArrayまたはRow)|
|Data|ファイル|ファイルの生データを取得|
|File|ファイル|`File`オブジェクトを取得|
|Stat|ファイル|`Stat`オブジェクトを取得|
|JSON|ファイル|JSONオブジェクトを取得|

コンバータ(メタコンバータも含む)は「モード」を持っており、主に2つに分けられます。

- ラインモード
  - `#convert_line`フックが呼ばれる
  - `#convert_file`フックが呼ばれる
  - 例) `Line`, `CSV`
- ファイルモード
  - `#convert_line`フックが呼ばれない
  - `#convert_file`フックが呼ばれる
  - 例) `Data`, `File`, `JSON`

`Line`コンバータはファイルを読み込んで改行コードで区切って`#convert_line`に渡してくれるコンバータです。改行コードは指定がなければ維持されます[^3]。`@opts[:new_line]`を指定することで明示的に改行コードを変換することもできます。

`CSV`コンバータはその名の通りCSV形式のファイルを扱います。Ruby標準のCSVモジュールを用いておりオプションもそのまま使えます。`#convert_line`にはCSVモジュールでパースされたCSVの各行が渡ってくるので行単位で処理を行いたい場合はこのフックを利用してください。`#convert_file`にはパースされたファイル全体が渡されるのでファイル単位で処理したい場合はこちらに処理を書いてください。

`Data`コンバータはファイルの中身を全て読み込んで処理したい場合に利用します。データの中身は直接`#convert_file`に渡されるのでここに変換処理を書くことができます。バイナリファイルの処理をしたい場合やファイルを自前でパースしたい場合に用います。

`File`コンバータはファイルは読み込まれず`#convert_file`に`File`オブジェクトが渡ってくるので直接ファイルを読み込めます。大きなファイルを分割して読み込んで処理したい場合などに用います。

`Stat`コンバータもファイルは読み込まず、代わりに`Stat`オブジェクトが`#convert_file`に渡されます。ファイルの更新日時やサイズ等のメタ情報だけが必要な場合に用います。


一番最初の例はラインモードの例だったので次はファイルモードであるJSONメタコンバータの利用例を紹介します。

```ruby
require 'fileconv'

class ModifyJSONConvertor
  include Fileconv::JSON

  def input_ext
    "json"
  end

  def convert_file(data, acc)
    data.map do |e|
      e["country"] = "USA"
      e
    end
  end
end

ModifyJSONConvertor.new.conv
```

オリジナルファイル (`address.json`) :
```json
[{"name": "Mike", "Age": "21"}, {"name": "Jon", "Age": "33"}]
```

変換後のファイル (`output/address.json`) :
```json
[{"name":"Mike","Age":"21","country":"USA"},{"name":"Jon","Age":"33","country":"USA"}]
```

さらに多くのサンプルは[ここ](https://github.com/hinastory/fileconv/tree/master/example)で見ることが可能です。

[^3]: 最初に読み込んだファイルの最初の改行コードが採用されます。

### メタコンバータを作ってみる

メタコンバータは簡単に作ることができます。
以下は`fileconv`ジェムのJSONメタコンバータの例です。

```ruby
require "json"

module Fileconv
  module JSON
    include Fileconv::Base

    def pre_init_conv
      @opts[:read_json_opts] ||= {}
      @opts[:write_json_opts] ||= {}
    end

    def pre_convert_file(data, acc)
      ::JSON.parse(data, @opts[:read_json_opts])
    end

    def post_convert_file(obj, acc)
      return unless obj
      if @opts[:pretty_json]
        ::JSON.pretty_generate(obj, @opts[:write_json_opts])
      else
        ::JSON.generate(obj, @opts[:write_json_opts])
      end
    end
  end
end
```

メタコンバータを作成するには「Fileconv::Base」をincludeしてコンバータで呼び出されるフックの事前(`pre_`)もしくは事後(`post_`)に呼び出される以下のフックを必要に応じてオーバーライドするだけです。

- pre_init_conv
- post_init_conv
- pre_input_files
- post_input_files
- pre_init_acc
- post_init_acc
- pre_convert_file
- pre_convert_line
- post_convert_line
- post_convert_file
- pre_conv_result
- post_conv_result

## リポジトリ

以下のリポジトリで開発しています。バグ報告、ご要望はIssuesへどうぞ。プルリクエストも歓迎です。

{% linkPreview https://github.com/hinastory/fileconv %}

このライブラリの今後についてですが、最近は複雑なコンバータを書くのをやめて単純なコンバータをつなげて処理を書くことが多くなっています。従ってそのうちその知見を生かして`fileconv`にコンバータの「合成」を実装するかもしれません。

## `fileconv`の失敗談

`fileconv`を長年使い続ける中で色々と失敗を重ね、少しずつ改良していきました。以下は主な失敗した点です。

1. 継承ベースにする
2. メタコンバータを本当に「`メタプログラミング`」で実装する
3. 例外を途中でキャッチする

1.は分かりやすいですが、最初は継承ベースで設計していたため、別の親クラスを持つクラスと一緒に使うことができなかったためMixinベースに変更しました。

2.に関してはメタコンバータを`eval`や`defile_method`や`send`や`method_missing`を使いまくって実装していた時期がありました・・・ あの頃は若かった・・・。 当時は**「かっこいい」**と本気で思っていましたが、普段使いのライブラリにとっては**地獄**以外の何物でもなかったです。どこでエラーが起こったのか分かり辛く、処理も追い辛いので実装して半年で全て現在の`pre`, `post`のフック形式に書換えました。まぁ、一見するとダサいですがフックのライフサイクルが分かりやすくなったのと、コンバータを簡単にメタコンバータに昇格できるようになりました。つまり、最初はコンバータで書いたものを、ちょっと汎用的に使いたければフックを`pre`か`post`に移すだけでメタコンバータに変換できるので非常に使い勝手がよくなりました。

3.に関してはファイル変換の途中で失敗したら例外をレスキューして続きのファイル変換を継続するような処理を入れたこともありました。しかし、`fileconv`は「コンバータ」や「メタコンバータ」を作る基盤なので薄いレイヤーに徹して例外処理は上位に委譲するのが正解だと使い続けて気づきました。

他にも色々失敗した点はありますが、上記の3つは似たような基盤ライブラリを作る上でも参考になるのではと思っています。

## 最後に

`fileconv`を作ってからファイルを開いたりファイルを書き戻したりする**「余計な一手間」**を考えずに済むようになり、書きたいと思った変換処理をすぐに書けるようになりました。ここ数年はライブラリのインターフェースも安定しており、**シンプルに実装するのが一番**だと実感しています。メタプログラミングコワイ・・・

この手の薄いユーティリティ系のライブラリにどれほどニーズがあるかは謎ですが、せっかく育てたので晒してみました。

ファイル変換の際に試して頂けると幸いです。
