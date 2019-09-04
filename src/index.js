var http = require('http')
var https = require('https')
var httpProxy = require('http-proxy')
var colors = require('colors')
var fs = require("fs");
var options = {
  key: fs.readFileSync('./cert.key'),
  cert: fs.readFileSync('./cert.pem')
};
var proxyHttps = httpProxy.createServer({
  ssl: options,
  secure: true // Depends on your needs, could be false.
}).listen(8009);
var proxyHttp = httpProxy.createProxyServer({})

var curHost = null
var curIp = null

// 捕获异常
proxyHttps.on('error', function(err, req, res) {
  res.writeHead(500, {
    'Content-Type': 'text/plain'
  })
  res.end(`
    err: ${err},
  `)
})
// 捕获异常
proxyHttp.on('error', function(err, req, res) {
  res.writeHead(500, {
    'Content-Type': 'text/plain'
  })
  res.end(`
    err: ${err},
  `)
})

// 另外新建一个 HTTPS 443 端口的服务器，也就是常规 Node 创建 HTTP 服务器的方法。
// 在每次请求中，调用 proxyHttps.web(req, res config) 方法进行请求分发
var serverHttps = https.createServer(options,function(req, res) {
  var host = req.headers.host
  var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
  if (host !== curHost || ip !== curIp) {
    curHost = host
    curIp = ip
    console.log(`${new Date().toLocaleString()} :`.green)
    console.log(`	ip: ${ip}`.red)
    console.log(`	host: ${host}`.red)
	}
  // 在这里可以自定义你的路由分发
  switch (host) {
    /*
      -------------- 公司项目
    */
		// PC-Data
    case 'data.xiaomei360.com':
			proxyHttps.web(req, res, { target: `http://127.0.0.1:3000` })
			break

    /*
      商城 -- Mall
    */
		// mall-h5
		case 'mback.xiaomei360.com':
    case 'mjs.xiaomei360.com':
        proxyHttps.web(req, res, { target: `http://127.0.0.1:3001` })
			break
		// mall-pc
		case 'back.xiaomei360.com':
    case 'js.xiaomei360.com':
      proxyHttps.web(req, res, { target: `http://127.0.0.1:3002` })
      break

		// zz-h5
    case 'zzmjs.xiaomei360.com':
    case 'zzmback.xiaomei360.com':
      proxyHttps.web(req, res, { target: `http://127.0.0.1:3006` })
			break
    // zz-backend-pc
    case 'zzadminjs.xiaomei360.com':
    case 'zzbackadmin.xiaomei360.com':
			proxyHttps.web(req, res, { target: `http://127.0.0.1:3007` })
      break;

    // kk-h5
    case 'mjs.chinayanzhi.com':
    case 'mback.chinayanzhi.com':
      proxyHttps.web(req, res, { target: `http://127.0.0.1:3008` })
			break
    // kk-backend-pc
    case 'adminjs.chinayanzhi.com':
    case 'backadmin.chinayanzhi.com':
			proxyHttps.web(req, res, { target: `http://127.0.0.1:3009` })
      break;
    /*
      OA 系统
    */
    case 'oa.xiaomei360.com':
      proxyHttps.web(req, res, { target: `http://127.0.0.1:8000`})
      break;
      
    /**OA 移动端 */
    case 'moa.xiaomei360.com':
      proxyHttps.web(req, res, { target: `http://127.0.0.1:8001`})
    break;

    /**营销系统 */
    case 'op.xiaomei360.com':
    proxyHttps.web(req, res, { target: `http://127.0.0.1:8002`})
    break;


    /*
      -------------- 公司项目
    */

    /*
      -------------- 自己的东西
    */
    case 'pm.com':
      proxyHttps.web(req, res, { target: `http://127.0.0.1:3088`})
      break;
    // bff
    case 'bff.com':
      proxyHttps.web(req, res, { target: `http://127.0.0.1:3008`})
      break;
    /*
      -------------- 自己的东西
    */

    default:
      res.writeHead(200, {
        'Content-Type': 'text/plain'
      })
      res.end('the port haven\'t serverHttps !!')
  }
})
var serverHttp = http.createServer(function(req, res) {
  var host = req.headers.host
  var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
  if (host !== curHost || ip !== curIp) {
    curHost = host
    curIp = ip
    console.log(`${new Date().toLocaleString()} :`.green)
    console.log(`	ip: ${ip}`.red)
    console.log(`	host: ${host}`.red)
	}
  // 在这里可以自定义你的路由分发
  switch (host) {
    /*
      -------------- 公司项目
    */
		// PC-Data
    case 'data.xiaomei360.com':
			proxyHttp.web(req, res, { target: `http://127.0.0.1:3000` })
			break

    /*
      商城 -- Mall
    */
		// mall-h5
		case 'mback.xiaomei360.com':
    case 'mjs.xiaomei360.com':
        proxyHttp.web(req, res, { target: `http://127.0.0.1:3001` })
			break
		// mall-pc
		case 'back.xiaomei360.com':
    case 'js.xiaomei360.com':
      proxyHttp.web(req, res, { target: `http://127.0.0.1:3002` })
      break

		// zz-h5
    case 'zzmjs.xiaomei360.com':
    case 'zzmback.xiaomei360.com':
      proxyHttp.web(req, res, { target: `http://127.0.0.1:3006` })
			break
    // zz-backend-pc
    case 'zzadminjs.xiaomei360.com':
    case 'zzbackadmin.xiaomei360.com':
			proxyHttp.web(req, res, { target: `http://127.0.0.1:3007` })
      break;

    // kk-h5
    case 'mjs.chinayanzhi.com':
    case 'mback.chinayanzhi.com':
      proxyHttp.web(req, res, { target: `http://127.0.0.1:3008` })
			break
    // kk-backend-pc
    case 'adminjs.chinayanzhi.com':
    case 'backadmin.chinayanzhi.com':
			proxyHttp.web(req, res, { target: `http://127.0.0.1:3009` })
      break;
    /*
      OA 系统
    */
    case 'oa.xiaomei360.com':
      proxyHttp.web(req, res, { target: `http://127.0.0.1:8000`})
      break;
    /*
      -------------- 公司项目
    */
    /**OA 移动端 */
    case 'moa.xiaomei360.com':
      proxyHttps.web(req, res, { target: `http://127.0.0.1:8001`})
      break;

    /**营销系统 */
    case 'op.xiaomei360.com':
    proxyHttps.web(req, res, { target: `http://127.0.0.1:8002`})
    break;

    /*
      -------------- 自己的东西
    */
    case 'pm.com':
      proxyHttp.web(req, res, { target: `http://127.0.0.1:3088`})
      break;
    // bff
    case 'bff.com':
      proxyHttp.web(req, res, { target: `http://127.0.0.1:3008`})
      break;
    /*
      -------------- 自己的东西
    */

    default:
      res.writeHead(200, {
        'Content-Type': 'text/plain'
      })
      res.end('the port haven\'t serverHttps !!')
  }
})

serverHttp.listen(80, () => {
  console.log(`listening on port 80`)
})

serverHttps.listen(443, () => {
  console.log(`listening on port 443`)
})