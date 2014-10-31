
FILES=find ./ -regex ".*\(\.jpg\|\.png\)"
SBB=$(FILES) | sed -e "s/\(.*\)\/\(.*\)\..*/\1\/\2\.sbb/g"
MBB=$(FILES) | sed -e "s/\(.*\)\/\(.*\)\..*/\1\/\2\.mbb/g"
XBB=$(FILES) | sed -e "s/\(.*\)\/\(.*\)\..*/\1\/\2\.xbb/g"

.PHONY:	clean all

all: 
	$(MAKE) -C ./ $(shell $(XBB))

%.mbb : %.jpg
	ebb -O -m $< > $@
%.mbb : %.png
	ebb -O -m $< > $@

%.sbb : %.jpg
	ebb -O $< > $@		# standard bb
%.sbb : %.png
	ebb -O $< > $@		# standard bb

%.xbb : %.jpg
	ebb -O -x $< > $@
%.xbb : %.png
	ebb -O -x $< > $@

clean:
	-rm -f $$(find ./ -regex ".*bb")

