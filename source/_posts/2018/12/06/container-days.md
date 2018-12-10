---
title: JapanContainerDays v18.12 に初参加
date: 2018-12-06 23:22:18
thumbnail: /gallery/thumbnails/container-days-logo.png
categories:
    - [Tech, Container]
tags:
    - Container
    - k8s
---

12/4(火)にJapanContainerDays v18.12に初参加しました。このイベントは春に1回目を開催して今回で2回目の開催だそうですが[^1]、会場には800人以上の人が詰め掛けたようで非常に盛況でした。

{% linkPreview https://containerdays.jp/ _blank nofollow %}

[^1]: JapanContainerDaysは2回目にして、今回で最終回だそうです。次回からはCloudNative Daysに変わるそうですが{% elink  Cloud Native Days Tokyo http://cloudnativedays.net/outline/ %}との関係性はよくわかりません・・・

<!-- more -->

## 目次
<!-- toc -->

## 会場の様子

会場は御茶ノ水の{%elink ソラシティカンファレンスセンター https://solacity.jp/cc/access/  %}でした。ここには以前に{%elink デブサミ夏 https://event.shoeisha.jp/devsumi/20180727 %}や{%elink 大江戸Ruby会議06 http://regional.rubykaigi.org/oedo06/ %}に参加した時に来たことがあったので特に迷うことなく到着しました[^2]。
9:40開始だったのですが念の為30分早く会場入りしたのでキーノートの会場はまだ半分近く空いていました。

[^2]: 駅から徒歩1分なので、そもそも迷うほうが難しい気もします・・・

{% blockquote 撮影：JapanContainerDays実行委員会 https://photos.app.goo.gl/1X6PJEyijBNLTZrm6 引用元 %}
{% img /gallery/quotes/jcd/sola-city.jpg %}
{% endblockquote %}

{% blockquote 撮影：JapanContainerDays実行委員会 https://photos.app.goo.gl/1X6PJEyijBNLTZrm6 引用元 %}
{% img /gallery/quotes/jcd/atend.jpg %}
{% endblockquote %}

## キーノート

さすがにキーノート開始直前には満席近くになっていました。キーノートは会社やコミュニティの代表が順番に登壇する形式で2時間行われました。その中でなんといっても目玉は{% elink CNCF https://www.cncf.io/%}のCOOであるChris Aniszczykさんの発表だと思います。

{% blockquote 撮影：JapanContainerDays実行委員会 https://photos.app.goo.gl/1X6PJEyijBNLTZrm6 引用元 %}
{% img /gallery/quotes/jcd/keynote.jpg %}
{% endblockquote %}

CNCFの歩みや今後の展望が語られていました。気になったのはIoTやEdgeにもKubernetesが進出するという話題でしょうか。KubeEdgeには注目していきたいと思います。あとはどんどんServerlessやNodelessに進んでいく方向性が強調されていました。virtual-kubeletの紹介もあり今後が非常に楽しみです。

{% linkPreview https://github.com/kubeedge/kubeedge %}
{% linkPreview https://github.com/virtual-kubelet/virtual-kubelet %}

あと、クラウドネイティブの定義も紹介されていました。今までクラウドネィティブとは何ぞやと思っていたので少しはもやもやが晴れたような気がします。

{% blockquote クラウドネイティブの定義(Google翻訳を利用) https://github.com/cncf/toc/blob/master/DEFINITION.md 引用元 %}
クラウドネイティブテクノロジは、パブリック、プライベート、およびハイブリッドクラウドなどの最新のダイナミックな環境でスケーラブルなアプリケーションを構築および実行するための組織の能力を強化します。コンテナ、サービスメッシュ、マイクロサービス、不変インフラストラクチャ、および宣言型APIは、このアプローチの例です。

これらの技術は、復元力があり、管理しやすく、観測可能な疎結合システムを可能にします。堅牢な自動化と組み合わせることで、エンジニアは頻繁に、そして予想通りに影響の少ない変更を最小限の労力で行うことができます。

クラウドネイティブコンピューティング基盤は、ベンダーに依存しないオープンソースのプロジェクトのエコシステムを促進し維持することによって、このパラダイムの採用を推進しようとしています。最先端のパターンを民主化し、これらのイノベーションを誰もが利用できるようにします。
{% endblockquote %}

あとはCNNFの歩き方や全体像も紹介されていました。

{% img https://raw.githubusercontent.com/cncf/trailmap/master/CNCF_TrailMap_latest.png %}

{% linkPreview https://landscape.cncf.io/format=landscape %}

Trail MapはともかくLandscapeは圧巻ですね・・・

まぁその中でもCNNFが直接ホスティングしているのはごく僅かです。{% elink これ https://github.com/cncf/toc#projects %}を見ると全部で30程ありますが、現時点では成熟度が最高のGraduatedになっているのはKubernetes、Prometheus、Envoyのわずか３つです[^3]。これからクラウドネイティブが浸透していく中でこれらのプロジェクトがどの様になっていくのか注視していきたいと思います。

[^3]: というかPrometheusはCNNFだったとは初めて知りました・・・

キーノートには他にも面白い発表がいくつもあったのですが、印象に残ったのはメルカリの発表でした。なぜコンテナオーケストレーションにKubernetesなのかという問いに対して拡張性とエコシステムを挙げていましたが、これと同じ答えはこの後に続くセッションでも繰り返し聞くことになりました。そしてこの答えがOSSで勝ち抜くための到達点なんだという気がしました。
シンプルで直交的で整合性のとれた拡張性で素早くエコシステムを構築すること。言葉にすると短いですがこの状況をわずか数年で作り上げて決着までほぼつけてしまうとは、改めてKubernetesの成し遂げたことの凄さを実感しました。

{% blockquote 撮影：JapanContainerDays実行委員会 https://photos.app.goo.gl/1X6PJEyijBNLTZrm6 引用元 %}
{% img /gallery/quotes/jcd/mercari.jpg %}
{% endblockquote %}

## 参加セッション一覧

とりあえず参加セッションを列挙してみます。メモったキーワードを記載していますが、あやふやな部分も多く含むためさらっと流していただけると幸いです。

### 24日参加セッション
- keynote
  - CNCF
  - Microservices on Kubernetes at Mercari（Mercari）
  - Kubernetesによる機械学習基盤への挑戦（Preferred Networks）
  - LINEエンジニアを支えるCaaS基盤の今とこれから（LINE）
  - Cloud Nativeの未来とIBMの取組み （IBM）
  - クラウドネイティブで作る、新しいクルマの世界（デンソー）
  - ZOZOTOWNシステムリプレイスにおけるKubernetes活用（ZOZOテクノロジーズ）
- [コンテナネットワーキング（CNI）最前線](https://www.slideshare.net/mobile/motonorishindo/cni-124981353)
  - コンテナネットワーキングは闇が深い、動きが早い、スケーラビリティに注意
- [Kubernetes ネットワーキングのすべて](https://www.slideshare.net/linecorp/kubernetes-124878915)
  - Services, Ingress, NetworkPolicy
- [40 topic of Kubernetes in 40 minutes](https://www.slideshare.net/tyoshio2002/japan-container-day-2018)
  - serviceでなくingressを使え、latestタグは使うな、DockerHubのイメージは信用するな、バージョンアップは容易にするな、ボリュームは使うな、全機能を使う必要はない、ingressはGAではない
- [Ansible、Terraform、Packerで作るSelf-Hosted Kubernetes](https://speakerdeck.com/takaishi/jkd1812)
- Kubernetesから始めるクラウドネイティブエンジニアへの道 〜 Kubernetesトレーニングと、CKA/CKAD資格取得に向けて 〜
  - 構築ツールを使わずにやってみた([kubernetes the hard way](https://github.com/kelseyhightower/kubernetes-the-hard-way))、k8sはCloud Nativeにおいてはスターティングポイント
- 2019年はコンテナよりもクラウドネイティブ!? Knativeのすべて
  - コンテナ辛い！そこでknative, カナリアリリースが楽、riffもあるよ
- After Party & Booth Crawl !!

### 25日参加セッション
- 2020年のコンテナはどうなる!? コンテナプラットフォームのこれまでとこれから
  - マイクロサービスは組織論に行き着くので難しい
  - k8sは拡張性の高いOSようなもの
  - K8sは開発やPOCまではうまくいくが本番運用に課題あり
  - istioがここまでくると思っていなかった。サービスメッシュはエンタープライズにこそ必要
  - cloudfoudry,istio,mesoss,open shift,rancher,rio, core os,kubeflow, knative
- マイクロサービスの高可用性：Ingress, サービスメッシュの世界におけるロードバランシング
  - nginx社は実在する
  - plusもあるよ
  - 複雑になったWebを簡素化したい
  - fablic modelではすべてのappにサイドカーとしてnginxが入る
- [Dockerセキュリティ: 今すぐ役に立つテクニックから，次世代技術まで](https://www.slideshare.net/mobile/AkihiroSuda/docker-125002128)
  - 鍵をイメージに入れるな、`--ssh`,`--seacret`を使え。使えない場合はスカッシュやマルチステージというワークアラウンドを使え
  - イメージスキャナ - clair, aqua microscanner
    - 誤検知もあるので信用しすぎるな
  - dockerソケットに気をつけろ。dockerグループに入れるのは危険
  - コンテナ is namespace + capabilities + cgroups
  - SELinux無効化するときは「石川さん、Walshさんごめんなさい 」と唱えてから実行
- [Kubernetesと暮らすRancherな生活](https://www.slideshare.net/mobile/gchiba/kubernetesrancher-125017022)
  - rancherはk8sのオーケストレーション層ではなくその上のストラテジー層
  - 2.0でk8s一本になり、Pure Goになり、マネージドもOKになりカタログがHelmになった
  - rioはおもしろそうだがまだかなり柔らかい。k8sを意識しない時代に・・・
- [MeetUpを活性化せよ！最強のリアルタイムQA投稿アプリをCloud_Nativeにつくってみた](https://speakerdeck.com/cndjp/jkd-v18-dot-12-2w3)
　　- [Qicoo](https://qicoo.tokyo/)
　　- 自演が可能です
　　- eks,ec2,elastic cache, rds,cloud flront, route 53,cert manager, elb, travis ci, kustomize, hepioak, spinnaker,kanyeta,prometheousOperator, Halyard
　　- [Cloud Native Developers JP](https://github.com/cndjp)
　　- [Cloudcraft – Draw AWS diagrams](https://cloudcraft.co/)
- コンテナ時代のOpenStack
- [Kubernetes Meetup Tokyo 2年間の振り返りと未来](https://speakerdeck.com/superbrothers/kubernetes-meetup-tokyo-looking-back-for-two-years-and-the-future)
  - 参加者の規模数がすごい
  - 登壇者限定で濃い話をする会がある
  - 登壇してください

自分が参加したセッション以外は以下にまとめがあるのであとで読みたいと思います。

{% linkPreview https://medium.com/@containerdaysjp/jkd1812-ab186974d52d %}

## 食事

昼食はランチセッション中に配布されたサンドイッチやまい泉ヒレかつサンドを食しました。

{% blockquote 撮影：JapanContainerDays実行委員会 https://photos.app.goo.gl/1X6PJEyijBNLTZrm6 引用元 %}
{% img /gallery/quotes/jcd/sand.jpg %}{% img /gallery/quotes/jcd/maisen.jpg %}
{% endblockquote %}

お菓子やドリンクも無料で楽しむ事ができました[^4]。ContinerDaysのロゴが入ったマカロンが可愛かったです。

{% blockquote 撮影：JapanContainerDays実行委員会 https://photos.app.goo.gl/1X6PJEyijBNLTZrm6 引用元 %}
{% img /gallery/quotes/jcd/coffee.jpg %}{% img /gallery/quotes/jcd/macaron.jpg %}
{% endblockquote %}

After Partyではビールやワインや焼酎をの呑みながらワイガヤしてました。急遽決まったLT大会では個性あふれる様々な会社がHiringトークをしていました。

{% blockquote 撮影：JapanContainerDays実行委員会 https://photos.app.goo.gl/1X6PJEyijBNLTZrm6 引用元 %}
{% img /gallery/quotes/jcd/party1.jpg %}{% img /gallery/quotes/jcd/party2.jpg %}
{% endblockquote %}

[^4]: 当日は本当に無料だと喜んだのですが、冷静に考えると参加費を払っているので無料でもなんでもなかったです・・・ しかし、チケットは最後までEarly Bird価格のまま安売りされていたけど主催者の想定した人数が集まらなかったから値下げしたのか、それとも早めに予定金額を調達できたから値下げしたのか真相がわからない・・・どちらにせよ焦ってEirly Birdに釣られた身としてはもやもやします・・・

## 戦利品

勢い余って電子書籍3冊も買ってしまいました。面白かったのはNGINXで配られたUSBケーブルです。正直そのタコ足のような発想はありませんでした(笑)

{% img /gallery/events/jcd/memento.jpg %}

## 感想とまとめ

参加したことでCloudNativeがどこまできているか肌で実感できた気がしました。自宅ではminikubeからGPUを触れる環境を構築していますが、いまいち有効利用できていない気がしていたので、このイベントを機会に手を動かしながらいろいろとCloudNativeに近づけて見たいと思います。

- Kubernetesの一人勝ち
- 今後はKubernetesのエコシステムの何処を占めるかの戦い
  - サービスメッシュ(Istio)がかなり熱い
  - Helmもデファクトになりそう
  - knative, virtual-kubeは注視したい
  - 機械学習のインフラとしても面白そう
- Kubernetesは本番運用に課題あり
  - knative, OpenShift, Rancher等さまざまなアプローチで解決しようとしている
  - 最終的にはNoOpsやサーバーレスやFaaSな未来に行き着くのだろう・・・（時期未定）
- 来年は{% elink CloudNative Days https://cloudnativedays.jp/ %}