import { Controller, Get, UseGuards } from '@nestjs/common';
import { FeedService } from './feed.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/decorators/roles.decorators';

// GET /api/feed — endpoint público, sin guards
@Controller('feed')
export class FeedController {
  constructor(private readonly feedService: FeedService) {}

  @Get()
  getFeed() {
    return this.feedService.verFeed();
  }

  @Get('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  getFeedAdmin() {
    return this.feedService.verFeedAdmin();
  }

  @Get('seluvm')
  @UseGuards(JwtAuthGuard)
  getFeedSeluvm() {
    return this.feedService.verFeedSeluvm();
  }
}