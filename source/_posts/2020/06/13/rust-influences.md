---
title: Rustに影響を与えた言語たち
thumbnail: /gallery/daily/others/rust-influences.png
categories:
    - Tech
    - Language
tags:
    - Rust
date: 2020-6-13 07:28:45
---
Rustを使っていると時々**「あれ？この機能、他の言語に似てない？」**と思うことがあります。最初に思ったのはトレイトで、これはHaskellの型クラスやScalaのImplicitsを使った型クラスパターンと同等な機能と理解しました。クロージャのシンタックスはRubyのブロック記法に似ているなと感じました。そんな**「似ている」**を少しだけ深堀りしてみたいと思い、Rustに影響を与えた言語を調べて見ました。

<!-- more -->

## 目次

<!-- toc -->

## TL;DR

- Rustに影響を与えた言語に関してはすでにまとまったページがありました
  - [Influences - The Rust Reference](https://doc.rust-lang.org/reference/influences.html)
  - [Why Rust? - #Influences | Learning Rust](https://learning-rust.github.io/docs/a1.why_rust.html#Influences)
- この記事は上記のページをベースに以下のようにまとめ直して紹介しています
    - 影響を受けた言語の特徴を表形式でまとめる
    - 影響を受けた機能の簡単な紹介
    - 影響の可視化（マインドマップ）

## 影響を受けた言語

「[Influences](https://doc.rust-lang.org/reference/influences.html)」に記載されている言語[^1]を年代順に並べて、言語の特徴をマトリックスにしてみました。特徴の選択はGCを除いてRustが力を入れているパラダイムを選択しています。また比較のためにRust自身も加えてあります。

|           | 登場年代 | FP  | OOP | 並行計算 | 静的型付け | パラメータ多相 | アドホック多相 | GC    |
| --------- | -------- | --- | --- | -------- | ---------- | -------------- | -------------- | ----- |
| C         | 1972     |     |     |          | o          |                |                |       |
| Scheme    | 1975     | o   |     |          |            |                |                | o     |
| C++       | 1983     |     | o   |          | o          | o              |                |       |
| Newsqueak | 1984     |     |     | o        | o          |                |                | o     |
| Erlang    | 1986     | o   |     | o        |            |                |                | o     |
| SML       | 1990     | o   |     |          | o          | o              |                | o     |
| Haskell   | 1990     | o   |     |          | o          | o              | o              | o     |
| Alef      | 1992     |     |     | o        | o          |                |                | o     |
| Limbo     | 1995     |     |     | o        | o          |                |                | o     |
| ML Kit    | 1997[^2] | o   |     |          | o          | o              |                | △[^3] |
| Ruby      | 1995     | △   | o   |          |            |                |                | o     |
| OCaml     | 1996     | o   | o   |          | o          | o              |                | o     |
| C#        | 2000     | △   | o   |          | o          | o              |                | o     |
| Cyclone   | 2006     | o   |     |          | o          | o              |                | △[^4] |
| **Rust**  | 2010     | o   | o   | o        | o          | o              | o              |       |
| Swift     | 2014     | △   | o   |          | o          | o              | o              | o[^5] |

各カラムの意味は次のとおりです。言語の特徴は主にWikipediaを参考にしていますが、正確な分類は困難なため多少の独断と偏見が含まれていることをご了承ください。

- 登場年代
    - プログラミングが登場した年代です。前後3年の誤差は見逃してください
- FP(関数型プログラミング)
    - 言語がFPを強くサポートしているかを示しています
    - 程々にサポートしている場合は△を示しています
- OOP（オブジェクト指向プログラミング）
    - 言語がOOPを強くサポートしているかを示しています
- 並行計算
    - アクターや CSP/π計算モデルの特徴を言語が強くサポートしているかを示しています
    - 外部ライブラリを使えばできるよ！みたいなものは除外します
- 静的型付け
    - 言語の最も主要な処理系が静的型付けをサポートしているかを示しています
- パタメータ多相
    - 言語がパラメータ多相をサポートしているかを示しています
    - ジェネリクス(Java)、テンプレート(C++)、let多相(ML系言語)等と呼ばれるものが含まれています
- アドホック多相
    - 言語がアドホック多相をサポートしているかを示しています
    - 型クラス(Haskell)、トレイト(Rust)、プロトコル(Swift)等と呼ばれるものが含まれています
    - 単純な多重定義（オーバーロード）は含まれていません
- GC(ガベージコレクション)
    - 言語の最も主要な処理系がガベージコレクションをサポートしているかを示しています

[^1]: Unicode Annexは言語ではないので除外しました。NIL, Hermesはすでに廃止された機能への影響だったので、これも除外しました。C言語は[Why Rust? - #Influences | Learning Rust](https://learning-rust.github.io/docs/a1.why_rust.html#Influences)に記載があったので追加しました。F#も入れるかどうか悩みましたが「Functional Programing」だけだと具体的に与えた機能が分かりづらいので入れませんでした。
[^2]: [Programming with Regions in the ML Kit](http://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.38.2530&rep=rep1&type=pdf)の発表年を基準にしています。
[^3]: ML Kitの実装にはリージョンベースのメモリ管理にGCを付けたものもあるので△にしています。([参考文献](http://mlton.org/Regions))
[^4]: GCの利用はオプションなので△にしています。具体的にはヒープリージョンにガベージコレクションを利用できます。
[^5]: SwiftではARC（Automatic Reference Counting / 自動参照カウント）が使われています。ARCをGCに分類するかは議論の余地がありますが、この記事ではARCの実行時オーバーヘッドの存在を考慮して「GC」として分類しています。

## 影響を受けた機能

ここからは影響を受けた機能をそれぞれ見ていきたいと思います。

### 代数的データ型(algebraic data types)

代数的データ型は関数型プログラミングをサポートする言語で多く利用されています。直積型の総和です。RustではEnumを用いることで代数的データ型を実現可能です。

{% code lang:rust rust %}
enum IpAddr {
    V4(u8, u8, u8, u8),
    V6(String),
}
{% endcode %}

上記はIPアドレス型を表現していますが、V4型はu8型の直積になっており、V4型とV6型の総和がIpAddr型になっています。

- 影響を受けた言語
    - SML, OCaml

### パターンマッチ(pattern matching)

パターンマッチはざっくり言うと、`if`や`switch`等の一般的な分岐構造の強化版です。Rustでは`match`でパターンマッチが利用可能です。

{% code lang:rust rust %}
let x = Some(2);
match x {
    Some(10) => println!("10"), // `Option`型を解体してマッチングしている
    Some(y) => println!("x = {:?}", y),
    _ => println!("error!"),
}
{% endcode %}

パターンマッチは上記のコードのようにデータ構造を分解してマッチングできるので、代数的データ型とも相性がよいです。

パターンマッチに関しては過去に「[全プログラマに捧ぐ！図解「パターンマッチ」](http://localhost:4000/cats-cats-cats/2019/04/30/understanding-pattern-matching/)」という記事も書いたのでよろしければそちらも参考にしてださい。

- Rust本
    - [パターンマッチング](https://doc.rust-jp.rs/book/second-edition/ch18-00-patterns.html)
- リファレンス
    - [Patterns - The Rust Reference](https://doc.rust-lang.org/reference/patterns.html)
- 影響を受けた言語
    - SML, OCaml

### 型推論(type inference)

静的型付けを持つ言語ではJavaやC#に採用されたこともあり、型推論が徐々に浸透してきています。Rustの型推論は**強力なHindley-Milner型推論をベース**としており、後方の式や文から手前の型が推論されることもあります。

{% code lang:rust rust %}
let mut x = HashMap::new(); // HashMapのキーと値の型は後方の式や文から推論される。便利！

x.insert(String::from("Key"), 10);
println!("{:?}", x);
{% endcode %}

上記の例ではHashMapのキーと値の型が後続のinsert関数の引数から推論されています。JavaやC#の型推論ではこれはできません。それはこれらの言語に導入された型推論はローカル変数の型推論であり、Rustの型推論とは異なっているからです。

- 影響を受けた言語
    - SML, OCaml

### セミコロンの文区切り(semicolon statement separation)

Rustの関数は主に「文」で構成され、一番最後は「文」か「式」で終わります。Rustの文と文の区切りはセミコロン「;」です。従って最後にセミコロンが付くか否かで文か式かを区別できます。

{% code lang:rust rust %}
fn test１() -> i32 {
    let mut x = 2; // 文
    x =  x * 3 ;   // 文
    x + 5          // 式（戻り値は11）
}

fn test2() -> () {
    let mut x = 2; // 文
    x =  x * 3 ;   // 文
    x + 5;         // 文（戻り値はユニット`()`）
}
{% endcode %}

Rustの面白いところは、全ての「式」の後にセミコロン「;」を付けるだけで「文」に変換できてしまうところです。そして文になると関数の最後に置かれた場合の戻り値はユニット`()`になります。上記のコードで説明すると一番最後の行にセミコロン(`;`)があるかないかで戻り値が変わります[^6]。つまりRustにおいては「文」も「値」を返す「式」の一種と考えることができます。また、`if`や`match`や`while`のような制御構造も値を返すのでRustは**式指向の言語**とも言われています。

影響を受けた言語であるOCamlでも同様にプログラムの構成要素の基本に「式」を置いて、セミコロンで区切るやり方になっています。

- 参考文献
    - [OCamlプログラムの構造 – OCaml](https://ocaml.org/learn/tutorials/structure_of_ocaml_programs.ja.html#)
- 影響を受けた言語
    - SML, OCaml

[^6]: 戻り値がユニット`()`との場合、関数のシグネチャから戻り値を省略できます。つまり`fn test2 -> () {...}`は`fn test2() {...}`と同義です。

### 参照(references)

参照は変数に`&`をつけることで生成でき、変数に「別名」を作ることができます。C言語のポインタに似た機能ですが、大きな違いは**nullポインタが存在しない**ことです。つまり必ず参照先があることが前提となります。参照先は参照外し演算子「`*`」を用いることで参照できます。可変(`mut`付き)の変数の場合は参照先の書き換えも可能です。

{% code lang:rust rust %}
let mut x = "hoge".to_string();
let y = &mut x;
println!("y = {}", *y); // hoge
*y = "mohe".to_string(); // `*y`を書き換えることでxも書き換わる
println!("x = {}", x); // mohe
{% endcode %}

この参照はC++の特徴的な機能と考えられており紛れもなくC++の影響と言えそうですが、大きな違いもあります。それはRustの「所有権とライフタイム」との紐づきであり、C++と異なりRustの参照が**ダングリング参照になることはありません**。

- 影響を受けた言語
    - C++

### RAII(Resource Acquisition Is Initialization)

RAIIは直訳では「リソースの確保は(変数の)初期化である」になります。しかしこの概念をより適切に理解するためには**「リソースの解放は変数の破棄である」**と捉えたほうが真に迫っていると思われます。一般的なリソースの代表例がメモリであり、この場合は変数が初期化されるとメモリが確保され、変数が破棄されるとメモリが解放されます。このRAIIという表現はRustでは表立って出て来ませんが、**「所有権」**という考え方の中に取り入れられています。

{% code lang:rust rust %}
{
    let x = 10;　// ここで変数xが初期化され、メモリも確保される。
    {
        let y = "hoge".to_string(); // ここで変数yが初期化され、メモリも確保される。

        // いろいろ処理する

    } // ここで変数yはスコープを抜けて破棄され、メモリも解放される

    // いろいろ処理する

} // ここで変数xはスコープを抜けて破棄され、メモリも解放される
{% endcode %}

上記のコードの例では変数の有効範囲は変数が初期化されてから、最も内側のスコープ（中括弧`{}`で囲まれた範囲）の最後までです。JavaやRubyのようなガーベージコレクション(GC)を持つ言語では変数が破棄された後も、ガベージコレクタがメモリを回収するまでメモリが解放されません[^7]。また上記のコードの例ではメモリをリソースとしましたが、メモリ以外でもファイルのオープン、クローズ等の「利用」と「返却」に結びつけても構いません。実際にRustの標準ライブラリの中にはRAIIを利用したものが多くあります。

- Rust By Example
    - [RAII](https://doc.rust-jp.rs/rust-by-example-ja/scope/raii.html)
- 影響を受けた言語
    - C++

[^7]: Javaでもプリミティブ型などはローカル変数として宣言された場合にはスタックに確保されておりRAIIの要件を満たしていますが、その他のオブジェクトはほとんどヒープに確保されてガーベージコレクションの対象になります。

### スマートポインタ(smart pointers)

スマートポインタは、ポインタの一種で単にメモリアドレスを指し示すだけではなく**付加的な機能**を備えたもののことを言います。Rustにおけるスマートポインタとは標準ライブラリの型で言えばStringやVec<T>のように、ヒープのメモリ確保と解放を**「スマート」**に行うものが第一に挙げられます。Rustではスマートポインタを見分けるポイントとして、**「Derefトレイト」**や**「Dropトレイト」**を実装しているかが挙げられます。

{% code lang:rust rust %}
{
    let a = String::from("hoge"); // 文字列"hoge"はヒープに確保される
    let b = vec![1, 2, 3]; // ベクタはヒープに確保される
    let c = Box::new(5); // i32型の整数はヒープに確保される
} // 変数a, b, cが破棄され、同時にヒープに確保されたメモリも解放される
{% endcode %}

- Rust本
    - [スマートポインタ](https://doc.rust-jp.rs/book/second-edition/ch15-00-smart-pointers.html)
- 影響を受けた言語
    - C++

### ムーブセマンティクス(move semantics)

ムーブセマンティクスとはざっくり言うと、値を変数にアサインしたり、関数を引数に値渡ししたりするときに**所有権の移動が行われること**を言います。

{% code lang:rust rust %}
let s1 = "Rust Life".to_string();
println!("{}", s1); // OK

let s2 = s1; // ムーブセマンティクス：所有権が`s1`から`s2`に移動している

println!("{}", s2); // OK
println!("{}", s1); // コンパイルエラー： 所有権は`s2`に移動しているので`s1`にアクセス不可
{% endcode %}

上記のコードでは`let s2 = s1;`がムーブセマンティクスになっています。Rustでは値の所有権は常にひとつに制限されているのでこのような動作になります。

- Rust本
    - [所有権とは？](https://doc.rust-jp.rs/book/second-edition/ch04-01-what-is-ownership.html)
- Rust By Example
    - [所有権とムーブ](https://doc.rust-jp.rs/rust-by-example-ja/scope/move.html)
- 影響を受けた言語
    - C++

### 単形化(monomorphization)

Rustのジェネリクスはコンパイル時にプログラム内で利用される具体的な型に展開されますが、これは「単形化」と呼ばれています。「単形化」によってコンパイル時に呼び出される関数が決定されるので**静的ディスパッチ**になり、抽象化に伴う実行時の呼び出しオーバーヘッドがありません。

影響を受けたC++では、単形化はテンプレートのインスタンス化、特殊化として知られています。

- 影響を受けた言語
    - C++

### メモリモデル(memory model)

メモリモデルが意味するものはいくつか挙げられますが、この文脈おけるメモリモデルは**マルチスレッド環境における共有メモリアクセスの一貫性**に関するものになります。一般的にマルチスレッドから安全に操作できるものとして**「アトミックな操作」**がありますが、これらを実現するためにメモリモデルが必要になってきます。詳細が知りたい方は以下のRustのドキュメントを参照してください。

- 標準ライブラリドキュメント
    - [std::sync::atomic](https://doc.rust-lang.org/std/sync/atomic/index.html)
    - [std::sync::atomic::Ordering](https://doc.rust-lang.org/std/sync/atomic/enum.Ordering.html)
- 影響を受けた言語
    - C++

### リージョンベースのメモリ管理(region based memory management)

リージョンベースのメモリ管理では、メモリを「リージョン」と呼ばれる領域に分割して、さらに型システムに関連付けてメモリ管理を行います。Rustにおいては参照のライフタイム管理に大きく関わっているものと思われます。

- 参考文献
    - [Region-Based Memory Management in Cyclone](https://www.cs.umd.edu/projects/cyclone/papers/cyclone-regions.pdf)
    - [Cyclone: Memory Management Via Regions](https://cyclone.thelanguage.org/wiki/Memory%20Management%20Via%20Regions/)
- 影響を受けた言語
    - ML Kit, Cyclone

### 型クラス(typeclasses)、型族(type families)

「型クラス」はHaskell由来の言葉でRustで対応する機能は**トレイト**になり、**型に共通する振る舞いを定義する**ときに用いられます。Javaのインタフェースに近いものがありますが、**型の定義時ではなく型の定義後に後付でトレイトを実装できる**ことが特徴です。

{% code lang:rust rust %}
trait Greeting { // トレイトの定義
    fn greet(&self) -> String;
}

fn print_greet<T: Greeting>(person: T) { // トレイト境界を用いた関数
    println!("{}!", person.greet());
}

struct Japanese { name: String, } 　　　　　　// `struct`用いたを型の定義
struct American { name: String, age: u32,}

impl Greeting for Japanese { // トレイトの実装
    fn greet(&self) -> String { "こんにちわ".to_string() }
}

impl Greeting for American {
    fn greet(&self) -> String { "Hello".to_string() }
}

impl Greeting for i32 { // 組み込み型にもトレイトを実装できる!
    fn greet(&self) -> String { self.to_string() }
}

fn main() {
    let person_a = Japanese {name: "Taro".to_string(),};
    let person_a = American {name: "Alex".to_string(), age: 20,};

    // printGreet関数はGreetingを実装した異なる型に対して呼び出し可能(アドホック多相)
    printGreet(person_a);
    printGreet(person_b);
    printGreet(123);
}
{% endcode %}

上記のコードで説明すると、`print_greet()`関数はトレイト`Greeting`を実装していれば呼べる関数になっています。そしてすでに`Japanese`という型が定義されていた場合、`Greeting`トレイトを実装(`impl Greeting for Japanese`)すれば、`print_greet()`関数で呼び出すことができます。面白いのは`i32`のような組み込み型にも後付でトレイトが実装できることです。この`print_greet()`関数のように、後付けで渡せる型を増やせる関数の性質を**アドホック多相性**と言ったりします。

「型族」は、ざっくり説明すると型を受け取って型を返す型関数を実現する機能です。Rustでは**「関連型」**と繋がりがあります。標準ライブラリの`Add`から定義と利用例を引用します。

{% code lang:rust rust %}
pub trait Add<Rhs = Self> {
    type Output; // 関連型
    fn add(self, rhs: Rhs) -> Self::Output;
}

struct Point {
    x: i32,
    y: i32,
}

impl Add for Point {
    type Output = Self; // 関連型

    fn add(self, other: Self) -> Self {
        Self {
            x: self.x + other.x,
            y: self.y + other.y,
        }
    }
}

assert_eq!(Point { x: 1, y: 0 } + Point { x: 2, y: 3 },
           Point { x: 3, y: 3 });
{% endcode %}

関連型は上記のコードのように、トレイトの中で`type`を使って宣言されます。ジェネリクスと似たようなこともできますがきちんと使いどころもあります。以下の参考文献に細かなシチュエーションが載っていたので興味がある方はご確認ください。

- 関連型の参考文献
    - [関連型が必要になる状況 - Rust By Example 日本語版](https://doc.rust-jp.rs/rust-by-example-ja/generics/assoc_items/the_problem.html)
    - [Rustの関連型の使いどころ | κeenのHappy Hacκing Blog](https://keens.github.io/blog/2016/11/22/rustnokanrenkatanotsukaidokoro/)
　
- 影響を受けた言語
    - Haskell

### チャネル(channels), 並列性(concurrency)

チャネルは非同期コミュニケーションのためのプリミティブです。**送信側と受信側がチャネルを通して非同期にデータの受け渡しをする**ことができます。以下のコードは[チャネル - Rust By Example 日本語版](https://doc.rust-jp.rs/rust-by-example-ja/std_misc/channels.html)からコード部分を引用したものです（コメントは独自のものに変更）。

{% code lang:rust rust %}
use std::sync::mpsc::{Sender, Receiver};
use std::sync::mpsc;
use std::thread;

static NTHREADS: i32 = 3;

fn main() {
    let (tx, rx): (Sender<i32>, Receiver<i32>) = mpsc::channel(); // チャネルの作成
    let mut children = Vec::new();

    for id in 0..NTHREADS {
        let thread_tx = tx.clone();

        let child = thread::spawn(move || { // スレッドの作成
            thread_tx.send(id).unwrap(); // チャネルを通してデータの送信
            println!("thread {} finished", id);
        });

        children.push(child);
    }

    let mut ids = Vec::with_capacity(NTHREADS as usize);
    for _ in 0..NTHREADS {
        ids.push(rx.recv()); // 子スレッドから送信されたデータを受信
    }

    for child in children {
        child.join().expect("oops! the child thread panicked");
    }

    println!("{:?}", ids);
}
{% endcode %}

上記のコードはチャネルを生成して子スレッドに渡して、子スレッドからチャネルを通してデータを送信して親スレッド受け取るコードになっています。

- 影響を受けた言語
    - Newsqueak, Alef, Limbo


### メッセージパッシング(message passing), スレッド失敗(thread failure)

調べきれなかったので割愛します。

- 影響を受けた言語
    - Erlang

### オプショナルバインディング

オプショナルバインディングはSwiftの機能で、その名の通りOptionalの値が存在する場合に変数を束縛してコードブロックを実行します。Rustの対応する機能は`if let`ですが、`Option`に限らず様々なパターンマッチか利用可能です。

{% code lang:rust rust %}
let num = Some(10);

if let Some(i) = num {
    println!("num =  {}", i);
}
{% endcode %}

- Rust本
    - [if letで簡潔な制御フロー](https://doc.rust-jp.rs/book/second-edition/ch06-03-if-let.html)
- 影響を受けた言語
    - Swift

### 衛生的マクロ(hygienic macros)

衛生的マクロとはマクロ内で導入される変数名と、マクロ呼び出し側の変数名が衝突しないことが保証されているマクロです。以下は簡単なRustのマクロのサンプルコードです。

{% code lang:rust rust %}
macro_rules! my_macro { // マクロ
    ($x:expr) => {
        {
            let a = 2;
            $x + a
        }
    };
}

fn main() {
    let a = 5;
    println!("{}", my_macro!(a)); // 7
}
{% endcode %}

Rustのマクロは衛生的なため、`my_macro!`マクロに変数`a`が渡されても内部のletで導入された変数`a`とは別物とし扱われます。これがC言語のマクロやLispマクロでは衝突する可能性があるため、意図的に衝突しない変数を選ぶ必要がありました。

- 影響を受けた言語
    - Scheme

### 属性(attributes)

属性は主に**宣言に対して付加される追加情報（メタデータ）**です。Rustでよく見かけるのは単体テストのマークとなる`#[test]`属性です。

{% code lang:rust rust %}
#[test] // 属性(テスト関数のマーキング)
fn test_hoge() {
    // test code
}

#[allow(dead_code)] // 属性(未使用関数の警告抑制)
fn foo() {}

#[derive(Debug, Clone, Copy, Default, Eq, Hash, Ord, PartialOrd, PartialEq)] // 属性(トレイトの自動実装)
struct Num(i32);
{% endcode %}

- リファレンス
    - [Attributes - The Rust Reference](https://doc.rust-lang.org/reference/attributes.html#attributes)
- Rust By Example
    - [アトリビュート](https://doc.rust-jp.rs/rust-by-example-ja/attribute.html)
- 影響を受けた言語
    - C#

### クロージャー記法（closure syntax）

これはRubyのブロック記法とRustのクロージャ記法を見比べて貰えば似ていることがおわかり頂けると思います。

{% code lang:ruby ruby %}
ia = [1,2,3]

ia.each {|e| puts e } # Rubyのブロック(`each`の引数)
{% endcode %}

{% code lang:rust rust %}
let ia = [1, 2, 3];

ia.iter().for_each(|e| println!("{}", e)); // Rustのクロージャ(`for_each`の引数)
{% endcode %}

- 影響を受けた言語
    - Ruby


## 影響の可視化

Rustに影響を与えた言語をマインドマップで可視化してみました。言語は年代順に時計回りでざっくり並べています。色はFP,OOP,並列計算,その他でざっくり分類しています。

{% img /gallery/daily/others/rust-influences.png  %}

## まとめ

Rustに影響を与えた言語についてざっくり表に分類して、さらに可視化してみました。また、影響を与えた個々の機能に関しても大まかに紹介しました。元ネタになったRustリファレンスの[Influences](https://doc.rust-lang.org/reference/influences.html)の記載は以下のとおりです。

- SML, OCaml: algebraic data types, pattern matching, type inference, semicolon statement separation
- C++: references, RAII, smart pointers, move semantics, monomorphization, memory model
- ML Kit, Cyclone: region based memory management
- Haskell (GHC): typeclasses, type families
- Newsqueak, Alef, Limbo: channels, concurrency
- Erlang: message passing, thread failure, ~~linked thread failure~~, ~~lightweight concurrency~~
- Swift: optional bindings
- Scheme: hygienic macros
- C#: attributes
- Ruby: closure syntax, ~~block syntax~~
- NIL, Hermes: ~~typestate~~
    - 削除された機能のみに紐づく言語なので本記事では扱わなかった
- Unicode Annex #31: identifier and pattern syntax
    - 言語ではないので本記事では扱わなかった

Rustは一見すると多くの先進的な機能が詰まっているように見えますが、その多くは**研究成果や実績のある言語を下敷きにしている**ことが分かります。そしてRustの特徴としてよく話題になる所有権システムや借用チェッカーもC++,ML Kit,Cyclone等の言語から影響が見て取れます。そして**ML KitやCycloneで成し遂げられなかった完全なGCとの決別をRustで実現できた**という流れも見えました。

自分も調べてみるまで、ここまで多くの機能が他の言語由来だとは思っていませんでした。影響を受けた言語の年代やパラダイムもバラエティに富んでおり、Rustを調べている内に**さながら言語の進化の歴史を学んでいる**ような感覚に陥りました。Rustはよく学習曲線が急峻だと言われますが、**影響を受けた様々な言語の集大成を一つの言語で学べる思えば非常に学びがいがあるお得な言語**だと言えるのではないでしょうか？

本記事がRustに興味がある方々の一助になれば幸いです。

## 参考文献

- [Influences - The Rust Reference](https://doc.rust-lang.org/reference/influences.html)
- [Why Rust? - #Influences | Learning Rust](https://learning-rust.github.io/docs/a1.why_rust.html#Influences)
- [C言語 - Wikipedia](https://ja.wikipedia.org/wiki/C%E8%A8%80%E8%AA%9E)
- [Scheme - Wikipedia](https://ja.wikipedia.org/wiki/Scheme)
- [C++ - Wikipedia](https://ja.wikipedia.org/wiki/C%2B%2B)
- [Newsqueak - Wikipedia](https://en.wikipedia.org/wiki/Newsqueak)
- [Erlang - Wikipedia](https://ja.wikipedia.org/wiki/Erlang)
- [Standard ML - Wikipedia](https://ja.wikipedia.org/wiki/Standard_ML)
- [Haskell - Wikipedia](https://ja.wikipedia.org/wiki/Haskell)
- [Alef (programming language) - Wikipedia](https://en.wikipedia.org/wiki/Alef_(programming_language))
- [Limbo - Wikipedia](https://ja.wikipedia.org/wiki/Limbo)
- [Ruby - Wikipedia](https://ja.wikipedia.org/wiki/Ruby)
- [OCaml - Wikipedia](https://ja.wikipedia.org/wiki/OCaml)
- [C Sharp - Wikipedia](https://ja.wikipedia.org/wiki/C_Sharp)
- [Cyclone (programming language) - Wikipedia](https://en.wikipedia.org/wiki/Cyclone_(programming_language))
- [Swift (プログラミング言語) - Wikipedia](https://ja.wikipedia.org/wiki/Swift_(%E3%83%97%E3%83%AD%E3%82%B0%E3%83%A9%E3%83%9F%E3%83%B3%E3%82%B0%E8%A8%80%E8%AA%9E))
- [Rust (プログラミング言語) - Wikipedia](https://ja.wikipedia.org/wiki/Rust_(%E3%83%97%E3%83%AD%E3%82%B0%E3%83%A9%E3%83%9F%E3%83%B3%E3%82%B0%E8%A8%80%E8%AA%9E))
- [Programming with Regions in the ML Kit](http://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.38.2530&rep=rep1&type=pdf)
- [Rustの型推論の概略 - 簡潔なQ](https://qnighy.hatenablog.com/entry/2017/06/05/070000)
- [メモリモデル (プログラミング) - Wikipedia](https://ja.wikipedia.org/wiki/%E3%83%A1%E3%83%A2%E3%83%AA%E3%83%A2%E3%83%87%E3%83%AB_(%E3%83%97%E3%83%AD%E3%82%B0%E3%83%A9%E3%83%9F%E3%83%B3%E3%82%B0))
- [Rustの `Arc` を読む(4): アトミック変数とメモリ順序 - Qiita](https://qiita.com/qnighy/items/b3b728adf5e4a3f1a841)
