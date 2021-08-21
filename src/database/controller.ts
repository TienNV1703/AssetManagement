import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { DatabaseConnectionService } from './service';
import { CreateAssetDto } from './dto/create-asset';

@Controller('database-connection')
export class DatabaseConnectionController {
  constructor(
    private readonly databaseConnectionService: DatabaseConnectionService,
  ) {}

  @Post()
  create(@Body() createAssetDto: CreateAssetDto) {
    return this.databaseConnectionService.create(createAssetDto);
  }

  @Get()
  findAll() {
    return this.databaseConnectionService.findAll();
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.databaseConnectionService.findOne(+id);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.databaseConnectionService.remove(+id);
}
