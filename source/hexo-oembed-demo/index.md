---
title: hexo-oembed demo page
no_share: true
no_meta: true
sitemap: false
---

## About

This is hexo-oembed plugin demo page.

https://github.com/hinastory/hexo-oembed

## oEmbed derivery compatible site demo

### YouTube
{% code Hexo tag %}
{% raw %}{% oembed https://www.youtube.com/watch?v=SX_ViT4Ra7k %}{% endraw %}
{% endcode %}

{% oembed https://www.youtube.com/watch?v=SX_ViT4Ra7k %}


### Twitter
{% code Hexo tag %}
{% raw %}{% oembed https://twitter.com/hinastory999/status/1089514744174632960 %}{% endraw %}
{% endcode %}

{% oembed https://twitter.com/hinastory999/status/1089514744174632960 %}

### CodePen

{% code Hexo tag %}
{% raw %}{% oembed https://codepen.io/hinastory/pen/ZwxjvK %}{% endraw %}
{% endcode %}

{% oembed https://codepen.io/hinastory/pen/ZwxjvK %}

### Speaker Deck

{% code Hexo tag %}
{% raw %}{% oembed https://speakerdeck.com/ladicle/recap-kubecon-plus-cloud-nativecon-north-america-2018-overview %}{% endraw %}
{% endcode %}

{% oembed https://speakerdeck.com/ladicle/recap-kubecon-plus-cloud-nativecon-north-america-2018-overview %}


### SlideShare

{% code Hexo tag %}
{% raw %}{% oembed https://www.slideshare.net/Odersky/preparing-for-scala-3 %}{% endraw %}
{% endcode %}

{% oembed https://www.slideshare.net/Odersky/preparing-for-scala-3 %}


### Vimeo

{% code Hexo tag %}
{% raw %}{% oembed https://vimeo.com/311121738 %}{% endraw %}
{% endcode %}

{% oembed https://vimeo.com/311121738 %}

### pixiv

{% code Hexo tag %}
{% raw %}{% oembed https://www.pixiv.net/member_illust.php?mode=medium&illust_id=73112765 %}{% endraw %}
{% endcode %}

{% oembed https://www.pixiv.net/member_illust.php?mode=medium&illust_id=73112765 %}

### TED

{% code Hexo tag %}
{% raw %}{% oembed  https://www.ted.com/talks/susan_etlinger_what_do_we_do_with_all_this_big_data %}{% endraw %}
{% endcode %}

{% oembed  https://www.ted.com/talks/susan_etlinger_what_do_we_do_with_all_this_big_data %}


### Hatena Blog

{% code Hexo tag %}
{% raw %}{% oembed https://rheb.hatenablog.com/entry/rhel8-python %}{% endraw %}
{% endcode %}

{% oembed  https://rheb.hatenablog.com/entry/rhel8-python %}


## oEmbed compatible (not support derivery) site demo

### flickr

{% code Hexo tag %}
{% raw %}{% oembed https://www.flickr.com/photos/blueocean64/23831182193/in/photolist-CiT3cB-8Xbpns-quxdK6-cxB7vf-81BAtk-qC3LMs-bsndSq-81BAtt-wMHSBN-968ZuJ-7QdcHk-db2PFA-nZej15-7eQU7R-81BAti-egYg7p-dXL2hM-eUzjBM-81BAsx-2aVgqBo-4v2775-8DZJiq-aNfwDM-6M32zM-8HfqGw-mW86ZG-8DLjGC-4Yuujs-8Xbpa3-7FwpTe-52Vouq-5FT3Xr-cfXkk7-4YnhUK-9uhCgE-pTVRrq-aNJhs4-rYiKwt-7CjqHW-4jj4cZ-85EEX3-cr4wTW-ns4uE2-WjeQmQ-bJQyaM-fPTxwt-7TH4Dc-cr4wpG-oWgvSG-8X8oux %}{% endraw %}
{% endcode %}

{% code lang:yaml endpoint configuration %}
flickr:
      match: flickr
      url: http://www.flickr.com/services/oembed/
{% endcode %}

{% oembed https://www.flickr.com/photos/blueocean64/23831182193/in/photolist-CiT3cB-8Xbpns-quxdK6-cxB7vf-81BAtk-qC3LMs-bsndSq-81BAtt-wMHSBN-968ZuJ-7QdcHk-db2PFA-nZej15-7eQU7R-81BAti-egYg7p-dXL2hM-eUzjBM-81BAsx-2aVgqBo-4v2775-8DZJiq-aNfwDM-6M32zM-8HfqGw-mW86ZG-8DLjGC-4Yuujs-8Xbpa3-7FwpTe-52Vouq-5FT3Xr-cfXkk7-4YnhUK-9uhCgE-pTVRrq-aNJhs4-rYiKwt-7CjqHW-4jj4cZ-85EEX3-cr4wTW-ns4uE2-WjeQmQ-bJQyaM-fPTxwt-7TH4Dc-cr4wpG-oWgvSG-8X8oux %}

### Instagram

{% code Hexo tag %}
{% raw %}{% oembed https://www.instagram.com/p/BCOEogDOmpO/ %}{% endraw %}
{% endcode %}

{% code lang:yaml endpoint configuration %}
instagram:
      match: instagram
      url: http://api.instagram.com/oembed/
{% endcode %}

{% oembed https://www.instagram.com/p/BCOEogDOmpO/ 600 600 %}


### Gyazo

{% code Hexo tag %}
{% raw %}{% oembed https://gyazo.com/1fe1c370e1e82957b4f10b174fa02fef %}{% endraw %}
{% endcode %}

{% code lang:yaml endpoint configuration %}
gyazo:
      match: gyazo
      url: https://api.gyazo.com/api/oembed/
{% endcode %}

{% oembed https://gyazo.com/1fe1c370e1e82957b4f10b174fa02fef %}

## More infomation

hexo-oembed related posts(Japanese)

- {% post_link hexo-oembed-1 %}
- {% post_link hexo-oembed-2 %}