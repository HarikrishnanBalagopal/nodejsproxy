const https = require('https');
const fs = require('fs');
const cout = console.log;

/*
const options = {
  key: fs.readFileSync('localhost-privkey.pem'),
  cert: fs.readFileSync('localhost-cert.pem')
};
*/
const options = {
  key: process.env.PRIVKEY,
  cert: process.env.CERT
};

https.createServer(options, (req, res) => {
  const { method, url } = req;
  cout('New request:' + url);
  if(url === '/' || url == '/www.test.com')
  {
  	res.writeHead(200);
  	res.end(fs.readFileSync('index.html'));
  }
  else if(url == '/favicon-32x32.png')
  {
  	res.end(fs.readFileSync('favicon-32x32.png'));
  }
  else if(url == '/favicon-16x16.png')
  {
  	res.end(fs.readFileSync('favicon-16x16.png'));
  }
  else
  {
  	https.get(url.substring(1), (res0) => {
  	const { statusCode } = res0;

  	let error;
  	if(statusCode !== 200)
  	{
    	error = new Error('Request Failed.\n' + `Status Code: ${statusCode}`);
	}
  	if(error)
  	{
    	console.error(error.message);
    	// consume response data to free up memory
    	res0.resume();
    	return;
  	}

  	res0.setEncoding('utf8');
  	let rawData = '';
  	res0.on('data', chunk => {rawData += chunk;});
  	res0.on('end', () => {
  		res.writeHead(200);
		res.end(rawData);
  		});
	}).on('error', err => {console.error(`Got error: ${err.message}`);});
  }
}).listen(process.env.PORT);