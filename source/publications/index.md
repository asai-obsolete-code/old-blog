---
layout: page
title: "Publications"
date: 2014-01-17 00:24
comments: true
sharing: true
footer: true
---

# Peer-Reviewed Papers (In Chronological Order)

2.  Asai, M.; Fukunaga, A: 2017. "Exploration Among and Within Plateaus in Greedy Best-First Search". In *ICAPS2017*. [pdf](./icaps17.pdf)
1.  Asai, M.; Fukunaga, A: 2017. "Tie-Breaking Strategies for Cost-Optimal Best First Search." Journal of Artificial Intelligence Research 58 (2017): 67-121.
2.  Asai, M.; Fukunaga, A: 2016. Tiebreaking Strategies for A\* Search: How to Explore the Final Frontier.
    In *AAAI-2016*.  [pdf](./aaai16.pdf) [presentation](http://www.slideshare.net/asaimasataro/tiebreaking-strategies-for-a-search-how-to-explore-the-final-frontier) [poster](./aaai16-poster.pdf).
3.  Asai, M.; Fukunaga, A: 2015. Solving Large-Scale Planning Problems by
    Decomposition and Macro Generation. In *ICAPS2015*. [pdf](./icaps15.pdf) . CAP planner is
    available at <https://github.com/guicho271828/CAP> .
4.  Asai, M.; Fukunaga, A: 2014. Fully Automated Cyclic Planning for Large-Scale
    Manufacturing Domains. In *ICAPS2014*. [pdf](icaps14.pdf) [poster](./icaps14-poster.pdf) [presentation](./icaps14/)

Presentation can be moved forward/backward with N/P key.
[For the further help and usage, click here](http://guicho271828.github.io/another-org-info/).

# Workshop papers

1.  Endo, S; Asai, M.; Fukunaga, A: 2014. Evaluation of a Simple, Window-based, Replanning Approach to Plan
    Optimization. Heuristics and Search for Domain-independent Planning (HSDIP) Workshop
    (ICAPS2016). [pdf](hsdip16.pdf) [presentation](https://guicho271828.github.io/2016-06-13-hsdip/)
2.  Asai, M.; Fukunaga, A: 2014. Applying Problem Decomposition to Extremely Large
    Planning Domains. Knowledge Engineering for Planning and Scheduling (KEPS) Workshop
    (ICAPS2014). [pdf](keps14.pdf) (<del>submitted version</del> -> final version) [poster](./keps14-poster.pdf) [presentation](./keps14/)

# Software

See [my github repo](https://github.com/guicho271828) for the latest activity!


-   [CAP](https://github.com/guicho271828/CAP) &#x2013; Component Abstraction Planner, which decompose the given problem,
    solve each subproblem, make the subplans into macros and then plans in an
    enhanced problem with those macros
    -   1.5 coverage in large domains!
    -   Higer coverage in ipc2011 learning track, without learning time!
-   [PDDL](https://github.com/guicho271828/pddl) &#x2013; A Common Lisp library to read/write/analyse PDDL files. It has
    -   a PDDL reader / parser
    -   CLOS-based object oriented interface to analyse each objects
        -   various useful accessors for objects e.g. predicate/propositions/action/types
        -   methods like `(ground-action action objects)`
    -   a pretty formatter
    -   a simulator (STRIPS and action-costs are supported)
-   [CELL-ASSEMBLY](https://github.com/guicho271828/cell-assembly-pddl-models) &#x2013; The PDDL files and the explanation of a CELL-ASSEMBLY
    manufacturing domain, which appears at [Asai, Fukunaga ICAPS2014]
    -   Is currently enlisted as one of [\`\`Real and Realistic Planning Domains''](http://users.cecs.anu.edu.au/~patrik/sigaps/index.php?n%3DMain.RealDomains)
            by Patrik Haslum
-   [aaai-template](https://github.com/guicho271828/aaai-template) &#x2013; For [org-mode](http://orgmode.org/) lovers and reserchers of artificial intelligence. A
    set of scripts and templates for faster publishing of papers with [AAAI](http://www.aaai.org/)
    style.
    -   Included `Makefile` automates
        -   converting SVG images to grayscale pngs (I recommend Inkscape as an editor)
        -   exporting `.org` files to `.tex` files
        -   typeset the TeX files with pdflatex
        -   checks for any **Overfull hbox**
        -   checks for **paper limit**
    -   Combination of simple scripts `make-periodically`
        would be useful. It waits for the changes, and if a change is detected, it runs
        `make`, then notify the result via `inotify` (pop up inteface available in gtk).
