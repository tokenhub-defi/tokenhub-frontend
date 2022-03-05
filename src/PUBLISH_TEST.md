# PUBLISH TO SERVER TEST

## Command

```export NODE_OPTIONS=--openssl-legacy-provider```

## Command
```./node_modules/.bin/env-cmd -f ./neardev/dev-account.env ./node_modules/.bin/react-scripts build src/index.html --public-url ./```

## Command
```rsync -av --delete ./build/ vultr-centos7-squid-tokenhub:/home/tokenhub/tokenhub-sandbox/```