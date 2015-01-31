---
layout: page
title: "Publications"
date: 2014-01-17 00:24
comments: true
sharing: true
footer: true
---

# Peer-Reviewed Papers (In Chronological Order)

1.  Asai, M.; Fukunaga, A: 2015. Solving Large Scale Planning Problems with
    Component Macros. In *ICAPS2015*. [pdf](./icaps15-submission7.pdf) submitted version. CAP planner is
    available at <https://github.com/guicho271828/CAP> .
2.  Asai, M.; Fukunaga, A: 2014. Applying Problem Decomposition to Extremely Large
    Planning Domains. Knowledge Engineering for Planning and Scheduling (KEPS) Workshop
    (ICAPS2014). [pdf](keps14.pdf) (~~submitted version~~ -> final version) [poster](./keps14-poster.pdf) [presentation](./keps14/)
3.  Asai, M.; Fukunaga, A: 2014. Fully Automated Cyclic Planning for Large-Scale
    Manufacturing Domains. In *ICAPS2014*. [pdf](icaps14.pdf) [poster](./icaps14-poster.pdf) [presentation](./icaps14/)


Presentation can be moved forward/backward with N/P key.
[For the further help and usage, click here](http://guicho271828.github.io/another-org-info/).

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
