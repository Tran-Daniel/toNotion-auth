/**
 * Responds to any HTTP request.
 *
 * @param {!express:Request} req HTTP request context.
 * @param {!express:Response} res HTTP response context.
 */
 const Firestore = require('@google-cloud/firestore');
 // Use your project ID here
 const PROJECTID = 'studious-bit-325802';
 const COLLECTION_NAME = 'jiggle-auth';

 // URLs
 const REDIRECT_URI = "https://us-central1-studious-bit-325802.cloudfunctions.net/notion-auth";
 const NOTION_TOKEN_URI = "https://api.notion.com/v1/oauth/token";
 
 const firestore = new Firestore({
   projectId: PROJECTID,
   timestampsInSnapshots: true
   // NOTE: Don't hardcode your project credentials here.
   // If you have to, export the following to your shell:
   //   GOOGLE_APPLICATION_CREDEAutNTIALS=<path>
   // keyFilename: '/cred/cloud-functions-firestore-000000000000.json',
 });

const dotenv = require("dotenv");
const Base64 = require("Base64");
const axios = require("axios");


// if .env file is located in root directory
dotenv.config();

exports.toNotionAuth = async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');

  if (req.query.code && req.query.code.length) {
    const authHeader = Base64.btoa(process.env.NOTION_CLIENT_ID + ":" + process.env.NOTION_CLIENT_SECRET);
    const tokenRequest = {
      "grant_type": "authorization_code",
      "code": req.query.code,
      "redirect_uri": REDIRECT_URI,
    };

    axios.post(NOTION_TOKEN_URI, tokenRequest, {
      headers: {
        'Authorization': 'Basic ' + authHeader
       }
    }).then((tokenObj) => {
        console.log("THEN!");
        console.log(tokenObj);
        return res.status(200).json(tokenObj.data);
      })
      .catch((err) => {
        console.error("ERROR!");
        console.error(err);
        return res.status(404).json({
          error: 'error while sending token request to Notion',
          err,
        })
      });

  } else if (req.method === 'POST') {
    // store/insert a new document
    const data = (req.body) || {};
    const ttl = Number.parseInt(data.ttl);
    const ciphertext = (data.ciphertext || '')
      .replace(/[^a-zA-Z0-9\-_!.,; ']*/g, '')
      .trim();
    const created = new Date().getTime();

    // .add() will automatically assign an ID
    return firestore.collection(COLLECTION_NAME).add({
      created,
      ttl,
      ciphertext
    }).then(doc => {
      console.info('stored new doc id#', doc.id);
      return res.status(200).send(doc);
    }).catch(err => {
      console.error(err);
      return res.status(404).send({
        error: 'unable to store',
        err
      });
    });
  }
};
