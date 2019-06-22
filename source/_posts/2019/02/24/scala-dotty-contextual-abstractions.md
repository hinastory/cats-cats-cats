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

(2019年3月10日追記・更新: 追記内容は[ここ](/cats-cats-cats/2019/02/24/scala-dotty-contextual-abstractions/#2019%E5%B9%B43%E6%9C%8810%E6%97%A5%E3%81%AE%E6%9B%B4%E6%96%B0%E5%86%85%E5%AE%B9)を見てください)

(2019年6月22日追記・更新: 追記内容は[ここ](/cats-cats-cats/2019/02/24/scala-dotty-contextual-abstractions/#2019%E5%B9%B46%E6%9C%8822%E6%97%A5%E3%81%AE%E6%9B%B4%E6%96%B0%E5%86%85%E5%AE%B9)を見てください)

<!-- more -->

## 目次
<!-- toc -->

## TL;DR

- この記事はDottyに実装されたImplicitsに代わる「Contextual Abstractions」と呼ばれる一連の機能を味見してみたものです
  - ~~利用したDottyのバージョンは2019年2月時点で最新の0.13.0-RC1です。Dottyの開発は非常に活発なので異なるバージョンでは本記事の内容とは異なる場合があります~~
  - 2019年6月時点で最新の0.16.0-RC3で変更があった文法の更新を反映しました。Dottyの開発は非常に活発なので異なるバージョンでは本記事の内容とは異なる場合があります
- 「Contextual Abstractions」は従来のImplicitsで初学者が躓きそうな機能を整理して使いやすくしています
  - 「Contextual Abstractions」には従来のImplicitsでは実現できなかった機能(暗黙のインポート、型クラス導出、コンテキストクエリ等)も含まれています
- 「Contextual Abstractions」の機能はまだ提案段階でありScala3の正式な仕様に決定したわけではありません
  - 今後機能が変化したり、機能が採用されなかったりする可能性も十分あります
- 「Contextual Abstractions」がScala3に正式採用された場合、古いImplicitsは段階的に廃止される予定です
  - 「Contextual Abstractions」への移行はScalafixでサポートされる予定です

## Scala3とは

2020年初頭に出ることが予定されているScalaの次世代版です。コンパイラの高速化と大幅な機能強化が行われる予定です。基本的には現行のScala(Scala2)とのソースコードレベルの後方互換性を意識して機能強化が行われていますが[^1]、非互換が生まれるところや推奨の書き方が変わる所はScalfix[^2]で対応することが予定されています。

[^1]: Pythonの教訓を活かして、なるべく言語の世代間の断絶を起こさないように配慮して開発が進められているようです。もちろん配慮が足りていない可能性もありますが・・・
[^2]: {% elink Scalafix https://scalacenter.github.io/scalafix/ %}はScalaにおける汎用的はリファクタリング、リンティングツールです。Scala3専用ではありません。

## Dottyとは

Dotty[^3]はScala3の研究用コンパイラで、Scala3の仕様や実装を研究するためのものです。Scala3はDottyがベースになることがアナウンスされています[^4]。

[^3]: コンパイラの理論的な基盤に{% elink Dependent Object Types (DOT)  http://lampwww.epfl.ch/~amin/dot/fool.pdf %}を用いているのが名前の由来です。
[^4]: Dottyに現在入っている機能が全てScala3に取り込まれるわけではありません。Scala3に正式に取り込まれる機能は {% elink Scala Improvement Process (SIP) https://docs.scala-lang.org/sips/ %}(JavaのJCP/JSRのようなもの)を通過する必要があり、ここで承認が得られなければScala3に取り込まれることはありません。2019年2月時点ではDottyの新機能の多くはまだSIP以前の提案段階であり、これから徐々にSIPのレビュープロセスに乗せられていくものと予想されます。

## Contextual Abstractionsとは

現行のScalaには俗にImplicitsと呼ばれる機能がありますが、初学者を非常に混乱させる機能として悪名高いものでした[^5]。そこでDottyには、この混乱に決着を着けるべくImplicitsの機能を包含しつつより整理された「Contextual Abstractions」と呼ばれる一連の機能が実装されました[^6]。Implicitsの代替という面でみるとこれらの機能は「implicit」というキーワードをなるべく使わずに別の用語(`delegate`/`given`等)で置き換えて、型クラスをより書きやすいようにチューニングしたような内容になっている印象です。本記事では{% elink Dottyドキュメント https://dotty.epfl.ch/docs/index.html %}[^7]を参考にしながら、「Contextual Abstractions」の機能の一部を味見してみました。以下が味見した機能の一覧です[^8]。

- デリゲート(Delegates)
  - 従来の`implicit`で定義されていたインスタンスと同等です
- Given節(Given Clauses)
  - 従来の`implicit`で定義されていたパラメータリストと同等です
- デリゲートインポート(Delegate Imports)
  - 通常のimportでは`delegate`で定義された暗黙のデリゲートはインポートされず、別途`import delegate`でインポートする必要があります
  - デリゲートがどこから来たのかを明確にするために導入されたようです
- 拡張メソッド(Extension Methods)
  - Dottyの新機能です
  - 型が定義された後にメソッドを追加することができます
- 型クラスの実装(Implementing Typeclasses)
  - 「デリゲート」、「Given節」、「拡張メソッド」でよりシンプルに型クラスが実装可能になりました

[^5]: 現行のImplicitsの混乱するポイントについては{% elink こちらの記事 http://kmizu.hatenablog.com/entry/2017/05/19/074149 %}で詳しく取り上げられています。
[^6]: 暗黙のインスタンスと推論可能パラメータが追加された経緯を知りたい方は{% elink #5458 https://github.com/lampepfl/dotty/pull/5458 %}と {% elink #5852 https://github.com/lampepfl/dotty/pull/5825 %}をご確認ください・・・#5458の方は長すぎてまともに追っていませんが元々は`witness`というキーワードで提案されて途中で`instance`に変わって#5825で`implied`に変わったようです。本当に大激論で互換性に対する懸念が何回も強く出ています。とりあえずこの機能はSIPを通さないとScala3に入ることはないという念押しでマージされました。それ以外のContextual Abstractionsの機能(拡張メソッドや型クラスの導出等)はここまでもめた様子はなかったです。さらに[#6649](https://github.com/lampepfl/dotty/pull/6649)で`delegate`に変更されました・・・　本当に何回変わるんだろう・・・
[^7]: このドキュメントは最新版のスナップショットなので、どんどん書き換えられています。今の所過去のバージョンは参照できないみたいです・・・
[^8]: 機能の日本語訳は自分がしました。間違っていたら教えてください。

## 味見の方法

{% elink ここ https://github.com/lampepfl/dotty/releases/tag/0.16.0-RC3 %}から`dotty-0.16.0-RC3.zip`をダウンロードして解凍します。解凍後のフォルダの`bin`にパスを通せば利用できるようになります。
`dotc`がコンパイラです。`dotr`はクラス名を指定するとコンパイル済みのバイナリを実行します。単独で起動した場合にはREPLになります。

```bash
$ dotc <ソースファイル名> # ソースコードのコンパイル
$ dotr <メインクラス名> # コンパイル済みのコードを実行
```

もしくはサンプルコードをGitHubで公開したので、`sbt`をすでにインストールされている方はそちらの方が早いと思います。使い方は`README.md`をご覧ください

{% linkPreview  https://github.com/hinastory/dotty_contextual_abstractions_example %}

## 味見の結果

Dottyドキュメントに記載されている例をベースに味見をしてみました[^9]。

[^9]: 一部で実行しやすいように手を加えたり、コメントで説明を加えたり、例が間違っている箇所を修正したりしているのでドキュメントそのままというわけではないです。

### 基本的な例

従来のImplicitsが分かっている人から見れば、おおよそ以下のコードの意味が分かると思います。
拡張メソッド記法だけは、最初は戸惑うかもしれません。自分は最初Go言語に似ているなと思いました・・・

{% code lang:scala %}
/** 暗黙のインスタンス、推論可能パラメータのサンプル */
object DelegateExample {
  /** 順序型の定義 */
  trait Ord[T] {
    def compare(x: T, y: T): Int
    def (x: T) < (y: T) = compare(x, y) < 0 // 拡張メソッド記法を使って定義してあります
    def (x: T) > (y: T) = compare(x, y) > 0 // 上記と同様
  }

  /** 順序型のIntの暗黙のインスタンスの定義 */
  delegate IntOrd for Ord[Int] {
    def compare(x: Int, y: Int) =
      if (x < y) -1 else if (x > y) +1 else 0
  }

  /** 順序型のListの暗黙のインスタンスの定義 */
  delegate ListOrd[T] for Ord[List[T]] given (ord: Ord[T]) {
    def compare(xs: List[T], ys: List[T]): Int = (xs, ys) match {
      case (Nil, Nil) => 0
      case (Nil, _) => -1 // 空リストよりも非空リストの方が大きい
      case (_, Nil) => +1 // 同上
      case (x :: xs1, y :: ys1) =>
        val fst = ord.compare(x, y) // 先頭の大きさがLists全体の大きさ
        if (fst != 0) fst else compare(xs1, ys1) // 同じだったら次の要素を再帰的に繰り返す
    }
  }

  /** 推論可能パラメータ */
  def max[T](x: T, y: T) given (ord: Ord[T]): T =
    if (ord.compare(x, y) < 1) y else x

  /** 無名推論可能パラメータ */
  def maximum[T](xs: List[T]) given Ord[T]: T = xs.reduceLeft(max)

  /** コンテキスト境界使った書き換え(Scala2と同様) */
  def maximum2[T: Ord](xs: List[T]): T = xs.reduceLeft(max)

  /** 推論可能パラメータを使って新しい逆順序型クラスインスタンスを作る関数 */
  def descending[T] given (asc: Ord[T]): Ord[T] = new Ord[T] {
    def compare(x: T, y: T) = asc.compare(y, x)
  }

  /** より複雑な推論 */
  def minimum[T](xs: List[T]) given Ord[T] = maximum(xs) given descending
}

/** `DelegateExapmple`の利用方法 */
object DelegateExampleUseCase {
  import DelegateExample._
  import delegate DelegateExample._ // Listの`<`演算子を利用するのに必要

  def use(): Unit = {
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

### 高度な例

型クラスの高度な実装例です。高度なのでわからない人はスルーしてください。
モナドとは・・・という禅問答をここでする気はないです・・・
リーダーモナドのサンプルですが0.13.0-RC-1ではコンパイラが固まって動かなかったのでコメントアウトしています。
多分コンパイラのバグだと思いますが、残念ですね・・・[^10]

{% code lang:scala %}
/** 型クラスのサンプル */
object TypeClassExample {
  /** 関手の型クラス */
  trait Functor[F[_]] {
    def (x: F[A]) map [A, B] (f: A => B): F[B]
  }

  /** モナドの型クラス */
  trait Monad[F[_]] extends Functor[F] {
    def (x: F[A]) flatMap [A, B] (f: A => F[B]): F[B]
    def (x: F[A]) map [A, B] (f: A => B) = x.flatMap(f `andThen` pure)

    def pure[A](x: A): F[A]
  }

  /** リストモナドのインスタンスを定義 */
  delegate ListMonad for Monad[List] {
    def (xs: List[A]) flatMap [A, B] (f: A => List[B]): List[B] =
      xs.flatMap(f)
    def pure[A](x: A): List[A] =
      List(x)
  }

  /** リーダモナドのインスタンスを定義 */
  delegate ReaderMonad[Ctx] for Monad[[X] ==> Ctx => X] {
    def (r: Ctx => A) flatMap [A, B] (f: A => Ctx => B): Ctx => B =
      ctx => f(r(ctx))(ctx)
    def pure[A](x: A): Ctx => A =
      ctx => x
  }

  /** 関手の利用 */
  def transform[F[_], A, B](src: F[A], func: A => B) given Functor[F]: F[B] = src.map(func)

  /** コンテキスト境界を使った書き換え */
  def transform2[F[_]: Functor, A, B](src: F[A], func: A => B): F[B] = src.map(func)
}

/** `TypeClassExample`の利用方法 */
object TypeClassExampleUseCase {
  import TypeClassExample._
  import delegate TypeClassExample._

  def use(): Unit = {
    println( transform(List(1, 2, 3), (_:Int) * 2) ) // List(2, 4, 6)

    /*
    リーダーモナドの例はずだが・・・
    以下の例は0.13.0-RC1ではコンパイルが終わらない・・・
    0.16.0-RC3でもコンパイル同様・・・
    val calc: Int => Int = for {
      x <- (e:Int) => e + 1
      y <- (e:Int) => e * 10
    } yield x + y

    println( calc(3) ) // 34
    */
  }
}
{% endcode %}

[^10]: この件は自分はイシューやプルリクエストは本家に上げていません。理由は既存のイシューやプルリクエストに目を通す余裕が自分にはないのと、Dottyを常用している訳ではないので特に困っていないからです。まぁ端的に言えば自分にはリソースとモチベーションが足りていなかったので、誰か気になる人は本家に上げてみてください。

## Contextual Abstractionsのその他の機能

Contextual Abstractionsの機能で味見できなかった機能を簡単に紹介します。

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

Implicitsが大分飼いならされたような印象でした。特に従来はimplicitをパラメータリストで受け取っていたのを`given`という専用構文で受け取るようになったのが非常に分かりやすかったです。ただ、従来の`implicitly`の名称はまだかなり揺れているみたいです[^11]。

もともとは{% elink 「A Snippet of Dotty」 https://medium.com/@jducoeur/a-snippet-of-dotty-27eadcee72e3 %}を読んで、あまりにも自分が知っているScalaと違っていたので調べ始めたのがこの記事を書こうと思ったきっかけです。この記事がScala3がどういう方向を目指しているのか知りたい人の参考になれば幸いです。

[^11]: もともと`summon`という名前で提案されていましたが、`0.13.0-RC-1`では`infer`に変わり、現在のmasterブランチでは`the`に変更されています。ちょうどこの記事を書いている途中で変更が {% elink masterにマージされた https://github.com/lampepfl/dotty/pull/5893 %}ので、混乱しないように慌てて味見の結果から`infer`を抜きました。

## 2019年3月10日の更新内容

{% elink 本家のブログ https://dotty.epfl.ch/blog/2019/03/05/13th-dotty-milestone-release.html %}が公開されたようです。`0.13.0-RC-1`のタグが打たれてから10日以上経ってからの公開なのでかなり遅い方だと思いますが、それだけ今回のリリースが盛りだくさんだったと言うことだと思います。本家のブログには従来の`implicit`がなぜダメだったのか丁寧に説明されていました。

{% blockquote Dotty Blogより %}
The implicit keyword is used for both implicit conversions and conditional implicit values and we identified that their semantic differences must be communicated more clearly syntactically. Furthermore, the implicit keyword is ascribed too many overloaded meanings in the language (implicit vals, defs, objects, parameters). For instance, a newcomer can easily confuse the two examples above, although they demonstrate completely different things, a typeclass instance is an implicit object or val if unconditional and an implicit def with implicit parameters if conditional; arguably all of them are surprisingly similar (syntactically). Another consideration is that the implicit keyword annotates a whole parameter section instead of a single parameter, and passing an argument to an implicit parameter looks like a regular application. This is problematic because it can create confusion regarding what parameter gets passed in a call. Last but not least, sometimes implicit parameters are merely propagated in nested function calls and not used at all, so giving names to implicit parameters is often redundant and only adds noise to a function signature.
{% endblockquote %}

意訳すると従来の`implicit`には`implicit conversions`と`conditional implicit values`の２つの用途があったけど、意味が違うし初学者は混同しやすいので構文的に別にするという話です。というか`conditional implicit values`という言い方は自分は初めて目にしました。単純な`implicit values`よりもわかりやすいですね。

この本家のブログを受けてというわけではないですが、前回の記事でサンプルの解説が大分雑だったのでいろいろと見直して、サンプルコードも{% elink GitHubに公開しました https://github.com/hinastory/dotty_contextual_abstractions_example %}。興味のある方は味見をして頂けると幸いです。

## 2019年6月22日の更新内容

先日発表された[Dotty 0.16.0-RC3](https://dotty.epfl.ch/blog/2019/06/11/16th-dotty-milestone-release.html)で本記事に関する大きな文法変更が行われました。具体的には以下の通りです。

- `implied`から`delegate`にキーワードを変更 (＃6649)
- 型ラムダに=>>を使用 (＃6558)
  - サンプルコードで使用していた
- `given`節を最後にする (#6513)
  - 0.15.0-RC1で変更

上記の変更に伴い本文の該当箇所を修正しました。また、{% elink GitHubに公開したサンプルコード https://github.com/hinastory/dotty_contextual_abstractions_example %}も0.16.0-RC3にしてあります。あと何回キーワードが変更されるんだろう・・・