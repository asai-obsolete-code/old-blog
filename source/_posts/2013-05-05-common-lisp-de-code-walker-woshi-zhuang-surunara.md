---
layout: post
title: "Common Lisp で Code Walker を実装するなら"
date: 2013-05-05 22:01
comments: true
categories: 
---


Common Lispを使っていると、みんな一度はマクロでDSLを実装したくなります
よね。みなさんどうしてるでしょう。例えば、自分の作ったマクロ
`my-macro` の中では、特定のS式、たとえば=my-clause= に特殊な意味を持つ
節としての役割を与えたい時。マクロは引数のS式を好きに扱えるので、なんで
もありです。だから、例えば。

<!-- more -->

```cl Walking the tree

(defun walk-tree (fn tree)
  (funcall fn tree
           (lambda (branch)
             (mapcar (lambda (branch)
                       (walk-tree fn branch))
                     branch))))

(defun precompile-1-layer (sym fn form)
  (walk-tree
   (lambda (subform cont)
     (if (and (consp subform)
              (equalp sym (car subform)))
         (apply fn (cdr subform))
         (if (consp subform)
             (funcall cont subform)
             subform)))
   form))
```

みたいなのを定義して、該当シンボルを手動で検知して `macroexpand` の真似
をする、といった手を使うことができちゃいます。

```cl And expand the code!

(defmacro my-macro (&body body)
  `(progn
     ,@(precompile-1-layer
        'my-clause
        (lambda (&body body)
          (progn (print :hi!)
                 ,@body))
        body)))

(my-macro
 (iter (for i below 5)
       (print i)
       (my-clause
        (print :stupid!))))

;; macroexpansion result

(progn
  (iter (for i below 5)
        (print i)
        (progn
          (print :hi!)
          (print :stupid!))))  

```

いやまあ、ここで問題になるのが、 `macrolet` で指定した内容が全然反映され
ないという事ですね。一言で言えば、頭悪い。

```cl Fail example

(my-macro
 (macrolet ((my-clause (&body body)
              (subst :im-not-stupid! :stupid! body)))
   (iter (for i below 5)
         (print i)
         (my-clause
          (print :stupid!)))))

```

```cl After the macroexpantion of `my-macro`

(progn
 (macrolet ((my-clause (&body body)
              (subst :im-not-stupid! :stupid! body)))
  (iter (for i below 5)
        (print i)
        (progn
          (print :hi!)
          (print :stupid!)))))

```

my-clauseをバイパスして展開してしまっているので、内側のmy-clauseが反映
されず、 `:stupid!` が `:im-not-stupid!` に変換されずに残っている。この問
題が、[m2ymさんも言っている](http://m2ym.github.io/blog/2012/04/28/eval-in-macros/) **マクロ内でevalするな** 問題です。

でも、evalしないって辛いです。code walkをするなと言っているのと同様。
じゃあどうすればいいのか。

# 全部Macroletに展開する

これは僕が [inner-conditional](https://github.com/guicho271828/inner-conditional) ではじめに取った手法です。
`macrolet` をどんどんネストさせるわけです。

```cl Macrolet

(defmacro my-macro (&body body)
  `(macrolet ((my-clause (&body body)
                `(progn (print :hi!)
                        ,@body)))
     ,@body))

```

これで今回のコードでは当面の目標は達成されます。でも、問題が・・・。な
にが問題かというと、コンパイル時に変数を触ることができないということ。
例えば上のコードで、

    一回目は〇〇に展開し、二回目は☓☓に展開したい。

とか、

    i回目にはiを用いて … に展開したい。その指定は実行時ではダメで、
    コンパイル時に定数として挿入したい。

とかいう需要があるときにどうするか。

`macrolet` はスペシャルフォームなので、そのマクロ定義だけをletで囲む
なんてことはできません。出来れば嬉しいんだけれどねえ…

```cl Illegal example

(macrolet ((let ((i 0))
             (my-clause (&body body)
                (incf i)
                `(progn (print ,i)
                        ,@body))))
  (do-something))

```

ではどうするか。例を示そうと思ったんですが、例を書くだけでも骨が折れる
ようなコードだったので、続きは次の記事で。
