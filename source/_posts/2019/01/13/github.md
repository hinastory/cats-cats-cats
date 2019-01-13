---
title: GitHubのプライベートリポジトリに移行した話
thumbnail: https://assets-cdn.github.com/images/modules/open_graph/github-mark.png
categories:
  - ['Tech', 'Tool']
tags:
  - Git
date: 2019-01-13 09:29:23
---

新年そうそうビッグニュースが流れてきました。
GitHubがプライベートリポジトリをタダで使わせてくれるってよ!

{% linkPreview http://www.itmedia.co.jp/news/articles/1901/08/news051.html %}

<!-- more -->

## 目次
<!-- toc -->

## これまで

これまではパブリックなリポジトリはGitHubにおいて、プライベートなリポジトリは自宅のKubernetes上にGitBucketを立てて、そこに置いていました。

{% linkPreview https://github.com/gitbucket/gitbucket%}

## なんでそんな運用にしていたのか？

Gitを使っているとなんでもGit管理したくなってきました。しかし、パブリックにおいても良いデータはGitHubで問題ありませんでしたが、どうしてもパグリックにしたくないデータもGit管理しようとすると困りました。GitHubは当時プライベートリポジトリを使うために月$7も必要だったのです。払えないわけではないですが、流石にちょっとしたデータを管理するためには高すぎるなぁと感じて躊躇していました。それではGitLab等のプライベートリポジトリが無料で使える所にしようかとも考えましたが、さすがにパブリックなリポジトリをGitLabに移行すると色々とリンクが切れて面倒なので諦めました。

それではプライベートなリポジトリだけGitLab管理にすればいいかというと.gitconfigに登録してあるメールアドレスの切り替えが面倒でした。GitHub上に公開しているコミットログに実運用しているメールアドレスを残すのは嫌だったのでGitHubのnoreplyメールアドレス(`1696779+hinastory＠users.noreply.github.com`)を設定していましたが、それをGitLabではそれを切り替える必要があります[^1]。最初はローカルのgitconfigで対応しようとしましたがリポジトリ毎に設定しければならず面倒すぎました。

そして結局、自宅にGitBucketを立てて運用するに至ったわけで、自宅のファイル管理の大体のニーズは満たせました。しかし、それでもやっぱりプライベートでリポジトリを作成して落ち着いてからパブリックにしたいとかはやりたいわけです。そんなこと考えながらここ数年もやもやしていましたが、ここに来てやっと素晴らしいニュースに巡り会いました。

[^1]: プライベートリポジトリだけなら気にしないという手もありますが、やはりGitLabにGitHubのnorelyメールアドレスが入るのは抵抗があるので、切り替える必要がありました・・・

## 現在

GitBucketにあったリポジトリを全てGitHubのプライベートリポジトリに移行しました[^2]。

### 移行方法

移行については簡単で、GitHubの画面右上の`+`ボタンから`New Repository`を選択するとリポジトリの作成画面が表示されます。そしてその画面で`Private`を選択します。このとき`Initialize this repository with a README`を選択しないでください。これを選択すると既存のレポジトリのpushができなくなります。

{% img /gallery/daily/tools/github-create-new-repo.png %}

上記の画面で`Create repository`を実行すると以下の画面が表示されるので、あとは既存のリポジトリ上で赤枠で囲った手順を実行するだけで移行は完了です。

{% img /gallery/daily/tools/github-existing-repo.png %}

### 注意点

一応注意点を上げるとすれば、プライベートなデータを上げる場合、最低限2段階認証は有効にしておくべきです[^3]。2段階認証用のアプリには自分は{% elink 'Google Authenticator'  https://itunes.apple.com/jp/app/google-authenticator/id388497605?mt=8 %}を利用しています。あとFreeプランでは「Protected branches」、「Code ownedrs」、「Pages and wikis」、「Repository insights」の機能がプライベートリポジトリで使えません。プライベートリポジトリのコラボレータも３名までとなっています[^4]。これらが使いたくなったら素直にProプランに移行すべきですね。

[^2]: ついでにローカルのリポジトリも整理して、GitHubからクローンしたものをお行儀悪く直接修正したりしていたリポジトリを、ちゃんとフォークとリベースをしてGitHubにpushしました。こちらの作業の方が実は大変でした・・・
[^3]: プライベートなデータを上げなくてもセキュリティのために2段階認証はオススメです。
[^4]: パブリックリポジトリでは今までどおりの機能が使えてコラボレータも無制限です。詳細は{% elink GitHubの料金プラン https://github.com/pricing %}をご確認ください。

## まとめ

Freeプランでプライベートリポジトリが使えるようになり、GitHubにリポジトリを統一できて幸せになれました。Gitbucketからの移行も元がGitなので非常に楽です。GitHubがMicrosoftに買収されたときはどうなることやらと思いましたが、この決断はGood Jobと言わざるを得ません。恐らくGitLabへの対抗処置だとは思いますが、今後も競い合ってより良いサービスになってくれることを願って止みません[^5]。

[^5]: いいサービスなら月500円までなら払いますが、$7はちょっと・・