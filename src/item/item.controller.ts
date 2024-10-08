import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { ItemService } from './item.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { AdminAuthGuard } from 'src/guards/admin.guard';
import { CreateItemDto } from './dtos/req/create-item.dto';
import { FilterPropertiesInterface } from 'src/main-classes/filter-properties.interface';
import { And, ILike, LessThanOrEqual, Like, MoreThanOrEqual } from 'typeorm';
import { UpdateItemDto } from './dtos/req/update-item';

@Controller('item')
@ApiTags('Item')
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @Post('create')
  @ApiBearerAuth()
  @UseGuards(AdminAuthGuard)
  async createItem(@Body() data: CreateItemDto) {
    return await this.itemService.createItem(data);
  }

  @Get('/:id')
  @ApiOkResponse({
    description: 'The record has been successfully created.',
  })
  async getItemCategoryById(@Param('id') id: string) {
    return await this.itemService.getItemById(id);
  }

  @Get('/store/:id')
  @ApiOkResponse({
    description: 'The record has been successfully created.',
  })
  @ApiQuery({ name: 'name', required: false })
  @ApiQuery({ name: 'createdAt', required: false })
  @ApiQuery({ name: 'updatedAt', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'price', required: false })
  @ApiQuery({ name: 'maxPrice', required: false })
  @ApiQuery({ name: 'minPrice', required: false })
  async getItems(
    @Param('id') id: string,
    @Query('name') name?: string,
    @Query('createdAt') createdAt?: 'ASC' | 'DESC',
    @Query('updatedAt') updatedAt?: 'ASC' | 'DESC',
    @Query('limit') limit?: number,
    @Query('page') page?: number,
    @Query('price') price?: 'ASC' | 'DESC',
    @Query('maxPrice') maxPrice?: number,
    @Query('minPrice') minPrice?: number,
  ) {
    const sorting = [];
    if (createdAt) {
      sorting.push(['createdAt', createdAt]);
    }
    if (updatedAt) {
      sorting.push(['updatedAt', updatedAt]);
    }
    if (price) {
      sorting.push(['price', price]);
    }

    return await this.itemService.getItems({
      filters: {
        name: name ? ILike(`%${name}%`) : undefined,
        price:
          minPrice && maxPrice
            ? MoreThanOrEqual(minPrice) && LessThanOrEqual(maxPrice)
            : undefined,
      },
      page,
      limit,
      sorting,
      storeId: id,
    });
  }

  @Post('update-item-images/:id')
  @ApiBearerAuth()
  @UseGuards(AdminAuthGuard)
  @ApiParam({ name: 'id' })
  async updateItemImages(
    @Param('id') id: string,
    @Body() data: { images: string[] },
  ) {
    return await this.itemService.updateItemImages(id, data.images);
  }

  @Post('update-item/:id')
  @ApiBearerAuth()
  @UseGuards(AdminAuthGuard)
  @ApiParam({ name: 'id' })
  async updateItem(@Param('id') id: string, @Body() data: UpdateItemDto) {
    return await this.itemService.updateItem(id, data);
  }

  @Delete('delete/:id')
  @ApiBearerAuth()
  @UseGuards(AdminAuthGuard)
  async deleteItem(@Param('id') id: string) {
    return await this.itemService.deleteItem(id);
  }
}
