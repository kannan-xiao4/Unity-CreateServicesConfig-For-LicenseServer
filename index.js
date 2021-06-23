const core = require('@actions/core');
const fs = require('fs-extra');

// most @actions toolkit packages have async methods
async function run() {
  try {
    const licensingServiceBaseUrl = core.getInput('licensingServiceBaseUrl');
    const enableEntitlementLicensing = core.getInput('enableEntitlementLicensing');
    const enableFloatingApi = core.getInput('enableFloatingApi');
    const clientConnectTimeoutSec = core.getInput('clientConnectTimeoutSec');
    const clientHandshakeTimeoutSec = core.getInput('clientHandshakeTimeoutSec');
    const clientResolveEntitlementsTimeoutSec = core.getInput('clientResolveEntitlementsTimeoutSec');
    const clientUpdateLicenseTimeoutSec = core.getInput('clientUpdateLicenseTimeoutSec');
    const useLsd = core.getInput('useLsd');

    const data = {
      licensingServiceBaseUrl: licensingServiceBaseUrl,
      enableEntitlementLicensing: enableEntitlementLicensing,
      enableFloatingApi: enableFloatingApi,
      clientConnectTimeoutSec: clientConnectTimeoutSec,
      clientHandshakeTimeoutSec: clientHandshakeTimeoutSec,
      clientResolveEntitlementsTimeoutSec: clientResolveEntitlementsTimeoutSec,
      clientUpdateLicenseTimeoutSec: clientUpdateLicenseTimeoutSec,
      useLsd: useLsd,
    };
    core.info(data);
    const fullPath = await getServicesConfigFilePath();
    core.info(fullPath);

    await fs.outputJson(fullPath, data);

    core.setOutput('servicesConfig', data);
    core.setOutput('configLocation', fullPath);

  } catch (error) {
    core.setFailed(error.message);
  }
}

async function getServicesConfigFilePath() {
  let configFilePath = '';
  if (process.platform === 'linux') {
    configFilePath = '/usr/share/unity3d/config/';
  } else if (process.platform === 'darwin') {
    configFilePath = '/Library/Application Support/Unity/config/';
  } else if (process.platform === 'win32') {
    configFilePath = 'C:/ProgramData/Unity/config/';
  }
  else throw new Error('Unknown plarform');

  const exist = await fs.pathExists(configFilePath);
  if (!exist) {
    await fs.mkdirs(configFilePath);
  }

  return `${configFilePath}services-config.json`;
}

run();
