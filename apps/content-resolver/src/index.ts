import fastify from 'fastify'
import proxy from '@fastify/http-proxy'

const PORT = process.env.PORT || 8000
const PROXY_BASE_PATH = 'https://vercel-clone-test.s3.ap-south-1.amazonaws.com/hello_builder/'

const app = fastify();

app.register(proxy, {
    upstream: PROXY_BASE_PATH,
    prefix: '/',
});

app.listen({ port: 8000 }, (err, address) => {
    if (err) throw err
    console.log(`Reverse Proxy Running on port ${PORT}`);
});