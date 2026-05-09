import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SearchKeysService } from './search-keys.service';
import { SearchKeysController } from './search-keys.controller';
import { SearchKey } from './entities/search-key.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SearchKey])],
  controllers: [SearchKeysController],
  providers: [SearchKeysService],
  exports: [SearchKeysService],
})
export class SearchKeysModule {}
