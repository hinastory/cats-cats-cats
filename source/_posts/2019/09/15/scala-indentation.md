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

<!-- more -->

## 目次
<!-- toc -->

## TL;DR

- Scala 3のリサーチコンパイラであるDotty {% elink 0.18.1-RC1 https://github.com/lampepfl/dotty/releases/tag/0.18.1-RC1 %}にインデントベースの構文が実装されました
- インデントベースの構文はまだ提案段階でありScala3の正式な仕様に決定したわけではありません
  - 今後機能が変化したり、機能が採用されなかったりする可能性も十分あります
  - というか反対意見の方が多いです
- 従来の括弧ベースの構文も混ぜて使えます
- この記事はインデントベース構文の紹介記事です。この構文の良し悪しについては触れていません

## まずはコードを御覧ください

ウソみたいだろ・・・Scalaなんだぜ、それ

{% code lang:scala %}
object IndentBasedExample:
  enum Day:
    case Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday
    def isWeekend: Boolean = this match
      case Saturday | Sunday => true
      case _ => false

  def fromString(str: String): Day =
    try Day.valueOf(str)
    catch
      case _: IllegalArgumentException =>
        throw new IllegalArgumentException(s"$str is not a valid day")
  end fromString

  def use(dayString: String) =
    val day = fromString(dayString)

    if day.isWeekend then
      println("Today is a weekend")
      println("I will rest")
    else
      println("Today is a workday")
      println("I will work")

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

  def use(dayString: String) = {
    val day = fromString(dayString)

    if (day.isWeekend) {
      println("Today is a weekend")
      println("I will rest")
    } else {
      println("Today is a workday")
      println("I will work")
    }

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

インデントはタブとスペースの両方が使えますが混ぜると比較ができないケースがあるので、混ぜるな危険です。

### `if`式

`if`式の場合は、インデントブロック開始の合図が「`then`」になります。最初`then`を書き忘れたらコンパイラに`then`がないって怒られて、`then`ってなんぞや？？？となりました。どうやら新しいキーワードみたいです。

{% code lang:scala %}
if day.isWeekend then
  println("Today is a weekend")
  println("I will rest")
else
  println("Today is a workday")
  println("I will work")
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

### インデントマーカーとラムダ式

次はPythonっぽい、行末コロン(`:`)の例です。開き中括弧(`{`)が有効な箇所で行末をコロンにするとインデント構文を開始することができます。また、ラムダ式の記号(`=>`)もインデント構文の開始の合図になっています。

{% code lang:scala %}
val z = List(2, 3, 4) map:
  x =>
    y = y - 1
    y * y
{% endcode %}

### `try/catch`とエンドマーカー

`try/catch`でもインデント構文を使うことが可能です。また、インデントだとブロックの終わりがわかりにくい場合には、エンドマーカーを使ってブロックの終わりを明示することができます。以下のコードでは「`end fromString`」がエンドマーカーです。エンドマーカーはオプションなのでなくても問題なく動作しますが、ドキュメントではひと目でブロックを識別することが難しい長いブロック(20行以上)で使うことを推奨しています。

{% code lang:scala %}
def fromString(str: String): Day =
  try Day.valueOf(str)
  catch
    case _: IllegalArgumentException =>
      throw new IllegalArgumentException(s"$str is not a valid day")
end fromString
{% endcode %}


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

上記のサンプルコードをすぐに試せるようにGitHubに公開したのでご査収ください。インデントベースの構文と従来のブレースベースの構文はどちらも有効なので、実際に触ってみて感触を掴むのが一番だと思われます。

- {% elink hinastory/dotty_examples: Example code of Dotty (Scala 3) https://github.com/hinastory/dotty_examples %}

## インデントベース構文の状況

インデントベースへの変更は実は2017年にOdersky先生が{% elink #2491 https://github.com/lampepfl/dotty/issues/2491 %}で提案されていて、このときは大激論の末に一旦クローズされています[^3]。そしてようやく今回執念のプルリク({% elink #7083 https://github.com/lampepfl/dotty/pull/7083 %})を投げて、捩じ込みました。

「捩じ込む」と表現したのは今回も当然のように大激論が起こったからです。見た目が違うから拡張子がを変えた方がいいという意見や、読みにくさや曖昧さを指摘する意見や、初学者の混乱を指摘する意見までさまざまです。

Odersky先生もこのプルリクはデータを集めるための実験としており、現在のところこのインデント構文はScala 3の新機能の中でも採用される可能性が最も低いものの一つだと考えられます。以下は#7083のリアクションですが、こんなに嫌われているプルリクには滅多にお目にかかれません(笑)。

{% img /gallery/daily/others/dotty-indentation-reaction.png  500 %}

経緯はともかくOdersky先生の壮大な実験は始まりました。Scala3の機能凍結及びScala 3.0のM1リリースは今年の秋で、Scala 3.0 finalのリリースは来年秋と言われているので[^4]、何か言いたいことがある方はなるべく早めにに本家にフィードバックをかけた方が良いと思われます。恐らく{% elink Scala Contributors https://contributors.scala-lang.org/ %}でトピックを立てて議論をするのが適切でしょう。

本記事はあくまでインデントベース構文の紹介が目的なので、この構文の良し悪しを論じることはここでは行いません[^5]。

[^3]: #2491も今回と似たような提案ですが、大きな違いは`with`がインデントマーカーとして使われているところです。またエンドマーカーも現在とは異なっていました。
[^4]: {% elink A Tour of Scala 3 https://www.slideshare.net/Odersky/a-tour-of-scala-3 %}を参照。
[^5]: 正直Scalaコミュニティに与える影響を考慮して論じられるほどまだ見識がないというのが本音です。ここからは完全に個人的な初見の感想ですが、ぱっと見た感じは自分が趣味で使うのには良さそうな感じです。仕事で使うのにはコーディング規約をどうするか悩みどころが多いなと感じましたが、結局はエディタ、IDE、フォーマッタ、リンタ等のツール郡のサポートがきちんと得られれば使えるとは思うので、それらの対応次第かなと思っています。

## 最後に

本記事ではScala 3へ入る可能性のあるインデントベースの構文を紹介しました。本機能は実際にScala 3に入るかどうかはわかりませんが、まだまだ多くの議論を必要とするため、より多くのフィードバックが必要とされています。興味のある方は実際に触ってみて{% elink Scala Contributors https://contributors.scala-lang.org/ %}等でフィードバックしてみてください。

## 参考文献

- {% elink Announcing Dotty 0.18.1-RC1 – switch to the 2.13 standard library, indentation-based syntax and other experiments https://dotty.epfl.ch/blog/2019/08/30/18th-dotty-milestone-release.html %}
- {% elink Allow significant indentation syntax by odersky · Pull Request #7083 · lampepfl/dotty https://github.com/lampepfl/dotty/pull/7083 %}
- {% elink Change indentation rules to allow copy-paste by odersky · Pull Request #7114 · lampepfl/dotty https://github.com/lampepfl/dotty/pull/7114 %}
- {% elink Consider syntax with significant indentation · Issue #2491 · lampepfl/dotty https://github.com/lampepfl/dotty/issues/2491 %}
- {% elink Significant Indentation https://dotty.epfl.ch/docs/reference/other-new-features/indentation.html %}
