import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
} from 'src/error/api-responses.decorator';
import { AdminAuthGuard } from 'src/guards/admin.guard';
import { CreateStoreDto } from './dtos/req/create-store.dto';
import { StoreService } from './store.service';
import { User } from 'src/decorators/users.decorator';
import { UserEntity } from 'src/user/user.entity';
import { Response } from 'express';
import { CreatedStoreDto } from './dtos/res/created-store.dto';
import { ItemService } from 'src/item/item.service';
@Controller('store')
@ApiTags('Store')
@ApiNotFoundResponse()
@ApiInternalServerErrorResponse()
@ApiBadRequestResponse()
export class StoreController {
  constructor(
    private readonly storeService: StoreService,
    private readonly itemService: ItemService,
  ) {}

  @Post('create')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Create a new store',
    type: CreateStoreDto,
  })
  @UseGuards(AdminAuthGuard)
  @UseInterceptors(FileInterceptor('logo'))
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'The record has been successfully created.',
    type: CreatedStoreDto,
  })
  async createStore(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // 5MB
          new FileTypeValidator({ fileType: 'image/*' }),
        ],
        fileIsRequired: true,
      }),
    )
    logo: Express.Multer.File,
    @Body() data: CreateStoreDto,
    @User() user: UserEntity,
  ) {
    return await this.storeService.createStore(data, logo, user);
  }
  @Get('/:id')
  async getStoreById(@Param('id') id: string) {
    return await this.storeService.getStoreById(id);
  }

  @Get('deals-of-the-day/:id')
  async getDealsOfTheDay(@Param('id') id: string) {
    return await this.itemService.getStoreDealsOfTheDayItems(id);
  }

  @Get('manually-selected-items-section/:id')
  async getManuallySelectedItemsSection(@Param('id') id: string) {
    return await this.itemService.getManuallySelectedItemsSection(id);
  }

  @Get('get-category-section-items/:id')
  async getCategorySectionItems(@Param('id') id: string) {
    return await this.itemService.getCategoryItemsSection(id);
  }

  @Get('items/:id')
  async getItemsByStoreId(@Param('id') id: string) {
    return await this.itemService.getItemsByStoreId(id);
  }
}
