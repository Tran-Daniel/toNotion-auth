# toNotion-auth
Google Functions dealing with Auth portion of toNotion


## Deployment to GC Functions

Make sure you have [gcloud](https://cloud.google.com/sdk/docs) setup and this repo cloned.

To deploy, run 

```
gcloud init

// Login and navigate to the project

gcloud functions deploy notion-auth --entry-point toNotionAuth --env-vars-file .env.yaml --runtime nodejs14 --trigger-http
```

You will also need an .env.yaml file with the following values:

NOTION_CLIENT_ID
NOTION_CLIENT_SECRET

## links

https://cloud.google.com/community/tutorials/cloud-functions-firestore
