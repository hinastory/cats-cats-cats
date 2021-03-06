---
title: ベン図を使って、インタプリタとコンパイラの違いを説明してみる
thumbnail: /gallery/thumbnails/venn.png
toc: true
categories:
  - Tech
  - ComputerScience
tags:
  - Compiler
  - Interpreter
date: 2019-09-23 07:28:45
---
長年インタプリタとコンパイラの違いの説明に苦慮してきました。その原因には言語と処理系を混同してしまったために起こる誤解や、処理系の内部と外部から見た差異に起因するものや、歴史的な背景によるものなど様々なものが含まれています。そのためインタプリタとコンパイラの定義を簡単に述べることは難しく、誤解が誤解を生む構造が出来上がっているものと考えられます。そこで本記事ではその状況を少しでも改善すべく、ベン図を使ってインタプリタとコンパイラの違いを説明してみたいと思います。

(本記事は「{% elink 数式言語を使って、インタプリタとコンパイラの違いを説明してみる - Qiita https://qiita.com/kmizu/items/e8ff0d75c358cc7a6658 %}」に触発されて書かれたものです。)

<!-- more -->

## 前提知識

まずは「`インタプリタ`」と「`コンパイラ`」をざっくり説明します。これらはプログラミング言語の「`処理系`」に紐付いた概念であり、簡単に言えばプログラミング言語の実装方式の違いになります。インタプリタは対象となるプログラミング言語を「`解釈`」して「`実行`」します。ここで言う解釈とはプログラミング言語の意味論に基づいて実行方法を決めることです。コンパイラはインタプリタとは異なり「`実行`」を伴わず、対象となる言語を別の言語に変換だけを行います。どのプログラミング言語も基本的には「インタプリタ」としても「コンパイラ」としても実装することができます[^1]。

これだけ書くと簡単で明確な定義のように思えますが、実際には上記は**「広義」**の定義であり、現実を踏まえた分類にはもう少し工夫が必要になります。

[^1]: 本記事ではノイマン型コンピュータで実行可能なプログラミング言語を想定しています。量子コンピューティングを考え出すとややこしくなるので本記事では触れません。

## ベン図による説明

最初に図で説明しようとしたときにどのように表現しようか非常に悩みましたが、最終的には以下のようなベン図になりました。

{% img /gallery/daily/others/interpreter-compiler.png  %}

なるべくわかりやすく書いたつもりですが、意図が読み取りにくい箇所もあると思うので簡単に説明したいと思います。

## コンパイラ

まず、広義のコンパイラは単に異なるプログラミング言語の変換を意味しますが、一般的なコンパイラのイメージはCやJavaのコンパイラのように高級言語から低レベル言語(機械語もしくは機械語に近いバイトコード)への変換を行うものです。従ってこのイメージを「`狭義のコンパイラ`」の定義としています。

次に「`トランスレータ`」は同レベルのプログラミング言語に変換する処理系です。「同レベル」というのが曖昧ですが、区分としては機械語、バイトコード、それ以外の高水準言語の3つだけを考えれば大体あっています。アセンブラはアセンブリ言語(ニーモニック)を機械語に変換しますが、これはほぼ一対一の同じレベルの変換なのでトランスレータとみなすことができます[^2]。パーサはこの図ではプログラミング言語を抽象構文木(AST)に変換する処理のことを指していますが、ASTをある種の形式言語と見なせばパーサもトランスレータに分類することができると考えています[^3]。AltJS(TypeScript, CoffeeScript, Dart, PureScript, Elm, Scala.js, Opal・・・)の処理系もトランスレータの一種で「`トランスパイラ`」と呼ばれることも多いです。これらの処理系は変換先の言語がJavaScriptに固定されているためJavaScriptの代替言語(AltJSの由来)となっています。

[^2]: 概念的にそのように分類できるというだけで、実際にアセンブラを「トランスレータ」や「コンパイラ」と呼称することはありません。
[^3]: 抽象構文木への変換は元のプログラミング言語の意味論を変更しないので、コンパイラよりもトランスレータに近いと感じましたが一般的な解釈とまでは言えません。

## インタプリタ

インタプリタは元々は初期のBASIC言語の処理系のように、言語を直接解釈して実行していました。従ってこのイメージのインタプリタを「`狭義のインタプリタ`」としています。現代の高級言語でこの方式で実装されている処理系はほとんどありません。なぜなら現代の高級言語では人間が扱いやすいように様々な「工夫」がされており、コンピュータが直接実行するのに向いていないからです。逆に高級言語ではなくJavaのバイトコードのような低レベル言語の言語処理系(JVM)は「バイトコードインタプリタ」とも呼ばれており、「狭義のインタプリタ」に当てはまります。

現代の高級言語の処理系をインタプリタとして実装しようと思った場合、ほぼ間違いなく`間接解釈のインタプリタ`を実装することになると思います。「間接解釈」のインタプリタとは元のソースコードを抽象構文木(AST)やバイトコード等の実行しやすい中間表現に一旦変換して実行する方式です。PythonやRubyやJavaScript等のいわゆる軽量プログラミング言語(Lightwight Language/LL)の代表的な処理系はこれに該当します。すでにお気づきの方もいると思いますが、「中間表現」への変換には潜在的にコンパイラ相当の処理がインタプリタに実装されていることを意味します。それがベン図で広義のインタプリタや間接解釈の円がコンパイラと重なっている理由です。特に最近のインタプリタ処理系では「中間表現」に最適化の研究が進んでいるバイトコード形式が採用されることが多く、コンパイラ用に開発された技術をフルに活かして開発されています。

## 視点、視座、視野による見え方の違い

コンパイラ、インタプリタという区分は実は視点、視座、視野等のコンテキストが変われば見え方が変わります。例えば最近のRuby処理系(C言語で書かれたRubyVM)で説明すると、Ruby言語のユーザ視点からはCRuby処理系はインタプリタとして認識されます。それはCRuby処理系がRuby言語を解釈して実行しているように見えるからです。しかしCRuby処理系の内部に視点を移すと見える景色が変わってきます。CRuby処理系の中ではまず、Ruby言語を抽象構文木(AST)に変換する処理が行われており、そこからCRuby処理系独自のバイトコードに変換されます。その後CRuby処理系独自のバイトコードインタプリタが動作して生成されたバイトコードを実行します。このように内部から詳細に見れば`Ruby言語をASTに変換する「トランスレータ」`と`ASTをCRuby処理系のバイトコードに変換する「狭義のコンパイラ」`と`CRuby処理系のバイトコードを実行する「狭義のインタプリタ」`が動作していることがわかります。さらにバイトコードインタプリタの内部に視点を移すと、そこでは`JITコンパイラ`が動作していることも分かります[^4]。今度は視野を広げてみるとRuby言語にはJVM上で動作するJRubyという処理系もあります。JRubyには`事前コンパイラ`(Ahead-Of-Timeコンパイラ)が搭載されており、Rubyスクリプトを事前にJavaのバイトコードに「`コンパイル`」しておくこともできます。

Javaの例も挙げておくと、Java 9からJshellが導入されており、これはいわゆるREPL(Read-Eval-Print Loop)なので、ユーザ視点からはインタプリタの処理系として見ることができます。またJava 11からjavaファイルを即時実行できるようになっているので、これは正しくインタプリタの挙動であり、今までRubyのような軽量プログラミング言語が得意としてきた実行方式です。

このように現在はプログラミング言語およびその処理系は大きく進化し複雑化、多様化しています。その結果インタプリタやコンパイラが入れ子になっていたり、多段構成になったり、複数の処理系をもっていたりするので、どのコンテキストから「コンパイラ」や「インタプリタ」を見ているかが非常に重要になってきます。つまり自分の視点からはインタプリタに見えていたものが他の視点からは別の見え方になることもあるので、話題に出す場合にはコンテキストに十分注意を払ったほうが良いと思われます。

[^4]: Ruby 2.6からオプションでJITコンパイラ(Experimental)が利用できるようになっています。

## まとめ

本記事ではインタプリタとコンパイラの違いをベン図を使って説明してみました。まとめは以下のとおりです。

- 「インタプリタ」と「コンパイラ」とは言語処理系の実装方式のことであり、プログラミング言語とは紐付いていない
  - プログラミング言語の処理系は基本的にインタプリタとしてもコンパイラとしても実装できる
- インタプリタは対象となるプログラミング言語を「`解釈`」して「`実行`」する
- コンパイラはインタプリタとは異なり「`実行`」は伴わず、対象となる言語を別の言語に変換することだけを行う
- インタプリタとコンパイラには歴史的な経緯により狭義と広義の定義が存在する
  - ベン図参照
- 現代のプログラミング言語およびその処理系は大きく進化し、複雑化、多様化した結果、コンパイラとインタプリタが非常に複雑に絡み合っている
  - コンテキストが違うと見え方が異なるので話題に出す際には十分注意すること

またベン図は現代的なインタプリタとコンパイラを合理的かつ直感的に理解しやすいように整理しつつ、歴史的解釈も尊重して書いて見ました。円の重なりにも工夫をしていて上位層は下位層を含む場合があることを表現しています。

本記事が皆様のインタプリタおよびコンパイラのよりよい理解および、新たな気付きの一助になれば幸いです。

## 参考文献

- {% elink 数式言語を使って、インタプリタとコンパイラの違いを説明してみる - Qiita https://qiita.com/kmizu/items/e8ff0d75c358cc7a6658 %}
- {% elink インタプリタ - Wikipedia https://ja.wikipedia.org/wiki/%E3%82%A4%E3%83%B3%E3%82%BF%E3%83%97%E3%83%AA%E3%82%BF %}
- {% elink コンパイラ - Wikipedia https://ja.wikipedia.org/wiki/%E3%82%B3%E3%83%B3%E3%83%91%E3%82%A4%E3%83%A9 %}
- {% elink トランスコンパイラ - Wikipedia https://ja.wikipedia.org/wiki/%E3%83%88%E3%83%A9%E3%83%B3%E3%82%B9%E3%82%B3%E3%83%B3%E3%83%91%E3%82%A4%E3%83%A9 %}
- {% elink Ruby 2.6.0 Released https://www.ruby-lang.org/ja/news/2018/12/25/ruby-2-6-0-released/ %}