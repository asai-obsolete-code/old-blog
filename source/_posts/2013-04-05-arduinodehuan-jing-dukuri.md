---
layout: post
title: "Arduinoで環境づくり"
date: 2013-04-05 17:59
comments: true
categories: 
---


Arduinoボードを買いました。
お金ないのに・・・でも部のためなら仕方ない。

![Arduino Leonardo](images/arduino.jpg)

さて、最初に早速詰まったんだけど、
Ubuntuのリポジトリに入ってるArduinoのSDKは最新版じゃない。
そのせいで、Leonardoは対応してない。プログラムをアップロードできない。
**公式から最新版を得てくること。**

で、いくつかやったら一瞬でサーボモータを動かせて驚愕する。
これはスゴイ。
Arduinoのマイコンプログラミングの敷居下げ能力はすばらしいぞ。

そういうことで、環境づくり。
Emacsユーザなので、もちろん純正のjavaアプレットみたいなエディタは気に
入らない。結局半日かかった。

[arduino-mode](https://github.com/bookest/arduino-mode) と [Arduino-Make](https://github.com/mjoldfield/Arduino-Makefile) を導入。しかし・・・アップロードできない。

Arduino Leonardoは、[公式](http://arduino.cc/en/Main/arduinoBoardLeonardo)にあるように、ブートローダーの仕様がUnoらとは
異なっている。安くするためのワンチップ構成が仇となっている。
Arduino-Make はそこのところを無視しているためアップロードできないのだ。
速攻で[Forkして](https://github.com/mjoldfield/Arduino-Makefile) [直してPull Request投げてやった](https://github.com/mjoldfield/Arduino-Makefile/pull/37)。人のコード使ってだけど。

さて何つくろうか。
