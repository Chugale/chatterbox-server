/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/
const fs = require('fs');
const path = require('path');

// const chatterbox = '/Users/ericlee/HackReactor/rfp2303-chatterbox-server/client/scripts';
// fs.readdir(chatterbox);

const messageStorage = [];
let count = 0;
const defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept, authorization',
  'access-control-max-age': 10 // Seconds.
};
const requestHandler = function(request, response) {
  // Request and Response come from node's http module.
  //
  // They include information about both the incoming request, such as
  // headers and URL, and about the outgoing response, such as its status
  // and content.
  //
  // Documentation for both request and response can be found in the HTTP section at
  // http://nodejs.org/documentation/api/

  // Do some basic logging.
  //
  // Adding more logging to your server can be an easy way to get passive
  // debugging help, but you should always be careful about leaving stray
  // console.logs in your code.
  console.log('Serving request type ' + request.method + ' for url ' + request.url);
  // The outgoing status.

  let statusCode = 404;
  let output = 'Server finds nothing';
  let headers = defaultCorsHeaders;
  let url = request.url;
  let type = request.method;
  headers['Content-Type'] = 'application/json';


  if (type === 'OPTIONS') {
    headers = headers;
    statusCode = 202;
    response.writeHead(statusCode, headers);
    response.end();
  } else if (type === 'GET' && url.includes('/classes/messages')) {
    statusCode = 200;
    response.writeHead(statusCode, headers);
    response.end(JSON.stringify(messageStorage));

  } else if (type === 'POST' && url.includes('/classes/messages')) {
    statusCode = 201;
    let body = '';
    request.on('data', function(data) {
      body += data;
    });
    request.on('end', function(end) {
      let post = JSON.parse(body);
      post['message_id'] = count++;
      messageStorage.push(post);
      response.writeHead(statusCode, headers);
      response.end(JSON.stringify(messageStorage));
    });
  } else {
    response.writeHead(statusCode, headers);
    response.end(output);
  }

  // .writeHead() writes to the request line and headers of the response,

  // Make sure to always call response.end() - Node may not send
  // anything back to the client until you do. The string you pass to
  // response.end() will be the body of the response - i.e. what shows
  // up in the browser.
  //
  // Calling .end "flushes" the response's internal buffer, forcing
  // node to actually send all the data over to the client.
};

// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.

module.exports.requestHandler = requestHandler;