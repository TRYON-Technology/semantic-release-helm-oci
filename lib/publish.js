const fsPromises = require('fs/promises');
const yaml = require('js-yaml');
const execa = require('execa');
const path = require('path');

module.exports = async (pluginConfig, context) => {
  const {logger, nextRelease: {version}} = context;

  const {registry, chartPath = '.', chartPackagePath = '.'} = pluginConfig;

  const chartFilePath = path.resolve(chartPath, 'Chart.yaml');
  const chartPackageFilePath = path.resolve(chartPackagePath, `${ch.name}-${version}.tgz`);
  

  try {
    const ch = yaml.load(await fsPromises.readFile(chartFilePath, 'utf8'));

    await execa('helm', ['push', chartPackageFilePath, registry], {
      env: {HELM_EXPERIMENTAL_OCI: 1}
    });

    logger.log(`Chart published to ${registry}.`);
  } catch (error) {
    logger.error(`Failed to publish chart: ${error.message}`);
    throw error;
  }
};