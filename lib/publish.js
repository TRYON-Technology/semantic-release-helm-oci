import fsPromises from  'fs/promises';
import yaml from  'js-yaml';
import execa from  'execa';

export default async (pluginConfig, context) => {
  const {logger, nextRelease: {version}} = context;

  const {registry, chartPath = '.'} = pluginConfig;

  const chartFilePath = path.resolve(chartPath, 'Chart.yaml');

  try {
    const ch = yaml.load(await fsPromises.readFile(chartFilePath, 'utf8'));

    await execa('helm', ['push', `${ch.name}-${version}.tgz`, registry], {
      env: {HELM_EXPERIMENTAL_OCI: 1}
    });

    logger.log(`Chart published to ${registry}.`);
  } catch (error) {
    logger.error(`Failed to publish chart: ${error.message}`);
    throw error;
  }
};

