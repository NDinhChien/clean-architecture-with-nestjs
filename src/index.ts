import 'reflect-metadata';
import 'module-alias/register';
import { ServerApplication } from './app/ServerApplication';

(async (): Promise<void> => {
  await runApplication();
})();

async function runApplication(): Promise<void> {
  const serverApplication: ServerApplication = ServerApplication.new();
  await serverApplication.run();
}
