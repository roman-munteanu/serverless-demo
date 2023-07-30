serverless-demo
-----

Install dependencies:
```
npm install

npm install serverless-pseudo-parameters

npm install uuid

npm install aws-sdk

npm install @aws-sdk/types
```

Deploy:
```
sls deploy --verbose
```

Deploy just the function:
```
sls deploy -f createSong --verbose
```
