---
title: Scala3に入るかもしれないContextual Abstractionsを味見してみた
thumbnail: /gallery/thumbnails/dotty-logo.png
categories:
  - [Tech,Language]
tags:
  - Scala
date: 2019-02-20 05:49:20
---

Scala3のリサーチコンパイラであるDottyにImplicitsに代わる「Contextual Abstractions」と呼ばれる一連の機能が実装されていたので一部を味見してみました。

<!-- more -->

## 目次
<!-- toc -->

## TL;DR

- この記事はDottyに実装されたImplicitsに代わる「Contextual Abstractions」と呼ばれる一連の機能を味見してみたものです
  - 利用したDottyのバージョンは2019年2月時点で最新の0.13.0-RC-1です。Dottyの開発は非常に活発なので異なるバージョンでは本記事の内容とは異なる場合があります
- 「Contextual Abstractions」は従来のImplicitsで初学者が躓きそうな機能を整理して使いやすくしています
  - 「Contextual Abstractions」には従来のImplicitsでは実現できなかった機能(暗黙のインポート、型クラス導出、コンテキストクエリ等)も含まれています
- 「Contextual Abstractions」の機能はまだ提案段階でありScala3の正式な仕様に決定したわけではありません
  - 今後機能が変化したり、機能が採用されなかったりする可能性も十分あります
- 「Contextual Abstractions」がScala3に正式採用された場合、古いImplicitsは段階的に廃止される予定です
  - 「Contextual Abstractions」への移行はScalafixでサポートされる予定です

## Scala3とは

2020年初頭に出ることが予定されているScalaの次世代版です。コンパイラの高速化と大幅な機能強化が行われる予定です。基本的には現行のScala(Scala2)とのソースコードレベルの後方互換性を意識して機能強化が行われていますが[^1]、非互換が生まれるところや推奨の書き方が変わる所はScalfix[^2]で対応することが予定されています。

[^1]: Pythonの教訓を活かして、なるべく言語の世代間の断絶を起こさないように配慮して開発が進められているようです。もちろん配慮が足りていない可能性もありますが・・・
[^2]: {% elink Scalafix https://scalacenter.github.io/scalafix/docs/users/installation.html %}はScalaにおける汎用的はリファクタリング、リンティングツールです。Scala3専用ではありません。

## Dottyとは

Dotty[^3]はScala3の研究用コンパイラで、Scala3の仕様や実装を研究するためのものです。Scala3はDottyがベースになることがアナウンスされています[^4]。

[^3]: コンパイラの理論的な基盤に{% elink Dependent Object Types (DOT)  http://lampwww.epfl.ch/~amin/dot/fool.pdf %}を用いているのが名前の由来です。
[^4]: Dottyに現在入っている機能が全てScala3に取り込まれるわけではありません。Scala3に正式に取り込まれる機能は {% elink Scala Improvement Process (SIP) https://docs.scala-lang.org/sips/ %}(JavaのJCP/JSRのようなもの)を通過する必要があり、ここで承認が得られなければScala3に取り込まれることはありません。2019年2月時点ではDottyの新機能の多くはまだSIP以前の提案段階であり、これから徐々にSIPのレビュープロセスに乗せられていくものと予想されます。

## Contextual Abstractionsとは

現行のScalaには俗にImplicitsと呼ばれる機能がありますが、初学者を非常に混乱させる機能として悪名高いものでした[^5]。そこでDottyには、この混乱に決着を着けるべくImplicitsの機能を包含しつつより整理された「Contextual Abstractions」と呼ばれる一連の機能が実装されました。Implicitsの代替という面でみるとこれらの機能は「implicit」というキーワードをなるべく使わずに別の用語(`implied`/`given`等)で置き換えて、型クラスをより書きやすいようにチューニングしたような内容になっている印象です。本記事では{% elink Dottyドキュメント https://dotty.epfl.ch/docs/index.html %}[^6]を参考にしながら、「Contextual Abstractions」の機能の一部を味見してみました。以下が味見した機能の一覧です[^7]。

- 暗黙のインスタンス(Implied Instances)
- 推論可能パラメータ(Inferable Parameters)
- 拡張メソッド(Extension Methods)
- 型クラスの実装(Implementing Typeclasses)
  - 「暗黙のインスタンス」、「推論可能パラメータ」、「拡張メソッド」でよりシンプルに型クラスが実装可能になりました

[^5]: 現行のImplicitsの混乱するポイントについては{% elink こちらの記事 http://kmizu.hatenablog.com/entry/2017/05/19/074149 %}で詳しく取り上げられています。
[^6]: このドキュメントは最新版のスナップショットなので、どんどん書き換えられています。今の所過去のバージョンは参照できないみたいです・・・
[^7]: 機能の日本語訳は自分がしました。間違っていたら教えてください。

## 味見の方法

{% elink ここ https://github.com/lampepfl/dotty/releases/tag/0.13.0-RC1 %}から`dotty-0.13.0-RC1.zip`をダウンロードして解凍します。解凍後のフォルダの`bin`にパスを通せば利用できるようになります。
`dotc`がコンパイラです。`dotr`はクラス名を指定するとコンパイル済みのバイナリを実行します。単独で起動した場合にはREPLになります。

```bash
$ dotc <ソースファイル名> # ソースコードのコンパイル
$ dotr <メインクラス名> # コンパイル済みのコードを実行
```

## 味見の結果

Dottyドキュメントに記載されている例をベースに味見をしてみました[^8]。

[^8]: 一部で実行しやすいように手を加えたり、コメントで説明を加えたり、例が間違っている箇所を修正したりしているのでドキュメントそのままというわけではないです。

### 基本的な例

従来のImplicitsが分かっている人から見れば、おおよそ以下のコードの意味が分かると思います。
拡張メソッド記法だけは、最初は戸惑うかもしれません。自分は最初Go言語に似ているなと思いました・・・

{% code lang:scala %}
object ImpliedInferableExample {
  // 順序型(Ord)の定義
  trait Ord[T] {
    def compare(x: T, y: T): Int
    def (x: T) < (y: T) = compare(x, y) < 0 // 拡張メソッド記法を使って定義してあります
    def (x: T) > (y: T) = compare(x, y) > 0 // 上記と同様
  }

  // 順序型のIntの暗黙のインスタンスの定義
  implied IntOrd for Ord[Int] {
    def compare(x: Int, y: Int) =
      if (x < y) -1 else if (x > y) +1 else 0
  }

  // 推論可能パラメータ
  def max[T](x: T, y: T) given (ord: Ord[T]): T =
    if (ord.compare(x, y) < 1) y else x

  // 無名推論可能パラメータ
  def maximum[T](xs: List[T]) given Ord[T]: T = xs.reduceLeft(max)

  // コンテキスト境界使った書き換え(Scala2と同様)
  def maximum2[T: Ord](xs: List[T]): T = xs.reduceLeft(max)

  // 推論可能パラメータを使って新しい逆順序のインスタンスを作る関数
  def descending[T] given (asc: Ord[T]): Ord[T] = new Ord[T] {
    def compare(x: T, y: T) = asc.compare(y, x)
  }

  // `given`に直接インスタンスを与えることも可能
  def minimum[T](xs: List[T]) given Ord[T] = maximum(xs) given descending
}

object Main extends App {
  import ImpliedInferableExample._

  println( max(2,3) ) // 3

  val numList = List(1,10,2)
  println( maximum(numList) ) // 10
  println( maximum2(numList) ) // 10
  println( minimum(numList) ) // 1
}
{% endcode %}

### 高度な例

型クラスの高度な実装例です。高度なのでわからない人はスルーしてください。
モナドとは・・・という禅問答をここでする気はないです・・・

{% code lang:scala %}
object TypeClassExample {
  trait Functor[F[_]] {
    def (x: F[A]) map [A, B] (f: A => B): F[B]
  }

  trait Monad[F[_]] extends Functor[F] {
    def (x: F[A]) flatMap [A, B] (f: A => F[B]): F[B]
    def (x: F[A]) map [A, B] (f: A => B) = x.flatMap(f `andThen` pure)

    def pure[A](x: A): F[A]
  }

  implied ListMonad for Monad[List] {
    def (xs: List[A]) flatMap [A, B] (f: A => List[B]): List[B] =
      xs.flatMap(f)
    def pure[A](x: A): List[A] =
      List(x)
  }

  implied ReaderMonad[Ctx] for Monad[[X] => Ctx => X] {
    def (r: Ctx => A) flatMap [A, B] (f: A => Ctx => B): Ctx => B =
      ctx => f(r(ctx))(ctx)
    def pure[A](x: A): Ctx => A =
      ctx => x
  }
}
{% endcode %}

## Contextual Abstractionsのその他の機能

Contextual Abstractionsの機能で味見できなかった機能を簡単に紹介します。

- 暗黙のインポート(Implied Imports)
  - 通常のimportでは`implied`で定義された暗黙のインスタンスはインポートされず、別途`import implied`でインポートする必要があります
  - 暗黙のインスタンスがどこから来たのかを明確にするために導入されたようです
- マルチバーサル等価性(Multiversal Equality)
  - Scala2では文字列と数値が比較可能でしたが、この機能により厳密に型が合っていないとコンパイルエラーにすることもできるようになりました
- 型クラスの導出(Typeclass Derivation)
  - Haskellの`deriving`と同等の機能です。現在のDottyで導出可能な型クラスはマルチバーサル等価性を表す`Eql`のみのようです
  - メタプログラミングを使えば自分で導出可能な型クラスの定義もできます
- 暗黙の型変換(implicit conversion)
  - 元々のImplicitsのトラブルメーカーです。新たに`Conversion`という型が定義されてその暗黙のインスタンスを定義することで利用できます
- コンテキストクエリ(Context Queries)
  - 以前はImplicit Function Typeと呼ばれていた機能で0.13.0-RC-1で構文が変更されました
  - ビルダーパターンを簡単に実装できます

## 味見してみた感想

Implicitsが大分飼いならされたような印象でした。特に従来はimplicitをパラメータリストで受け取っていたのを`given`という専用構文で受け取るようになったのが非常に分かりやすかったです。ただ、従来の`implicitly`の名称はまだかなり揺れているみたいです[^9]。

もともとは{% elink この記事 https://medium.com/@jducoeur/a-snippet-of-dotty-27eadcee72e3 %}を読んで、あまりにも自分が知っているScalaと違っていたので調べ始めたのがこの記事を書こうと思ったきっかけです。この記事がScala3がどういう方向を目指しているのか知りたい人の参考になれば幸いです。

[^9]: もともと`summon`という名前で提案されていましたが、`0.13.0-RC-1`では`infer`に変わり、現在のmasterブランチでは`the`に変更されています。ちょうどこの記事を書いている途中で変更が {% elink masterにマージされた https://github.com/lampepfl/dotty/pull/5893 %}ので、混乱しないように慌てて味見の結果から`infer`を抜きました。