---
title: Scala3に入るかもしれないContextual Abstractionsを味見してみた(更新・追記あり)
thumbnail: /gallery/thumbnails/dotty-logo.png
categories:
  - [Tech,Language]
tags:
  - Scala
  - Dotty
date: 2019-02-24 12:49:20
---

Scala3のリサーチコンパイラである{% elink Dotty http://dotty.epfl.ch/ %}にImplicitsに代わる「Contextual Abstractions」と呼ばれる一連の機能が実装されていたので一部を味見してみました。

（記事の本文は2020年2月8日時点のDotty最新版と整合するように更新されています。更新の詳細は[ここ](/cats-cats-cats/2019/02/24/scala-dotty-contextual-abstractions/#追記更新内容)を見てくださいを見てください。)

<!-- more -->

## 目次
<!-- toc -->

## TL;DR

- この記事はDottyに実装されたImplicitsに代わる「Contextual Abstractions」と呼ばれる一連の機能を味見してみたものです
  - ~~利用したDottyのバージョンは2019年2月時点で最新の0.13.0-RC1です。Dottyの開発は非常に活発なので異なるバージョンでは本記事の内容とは異なる場合があります~~
  - ~~2019年6月時点で最新の0.16.0-RC3で変更があった文法の更新を反映しました。Dottyの開発は非常に活発なので異なるバージョンでは本記事の内容とは異なる場合があります~~
  - ~~2019年9月時点で最新の0.18.1-RC1に更新しました。Dottyの開発は非常に活発なので異なるバージョンでは本記事の内容とは異なる場合があります~~
  - ~~2019年9月時点で最新の0.19.0-RC1に更新しました。Dottyの開発は非常に活発なので異なるバージョンでは本記事の内容とは異なる場合があります~~
  - 2020年2月時点で最新の0.19.0-RC1に更新しました。Dottyの開発は非常に活発なので異なるバージョンでは本記事の内容とは異なる場合があります
- 「Contextual Abstractions」は従来のImplicitsで初学者が躓きそうな機能を整理して使いやすくしています
  - 「Contextual Abstractions」には従来のImplicitsでは実現できなかった機能(暗黙のインポート、型クラス導出、コンテキストクエリ等)も含まれています
- 「Contextual Abstractions」の機能はまだ提案段階でありScala3の正式な仕様に決定したわけではありません
  - 今後機能が変化したり、機能が採用されなかったりする可能性も十分あります
- 「Contextual Abstractions」がScala3に正式採用された場合、古いImplicitsは段階的に廃止される予定です
  - 「Contextual Abstractions」への移行はScalafixでサポートされる予定です
- この記事で紹介したサンプルコードは以下のリポジトリにあります。
  - {% elink hinastory/dotty_examples: Example code of Dotty (Scala 3) https://github.com/hinastory/dotty_examples %}

## Scala3とは

2020年初頭に出ることが予定されているScalaの次世代版です。コンパイラの高速化と大幅な機能強化が行われる予定です。基本的には現行のScala(Scala2)とのソースコードレベルの後方互換性を意識して機能強化が行われていますが[^1]、非互換が生まれるところや推奨の書き方が変わる所はScalfix[^2]で対応することが予定されています。

[^1]: Pythonの教訓を活かして、なるべく言語の世代間の断絶を起こさないように配慮して開発が進められているようです。もちろん配慮が足りていない可能性もありますが・・・
[^2]: {% elink Scalafix https://scalacenter.github.io/scalafix/ %}はScalaにおける汎用的はリファクタリング、リンティングツールです。Scala3専用ではありません。

## Dottyとは

Dotty[^3]はScala3の研究用コンパイラで、Scala3の仕様や実装を研究するためのものです。Scala3はDottyがベースになることがアナウンスされています[^4]。

[^3]: コンパイラの理論的な基盤に{% elink Dependent Object Types (DOT)  http://lampwww.epfl.ch/~amin/dot/fool.pdf %}を用いているのが名前の由来です。
[^4]: Dottyに現在入っている機能が全てScala3に取り込まれるわけではありません。Scala3に正式に取り込まれる機能は {% elink Scala Improvement Process (SIP) https://docs.scala-lang.org/sips/ %}(JavaのJCP/JSRのようなもの)を通過する必要があり、ここで承認が得られなければScala3に取り込まれることはありません。2019年2月時点ではDottyの新機能の多くはまだSIP以前の提案段階であり、これから徐々にSIPのレビュープロセスに乗せられていくものと予想されます。

## Contextual Abstractionsとは

現行のScalaには俗にImplicitsと呼ばれる機能がありますが、初学者を非常に混乱させる機能として悪名高いものでした[^5]。そこでDottyには、この混乱に決着を着けるべくImplicitsの機能を包含しつつより整理された「Contextual Abstractions」と呼ばれる一連の機能が実装されました[^6]。Implicitsの代替という面でみるとこれらの機能は「implicit」というキーワードをなるべく使わずに別の用語(`given`等)で置き換えて、型クラスをより書きやすいようにチューニングしたような内容になっている印象です。本記事では{% elink Dottyドキュメント https://dotty.epfl.ch/docs/index.html %}[^7]を参考にしながら、「Contextual Abstractions」の機能の一部を味見してみました。以下が味見した機能の一覧です[^8]。

- `given`インスタンス(Given Instances)
  - 従来の`implicit`で定義されていたインスタンスと同等です
- `using`節(Using Clauses)
  - 従来の`implicit`で定義されていたパラメータリストと同等です
- `given`インポート(Given Imports)
  - 通常のimportでは`given`で定義された`given`インスタンスはインポートされず、別途`import A.given`でインポートする必要があります
  - `import A.{given, _}`でパッケージAの`given`インスタンスも含めた全てをインポートできます
  - `given`インスタンスがどこから来たのかを明確にするために導入されたようです
- 拡張メソッド(Extension Methods)
  - Dottyの新機能です
  - 型が定義された後にメソッドを追加することができます
- 型クラスの実装(Implementing Typeclasses)
  - 「`given`インスタンス」、「`using`節」、「拡張メソッド」でよりシンプルに型クラスが実装可能になりました

[^5]: 現行のImplicitsの混乱するポイントについては{% elink こちらの記事 http://kmizu.hatenablog.com/entry/2017/05/19/074149 %}で詳しく取り上げられています。
[^6]: 暗黙のインスタンスと推論可能パラメータが追加された経緯を知りたい方は{% elink #5458 https://github.com/lampepfl/dotty/pull/5458 %}と {% elink #5852 https://github.com/lampepfl/dotty/pull/5825 %}をご確認ください・・・#5458の方は長すぎてまともに追っていませんが元々は`witness`というキーワードで提案されて途中で`instance`に変わって#5825で`implied`に変わったようです。本当に大激論で互換性に対する懸念が何回も強く出ています。とりあえずこの機能はSIPを通さないとScala3に入ることはないという念押しでマージされました。それ以外のContextual Abstractionsの機能(拡張メソッドや型クラスの導出等)はここまでもめた様子はなかったです。さらに{% elink #6649 https://github.com/lampepfl/dotty/pull/6649 %}
で`delegate`に変更されました。そしてさらに、{% elink #6773 https://github.com/lampepfl/dotty/pull/6773 %}と{% elink #7210 https://github.com/lampepfl/dotty/pull/7210 %}で大幅に文法チェンジ！！`delegate`が排除されて`given`一色になりました・・・　本当に何回変わるんだろう・・・ツライ・・・
[^7]: このドキュメントは最新版のスナップショットなので、どんどん書き換えられています。今の所過去のバージョンは参照できないみたいです・・・
[^8]: 機能の日本語訳は自分がしました。間違っていたら教えてください。

## 味見の方法

{% elink ここ https://github.com/lampepfl/dotty/releases/tag/0.22.0-RC1 %}から`dotty-0.22.0-RC1.zip`をダウンロードして解凍します。解凍後のフォルダの`bin`にパスを通せば利用できるようになります。
`dotc`がコンパイラです。`dotr`はクラス名を指定するとコンパイル済みのバイナリを実行します。単独で起動した場合にはREPLになります。

```bash
$ dotc <ソースファイル名> # ソースコードのコンパイル
$ dotr <メインクラス名> # コンパイル済みのコードを実行
```

もしくはサンプルコードをGitHubで公開したので、`sbt`をすでにインストールされている方はそちらの方が早いと思います。使い方は`README.md`をご覧ください

{% ghCard hinastory/dotty_examples %}

## 味見の結果

Dottyドキュメントに記載されている例をベースに味見をしてみました[^9]。

[^9]: 一部で実行しやすいように手を加えたり、コメントで説明を加えたり、例が間違っている箇所を修正したりしているのでドキュメントそのままというわけではないです。


### 基本的な例(拡張メソッド)

拡張メソッドは既存の型にメソッドを注入できる機能です。ポイントは「継承」を用いずにアドホックにメソッド拡張を行える点です。

拡張の仕方は３通りあって、直接、型にメソッドを拡張する方法と、トレイトを用いて拡張メソッドを定義したあとに、`given`インスタンスで注入する方法と`extension`キーワードを使って拡張メソッドの定義と注入を一緒に済ませてしまう方法です。

{% code lang:scala %}
/** 拡張メソッドのサンプル */
object ExtensionMethodExampleDefs {
  // Circle型にcircumferenceメソッドを拡張する
  case class Circle(x: Double, y: Double, radius: Double)
  def (c: Circle).circumference: Double = c.radius * math.Pi * 2

  // Seq[String]型にlongestStringsメソッドを拡張する
  trait StringSeqOps {
    def (xs: Seq[String]).longestStrings = {
      val maxLength = xs.map(_.length).max
      xs.filter(_.length == maxLength)
    }
  }

  // 演算子タイプの拡張メソッド
  def (x: String) << (y: String) = s"???? $x $y ????"

  // `extension`を用いた専用構文でも定義可能
  extension stringOps on (xs: Seq[String]) {
    def longestStrings2: Seq[String] = {
      val maxLength = xs.map(_.length).max
      xs.filter(_.length == maxLength)
    }
  }

  // ジェネリクスを用いた`extension`も可能
  extension listOps on [T](xs: List[T]) {
    def second = xs.tail.head
    def third: T = xs.tail.tail.head
  }

  // 無名の`extension`も可能
  extension on [T](xs: List[T])(using Ordering[T]) {
    def largest(n: Int) = xs.sorted.takeRight(n)
  }
}
{% endcode %}

以下のように利用します。

{% code lang:scala %}
object ExtensionMethodExample {
  import ExtensionMethodExampleDefs.{_, given}
  def use(): Unit = {
    println("\n--- start ExtensionMethodExample ---")
    val circle = Circle(0, 0, 1)
    println( circle.circumference ) // 6.283185307179586
    println( "abc" << "def" ) // ???? abc def ????

    given ops1 as StringSeqOps
    println( List("here", "is", "a", "list").longestStrings ) // List("here", "list")

    // extension構文で定義してものは`given`をする必要はない
    println( List("here", "is", "a", "list").longestStrings2 ) // List("here", "list")
    println( List(1, 2, 3, 4, 5).third ) // 3
    println( List(1, 2, 5, 12, -3).largest(2) ) // List(5, 12)
  }
}
{% endcode %}


### 少し高度な例(`given`インスタンス、`using`節)

前述のとおり`given`インスタンスは型を拡張するときに用いることができますが、その応用として型パラメータを持つ型を「共通の型」として他の型を拡張できます。この機能は「型クラス」とも呼ばれますが詳細は次節で説明します。

`using`節ではスコープに存在する`given`インスタンスを受け取ることができます。仮に`using`節で指定された変数の型にマッチする`given`インスタンスがスコープに存在すれば、呼び出し時に`using`節を省略することができます。

以下の例では`Int`型と`List`型を`Ord`型で拡張しています。また、`using`節を用いて`max`関数や`maximam`関数等を定義しています。

{% code lang:scala %}
/** `given`インスタンス、`using`節のサンプル */
object GivenExampleDefs {
  /** 順序型の定義 */
  trait Ord[T] {
    def compare(x: T, y: T): Int
    def (x: T) < (y: T) = compare(x, y) < 0 // 拡張メソッド記法を使って定義してあります
    def (x: T) > (y: T) = compare(x, y) > 0 // 上記と同様
  }

  /** 順序型のIntの`given`インスタンスの定義 */
  given intOrd: Ord[Int] {
    def compare(x: Int, y: Int) =
      if (x < y) -1 else if (x > y) +1 else 0
  }

  /** 順序型のListの`given`インスタンスの定義 */
  given listOrd[T](using ord: Ord[T]): Ord[List[T]]  {
    def compare(xs: List[T], ys: List[T]): Int = (xs, ys) match {
      case (Nil, Nil) => 0
      case (Nil, _) => -1 // 空リストよりも非空リストの方が大きい
      case (_, Nil) => +1 // 同上
      case (x :: xs1, y :: ys1) =>
        val fst = ord.compare(x, y) // 先頭の大きさがLists全体の大きさ
        if (fst != 0) fst else compare(xs1, ys1) // 同じだったら次の要素を再帰的に繰り返す
    }
  }

  /** `using`節 */
  def max[T](x: T, y: T)(using ord: Ord[T]): T =
    if (ord.compare(x, y) < 1) y else x

  /** 無名`using`節 */
  def maximum[T](xs: List[T])(using Ord[T]): T = xs.reduceLeft(max)

  /** コンテキスト境界使った書き換え(Scala2と同様) */
  def maximum2[T: Ord](xs: List[T]): T = xs.reduceLeft(max)

  /** `using`節を使って新しい逆順序型クラスインスタンスを作る関数 */
  def descending[T](using asc: Ord[T]): Ord[T] = new Ord[T] {
    def compare(x: T, y: T) = asc.compare(y, x)
  }

  /** より複雑な推論 */
  def minimum[T](xs: List[T])(using Ord[T]) = maximum(xs)(using descending)
}
{% endcode %}

`given`インスタンスの利用例が以下になります。

{% code lang:scala %}

/** `GivenExapmple`の利用方法 */
object GivenExample {
  import GivenExampleDefs.{_, given} // givenは　`Ord`の`<`演算子を利用するのに必要

  def use(): Unit = {
    println("\n--- start GivenExample ---")

    println( max(2,3) ) // 3
    println( max(List(1, 2, 3), Nil) ) // List(1, 2, 3)
    println(List(1, 2, 3) < List(1, 2, 3, 4)) // true
    println(List(9, 2, 3) < List(1, 2, 3, 4)) // false

    val numList = List(1,10,2)
    println( maximum(numList) ) // 10
    println( maximum2(numList) ) // 10
    println( minimum(numList) ) // 1
  }
}
{% endcode %}

### 高度な例(型クラス)

型クラスは単一の型を拡張するわけではなく「共通の型」を用意して「共通の型」を後から既存の型にアドホックに注入して拡張できる点が異なります。すでにコードで紹介した例を用いて型クラスとそうでない拡張を区別すると以下のようになります。

- 単一の型を拡張（型クラスではない）
    - `String`型を拡張して`longestStrings`メソッドを追加
- 共通の型で複数の型を拡張(型クラス)
    - Ord型クラスを定義
        - 実態は型パラメータを持つトレイトで複数の型で共通で使えるメソッド`compare`と演算子`<`、`>`を持っている
    - `given`インスタンスを用いて`Int`型を`Ord`型クラスで拡張（`intOrd`）
    - `given`インスタンスを用いて`List`型を`Ord`型クラスで拡張(`listOrd`)

以下の例ではプログラミングで有用な型クラスとして半群(`Semigroup`)、モノイド(`Monoid`)、関手(`Functor`)、モナド(`Monad`)を定義しています。また、型クラスの`given`インスタンスも定義しています。

{% code lang:scala %}
/** 型クラスのサンプル */
object TypeClassExampleDefs {
  import annotation.infix
  /** 半群の型クラス */
  trait SemiGroup[T] {
    @infix def (x: T) combine (y: T): T
  }

  /** モノイドの型クラス */
  trait Monoid[T] extends SemiGroup[T] {
    def unit: T
  }

  /** applyでモノイドを召喚 */
  object Monoid {
    def apply[T](using m: Monoid[T]) = m
  }

  /** `String`モノイド */
  given Monoid[String] {
    def (x: String) combine (y: String): String = x.concat(y)
    def unit: String = ""
  }

  /** `Int`モノイド */
  given Monoid[Int] {
    def (x: Int) combine (y: Int): Int = x + y
    def unit: Int = 0
  }

  /** モノイドの和を求める */
  def sum[T: Monoid](xs: List[T]): T =
    xs.foldLeft(Monoid[T].unit)(_ combine _)

  /** 関手の型クラス */
  trait Functor[F[_]] {
    def [A, B](x: F[A]).map(f: A => B): F[B]
  }

  /** モナドの型クラス */
  trait Monad[F[_]] extends Functor[F] {
    def [A, B](x: F[A]).flatMap(f: A => F[B]): F[B]
    def [A, B](x: F[A]).map(f: A => B) = x.flatMap(f `andThen` pure)

    def pure[A](x: A): F[A]
  }

  /** リストモナドのインスタンスを定義 */
  given listMonad as Monad[List] {
    def [A, B](xs: List[A]).flatMap(f: A => List[B]): List[B] =
      xs.flatMap(f)
    def pure[A](x: A): List[A] =
      List(x)
  }

  /** リーダモナドのインスタンスを定義 */
  given readerMonad[Ctx] as Monad[[X] =>> Ctx => X] {
    def [A, B](r: Ctx => A).flatMap(f: A => Ctx => B): Ctx => B =
      ctx => f(r(ctx))(ctx)
    def pure[A](x: A): Ctx => A =
      ctx => x
  }

  /** 関手の利用 */
  def transform[F[_], A, B](src: F[A], func: A => B)(using Functor[F]): F[B] = src.map(func)

  /** コンテキスト境界を使った書き換え */
  def transform2[F[_]: Functor, A, B](src: F[A], func: A => B): F[B] = src.map(func)
}
{% endcode %}

型クラスは以下のように利用できます。

{% code lang:scala %}
/** `TypeClassExampleDefs`の利用方法 */
object TypeClassExample {
  import TypeClassExampleDefs.{given, _}

  def use(): Unit = {
    println("\n--- start TypeClassExample ---")
    println( sum(List("abc", "def", "gh")) ) // abcdefgh
    println( sum(List(1, 2, 3)) ) // 6
    println( summon[Monad[List]].pure(12) ) // List(12)

    println( transform(List(1, 2, 3), (_:Int) * 2) ) // List(2, 4, 6)

    // Reader Monad Example
    val calc: Int => Int = for {
      x <- (e:Int) => e + 1
      y <- (e:Int) => e * 10
    } yield x + y

    println( calc(3) ) // 34
  }
}
{% endcode %}

## Contextual Abstractionsのその他の機能

Contextual Abstractionsの機能で味見できなかった機能を簡単に紹介します。

- マルチバーサル等価性(Multiversal Equality)
  - Scala2では文字列と数値が比較可能でしたが、この機能により厳密に型が合っていないとコンパイルエラーにすることもできるようになりました
- 型クラスの導出(Typeclass Derivation)
  - Haskellの`deriving`と同等の機能です。現在のDottyで導出可能な型クラスはマルチバーサル等価性を表す`Eql`のみのようです
  - メタプログラミングを使えば自分で導出可能な型クラスの定義もできます
- 暗黙の型変換(implicit conversion)
  - 元々のImplicitsのトラブルメーカーです。新たに`Conversion`という型が定義されてその暗黙のインスタンスを定義することで利用できます
- コンテキスト関数(Context Functions)
  - 以前はImplicit Function Typeと呼ばれていた機能で0.13.0-RC-1で構文が変更されました
  - ビルダーパターンを簡単に実装できます

## 味見してみた感想

Implicitsが大分飼いならされたような印象でした。特に従来はimplicitをパラメータリストで受け取っていたのを`given`という専用構文で受け取るようになったのが非常に分かりやすかったです。ただ、従来の`implicitly`の名称はまだかなり揺れているみたいです[^10]。

もともとは{% elink 「A Snippet of Dotty」 https://medium.com/@jducoeur/a-snippet-of-dotty-27eadcee72e3 %}を読んで、あまりにも自分が知っているScalaと違っていたので調べ始めたのがこの記事を書こうと思ったきっかけです。この記事がScala3がどういう方向を目指しているのか知りたい人の参考になれば幸いです。

[^10]: もともと`summon`という名前で提案されていましたが、`0.13.0-RC-1`では`infer`に変わり、{% elink #5893 https://github.com/lampepfl/dotty/pull/5893 %}では`the`に変更されています。しかし、{% elink #7205 https://github.com/lampepfl/dotty/pull/7205 %}でまさかの`summon`の復活!! 追うのも楽じゃない・・・

## 追記・更新内容

### 2019年3月10日の更新内容

{% elink 本家のブログ https://dotty.epfl.ch/blog/2019/03/05/13th-dotty-milestone-release.html %}が公開されたようです。`0.13.0-RC-1`のタグが打たれてから10日以上経ってからの公開なのでかなり遅い方だと思いますが、それだけ今回のリリースが盛りだくさんだったと言うことだと思います。本家のブログには従来の`implicit`がなぜダメだったのか丁寧に説明されていました。

{% blockquote Dotty Blogより %}
The implicit keyword is used for both implicit conversions and conditional implicit values and we identified that their semantic differences must be communicated more clearly syntactically. Furthermore, the implicit keyword is ascribed too many overloaded meanings in the language (implicit vals, defs, objects, parameters). For instance, a newcomer can easily confuse the two examples above, although they demonstrate completely different things, a typeclass instance is an implicit object or val if unconditional and an implicit def with implicit parameters if conditional; arguably all of them are surprisingly similar (syntactically). Another consideration is that the implicit keyword annotates a whole parameter section instead of a single parameter, and passing an argument to an implicit parameter looks like a regular application. This is problematic because it can create confusion regarding what parameter gets passed in a call. Last but not least, sometimes implicit parameters are merely propagated in nested function calls and not used at all, so giving names to implicit parameters is often redundant and only adds noise to a function signature.
{% endblockquote %}

意訳すると従来の`implicit`には`implicit conversions`と`conditional implicit values`の２つの用途があったけど、意味が違うし初学者は混同しやすいので構文的に別にするという話です。というか`conditional implicit values`という言い方は自分は初めて目にしました。単純な`implicit values`よりもわかりやすいですね。

この本家のブログを受けてというわけではないですが、前回の記事でサンプルの解説が大分雑だったのでいろいろと見直して、サンプルコードも{% elink GitHubに公開しました https://github.com/hinastory/dotty_examples %}。興味のある方は味見をして頂けると幸いです。

### 2019年6月22日の更新内容

先日発表された{% elink Dotty 0.16.0-RC3 https://dotty.epfl.ch/blog/2019/06/11/16th-dotty-milestone-release.html}で本記事に関する大きな文法変更が行われました。具体的には以下の通りです。

- `implied`から`delegate`にキーワードを変更 (＃6649)
- 型ラムダに=>>を使用 (＃6558)
  - サンプルコードで使用していた
- `given`節を最後にする (#6513)
  - 0.15.0-RC1で変更

上記の変更に伴い本文の該当箇所を修正しました。また、{% elink GitHubに公開したサンプルコード https://github.com/hinastory/dotty_examples %}も0.16.0-RC3にしてあります。あと何回キーワードが変更されるんだろう・・・

### 2019年9月15日の更新内容

先日発表された{% elink Dotty 0.18.1-RC1 https://dotty.epfl.ch/blog/2019/08/30/18th-dotty-milestone-release.html %}でリーダーモナドの例がコンパイルできるようになっていました。また、0.18.1-RC1で追加されたインデントベースの構文についても記事を書いたので興味があればご一読ください。

- {% link Scala 3、Pythonのようにインデントベースの構文で書けるようになるってよ！ https://hinastory.github.io/cats-cats-cats/2019/09/15/scala-indentation/ %}

### 2019年9月28日の更新内容

先日発表された{% elink Dotty 0.19.0-RC1 https://dotty.epfl.ch/blog/2019/09/23/19th-dotty-milestone-release.html %}で本記事に関する文法が大きく変更されました。関連するプルリクは主に以下の4つです。

- {% elink Trial: given as instead of delegate for by odersky · Pull Request #6773 · lampepfl/dotty https://github.com/lampepfl/dotty/pull/6773 %}
- {% elink Change to new given syntax by odersky · Pull Request #7210 · lampepfl/dotty https://github.com/lampepfl/dotty/pull/7210 %}
- {% elink Drop old syntax styles for givens by odersky · Pull Request #7245 · lampepfl/dotty https://github.com/lampepfl/dotty/pull/7245 %}
- {% elink Replace the[...] by summon[...] by odersky · Pull Request #7205 · lampepfl/dotty https://github.com/lampepfl/dotty/pull/7205 %}

簡単に言うと`delegate`が`given`に置き換えられて`given`節が`given`パラメータになって`summon`大復活です。0.19.0-RC1より前のものも含まれていますが、今回合わせて修正しました。


### 2020年2月8日の更新内容

Dottyは0.21.0でめでたく`feature-complete`しました。つまりこれ以降は大きな機能追加はないはずです。　・・・と安心していたら0.22.0で`using`キーワードが追加されました。文法の調整はまだ続くようです・・・
今回は以下の３つのリリースで行われた修正を反映しています。

- {% elink Announcing Dotty 0.20.0-RC1 – `with` starting indentation blocks, inline given specializations and more https://dotty.epfl.ch/blog/2019/11/04/20th-dotty-milestone-release.html %}
- {% elink Announcing Dotty 0.21.0-RC1 - explicit nulls, new syntax for `match` and conditional givens, and more https://dotty.epfl.ch/blog/2019/12/20/21th-dotty-milestone-release.html %}
- {% elink Announcing Dotty 0.22.0-RC1 - syntactic enhancements, type-level arithmetic and more https://dotty.epfl.ch/blog/2020/02/05/22nd-dotty-milestone-release.html %}

大きな変更は`using`、`on`、`as`、`extension`などのキーワードが登場してより読みやすくなったことだと思います。実際の使い方は記事本文をご覧ください。
あと、今まで拡張メソッドはこの記事では説明がなかったので追加しました。