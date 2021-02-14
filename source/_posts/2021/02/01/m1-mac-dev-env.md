---
title: 絶対にRosetta 2を入れてはいけないM1 Mac開発環境構築 2021-2-1版
thumbnail: /gallery/thumbnails/pose_necchuu_computer_man.png
toc: true
categories:
  - Tech
  - Miscellaneous
tags:
  - Mac
  - Environment
  - M1
date: 2021-02-01 07:28:45
---
遅ればせながらM1 Macbook Airを購入したので開発環境を構築してみました。Rosetta 2が優秀だということは各所から聞こえてくるので今回は **Rosetta 2を入れずに** どこまでできるか検証してみました。検証したのは以下のアプリです。

```
Chrome, Slack, Zoom, VSCode, iTerm2, prezto, Rust, exa, bat, procs, hexyl,
fd, procs, ripgrep, tokei, Homebrew, Emacs, tmux, Java 11, anyenv, Ruby,
 Go, Node, Python, Jupyter Notebook, TensorFlow, RunCat, Docker
```

実際に上記でRosetta 2なしで動かなかったのは **たったひとつだけ** でした。以下、順番に検証結果を書いていきますが、何が動かなかったのかを予想しながら読むのも面白いかもしれません。結論から知りたい方は最後のまとめを読んでください。

<!-- more -->

{% alerts warn %}
この記事は2021年2月1日時点の経験をもとに書かれています。M1 Macの状況は日々改善されているので明日には古くなっている可能性があります。
{% endalerts %}

## Rosetta 2とは

Rosetta 2は従来のインテル用のアプリをApple Silicon Mac上で自動的に変換して実行できるようにする技術です。Rosetta 2は最初からMacにインストールされている訳ではなくて、 **インテルアプリを実行しようとしてRosetta 2が必要になった時点でインストールを求められます**。今回はこのインストールを徹底的に拒否して検証を進めます。

{% blogCard https://support.apple.com/ja-jp/HT211861 %}

## Macの設定あれこれ

いきなり話が脱線しますがMackbookを買って最初にやった設定をメモ書きします。

{% alerts info %}
興味のない方は開発環境構築の節まで飛ばしてください。
{% endalerts %}

### クリックとドラッグの設定

タップでクリックやドラッグがしたい人向けです。特にタップでドラッグは長めのドラッグに便利なので重宝します。以下の記事が参考になりました。

{% blogCard https://www.outoutput.com/mac-trackpad-tap-click-drag/ %}

### Caps LockをControlキーに変更

`A`キーの横はControlじゃないと落ち着かな人向けです。JIS配列の方はそのまま`A`の横が`Control`になっているので問題ないですが、US配列やUK配列の人はAの横がCaps Lockなのでこの設定が必要になってきます。ちなみに自分はUK配列を選びました。

キーの変更はシステム環境設定から `［キーボード］` を開き、 `キーボード`の`[修飾キー]` から変更できます。

### ControlキーをCommandキーに変更

Macでは`Command`キーを多用しますがスペースバーの真横にあるので`Command-C`や`Command-V`が微妙に打ちづらいです。そこで`Control`キーを`Command`キーに変更します。Windowsの経験がある方ならコピペで`Ctrl-C`,`Cntl-V`を多用するので違和感はないと思います。

同じくキーの変更はシステム環境設定から `［キーボード］` を開き、 `キーボード`の`[修飾キー]` から変更できます。

### コンピュータ名の変更

コンピュータ名とローカルホスト名は初期設定ではさすがにうまくないので、自分の好きな名前をつけます。

{% blogCard https://support.apple.com/ja-jp/guide/mac-help/mchlp2322/mac#:~:text=%E3%81%8A%E4%BD%BF%E3%81%84%E3%81%AE%E3%82%B3%E3%83%B3%E3%83%94%E3%83%A5%E3%83%BC%E3%82%BF%E3%81%AE,%E5%85%B1%E6%9C%89%E3%80%8D%E3%82%92%E3%82%AF%E3%83%AA%E3%83%83%E3%82%AF%E3%81%97%E3%81%BE%E3%81%99%E3%80%82&text=%E5%B7%A6%E4%B8%8B%E3%81%AE%E3%83%AD%E3%83%83%E3%82%AF%E3%81%8C%E3%83%AD%E3%83%83%E3%82%AF,%E5%90%8D%E5%89%8D%E3%82%92%E5%85%A5%E5%8A%9B%E3%81%97%E3%81%BE%E3%81%99%E3%80%82 %}

### 表示名(フルネーム)とアバターの変更

アカウントロックされたときに大きく表示されるので、差し障りのない名前に変えておきます。またアバターもお気に入りの画像に差し替えておきましょう。以下の記事を参考にさせて頂きました。

{% blogCard https://tipstour.net/mac-change-username %}

### キーボード入力の調整

Google日本語入力はまだM1対応していないようです。デフォルトの日本語変換で気になったのはエンターキーを2回押さないと確定にならなかったことです。この現象は以下で解決しました。

システム環境設定の `[キーボード]` から　`[入力ソース]` のタブを選んで、 `[Windows風のキー操作]` にチェック

また同じパネルに `[ライブ変換]` の項目もありますが、ライブ変換が必要ないならここのチェックを外します。


![](https://storage.googleapis.com/zenn-user-upload/azkouwxrc7nghttgrawix8hyaaxk)

### 不要なサウンドを出さないようにする

Macbookを外で使うことを考えたらなるべく不要な音を鳴らさないように配慮しておきたいものです。そういう場合はシステム環境設定の `[サウンド]` の「起動時にサウンドを鳴らす」と「ユーザインターフェースのサウンドエフェクトを再生」のチェックを外しておきます。

![](https://storage.googleapis.com/zenn-user-upload/ankj2uit4rzw0f3ao5nfru7j03jl)

ここまでの設定でMacbookとして最低限、不快なく使えるようになりました。

## 開発環境構築

さて、ここからが本題の開発環境構築になります。

### Chromeのインストール

まずはブラウザからです。一般的なのはIntel版らしいですが、無視してAppleプロセッサ搭載のMacを選択してダウンロードしてインストールします。特に問題なく使えました。

![](https://storage.googleapis.com/zenn-user-upload/ofb40q7fjm7vu9e5bi5iahx2b5uz)

{% blogCard https://www.google.co.jp/chrome/?brand=BOKX&gclid=Cj0KCQiAx9mABhD0ARIsAEfpavSvmXNAKq8Mkp3KytpOYap9MtbzEjr3vIDiVQOeMDwG7ZR5WIsWWqcaAhmNEALw_wcB&gclsrc=aw.ds %}

### Slackのインストール

Mac版SlackにもすでにApple Silicon版が用意されていたのでダウンロードしてインストールします。こちらも問題なく使えました。

![](https://storage.googleapis.com/zenn-user-upload/92s4hqvez4c7cdqkyd7w7rtndizl)

{% blogCard https://slack.com/intl/ja-jp/downloads/mac %}

### Zoomのインストール

Zoomも専用のバイナリが用意されていたので問題なくインストールできました。

![](https://storage.googleapis.com/zenn-user-upload/6zfduh940pub9n15u3ge87qr4pva)

{% blogCard https://zoom.us/download %}

### Visual Studio Code

Visual Studio Codeはちょっと注意が必要です。以下のリンクからダウンロードできるものはIntel Mac版になります。

{% blogCard https://code.visualstudio.com/download %}

実行しようとすると、以下のようにRosetta 2のインストールを促されるので強い意志をもって拒絶します。具体的には `[今はしない]` ボタンを押して **無粋なダイアログを黙らせます。**

![](https://storage.googleapis.com/zenn-user-upload/jacfgqvlph11k48l0suy4gaj4f3o)

正しくは以下のInsidersチャネルからダウンロードしたものをインストールします。

{% blogCard https://code.visualstudio.com/insiders/ %}

InsidersからダウンロードしてインストールしたVSCodeのアイコンは緑がかっていて通常の青いアイコンと区別されています。

![](https://storage.googleapis.com/zenn-user-upload/gfa4if0uhnruz6hjg23lt2r5e5er)

VSCodeもインストールさえ終われば普通に使えます。ただ拡張機能の中には対応していないものがある可能性があります。

### iTerm2

次はターミナルエミュレータです。Macのデフォルトのターミナルだといろいろと物足りないのでiTerm2を使うことにしました。iTerm2はApple Siliconに対応していたので特に問題なく使うことができました。

{% blogCard https://iterm2.com/ %}

iTerm2ではプロファイルを自分好みに設定できます。
私はターミナルを透過させる設定にしています。あと全画面表示にして全てのスペースで表示できる設定にしています。具体的には以下の赤枠で囲った設定です。

![](https://storage.googleapis.com/zenn-user-upload/e0qiecm8rtwat1e5tsm4e9o7rgul)

あとは **HotKeyでターミナルが立ち上がるようにしています。これは非常に便利で一度慣れてしまうと離れられません。** 私は HotKeyに `Shift+Enter` を設定しています。

![](https://storage.googleapis.com/zenn-user-upload/nykkaouzyp70wh9gjq8komvplt24)

設定が終わったら、さっそくHotKeyでターミナルを立ち上げて `uname -a`でシステムを確認してみます。 最後の `arm64` がApple Siliconの証です。

```zsh
$ uname -a
Darwin rusty.local 20.2.0 Darwin Kernel Version 20.2.0: Wed Dec  2 20:40:21 PST 2020; root:xnu-7195.60.75~1/RELEASE_ARM64_T8101 arm64
```

### preztoのインストールと設定

ターミナルの環境が整ったので次にシェルの環境を改善します。といってもMacでは前バージョンのMacOS Catalinaからzshがデフォルトなので、 **シェルに関して言えば最強** です。しかし、何も設定しないとzshの持ち腐れになってしまうので、お手軽に最低限の設定でzshの恩恵に預かれるようにします。具体的には以下のpreztoをインストールします。

{% blogCard https://github.com/sorin-ionescu/prezto %}

インストールは簡単で以下を順に実行するだけです。

```zsh
git clone --recursive https://github.com/sorin-ionescu/prezto.git "${ZDOTDIR:-$HOME}/.zprezto"

// 既存の設定ファイルを退避(必要な場合)
$ mkdir zsh_orig && mv zshmv .zlogin .zlogout .zprofile .zshenv .zshrc zsh_orig

etopt EXTENDED_GLOB
for rcfile in "${ZDOTDIR:-$HOME}"/.zprezto/runcoms/^README.md(.N); do
  ln -s "$rcfile" "${ZDOTDIR:-$HOME}/.${rcfile:t}"
done
```

preztoの設定は.zpreztorcで行います。syntax-highlightingとautosuggestionsは必須としてあとはお好みです。テーマも自由に選べますが私は`pure`がシンプルで使いやすいので気に入ってます。

```diff
diff --git a/runcoms/zpreztorc b/runcoms/zpreztorc
index 28b6005..7ff7a97 100644
--- a/runcoms/zpreztorc
+++ b/runcoms/zpreztorc
@@ -31,10 +31,14 @@ zstyle ':prezto:load' pmodule \
   'terminal' \
   'editor' \
   'history' \
+  'history-substring-search' \
   'directory' \
   'spectrum' \
   'utility' \
   'completion' \
+  'syntax-highlighting' \
+  'autosuggestions' \
+  'tmux' \
   'prompt'

 #
@@ -113,7 +117,7 @@ zstyle ':prezto:module:editor' key-bindings 'emacs'
 # Set the prompt theme to load.
 # Setting it to 'random' loads a random theme.
 # Auto set to 'off' on dumb terminals.
-zstyle ':prezto:module:prompt' theme 'sorin'
+zstyle ':prezto:module:prompt' theme 'pure'
```

### XCodeのインストール

ここからビルドを伴うプロセスが増えてくるのでまずはXCodeのコマンドラインツールをインストールしておきます。
ターミナルで以下のコマンドを実行してインストールします。

```
xcode-select --install
```

### Rustのインストール

次にRustをインストールします。Rustは私が最近入れ込んでいる言語なので最初にインストールしておきます。Rust 1.49.0からビルド保証のTier 2へと格上げされています。

{% blogCard https://blog.rust-lang.org/2020/12/31/Rust-1.49.0.html %}

従って、以下の[公式の手順](https://www.rust-lang.org/tools/install)で問題なくArm版Rustがインストールできました。

```
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
echo ‘export PATH="$HOME/.cargo/bin:$PATH"’ >> ~/.zshrc
```

RustをVSCode上で使うのに欠かせない[rust-analyzer](https://github.com/rust-analyzer/rust-analyzer)もすでにApple Silicon対応を済ませていました。VSCodeの拡張でインストールしたものが問題なく使えます。

### Rustで作られた便利ツールのインストール

正直に白状するとRustを早めに入れたのはRustで作られた便利ツールをビルドしたかったからです。以下のコマンドで一気に導入できます。

```
cargo install exa bat procs hexyl fd-find ripgrep tokei
```

少々時間がかかるのでコーヒーを飲みながらまったりしました。ここでIntel Macだとファンが唸りを上げて回転を始めて結構熱を発生するのですが、M1 Macbook Airはファンレスなので静かで熱もほとんど上がりませんでした。

導入したコマンドは以下のエイリアスを `.zshrc` に書き込んでおくことで便利に使えます。結構大胆にエイリアスしていますが、個人の趣味で使うマシンなので問題はありません。共用マシンとかでこれをやると怒られが発生するので止めておいたほうが無難です😅

```zsh:.zshrc
alias ls='exa'
alias cat='bat'
alias ps='procs'
alias grep='rg'
alias find='fd'
alias od='hexyl'
alias wc='tokei'
```

どのコマンドも便利で気に入っているのですが、開発でとくに役に立つのが、ソースコードの行数を数えてくれる `tokei` です。例えばカレントディレクトリのソースコードを数えたければ `tokei .`で簡単に数えられます。

```
$ tokei .
===============================================================================
 Language            Files        Lines         Code     Comments       Blanks
===============================================================================
 GraphQL                 2          115          105            0           10
 HTML                    1           29           28            1            0
 JavaScript             11          989          837           61           91
 JSON                   35         2894         2845            0           49
 Markdown                4           96            0           69           27
 Ruby                   20          950          734           31          185
 Sass                    2           24           22            0            2
 TOML                   10          257          238            2           17
 TypeScript             38         4047         3553           44          450
 YAML                    5          930          608           61          261
-------------------------------------------------------------------------------
 Rust                   26         3951         3576           25          350
 |- Markdown             3           12            0           12            0
 (Total)                           3963         3576           37          350
-------------------------------------------------------------------------------
 Vue                    23          739          695            0           44
 |- CSS                  6           24           23            0            1
 |- HTML                23          849          833           12            4
 |- JavaScript          20         1688         1619            3           66
 (Total)                           3300         3170           15          115
===============================================================================
 Total                 177        15021        13241          294         1486
===============================================================================
```

### Homebrewのインストール

次にMacではおなじみのパッケージマネージャのHomebrewをインストールしていきます。MacPortsを押す声もあるようですが、2021/2/1現在ではHomebrewのArm対応パッケージも増えてきたのでHomebrew一本でも問題ない感じです。[公式のインストール手順](https://docs.brew.sh/Installation)では `/opt/homebrew` にインストールするようになっているので、それに倣います。

```zsh
$ cd /opt
$ sudo mkdir homebrew
$ sudo chown $USER:admin homebrew
$ curl -L https://github.com/Homebrew/brew/tarball/master | tar xz --strip 1 -C homebrew
```

Homebrewでインストールしたいパッケージはいろいろありますが、今回はとりあえず以下の3つを入れました。`emacs`はエディタの好み次第ですが、tmuxはターミナルのセッションやウインドウ管理に非常に便利なので入れておいて損はないと思います。

```
brew install coreutils emacs tmux
```

### Java11のインストール

次にJavaのLTSの最新であるJava11をインストールします。Zuluが対応版を出していてGUIインストーラからインストールする記事は見かけたことがあるのですが、そろそろHomebrewでもOpenJDKをさくっとインストールできないかなと思ってやってみたところ以下のコマンドでさっくり入りました。

```zsh
brew install java11
echo ‘export PATH="/opt/homebrew/opt/openjdk@11/bin:$PATH"’ >> ~/.zshrc
```

JavaのVersionを確認してみます。

```
$ java --version
openjdk 11.0.9 2020-10-20
OpenJDK Runtime Environment (build 11.0.9+11)
OpenJDK 64-Bit Server VM (build 11.0.9+11, mixed mode)
```

分かりづらかったのでちゃんとArm版が入っているかどうか `file` コマンドで念の為確認します。

```
$ file /opt/homebrew/opt/openjdk@11/libexec/openjdk.jdk/Contents/Home/bin/java
/opt/homebrew/opt/openjdk@11/libexec/openjdk.jdk/Contents/Home/bin/java: Mach-O 64-bit executable arm64
```

問題なくArm版がインストールされている模様です。

### anyenvのインストール

さて、ここからプログラミング言語を一気にインストールしていきます。こういう場合に心強いのが[anyenv](https://github.com/anyenv/anyenv)です。anyenvを使えば言語をバージョン毎にインストールして管理できるので重宝しています。

以下を順番に実行することでインストールできました。
```zsh
$ git clone https://github.com/anyenv/anyenv ~/.anyenv
$ echo ‘export PATH=“HOME/.anyenv/bin:PATH”’ >> ~/.zshrc
$ ~/.anyenv/bin/anyenv init
$ exec $SHELL -l
$ anyenv install --init
```

インストールが終わったらどんな言語がインストール可能なのか `anyenv install -l` で確認します(コメントは私が付加)。メジャーな言語はだいたい揃ってる感じです[^1]。

```zsh
$ anyenv install -l
  Renv # R言語
  crenv # Crystal
  denv # D言語
  erlenv # Erlang
  exenv # Elixir
  goenv # Go言語
  hsenv # Haskell
  jenv # Java
  jlenv # Julia
  luaenv # lua
  nodenv # node
  phpenv # PHP
  plenv # Perl
  pyenv # Python
  rbenv # Ruby
  sbtenv # SBT(Scala)
  scalaenv # scala
  swiftenv # swift
  tfenv # Terraform
```

ここまで書き終えて、 `jenv`の存在に気づきました。 `jenv`でもJavaが入れられたかどうかは検証していません。

[^1]: sbtenvとtfenvはちょっと異彩を放っていますが・・・

### 各種言語のインストール

ここからは言語個別に見ていきます。今回インストールするのはRuby,Go,Node,Scala,Pythonです。といってもenv系のツールなのでどれもインストール方法は同じです。

#### Ruby

まずはRubyです。昨年のクリスマスにめでたく3.0がリリースされたのでインストールしてみます。以下のコマンドで問題なくインストールできました。 `irb`も問題なく動きます。ちなみに`exec $SHELL -l`はシェルを再起動するときのおまじないで覚えておくと重宝します。

```zsh
$ anyenv install rbenv
$ exec $SHELL -l
$ rbenv install 3.0.0
$ rbenv global 3.0.0
$ exec $SHELL -l
```

#### Go

Goはまだ安定版がリリースされていなくて `1.16beta1` を入れました。こちらも `go run`でHello worldを出力するプログラムを実行して問題ありませんでした。

```zsh
$ anyenv install goenv
$ exec $SHELL -l
$ goenv install 1.16beta1
$ goenv global 1.16beta1
$ exec $SHELL -l
```

#### Node

Nodeは開発系が対応されていると聞いたので `15.7.0`を入れてみました。REPLも問題なく動作しました。

```zsh
$ anyenv install nodenv
$ exec $SHELL -l
$ nodenv install 15.7.0
$ nodenv global 15.7.0
$ exec $SHELL -l
```

#### Scala3

Scalaは今年Scala3が出るので、最新版のM3を入れてみました。Javaが入っていたので特に問題なく動作しました。

```zsh
$ anyenv install scalaenv
$ exec $SHELL -l
$ scalaenv install 3.0.0-M3
$ scalaenv global 3.0.0-M3
$ exec $SHELL -l
```

### 機械学習環境

Pythonだけ少し縛りがキツくて機械学習環境の構築も目指します。ちなみにMacに標準で搭載されているPythonはまだ2系でした。

```zsh
& python --version
Python 2.7.16
```

いろいろと調べてみると `miniforge`なら機械学習環境を一気に導入できそうだということで試してみました。

```zsh
$ anyenv install pyenv
$ exec $SHELL -l
$ pyenv install miniforge3-4.9.2
$ pyenv global miniforge3-4.9.2
$ exec $SHELL -l
```

ここまで来るとPythonの環境が構築できたので`conda`コマンドを使ってTensorFlowやJupyter Notebookを導入します。

```zsh
$ conda create -n python3
$ conda install -n python3 tensorflow-addons -c isuruf/label/tf -c conda-forge
$ conda install -n python3 -c conda-forge notebook
$ pyenv global miniforge3-4.9.2/envs/python3
$ exec $SHELL -l
```

最後にJupyter Notebookを起動します。

```
$ mkdir jupyter
$ cd jupyter
$ jupyter notebook .
```

せっかくなので手書き数字の分類タスクで有名なMNISTをTensorFlowでディープラーニングしてみました。他と比較していないのでこの結果が早いか遅いかどうかは分かりません。。。

![](https://storage.googleapis.com/zenn-user-upload/qhst7cc5gtykeji39tr3ft2wjujb)

ちなみに、JupyterLabのパッケージも探したのですがまだconda-forgeにはなさそうでした。

### Docker

最後にDockerです。Dockerはプレビュー版でM1 Mac対応されたと聞いていたので問題なくインストールできるものだと思っていました。M1対応のDockerは以下からダウンロードでき、インストールも問題なく終わりました。

{% blogCard https://docs.docker.com/docker-for-mac/apple-m1/ %}

ただ、 **起動しません・・・**
**bad CPU type in executable: docker** というエラーが出て怒られます。

よく上記のリンクの「Known issues」を見ると以下の文言が存在しました。M1 Macに対応したといっても **ネイティブ対応ではなくてRosetta 2ありき** なんですね・・・

> You must install Rosetta 2 as some binaries are still Darwin/AMD64.

### RunCat

最後に失敗で終わると **縁起が悪い** ので、RunCatをApp Storeからインストールして本当に終わりにします。

![](https://storage.googleapis.com/zenn-user-upload/zqcqczx38bxtrgo289110r7uj75z)

かわいい猫をメニューバーで飼えて **幸せ** です🥰

![](https://storage.googleapis.com/zenn-user-upload/gsduwx405rgoxx8frz5dpd0024ab)

## まとめ

Rosetta 2をインストールしない開発環境構築を最初から紹介しました。結構苦戦するのではないかと思いましたが、 **意外とそれなりの開発環境を手軽に構築できる** ことが分かりました。

Dockerは残念でしたが、 **Rosetta 2をインストールすれば問題なく動きそう** なので、開発環境としてM1 Macはもう使えそうだというのが本記事を書いて得られた感触です。

ちなみにここまでの作業をずっと **6時間ほどかけて調べながら喫茶店で行っていたのですが、Macbook Airのバッテリーは半分も減らなかった** です。本当にM1は凄いとしかいいようがありません[^2]。

本記事がM1 Macの開発環境の構築に興味を持っている方の一助になれば幸いです。

[^2]: 初代MacBook Airも持っていましたが隔世の感があります・・・
