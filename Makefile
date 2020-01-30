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
		const lmklol = require('./index').lmklol; \
		(async () => { \
			const out = await lmklol(); \
			console.log({ out }); \
		})() \
	"

bootstrap:
	yarn

deploy:
	aws lambda update-function-code --function-name lmklol --zip-file fileb://./dist/dist.zip

invoke:
	aws lambda invoke --function-name lmklol response.json
	cat response.json | jq

invoke-https:
	curl https://0ww5j4iroa.execute-api.eu-central-1.amazonaws.com/lmklol | jq