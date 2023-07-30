serverless-demo
-----

Install dependencies:
```
npm install

npm install serverless-pseudo-parameters

npm install uuid

npm install aws-sdk

npm install @aws-sdk/types

npm install http-errors
```

Deploy:
```
sls deploy --verbose
```

Deploy just the function:
```
sls deploy -f createSong --verbose
```
