---
layout: page
title: "Publications"
date: 2014-01-17 00:24
comments: true
sharing: true
footer: true
---

# Peer-Reviewed Papers

-   Asai, M.; Fukunaga, A: 2014. Fully Automated Cyclic Planning for Large-Scale
    Manufacturing Domains. In *ICAPS2014*. [pdf](icaps14.pdf)
-   Asai, M.; Fukunaga, A: 2014. Applying Problem Decomposition to Extremely Large
    Domains. Knowledge Engineering for Planning and Scheduling (KEPS) Workshop
    (ICAPS2014). [pdf](keps14.pdf) (submitted version)

# Softwares

See [my github repo](https://github.com/guicho271828) for the latest activity!

-   PDDL &#x2013; A Common Lisp library to read/write/analyse PDDL files. It has
    -   a PDDL reader
    -   a pretty formatter
    -   a simulator (STRIPS and action-costs are supported)
-   [CELL-ASSEMBLY](https://github.com/guicho271828/cell-assembly-pddl-models) &#x2013; The PDDL files and the explanation of a CELL-ASSEMBLY
    manufacturing domain, which appears at [Asai, Fukunaga ICAPS2014]
-   aaai-template &#x2013; For [org-mode](http://orgmode.org/) lovers and reserchers of artificial intelligence. A
    set of scripts and templates for faster publishing of papers with [AAAI](http://www.aaai.org/)
    style. Images are assumed to be in a SVG format (I recommend Inkscape as an
    editor).
    -   Included `Makefile` automates
        -   converting images to grayscale pngs
        -   exporting `.org` files to `.tex` files
        -   typeset the TeX files with pdflatex
        -   checks for any **Overfull hbox**
        -   checks for **paper limit**
    -   Combination of simple scripts `make-periodically`
        would be useful. It waits for the changes, and if a change is detected, it runs
        `make`, then notify the result via `inotify` (pop up inteface available in gtk).
