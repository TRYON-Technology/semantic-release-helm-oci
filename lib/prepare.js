const fsPromises = require('fs/promises');
const execa = require('execa');
const yaml = require('js-yaml');
const path = require('path');

module.exports = async (pluginConfig, context) => {
  const {logger, nextRelease: {version}} = context;
  const {chartPath = '.', chartPackagePath = '.', skipAppVersion = false} = pluginConfig;

  // Construct the absolute path to the Chart.yaml file
  const chartFilePath = path.resolve(chartPath, 'Chart.yaml');

  try {
    const ch = yaml.load(await fsPromises.readFile(chartFilePath, 'utf8'));
    const appVersion = skipAppVersion ? ch.appVersion : version;

    // Packaging the helm chart by referring to the correct folder
    await execa('helm', ['package', '--version', version, '--app-version', appVersion, chartPath, '--destination', chartPackagePath], {
      env: {HELM_EXPERIMENTAL_OCI: 1}
    });

    logger.log(`Chart packaged to ${ch.name}-${version}.tgz.`);
  } catch (error) {
    logger.error(`Failed to package chart: ${error.message}`);
    throw error;
  }
};