import fsPromises from 'fs/promises';
import execa from 'execa';
import yaml from 'js-yaml';
import path from 'path';

export default async (pluginConfig, context) => {
  const {logger, nextRelease: {version}} = context;
  const {chartPath = '.', skipAppVersion = false} = pluginConfig;

  const chartFilePath = path.resolve(chartPath, 'Chart.yaml');

  try {
    const ch = yaml.load(await fsPromises.readFile(chartFilePath, 'utf8'));
    const appVersion = skipAppVersion ? ch.appVersion : version;

    await execa('helm', ['package', '--version', version, '--app-version', appVersion, chartPath], {
      env: {HELM_EXPERIMENTAL_OCI: 1}
    });

    logger.log(`Chart packaged to ${ch.name}-${version}.tgz.`);
  } catch (error) {
    logger.error(`Failed to package chart: ${error.message}`);
    throw error;
  }
};
