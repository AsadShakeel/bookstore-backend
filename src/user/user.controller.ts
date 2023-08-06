import { Body, Controller, Delete, Get, Param, Patch, UseFilters } from "@nestjs/common";
import { UserService } from "./user.service";
import { UpdateUserDto } from "./dto/update-user.dto";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { HttpExceptionFilter } from "../filters/http-exception.filter";

@Controller("user")
@ApiTags("User")
@UseFilters(new HttpExceptionFilter())
export class UserController {
  constructor(private readonly userService: UserService) {
  }

  @Get()
  @ApiOperation({ summary: "Get all users" })
  findAll() {
    return this.userService.findAll();
  }

  @Get(":id")
  @ApiOperation({ summary: "Get a user by id" })
  findOne(@Param("id") id: string) {
    return this.userService.getUserById(id);
  }

  @Patch(":id")
  @ApiOperation({ summary: 'Update a user' })
  update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateUser(id, updateUserDto);
  }

  @Delete(":id")
  @ApiOperation({ summary: 'Delete the user' })
  remove(@Param("id") id: string) {
    return this.userService.deleteUser(id);
  }
}
