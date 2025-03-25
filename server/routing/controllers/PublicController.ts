import { Service } from 'typedi';
import { Controller, Get } from '@tosarus/routing-express';

@Controller('/public')
@Service()
export class PublicController {
  constructor() {}

  @Get('/version')
  getVersion() {
    const releaseVersion = process.env.HEROKU_RELEASE_VERSION || 'dev';
    const buildCommit = process.env.HEROKU_BUILD_COMMIT;
    if (buildCommit) {
      return releaseVersion + '.' + buildCommit.substring(0, 8);
    } else {
      return releaseVersion;
    }
  }
}
