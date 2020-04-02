---
title: Re：FizzBuzzから始めるRust生活
thumbnail: /gallery/thumbnails/rust.png
categories:
    - Tech
    - Language
tags:
    - Rust
    - FizzBuzz
date: 2020-04-01 07:28:45
---
新しいプログラミング言語に入門するためには、やはり手を動かすことが大事です。本を読んで体系的に学ぶのももちろん重要ですが、それは言語の魅力を知ってからでも遅くはありません。

しかし「Hello World」レベルだと簡単すぎて言語の違いを味わえず、ネットワークプログラミングのような高度なプログラミングはフレームワークの力が大きすぎて**言語とフレームワークの狭間で立ち往生**することになります。

そこで登場するのが**「FizzBuzz」**です。「FizzBuzz」は単純なプログラムでありながら、プログラムの真髄である**「順次」**、**「分岐」**、**「繰り返し」**があり、数値計算も学べる興味深い題材です。

その「FizzBuzz」を利用して**「Rust」**という言語を学んでみようのが本記事の趣旨です。「FizzBuzz」というシンプルなプログラムで「Rust」のような**表現力が豊かな言語**の機能をどこまで使い尽くせるのかは興味が尽きないところですが、本記事では入門という観点で初歩的なFIzzBuzzから順を追って体を慣らしながらRustのある生活を体験できるようにしたいと思います。

さぁ、FizzBuzzからRust生活を始めましょう。

<!-- more -->

## 目次

<!-- toc -->

## はじめに

本記事は、すでに何らかのプログラミング言語の経験を持っているRust初心者を対象としています。特になんとなく**「Rust怖い」**感じている方に対して、Rustの普段使いの魅力をFizzBuzzのようなシンプルな題材を通してお伝えできればと思います。

## 前提知識

まずは前提知識としてFizzBuzzプログラムとRust言語の簡単な特徴を説明します。すでにご存知の方はこの節は飛ばして頂いても構いません。

### FizzBuzzプログラムとは

FizzBuzzプログラムは、3で割り切れる場合に「**Fizz**」と表示し、5で割り切れる場合に「**Buzz**」と表示し、両者で割り切れる（15で割り切れる）場合には「**FizzBuzz**」と表示するプログラムです。1から16の数値の入力に対する出力は以下のようになります。


```
1
2
Fizz
4
Buzz
Fizz
7
8
Fizz
Buzz
11
Fizz
13
14
FizzBuzz
16
```

本記事では1から100までの数字を上記のルールで変換して画面に出力するFizzBuzzプログラムを扱います。

### Rustとは

RustはMozilla[^1]が支援するオープンソースのプログラミング言語です。{% elink Rust公式サイト https://www.rust-lang.org/ja/ %}から引用すると以下の３つの特徴があります。

- パフォーマンス
    - Rustは非常に高速でメモリ効率が高くランタイムや**ガベージコレクタがない**ため、パフォーマンス重視のサービスを実装できますし、組込み機器上で実行したり他の言語との調和も簡単にできます。
- 信頼性
    - Rustの豊かな型システムと所有権モデルにより**メモリ安全性とスレッド安全性が保証**されます。さらに様々な種類のバグをコンパイル時に排除することが可能です。
- 生産性
    - Rustには優れたドキュメント、有用なエラーメッセージを備えた使いやすいコンパイラ、および統合されたパッケージマネージャとビルドツール、多数のエディタに対応するスマートな自動補完と型検査機能、自動フォーマッタといった**一流のツール群が数多く揃っています**。

Rustを利用しているユーザにはMozillaはもちろん**Dropbox**や**AWS**や**Microsoft**などの著名企業も含まれるので、今後も安定して開発やメンテナンスが行われる言語だと考えられます。

向いている用途としてはシステムプログラミングが挙げられ、OSやデータベース等のミドルウェアの開発に適しています。個人的には**C/C++やGo言語が向いている用途にはRustも適している**と考えています。特に性能を要求されるプログラムには向いています。以下は{% elink Computer Language Benchmarks Game https://benchmarksgame-team.pages.debian.net/benchmarksgame/which-programs-are-fastest.html %}からの引用ですが、Rustの性能がC/C++と同等であることが示されています。

{% img /gallery/daily/others/fastest.png 370 %}{% img /gallery/daily/others/fastest-more.png 370 %}


向いていない用途としては、RubyやPythonのようにプログラムを書いてすぐに実行するような軽量的な使い方です。Rustは必ずコンパイルする作業が発生し、しかもコンパイルのチェックが比較的厳しいので[^2]「正しい」プログラムを書くのに時間がかかります。これはある程度大きな開発時にはメリットともとれますが、**アイデアをプログラムで緩く試したい場合には不向き**なので用途で使い分ける必要があります。

[^1]: ブラウザのFirefoxの開発を支援している非営利団体です。
[^2]: ここではC/C++と比較しています。またJavaと比べてもnullやキャストのチェックが厳しいです。もちろん`unsafe`という魔法は使わないことが大前提ですが・・・

## 第一章 Rust生活:初級編

さて、ここからが本題のRust生活です。１日にひとつのFizzBuzzを紹介するというスタイルで書いています。後半に行くほど難しくなっているので、自分のレベルに合った箇所から読み進めて頂いても構いません。

また、FizzBuzzプログラムのスタイルとしては関数として記述しています。実際にコンパイルして実行するには以下のように`main`関数の中から呼び出す必要があります。

{% code lang:rust %}
fn main() {
    fizz_buzz1()
}
{% endcode %}

各ソースコードには**「Run」**のリンクが貼ってあるので具体的にはそのソースコードを見て実行してみるとより挙動が分かると思います。

### 1日目 〜FizzBuzzでwhileとifに再会する〜

まずは多くの方が理解できる形のFizzBuzzから始めたいと思います。以下のRustプログラムは多少文法が異なっていてもC/C++やJava等の手続き的なパラダイムを持つ言語を経験した方ならすんなりと読めると思います。

{% code lang:rust fizz_buzz1(rust) %}
fn fizz_buzz1() { // Rustの関数定義（引数なし、戻り値なし）
  let mut x = 1; // xという変数を導入して整数1に束縛

  while x <= 100 { // xが100以下の場合に中括弧`{}`で囲まれたスコープを繰り返す
    if x % 15 == 0 {       // 15で割り切れる（15で割った余りが0）
	  println!("FizzBuzz");
	} else if x % 3 == 0 { // 3で割り切れる（3で割った余りが0）
	  println!("Fizz");
	} else if x % 5 == 0 { // 5で割り切れる（5で割った余りが0）
	  println!("Buzz");
	} else {               // それ以外の場合は数字を直接出力
	  println!("{}", x);
    }

    x += 1; // xに1を加算
  }
}
{% endcode %}
{% elink Run https://play.rust-lang.org/?version=stable&mode=debug&edition=2018&gist=d761b62e11b5f019ee0cba90f6edaf80 %}

　
まず、1行目は`fn`で始まる関数宣言です。**fizz_buzz1**という関数を定義しています。関数名はこのようにアンダースコア(`_`)で区切った小文字の**スネークケース**で書くのがRustのコーディング規約になっています。この関数は引数を持っていませんが戻り値は一応あります。戻り値は**ユニット**`()`になります。ユニットは意味を持たない値の代表として用いられます。

2行目はの`let`で始まる文は**宣言文**と呼ばれており、関数のスコープに変数`x`を導入して整数1に束縛しています。`mut`キーワードは`mutation`の略であり、この変数が再代入可能であることを示しています。再代入が可能になるとプログラムの挙動の把握が難しくなるので[^3]、不必要な箇所では`mut`をつけないことがRustの基本です。

さらに、2行目は型推論により変数の型が省略されています。省略せずに書くと以下のようになります。

{% code lang:rust %}
let mut x: i32 = 1;
{% endcode %}

「i32」は32ビットの符号付き整数を意味しています。またRustは静的型付言語なので全ての変数には「型」がついていますが、型推論のおかげて必要以上の型を記述せずにすみます。ちなみに再代入可能な変数であっても変数の型は変更できません。つまり以下のようになります。

{% code lang:rust %}
let mut x: i32 = 1;
x = 10;  // OK (i32型の数値の再代入)
x = 3.5; // NG (コンパイルエラー： i32型の変数にf64型の数値の再代入)
{% endcode %}
{% elink Run https://play.rust-lang.org/?version=stable&mode=debug&edition=2018&gist=9ea9449eb2f5e43a2bf2c9920ad7954f %}
　
ちなみに以下のようにletを用いて同じ変数を再初期化してあげれば異なる型の数値への束縛が可能です。この機能は**シャドーイング**と呼ばれています[^4]。

{% code lang:rust %}
let mut x: i32 = 1;
x = 10;  // OK (i32型の数値の再代入)
let mut x = 3.5; // OK (f64型の数値の再宣言)
x = 10;  // NG (コンパイルエラー：f64型の数値にi32型の数値の再代入)
{% endcode %}
{% elink Run https://play.rust-lang.org/?version=stable&mode=debug&edition=2018&gist=4cea6611bcfc709cd6f6cc3602011bd0 %}
　
次に`while`と`if`ですがこれの機能は他の言語と同等の機能をもっています。`while`は条件付き繰り返しで、`if`は条件分岐です。付け加えるとするならこれらは両方とも`式`であり、評価された値を持ちます。`while`は必ずユニット`()`値を返します。`if`は条件分岐の評価結果を返します。このあとで説明する`println!(...)`は全てユニット値を返すので、この関数内で使われている`if`もユニット値を返します。

次の要素は「`println!`」マクロです。関数っぽく見えますが名前の最後の「`!`」がマクロであることを示しています。Rustの関数には可変長引数がないのでマクロを使って実現されています[^5]。呼び出し側は呼び出し先が関数かマクロかはあまり気を使う必要がないので、入門の段階では気にしなくても問題はありません。println!マクロでは表示する文字列に変数を埋め込むことができます。「`{}`」はプレースホルダになっていて以下のように複数利用することもできます。

{% code lang:rust %}
let from = "FizzBuzz";
let lang = "Rust";
println!("Re:{} Starting Life in {} World!", from, lang); // 「Re:FizzBuzz Starting Life in Rust World!」と表示される。
{% endcode %}
{% elink Run https://play.rust-lang.org/?version=stable&mode=debug&edition=2018&gist=3fc5a8f22c6c1525190d576946583a50 %}
　
 1日目の最後の説明は`x += 1`についてです。この式は他の言語と同じく`x = x + 1`のシンタックスシュガーです。つまり再代入の処理になります。Rustでは再代入は`mut`をつけて宣言された変数にしか許可されませんが、`x`は`mut`付きで宣言されているのこのように再代入が可能です。ちなみにRustにはインクリメント演算子(`++`)は用意されていません。

[^3]: 再代入が許可されない場合、変数が指す値がプログラム中で変わることを考慮しなくて済むのでプログラムが理解しやすくなります。詳しくは「参照透過性」というキーワードで調べてみてください。
[^4]: 「シャドーイング」は「隠蔽する」という意味です。Rustのシャドーイングに関しては、{% elink ここ https://doc.rust-jp.rs/book/second-edition/ch03-01-variables-and-mutability.html#a%E3%82%B7%E3%83%A3%E3%83%89%E3%83%BC%E3%82%A4%E3%83%B3%E3%82%B0 %}をご覧ください。
[^5]: 可変長引数はマクロを使う理由の一つであり、マクロで実現可能なことは他にも多くありますが高度な内容になるので本記事ではこれ以上は触れません。Rustのマクロは「衛生的」と言われており、比較的にカジュアルに使われている印象です。

### 2日目 〜FizzBuzzでforとrangeに出会う〜

1日目のプログラムで`FizzBuzz`は問題なく動作します。しかし、`while`の条件判定と`x += 1`を組み合わせてループを行うのは些か面倒です。でもご安心ください。Rustにはループの強い味方、`for`とレンジ(範囲)があります。

{% code lang:rust fizz_buzz2(rust) %}
fn fizz_buzz2() {
  for x in 1 .. 101 { // 1から100まで繰り返す
    if x % 15 == 0 {
      println!("FizzBuzz");
    } else if x % 3 == 0 {
      println!("Fizz");
    } else if x % 5 == 0 {
      println!("Buzz");
    } else {
      println!("{}", x);
    }
  }
}
{% endcode %}
{% elink Run https://play.rust-lang.org/?version=stable&mode=debug&edition=2018&gist=e86db7a58f89d96fd8fd39e7e8afcc95 %}
　
`for a in b`の構文は`b`で**「イテレータ」**を受け取り、「イテレータ」が返す値を順番に直後のブロック内において`a`という変数で利用可能にします。イテレータは `.next()` メソッドを繰り返し呼び出すことができ、その都度順番に値を返します。

`a .. b`はレンジであり、`a`以上`b`未満を表しています。上記のプログラムでは`1 .. 101`になっているので1以上101未満になります。「未満」なので終端の数字は含まないことに注意してください。終端を含めたい場合、つまり`a`以上`b`以下を表したい場合は`a ..= b`とします。レンジはイテレータにもなっているので、`for`で用いることができます。

### 3日目 〜FizzBuzzでmatchにときめく〜

2日目のプログラムで`for`を導入して大分いい感じになりましたが、まだ冗長な点が目に止まります。`if`式です。`else if`を繰り返し書いているのでもう少し短く書きたいものです。そこで登場するのが`match`です。

{% code lang:rust fizz_buzz3(rust) %}
fn fizz_buzz3() {
  for x in 1 ..= 100 {
    match x % 15 {   // パターンマッチを利用してxの15による剰余を分類
      0 => println!("FizzBuzz"),     // 単式パターン
      3 | 6 | 9 | 12 => println!("Fizz"), // 複式パターン
      5 | 10 => println!("Buzz"),
      _ => println!("{}", x),        // ワイルドカードパターン
    }
  }
}
{% endcode %}
{% elink Run https://play.rust-lang.org/?version=stable&mode=debug&edition=2018&gist=c4b493bb208a03883d8ccd1d4cb19672 %}
　
`match a {b}`の構文では、`a`の式を評価した結果を`b`のパターンで網羅的に分類できます。`b`のパターンは`p => v`の形式(これはアームとも呼ばれます)でカンマ`,`で区切って複数並べることができ、上から順番に`p`のパターンにマッチングするか検査されます。マッチングが成立すると`v`が実行されてその評価値が`match`式の評価値となります。

`p`のパターンでは一つの値だけではなく`|`で区切って、複数の値にマッチングさせることもできます。例えば上記でいけば`3 | 6 | 9 | 12`は「3または6または9または12」の意味になります。またパターンにアンダースコア`_`を用いると**ワイルドカードパターン**になり、全ての値にマッチングします。パターンは上のほうが優先順位が高いのでワイルドカードパターンは通常一番下に置かれます。

上記の例だけ見ると`match`は単に`if`のシンタックスシュガーのように見えてしまいますが、実は大きく異なります。そのひとつに`match`では網羅性検査が行われる点があります。例えば以下のように任意パターンを`99`に置き換えてコンパイルしてみます。

{% code lang:rust %}
    match x % 15 {   // パターンマッチを利用してxの15による剰余を分類
      0 => println!("FizzBuzz"),
      3 | 6 | 9 | 12 => println!("Fizz"),
      5 | 10 => println!("Buzz"),
      99 => println!("{}", x),  // `_` から `99`に変更
    }
{% endcode %}

するとコンパイルエラーになり、以下のように色付きでわかりやすくエラーが表示されます。

{% img /gallery/daily/others/non-exhaustive-patterns.png  %}
　
「non-exhaustive patterns」はパターンが網羅的でないというエラーです。パターンの網羅性はマッチング対象の型の値域を網羅しているかどうかで判断されます。この場合`x`はi32型で符号付き32ビット整数なので値域はstd::i32::MIN(−2,147,483,648)〜std::i32::MAX(2,147,483,647)になります。`std::i32::MIN`と`std::i32::MIN`はRustで定義されている定数で符号付き32ビット整数の最小値と最大値を表しています。

「patterns `std::i32::MIN..=-1i32`, `1i32..=2i32`, `4i32` and 3 more not covered」は、std::i32::MINから-1までと1から2までと４がカバーされておらず、さらに3つ以上カバーされていないものがあると言っています。このようにRustはエラーメッセージが丁寧で具体的にカバーできていない範囲をエラーメッセージが教えてくれます。

### 4日目 〜FizzBuzzでガードを覚える〜

3日目のプログラムで`if`を`match`でスマートに置き換えることに成功しました。しかし、また別の不満が出てきました。"3 | 6 | 9"のように3の倍数を列挙するのではなく、2日目のプログラムのように"x % 3 == 0"といた形で「余りが0」で３の倍数を表現したいのです。そこで**パターンガード**の出番です。

{% code lang:rust fizz_buzz4(rust) %}
fn fizz_buzz4() {
  for x in 1 ..= 100 {
    match x {
      e if e % 15 == 0 => println!("FizzBuzz"), // 変数パターンとパターンガードを用いたパターン
      e if e % 3 == 0 => println!("Fizz"),
      e if e % 5 == 0 => println!("Buzz"),
      e => println!("{}", e),
    }
  }
}
{% endcode %}
{% elink Run https://play.rust-lang.org/?version=stable&mode=debug&edition=2018&gist=68c79429a1ea68fb01500006e1580ade %}
　
上記のプログラムの`e if e % 15 == 0`において`e`は変数パターンと呼ばれていて、任意の値にマッチして指定した変数を値に束縛します。変数名自体は`e`でなくても何でも構いませんが、アーム内でシャドーイングが起こることだけ注意してください。`if e % 15 == 0`がパターンガートよ呼ばれるもので、条件を満たす場合だけこのアームがマッチします。

パターンガードがない変数パターンはワイルドカードパターンと似ていて何にでもマッチするので、通常パターンの一番最後におこかれます。両者の違いは変数を束縛するか否かの違いだけです。

## 第二章 Rust生活:中級編

いよいよ中級編に突入です。ここからは少し関数型プログラミングの要素が強くなっていきますが、テーマは相変わらずFizzBuzzなので焦らずにまったりと生活を楽しんでください。

### 5日目 〜FizzBuzzでタプルに馴染む〜

4日目のプログラムでパターンガードで素直に剰余で分類できるようになりましたが、やはりパターンガードの記述は冗長に思えます。そこで**タプル**を用いてシンプルかつエレガントに書き換えて見ましょう。

{% code lang:rust fizz_buzz5(rust) %}
fn fizz_buzz5() {
  for x in 1 ..= 100 {
    match (x % 3, x % 5) {
      (0, 0) => println!("FizzBuzz"), // xを3で割った余りと5で割った余りが両方0
      (0, _) => println!("Fizz"),     // xを3で割った余りが0
      (_, 0) => println!("Buzz"),     // xを5で割った余りが0
      _      => println!("{}", x),
    }
  }
}
{% endcode %}
{% elink Run https://play.rust-lang.org/?version=stable&mode=debug&edition=2018&gist=2d3e161ce37482ba288191090502d940 %}
　
「タプル」は異なる型の値の集合であり、括弧`()`を用いて生成します。例えば`(1, 2, 3)`は`(i32, i32, i32)`型のタプルであり、`(5, 3.1, "hoge")`は`(i32, f64, &str)`型のタプルになります。`ｆ64`は64ビット浮動小数点型で`&str`は「文字列スライス」と呼ばれています。ちなみに一日目に出てきたユニット`()`は実は要素を持たないタプルでした。要素が一つのタプルはあまり利用する場面がありませんが、作りたい場合は`(1,)`のように１つ目の要素のあとにカンマ`,`をつけます。こうすることで式をまとめるための丸カッコと区別することができます。

文字列スライスについて少し説明します。文字列スライスは文字列の一部を切り出したもので、固定長文字列を表す型を持ちます。具体的にはUTF8バイトシーケンスへの参照になっています。今まで何気なく使っていた`println!("FizzBuzz")`の`"FizzBuzz"`という表記は**文字列リテラル**と呼ばれ、型としては文字列スライスとして表されます[^6]。また、可変長文字列はヒープと呼ばれるメモリ空間に配置され、`String`型として区別されます[^7]。

Rustは性能に気を使う言語なので、静的領域に確保されたのか、スタックに確保されたのか、ヒープに確保されたのかを型を用いて表現します。一般的にRustのプログラムはオーバーヘッドが少ないスタック領域を優先的に使うようにして、必要なときにヒープが使えるようにデザインされています。

少し話が脱線しましたが話を上記のプログラムに戻すと、`(x % 3, x % 5)｀は変数`x`の値をそれぞれ3と5で割った余りをタプルにしていて、型は`(i32, i32)`になります。パターンマッチのアームの中ではこのタプルのパターンに応じて分類を行っています。

`(0, 0)`というパターンは文字通り`(0, 0)`というタプル値と等しい場合にマッチングします。`(0, _)`というパターンはタプルの一つ目の要素が0で２つ目の要素は何でもマッチングします。`_`はワイルドカードパターンになっていて、このようにタプルのマッチングにも利用可能です。

パターンマッチはこのように内部構造を持ったデータ型に対して特に強力です。パターンマッチに関しては以前に記事を書いたので、さらに詳細について知りたい方は御覧ください。

{% blogCard https://hinastory.github.io/cats-cats-cats/2019/04/30/understanding-pattern-matching/ %}

[^6]: 文字列リテラルは正確には`& 'static str`型を持ちます。`'static`はライフタイムと呼ばれており、プログラム初期化時に静的にアロケートされることを示しています。
[^7]: 可変長文字列から固定長の文字列を切り出して文字列スライスに変換することは可能です。

### 6日目 〜FizzBuzzでmatchが式であることを認識する〜

5日目のプログラムでタプルによるパターンマッチを身につけましたが、今度は`println!`マクロが冗長に思えてきました。どうにかして`println!`を一箇所にまとめられないでしょうか？ もちろん可能です。そのためには`match`が**式**であることを理解する必要があります。

{% code lang:rust fizz_buzz6(rust) %}
fn fizz_buzz6() {
  for x in 1 ..= 100 {
    let s = match (x % 3, x % 5) {
      (0, 0) => "FizzBuzz".to_string(),
      (0, _) => "Fizz".to_string(),
      (_, 0) => "Buzz".to_string(),
      _      => x.to_string(),
    };
    println!("{}", s)
  }
}
{% endcode %}
{% elink Run https://play.rust-lang.org/?version=stable&mode=debug&edition=2018&gist=608daddcd6b38498275b7f4e406752c0 %}
　
`match`が式であるとはつまり、評価した結果の値があるということです。そして変数は値に束縛できるので、その値を`println!`で表示することで`println!`を一箇所に集約することができます。しかし、以下のように単に変数`s`を`match`の評価値に束縛しようとするとコンパイルエラーになってしまいます。

{% code lang:rust %}
let s = match (x % 3, x % 5) {
    (0, 0) => "FizzBuzz",
    (0, _) => "Fizz",
    (_, 0) => "Buzz",
      _    => x.to_string(), // 整数を文字列に変換
};
println!("{}", s)
{% endcode %}
{% elink Run https://play.rust-lang.org/?version=stable&mode=debug&edition=2018&gist=68fef1a8f210830180c02f663d648f16 %}
　
具体的なエラーは以下のようになっています。**「incompatible types」**とあるので型が合わずにエラーになっているようです。

{% img /gallery/daily/others/incompatible-types.png  %}
　
Rustは静的型付言語なので動的型付言語よりも**型について強い一貫性**が求められます。例えば今回のケースのように`match`の中のアームの評価値は全て同じ型にする必要があります。そのことは理解していたつもりで最後のアームで`x.to_string()`として整数型を文字列型にしましたが、それでもエラーになってしまいました。

ここで5日目の出来事を思い出してください。そこでは文字列には固定長文字列の型(文字列スライスの型)である`&str`と可変長文字列の型である`String`があることを述べました。つまり上記のエラーは文字列リテラルの型は`&str`であり、`.to_string()`で作成した文字列は`String`型なので、型が異なりエラーとなっている訳です。

ここではどちらかに型を寄せることでエラーを解決します。Rustで苦労するのはこの型合わせだと思いますが、エラーメッセージは比較的わかりやすいので一度理解してしまえば修正自体はそれほど難しくはありません。`fizz_buzz6()`では文字列リテラル("FIzBuzz"等の文字列)を`.to_string()`で`String`型に変更することで対応しました。実は可変長文字列も`&`をつけて文字列スライスを切り出すことは可能ですが、それは7日目に説明します。

### 7日目 〜FizzBuzzで所有権と借用を意識する〜

6日目のプログラムで`println!`を一箇所にまとめることができたのですが、また新たに問題抱え込んでしまいました。これまで文字列リテラルとして静的に確保していた文字列を`.to_string()`で可変長文字列に変換しているので、毎回ヒープメモリへ文字列を確保することになってしまいました。100回くらいのループになら問題ないかもしれませんが、回数が多くなるほど性能に影響がでることは目に見えています。そこで今回はなるべく`.to_string()`を使わない方法を考えることにしました。

{% code lang:rust fizz_buzz7(rust) %}
fn fizz_buzz7() {
  for x in 1 ..= 100 {
    let tmp; // 値のスコープを広げるための変数
    let s = match (x % 3, x % 5) {
      (0, 0) => "FizzBuzz",
      (0, _) => "Fizz",
      (_, 0) => "Buzz",
      _      => {tmp = x.to_string(); &tmp}, // `tmp`を`x.to_to_string()`に束縛して参照をとる
    };
    println!("{}", s);
  }
}
{% endcode %}
{% elink Run https://play.rust-lang.org/?version=stable&mode=debug&edition=2018&gist=1997fc49b0129ddf4ab00363e95a72ac %}
　
上記の方法は、Rustの所有権と借用を正しく理解していないと思いつくことはできません。そして所有権と借用の概念はRustの際立った特徴になっているので、快適なRustライフを送るためにもこれらを理解できるようになりましょう。所有権の規則は以下のとおりです。

1. Rustの各値は、**所有者と呼ばれる変数**と対応している。
2. いかなる時も**所有者は一つ**である。
3. **所有者がスコープから外れたら、値は破棄**される。

以下で具体的に確認してみます。まずは**「常に所有権はひとつ」**というルールを守るための**ムーブセマンティクス**について説明します。

{% code lang:rust %}
let s1 = "Rust Life".to_string();
println!("{}", s1); // OK

let s2 = s1; // ムーブセマンティクス：所有権が`s1`から`s2`に移動している

println!("{}", s2); // OK
println!("{}", s1); // コンパイルエラー： 所有権は`s2`に移動しているので`s1`にアクセス不可
{% endcode %}
{% elink Run https://play.rust-lang.org/?version=stable&mode=debug&edition=2018&gist=03f339692a92699fd8721c9eb11fb652 %}
　
「ムーブセマンティクス」とは簡単にいえば**所有権の移動という意味**であり、上記の例では`s2`へ`s1`を代入することにより所有権が移動しています。エラーメッセージは以下のようになりどこで所有権が移動し、どこで利用しようとしてエラーになったのかひと目で分かるようになっています。

{% img /gallery/daily/others/borrow-of-moved-value.png %}
　
次に代入以外でムーブセマンティクスが有効になる例を紹介します。それは**関数の引数と戻り値**になります。

{% code lang:rust %}
fn test_print(msg: String) -> String {
  println!("{} in test_print", msg);
  msg // `msg`をそのまま返却
}

let s1 = "Rust Life".to_string();

let s2 = test_print(s1);

println!("{} after test_print /s2", s2);
println!("{} after test_print /s1", s1); // コンパイルエラー: 所有権は`s1`にはない
{% endcode %}
{% elink Run https://play.rust-lang.org/?version=stable&mode=debug&edition=2018&gist=9680cf0e534db35211d7b0d38eb99e15 %}
　
上記ではまず作成された文字列の所有者は`s1`になり、`test_print()`が呼び出され、文字列の所有者は`s1`からtest_print内の`msg`になります。次に`msg`はfn test_printの戻り値としてそのまま返却されます。このとき所有権も移動して、呼び出し元の`s2`が新たな所有者になります。つまり所有者は`s1` -> `msg` -> `s2`と移動しており、単一所有者の原則が守られていることが分かると思います。

ちなみにRustの関数は**最後に評価された式もしくは文の評価値が戻り値**になる仕様です。文の評価値は常にユニット`()`になります。そしてセミコロン`;`は式を強制的に文（正確には式文）に変えるようになっています。そのため、例えば上記の`test_print`関数の最後の行を`msg;`としてセミコロンをつけてしまうと、`式`が`式文`に変換されてしまい、ユニット`()`が戻り値となりますが、そうすると関数宣言で`String`が戻り値になっていることと矛盾するのでコンパイルエラーになります。
　
このように所有権を明確にすることでリソースの多重解放によるエラーをコンパイル時に検出することができるようになります。また、リソースの利用に関するある種の競合をコンパイル時に検出してエラーにすることができます。この所有者は一つという性質は例えばC++の`unique_ptr`でも実現できますが、`unique_ptr`の利用がオプションなので、変数に対する不正なアクセスを防ぐことができません。その点Rustは**言語レベルで所有権の規則を徹底しているので、不正な変数へのアクセスをコンパイル時に確実に防いでくれます。**

ただ毎回、所有権を移動させてしまうと不便なケースもあります。例えば上記の例で言えば`s1`の値を`test_print`関数で利用したあとに`s1`と同じスコープで再利用したい場合には、必ず`test_print`関数の戻り値として所有権を移動させて、元に戻す動作にする必要があります。こういうケースではRustの**「参照」**の機能を利用すると便利です。参照はアンパサンド`&`を変数名につけることで作成できます。

{% code lang:rust %}
fn test_print(msg: &String) -> &String {
  println!("{} in test_print", msg); // `msg`は`s1`の値を借用している
  &msg // `msg`をそのまま返却
}

let s1 = "Rust Life".to_string();

let s2 = test_print(&s1); // 所有者は`s1`のままで値を`s2`は値を借用しているだけ

println!("{} after test_print /s2", s2);
println!("{} after test_print /s1", s1); // 所有権は移動していないのでコンパイルエラーにはならない
{% endcode %}

参照は型名でも区別され、`String`型の参照は`&String`型になります。この参照を利用して一定期間だけ値をレンタルすることを**借用**と呼びます。借用には以下のルールがあります。

- 参照は値よりも長く生存してはならない
    - 参照が有効なスコープは**ライフタイム**と呼ばれる
- 値が共有されている間は値の変更を許さない

上記のルールを守ることによりデータの競合を防ぎつつ、安全な共有を実現できます。次に、スコープと値の破棄について説明します。

{% code lang:rust %}
{                         // sはまだ宣言されていないので有効ではない
  let s = "Rust Life";  // sここから有効になる

  println!("{}", s);   // OK
}                        // このスコープは終わり。もうsは有効ではない
println("{}", s); // コンパイルエラー： sは破棄されており無効
{% endcode %}
{% elink Run https://play.rust-lang.org/?version=stable&mode=debug&edition=2018&gist=2a63891e31213be6255e30137d9ecdf5 %}
　
コメントのとおり、変数`s`のスコープは変数が宣言されてから中括弧の終わり`}`までなので、「コンパイルエラー」とコメントされた行では`s`は破棄されておりアクセスできません。この「所有者がスコープから外れたら、値は破棄される」という性質は他の一部の言語でも見ることができます。この機能はよく**「ローンパターン」**と呼ばれており、C++のRAII、Javaのtry-with-resources、C#のusing、ScalaのUsing、Goのdefer等がそれにあたります。

ようやく、ここまでの説明で`fizz_buzz7()`を説明する下地が整いました。まずfizz_buzz7を一部切り出して変更した以下の例はコンパイルができるかどうか考えてみてください。

{% code lang:rust %}
let x = 10;
let s = match (x % 3, x % 5) {
  (0, 0) => "FizzBuzz",
  (0, _) => "Fizz",
  (_, 0) => "Buzz",
    _    => &x.to_string(), // ここで参照を作成
};
println!("{}", s);
{% endcode %}
{% elink Run https://play.rust-lang.org/?version=stable&mode=debug&edition=2018&gist=981f0bcad665ac399c00a38d541bc7d3 %}
　
「型」があっていないから、という答えを出した人は残念ながら不正解です。`x.to_string()`では`String`型であり、その参照は`&String`型になります。そして"FizzBuzz"のような文字列リテラルは`&str`型になるので確かに型はあっていません。しかし、それはRustの**「型強制」**という仕組みで`&String`型は`&str`型に変換されてしまうので型の問題はなくなるのです。

型の問題ではないとすると何が問題かというと**「ライフタイム」**の問題となります。つまり`x.to_string()`で`String`型の値が作成されますが、その値が有効なスコープは`match`のアームの中だけなので値はそこで破棄されます。しかし、`&x.to_string()`でその破棄されたはずの値の参照を返そうとしているので**「参照は値よりも長く生存してはならない」**というルールに反してエラーになるのです。単純に`.to_string()`した値を返すだけならムーブセマンティクスが働いてそのまま値がムーブされますが参照は所有権を移動しないのでこのような挙動になります。

この問題は以下のようにより広いスコープを持つ変数に束縛させてから参照をとることで解決できます。

{% code lang:rust %}
let x = 10;
let tmp; // 値のスコープを広げるための変数
let s = match (x % 3, x % 5) {
  (0, 0) => "FizzBuzz",
  (0, _) => "Fizz",
  (_, 0) => "Buzz",
  _      => {tmp = x.to_string(); &tmp}, // `tmp`を`x.to_to_string()`に束縛して参照をとる
};
println!("{}", s);
{% endcode %}

このようにすることで、参照`&tmp`のライフタイムは変数`s`と同じであり、それは変数`tmp`の有効スコープ内であるので、借用ルールの制約をみたすことができます。

思ったより長かったですがこれで`fizz_buzz7`を理解することできるようになったと思います。恐らくこの所有権と借用がRust中級者の一番のハードルだと思われるのでしっかりと理解を深めるようにしてください。

### 8日目 〜FizzBuzzで高階関数とクロージャに目覚める〜

7日目のプログラムで性能を犠牲にしないFizzBuzzになりましたが、直感的には分かりづらくなりました。それは元のFizzBuzzを表示するというロジックとは関係ない性能の都合上の`tmp`変数を導入したことに原因があります。この辺はトレードオフの問題ですが、やはりメンテナンス性を重視した設計がしたくなりました。そこで唐突に天から啓示を受けました。**高階関数とクロージャに目覚めよ**と。

{% code lang:rust fizz_buzz8(rust) %}
fn fizz_buzz8() {
  let fz = |x: i32| {       // クロージャの定義
    match (x % 3, x % 5) {
      (0, 0) => format!("FizzBuzz"),
      (0, _) => format!("Fizz"),
      (_, 0) => format!("Buzz"),
          _  => x.to_string(),
  }};

  (1 ..= 100).map(fz).for_each(|x| println!("{}", x)); // 高階関数とクロージャの利用
}
{% endcode %}
{% elink Run https://play.rust-lang.org/?version=stable&mode=debug&edition=2018&gist=a1242cc0802345c0ff405d9a4c7a8e3f %}
　
まずは関数とクロージャの違いについて説明します。クロージャ以下のとおり関数と見た目と機能はよく似ていますが違いがいくつかあります。

{% code lang:rust %}
let two = 2;
fn double_func(x: i32) -> i32 { x * 2 } // 引数を２倍にする関数
let double_closure = |x| { x * two };   // 引数を2倍にするクロージャ

println!("{}", double_func(2));  // result: 4
println!("{}", double_closure(2)); // result: 4
{% endcode %}
{% elink Run https://play.rust-lang.org/?version=stable&mode=debug&edition=2018&gist=2d397bc26aacf0676898ac63b4b0bf2f %}
　
１つ目の違いは、関数は引数の型や戻り値の型を省略できませんが、クロージャは**大抵は**省略できまることです。「大抵」と書いたのは型推論に失敗してコンパイラに型を書けと怒られる場合もあるからです。

２つ目はクロージャは外部の変数を利用できることです。上記の例では`double_closure`ではクロージャ本体の外側の変数`two`を利用しています。このときクロージャは変数を**環境としてキャプチャ**しているので、クロージャの中で利用可能になっています。関数は環境をキャプチャできないので外部の変数は利用できません[^8]。

最後の違いはクロージャの波括弧`}`後にはセミコロン`;`が必要なことです。これはクロージャというよりも`let`宣言と関数の違いになります。

Rustのクロージャは他の言語では**「無名関数」**、**「匿名関数」**、**「ラムダ」**と呼ばれる場合がありますが、基本的には同じ役割を果たしていると考えて差し支えありません。ただし一般的な**「クロージャ」**という用語は**「環境をキャプチャする」**という側面を強調していることは頭の片隅に留めておくべきかもしれません[^9]。

次に、高階関数について説明します。高階関数は**関数を引数にとるか、関数を戻り値として返す関数**です。以下は高階関数の`map`と`for_each`の使用例です。

{% code lang:rust %}
let double = |x| { x * 2 };

(1 ..= 5).map(double).for_each(|x| println!("{}", x))
{% endcode %}

上記の例ではレンジ(1 ..= 5)に対して`map`を呼び出しており、レンジの各要素に`double_closure`を適用しています。`double_closureは`引数を２倍にするので各要素は[2,4,6,8,10]になり`map`はそれをイテレータとして返します。そしてイテレータに対して`for_each`を呼び出すとイテレータが返す各要素に対して受け取った関数を適用します。上記の例ではクロージャを適用しています。クロージャの中身は`println!`の適用なので、結果的に出力は以下のようになります。

{% code lang:text %}
2
4
6
8
10
{% endcode %}

`map`も`for_each`も動作はよく似ていますが、違う点は戻り値として**イテレータを返すかどうか**です。`map`はイテレータを返すので何回も`map`を続けることができますが、`for_each`はユニット`()`を返すのでその後に`map`や`for_each`を続けることはできません。つまり`map`は中間で使われることを意図しており、`for_each`は終端で使われることを意図してます。Rustではこの使い分けを明確にしており、`map`は**イテレータアダプタ**と呼ばれており、`for_each`は**コンシューマ**と呼ばれています。イテレータおよびイテレータアダプタの作用は基本的に怠惰(`lazy`)であり、コンシューマが消費するまで作用しません。このことは以下を実行してみるとよく分かると思います。

{% code lang:rust %}
let double = |x| { println!("in map {}", x); x * 2 };

(1 ..= 5).map(double).for_each(|x| println!("in for_each {}", x))
{% endcode %}
{% elink Run https://play.rust-lang.org/?version=stable&mode=debug&edition=2018&gist=be08763d45967811c1bdf397457926d4 %}
　
上記の実行結果は以下のようになります。構文上は`map`が`for_each`よりも先なので`map`が先に呼ばれそうですが、`map`は怠惰なので`for_each`で必要になったときに処理を実行するようになっているので、結果的に`in map`と`in for_each`が交互に出力されるようになります。

{% code lang:text %}
in map 1
in for_each 2
in map 2
in for_each 4
in map 3
in for_each 6
in map 4
in for_each 8
in map 5
in for_each 10
{% endcode %}

ここまでの説明で`fizz_buzz8`が理解できるようになったと思います。

[^8]: 関数内で外部の変数は利用できませんが、外部の定数は利用可能です。定数は`const`を用いて宣言します。
[^9]: 原理主義的な考え方をすれば環境をキャプチャしないものはクロージャとは呼べないのかもしれませんが、少なくともRustではクロージャの構文で書かれたものはクロージャと呼びます。

### 9日目 〜FizzBuzzで畳み込みを実践する〜

8日目のプログラムでクロージャと高階関数に目覚めてしまった訳ですが、他にもFizzBuzzで利用できそうな高階関数がないかと探してみると面白そうなものが見つかりました。それが`fold`であり**畳み込み**と呼ばれる処理を実現します。

{% code lang:rust fizz_buzz9(rust) %}
fn fizz_buzz9() {
  let res =  (1 ..= 100)
      .fold(format!(""),|buf, x| { // 文字列の畳み込みを行う
        match (x % 3, x % 5) {
          (0, 0) => format!("{}FizzBuzz\n", buf),
          (0, _) => format!("{}Fizz\n", buf),
          (_, 0) => format!("{}Buzz\n", buf),
              _  => format!("{}{}\n", buf, x),
  }});

  println!("{}", res);
}
{% endcode %}

まずは簡単な例で`fold`を確認してみたいと思います。以下の例は`fold`を用いて1から5の和を求めるコードです。

{% code lang:rust %}
let init = 0;
let sum = (1 ..= 5).fold(init, |acc, x| acc + x);  // (((((O + 1) + 2) + 3) + 4) + 5)
println!("{}", sum)
{% endcode %}
{% elink Run https://play.rust-lang.org/?version=stable&mode=debug&edition=2018&gist=e398530e60b9ec98f53f8c68cc7268e5 %}
　
`fold`の挙動はイテレータから順番に値を取り出して、前回の計算結果と取り出した結果を元に出した計算結果を次回に繰り越すことを繰り返し、一番最後の計算結果が`fold`の値になります。一番最初の計算には「前回の計算結果」がないので初期値を与えます。上記のプログラムでは具体的には`(((((O + 1) + 2) + 3) + 4) + 5)`のような数式で計算していることになります。

`fold`で行われるような処理は一般的は**畳み込み**と呼ばれますが、Rustの`fold`は**左畳み込み**となっており、先頭から順に要素を取り出して計算を行います。これとは別に**右畳み込み**というものもあり、要素を逆順で取り出して処理します。

ここまでの説明で`fizz_buzz9`はほぼ理解できるようになるのですが、一点だけ`format!`マクロについて説明します。このマクロはprintln!マクロと似ていますが結果を画面に出力するのではなく`String`型の文字列で返します。単純な文字列なら`.to_string()`でも良いですが２つ以上の変数から文字列を作成したい場合に重宝します。

以上により`fizz_buzz9`では`fold`内では簡易な式で表現すると以下のような順序で文字列が結語されて、最終的には`println!`表示されます。

{% code lang:text %}
(((((("" + "1\n") + "2\n") + "Fizz\n") + "4\n") + "Buzz\n") ...)
{% endcode %}

## 第三章 Truth of Rust

ここからはRustの上級者向けの章になります。これまでは詳細な説明を加えていましたが、ここからはヒントと簡単な説明のみになります。上級者になるには調べる力も必須になってくるのでぜひチャレンジして理解できるようになりましょう。以下は参考になるリンクです。

- {% elink The Rust Programming Language https://doc.rust-jp.rs/book/second-edition/ %}
- {% elink Rustの日本語ドキュメント https://doc.rust-jp.rs/ %}
- {% elink Rust Language Cheat Sheet https://cheats.rs/ %}
- {% elink Comprehensive guide to the Rust standard library APIs https://doc.rust-lang.org/std/index.html %}

### 10日目 〜FizzBuzzでコレクションとジェネリクスに気付く〜

9日目のプログラムで`fold`の魅力に気づきましたが、文字列を`+`演算子で結合していくやり方は自由度が高すぎてFizzBuzzではやりすぎなのではと思うようになりました。そこで`fold`で行っていた文字列結語をもっとシンプルに行う処理そ探していたら`join`を見つけました。

{% code lang:rust fizz_buzz10(rust) %}
fn fizz_buzz10() {
  fn fz(x: i32) -> String {
    match (x % 3, x % 5) {
      (0, 0) => format!("FizzBuzz"),
      (0, _) => format!("Fizz"),
      (_, 0) => format!("Buzz"),
          _  => x.to_string(),
  }};

  let res =  (1 ..= 100).map(fz).collect::<Vec<_>>().join("\n");

  println!("{}", res);
}
{% endcode %}
{% elink Run https://play.rust-lang.org/?version=stable&mode=debug&edition=2018&gist=3b0dfdbf0761ee362154eee883e2a2df %}
　
上記のプログラムの理解のポイント以下になります。

- コンシューマである`collect`
- 配列型のコレクションである`Vec`
- `Vec`とセットでついてくるジェネリクスの理解
- `join`による結合処理

### 11日目 〜FizzBuzzで**レム**との邂逅〜

10日目のプログラムでなんとなく`fz`関数を眺めていると引数の型が`i32`型に固定されていることに気づきました。せっかくジェネリックを覚えたので`fz`をジェネリックにして`u32`型や`i64`型にも対応できるようにしたくなりました。

{% code lang:rust fizz_buzz11(rust) %}
fn fizz_buzz11() {
  use std::ops::Rem;

  fn fz<T>(x: T, div_a: T, div_b: T, zero: T) -> String
  where T: Rem<T, Output=T> + Eq + Copy + ToString {
    match (x % div_a == zero , x % div_b == zero) {
      (true, true) => format!("FizzBuzz"),
      (true, _) => format!("Fizz"),
      (_, true) => format!("Buzz"),
          _  => x.to_string(),
  }};

  (1 ..= 100).map(|x: u32| fz(x, 3,5, 0)).for_each(|x| println!("{}", x));
}
{% endcode %}
{% elink Ram https://play.rust-lang.org/?version=stable&mode=debug&edition=2018&gist=c6ba1fe760a694dab2c74f7de33cf2d3 %}
　
上記のでRunが**Ram**になっているのは**仕様です**。どうしても**Rem**と一緒に登場させたかったのです。優しくスルーして頂けると幸いです。

上記のプログラムのポイントは以下です。難易度が跳ね上がりましたが、どうか挫けずに次の日の朝を迎えられるよう頑張ってください。

- ジェネリック関数の実装
- トレイト境界
- FizzBuzzで必要な演算（剰余（`Rem`）、0との比較(`Eq`)）
- `Copy`トレイトと`ToString`トレイトの役割

### 12日目 〜FizzBuzzでトレイトと戯れる〜

11日目のプログラムでトレイトの存在に気づき、トレイトを生かしてFizzBuzzを実装してみたくなりました。

{% code lang:rust fizz_buzz12(rust) %}
struct FizzBuzz<T> {
  div_a: T,
  div_b: T,
  zero: T,
}

impl<T> FizzBuzz<T> {
  fn new(div_a: T, div_b: T, zero: T) -> Self {
    FizzBuzz {div_a, div_b, zero}
  }
}

trait ToFzStr<T> {
  fn to_str(&self, x: T) -> String;
}

impl ToFzStr<i32> for FizzBuzz<i32> {
  fn to_str(&self, x: i32) -> String {
    match (x % self.div_a == self.zero , x % self.div_b == self.zero) {
      (true, true) => format!("FizzBuzz"),
      (true, _) => format!("Fizz"),
      (_, true) => format!("Buzz"),
          _  => x.to_string(),
  }}
}

fn fizz_buzz12() {
  (1 ..= 100).map(|x| FizzBuzz::new(3, 5, 0).to_str(x)).for_each(|x| println!("{}", x))
}
{% endcode %}
{% elink Run https://play.rust-lang.org/?version=stable&mode=debug&edition=2018&gist=62ddc4f444c1dc9052a2f60ff0ddb06f %}
　
上記のプログラムのポイントは以下です。RustのトレイトはHaskellの型クラスに相当するものです。Javaのような継承ベースのオブジェクト指向言語から来た方には理解が難しいかもしれませんが、一度慣れると多くのメリットに気づけると思います。

- 構造体の定義と実装
- メソッド定義と関連関数
- トレイトの定義と構造体への実装

### 13日目 〜FizzBuzzをアドホックに改造する〜

12日目のプログラムでは`ToFzStr`は`i32`型にしか実装していませんでしたが、他の型にも実装したくなりました。

{% code lang:rust fizz_buzz13(rust) %}
use std::ops::Rem;
fn common_fz_str<T>(x: T, div_a: T, div_b: T, zero: T) -> String
where T: Rem<T, Output=T> + Eq + Copy + ToString {
  match (x % div_a == zero , x % div_b == zero) {
    (true, true) => format!("FizzBuzz"),
    (true, _   ) => format!("Fizz"),
    ( _  , true) => format!("Buzz"),
         _       => x.to_string(),
}}

impl ToFzStr<i64> for FizzBuzz<i64> {
  fn to_str(&self, x: i64) -> String {
    common_fz_str(x, self.div_a, self.div_b, self.zero)
  }
}

impl ToFzStr<u32> for FizzBuzz<u32> {
  fn to_str(&self, x: u32) -> String {
    common_fz_str(x, self.div_a, self.div_b, self.zero)
  }
}

fn fizz_buzz13() {
  (1 ..= 100).map(|x: i64| FizzBuzz::new(3, 5, 0).to_str(x)).for_each(|x| println!("{}", x))
}
{% endcode %}
{% elink Run https://play.rust-lang.org/?version=stable&mode=debug&edition=2018&gist=58cfd062333e55b04dfb6b4ad07daf31 %}
　
上記のプログラムは12日目と被る定義は省略しています。プログラムの全体は「Run」のリンク先を見てください。
ポイントは以下になります。

- トレイトを複数の型への実装してアドホック多相性を確認する

### 14日目 〜FizzBuzzで無限列に畏怖する〜

13日目のプログラムまでは1から100までのFizzBuzzに対応してきましたが、もっと大きなFizzBuzzも試してみたくなりました。

{% code lang:rust fizz_buzz14(rust) %}
fn fizz_buzz14(end: usize) {
  (1 ..).take(end).map(|x| FizzBuzz::new(3, 5, 0).to_str(x)).for_each(|x| println!("{}", x))
}
{% endcode %}
{% elink Run https://play.rust-lang.org/?version=stable&mode=debug&edition=2018&gist=8d99fec95b8ad338dda60a1d95dc7264 %}
　
上記のプログラムは以前と被る定義は省略しています。プログラムの全体は「Run」のリンク先を見てください。
ポイントは以下になります。

- 無限の数値列の生成`(1..)`
- `take`による切り出し

### 15日目 〜FizzBuzzで再帰的に死に戻る〜

14日目のプログラムで無限の奥深さに惹かれました。そしてとうとう無限を表現する禁忌の手段、**再帰の沼**にハマってしまったのです。こうなるともう元の生活に戻るのは困難でしょう。終わりの始まりです。

{% code lang:rust fizz_buzz15(rust) %}
fn fizz_buzz15(end: u32) {
  if end > 1 { fizz_buzz15(end - 1) }

  println!("{}", FizzBuzz{div_a: 3, div_b: 5, zero: 0}.to_str(end))
}
{% endcode %}
{% elink Run https://play.rust-lang.org/?version=stable&mode=debug&edition=2018&gist=17c8a453c54809e59cca5bd4f28d46e3 %}
　
ポイントは以下になります。

- 再帰を理解する
    - 末尾再帰最適化について調べ始める・・・[^10]
    - 素直にイテレータを使ったほうが幸せだと気付く

[^10]: 末尾再帰および末尾再帰最適化については沼なので、深入りはオススメしません。それでもどうしても沼にハマりたい人は自己責任でお願いします（笑）。

## まとめ

Rustは学習曲線が急峻だと言われています。学ぶべきコンポーネントが多く個々が密接に関連していて、ラスボス感漂う借用チェッカーまでいるからです。そのため約束した朝は遠く、絶望という病に侵されるかもしれません。**脳が震える**かもしれません。でも**FizzBuzz**がいます。どんなに辛く苦しいことがあって負けそうになってしまっても、世界中の誰も信じてくれなくて、自分自身を信じられなくなってしまっても、FizzBuzzが側にいます。ここから始めましょう。イチから、いいえ、**FizzBuzz**から。

- `while`, `if`
- `for`とレンジ
- パターンマッチ
- タプル
- 所有権と借用
- 高階関数とクロージャ
- 畳み込み
- コレクションとジェネリクス
- トレイトとトレイト境界
- アドホック多相性
- 無限列
- 再帰

Rust生活をFizzBuzzから始めることで上記の学びが少しずつ得られると信じています。そして絶望に抗う賭けに勝ち、鬼がかった未来を手に入れましょう。

{% blockquote  %}
君を見てる。
君が見てる。
だから俯かない。
ここから、FizzBuzzからはじめよう。
プログラマの物語を。
-- FizzBuzzから始める、Rust生活を。
{% endblockquote %}

(本記事は、某ラノベ[^11]のパロディとして書かれており、設定およびセリフの一部を改変して借用しています。)

[^11]: タイトルを見てわからなかった人のために一応補足しておくと「Re:ゼロから始める異世界生活」です。