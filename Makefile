BIN=node_modules/.bin

test:
	$(BIN)/grunt test

docs:
	$(BIN)/grunt doxdox

.PHONY: docs
