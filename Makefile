BIN=./node_modules/.bin

test:
	$(BIN)/mocha test/specs/**/*.js

serve:
	python -m SimpleHTTPServer

.PHONY: test
