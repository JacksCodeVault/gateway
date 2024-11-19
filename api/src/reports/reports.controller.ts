import { Controller, Get, Query, UseGuards, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/guards/auth.guard';
import { ReportsService } from './reports.service';
import { ReportFiltersDTO, MessageReportDTO, DeviceReportDTO } from './reports.dto';

@ApiTags('reports')
@ApiBearerAuth()
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('/messages')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get message statistics report' })
  async getMessageReport(
    @Query() filters: ReportFiltersDTO,
    @Request() req
  ): Promise<MessageReportDTO> {
    return this.reportsService.getMessageReport(filters, req.user.id);
  }

  @Get('/devices')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get device performance report' })
  async getDeviceReport(
    @Query() filters: ReportFiltersDTO,
    @Request() req
  ): Promise<DeviceReportDTO> {
    return this.reportsService.getDeviceReport(filters, req.user.id);
  }

  @Get('/export')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Export messages report as CSV' })
  async exportReport(
    @Query() filters: ReportFiltersDTO,
    @Request() req
  ) {
    return this.reportsService.generateExport(filters, req.user.id);
  }
}
