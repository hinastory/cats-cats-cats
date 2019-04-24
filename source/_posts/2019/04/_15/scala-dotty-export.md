---
title: Scala3(仮)が目指す理想のプログラミング世界
thumbnail: /gallery/thumbnails/dotty-logo.png
categories:
  - [Tech,Language]
tags:
  - Scala
  - Dotty
date: 2019-04-15 12:49:20
---

Scala3(仮)[^1]から、`new`

値とオブジェクトの区別はコンパイラや低レイヤーのライブラリの作者にとっては重要だけど、一般的な

長年連れ添ってきた`new`が追い出されるそうです。代わりに`import`の双子の兄にあたる`export`が暖かく迎え入れられたそうです。


Scala3のリサーチコンパイラである{% elink Dotty http://dotty.epfl.ch/ %}にImplicitsに代わる「Contextual Abstractions」と呼ばれる一連の機能が実装されていたので一部を味見してみました。

<!-- more -->

## 目次
<!-- toc -->

## TL;DR

- この記事はDottyに実装された「Export」、「Creator Applications」、「IArray」を味見してみたものです
  - 利用したDottyのバージョンは2019年2月時点で最新の0.14.0-RC-1です。Dottyの開発は非常に活発なので異なるバージョンでは本記事の内容とは異なる場合があります
-  
- 「Contextual Abstractions」は従来のImplicitsで初学者が躓きそうな機能を整理して使いやすくしています
  - 「Contextual Abstractions」には従来のImplicitsでは実現できなかった機能(暗黙のインポート、型クラス導出、コンテキストクエリ等)も含まれています
- 「Contextual Abstractions」の機能はまだ提案段階でありScala3の正式な仕様に決定したわけではありません
  - 今後機能が変化したり、機能が採用されなかったりする可能性も十分あります
- 「Contextual Abstractions」がScala3に正式採用された場合、古いImplicitsは段階的に廃止される予定です
  - 「Contextual Abstractions」への移行はScalafixでサポートされる予定です


[Preparing for Scala 3](https://www.slideshare.net/Odersky/preparing-for-scala-3)
[Scala Times](https://scalatimes.com/)
[Scala Contributors](https://contributors.scala-lang.org/?_ga=2.55239339.1847548381.1526683360-1532996012.1526683181)
[Dotty Blog](http://dotty.epfl.ch/blog/index.html)