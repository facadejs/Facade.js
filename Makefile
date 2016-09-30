BIN=./node_modules/.bin

test:
	$(BIN)/mocha test/specs/**/*.js

.PHONY: test
