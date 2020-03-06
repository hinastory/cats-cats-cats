---
title: 【ギリギリセーフ】Developers Summit 2020に参加してきました
thumbnail: /gallery/thumbnails/devsumi2020.png
categories:
    - Tech
    - Event
tags:
    - Event
    - Book
date: 2020-02-20 07:28:45
---
[去年](https://hinastory.github.io/cats-cats-cats/2019/02/15/devsumi-2019-winter/)に引き続き、毎年恒例のDevelopers Summit 2020(#devsumi)に参加してきました。今年は新型コロナウイルス感染（COVID-19)の流行により開催が危ぶまれていましたが、ぎりぎり開催ができたようです[^1]。

{% blogCard https://event.shoeisha.jp/devsumi/20200213 %}

[^1]: このイベント開催後に政府が「不要不急の外出を控えて欲しい」と声明を出したので、開催があと一週間遅ければ恐らく中止か延期かオンライン開催になっていたと思います。

<!-- more -->

## 目次
<!-- toc -->

## 日時・場所

日時と場所は以下のとおりです。今年はテレワークを活用して丸々2日参加しました。朝自宅で少し仕事をしてデブサミに直出して、デブサミが終わったら自宅に帰って少し仕事をするという形でなんとか回しました。

- 日時
    - 2020年2月13日（木）10:00-18:45
    - 2020年2月14日（金）10:00-18:25
- 場所
    - ホテル雅叙園東京(東京都目黒区下目黒)
- 主催
    - 翔泳社
- 参加費
    - 無料（事前登録制）
    - ランチセッションあり（ランチはセッション会場で無料で配布される）

## Developers Summitとは

翔泳社主催のソフトウェア開発者向けの総合ITカンファレンスです。毎年2月にホテル雅叙園東京（目黒）で行うことが恒例となっています。派生のイベントとしてテーマを絞った「デブサミ夏」や30歳以下を対象とした「デブスト」や地方イベントも開催されています。


{% blogCard https://event.shoeisha.jp/devsumi/ %}

## 参加セッション

今回は2日間フル参加で合計16セッションを聴講しました。流石に量が多いので全ての感想を書くと書くのにも読むのにも日が暮れてしまいます。そこで僭越ながら個人的にセッションを5段階評価でランク付けしてみたいと思います。

このランクは現時点で自分が個人的に面白かったと思えるランクなので、一般的なセッションの良し悪しの判断を行っているわけではないことをご了承ください。
ランクはタイトル横に★印で記載しています。

- 2/13 10:00～10:45 最新のブラウザで変わるCookieの取扱いやプライバシーの考え方 ★★★★★
    - 登壇者：古川 陽介[リクルートテクノロジーズ]　[@yosuke_furukawa](https://twitter.com/yosuke_furukawa)
    - 資料：{% elink SpeakerDeck https://speakerdeck.com/yosuke_furukawa/zui-xin-falseburauzadebian-warucookiefalsequ-rixi-iyaprivacyfalsekao-efang %}
- 2/13 11:05～11:50 ぼくらの六十日間戦争 ～ｵﾝﾌﾟﾚからｸﾗｳﾄﾞへの移行～ ★★★
    - 登壇者：左近充 裕樹[ブロードリーフ]
    - 資料：elin {% elink SpeakerDeck https://speakerdeck.com/broadleaf/our60dayswar-migrationfromon-premisetocloud %}
- 2/13 12:10～12:40 Kubernetes未経験者がGKEの本番リリース〜障害対応を経験して苦悩した話 ★
    - 登壇者：泉水 朝匡[grasys]
- 2/13 13:05～13:50 インターネットが変えた世界・変える未来 ★★
    - 登壇者：伊勢 幸一[さくらインターネット]　[@ibucho](https://twitter.com/ibucho)
- 2/13 14:10～14:55 Best Practices In Implementing Container Image Promotion Pipelines -知っておくべきコンテナイメージ・プロモーションの方法 ★★
    - 登壇者：Baruch Sadogursky[JFrog]　[@jbaruch](https://twitter.com/jbaruch)
    - 資料： {% elink JFrog https://jfrog.com/shownote/developers-summit-2020/ %}
- 2/13 15:15～16:00 「厳密な共通言語」としての形式手法 ★★★★★
    - 登壇者：チェシャ猫[ProofCafe]　[@y_taka_23](https://twitter.com/y_taka_23)
    - 資料： {% elink SpeakerDeck https://speakerdeck.com/ytaka23/developers-summit-2020 %}
- 2/13 16:20～17:05 少量データで軽量な機械学習の手法について ★★★★
    - 登壇者：秋吉 信吾[QuantumCore]　[@a_shin1985](https://twitter.com/a_shin1985)
    - 資料：{% elink SpeakerDeck https://speakerdeck.com/shin1985/developers-summit-2020 %}
- 2/13 17:25～18:45 「ITエンジニア本大賞 2020」プレゼン大会 ★★★★
    - 司会：高柳 謙
    - 特別ゲスト：
        - 永瀬 美穂[アトラクタ]　[@miholovesq](https://twitter.com/miholovesq)
        - 広木 大地[レクター]　[@hiroki_daichi](https://twitter.com/hiroki_daichi)
        - 山下 智也[英治出版]　[@yamanami1985](https://twitter.com/yamanami1985)
    - {% elink ITエンジニア本大賞2020 https://www.shoeisha.co.jp/campaign/award/2020/result/ %}
- 2/14 10:00～10:45 AWS障害で考えさせられた、アプリケーションインフラ構成の注意ポイント ★★★
    - 登壇者：
        - 城 航太[サーバーワークス]　[@kota_jo](https://twitter.com/kota_jo)
        - 佐藤 豊[サーバーワークス]
    - 資料： {% elink SpeakerDeck https://speakerdeck.com/swx_marketing/awszhang-hai-dekao-esaserareta-apurikesiyoninhuragou-cheng-falsezhu-yi-pointo %}
- 2/14 11:05～11:50 守りのモニタリングから攻めのモニタリングへ ★★★
    - 登壇者：大谷 和紀[New Relic]　[@katzchang](https://twitter.com/katzchang)
    - レポート記事：{% elink note https://note.com/dora_e_m/n/n6a9daf7cbe61 %}
- 2/14 12:10～12:40 Python基礎試験とデータ分析の例題解説～稟議に使えるPython市場データと試験も紹介～ ★★
    - 登壇者：
        - 吉政 忠志[Pythonエンジニア育成推進協会]　[@_yoshimasa](https://twitter.com/_yoshimasa)
        - 寺田 学[Pythonエンジニア育成推進協会]
    - 資料： {% elink PythonED https://www.pythonic-exam.com/archives/news/devsumi2020wintokyo %}
- 2/14 13:05～13:50 デザイナー/リサーチャー/エンジニアが語る、UXとの関わりかた ★★★
    - 登壇者：
        - 松薗 美帆[メルペイ]　[@mihozono](https://twitter.com/mihozono)
        - 山本 興一[スマートニュース]
        - 重田 桂誓[クックパッド]　[@sagaraya](https://twitter.com/sagaraya)
- 2/14 14:10～14:55 事業グロースを加速させる「分析基盤」の作り方【JapanTaxi/ホワイトプラス事例】★★★
    - 登壇者：
        - 森谷 光雄[ホワイトプラス]　[@32oooooooo](https://twitter.com/32oooooooo)
        - 伊田 正寿[JapanTaxi]　[@mida12251141](https://twitter.com/mida12251141)
        - 小林 寛和[primeNumber]　[@hiro_koba_jp](https://twitter.com/hiro_koba_jp)
    - 資料
        - {% elink 森谷 SpeakerDeck https://speakerdeck.com/moriya_mitsuo/1keyue-dedetaji-pan-wozheng-ejing-ying-falsejie-xiang-du-wobian-etahua %}
- 2/14 15:15～16:00 サービスメッシュは本当に必要なのか、何を解決するのか ★★★
    - 登壇者：Yasuhiro Tori Hara[Amazon Web Services Japan]　[@toricls](https://twitter.com/toricls)
        - 資料：{% elink  SpeakerDeck https://speakerdeck.com/toricls/service-meshes-do-we-really-need-them-what-problems-do-they-solve %}
- 2/14 16:20～17:05 Hackが好きなエンジニアが組織をHackしてみる考えと実践を経てきたヒストリー
    - 登壇者：萩原 北斗[うるる]
    - 資料：{% elink SpeakerDeck https://speakerdeck.com/hokutohagi/hackkahao-kinaensiniakazu-zhi-wohacksitemirukao-etoshi-jian-wojing-tekitahisutori/ %}
- 2/14 17:25～18:25 雲の中心で愛を叫ぶ！ クラウド横断パネルディスカッション ★★★★★
    - 登壇者：
        - 濱田 孝治[クラスメソッド/AWS代表]　[@hamako9999](https://twitter.com/hamako9999)
        - 松村 優大[オルターブース/Azure代表]　[@tsubakimoto_s](https://twitter.com/tsubakimoto_s)
        - 高野 遼[クラウドエース/GCP代表]
    - 司会：近藤 佑子[翔泳社]　[@kondoyuko](https://twitter.com/kondoyuko)
    - {% elink レポート(完全版) https://dev.classmethod.jp/cloud/devsumi2020-report-14-c-8/ %}

## 面白かったセッションの紹介


### 10:00～10:45 最新のブラウザで変わるCookieの取扱いやプライバシーの考え方
- 登壇者：古川 陽介[リクルートテクノロジーズ]　[@yosuke_furukawa](https://twitter.com/yosuke_furukawa)

{% oembed https://speakerdeck.com/yosuke_furukawa/zui-xin-falseburauzadebian-warucookiefalsequ-rixi-iyaprivacyfalsekao-efang %}

- セッションメモ
    - ここ最近セキュリティ、プライバシー周りの変更が多い
        - Inntelligent Tracking Prevention(Safari)
        - Enhanced Tracking Protection(FireFox)
        - SamSite Cookie(Chrome)
    - 3rd Party Trackingができなくなる影響
        - 一部の広告がうまく動作しない
        - Webの収益モデルが崩れる
    - Cookieに頼らないプライバシーに配慮した新しい仕組み
        - Private Click Measurement(Safari)
            - 広告をクリックしてから目的を達成したかどうかをcookieに頼らずに行う
        - Privacy Sandbox(Chrome)
        - Privacy Budget
            - 個人を識別可能な情報に予算（Budget）を与えて予算を超えたらそれ以上の情報を渡さない
        - Trust Tokens API
            - Botでは答えられない問題を出して人かBotか判別する
        - Federated Learning of Cohorts
            - 機械学習をブラウザ内で行い、個人の趣味嗜好の判定を個人情報を用いることなく行う
        - DNS over https
            - アダルトフィルターに影響

本セッションではブラウザ周りの最新のセキュリティ動向が聞けて非常に面白かったです。特に**3rd Party Cookie**が悪役にされて今後どういう方向に向かうのか気になっていたので大満足でした。個人的には**DNS over https**が今後どうなっていくのか気になるのでウォッチしたいと思います。

### 15:15～16:00 「厳密な共通言語」としての形式手法

- 登壇者：チェシャ猫[ProofCafe]　[@y_taka_23](https://twitter.com/y_taka_23)

{% oembed https://speakerdeck.com/ytaka23/developers-summit-2020 %}

- セッションメモ
    - 仕様に隠れた曖昧性
        - チェスのルール改定
    - max(x, y)
        - ○： xとyのうち大きい方を返す
        - ×: xとyのうち小さくない方を返す
    - 曖昧さはイメージの限界から生まれる
        - 仕様を理解した「つもり」の思い込み
        - 最初に思いついたもの以外は見落としがち
    - 分散コンピューティングの落とし穴
        - ネットワークは信頼できる
        - レイテンシはゼロである
        - 帯域幅は無限である
        - ネットワークはセキュアである
        - 管理者は一人である
        - トランスポートコストはゼロである
        - ネットワークは均質である
    - 曖昧性ハンドリングの重要性
    - テストでカバーできない点
        - テストケースの網羅性・再現性
        - 実装が先行する必要性
    - 複雑さを扱いうる「言葉」の必要性
    - 形式手法
        - モデル検査
        - 定理証明
    - モデル検査
        - システムが取りうる状態を列挙して探索
        - 有限この探索に帰着できる範囲で自動化が可能
    - 定理証明
        - いわゆる数学的な証明をプログラムとして表現
        - 本当に無限個あるパターンが有る対象を扱える
    - TLA+
        - モデル検査系のツール
            - EclipseベースのIDEとセットで提供
            - Temporal Logic of Actionsと呼ばれる論理がベース
            - システムを状態のの列として表現
            - AWS DynamoDB，S3、CockroachDB等で事例あり
    - 時相論理（Temporal Logic）
        - 通常の論理式に記号を追加した体型
            - 現時点以降、常にAが成り立つ
            - 現時点以降、いつかはAが成り立つ
        - 状態の列に対して真偽を判定
            - 時間的に幅がある振る舞いについて性質を記述できる

セッションメモが長くなってしまいましたが、それだけこのセッションから得るものが大きかったです。分散コンピューティングの曖昧性は耳が痛い限りです。形式手法の考え方は非常に興味深いと感じてて、**時相論理**がモデル検査で実用化されているとは知りませんでした。TLA+は面白そうなので試してみたいと思います。

### 16:20～17:05 少量データで軽量な機械学習の手法について

- 登壇者：秋吉 信吾[QuantumCore]　[@a_shin1985](https://twitter.com/a_shin1985)

{% oembed https://speakerdeck.com/shin1985/developers-summit-2020 %}

- セションメモ
    - リザーバコンピューティング
        - 「少量データ」で「リアルタイム学習」を「高精度」に実現
        - ディープラーニングを超える性能
        - 少量データ・チューニング不要
        - 出荷後のマイコンで推論&学習
    - 株式会社QuantumCore
        - 2018年設立
    - 次世代多変量時系列（RNN）ソリューション
    - 複雑系力学の応用
        - EchoStateProperty
            - この原理原則に従うと、複雑系の初期状態に依らず同一の入力データが入力された場合、高次元空間に同じ部分が射影される

本セッションで、**リザーバコンピューティング**というものを初めて知りました。少量のデータでディープラーニングを超える成果が出るならすごい夢があるように感じました。もちろん適用範囲が異なる場面もあるので注意は必要だと思いますが、正直ビッグデータで汎用的なモデルよりも個人に特化した予測のほうが需要があるような気がしているので非常に興味深かったです。仕組みに関しては**複雑系力学**の応用らしいのでもう少し調べてみたいと思います。

### 2/13 17:25～18:45 「ITエンジニア本大賞 2020」プレゼン大会

- 司会：高柳 謙
- 特別ゲスト：
    - 永瀬 美穂[アトラクタ]　[@miholovesq](https://twitter.com/miholovesq)
    - 広木 大地[レクター]　[@hiroki_daichi](https://twitter.com/hiroki_daichi)
    - 山下 智也[英治出版]　[@yamanami1985](https://twitter.com/yamanami1985)

{% blogCard https://www.shoeisha.co.jp/campaign/award/2020/result/ %}

毎年楽しみにしているセッションです。今年は自分が投票した本は大賞には選ばれませんでしたが、どちらも非常に興味深い本です。技術書部門大賞に選ばれた「レガシーコードからの脱却」は、レガシーコードを**「どうやって直すか」**ではなく**「どうやって作らないようにするか」**に軸足を置いた本らしいです。どちらかというとアジャイル系に近い本だという印象を受けました。ビジネス部門の大賞に選ばれた「プレゼン資料のデザイン図鑑」は即戦力になりそうなので、ぜひ手元において活用したいと思いました。

🎉🎉2020年の技術書部門大賞🎉🎉
<!-- START MoshimoAffiliateEasyLink --><script type="text/javascript">(function(b,c,f,g,a,d,e){b.MoshimoAffiliateObject=a;b[a]=b[a]||function(){arguments.currentScript=c.currentScript||c.scripts[c.scripts.length-2];(b[a].q=b[a].q||[]).push(arguments)};c.getElementById(a)||(d=c.createElement(f),d.src=g,d.id=a,e=c.getElementsByTagName("body")[0],e.appendChild(d))})(window,document,"script","//dn.msmstatic.com/site/cardlink/bundle.js","msmaflink");msmaflink({"n":"レガシーコードからの脱却 ―ソフトウェアの寿命を延ばし価値を高める9つのプラクティス","b":"オライリージャパン","t":"","d":"https:\/\/m.media-amazon.com","c_p":"","p":["\/images\/I\/51Y2mtMUYwL.jpg"],"u":{"u":"https:\/\/www.amazon.co.jp\/dp\/4873118867","t":"amazon","r_v":""},"aid":{"amazon":"1448335","rakuten":"1448332"},"eid":"zdNvH","s":"s"});</script><div id="msmaflink-zdNvH">リンク</div><!-- MoshimoAffiliateEasyLink END -->
　
🎉🎉2020年のビジネス書部門大賞🎉🎉
<!-- START MoshimoAffiliateEasyLink --><script type="text/javascript">(function(b,c,f,g,a,d,e){b.MoshimoAffiliateObject=a;b[a]=b[a]||function(){arguments.currentScript=c.currentScript||c.scripts[c.scripts.length-2];(b[a].q=b[a].q||[]).push(arguments)};c.getElementById(a)||(d=c.createElement(f),d.src=g,d.id=a,e=c.getElementsByTagName("body")[0],e.appendChild(d))})(window,document,"script","//dn.msmstatic.com/site/cardlink/bundle.js","msmaflink");msmaflink({"n":"プレゼン資料のデザイン図鑑","b":"","t":"","d":"https:\/\/m.media-amazon.com","c_p":"\/images\/I","p":["\/51LgOM6GsXL.jpg","\/51LgOM6GsXL.jpg"],"u":{"u":"https:\/\/www.amazon.co.jp\/dp\/4478105871","t":"amazon","r_v":""},"aid":{"amazon":"1448335","rakuten":"1448332"},"eid":"LGkUk","s":"s"});</script><div id="msmaflink-LGkUk">リンク</div><!-- MoshimoAffiliateEasyLink END -->
　
自分が技術書で投票したのは『Kaggleで勝つデータ分析の技術』でビジネス本は『FACTFULNESS 10の思い込みを乗り越え、データを基に世界を正しく見る習慣』です。「FACTFULNESS」は去年の4月頃読読みましたが本当の意味での**「客観」**とは何かが分かる本なので、ぜひ読んでみて欲しいと思います。冗談抜きで世界の見方が変わります。

<!-- START MoshimoAffiliateEasyLink --><script type="text/javascript">(function(b,c,f,g,a,d,e){b.MoshimoAffiliateObject=a;b[a]=b[a]||function(){arguments.currentScript=c.currentScript||c.scripts[c.scripts.length-2];(b[a].q=b[a].q||[]).push(arguments)};c.getElementById(a)||(d=c.createElement(f),d.src=g,d.id=a,e=c.getElementsByTagName("body")[0],e.appendChild(d))})(window,document,"script","//dn.msmstatic.com/site/cardlink/bundle.js","msmaflink");msmaflink({"n":"FACTFULNESS(ファクトフルネス) 10の思い込みを乗り越え、データを基に世界を正しく見る習慣","b":"日経BP","t":"","d":"https:\/\/m.media-amazon.com","c_p":"\/images\/I","p":["\/51jPX80edlL.jpg","\/61X+L78ZFJL.jpg","\/41vdmPfStTL.jpg","\/411yj1odi0L.jpg","\/51IkFu4QpCL.jpg"],"u":{"u":"https:\/\/www.amazon.co.jp\/dp\/4822289605","t":"amazon","r_v":""},"aid":{"amazon":"1448335","rakuten":"1448332"},"eid":"G28S6","s":"s"});</script><div id="msmaflink-G28S6">リンク</div><!-- MoshimoAffiliateEasyLink END -->

### 2/14 17:25～18:25 雲の中心で愛を叫ぶ！ クラウド横断パネルディスカッション

- 登壇者：
    - 濱田 孝治[クラスメソッド/AWS代表]　[@hamako9999](https://twitter.com/hamako9999)
    - 松村 優大[オルターブース/Azure代表]　[@tsubakimoto_s](https://twitter.com/tsubakimoto_s)
    - 高野 遼[クラウドエース/GCP代表]
- 司会：近藤 佑子[翔泳社]　[@kondoyuko](https://twitter.com/kondoyuko)

{% blogCard https://dev.classmethod.jp/cloud/devsumi2020-report-14-c-8/ %}

これはぜひ上記のレポート（完全版）を読んでいただきたいと思います。各クラウドの代理戦争の様子が窺えます（笑）。特にGCP代表の高野さんの言葉が印象的でした。クラウドみんな仲良くと言うかと思いきや・・・

{% blockquote  %}
お二方押してたので、僕は押さないということで...GCP必ずしも使わなくて良いです！(笑)
だって、そこ大切なところじゃ無いので、エンジニアの大切なところは問題解決なので、
そのための手段でクラウドを、DBとかでそうですね。で、自ずとGCPに落ちてくれば良いな、くらいで(笑)僕は〆ておこうかなと思います。今日はありがとうございました。
{% endblockquote %}

## フォトギャラリー

雰囲気を感じていただければと思ったのでセッション当日の写真を何枚か掲載します。

<div class="justified-gallery">

![受付を３階から撮りました](/cats-cats-cats/gallery/events/devsumi-2020/devsumi2020-1.jpeg)
![「こうしす！」はこち亀のパロディですね](/cats-cats-cats/gallery/events/devsumi-2020/devsumi2020-2.jpeg)
![セッションで配られた昼食です](/cats-cats-cats/gallery/events/devsumi-2020/devsumi2020-3.jpeg)
![ITエンジニア本大賞](/cats-cats-cats/gallery/events/devsumi-2020/devsumi2020-4.jpeg)
![夜の雅叙園](/cats-cats-cats/gallery/events/devsumi-2020/devsumi2020-5.jpeg)
![廊下の様子](/cats-cats-cats/gallery/events/devsumi-2020/devsumi2020-6.jpeg)
![いざ決戦へ](/cats-cats-cats/gallery/events/devsumi-2020/devsumi2020-7.jpeg)
![美味しそう](/cats-cats-cats/gallery/events/devsumi-2020/devsumi2020-8.jpeg)
![こんなにも子供向けのプログラミング本があるのか・・・](/cats-cats-cats/gallery/events/devsumi-2020/devsumi2020-9.jpeg)
![豪華なシャンデリアがある部屋でセッションを聴きます](/cats-cats-cats/gallery/events/devsumi-2020/devsumi2020-10.jpeg)

</div>

## まとめ

今年はコロナの問題があったので開催当日まで気が抜けませんでしたが、無事参加できてよかったです。こういった総合ITカンファレンスは、分野が幅広いので自分が普段接しないジャンルの話が聞けたり技術トレンドを感じることができるので、**視野を広げるにはもってこい**のイベントだと思っています。難点はこのイベントは**人気すぎて**基本的にどのセッションも満席で立ち見になる場合もあるので、来年も今年のように二日間フルで参加できるのであれば一万円払って {% elink 個人スポンサー https://www.seshop.com/product/detail/23412 %}で参加してみたいですね[^2]。

本記事はデブサミに参加したくても諸般の事情で参加できなかった人や、興味があるけどいろいろと悩んでいる人のためになるべく面白さが伝わるように心がけて書きました。本記事を読んでデブサミに興味を持っていただけば幸いです。

{% img /gallery/events/devsumi-2020/devsumi2020-11.jpeg  %}

[^2]: 正直、一万円で事前登録なしでフリーパスで入れて前方の机席でゆったり見れるのであれば美味しいと思います。

## 参考文献

- {% elink デブサミ2020、講演関連資料まとめ：CodeZine（コードジン） https://codezine.jp/article/detail/11981 %}
- {% elink Developers Summit 2020 資料リンクまとめ - Qiita https://qiita.com/h-yoshikawa/items/73dbedd5f1724ee50bc8 %}