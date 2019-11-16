---
title: Scala 3、Pythonのようにインデントベースの構文で書けるようになるってよ！
thumbnail: /gallery/thumbnails/dotty-logo.png
categories:
  - Tech
  - Language
tags:
  - Scala
  - Dotty
date: 2019-09-15 07:28:45
---
ここ数年でインデントベースの記述は広くプログラマ界隈で受け入れられるようになってきました。プログラミング言語ではPythonの成功が大きく、ドキュメントではmarkdownとyamlが広く普及しています。そしてScala 3でもとうとうその波に乗ろうという動きが見えてきました・・・

(2019年9月28日追記・更新: 追記内容は[ここ](/cats-cats-cats/2019/09/15/scala-indentation/#2019%E5%B9%B49%E6%9C%8828%E6%97%A5%E3%81%AE%E6%9B%B4%E6%96%B0%E5%86%85%E5%AE%B9)を見てください)
(2019年11月16日追記・更新: 追記内容は[ここ](/cats-cats-cats/2019/09/15/scala-indentation/#2019%E5%B9%B411%E6%9C%8816%E6%97%A5%E3%81%AE%E6%9B%B4%E6%96%B0%E5%86%85%E5%AE%B9)を見てください)

<!-- more -->

## 目次
<!-- toc -->

## TL;DR

- Scala 3のリサーチコンパイラである{% elink Dotty 0.18.1-RC1 https://github.com/lampepfl/dotty/releases/tag/0.18.1-RC1 %}にインデントベースの構文が実装されました
  - {% elink Dotty 0.19.0-RC1 https://dotty.epfl.ch/blog/2019/09/23/19th-dotty-milestone-release.html %}の変更に合わせて修正しました
  - {% elink Dotty 0.20.0-RC1 http://dotty.epfl.ch/blog/2019/11/04/20th-dotty-milestone-release.html %}の変更に合わせて修正しました
- インデントベースの構文はまだ提案段階でありScala 3の正式な仕様に決定したわけではありません
  - 今後機能が変化したり、機能が採用されなかったりする可能性も十分あります
  - というか反対意見の方が多いです
- 従来の括弧ベースの構文も混ぜて使えます
- この記事はインデントベース構文の紹介記事です。この構文の良し悪しについては触れていません

## まずはコードを御覧ください

ウソみたいだろ・・・Scalaなんだぜ、それ

{% code lang:scala %}
object IndentBasedExample
  enum Day
    case Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday
    def isWeekend: Boolean = this match
      case Saturday | Sunday => true
      case _ => false

  def fromString(str: String): Day =
    try Day.valueOf(str)
      catch
        case _: IllegalArgumentException =>
          throw new IllegalArgumentException(s"$str is not a valid day")
    end try
  end fromString

  trait A with
    def f: Int

  class B with
    def g: Int = 27

  class C(x: Int) extends B with A with
    def f = x

  type T = A with
    def f: Int

  def use(dayString: String) =
    val day = fromString(dayString)

    if day.isWeekend then
      println("Today is a weekend")
      println("I will rest")
    else
      println("Today is a workday")
      println("I will work")

    if (day == Day.Wednesday)
      println("Today is a Wednesday")
      println("Bad Day")

    println(s"B().g is ${B().g}.")

    val optNum =
      for
        x <- Option(3)
        y <- Option(2)
      yield
        x + y

    optNum match
    case Some(x) if x > 4 => println("bigger than 4")
    case _ => println("Other")

    val z = List(2, 3, 4) map:
      x =>
        y = y - 1
        y * y

    z.foreach:
      println

@main def example: Unit =
  IndentBaseExample.use("Monday")
{% endcode %}

いつもはこんなコードを書いていたはず・・・

{% details 従来のコード %}
{% code lang:scala %}
object BraceBasedExample {
  enum Day {
    case Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday
    def isWeekend: Boolean = this match {
      case Saturday | Sunday => true
      case _ => false
    }
  }
  def fromString(str: String): Day = {
    try {
      Day.valueOf(str)
    } catch {
      case _: IllegalArgumentException =>
        throw new IllegalArgumentException(s"$str is not a valid day")
    }
  }

  trait A {
    def f: Int
  }

  class B {
    def g: Int = 27
  }

  class C(x: Int) extends B with A {
    def f = x
  }

  type T = A {
    def f: Int
  }

  def use(dayString: String) = {
    val day = fromString(dayString)

    if (day.isWeekend) {
      println("Today is a weekend")
      println("I will rest")
    } else {
      println("Today is a workday")
      println("I will work")
    }

    if (day == Day.Wednesday) {
      println("Today is a Wednesday")
      println("Bad Day")
    }

    println(s"B().g is ${B().g}.")

    val optNum =
      for {
        x <- Option(3)
        y <- Option(2)
      } yield {
        x + y
      }

    optNum match {
    case Some(x) if x > 4 => println("bigger than 4")
    case _ => println("Other")
    }

    val z = List(2, 3, 4) map {
      x => {
        val y = x - 1
        y * y
      }
    }
    z.foreach(println)
  }
}

@main def example: Unit = {
  IndentBaseExample.use("Monday")
}
{% endcode %}
{% enddetails %}


## コードの解説

Pythonでインデントを用いてブロックを作る場合は改行の前に「:」が付きますが、Scalaの場合はもっと多くのキーワードがインデント構文の開始の合図になり得ます。

`:`  `=`  `=>`  `<-`  `if`  `then`  `else`  `while`  `do`  `try`  `catch`  `finally`  `for`  `yield`  `match`

また、`class`, `object`, `given`, や `enum`定義でもインデント構文を利用できます。

インデントはタブとスペースの両方が使えますが混ぜると比較ができないケースがあるので、混ぜるな危険です。

### 定義

以下は`object`の定義と`enum`の定義でインデント構文を開始しています。

{% code lang:scala %}
object IndentBasedExample
  enum Day
    case Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday
    def isWeekend: Boolean = this match
      case Saturday | Sunday => true
      case _ => false
{% endcode %}

`enum`はScala 3(Dotty)の機能でScala 2にはありません。気になる方は「[Enumerations](https://dotty.epfl.ch/docs/reference/enums/enums.html)」を参照してください。

また、定義の行末を以下のように`with`で終わることもできます。

{% code lang:scala %}
trait A with
  def f: Int

class B with
  def g: Int = 27

class C(x: Int) extends B with A with
  def f = x

type T = A with
  def f: Int
{% endcode %}

`with`はオプションですが、インデント構文を使う場合は、基本的につけたほうが良さそうです。例えば、以下のようにクラスBの定義で次の行にインデントをつけ忘れた場合、`with`があるとコンパイラが構文エラーにしてくれます。
もし、`with`をつけていなかった場合はエラーにはならずに、`def`から始まる関数定義はクラスBに所属するのではなくクラスBと同じ名前空間のメソッドとして定義されてしまいます。

{% code lang:scala %}
class B with
def g: Int = 27
{% endcode %}

### `if`式

`if`式の場合は、インデントブロック開始の合図が「`then`」になります。~~最初`then`を書き忘れたらコンパイラに`then`がないって怒られて、`then`ってなんぞや？？？となりました。どうやら新しいキーワードみたいです。~~
行末の`then`は0.20.0-RC-1でオプションになりました。つまり以下の`then`がなくても正しい構文になります。

{% code lang:scala %}
if day.isWeekend then
  println("Today is a weekend")
  println("I will rest")
else
  println("Today is a workday")
  println("I will work")
{% endcode %}

`if`式で括弧を用いる場合は`then`は必要ありません。

{% code lang:scala %}
if (day == Day.Wednesday)
  println("Today is a Wednesday")
  println("Bad Day")
{% endcode %}

### `for`式

以下のコードには`=`と`for`と`yield`がインデント構文の開始の合図になっています。

{% code lang:scala %}
val optNum =
  for
    x <- Option(3)
    y <- Option(2)
  yield
    x + y
{% endcode %}

### `match`式

`match`式は少し特殊でインデントを付けても付けなくてもいいことになっています。つまり以下の２つの書き方が許容されます。

{% code lang:scala %}
optNum match
case Some(x) if x > 4 => println("bigger than 4")
case _ => println("Other")
{% endcode %}

{% code lang:scala %}
optNum match
  case Some(x) if x > 4 => println("bigger than 4")
  case _ => println("Other")
{% endcode %}

`match`以外には`catch`も同様に次の`case`のインデントは自由です。

### ラムダ式

ラムダ式の記号(`=>`)もインデント構文の開始の合図になっています。

{% code lang:scala %}
x =>
  y = y - 1
  y * y
{% endcode %}

## エンドマーカー

インデントだとブロックの終わりがわかりにくい場合には、エンドマーカーを使ってブロックの終わりを明示することができます。以下のコードでは「`end fromString`」が識別子のエンドマーカーです。エンドマーカーはオプションなのでなくても問題なく動作しますが、ドキュメントではひと目でブロックを識別することが難しい長いブロック(20行以上)で使うことを推奨しています。

{% code lang:scala %}
def fromString(str: String): Day =
  try Day.valueOf(str)
    catch
      case _: IllegalArgumentException =>
        throw new IllegalArgumentException(s"$str is not a valid day")
  end try
end fromString
{% endcode %}

エンドマーカーは以下の予約語と合わせて用いることもできます。

`if`  `while`  `for`  `match`  `try`  `new`

上記の例では「`end try`」がエンドマーカーになっています。

### インデントマーカー`:`

次はPythonっぽい、行末コロン(`:`)の例です。開き中括弧(`{`)が有効な箇所で行末をコロンにするとインデント構文を開始することができます。以下の例では`map`の後にインデントマーカー`:`が付いています。

{% code lang:scala %}
val z = List(2, 3, 4) map:
  x =>
    y = y - 1
    y * y
{% endcode %}

ただし、このインデントマーカーはまだ他のインデントスキームよりも議論の余地が大きく、コンパイラオプションに`-Yindent-colons`を指定した時だけ有効になります。

## 設定と書換え

インデント構文はデフォルトで有効ですが、コンパイラオプション`-noindent`, `-old-syntax`,`-language:Scala2`のいずれかを指定すれば無効にできます。実際に試してみましたがインデント構文を利用している箇所はエラーになってコンパイルができなくなりました。

また、コンパイラオプションでインデント構文への書換えもできます。インデント構文への書換えは`-rewrite` `-new-syntax`オプションをつけてコンパイル後に、もう一度`-rewrite` `-indent`オプションをつけてコンパイルする必要があります。つまり面倒ですが2回コンパイラを起動する必要があります。この書換えは上手くいきました。

逆方向の書換えを行うには`-rewrite` `-noindent`オプションをつけてコンパイル後に、もう一度を`-rewrite` `-old-syntax`つけてコンパイルします。この書換えは`0.19.0-RC1`時点では失敗しました。どうやらエンドマーカーの書換えで失敗しているようです。

### `@main`関数

インデント構文とは欠片も関係ありませんが、0.18.1-RC1で導入された`@main`関数についても紹介しておきます。従来は以下のように書いていたmain関数ですが[^1]、

{% code lang:scala %}
object Example {
  def main(args: Array[String]): Unit = IndentBaseExample.use("Monday")
}
{% endcode %}

`@main`関数を使うと以下のように書くことができます。Scalaのスクリプティングが捗りそうです[^2]。

{% code lang:scala %}
@main def example: Unit = IndentBaseExample.use("Monday")
{% endcode %}

[^1]: `App`トレイトをミックスインして書く方法もあります。
[^2]: `@main`関数は引数をとることもできてコマンドライン引数を受け取れるのですが、話が脱線するのでこの記事ではこれ以上は触れません。

### 今すぐ試してみたい!

上記のサンプルコードをすぐに試せるようにGitHubに公開したのでご査収ください。インデントベースの構文と従来のブレースベースの構文はどちらも有効なので、実際に触ってみて感触を掴むのが一番だと思われます。念のため書いておきますが、サンプルコード自体に特に意味はありません。インデントベースの構文の雰囲気が分かるように適当に構文を並べただけです。

- {% elink hinastory/dotty_examples: Example code of Dotty (Scala 3) https://github.com/hinastory/dotty_examples %}
  - {% elink IndentBasedExample.scala https://github.com/hinastory/dotty_examples/blob/master/src/main/scala/indent_based/IndentBasedExample.scala %}

{% ghCard hinastory/dotty_examples %}

## インデントベース構文の状況

インデントベースへの変更は実は2017年にOdersky先生が{% elink #2491 https://github.com/lampepfl/dotty/issues/2491 %}で提案されていて、このときは大激論の末に一旦クローズされています[^3]。そしてようやく今回執念のプルリク({% elink #7083 https://github.com/lampepfl/dotty/pull/7083 %})を投げて、捩じ込みました。

「捩じ込む」と表現したのは今回も当然のように大激論が起こったからです。見た目が違うから拡張子変えた方がいいという意見や、読みにくさや曖昧さを指摘する意見や、初学者の混乱を指摘する意見まで様々です。

Odersky先生もこのプルリクはデータを集めるための実験としており、現在のところこのインデント構文はScala 3の新機能の中でも採用される可能性が最も低いものの一つだと考えられます。以下は#7083のリアクションですが、こんなに嫌われているプルリクには滅多にお目にかかれません(笑)。

{% img /gallery/daily/others/dotty-indentation-reaction.png  500 %}

経緯はともかくOdersky先生の壮大な実験は始まりました。Scalaのようにある程度普及した言語が途中からインデントベースの構文をサポートした例を自分は知りません。今後の成り行きが気になるところですが、Scala 3.0の機能凍結及びScala 3.0のM1リリースは今年(2019年)の秋で、Scala 3.0 finalのリリースは来年(2020年)秋と言われているので[^4]、何か言いたいことがある方はなるべく早めに本家にフィードバックをかけた方が良いと思われます[^5]。

ちなみに本記事はあくまでインデントベース構文の紹介が目的なので、この構文の良し悪しについて突っ込んだ批評は控えておきます。ただ一応参考までに個人的な初見の感想を述べておくと、自分が趣味で使うのには良さそうな感じです。仕事で使うのにはコーディング規約をどうするか悩みどころが多いと感じましたが、結局はエディタ、IDE、フォーマッタ、リンタ等のツール群のサポートがきちんと得られれば使えるとは思うので、それらの対応次第かなと思っています。

[^3]: #2491も今回と似たような提案ですが、大きな違いは`with`がインデントマーカーとして使われているところです。またエンドマーカーも現在とは異なっていました。
[^4]: {% elink A Tour of Scala 3 https://www.slideshare.net/Odersky/a-tour-of-scala-3 %}を参照。
[^5]: フィードバックの方法としては{% elink Scala Contributors https://contributors.scala-lang.org/ %}でトピックを立てるのが一番簡単だと思われます。もちろん問題が明確ならイシューを開いたりプルリクを送る方法もあります。

## 最後に

本記事ではScala 3へ入る可能性のあるインデントベースの構文を紹介しました。本機能は実際にScala 3に入るかどうかはわかりませんが、まだ多くの議論の余地があり、より多くのフィードバックが必要とされています。興味のある方は実際に触ってみて{% elink Scala Contributors https://contributors.scala-lang.org/ %}等でフィードバックしてみてはいかがでしょうか？

## 参考文献

- {% elink Announcing Dotty 0.18.1-RC1 – switch to the 2.13 standard library, indentation-based syntax and other experiments https://dotty.epfl.ch/blog/2019/08/30/18th-dotty-milestone-release.html %}
- {% elink Announcing Dotty 0.19.0-RC1 – further refinements of the syntax and the migration to 2.13.1 standard library https://dotty.epfl.ch/blog/2019/09/23/19th-dotty-milestone-release.html %}
- {% elink Allow significant indentation syntax by odersky · Pull Request #7083 · lampepfl/dotty https://github.com/lampepfl/dotty/pull/7083 %}
- {% elink Change indentation rules to allow copy-paste by odersky · Pull Request #7114 · lampepfl/dotty https://github.com/lampepfl/dotty/pull/7114 %}
- {% elink Consider syntax with significant indentation · Issue #2491 · lampepfl/dotty https://github.com/lampepfl/dotty/issues/2491 %}
- {% elink Optional Braces https://dotty.epfl.ch/docs/reference/other-new-features/indentation.html %}

## 更新内容
### 2019年9月28日の更新内容

先日発表された{% elink Dotty 0.19.0-RC1 https://dotty.epfl.ch/blog/2019/09/23/19th-dotty-milestone-release.html %}でインデント構文が若干変更されました。

- クラスやオブジェクトの定義でインデントをする場合に`:`が必要なくなった
- インデントマーカー`:`の利用時には`-Yindent-colons`のオプションの指定が必要になった

上記の内容は本文にも反映済みです。またインデント構文への書換えも試してみたので追記を行っています。

下記のサンプルリポジトリに関しても0.19.0-RC1にバージョンアップして対応済みです。

{% ghCard hinastory/dotty_examples %}

### 2019年11月16日の更新内容

先日発表された{% elink Dotty 0.20.0-RC1 http://dotty.epfl.ch/blog/2019/11/04/20th-dotty-milestone-release.html %}でインデント構文が若干変更されました。
インデントに関係ある変更は以下のとおりです。関連する箇所に関して記事の追記を行っています。

- クラス、トレイトの後ろにオプションで`with`を置けるようになった
  - インデントのし忘れを防ぐため
  - {% elink Tweaks to indent syntax by odersky · Pull Request #7363 · lampepfl/dotty https://github.com/lampepfl/dotty/pull/7363 %}
- `if`式の行末の`then`がオプションになった
  - {% elink Make `then` optional at line end by odersky · Pull Request #7276 · lampepfl/dotty https://github.com/lampepfl/dotty/pull/7276 %}
