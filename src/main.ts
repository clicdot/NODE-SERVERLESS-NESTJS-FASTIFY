import { bootstrap } from './app';

async function startLocal() {
  const fastifyInstance = await bootstrap();
  fastifyInstance.instance.listen(3000);
}

startLocal();
