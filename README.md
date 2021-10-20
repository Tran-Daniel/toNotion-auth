# toNotion-auth
Google Functions dealing with Auth portion of toNotion


## Deployment to GC Functions

Make sure you have [gcloud](https://cloud.google.com/sdk/docs) setup and this repo cloned.

To deploy, run 

```
gcloud init

// Login and navigate to the project

gcloud functions deploy notion-auth --entry-point toNotionAuth --runtime nodejs14 --trigger-http
```

## links

https://cloud.google.com/community/tutorials/cloud-functions-firestore