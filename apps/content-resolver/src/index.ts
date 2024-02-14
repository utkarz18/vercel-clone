import proxy from '@fastify/http-proxy';
import fastify from 'fastify';

const PORT = process.env.PORT || 9000
const PROXY_BASE_PATH = 'https://vercel-clone-test.s3.ap-south-1.amazonaws.com/'

const app = fastify();

app.register(proxy, {
    upstream: PROXY_BASE_PATH,
    prefix: '/',
    preHandler: (request, reply, next) => {
        const hostname = request.hostname;
        const subdomain = hostname.split('.')[0];

        let url = request.raw.url
        if (url == '/') {
            url += 'index.html'
        }
        request.raw.url = `${subdomain}${url}`
        next()
    }
});

app.listen({ port: +PORT }, (err, address) => {
    if (err) throw err
    console.log(`Reverse Proxy Running on port ${PORT}`);
});