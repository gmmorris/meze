# Banquet
All [Restify](http://restify.com/)'s public API in Component form
## Server()
Props:
```json
{
  restify?: Object,
  certificate?: string,
  key?: string,
  formatters?: Object,
  log?: Object,
  name?: string,
  spdy?: Object,
  version?: string | Array<string>,
  handleUpgrades?: boolean,
  httpsServerOptions?: Object,
  children?: any
}
```
### Use({ server, handler })
## Plugins
**Throttle({burst, rate, ip, overrides })**

**CORS({origins, credentials, headers })**

**QueryParser ({ mapParams })**

**BodyParser ({ maxBodySize, mapParams, mapFiles, overrideParams, multipartHandler, multipartFileHandler, keepExtensions, uploadDir, multiples, hash })**

**AuthorizationParser**

**ConditionalRequest**

**DateParser**

**GzipResponse**

**Jsonp**

**RequestExpiry**

## On
## Methods
**Get**

**Head**

**Put**

**Post**

**Delete**

**Handler**

## Response
