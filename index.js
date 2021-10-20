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
 
 const firestore = new Firestore({
   projectId: PROJECTID,
   timestampsInSnapshots: true
   // NOTE: Don't hardcode your project credentials here.
   // If you have to, export the following to your shell:
   //   GOOGLE_APPLICATION_CREDEAutNTIALS=<path>
   // keyFilename: '/cred/cloud-functions-firestore-000000000000.json',
 });

let dotenv = require("dotenv");

// if .env file is located in root directory
dotenv.config();

exports.toNotionAuth = async (req, res) => {

  res.set('Access-Control-Allow-Origin', '*');

  if (req.method === 'OPTIONS') {
    // Send response to OPTIONS requests
    res.set('Access-Control-Allow-Methods', 'GET');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    res.set('Access-Control-Max-Age', '3600');
    res.status(204).send('');
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
