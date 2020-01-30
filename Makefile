clean:
	rm -rf dist/

clean-cache:
	rm /tmp/keyv-file/store.json

build-bundle: clean
	yarn rollup -c

archive-bundle:
	cd dist/ && zip dist.zip index.js

bundle: build-bundle archive-bundle

run-bundle:
	cp .env dist/
	cd dist/ && node -e " \
		const lmklol = require('./index'); \
		(async () => { \
			const out = await lmklol(); \
			console.log({ out }); \
		})() \
	"