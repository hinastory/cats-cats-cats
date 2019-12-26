---
title: 🎉🎉祝Ruby2.7リリース🎉🎉 クリスマスなのでRubyの22年に渡るコミットの歴史を可視化してみた
thumbnail: /gallery/thumbnails/header-ruby-logo@2x.png
categories:
  - Tech
  - Language
tags:
  - Ruby
  - Jupyter
  - AdventCalendar
date: 2019-12-25 07:28:45
---
この記事は{% elink Ruby Advent Calendar 2019 https://qiita.com/advent-calendar/2019/ruby %}の25日目の記事です。

本日はクリスマスということで、例年ならRubyの新バージョンがリリースされる日になります。
新バージョンのRuby 2.7は{% elink RC2 https://www.ruby-lang.org/ja/news/2019/12/21/ruby-2-7-0-rc2-released/ %}までやってきたので、リリースに向けて着実に進んでいるようです。
🎉🎉 そして無事に本日リリースされました!! おめでとうございます!!! 🎉🎉
~~(本記事投稿時点ではまだリリースはされていません。)~~

そこでRuby2.7のリリースのお祝いとコミッターのみなさんのハードワークに感謝の気持ちを込めて、Rubyの22年に渡るコミットの歴史を可視化してみたいと思います。

<!-- more -->


## 目次
<!-- toc -->

## はじめに

一番最初の動機はコミッターのみなさんが日々どれだけのコミットを積み重ねているのかを過去から遡って見てみたいというものでした。しかしRubyの誕生は1993年と言われており、27年の開発の歴史の中で関わっているコミッターの数は200人を超えるので単純な棒グラフや線グラフでは可視化が破綻するのは目に見えていました。

そこで「{% elink Flourish https://flourish.studio/ %}」というサービスを使い、時間軸を加えた棒グラフのアニメーションを利用することで、常にトップ20のコミッターの様子を捉えられるようにします。

{% img /gallery/events/advent-calendar-2019/ruby-commit-visualization-first.png %}
 
完成イメージは上記のようになります。上の画像を2019年までアニメーションさせるための作業を行うことが本記事の趣旨になります。また、せっかくなのでなるべくRubyを使ってこの作業を行ってみたいと思います。

それでは行ってみましょう。

## コミットログを収集する

何はともあれ、コミットログを収集しないと可視化ができません。そこでRubyのリポジトリを取得することから始めたいと思います。

### Rubyのリポジトリを取得する

まずはGitHubの{% elink Rubyリポジトリ https://github.com/ruby/ruby/ %}クローンしてきます。

{% code lang:bash %}
git clone https://github.com/ruby/ruby.git
{% endcode %}

ただし、上記のリポジトリのページにはタイトルに以下のように`[mirror]`と付いています。

> The Ruby Programming Language [mirror]

これはどういうことかというと、実はRubyは正式なRubyのGitリポジトリはGitHubとは別のGitリポジトリで管理されています。また、それ以前にRubyの開発は2019年4月22日までSVNリポジトリで管理されており、一部のブランチはまだそちらで開発が続いているという事実もあります[^1]。

その辺の経緯は「{% elink 令和時代のRubyコア開発 https://k0kubun.hatenablog.com/entry/ruby-core-2019 %}」に書いてありました。歴史の長いプロダクトはバージョン管理システムを変えるのに大きな労力を伴うという一例だと思います。

話は逸れますが{% elink このURL https://github.com/ruby/ruby-commit-hook/blob/master/config/email.yml  %}にメールアドレスが載っていないと2020年1月1日以降{% elink pushができなくなる http://blade.nagaokaut.ac.jp/cgi-bin/scat.rb/ruby/ruby-dev/50890  %}みたいなのでコミッタの方はお気を付けください。

[^1]: 詳細は{% elink Rubyリポジトリガイド https://www.ruby-lang.org/ja/documentation/repository-guide/ %}を参照してください。

### Rubyのリポジトリを覗いてみる

リポジトリのクローン後にやることと言えば、一番最初のコミットと一番最後のコミットを見ることだと思います。まずは最後のコミットを`git log`コマンドで見てみます。

{% code %}
commit 16fddfe352828d26aaa6cdbce696e62de04511ce (HEAD -> master, origin/trunk, origin/master, origin/HEAD)
Author: Marcus Stollsteimer <sto.mar@web.de>
Date:   Mon Dec 23 15:02:59 2019 +0100

    [DOC] Improve readability of requirements for <=>
{% endcode %}

最後のコミットは12/23に行われています。次に一番最初のコミットを見てみます。`git log`コマンドに`--reverse`オプションをつけることで先頭からコミットを見ることができます。

{% code lang:bash %}
git log --reverse
{% endcode %}

一番最初のコミットは1998/1/16に行われたようです。ログに`by cvs2svn`とあるのでバージョン管理システムをCVSからSubversionに移行するために`cvs2svn`コマンドを用いたようです。

{% code %}
commit 392296c12de9d7f9be03a8205250ba0844cb9d38
Author: (no author) <(no author)@b2dd03c8-39d4-4d8f-98ff-823fe69b080e>
Date:   Fri Jan 16 12:13:05 1998 +0000

    New repository initialized by cvs2svn.

    git-svn-id: svn+ssh://ci.ruby-lang.org/ruby/trunk@1 b2dd03c8-39d4-4d8f-98ff-823fe69b080e

commit 3db12e8b236ac8f88db8eb4690d10e4a3b8dbcd4 (tag: v1_0_r2)
Author: matz <matz@b2dd03c8-39d4-4d8f-98ff-823fe69b080e>
Date:   Fri Jan 16 12:13:05 1998 +0000

    Initial revision


    git-svn-id: svn+ssh://ci.ruby-lang.org/ruby/trunk@2 b2dd03c8-39d4-4d8f-98ff-823fe69b080e
{% endcode %}

また、コミットログに`git-svn-id`が残っているので、このリポジトリはSubversion時代に`git-svn`コマンドを用いてGitHubと同期されていたことも分かります。このへんの経緯をまとめたものがないかなとネットを検索したら{% elink るびま0052号 https://magazine.rubyist.net/articles/0052/0052-ForeWord.html %}に書かれていました。Gitに移行した現在の状況も加味すると以下のようになります。

|  年代   | バージョン管理システム   |
| --- | --- |
| 1993〜1998/1 | RCS/tarボール? |
| 1998/1〜2006/12 | CVS |
| 2006/12 〜 2019/4 | Suvbversion |
| 2019/4 〜 現在 | Git |

コミットログに残っているのはCVSで管理された1998年以降なので、可視化できるのはこの約22年間分のコミットになります。残念ながらRuby誕生から約5年間の歴史は可視化できないことをご了承ください。


### 作者別にコミット数をカウントしてみる

次に年単位で作者別にコミット数をカウントしてみます。原理上はコミットログさえあればコミットの日付とコミットの作者とコミット数が分かるので、最初はコミットログを自力でパースしてカウントしようと思っていましたが、`git shortlog`という便利なコマンドがあることに気づきました。
以下のコマンドで1998年から2019年までの作者別のコミット数を見ることができます。

{% code lang:bash %}
git shortlog -sne --no-merges --since='1998-01-01' --until='2019-12-31'
{% endcode %}

オプションは以下のとおりです。

| オプション | 説明  |
| --- | --- |
| `-n`  | 作者ごとのコミット数でソート |
| `-s` | コミット数の概要のみ表示
| `-e` | Eメールアドレスを表示
| `--no-merges` | マージコミットを除外
| `−−since` | 開始日時
| `--until` | 終了日時

トップ10は以下のとおりです。１位はご覧の通りnobuさんで圧巻の1万6千コミット。2位にトリプルスコア以上の差をつけて圧倒的な戦闘力を誇っています。

{% code %}
 16566	nobu <nobu@b2dd03c8-39d4-4d8f-98ff-823fe69b080e>
  4746	akr <akr@b2dd03c8-39d4-4d8f-98ff-823fe69b080e>
  4338	svn <svn@b2dd03c8-39d4-4d8f-98ff-823fe69b080e>
  2728	naruse <naruse@b2dd03c8-39d4-4d8f-98ff-823fe69b080e>
  2562	matz <matz@b2dd03c8-39d4-4d8f-98ff-823fe69b080e>
  2357	ko1 <ko1@b2dd03c8-39d4-4d8f-98ff-823fe69b080e>
  2050	usa <usa@b2dd03c8-39d4-4d8f-98ff-823fe69b080e>
  1414	eban <eban@b2dd03c8-39d4-4d8f-98ff-823fe69b080e>
  1176	Nobuyoshi Nakada <nobu@ruby-lang.org>
  1168	kazu <kazu@b2dd03c8-39d4-4d8f-98ff-823fe69b080e>
{% endcode %}

ただ上記のコミット数の表示には大きな問題があります。分かる人には分かると思うのですが、実は1位のnobuさんと9位のNobuyoshi Nakadaさんは同一人物です。これは作者名やEメールアドレスが異なると異なるものとしてカウントされてしまうためです。

この問題を解決するためには名寄せといって同一人物と思われるコミットを集約しないといけません。実は`git shortlog`には`.mailmap`という集約の仕組みがあるのですが、これを利用するためにはそもそも同一人物のEメールアドレスがどれかという情報を持っている必要があります。

今回はどのEメールアドレスが同一人物かを推測するところから始めるので`.mailmap`の仕組みは利用せずRubyを用いて集約を頑張ってみたいと思います。

### 年単位でコミット数をカウントしてみる

前節で1998年から2019年までのコミット数を集計しましたが、年単位で可視化を行いためスクリプトで年ごとのコミット数のログを作成します。作成するログは２種類あって1998年からの累積のコミット数を年単位で集計する`total`ログと各年のコミット数を集計する`trend`ログです。
以下のRubyスクリプトでは1998年から2019年までループで`system`関数で`git shortlog`を呼び出してリダイレクトで各年ごとのコミット数のログファイルを作成しています。

{% code lang:ruby %}
(1998..2019).each do |e|
    system("git shortlog -sne --no-merges --since='#{e}-01-01' --until='#{e}-12-31' > trend/#{e}.log")
    system("git shortlog -sne --no-merges --since='1998-01-01' --until='#{e}-12-31' > total/#{e}.log")
end
{% endcode %}

totalログを見れば総合的に活躍したコミッターの変化を可視化でき、trendログを可視化すればその年に活躍したコミッターを可視化することができます。

## データの前処理のための基盤を整える

さて、年単位のコミット数を取得してログに出力したので次に行うべきは、データの可視化を行う{% elink Flourish https://flourish.studio/ %}が読み込めるデータ形式にログを変換することです。このような処理は一般的に**「前処理」**と呼ばれます。前述のリポジトリからログを抽出する処理と前処理とデータ登録の作業を合わせて**ETL(Extract/Transrom/Load)処理**と呼ばれることも多いです。

前処理のツールとして最もよく利用されているのはExcelだと思われます。データサイエンティストの方ならJupyter NotebookとPythonの組み合わせが多いかもしれません。その他にも専用のETLツールは数多く存在します。しかし今回はなるべくRubyを使って作業を行うという趣旨なので、**JupyterLab**(Jupyter Notebookの後継)とRubyを利用して前処理を行ってみたいと思います。

### 環境構築方法を選択する

`JupyterLab`とRubyの環境を構築するには以下のような様々な方法があります。どれも一長一短ありますが、今回はDockerを使って構築してみます。

1. ローカルに環境を構築する
  - Anacondaを使って手っ取り早く構築できる
  - ローカル環境が汚れる
2. VM上に環境を構築する
  - Anacondaを使って手っ取り早く構築できる
  - ローカル環境は汚れないがOSインストールからなので手間がかかる
3. コンテナを使って環境を構築する
  - 既存のコンテナイメージをベースに手っ取り早く構築できる
  - Docker環境の構築とDockerfileの準備が必要
4. クラウド上のマネージド・サービスを利用する
  - クラウド上のノートブックを使って気軽に始められる
  - 環境の自由度が低い

### Dockerfileの準備

以下が作成したDockerfileです。ベースにしたコンテナイメージは「{% elink 14言語をぶち込んだJupyter LabのDockerイメージを作ってみた https://qiita.com/HeRo/items/61e7f45a5dbb5fd0e4a7 %}」で公開されていたベースイメージを元にRubyだけを残して、JupyterLabの設定や拡張を入れたり、必要なRubyGemsを入れたものになります。

Dockerfileのポイントは「install Ruby」のコメントで始まる一連の処理になります。ここでRubyを{% elink ruby-build https://github.com/rbenv/ruby-build %}でビルドして、JupyterLabからRubyを選択して起動できるようにRubyカーネルをgemでインストールしています。

{% code lang:dockerfile %}
FROM hero/jupyter-langs:python

RUN apt-get update && apt-get install -y curl vim

RUN conda install -c conda-forge nodejs

# install Ruby
ENV RUBY_VERSION=2.6.5 \
    RUBY_HOME=/opt/ruby
RUN git clone https://github.com/rbenv/ruby-build.git \
    && PREFIX=/usr/local ./ruby-build/install.sh \
    && mkdir -p ${RUBY_HOME} \
    && ruby-build ${RUBY_VERSION} ${RUBY_HOME}/${RUBY_VERSION}
ENV PATH=${RUBY_HOME}/${RUBY_VERSION}/bin:$PATH
RUN gem install --no-document \
                benchmark_driver \
                cztop \
                iruby \
    && iruby register --force

# copy JupyterLab Settings
RUN mkdir -p /root/.jupyter/lab/user-settings
COPY user-settings/ /root/.jupyter/lab/user-settings/

# install favorite jupyter lab extensions
RUN jupyter labextension install @lckr/jupyterlab_variableinspector
RUN jupyter labextension install @jupyterlab/toc
RUN jupyter labextension install @jupyterlab/git
RUN pip install jupyterlab-git
RUN jupyter serverextension enable --py jupyterlab_git
RUN jupyter labextension install jupyterlab-drawio

# for JupyterLab Terminal
ENV SHELL /bin/bash
RUN echo "alias ls='ls --color=auto'" >> /root/.bashrc
RUN echo "export PATH=/root/anaconda3/bin:$PATH" >> /root/.bashrc
RUN echo "export PS1='\u:\W# '" >> /root/.bashrc

# install favorite gems
RUN gem install nokogiri
RUN gem install daru
RUN gem install daru-view
RUN gem install --pre pycall
RUN gem install --pre matplotlib
RUN gem install numpy
RUN gem install pandas
{% endcode %}

見ての通りRubyは2.6.5を利用しています。2.7.0-rc2も試してみたのですが、うまく動作しなかったので断念しました。DockerファイルはGitHubにpushしてあるのでご利用ください。

[![hinastory/jupyterlab-ruby - GitHub](https://gh-card.dev/repos/hinastory/jupyterlab-ruby.svg?fullname)](https://github.com/hinastory/jupyterlab-ruby)

### JupyterLabの起動画面

以下が実際の起動画面になります。テーマは自分の趣味でダークにしてあります。

{% img /gallery/events/advent-calendar-2019/jupyterlab.png %}

## JupyterLabとRubyでデータの前処理を行ってみる

基本的には{% elink PyCall https://github.com/mrkn/pycall.rb %}とpandasを用いて作業します。PyCallやRubyからPythonを呼び出せるライブラリで、{% elink pandas https://pandas.pydata.org/ %}はPythonで主にデータフレームを扱うためのライブラリです。

データフレームを用いるとExcelのように表形式のデータが扱いやすくなります。

### Rubyコミッタの名寄せを行ってみる

ここからの作業はノートブックを用いて作業しますが、ノートブックを直接表示はできないので抜粋して説明します。

まずは、ライブラリを読み込みます。またPyCallのよく使う変数はショートカットを定義しておくと便利です。以下ではPythonの組み込み関数は`PyCall::builtins`に定義されているので`pyblt`に格納しています。

{% code lang:ruby %}
require 'open-uri'
require 'pycall/import'
include PyCall::Import

pyimport :pandas, as: :pd
pyimport :numpy, as: :np
pyblt = PyCall::builtins
Dict = PyCall::Dict
List = PyCall::List
{% endcode %}

次にコミッターログ(前述の`git shortlog`で作成した1998年から2019年までの作者別コミット数)を読み込んでデータフレームを作成します。

`read_committers_log`関数はコミッターログをパースして、コミット数と作者とEメールアドレスに分割してデータフレームを作成しています。

{% code lang:ruby %}
def read_committers_log(file)
    committers = File.read(file).split("\n").map do |e|
        commits, id = e.split("\t")
        user, addr = id.split(" <")
        [commits.to_i, user, addr.chop]
    end
    pd.DataFrame.new(data: committers, columns:[:commits, :author, :addr])
end

df = read_committers_log('ruby_committers.log')
{% endcode %}

次に名寄せの戦略として作者(`author`)が同名のものは同一人物だと仮定してどれだけ名寄せできるか確認します。ここで284から267まで名寄せできることを確認しました。

{% code lang:ruby %}
df.author.unique().size
{% endcode %}

そして実際に`author`で名寄せを行います。以下は`author`で`groupby`したあと、コミット数を合計し、Eメールアドレスはカンマを挟んで結合して、コミット数でソートしたあとインデックスをリセットしています。

pandasの集約関数の`agg`には辞書を明示的に渡す必要があります。最初はここにRubyのハッシュをそのまま渡していて動かなくて悩みました。また、PythonでLambda関数を渡す箇所にはProcオブジェクトを渡す必要がありました。RubyのLambdaでは動きませんでした。これがPyCallの仕様かどうかはあまり時間がなかったので調べられていません・・・

{% code lang:ruby %}
addr_join = proc {|s| s.tolist.to_a.join(',')}
df_uniq_author = df.groupby(:author).agg(Dict.new({commits: :sum, addr: addr_join}))
    .sort_values(:commits, ascending: false).reset_index
{% endcode %}

作者名の次の名寄せはメールアドレスの先頭部分(`@`より前の部分)を用いました。この戦略は間違う確率が高い危険な方法ですが、とりあえず間違った箇所は個別に対処することにして実行しました。

以下のコードはメールアドレスの先頭部分を抜き出し、データフレームの最後に`addr_user`として追加するコードです。
試行錯誤しながら特殊な場合分けをしています。面白いのは`matzbot`の存在です。このボットは毎日定期的にに`version.h`の`RUBY_RELEASE_DAY`を書き換えるお仕事をしているようです。

{% code lang:ruby %}
addr_user = proc do |df|
    df.addr.tolist.map do |addrs|
        addrs.split(',').map do |addr|
            user, domain = addr.split('@')
            if user == 'mail'
                domain.split('.')[0]
            elsif ['svn',  'svn-admin'].include?(user)
                'matzbot'
            elsif domain == 'users.noreply.github.com'
                sp = user.split('+')
                if sp.size == 2
                    sp[1]
                else
                    sp[0]
                end
            else
                user
            end
        end.uniq.join(',')
    end
end

df_addr_user = df_uniq_author.assign(addr_user: addr_user)
{% endcode %}

次のコードは実際に`addr_user`で名寄せを行っています。作者名(`author`)の集約には文字列が長い方を採用しています。一般的に最初は短いユーザ名を用いていたが後から本名を`author`に設定する方が多くいたからです。

{% code lang:ruby %}
max_author =  proc {|s| s.tolist.max_by{|e| e.size}}
df_uniq_addr_user = df_addr_user.groupby(:addr_user).agg(Dict.new({commits: :sum, addr: addr_join, author: max_author}))
    .sort_values(:commits, ascending: false).reset_index
{% endcode %}

次に名寄せしたユーザ名がGitHubに存在するか確認します。これは最終的にGitHubのユーザ名をユニークなキーにして、GitHubのアバターを可視化に用いたいからです。

{% code lang:ruby %}
def check_github_user(user)
    open("https://github.com/#{user}/")
    true
rescue => e
    false
end

is_github_user = df_uniq_addr_user.addr_user.tolist.map do |e|
    sleep(1)　# 負荷をかけすぎないようにする
    check_github_user(e)
end

df_github_user = df_uniq_addr_user.assign(is_github_user: is_github_user)
{% endcode %}

以下のコードはGitHubユーザが見つかった場合はそのまま、`addr_user`をそのまま出力し、そうでない場合は先頭に`XXXX_`を付加した文字列を`tmp_user`として列に追加します。

{% code lang:ruby %}
add_tmp_user = proc do |df|
    df.is_github_user.tolist.zip(df.addr_user.tolist).map do |is_github_user, addr_user|
        is_github_user ? addr_user : "XXXX_" + addr_user
    end
end

df_tmp_user = df_github_user.assign(tmp_user: add_tmp_user)
df_mod_drop = df_tmp_user.drop(columns: [:addr_user])

{% endcode %}

最後に列の並びを｀reindex`で整理して一時ファイルにCSV形式で保存します。

{% code lang:ruby %}
df_tmp_out = df_mod_drop.reindex(columns: [:commits, :tmp_user, :author, :is_github_user, :addr])
    .sort_values([:commits, :tmp_user], ascending: [false, true]).reset_index(drop: true)
df_tmp_out.to_csv("ruby_committers_tmp.csv", index: false)
{% endcode %}

ここまででようやく名寄せの第一段階がおわったところです。ここまでの作業結果は以下のノートブックで確認できます。

- {% elink make_ruby_committers.ipynb https://github.com/hinastory/ruby-development-activity/blob/master/make_ruby_committers.ipynb %}

この後は作者名をキーにしてGoogleで検索をかけてnokogiriでスクレイピングをしてGitHubユーザ名の候補を出力するようなことをして名寄せの精度を高めたりしましたが、結局最後は人力で頑張りました。

名寄せの結果は以下にコミットしたので間違っていたらイシューかプルリクでお知らせ頂けると幸いです。

- {% elink ruby_committers.csv https://github.com/hinastory/ruby-development-activity/blob/master/ruby_committers.csv %}

### 最終的な集計テーブルを作成する

ようやく名寄せを行ったコミッターのマスターテーブルが完成したので、これをもとに年単位で集計したログをFlourishが読み込めるデータに変換します。


以下のコードはコミッターのマスターテーブルにコミット数に応じてコミットランクをつけています。コミットランクは以下の用になっています。
完全に自分の主観です。区切りのいいところに置いてみただけです。

| ランク | コミット数 | 説明 |
| --- | --- | --- |
|  C | 10未満 | 初級者    |
|  B | 10以上100未満 | 中級者    |
|  A | 100以上1000未満 | 上級者    |
|  S | 1000以上10000未満 | 超人   |
|  SS | 10000以上 | 神  |


{% code lang:ruby %}
df_committers = pd.read_csv('ruby_committers.csv')

def add_rank(df_committers)
    df_all = read_committers_log("ruby_committers.log")
    commits = df_all[:commits].tolist
    addr = df_all[:addr].tolist
    committers = Hash.new(0)
    commits.zip(addr).each do |commits, addr|
        addr_replaced = addr.gsub('+', '.')
        user = df_committers[proc {|df| df.addr.str.contains(addr_replaced)}].user.tolist.first
        if user
            committers[user] += commits
        else
            p addr unless addr.start_with?('(no author)')
        end
    end

    users = df_committers.user.tolist.to_a
    rank_list = users.map do |user|
        committers.fetch(user, 0)
    end.map do |commits|
        if commits >= 10000
            "SS"
        elsif commits >= 1000
            "S"
        elsif commits >= 100
            "A"
        elsif commits >= 10
            "B"
        else
            "C"
        end
    end
    df_committers[:rank] = rank_list
    df_committers
end

add_rank(df_committers)
{% endcode %}


次のコードは年単位で集計したデータをマスターデータを使って集約しています。集約はマスターデータの`addr`欄のメールアドレスに対象のメールアドレスが部分文字列として含まれているかどうかで判断しています。

{% code lang:ruby %}
years = (1998..2019)
activity_type = 'trend'

commits_by_years = years.map do |year|
    df_year = read_committers_log("#{activity_type}/#{year}.log")
    commits = df_year[:commits].tolist
    addr = df_year[:addr].tolist
    commits_by_year = Hash.new(0)
    commits.zip(addr).each do |commits, addr|
        addr_replaced = addr.gsub('+', '.')
        user = df_committers[proc {|df| df.addr.str.contains(addr_replaced)}].user.tolist.first
        if user
            commits_by_year[user] += commits
        else
            p addr unless addr.start_with?('(no author)')
        end
    end
    commits_by_year
end
nil
{% endcode %}

以下のコードは新たな列としてGitHubのユーザの場合はアバターのURLを`image`列として追加し、またユーザ名と作者名を結合した`label`列を付加しています。

{% code lang:ruby %}
label_add = proc do |df|
    df.user.tolist.zip(df.author.tolist).map do |user, author|
        user == author ? user : "#{user} (#{author})"
    end
end

image_add = proc do |df|
    df.user.tolist.zip(df.is_github_user.tolist).map do |user, is_github_user|
        is_github_user ? "https://github.com/#{user}.png" : ''
    end
end

df_committers_added = df_committers.assign(label: label_add, image: image_add)
{% endcode %}


次のコードで最終的なテーブルを作成しています。具体的には列として1998年から2019年までの22列を追加しています。

{% code lang:ruby %}
df_development_activity = df_committers_added

users = df_development_activity.user.tolist.to_a
years.zip(commits_by_years).each do |year, commits_by_year|
    commits_list = users.map do |user|
        commits_by_year.fetch(user, 0)
    end
    df_development_activity[year] = commits_list
end
df_development_activity.to_csv("ruby_development_activity_#{activity_type}_1998-2019.csv", index: false)
{% endcode %}


ここまでの作業結果は以下のノートブックで確認できます。

- {% elink make_development_activity.ipynb  https://github.com/hinastory/ruby-development-activity/blob/master/make_development_activity.ipynb %}

また出力結果は以下のファイルになります。

- {% elink ruby-development-activity https://github.com/hinastory/ruby-development-activity/blob/master/ruby_development_activity_trend_1998-2019.csv %}
- {% elink ruby_development_activity_total_1998-2019.csv https://github.com/hinastory/ruby-development-activity/blob/master/ruby_development_activity_total_1998-2019.csv %}

## Flourishで可視化してみる

Flourishは非常に多くの可視化に対応していますが、今回は{% elink Bar chart race https://app.flourish.studio/@flourish/bar-chart-race/10 %}を用いています。

データさえ出来ていれば可視化は非常に簡単で、CSVファイルをアップロードして可視化に用いる行を選択するだけです。

{% img /gallery/events/advent-calendar-2019/ruby-viz-trend.png %}

## 完成した可視化

以下が完成した可視化です。中央のRubyの画像は{% elink Rubyホームページ https://www.ruby-lang.org/ja/ %}から引用しており、作者の画像はGitHubから引用しております[^2]。
以下は1998年からの累計コミット数のチャートです。

- {% elink ruby-viz-total | Flourish https://public.flourish.studio/visualisation/1063474/ %}

<div class="flourish-embed" data-src="visualisation/1063474"></div><script src="https://public.flourish.studio/resources/embed.js"></script>

以下は年単位のコミット数の可視化です。その年に活躍したコミッターが分かると思います。

- {% elink ruby-viz-trend | Flourish https://public.flourish.studio/visualisation/1132483/ %}

<div class="flourish-embed" data-src="visualisation/1132483"></div><script src="https://public.flourish.studio/resources/embed.js"></script>

[^2]: 引用自体はフェアユースの範囲内だと個人的には思っていますが何か問題があればご指摘ください。

## まとめ

見てのとおりコミット数1万件超えのnobuさんが圧倒的でただ一人SSランクになっています。そしてRuby作者のmatzさんは最近はRuby本体にはあまりコミットされていないようです。恐らく{% elink mruby https://github.com/mruby/mruby/ %}の開発等でご多忙なのだと思います。あと可視化に関して言えば、Ruby開発の最初の5年間はコミットログがないので可視化できていないのと、コミッターによって代理でコミットされた名もない作者が多数いると思われるので、この可視化はそういった不完全な面があることをご理解頂いた上でご覧ください。

苦労した点は多々ありますが、やはりダントツで名寄せに苦労しました。Rubyは歴史が長くコミッターの数も多いので名寄せがうまく行かないケースが多発しました。

今回GitHubのアバター画像を出す関係から最終的にはGitHubのユーザー名で名寄せを行いましたが、プロプライエタリなGitHubを嫌う方やRubyの開発から突如消えた方や大分昔にコミットが途絶えた方などでGitHubアカウントが見つけられなかった方が何人かいました。しかし苦労した分そのようなRubyの開発史を垣間見ることができたのでとても面白かったです。

本記事がRuby2.7のリリースとともに、Rubyを愛する人達へのささやかなクリスマスプレゼントになれば幸いです。

<blockquote class="twitter-tweet"><p lang="ja" dir="ltr">Rubyの22年に渡るコミットの歴史を可視化してみました。Rubyを愛する方たちへのクリスマスプレゼントになれば幸いです。<a href="https://twitter.com/hashtag/Ruby?src=hash&amp;ref_src=twsrc%5Etfw">#Ruby</a> <a href="https://t.co/wrDu6UXcTh">pic.twitter.com/wrDu6UXcTh</a></p>&mdash; hinastory (@hinastory999) <a href="https://twitter.com/hinastory999/status/1209588070665707520?ref_src=twsrc%5Etfw">December 24, 2019</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>