(use-package :alexandria)
(cl-syntax:use-syntax :annot)

(define-condition undefined-clause (simple-condition)
  ((form :initarg :form :accessor form)
   (environment :initarg :environment :accessor environment))
  (:report (lambda (c s)
	     (format s "~a~% is not a bound macro in ~a"
		     (form c)
		     (environment c)))))

(defmacro my-clause (&whole form &body body &environment env)
  @ignore body
  (restart-case (error 'undefined-clause :form form :environment env)
    (use-value (c)
      :interactive (lambda () (read))
      c)))


(let (previous-hooks)
  (defmacro my-macro-start ()
    (push *macroexpand-hook* previous-hooks)
    (let ((i 0) (prev (car previous-hooks)))
      (flet ((hook (expander form env)
	       (handler-bind
		   ((undefined-clause 
		     (lambda (c)
		       (incf i)
		       (use-value
			`(format
			  t "~%~ath expansion of my-clause~%~
                             ~a" ,i ',(form c))))))
		 (funcall prev expander form env))))
	(setf *macroexpand-hook* #'hook)
	`(progn))))

  (defmacro my-macro-end ()
    (setf *macroexpand-hook* (pop previous-hooks))
    `(progn)))

(defmacro my-macro (&body body)
  `(progn
     (my-macro-start)
     ,@body
     (my-macro-end)))

(my-macro
  (print :hi)
  (my-clause
    (print :ok)
    (print :fine))
  (macrolet ((my-clause (&body body)
		`(progn
		   ,@(loop for form in body
			collect '(print :expanded-by-macrolet)))))
    (my-clause
      (print :this-is-ignored)
      (print (+ 1 2 3))
      (print :this-is-ignored)))
  (print :im-hungry-where-is-supper!)
  (my-clause
    (print :not-ok)
    (print :bad))
  (print :bye))

;; --> macroexpand-1 result

(PROGN
 (MY-MACRO-START) ;; macroexpanding this clause causes a side-effect
 (PRINT :HI)
 (MY-CLAUSE
   (PRINT :OK)
   (PRINT :FINE))
 (MACROLET ((MY-CLAUSE (&BODY BODY)
              `(PROGN
                ,@(LOOP FOR FORM IN BODY
                        COLLECT '(PRINT :EXPANDED-BY-MACROLET)))))
   (MY-CLAUSE
     (PRINT :THIS-IS-IGNORED)
     (PRINT (+ 1 2 3))
     (PRINT :THIS-IS-IGNORED)))
 (PRINT :IM-HUNGRY-WHERE-IS-SUPPER!)
 (MY-CLAUSE
   (PRINT :NOT-OK)
   (PRINT :BAD))
 (PRINT :BYE)
 (MY-MACRO-END))

;; --> full expansion result 
;; (expected, since C-c C-m doesn't handle local macro)

(PROGN
 (PROGN)
 (PRINT :HI)
 (FORMAT T "~%~ath expansion of my-clause~%~
                              ~a"
         1
         '(MY-CLAUSE
            (PRINT :OK)
            (PRINT :FINE)))
 (PROGN
   (PRINT :EXPANDED-BY-MACROLET)
   (PRINT :EXPANDED-BY-MACROLET)
   (PRINT :EXPANDED-BY-MACROLET))
 (PRINT :IM-HUNGRY-WHERE-IS-SUPPER!)
 (FORMAT T "~%~ath expansion of my-clause~%~
                              ~a"
         2
         '(MY-CLAUSE
            (PRINT :NOT-OK)
            (PRINT :BAD)))
 (PRINT :BYE)
 (PROGN))

;; --> print result
;; 
;; :HI 
;; 1th expansion of my-clause
;; (MY-CLAUSE
;;   (PRINT OK)
;;   (PRINT FINE))
;; :EXPANDED-BY-MACROLET 
;; :EXPANDED-BY-MACROLET 
;; :EXPANDED-BY-MACROLET 
;; :IM-HUNGRY-WHERE-IS-SUPPER! 
;; 2th expansion of my-clause
;; (MY-CLAUSE
;;   (PRINT NOT-OK)
;;   (PRINT BAD))
;; :BYE 
;; NIL
;; CL-USER> 