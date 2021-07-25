---
title: Contextual Abstractionsで様々なコンテキストをうまく抽象化する
thumbnail: /gallery/thumbnails/eiga_film.png
toc: true
categories:
  - Tech
  - Language
tags:
  - Scala
  - Dotty
date: 2021-03-16 07:28:45
---
プログラミングでは様々な「`コンテキスト`」を扱う必要が出てきます。コンテキストをうまく扱えないと冗長な記述が必要になったり、コンテキストが複雑になりすぎて混乱を招いたりします。特に`コンテキストの引き回し`は様々なプログラミング言語やフレームワークで出てくるパターンですが、安易に使うと複雑性、冗長性の増大や密結合等さまざまな問題を引き起こすことが知られています。しかしScala 3の目玉機能である**Contextual Abstractions(コンテキスト抽象化)** を使えばこの問題を鮮やかに解決できます。

本記事では`Contextual Abstractions`がなぜコンテキストをうまく扱うことができるのかを説明したいと思います。

<!-- more -->

## はじめに

Scala 3で新しく **「コンテキスト抽象化」** という機能が入ります。この機能は従来の「`Implicits`」と呼ばれる機能を再設計し、さらに大幅に強化したものになっています。「コンテキスト抽象化」はScala 3を特徴付ける非常に魅力的な考え方なので、従来のScalaやImplicitsを知らない人でもなるべく分かるように説明したいと思います。

## コンテキスト抽象化の基本

コンテキスト抽象化の本質は **「コンテキストの引き回し」に対するエレガントな回答** であり、Scala 3の`using`句と`given`インスタンスの仕組みが大きな役割を果たしています。このことを次の節から順に説明していきます。

### コンテキスト

コンテキストは日本語で書くと「`文脈`」になり、前後の繋がりや背景を意味します。プログラミングでは **特定の範囲で有効な複数の処理で共通する情報** をコンテキストとしてよく扱います。

変数名としてはよく`context`の省略形である`ctx`が用いられる場合が多いですが、その他にも`info`とか`config`等のもう少し用途を限定した名前が割り当てられる場合があります。

例えば以下の例ではコンテキストとして`ctx`という変数を用意し、コンテキストの情報として`"sunny"`を代入して複数回利用しています。

```scala
val ctx = "sunny" // コンテキストを準備
println(s"context is ${ctx}") // 最初のコンテキストの利用
someFunction(ctx) // 2回目のコンテキストの利用
```

上記の例ではコンテキストをローカルの変数として用意していますが、「コンテキスト」自体は情報の有効範囲や使われ方に対する性質を意味しているので、実際のコンテキストには様々なものが考えられます。

### コンテキストの引き回し

シンプルなコンテキストは単一の関数のスコープ内で利用もできますが、一般的にはコンテキストを関数の間で受け渡して **複数の関数でコンテキストを共有する用途** でよく利用されます。これを**コンテキストの引き回し** といいます。

以下の例ではコンテキスト`ctx`を親関数から孫関数まで引き回しています。

```scala
// 親関数
def parentFunction() =
  val ctx = "sunny" // コンテキストの生成
  println(s"parent func: ctx=${ctx}")
  childFunction(ctx) // コンテキストの引き回し

// 子関数
def childFunction(ctx: String) =
  println("child func")
  grandchildFunction(ctx) // コンテキストの引き回し **

// 孫関数
def grandchildFunction(ctx: String) =
  println("grandchild func")
  println(s"It's ${ctx} today.") // コンテキストの利用

parentFunction() // 親関数の呼び出し
```

コンテキストに複数の情報を持たせたい場合は専用の **「型」** を用意します。
以下は専用の`ContextA`という型を用意してコンテキストの情報を詰め込んでいます。

```scala
// コンテキストを表す型を定義
case class ContextA(weather: String, year: Int)

// 親関数
def parentFunction() =
  val ctxA = ContextA("sunny", 2021) // コンテキストの生成
  println(s"parent func: weather=${ctxA.weather}")
  childFunction(ctxA) // コンテキストの引き回し

// 子関数
def childFunction(ctxA: ContextA) =
  println(s"child func: year=${ctxA.year}")
  grandchildFunction(ctxA) // コンテキストの引き回し

// 孫関数
def grandchildFunction(ctxA: ContextA) =
  println("grandchild func")
  println(s"It's ${ctxA.weather} today.") // コンテキストの利用
  println(s"This year is ${ctxA.year}") // コンテキストの利用

parentFunction() // 親関数の呼び出し
```

図にすると以下のようになります。

{% img /gallery/daily/others/ctx_abst_1.png %}

コンテキストの型は非常に便利ですが、コンテキストに詰め込みたい情報が増えてくるとコンテキストに依存する関数の間に複雑な依存関係を生み出し、密結合となってしまいます。密結合の関数は単体テストやメンテナンスがしづらく非常に厄介です。

### コンテキストを型で分割する

前述のとおり一つのコンテキストに情報を詰め込みすぎると単体テストやメンテナンスが面倒になるので都合のいい単位で分割することにします。

以下の例では元々のコンテキストをContextAとContextBの２つに分割しています。そして`ctxB`は子関数と孫関数でしか使われないので、子関数で定義することにします。

```scala
// コンテキストを表す型を定義
case class ContextA(weather: String)
case class ContextB(year: Int)

// 親関数
def parentFunction() =
  val ctxA = ContextA("sunny") // コンテキスト`ctxA`の生成
  println(s"parent func: weather=${ctxA.weather}")
  childFunction(ctxA) // コンテキストの引き回し

// 子関数
def childFunction(ctxA: ContextA) =
  val ctxB = ContextB(2021) // コンテキスト`ctxB`の生成
  println(s"child func: ${ctxB.year}")
  grandchildFunction(ctxA, ctxB) // コンテキストの引き回し

// 孫関数
def grandchildFunction(ctxA: ContextA, ctxB: ContextB) =
  println("grandchild func")
  println(s"It's ${ctxA.weather} today.")
  println(s"This year is ${ctxB.year}")

parentFunction() // 親関数の呼び出し
```
図にすると以下のようになります。

{% img /gallery/daily/others/ctx_abst_2.png %}

### 型によるコンテキストの特定(`using`と`given`)

ここからがScala 3に特化した内容になりますが、`using`句を使うと`コンテキストパラメータ`と呼ばれる特殊なパラメータを関数が受け取ることができるようになります。そしてコンテキストパラメータでは **「型」** を基準に`given` インスタンスをスコープ内で探して自動的に補完します。

以下の関数定義で`using`が使われている箇所がコンテキストパラメータになります。コンテキストパラメータはもし、スコープ内に同じ型の`given`インスタンスがあった場合に呼び出し時に省略可能です。

```scala
def childFunction()(using ctxA: ContextA)
```

さて、ここまでの説明をもとにこれまでの親関数、子関数、孫関数を書き直すと以下のようになります。

```scala
// コンテキストを表す型を定義
case class ContextA(weather: String)
case class ContextB(year: Int)

// 親関数
def parentFunction() =
  given ctxA: ContextA = ContextA("sunny") // コンテキストの生成(`given`インスタンス)
  println(s"parent func: ${ctxA.weather}")
  childFunction() // コンテキストパラメータの省略（コンテキストの自動引き回し）

// 子関数
def childFunction()(using ctxA: ContextA) =
  given ctxB: ContextB = ContextB(2021) // コンテキストの生成(`given`インスタンス)
  println(s"child func: ${ctxB.year}")
  grandchildFunction() // コンテキストパラメータの省略(コンテキストの自動引き回し)

// 孫関数
def grandchildFunction()(using ctxA: ContextA)(using ctxB: ContextB) =
  println("grandchild func")
  println(s"It's ${ctxA.weather} today.")
  println(s"This year is ${ctxB.year}")

  parentFunction() // 親関数の呼び出し
```
図にすると以下のようになります。`given`と`using`の対応に注目してください。

{% img /gallery/daily/others/ctx_abst_3.png %}

### `using`と`given`における変数名の省略と`summon`メソッド

`using`と`given`では変数名を省略して型名のみ記述することができます。この場合`summon`メソッドと型名を用いてインスタンスにアクセス可能です。`summon`は「召喚する」という意味で、省略された変数に格納されるはずだったインスタンスを強制的に「召喚」します。

```scala
// コンテキストを表す型を定義
case class ContextA(weather: String)
case class ContextB(year: Int)

// 親関数
def parentFunction() =
  given ContextA = ContextA("sunny") // コンテキストの生成(`given`インスタンス)
  println(s"parent func: ${summon[ContextA].weather}")
  childFunction() // コンテキストパラメータの省略（コンテキストの自動引き回し）

// 子関数
def childFunction()(using ContextA) =
  given ContextB = ContextB(2021) // コンテキストの生成(`given`インスタンス)
  println(s"child func: ${summon[ContextB].year}")
  grandchildFunction() // コンテキストパラメータの省略(コンテキストの自動引き回し)

// 孫関数
def grandchildFunction()(using ContextA)(using ContextB) =
  println("grandchild func")
  println(s"It's ${summon[ContextA].weather} today.")
  println(s"This year is ${summon[ContextB].year}.")

  parentFunction() // 親関数の呼び出し
```

一般的には`summon`メソッドを使うと記述が長くなるので、`summon`メソッドを使わなくて済む場合にだけ`using`や`given`の変数名を省略します。

例えば上記の子関数の場合、元々の関数宣言は`def childFunction()(using ctxA: ContextA)`でした。しかし`ctxA`は子関数では利用されず、そのまま`grandchildFunction`に引き回されて省略されたコンテキストパラメータに補給されるだけなので、省略が正解です。

しかし子関数の`ContextB`に関してはその後すぐに`summon[ContextB].year`で利用しており元の`ctxB.year`の方が短く簡潔になるので、省略しないほうが良かったと考えられます。

### コンテキスト抽象化

コンテキスト抽象化の基本的なアイデアは前節で説明した`given`と`using`に集約されています。具体的には以下の4つからなります。

1. コンテキストを「型」として定義
2. コンテキストを受け取る関数を定義(`using`句)
3. コンテキストの生成(`given`インスタンス)
4. コンテキストを受け取る関数の呼び出し（コンテキストの自動引き回し）

コンテキスト抽象化の本質はこの4つのステップが分離されていて、コンテキストの有効範囲がコントロールされているということです。分離されているということは別々のファイルで定義されてもいいということであり、有効範囲がコントロールされているというのは、直接定義されたスコープかインポートしたスコープの範囲でしかコンテキストが有効にならないこと意味しています。

それでは具体的にファイルを分割して、コンテキストがうまく抽象化されてきちんと制御されていることを確認します。

```scala:MyContextDefs.scala
package MyContextDefs
// コンテキストを表す型を定義
case class ContextA(weather: String)
case class ContextB(year: Int)
```

```scala:MyFunctionsA.scala
package MyFunctionsA

import MyContextDefs.*
import MyFunctionsB.*

// 親関数
def parentFunction() =
  import MyContextValues.given // `given`インスタンスのインポート
  println(s"parent func: ${ctxA.weather}")
  childFunction() // コンテキストパラメータの省略（コンテキストの自動引き回し）

// 子関数
def childFunction()(using ctxA: ContextA) =
  import MyContextValues.given // `given`インスタンスのインポート
  println(s"child func: ${ctxB.year}")
  grandchildFunction() // コンテキストパラメータの省略(コンテキストの自動引き回し)
```

```scala:MyFunctionsB.scala
package MyFunctionsB

import MyContextDefs.*

// 孫関数
def grandchildFunction()(using ctxA: ContextA)(using ctxB: ContextB) =
  println("grandchild func")
  println(s"It's ${ctxA.weather} today.")
  println(s"This year is ${ctxB.year}")
```

```scala:MyContextValues.scala
package MyContextValues

import MyContextDefs.*

given ctxA: ContextA = ContextA("sunny") // コンテキストの生成(`given`インスタンス)
given ctxB: ContextB = ContextB(2021) // コンテキストの生成(`given`インスタンス)
```

```scala:Main.scala
@main def example: Unit =
  import MyFunctionsA._

  parentFunction() // 親関数の呼び出し
```

`import`ベースの各ファイルの依存関係を図にすると以下のようになります。

{% img /gallery/daily/others/ctx_abst_4.png %}

コンテキスト抽象化を行うと上記のように、**各ファイルが疎結合になり修正による影響範囲を抑えることができます**。またどの`given`インスタンスをインポートするかを選択可能になるので**カスタマイズの柔軟性が飛躍的に向上します**。これはライブラリの作成者とライブラリの利用者の両者に福音だと思います。また当然ですがコンテキストパラメータの省略により冗長な記述が避けられるのも大きなメリットです。

## コンテキスト抽象化の高度な機能

次の節からはコンテキスト抽象化の高度な機能として**拡張メソッド**と**型クラス**の２つの機能を紹介します。

### 特定の型にコンテキストを追加する（拡張メソッド）

コンテキスト抽象化の高度な機能として拡張メソッドがあります。拡張メソッドを使えば既存の型に修正を加えることなくメソッドを追加できます。

もちろん無制限に追加できるわけではなくて型の制約と有効範囲が存在するので、考え方はコンテキスト抽象化の発展的なものと捉えることが可能です。

具体的には`extension`キーワードを用いて型を拡張します。例えば以下の例では`Person`という型に`extension`キーワード`でprofile`というメソッドを拡張しています。

```scala
// 型を定義
case class Person(name: String, age: Int)

// 型Personに対して拡張メソッドを定義
extension (p: Person)
  def profile: String = s"Name: ${p.name}, Age: ${p.age}"

val alexa = Person("Alexa", 12)
println(alexa.profile)
```

上記のように`profile`メソッドを定義するのに直接`Person`クラスを修正する必要はありません。このおかげで`Person`を利用している他の箇所には影響はありません。影響があるのは`extension`で定義した拡張メソッドのスコープ内のみになります。

オブジェクト指向における`継承`とも異なる事に注意する必要があります。拡張メソッドと継承のどちらも既存の型にメソッドを追加することができますが、継承は以下のように新たな型(`サブクラス`)を定義するため追加したメソッドを呼ぶためにはサブクラスのインスタンスを生成してメソッドを呼び出す必要があります。

```scala
// 継承を用いた方法
class SubPerson(name: String, age: Int) extends Person(name: String, age: Int):
  def profile: String = s"Name: ${name}, Age: ${age}"

val alexa2 = SubPerson("Alexa", 12)
```

オブジェクト指向の継承と拡張メソッドの違いを図にすると以下のようになります。

{% img /gallery/daily/others/ctx_abst_5.png %}

上記のように拡張メソッドは既存の型を継承して新しい型を作成するわけではないので、`is-a`関係なども気にする必要はなくなります。

### 特定のコンテキストを持つ「型」を定義する（型クラス）

拡張メソッドでは特定の型を拡張できましたが、時には複数の型に共通するメソッドのシグネチャを定義してそのメソッドの実装は型ごとに行いたい場合があります。このような機能は「型クラス」[^1]と呼ばれています。

以下の例では`Person`と`Japanese`というふたつの型に対して、`CanGreet`という型クラスを実装しています。この例でも前述の拡張メソッドと同じく`Person`/`Japanese`と`CanGreet`の間に継承関係は存在しません。

```scala
// 型を定義
case class Person(name: String, age: Int) // 一般的な人
case class Japanese(name: String, age: Int, info: String) // 日本人

// それぞれの型に共通するメソッドを定義(型クラス)
trait CanGreet[A]: // 挨拶可能な型クラス
  extension (a: A) def hello(): Unit

// それぞれの型に共通するメソッドに対する固有の実装
given CanGreet[Person] with
  extension(a: Person) def hello() = println("hello!")

// それぞれの型に共通するメソッドに対する固有の実装
given CanGreet[Japanese] with
  extension(a: Japanese) def hello() = println(s"こんにちは。実はわたしは、${a.info}なんです。")

val alexa = Person("Alexa", 12)
val hanako = Japanese("Hanako", 18, "テニスが趣味")

alexa.hello() // Hello!
hanako.hello() // こんにちは。実はわたしは、テニスが趣味なんです。
```

[^1]: オブジェクト指向の「クラス」とはまったく関係ありません。

型クラスの考え方を図にすると以下のようになります。

{% img /gallery/daily/others/ctx_abst_6.png %}

重要なのは型クラスの実装はベースの型に対して固有になるということです。このためベースの型を後付で柔軟に拡張することができます。このような性質は **アドホック多相性** とも呼ばれており、HaskellやRustやSwift等でも利用できる汎用的な概念です。

前述の拡張メソッドと型クラスの大きな違いは **拡張メソッドは単一の型を拡張することができますが、型クラスは複数の型を拡張できる** という点です。 もちろん拡張メソッドも頑張れば個々の型を同じように拡張できますが拡張メソッドが同じインターフェースをもつことをコンパイラが保証できないので、その点が型クラスが必要な理由となります。つまり **「型クラス」は「型」に対するインターフェースの役割を果たしている** ということができます。

#### 型クラスを受け取る関数

関数を定義する場合、`using`を利用したコンテキストパラメータを以前に紹介しましたが、コンテキストパラメータでは型クラスも受け取ることができます。

以下のコードは型クラス「CanGreet」をコンテキストパラメータとして受け取る`greeting`関数を定義しています。

```scala
case class Person(name: String, age: Int)
case class Japanese(name: String, age: Int, info: String)

trait CanGreet[A]:
  extension (a: A) def hello(): Unit

given CanGreet[Person] with
  extension(a: Person) def hello() = println("hello!")

given CanGreet[Japanese] with
  extension(a: Japanese) def hello() = println(s"こんにちは。実はわたしは、${a.info}なんです。")

// 型クラスCanGreetのインスタンスを受け取る関数
def greeting[T](a: T)(using CanGreet[T]) = a.hello()

val alexa = Person("Alexa", 12)
val hanako = Japanese("Hanako", 18, "テニスが趣味")

greeting(alexa)
greeting(hanako)
```

`greeting`関数は以下のような糖衣構文で記述することもできます。この記法は **「コンテキスト境界」** と呼ばれおり、型パラメータ`T`が型クラスとしての制約`CanGreet`を満たすという関係がより分かり易く記述できます[^2]。

```scala
def greeting2[T: CanGreet](a: T) = a.hello()
```

[^2]: Rustをご存じの方であればコンテキスト境界はトレイト境界と似たようなものだと考えて貰えれば良いと思います。

### コンテキスト抽象化について、さらに知りたい方へ

コンテキスト抽象化ではさらに以下のような高度な機能もあります。

- 型クラスの導出(Type Class Derivation)
- 多元的等価性（Multiversal Equality)
- コンテキスト関数(Context Functions)
- 暗黙の変換(Implicit Conversions)

上記をもっと詳しく知りたい方は以下もご参照ください。

- [コンテキスト抽象化 - Scala 3 Book](https://docs.scala-lang.org/scala3/book/ca-contextual-abstractions-intro.html)
- [コンテキスト抽象化 - Scala 3 リファレンス](https://dotty.epfl.ch/docs/reference/contextual/motivation.html)

## まとめ

Contextual Abstractions(コンテキスト抽象化)について説明しました。コンテキスト抽象化の本質は **「コンテキストの引き回し」に対するエレガントな回答** であり、プログラムの**疎結合化、柔軟性の向上、シンプル化** に貢献します。さらに発展として **「型のコンテキスト」を抽象化した「拡張メソッド」や「型クラス」にまで応用が広がっている強力な概念** であり、プログラミングにおける有用な武器であることに疑う余地はありません。

「コンテキスト抽象化」という用語は恐らくScala 3で初めて出てきたものですが、内部の細かい機能は以前からある`Implicits`等の機能の再設計となっています。さすがに再設計だけあって恐らく Scala 3以外で**ここまでコンテキスト抽象化について考えられているプログラミング言語はほとんどない**ものと思われます。

ただし再設計といっても非常に多くの部分が見直されたり整理されたので **従来の知識を前提とせず理解できるように** 「コンテキスト」という概念から始めてイチから説明を積み上げています。本記事で用いたソースコードは以下のリポジトリの「[examples](https://github.com/hinastory/scala3_dotty_examples/tree/master/src/main/scala/contextual_abstractions/examples)」に登録してあるので興味がある方はご参照ください。

[![hinastory/scala3_dotty_examples - GitHub](https://gh-card.dev/repos/hinastory/scala3_dotty_examples.svg)](https://github.com/hinastory/scala3_dotty_examples)

Scala 3は2021/2/17に3.0.0-RC1(リリース候補)が登場し、今年の前半から中盤にかけて正式リリースされる予定とアナウンスされています[^3]。コンテキスト抽象化以外にもScala 3では新機能が目白押しなので、リリースに向けて少しずつ機能をキャッチアップしていければと思っています。

本記事が、コンテキスト抽象化やScala 3に興味がある方の一助になれば幸いです。

[^3]: [Scala 3 - Crossing the finish line | The Scala Programming Language](https://www.scala-lang.org/blog/2020/12/15/scala-3-crossing-the-finish-line.html)

## 参考文献

- [New in Scala 3](https://docs.scala-lang.org/scala3/new-in-scala3.html)
    - Scala 3の新機能をさっとおさらいしたい人向けです。
- [Scala 3 Book](https://docs.scala-lang.org/scala3/book/introduction.html)
    - 無料で読めるScala 3本です。現時点でScala 3に対して最も読みやすい資料だと思います。
- [Scala 3 リファレンス](https://dotty.epfl.ch/docs/reference/overview.html)
    - Scala 3を全体を通して知りたい方は目を通してください。
- [Scala3に入るかもしれないContextual Abstractionsを味見してみた(更新・追記あり) - Qiita](https://qiita.com/hinastory/items/6dacb1f61d86f4a5d533)
  - 過去にContextual Abstractionsを試したときの記事です。中身は最新の3.0.0-RC1にアップデートしてあります。
- [Scala 3、Pythonのようにインデントベースの構文で書けるようになるってよ！ - Qiita](https://qiita.com/hinastory/items/abb68fe47755894b79ea)
  - 過去に書いたScala 3のインデントベースの構文の記事です。以前のScala 2をご存じの方でインデントベースの構文に違和感を覚えた人向けです。

