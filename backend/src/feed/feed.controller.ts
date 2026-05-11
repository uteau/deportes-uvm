import { Controller, Get } from '@nestjs/common';
import { FeedService } from './feed.service';

// GET /api/feed — endpoint público, sin guards
@Controller('feed')
export class FeedController {
  constructor(private readonly feedService: FeedService) {}

  @Get()
  getFeed() {
    return this.feedService.getFeed();
  }
}