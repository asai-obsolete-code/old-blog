---
layout: post
title: "Recursive Macroexpansion"
date: 2014-05-04 15:56:33 +0900
comments: true
categories: 
---


> Yesterday, as a holiday coding, I made yet another macro-expansion system which
> allows for easier compile-time error handling, which I previously described in
> [this post](http://qiita.com/guicho271828/items/07ba4ff11bff494dc03f).

昨日、ゴールデンウィークの遊びコーディングとして、
[前々から言っていた](http://qiita.com/guicho271828/items/07ba4ff11bff494dc03f) ものに相当する、
リスタートやコンディションと密に連携できるマクロ展開システムを作りました。

> Some people may already know that this idea is not so new at all.
> In 
> [this post](http://ja.reddit.com/r/lisp/comments/1xyux9/macro_system_common_lisp_is_still_hard_to_satisfy/cffz33l)
> , nsiivola said that we can alternatively use an implementation-specific
> `macroexpand-all`. Also, `macroexpand-dammit` tries to give the similar feature
> within ANSI CL.

色々とすでに言われているように実は、
このライブラリ自体にそんなに新規性はありません。
まず、同じことを達成するためには、
[nsiivola さんの言った](http://ja.reddit.com/r/lisp/comments/1xyux9/macro_system_common_lisp_is_still_hard_to_satisfy/cffz33l)ように、
マクロの中で実装依存の `macroexpand-all` を使うという手がありました。
他にも、ANSI CL の中だけで似た機能を作ろうと頑張っている、
 `macroexpand-dammit` を使うという手もありました。

> So why I made it? The first reason is that I didn't want to use the implementation
> specific feature. The second is that, I didn't want to use `macroexpand-dammit`
> which I have a bitter experience with it.
> When I once saw it, it was not maintained, the implementation was tricky,
> it has a bug, lacks test codes, and was also depended by some other famous library SXML, which I have no idea
> about and also lacks test codes.

ではなぜ作ったのか?
第一に、実装依存の要素を使うというのはあまり好きではありませんでした。
第二に、これは完全に個人的な理由なんですが、
`macroexpand-dammit` には苦い経験があるのであまり使いたくなかったというわけです。
このライブラリ、まず実装がトリッキー、バグが在る、テストコードがない、という問題だ
らけのライブラリでした。

> I once tried to maintain it on github and have my repo followed in quicklisp thanks to
> zach, but my change made some errors in those dependent libraries, and
> honestly I failed. I neglected. Currently quicklisp follows the older version. 
> And I lack my interest now. (However, now I see some issues
> message from someone, so maybe I'll try again)

一度、これを直してgithub上でメンテナっぽく振る舞おうと思い、quicklispにも申請したの
ですが、
これを治そうとすると、実は有名なライブラリSXMLがこれに依存しているらしく、そこのコー
ドを壊してしまうそうです。
で、さらに悪いことに、「メンテナになるよー」と一旦言ったにも関わらず
個人的に時間が取れなくて放置してしまったため、
zachさんには「メンテ出来ないならメンテナになろうとするな」と。正論ですね。すみませ
ん。そんなこんなで、苦い経験だったので触りたくなかったのです。(なんか今見たら
issueが飛んできていますね・・・そろそろ頑張り直すかも。)

> Recursive-Macroexpansion has the completely different expansion algorithm than
> those of Common Lisp’s macro expansion. CL is based on macroexpand-1 and
> macroexpand while Recursive-Macroexpansion is based on rmacroexpand only. However,
> normal macros are transparent to macroexpand, so mixing normal macro and recursive
> macro is completely ok.

Recursive-Macroexpansion は普通の Common Lisp の展開とは別のアルゴリズムで
式を展開します。 CL での展開は macroexpand-1 と
macroexpand でできていますが、 Recursive-Macroexpansion は `rmacroexpand` だけで出
来ています。 `rmacroexpand` は、対応する recursive-macro がなかった場合
普通の `defmacro` で定義されたマクロを探し、普通の `macroexpand-1` で展開するので、
`recursive-macro` と普通のマクロを混ぜることは全く問題ありません。

> **BIG NOTE** : This is my FIRST library written in controversial CL21. Thanks to
> Fukamachi !  The reason I chose CL21 is simply because I was interested in it and
> want to try it. However, adoption of *CLtL2 Sec.8 environment* was also a key
> factor, because it uses `augment-environment` many times.

これはまあCL21で作った最初のライブラリです。使いながらCL21のバグフィック
スもいくつかしました。 深町さんGJ!
CL21を使った理由は、まあ使ってみて感触を試してみたかったというのもありますが、
CLtL2の `&environment` 構造体関連の関数がCL21ではデフォルトで入っているというのが
鍵でした。実装は `augment-environment` に多分に依存しています。(これをしてしまうと、
実装依存の `macroexpand-all` とどう違うんだと言われてしまうかもしれませんが・・・)

<https://github.com/guicho271828/recursive-macroexpansion>

Lisp on OpenCL は少しずつやってますがあんまり進展はないので、次回はマクロの話をまた
英語併記でやります。
