// require('@google-cloud/debug-agent').start({serviceContext: {enableCanary: true}});

const express = require('express');
const app = express();

const path = require('path');

const datasetId = 'pixel_events';
const tableId = 'events';

const pick = (...props) => o => props.reduce((a, e) => ({ ...a, [e]: o[e] ?? null }), {});
const hasAllKeys = (arr) => obj => arr.every(item => obj.hasOwnProperty(item));

const {BigQuery} = require('@google-cloud/bigquery');
const bigquery = new BigQuery();

async function insertRow(rowObj) {
   try {
      // Insert data into a table
      await bigquery
        .dataset(datasetId)
        .table(tableId)
        .insert([rowObj]);
   } catch (e) {
      console.dir(e, { depth: null });
   }
}
 
const handleEvent = function (req, res) {
   if ('/event.gif' !== req.route.path) {
      return res.sendStatus(404).end();
   }

   // Check has required params.
   let hasKeys = hasAllKeys([
      'id',
      'uid',
      'ev',
      'dl',
      'ts',
      'dt',
      'bn',
      'md',
      'ua',

      'host',
      'path',
      'sid',
   ])(req.query);
  
   if ( ! hasKeys) {
      return res.sendStatus(404);
   }

   // Pick out all params we store.
   let obj = pick(
      'id',
      'uid',
      'ev',
      'ed',
      'v',
      'dl',
      'rl',
      'ts',
      'de',
      'sr',
      'vp',
      'cd',
      'dt',
      'bn',
      'md',
      'ua',
      'tz',
      'utm_source',
      'utm_medium',
      'utm_term',
      'utm_content',
      'utm_campaign',

      'host',
      'path',
      'sid',

      // 'value'
   )(req.query);

   obj.ts = obj.ts.substring(0, 10);

   obj.host_path = obj.host + obj.path;

   // obj.ip = req.header('X-Forwarded-For'); // || req.connection.remoteAddress;

   insertRow(obj).then(() => {
      let buffer = Buffer.alloc(35);
      buffer.write('R0lGODlhAQABAIAAAP///wAAACwAAAAAAQABAAACAkQBADs=', 'base64');
      res.writeHead(200, {'Content-Type': 'image/gif'});
      res.end(buffer, 'binary');
   });
}

app.use(express.static(path.join(__dirname, 'storage'), {
   maxAge: '1d',
}));

app.get('/event.gif', handleEvent);
app.post('/event.gif', handleEvent);

const PORT = process.env.PORT || 8080;
// const PORT = 3001;

app.listen(PORT);

module.exports = app;