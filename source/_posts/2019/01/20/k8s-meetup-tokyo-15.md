---
title: Kubernetes Meetup Tokyo　#15 - KubeCon 2018 Recap に初参加
thumbnail: /gallery/thumbnails/k8s-tokyo-logo.png
categories:
  - [Tech, Container]
tags:
  - k8s
  - Container
date: 2019-01-20 05:09:37
---
Kubernetes Meetup Tokyo #15 - KubeCon 2018 Recapに初参加して来ました。会場は六本木ヒルズのGoogle東京オフィスです。倍率2倍の抽選を潜り抜けて参加できることになりました。

{% linkPreview https://k8sjp.connpass.com/event/112661/?utm_campaign=&utm_source=notifications&utm_medium=email&utm_content=title_link %}

<!-- more -->

## 目次
<!-- toc -->

## Kubernetes Meetup Tokyo #15 - KubeCon 2018 Recapとは？

Kubernetes[^1] Meetup Tokyoは、東京都内で不定期に開催されるKubernetesに関する情報交換や交流を行うための勉強会です。Kubernetesに熱い情熱を捧げる有志の方々が運営されています。参加登録は{% elink connpass https://k8sjp.connpass.com/ %}から気軽に行えますが、ここ最近は人気が高く定員オーバーの状態が続いています。一般枠は激戦で参加できるかどうかは抽選なので運次第ですが、遠方枠や女性/LGBT枠は競争率が低いので条件を満たす人はオススメです。

今回のMeetupは「KubeCon 2018 Recap」という副題が示すとおり、昨年12月10〜13日にかけてシアトルで行われた{% elink "KubeCon + CloudNativeCon" https://events.linuxfoundation.jp/events/kubecon-cloudnativecon-north-america-2018/ %}のおさらいです。KubeConは世界最大規模のKubernetesのカンファレンスで、前回は8000人を超える参加者と100を超えるスポンサーが集結しました。

[^1]: Kubernetesはご存知かもしれませんが一応説明しておくと、もともとはGoogleが開発して2014年に公開して、現在は{% elink Cloud Native Computing Foundation https://www.cncf.io/ %}の管轄下にあるコンテナオーケストレーションシステムです。よくk8sと略されます。去年の段階で同様のツールやシステムを押さえてほぼ一強状態で、昨今の盛り上がりはすごく、これから到来すると予想されるクラウドネイティブ時代の中心的な役割を担っています。

## 会場の様子

実は六本木ヒルズ自体も初めてだったので、開場の10分前くらいに到着して周囲を散策していまいた。場所はその名の通り六本木駅でコンコースで直結されていたので、東京メトロの地下からエスカレータで地上に出ると眼前に{% elink 六本木ヒルズ http://www.roppongihills.com/ %}がそびえ立っていました。

{% img /gallery/events/k8s-meetup-tokyo/hills.jpg 400 %}

六本木ヒルズ1階入り口の入ってすぐ左に臨時受付があり、そこで入館証を貰ってからエスカレータで43階のGoogleオフィスにお邪魔しました。

{% img /gallery/events/k8s-meetup-tokyo/google-office-1.jpg 360 %}{% img /gallery/events/k8s-meetup-tokyo/google-office-2.jpg 360 %}

開場は食堂だったようで中央にオープンキッチンがあってその周囲にテーブルや椅子が配置されていました。さすがGoogleだけあってスペースも広く、ガラス張りの展望も素晴らしいものでした。Google東京オフィスは今年中に渋谷ストリームに移転するらしいので、その前にこれて良かったです。

{% linkPreview http://www.itmedia.co.jp/news/articles/1711/17/news082.html %}

## 発表内容

今回の発表はKubeCon参加者が参加したセッションの中から一つ選んで、その概要、なぜそのセッションが面白いのか、自身の業務課題との関わりについて話すというものでした。

### KubeCon + CloudNativeCon North America 2018 Overview - @ladicle

最初の発表は今回のKubeKonの概要を説明するものでした。開場の雰囲気や注目ポイントを発表されていました。印象に残ったのはKubernetesが退屈(Boring)なものになったというものですね。Kubernetesのコアの技術は十分に成熟してメインストリームで使われるようになり、Kubernetes本体よりもその周辺技術や応用例、運用関連に話題の方向性がシフトしてきている感じです。

<div style="display:flex;justify-content: center;"><div style="width: 80%;"><script async class="speakerdeck-embed" data-id="4a061694787a4febac0e96845d58b961" data-ratio="1.77777777777778" src="//speakerdeck.com/assets/embed.js"></script></div></div>

### Lightning Talk: Introduction to GitOps Deployment to Kubernetes - @sakajunquality

次の発表は実際にKubeConでLightning Talkをした方の発表でした。テーマは{% elink GitOps https://www.weave.works/blog/gitops-operations-by-pull-request %}でDevOpsを一歩先に進めた感じのものでした。簡単に言うとGit上のコード変更やプルリクエストをトリガーにしてKubernetesの操作やCI/CDを自動化するというもので、その取り組みに関して解説されていました。プルリクエストとも連動させるとなるといろいろと考えることがありそうでした。しかし、テーマ自体も面白かったのですが、やはり実際にKubeConで話すための一連の裏話的な内容がとてもおもしろかったです。実際にCFPを出す所から話されていたので、今後発表しようと言う方にオススメの内容でした。

<div style="display:flex;justify-content: center;"><div style="width: 80%;"><script async class="speakerdeck-embed" data-id="b35927301e4a4d51b9ea4cebe66e1ace" data-ratio="1.77777777777778" src="//speakerdeck.com/assets/embed.js"></script></div></div>

### Running VM Workloads Side by Side with Container Workloads - @amsy810

VMも{% elink KubeVirt https://kubevirt.io/ %}を利用してコンテナと同じようにKubernetesで管理するという話。これができると今までOpenStack上にKubernetesを構築してたものが、Kubernetes上でVMを立ててその上に本番用のKubernetesを立てる運用も可能になりそうでした。正直OpenStackは構築も運用も想像以上にツライのでこれは非常に魅力ある話です。ただもちろん現在ではまだそんなに簡単ではなくて少なくともストレージとネットワーキングには頭を悩ませそうな感じでした。

<div style="display:flex;justify-content: center;"><div style="width: 80%;"><script async class="speakerdeck-embed" data-id="967f8a5f31cd4d6585e3f69c0031dd8b" data-ratio="1.77777777777778" src="//speakerdeck.com/assets/embed.js"></script></div></div>

### Keynote: Developing Kubernetes Services at Airbnb Scale - @jyoshise

Airbnbが「Kubernetesツライ」をどのように対処したのかの説明でした。Kubernetesの何がツライかと言うと、マイクロサービス一つ作るだけでも、開発、ステージング、本番環境の３つにデプロイが必要で、さらに一つの商用サービスをつくるためにはそのマイクロサービスを大量に作らないといけないため、そのたびに大量の設定(yamlファイル)を書き、大量のコマンド(kubectl)を打たなければならいからということでした。前者のことは「YAMLの壁」と呼ばれていました。

<div style="display:flex;justify-content: center;"><div style="width: 80%;"><script async class="speakerdeck-embed" data-id="f88a70e3de3f4e35955c3170098ae532" data-ratio="1.77777777777778" src="//speakerdeck.com/assets/embed.js"></script></div></div>

YAMLの壁をAirbnbがどう解決したかと言うと既存のツールはいまいちだったので独自の生成ツールを作ったとのことでした。また発表者の方がshowKsというサービスを作ったときには、テンプレートを作って変数を置換するようにしていたそうです。{% elink helm https://helm.sh/ %}、{% elink kustomize https://github.com/kubernetes-sigs/kustomize %}、{% elink kapitan https://github.com/deepmind/kapitan %}等のツールはAirbnbでは却下されていましたが、一般的にYAMLに押しつぶされそうになったらまずはこれらから検討するのが良さそうです。

後者のkubectlの問題は独自のラッパーを作って対処したそうです。ktoolと呼ばれていて`k`一文字のコマンド名ですが、これだけでも腱鞘炎が減りそうです(笑)。

### Fly Your Containerized Environments by Joint Work of Harbor and Dragonfly - @capsmalt

サイズが大きいコンテナイメージを大規模な分散環境で効率よく、スピーディーに配信するために、{% elink Harbor https://goharbor.io/ %}と{% elink Dragonfly https://d7y.io/en-us/ %}があるよという話。Harbarがイメージ管理で、Dragonflyがイメージ配布のOSSです。どちらもAlibabaで採用されていて中国を中心に流行っているみたいです。

<div style="display:flex;justify-content: center;"><div style="width: 80%;"><script async class="speakerdeck-embed" data-id="73282a3ab0874b58a37b7ee816842c1c" data-ratio="1.77777777777778" src="//speakerdeck.com/assets/embed.js"></script></div></div>

### Securing Kubernetes With Admission Controllers - @tkusumi

Kubernetesのセキュリティーポリシーをどうやって定義、管理するかという話でした。KubernetesにはデフォルトでAdmission Controllerというセキュリティの仕組みがあって、その拡張ポイントとしてValidatingAdmissionWebhookがあるけど独自でポリシーを作り込むのはツライから、{% elink "Open Porlicy Agent(OPA)" %}という汎用ポリシーエージェントを使っていこうというものです。OPAはRegoというDSLでポリシーを書けるので作り込みは楽そうでした[^2]。実際にk8sと連携させるためには{% elink kubernetes-policy-controller https://github.com/open-policy-agent/kubernetes-policy-controller %}が必要とのことです。

<div style="display:flex;justify-content: center;"><div style="width: 80%;"><script async class="speakerdeck-embed" data-id="23d2db5823ea46408510f7c0c695041b" data-ratio="1.77777777777778" src="//speakerdeck.com/assets/embed.js"></script></div></div>

[^2]: Regoはいろいろとクセが強そうな印象を受けました。`=`が比較だったり代入だったりするなど・・・

## 食事

鉄板のピザとビール。ノンアルもあるよ!
美味しかったです。

{% img /gallery/events/k8s-meetup-tokyo/pizza.jpg 400 %}

## 感想とまとめ

運用のツラさで感じることはみんな大体同じで、様々な取り組みやツールがエコシステムとして整備されつつあると感じました。まさしく「`Kubernetesは退屈`」だからこそ安心して取り組める、そう感じたMeetupでした。非常に有意義なMeetupだったのでまた機会があれば参加してみたいと思います。

- Kubernetesは退屈
  - 成熟してメインストリームで使われ始めた
- 運用面や周辺技術に関心がシフト
  - GitOpsをk8sに適用
    - {% elink GitOps https://www.weave.works/blog/gitops-operations-by-pull-request %}
  - VM管理をk8sで行う
    - {% elink KubeVirt https://kubevirt.io/ %}
  - YAMLの壁、kubectlの壁に立ち向かう
    - {% elink helm https://helm.sh/ %}, {% elink kustomize https://github.com/kubernetes-sigs/kustomize %}, {% elink kapitan https://github.com/deepmind/kapitan %}, ktool
  - イメージ管理とイメージ配信
    - {% elink Harbor https://goharbor.io/ %}, {% elink Dragonfly https://d7y.io/en-us/ %}
  - セキュリティ
    - {% elink "Open Porlicy Agent(OPA)" %}, {% elink kubernetes-policy-controller https://github.com/open-policy-agent/kubernetes-policy-controller %}

{% img /gallery/events/k8s-meetup-tokyo/google-guest.jpg 400 %}
