---
title: 気が付いたら本棚がキーボード棚に変わっていた話
date: 2018-12-12 07:32:37
thumbnail: /gallery/thumbnails/keyboard_shelf.jpg
toc: true
categories:
    - [DIY, Keyboard]
tags:
    - Keyboard
    - AdventCalendar
---

この記事は自作キーボード #2 Advent Calendar 2018 12日目の記事です。自分はゆるふわでキーボードを楽しみたい勢なので、カジュアルにキーボードを楽しむ方法について書いてみたいと思います。
ガチなモノ作りの記事はすでに多くの人が書かれていると思うので、その途中で箸休め的に読んでいただけると幸いです。

{% blogCard https://adventar.org/calendars/2964 %}


<!-- more -->
## 自作キーボード以前

キーボードにこだわりを持ち始めたのはコンパクトなキーボードを探し始めてからでした。もう15年以上昔の話ですが、その時出会ったのがぷらっとホームが販売していた以下の`FKB8579`です。

{% img /gallery/daily/keyboards/keyboard-001.jpg 300 %}{% img /gallery/daily/keyboards/keyboard-002.jpg 300 %}

気持ち良い打鍵感で10年以上愛用していました。右側の画像はキートップを外したところですが、キースイッチはメンブレンシートです。最近はCherry MX互換やロープロのスイッチしか触っていなかったのでこういうのを見るとほっこりします。
大切に使ってきたのでまだ使えますが、さすがに引退させてあげたいと思ったので次に飛びついたのがARCHISSの{% elink ProgresTouch RETRO TINY http://www.archisite.co.jp/products/archiss/progres-touch/retro-tiny-en %}です。メカニカルキーボードでコンパクトなタイプを探していたらちょうどこのキーボードが発売直後だったので購入しました[^1]。

{% img /gallery/daily/keyboards/keyboard-003.jpg 300 %}

[^1]: 軸は悩みましたがまずは無難に赤軸にしました。

## 自作キーボードに興味を持つ

ProgresTouch RETRO TINYは打ち心地がよく気に入っていたのです、去年あたりから自作キーボードが盛り上がっていると言う噂を聞くようになりました。ただ、はんだ付けが面倒そうだったので様子見していましたが、キー配置のカスタマイズが自由にできるとういうのはやってみたいと思っていました。

しかしその瞬間は唐突に訪れました。去年の11月ごろMassdropから{% elink Planck Light https://www.massdrop.com/buy/massdrop-x-olkb-planck-light-mechanical-keyboard %}が買えるという情報が流れてきたのです。もちろんこのときMassdropもPlanckキーボードのことも欠片も知りませんでしたが、以下の動画を見て一発でやられてしまいました。

{% youtube Gw1oJP-Rj0o %}

やっぱり光るのずるいですね（笑）。あと完成品も販売してくれるとのことだったので、懸念だったはんだ付けも必要がないことも大きかったです。これで念願のキー配置を自由にいじれるということで即座にDropに参加しました。ただこれが過ちの第一歩だとは知らずに・・・
発送予定は2018/5/18となっていて、このときまだ半年先だったので気長に待つことにしました・・・
待つことにしたのですが、Massdropのやつは毎日のようにダイレクトメールを送りつけてきます。無視すればいいだけのことなのですが、ときどき {% elink GMK Red Samurai https://www.massdrop.com/buy/massdrop-x-redsuns-gmk-red-samurai-keycap-set %} のような耐え難い誘惑があり、Dropに参加させられました・・・

## 発狂する

5月初旬にMassdropから一通のメールが来ました。PCBの生産でトラブっていて発送が7月初旬になるということでした。楽しみにしていただけに落ち込みましたが、既に半年近く待っていたのであまり気にしない方向で精神を落ち着けました。ちなみにこのときはまだ自分がはんだ付けをすることになるとはまだ考えていませんでした。このときまでに{% elink QMK firmware https://docs.qmk.fm/#/ %}が動作する完成品を販売している場面を何回か見ていたのでこれが気に入らなかったら別のを買えばいいと考えていたからです。
時が流れて6月に入り大分そわそわしてきたので、GitHubから{% elink QMK firmwareのリポジトリ https://github.com/qmk/qmk_firmware %}を{% elink フォーク https://github.com/hinastory/qmk_firmware %}してキーマップをいじり始めました。このキーマップを考えている瞬間は最高に幸せでした。。。

そしてとうとう7月に入り我が家にPlanck Lightがやってきました。Macにつないで打ってみて動作は問題なさそうでした。そして色々と光らせてこのときは大分テンションが上がりました。そして念願のQMK firmwareを書き込むときが来ました。しかし、不思議なことにfirmwareが書き込まれてくれないのです。
何回も試しました。何回も、何回も・・・
困り果ててMassdropのDiscussionを覗いて見ると、なんとブートローダを書き込むのを忘れたからキー配置をいじれないという旨が公式からアナウンスされていました・・・

**発狂しました**

## 自作キーボードの門を叩く

選択肢はいくつかありました。幸いというか当然というか公式はISPフラッシャーを設計して送ると言っていました。しかしながらこのときは完全に疑心暗鬼になっていて楽観的に待つ気にはなれませんでした。実際に公式の対応は非道いもので、一週間何の音沙汰もないこともしばしばで毎週Discussionで誰かが進捗を尋ねていましたが無応答がほとんどで、罵声が飛ぶような殺伐としてた雰囲気でした[^2]。２つ目の選択肢は自力でブートローダを書き込むことです。一応成功した人もいるようなので試してみる価値はありましたが[^3]、いきなり壊したら立ち直れそうになかったので、諦めて今まで避けてきた第三の選択肢を取ることにしました。

ここに来てようやく自作キーボードの門を叩く決心をしました。本当に長くなってすいません・・・
決心したら行動は早かったです。 {%elink Ergo42 https://booth.pm/ja/items/842147 %} を注文して[^4]、{% elink 秋葉原のマルツ https://www.marutsu.co.jp/pc/static/shop/akihabara %}ではんだごてやテスター等必要な道具を揃えて、届いたらすぐに組み立てはじめました。しかし結局動かなかったのでDiscordの自作キーボードのサーバーの初心者チャンネルで色々な人に助けてもらいながら何とか動作させることができました。このときの感動は何とも言い難いですね。あのとき善意で助けいて頂いた方々には本当に感謝しています。そして辛かったけど本当に乗り越えられてよかったです。

この後は数字キーが欲しくなって{% elink Iris https://keeb.io/products/iris-keyboard-split-ergonomic-keyboard?variant=8034004860958 %}に手をだしました。

{% img /gallery/daily/keyboards/keyboard-004.jpg 300 %}

上のキーボードがIrisで下のキーボードがErgo42です。両方共46キーだったのでこの写真は「46キー姉妹」というタイトルでDiscordに投稿しました。しかし何というかあれだけ欲しかった数字キーも慣れてくるといらなくなりました・・・
結局手首をなるべくリストレストに固定して打つようになるため指が届きにくいキーは不要みたいな感じになりました。

このあとに作ったのは{% elink Mint60 https://booth.pm/ja/items/1057414 %}です。{% elink Maker Faire Tokyo https://makezine.jp/event/mft2018/ %}で買い損ねたので、コミケに始発で乗り込んでゲットしてきました。

{% img /gallery/daily/keyboards/keyboard-006.jpg 300 %}

オシャカワなキーボードが手に入ってとても嬉しかったのですが、残念ながらこの頃には指が`Ortholinear`に慣れてしまっていて、`Row-Staggerd`なMint60は既に打ちづらくなっていました・・・もう少し出会いが早ければ最高の相棒になったかもしれませんが、現在は布教担当として働いてもらっています。

だいたいここまでが自作キーボードを作り始めて1ヶ月くらいですが、一気にモノを増やしすぎたため置き場所に困るようになってきました。もちろんただ積み重ねるだけならできるのですが、キーキャップやスイッチ等は探しやすく見比べやすいようにしたい欲求が高まってきたのでキーボード棚を作ることにしました。

[^2]: 結局ISPフラッシャーはさらに2ヶ月も経って、諦めかけた頃に送られてきましが、firmwareの書き込みは無事成功しました。
[^3]: [Quick and dirty guide to flashing your Planck Light bootloader : olkb](https://www.reddit.com/r/olkb/comments/8tk9jj/quick_and_dirty_guide_to_flashing_your_planck/)
[^4]: 現在は後継の{% elink Ergo42 Towel https://tanoshii-life.booth.pm/items/952695 %}が販売されています。

## キーボード棚の作り方

まずは本棚をご用意ください(笑)。いきなり落ちからはじめて申し訳ございません。実際に自分のキーボード棚は本棚の流用なのでこれ以上何も言うことはないのですが問題が一つありまして、もともとこの本棚には捨てられない本[^5]がぎっしり詰まっていたのです。そこでひたすら {% elink 自炊 https://ja.wikipedia.org/wiki/%E8%87%AA%E7%82%8A_(%E9%9B%BB%E5%AD%90%E6%9B%B8%E7%B1%8D) %}を頑張りました。

{% img /gallery/daily/keyboards/keyboard-007.jpg 300 %}

一気に100冊程自炊したので大分消耗しました。上の写真は自炊道具で、どこのご家庭にもあると思わるごく普通の裁断機とスキャナです[^6] 。ブログ先頭の写真は自作キーボードをはじめて2ヶ月経った頃の写真でキーボード棚を作った当初の写真です。
現在は以下のようになっています。

{% img /gallery/daily/keyboards/keyboard-008.jpg 300 %}

下から2段目は道具を置いています。道具は他にもあるのですが収まりが悪いハンダゴテや腕を増やすツールとかを置いています。一番下の棚は非常に心苦しいのですがいわゆる`積みキーボード`というものです。今年中に何とか進捗を出そうと思っています。
最初は実用重視で作ったキーボード棚ですが、実際に作ってみるとショーケースみたいな感じで毎日眺めていて楽しいので、キーボードの楽しみ方が一つ増えました。これはおすすめです。
ちなみに本棚はあと6台あるので徐々にキーボード棚に変えて行こうと思っています。

[^5]: 決して怪しい本ではないです。
[^6]: スキャナは{% elink ScanSnap S1500M http://scansnap.fujitsu.com/jp/archive/s1500m/ %}です。

## デコキーのすすめ

この記事の冒頭でカジュアルにキーボードを楽しむ方法について書きたいと述べましたが、その一つが`デコキ`ーです。デコキーとは「デコレーションされたキーボード」の略で、ここではシールや紙・布等を両面テープとでキーボードに貼り付けて飾ることを指しています。メイクと同じで`盛りキーボード`と言ってもよいかもしれません。

EndGameという言葉をよく耳にしますが、実際に打ち心地やキー配置はEndGameに近づけられても見た目は必ず飽きがくると思われます。もちろん際限なくキーキャップを変えたり、キーキャップやケーブルやケースやPCB等を自作できる時間と金銭と能力に余裕がある人はいいのですが、世の中の大半の人はそうでないと思われます。
そこでデコキーでカジュアルにキーボードの見た目を変えてみようというのがここでの提案です。
もちろんこのデコキーがしやすいキーボードには前提があってシールを貼る余白が必要です。現在の自作キーボードキットにはデコキーに必要な余白を持つものが非常に少ないのですが、Ergo42はその中では珍しくデコキーと相性が良いと思われます。

{% img /gallery/daily/keyboards/keyboard-009.jpg 300 %}

Ergo42の上部の台形部分にシールを貼るだけで印象はガラッと変わります。この写真では木目調のシールを貼っていますが。この手のシールや紙・布は100均で安く手に入り種類も豊富です。自分もちょっとした気分転換にキーキャップに合わせて気軽に盛り直していますが、簡単な割には満足度は高いです。

{% img /gallery/daily/keyboards/keyboard-010.jpg 300 %}

上のキーボードはRed Samuraiのキーキャップに合わせて台形部分と巻取り式ケーブルに畳縁を貼っており、ケース側面に畳シールを貼っています。
一つ注意点を上げるとすればErgo42にデフォルトで付属しているのは鍋ネジなので、そのままだとシールが浮いてしまうので皿ネジに変える必要があります。また皿ネジにしてもそのままだとまだ少し浮くので適当なドリルでネジが平らになるようにアクリル板を少し凹ませる必要があります。

## 最後に

長々と書いてしまいましたが、自作キーボードの世界に飛び込んで後悔はしていません。最初は面倒だったり怖かったりしたものですが、すぐに助けてくれる気の良いコミュニティがあるので、余計な心配をせずにまずは手を動かしてみることが重要だと気づきました。そして新しく開けた扉の先には、モノを作る楽しさと感動がダイレクトに待っています。何より普段何気なく使っているキーボードに対して理解が増し、不便も解消され、愛着も得られると思います。ただ無理をしすぎると反動が来るので、自分にあったペースで自分にあった楽しみ方を見つけて行きたいという思いでこの記事を書きました。
この記事がキーボードをカジュアルに楽しみたい方や自作キーボードに興味があるけどまだ手を出せていない方の一助になれば幸いです。

`おいでよ、自作キーボードの世界へ`

{% img /gallery/daily/keyboards/keyboard-welcome.jpg 600 %}

この記事はErgo42 with {% elink DSA COFFEE HOUSE" KEYSET https://pimpmykeyboard.com/dsa-coffee-house-keyset/%} & Cherry MX Redで書きました。