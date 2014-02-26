---
layout: post
title: "紹介: ライブラリ Inner-conditional"
date: 2013-05-06 20:41
comments: true
categories: 
---


[inner-conditional](https://github.com/guicho271828/inner-conditional) の紹介をします。

# Q.なにができるの?

A. ループ(など)の中の条件判定を、内側に書いたままで外側に出せます。

<!-- more -->

```cl 
(with-inner (body)
    (iter (for i from 0 to 5)
          (print i)
          (inner (body)
            (if flag
                (body (princ "loop on"))
                (body (princ "loop off"))))))
```

と書くと、

```cl 
(IF FLAG
    (WITH-INNER (BODY)
      (ITER
        (FOR I FROM 0 TO 5)
        (PRINT I)
        (PROGN (PRINC "loop on"))))
    (WITH-INNER (BODY)
      (ITER
        (FOR I FROM 0 TO 5)
        (PRINT I)
        (PROGN (PRINC "loop off")))))

```

になって、

```cl 
(IF FLAG
    (PROGN
     (ITER
       (FOR I FROM 0 TO 5)
       (PRINT I)
       (PROGN (PRINC "loop on"))))
    (PROGN
     (ITER
       (FOR I FROM 0 TO 5)
       (PRINT I)
       (PROGN (PRINC "loop off")))))

```

になります。うふふ、いいでしょ。キモイ？

この種のループ最適化というと、もとから全て行なってくれるような、とって
も優れた処理系もあるかもしれませんが、なにせ実際に動いているのかどうか
わかりません。(C言語とかって、賢いコンパイラはこういうのが全部デフォルト
で付いているんですかね？) sbclでテストをした結果、 **たしかに** [条件判定
の分だけ早くなっていることが確認出来ました。](https://github.com/guicho271828/inner-conditional/blob/master/opt-results.org)

条件判定のタイミングは `with-inner` の部分ですので、 `with-inner` をど
こに置くかで判定のタイミングを適切に設定できます。

```cl 
(with-inner (body)
  (iter (for i from 0 to 5)
        (with-inner (body2)
          (iter (for j from 0 to 5)
                (format t "~%i: ~a j: ~a" i j)
                (inner (body2)
                  (if (evenp i)
                      (body2 (format t "  i is even"))
                      (body2 (format t "  i is odd"))))
                (inner-if body flag
                          (format t "  loop on")
                          (format t "  loop off"))))))
```

この例では、 `body` レベルでの条件判定は一番上で、一方 `body2` レベルの
条件判定はループの二段目で行えます。 `inner` の方、すなわり条件判定の内
容を実際に書いている方で、そのレベルを指定できます。 `(inner-if body
...)` というのは構文糖で、 `(inner (body) (if ... (body ...)))` に展開
されるマクロです。ほかにも数種類あります。


`inner` 内で使えるのは `if` だけじゃありません。 `cond` でも、 `case`
でも、オレオレマクロでもなんでも大丈夫です。特殊なマクロで制御構造を登
録する必要はありません。必要なのはこれだけ、すなわち、

    継続であるかのように body を呼ぶこと

です。

```cl 
(with-inner (body)
  (iter
    (for i from 0 to 5)
    (inner (body)
      (case (progn (incf count)
                   (mod arg 3))
        (0 (body (format t "divided. i*3 =~a~%"
                         (* i 3))
                 (format t "divided. i*3 =~a~%"
                         (* i 3))))
        (1 (body (format t "modulo 1. i*3 + 1 =~a~%"
                         (+ 1 (* i 3)))))
        (2 (body (format t "modulo 2. i*3 + 2 =~a~%"
                         (+ 2 (* i 3)))))))))
```

だってほら、全然違いますけど、内側と外側がひっくり返るじゃないですか。
プログラムは実際には **一番最初に** 条件分岐をして、そして `inner` の中身
が `body` の引数を代入した状態で実行されるんです。似てませんか？ **継続
に！**

続きはまた今度。このライブラリのもうひとつのいいところ、 あなたのライブ
ラリに、 **条件分岐を隠したまま最適化できる能力** を与えられる点について
お話しします。
