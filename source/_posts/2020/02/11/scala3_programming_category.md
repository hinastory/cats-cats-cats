---
title: Scala3とプログラミングと圏論
thumbnail: /gallery/thumbnails/scala3_cats.png
categories:
  - Tech
  - Language
tags:
  - Scala
  - CategoryTheory
date: 2020-02-11 07:28:45
---
最近、{% elink 圏論とプログラミング https://speakerdeck.com/inamiy/category-theory-and-programming %}という素晴らしい資料を拝読しました。圏論とプログラミング愛に溢れる資料で読んでいて目頭が熱くなりました。そうだよな・・・プログラマにも圏論いるよな・・・

ただ、自分にとって残念だったのは、資料で説明用に選択されたプログラミング言語が**「Haskell」**だったことです。もちろんHaskellは素晴らしい言語です。ただ、自分にとってHaskellは外国語なのでちょっと理解が難しいのです。そしてこの資料が**「Scala」**で書かれていたらと夢想せずにはいられなかったのです。

Scalaと言えば昨年末にScala3のリサーチコンパイラのDottyがFeature Completeを宣言しました[^1]。この宣言で新機能の追加は終了して、あとは2020年末のリリースに向けてひたすら品質を上げていく段階に突入しました。つまり、ようやく次世代のScalaが全貌を表したということです。

ここである考えが脳裏を過りました。もしかしたら「圏論とプログラミング」に出てくるHaskellの記述を**「素のScala3」**で置き換えられるのではないかと。

本記事ではその疑問を検証してみたいと思います。

[^1]: 詳細は{% elink ここ https://dotty.epfl.ch/blog/2019/12/20/21th-dotty-milestone-release.html %}を参照してください。

<!-- more -->

## 目次
<!-- toc -->

## TL;DR
- {% elink 圏論とプログラミング https://speakerdeck.com/inamiy/category-theory-and-programming %}に記載されているHaskellの記述をScala3に書き換えてみた
  - Scala3(Dotty)は0.22.0-RC1を利用
  - 外部ライブラリは使わない
    - 標準言語機能と標準ライブラリとコンパイラオプションは利用してもよい
  - メタプログラミングは使わない
  - 書き換えたのは余米田の補題まで
    - それ以降はだれか挑戦してください・・・
- 結論
  - かなり自然に圏論の概念を記述できるようになった
  - 記述量的にはHaskellに大分近づいたがまだ若干差がある
    - 行数的にはかなり肉薄したが、Scalaは型記述が多いため文字数ではまだ差がある

## はじめに

本記事では「{% elink 圏論とプログラミング https://speakerdeck.com/inamiy/category-theory-and-programming %}」（以降、「元記事」と表記）に記述されているHaskellの記述をScala3(Dotty 0.22.0-RC1)で書き換える検証を行った結果を解説します。

本記事のHaskellのソースコードは基本的に元記事からの引用になります[^2]。Scala3のコードはなるべくHaskellのソースコードを忠実に再現するようにしていますが、言語の機能や慣習の違いにより様々な差異があることをご了承ください。

基本的には以下のルールで書き換えています。

- なるべくScala3の新機能[^3]を用いてスマートに書き換える
- 外部ライブラリは使わない[^4]
  - 標準言語機能と標準ライブラリのみ使って良い
  - コンパイラオプションは使って良い[^5]
- メタプログラミングは使わない
  - 本記事では「素のScala3」でどこまでできるかがテーマなので今回は用いないこととする
- Haskellで用いられている記号の演算子はScalaでは文字のメソッド名に変換する
- Haskellの型引数は小文字が用いられるが、Scalaでは大文字にする

[^2]: コンパイルを通すため、必要に応じて若干修正してある箇所もあります。
[^3]: 直接利用はしていませんが、{% elink Cats https://typelevel.org/cats/ %}はScala3で実装する上で少し参考にしています。
[^4]: ここで言う新機能とはScala2にはなく、Dotty 0.22.0-RC1に実装されている機能を指しています。まだScala3はリリースされていないので、ここで紹介した機能も変更されたり削除されたりする可能性があります。
[^5]: 元記事のHaskellのコードにもGHCの言語拡張が用いられているので、Scala3でもOKとしました。Scalaでは`-Ykind-projector`フラグを利用しています。

## Scala3で圏論の概念を実装してみる

それではいよいよScala3で実装してみます。以降のタイトルは元記事と対応しています。元記事の発表スライドメモを並べながら見るとわかりやすいと思います。

- {% elink 「圏論とプログラミング」発表スライドメモ - Qiita https://qiita.com/inamiy/items/9af1da1faec22cd968f0 %}

### 型クラスを使った圏の定義

まずは基本的な圏の定義です。行数はHaskellもScala3も3行に収まっていますが、文字数的にはHaskellのほうが少ないようです。

{% code lang:haskell haskell %}
class Category cat where
    id :: cat a a
    (.) :: cat b c -> cat a b -> cat a c
{% endcode %}

{% code lang:scala scala %}
trait Category[F[_, _]]
  def id[A]: F[A, A]
  def [A, B, C](x: F[B, C]).compose(y: F[A, B]): F[A, C]
{% endcode %}

Scala 3の解説をすると、まずこのインデント記法を初めて見る方は驚くかもしれません。Scala 3ではHaskellやPythonのようにインデントベースで書けるようになりました。もちろん括弧を用いた記法も可能です。詳細は以下を御覧ください。

- {% elink Optional Braces https://dotty.epfl.ch/docs/reference/other-new-features/indentation.html %}
- {% elink New Control Syntax https://dotty.epfl.ch/docs/reference/other-new-features/control-syntax.html %}

また以下の拡張メソッド記法も初見はGo言語っぽいなと思いました。以下のメソッドは`F[B,C]`型を拡張して`compose`メソッドを追加する構文です。

{% code lang:scala scala %}
def [A, B, C](x: F[B, C]).compose(y: F[A, B]): F[A, C]
{% endcode %}

拡張メソッドの詳細は以下を確認してください。

- {% elink Extension Methods https://dotty.epfl.ch/docs/reference/contextual/extension-methods.html %}

### 圏の例：クライスリ圏

次にクライスリ圏を定義ですが、その前にモナドを定義する必要があります。モナドの定義は[{% elink ここ https://speakerdeck.com/inamiy/number-cat4pg?slide=121 %}]から引用させて頂きました。

{% code lang:haskell haskell %}
class Functor f where
    fmap :: (a -> b) -> f a -> f b

class Functor f => Applicative f where
    pure :: a -> f a
    (<*>) :: f (a -> b) -> f a -> f b

class Applicative m => Monad m where
    (>>=) :: m a -> (a -> m b) -> m b

    return :: a -> m a
    return = pure
{% endcode %}

{% code lang:scala scala %}
trait Functor[F[_]]
  def [A, B](x: F[A]).map(y: A => B): F[B]

trait Applicative[F[_]] extends Functor[F]
  def [A, B](x: F[A => B]).ap(y: F[A]): F[B]
  def pure[A](f: A): F[A]

  def [A, B](x: F[A]).map(y: A => B): F[B] = ap(pure(y))(x)

trait Monad[F[_]] extends Applicative[F]
  def [A, B](x: F[A]).flatMap(y: A => F[B]): F[B]
{% endcode %}

Scalaの定義も大分スッキリしていると思います。Haskellの関数とScalaのメソッドの対応は以下のとおりです。

| Haskell | Scala |
| --- | --- |
|  fmap | map    |
|  <*> | ap    |
|  pure | pure    |
|  >>= | flatMap    |
|  return | pure    |

準備が整ったのでクライスリ圏の定義を比較してみます。

{% code lang:haskell haskell %}
newtype Kleisli m a b = Kleisli { runKleisli :: a ->  m b}
instance Monad m => Category (Kleisli m) where
    id :: Kleisli m a a
    id = Kleisli pure

    (.) :: Kleisli m b c -> Kleisli m a b -> Kleisli m a c
    f . g = Kleisli (\x -> runKleisli g x >>= runKleisli f)
{% endcode %}

{% code lang:scala scala %}
opaque type Kleisli[F[_], A, B] = A => F[B]
object Kleisli
  def apply[F[_], A, B](x: A => F[B]) = x

given kleisliCategory[F[_]](using m: Monad[F]) as Category[Kleisli[F, *, *]]
  def id[A] = Kleisli(m.pure(_))

  def [A, B, C](x: Kleisli[F, B, C]).compose(y: Kleisli[F, A, B]) =
    Kleisli[F, A, C](k => y(k).flatMap(x))
{% endcode %}

Scala3では新しく「不透明型エイリアス(Opaque Type Alias)」を用いています。これはHaskellのnewtypeに対応するもので、単一の型のゼロコスト抽象化を提供します。詳細は以下を確認してください。

- {% elink Opaque Type Aliases https://dotty.epfl.ch/docs/reference/other-new-features/opaques.html %}

またScala3では型クラスのインスタンスを定義するために`given`、`using`、`as`という構文が追加されています。これらは従来の`implicit`構文をわかりやすくしたものです。詳細は以下を確認してください。

- {% elink Given Instances https://dotty.epfl.ch/docs/reference/contextual/givens.html %}
- {% elink Using Clauses https://dotty.epfl.ch/docs/reference/contextual/using-clauses.html %}
- {% elink Implementing Typeclasses https://dotty.epfl.ch/docs/reference/contextual/typeclasses.html %}

あと、型の部分適用を簡単にするためにKind projector syntax supportを有効にしています。利用した箇所は「`Kleisli[F, *, *]`」の部分です。詳細は以下を確認してください。

- {% elink Kind projector syntax support https://dotty.epfl.ch/blog/2020/02/05/22nd-dotty-milestone-release.html#kind-projector-syntax-support %}

### 圏の例：レンズ圏

次はレンズ圏の定義です。次はレンズ圏の定義です。定義だけ見ると相当ややこしい感じがします・・・

{% code lang:haskell haskell %}
data Lens a b = Lens (a -> b) (a -> b -> a)

instance Category Lens where
    id :: Lens a a
    id = Lens Prelude.id (const Prelude.id)

    (.) :: Lens b c -> Lens a b -> Lens a c
    Lens g1 s1 . Lens g2 s2 = Lens (g1 Prelude.. g2) s3
        where
            s3 a c = s2 a (s1 (g2 a) c)
{% endcode %}

{% code lang:scala scala %}
trait Lens[A, B](val g: A => B, val s: A => B => A)
object Lens
  def apply[A, B](g: A => B, s: A => B => A) = new Lens(g, s){}

given Category[Lens]
  def id[A] = Lens(identity, Function.const(identity))

  def [A, B, C](x: Lens[B, C]).compose(y: Lens[A, B]) =
    val s3: A => C => A = a => c => y.s(a)(x.s(y.g(a))(c))
    Lens(x.g compose y.g, s3)
{% endcode %}

Scala3では新しくトレイトにパラメータを持てるようになったのでこれを利用しています。またLensを生成しやすくするためにコンパニオンオブジェクトにapplyメソッドを定義しています。Scala3のCreator Applicationsが利用できるかと思ったのですがトレイトには利用できないようです。詳細は以下を確認してください。

- {% elink Trait Parameters https://dotty.epfl.ch/docs/reference/other-new-features/trait-parameters.html %}
- {% elink Creator Applications https://dotty.epfl.ch/docs/reference/other-new-features/creator-applications.html %}

### 関手

ようやく関手まで来ました。ここの関手は圏論の関手です。関手の記述量もHaskellとScalaで大差はないと思います。

{% code lang:haskell haskell %}
class (Category c, Category d) => Functor' c d f where
    fmap' :: c a b -> d (f a) (f b)

instance Functor' (->) (->) Maybe where
    fmap' _ Nothing = Nothing
    fmap' f (Just a) = Just (f a)
{% endcode %}

{% code lang:scala scala %}
trait Functor_[C[_, _], D[_, _], F[_]](using Category[C], Category[D])
  def fmap[A, B](c: C[A, B]): D[F[A], F[B]]

given Functor_[Function1, Function1, Option]
  def fmap[A, B](f: A => B) = x => x match
    case None => None
    case Some(a) => Some(f(a))
{% endcode %}

一応Functorのgivenインスタンスの実装はHaskellに倣いましたが、以下のように`Option`の`map`に委譲もできます。

{% code lang:scala %}
given Functor_[Function1, Function1, Option]
  def fmap[A, B](c: A => B) = _.map(c)
{% endcode %}

### 自己関手（Endofunctor）

こちらがプログラミングでよく使われる「関手」です。ここでもHaskellをScalaの記述量は大差ないものになっています。

{% code lang:haskell haskell %}
class Functor f where
    fmap :: (a -> b) -> f a -> f b

instance Functor Maybe where
    fmap _ Nothing = Nothing
    fmap f (Just a) = Just (f a)
{% endcode %}

{% code lang:scala scala %}
trait Functor[F[_]]
  def [A, B](x: F[A]).map(y: A => B): F[B]

given Functor[Option]
  def [A, B](x: Option[A]).map(y: A => B) = x.map(y)
{% endcode %}

### 関手圏と自然変換

ついに関手圏と自然変換までやってきました。そしてここでHaskellとScalaに決定的な差がついてしまいました。

{% code lang:haskell haskell %}
newtype f :~> g = NT { unNT :: forall x. f x -> g x }

instance Category (:~>) where
    id :: a :~> a
    id = NT Prelude.id

    (.) :: (b :~> c) -> (a:~> b) -> (a :~> c)
    NT f . NT g = NT (f Prelude.. g)
{% endcode %}

{% code lang:scala scala %}
trait NT[F[_], G[_]]
  def apply[A](fa: F[A]): G[A]

trait Category2[K[F[_], G[_]]]
  def id[A[_]]: K[A, A]
  def [A[_], B[_], C[_]](x: K[B, C]).compose(y: K[A, B]): K[A, C]

given Category2[NT]
  def id[A[_]] = new NT { def apply[E](fa: A[E]) = fa }
  def [A[_], B[_], C[_]](x: NT[B, C]).compose(y: NT[A, B]) =
    new NT { def apply[X](fa: A[X]) = x(y(fa)) }
{% endcode %}

まず、Scala3にはHaskellのような`forall`がありません。つまり単純にunNTのような関数を定義することはできませんでした。また自然変換(NT)の型引数は2つなので、内部のメソッド(`apply`)に型引数を追加してunNTっぽい関数を実装しました。こうすることで`apply`の型引数`A`を外部に晒さずにすみます。

次の問題は自然変換を圏のインスタンスにしようとしたとき、圏(Category)と自然変換(NT)のカインドが異なることです。Categoryのインスタンスになれるのは2つの型引数を持つ1階の型コンストラクタですが、NTは2つの1階の型コンストラクタを引数に持つのでカインドが異なると怒られるのです。こういう場合のためにScala3で追加されたカインドポリモルフィズムが使えるのではと思ったのですが、残念ながら今回のケースでは利用できませんでした。

- {% elink Kind Polymorphism https://dotty.epfl.ch/docs/reference/other-new-features/kind-polymorphism.html %}

仕方がないので2つの型コンストラクタを引数にとる`Category2`を作成してNTをインスタンスにしてみました・・・

### 自然変換の例：多相関数

今まで自然変換が多相関数だと言われてもピンと来なかったのですがNTを使ってheadやlengthを実装してみることでようやく腹落ちしました。

まずはheadからです。元記事にはListの定義がなかったので追加しています。

{% code lang:haskell haskell %}
data List a = Nil' | Cons' a (List a)  -- 元記事になかったので追加

head' :: List :~> Maybe
head' = NT $ \case
    Nil'      -> Nothing
    Cons' a _ -> Just a
{% endcode %}

{% code lang:scala scala %}
def head: NT[List, Option] = new NT {
  def apply[X](fa: List[X]) = fa match
    case Nil => None
    case a :: _ => Some(a)
}
{% endcode %}

ScalaではListのメソッドの`headOption`を利用すれば以下のように簡潔に定義できます。

{% code lang:scala scala %}
def head2: NT[List, Option] =
  new NT { def apply[X](fa: List[X]) = fa.headOption }
{% endcode %}

次に`Length`メソッドです。注目すべきは`Const`です。片側を捨てる関手ですが、こういうときに役に立ちます。

{% code lang:haskell haskell %}
newtype Const a b = Const { getConst :: a } -- 元記事になかったので追加
length' :: List :~> Const Int
length' = NT $ \case
    Nil'       -> Const 0
    Cons' _ as -> Const $ 1 + getConst (unNT length' as)
{% endcode %}

{% code lang:scala scala %}
opaque type Const[A, B] = A
object Const
  def apply[A](x: A) = x

def length: NT[List, Const[Int, *]] = new NT {
  def apply[X](fa: List[X]) = fa match
    case Nil => Const(0)
    case _ :: as => Const(1 + length(as))
}
{% endcode %}

Scala3のコードにも大分なれて来たと思いますが、ここでもKind Projectorを利用してConstにIntを部分適用しています。

### 米田の補題

ようやく圏論の華もしくは到達点とも言える米田の補題までやってきました。この抽象度の高い概念の記述の際にもScala3はHaskellと同等の記述力を発揮します。

{% code lang:haskell haskell %}
newtype Yoneda f a =
    Yoneda { runYoneda :: forall b. (a -> b) -> f b}

instance Functor (Yoneda f) where
    fmap f m = Yoneda (\k -> runYoneda m (k . f))
{% endcode %}

{% code lang:scala scala %}
trait Yoneda[F[_], A]
  def apply[B](f: A => B): F[B]

given yonedaFunctor[F[_]] as Functor[Yoneda[F, *]]
  def [A, B](x: Yoneda[F, A]).map(f: A => B) = new Yoneda {
    def apply[C](k: B => C) = x(k compose f)
  }
{% endcode %}

次に`liftYoneda`と`lowerYoneda`です。これもほとんど遜色なく記述できています。

{% code lang:haskell haskell %}
liftYoneda :: Functor f => f a -> Yoneda f a
liftYoneda a = Yoneda (\f -> Main.fmap f a) -- 元記事になかったので追加

lowerYoneda :: Yoneda f a -> f a
lowerYoneda (Yoneda f) = f id -- 元記事になかったので追加
{% endcode %}

{% code lang:scala scala %}
def liftYoneda[F[_], A](fa: F[A])(using Functor[F]): Yoneda[F, A] = new Yoneda {
  def apply[B](f: A => B): F[B] = fa.map(f)
}

def lowerYoneda[F[_], A](y: Yoneda[F, A]): F[A] = y(identity)
{% endcode %}

### 余米田の補題(Coyoneda)

最後に余米田の補題です。ここまで来るとFreerモナドの夢を見る一歩手前です。

{% code lang:haskell haskell %}
data Coyoneda f a where
    Coyoneda :: (z -> a) -> f z -> Coyoneda f a

instance Functor (Coyoneda f) where
    fmap f (Coyoneda g v) = Coyoneda (f Prelude.. g) v
{% endcode %}

{% code lang:scala scala %}
enum Coyoneda[F[_], A]
  case New[F[_], A, Z](za: Z => A, fz: F[Z]) extends Coyoneda[F, A]

given coyonedaFunctor[F[_]] as Functor[Coyoneda[F, *]]
  def [A, B](x: Coyoneda[F, A]).map(f: A => B) = x match
    case Coyoneda.New(g, v) => Coyoneda.New(f compose g, v)
{% endcode %}

ここに来てScala3の新機能を利用しました。`enum`です。Haskellの方でGADTが登場したので満を持してここに`enum`を持ってきました。`enum`は代数的データ型を簡単に書ける機能です。詳細は以下を確認してください。

- {% elink Algebraic Data Types https://dotty.epfl.ch/docs/reference/enums/adts.html %}

最後に`liftCoyoneda`と`lowerCoyoneda`を比較して終わりです。最後は文字数的にも肉薄しています。

{% code lang:haskell haskell %}
liftCoyoneda :: f a -> Coyoneda f a
liftCoyoneda = Coyoneda Prelude.id  -- 元記事になかったので追加

lowerCoyoneda :: Functor f =>Coyoneda f a -> f a
lowerCoyoneda (Coyoneda f m) = Main.fmap f m  -- 元記事になかったので追加
{% endcode %}

{% code lang:scala scala %}
def liftCoyoneda[F[_], A](fa: F[A]) =
  Coyoneda.New(identity[A], fa)

def lowerCoyoneda[F[_]: Functor, A](x: Coyoneda[F, A]) = x match
  case Coyoneda.New(f, m) => m.map(f)
{% endcode %}

## Scala3とHaskellの比較

実際にどれだけのScalaとHaskellの記述量を比較してみました。Haskell側は記述量を揃えるために標準ライブラリで提供されているものも定義しました。

また、Hakellは8個ものGHC言語拡張を利用していました。これもそのままソースコードに記述して行数としてカウントすることにしました。一種のペナルティみたいなものです。

比較結果は以下のとおりです。行数ベースではかなり肉薄していると思います。ただScalaの方が型の記述が多くなるため文字数としてはHaskellが簡潔になります。

|言語|文字数（スペース込み）|文字数（スペース無視）|行数|
| -- |-- | -- | -- |
|Haskell|2786| 2076 |113|
|Scala|3334|2630|112|

以下に比較に用いたコンパイル可能なHaskellとScalaのコードを記載します。興味がある方は中を覗いてみてください。

{% details コンパイル可能なHaskellコード %}
{% code lang:haskell category_haskell.hs %}
{-# LANGUAGE InstanceSigs #-}
{-# LANGUAGE MultiParamTypeClasses #-}
{-# LANGUAGE ExistentialQuantification #-}
{-# LANGUAGE RankNTypes #-}
{-# LANGUAGE TypeOperators #-}
{-# LANGUAGE PolyKinds #-}
{-# LANGUAGE LambdaCase #-}
{-# LANGUAGE GADTs #-}

import Prelude hiding (Functor, Applicative, Monad, pure, (>>=))

class Category cat where
    id :: cat a a
    (.) :: cat b c -> cat a b -> cat a c

instance Category (->) where
    id :: (->) a a
    id a = a

    (.) :: (->) b c -> (->) a b -> (->) a c
    f . g = \x -> f (g x)

class Functor f where
    fmap :: (a -> b) -> f a -> f b

class Functor f => Applicative f where
    pure :: a -> f a
    (<*>) :: f (a -> b) -> f a -> f b

class Applicative m => Monad m where
    (>>=) :: m a -> (a -> m b) -> m b

    return :: a -> m a
    return = pure

newtype Kleisli m a b = Kleisli { runKleisli :: a ->  m b}
instance Monad m => Category (Kleisli m) where
    id :: Kleisli m a a
    id = Kleisli pure

    (.) :: Kleisli m b c -> Kleisli m a b -> Kleisli m a c
    f . g = Kleisli (\x -> runKleisli g x >>= runKleisli f)

data Lens a b = Lens (a -> b) (a -> b -> a)

instance Category Lens where
    id :: Lens a a
    id = Lens Prelude.id (const Prelude.id)

    (.) :: Lens b c -> Lens a b -> Lens a c
    Lens g1 s1 . Lens g2 s2 = Lens (g1 Prelude.. g2) s3
        where
            s3 a c = s2 a (s1 (g2 a) c)

class (Category c, Category d) => Functor' c d f where
    fmap' :: c a b -> d (f a) (f b)

instance Functor' (->) (->) Maybe where
    fmap' _ Nothing = Nothing
    fmap' f (Just a) = Just (f a)

instance Functor Maybe where
    fmap _ Nothing = Nothing
    fmap f (Just a) = Just (f a)

newtype f :~> g = NT { unNT :: forall x. f x -> g x }

instance Category (:~>) where
    id :: a :~> a
    id = NT Prelude.id

    (.) :: (b :~> c) -> (a:~> b) -> (a :~> c)
    NT f . NT g = NT (f Prelude.. g)

data List a = Nil' | Cons' a (List a)

head' :: List :~> Maybe
head' = NT $ \case
    Nil'      -> Nothing
    Cons' a _ -> Just a

newtype Const a b = Const { getConst :: a }
length' :: List :~> Const Int
length' = NT $ \case
    Nil'       -> Const 0
    Cons' _ as -> Const $ 1 + getConst (unNT length' as)

newtype Yoneda f a =
    Yoneda { runYoneda :: forall b. (a -> b) -> f b}

instance Functor (Yoneda f) where
    fmap f m = Yoneda (\k -> (runYoneda m) (k Prelude.. f))

liftYoneda :: Functor f => f a -> Yoneda f a
liftYoneda a = Yoneda (\f -> Main.fmap f a)

lowerYoneda :: Yoneda f a -> f a
lowerYoneda (Yoneda f) = f Prelude.id

data Coyoneda f a where
    Coyoneda :: (z -> a) -> f z -> Coyoneda f a

instance Functor (Coyoneda f) where
    fmap f (Coyoneda g v) = Coyoneda (f Prelude.. g) v

liftCoyoneda :: f a -> Coyoneda f a
liftCoyoneda = Coyoneda Prelude.id

lowerCoyoneda :: Functor f => Coyoneda f a -> f a
lowerCoyoneda (Coyoneda f m) = Main.fmap f m

main = do
    putStrLn "Hello Category Theory!"
{% endcode %}
{% enddetails %}

{% details コンパイル可能なScala3コード %}
{% code lang:scala category_scala.scala %}
object CategoryTheoryExampleDefs
  trait Category[F[_, _]]
    def id[A]: F[A, A]
    def [A, B, C](x: F[B, C]).compose(y: F[A, B]): F[A, C]

  given Category[Function1]
    def id[A] = x => x
    def [A, B, C](x: Function1[B, C]).compose(y: Function1[A, B]) = a =>x(y(a))

  trait Functor[F[_]]
    def [A, B](x: F[A]).map(y: A => B): F[B]

  trait Applicative[F[_]] extends Functor[F]
    def [A, B](x: F[A => B]).ap(y: F[A]): F[B]
    def pure[A](f: A): F[A]

    def [A, B](x: F[A]).map(y: A => B): F[B] = ap(pure(y))(x)

  trait Monad[F[_]] extends Applicative[F]
    def [A, B](x: F[A]).flatMap(y: A => F[B]): F[B]

  opaque type Kleisli[F[_], A, B] = A => F[B]
  object Kleisli
    def apply[F[_], A, B](x: A => F[B]) = x

  given kleisliCategory[F[_]](using m: Monad[F]) as Category[Kleisli[F, *, *]]
    def id[A] = Kleisli(m.pure(_))

    def [A, B, C](x: Kleisli[F, B, C]).compose(y: Kleisli[F, A, B]) =
      Kleisli[F, A, C](k => y(k).flatMap(x))

  trait Lens[A, B](val g: A => B, val s: A => B => A)
  object Lens
    def apply[A, B](g: A => B, s: A => B => A) = new Lens(g, s){}

  given Category[Lens]
    def id[A] = Lens(identity, Function.const(identity))

    def [A, B, C](x: Lens[B, C]).compose(y: Lens[A, B]) =
      val s3: A => C => A = a => c => y.s(a)(x.s(y.g(a))(c))
      Lens(x.g compose y.g, s3)

  trait Functor_[C[_, _], D[_, _], F[_]](using Category[C], Category[D])
    def fmap[A, B](c: C[A, B]): D[F[A], F[B]]

  given Functor_[Function1, Function1, Option]
    def fmap[A, B](f: A => B) = x => x match
      case None => None
      case Some(a) => Some(f(a))

  given Functor[Option]
    def [A, B](x: Option[A]).map(y: A => B) = x.map(y)

  trait NT[F[_], G[_]]
    def apply[A](fa: F[A]): G[A]

  trait Category2[K[F[_], G[_]]]
    def id[A[_]]: K[A, A]
    def [A[_], B[_], C[_]](x: K[B, C]).compose(y: K[A, B]): K[A, C]

  given Category2[NT]
    def id[A[_]] = new NT { def apply[E](fa: A[E]) = fa }
    def [A[_], B[_], C[_]](x: NT[B, C]).compose(y: NT[A, B]) =
      new NT { def apply[X](fa: A[X]) = x(y(fa)) }

  def head: NT[List, Option] = new NT {
    def apply[X](fa: List[X]) = fa match
      case Nil => None
      case a :: _ => Some(a)
  }

  opaque type Const[A, B] = A
  object Const
    def apply[A](x: A) = x

  def length: NT[List, Const[Int, *]] = new NT {
    def apply[X](fa: List[X]) = fa match
      case Nil => Const(0)
      case _ :: as => Const(1 + length(as))
  }

  trait Yoneda[F[_], A]
    def apply[B](f: A => B): F[B]

  given yonedaFunctor[F[_]] as Functor[Yoneda[F, *]]
    def [A, B](x: Yoneda[F, A]).map(f: A => B): Yoneda[F, B] = new Yoneda {
      def apply[C](k: B => C) = x(k compose f)
    }

  def liftYoneda[F[_], A](fa: F[A])(using Functor[F]): Yoneda[F, A] = new Yoneda {
    def apply[B](f: A => B): F[B] = fa.map(f)
  }

  def lowerYoneda[F[_], A](y: Yoneda[F, A]): F[A] = y(identity)

  enum Coyoneda[F[_], A]
    case New[F[_], A, Z](za: Z => A, fz: F[Z]) extends Coyoneda[F, A]

  given coyonedaFunctor[F[_]] as Functor[Coyoneda[F, *]]
    def [A, B](x: Coyoneda[F, A]).map(f: A => B) = x match
      case Coyoneda.New(g, v) => Coyoneda.New(f compose g, v)

  def liftCoyoneda[F[_], A](fa: F[A]) =
    Coyoneda.New(identity[A], fa)

  def lowerCoyoneda[F[_]: Functor, A](x: Coyoneda[F, A]) = x match
    case Coyoneda.New(f, m) => m.map(f)

@main def example: Unit =
   import CategoryTheoryExampleDefs.{_, given}
    println("Hello Category Theory")
{% endcode %}
{% enddetails %}

## HaskellとScala3の開発環境

HaskellとScala 3の開発環境にはVisual Studio Codeを使いました。どちらも文法エラーですぐに赤くなるし、マウスオーバーで型がすぐに分かるので非常に助かりました。Language Server Protocolは偉大です。環境構築は以下を参照しました。

- [vscode と haskell-ide-engine で Haskell 開発環境を構築する - Qiita](https://qiita.com/waddlaw/items/b83cd10311200095fe87)
- [IDE support for Dotty](https://dotty.epfl.ch/docs/usage/ide-support.html)

## まとめ

{% elink 圏論とプログラミング https://speakerdeck.com/inamiy/category-theory-and-programming %}に記載されているHaskellコードを以下の条件でScala3に書き換えてみました。

- Scala3(Dotty)は0.22.0-RC1を利用
  - 外部ライブラリは使わない
    - 標準言語機能と標準ライブラリとコンパイラオプションは利用してもよい
  - メタプログラミングは使わない
- 余米田の補題まで書き換えてみた
  - それ以降はだれか挑戦してください・・・

結論としては、Scala3でかなり自然に圏論の概念を記述できるようになったように感じました。記述量的にも大分Haskellに近づいたように思います。この一年近くはScala3の`implicit`周りの文法がめちゃくちゃ変わってどうなるか心配だったのですが、なんとなくいい感じの文法に仕上がってきたのではないかと思います（個人の感想です）。あとはラムダ関数がジェネリクスに対応してくれるとかなり嬉しいですね[^6]。

本記事がScala3と圏論に興味がある方の一助になれば幸いです。

[^6]: 実装が一部マージされているようです。👉{% elink [Proof of concept] Polymorphic function types by smarter · Pull Request #4672 · lampepfl/dotty https://github.com/lampepfl/dotty/pull/4672 %}

## おまけ

いつの間にか{% elink 圏論と学びをめぐる往復書簡 https://talk.hyuki.net/ %}というものが始まっていました。数学ガールの圏論版が出て欲しいなぁ・・・

## 参考文献

- {% elink 圏論とプログラミング  https://speakerdeck.com/inamiy/category-theory-and-programming %}
- {% elink 「圏論とプログラミング」発表スライドメモ - Qiita https://qiita.com/inamiy/items/9af1da1faec22cd968f0#comments %}
- {% elink プログラマのためのモナド(圏論) https://speakerdeck.com/inamiy/number-cat4pg %}
- {% elink Dotty Blog https://dotty.epfl.ch/blog/index.html %}
- {% elink Dotty Documentation https://dotty.epfl.ch/docs/index.html %}
- {% elink Cats: Home https://typelevel.org/cats/ %}
- {% elink Notes on Category Theory in Scala 3 (Dotty) | Typista.org https://typista.org/categories-in-dotty/ %}
- {% elink Scala3に入るかもしれないContextual Abstractionsを味見してみた(更新・追記あり) - Qiita https://qiita.com/hinastory/items/6dacb1f61d86f4a5d533 %}
- {% elink Scala 3、Pythonのようにインデントベースの構文で書けるようになるってよ！ - Qiita https://qiita.com/hinastory/items/abb68fe47755894b79ea %}