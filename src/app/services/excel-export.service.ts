import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';

export interface TimeLog {
  date: string;
  startTime: string;
  endTime: string;
  duration: string;
  targetTime?: string;
  status?: string;
  user?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ExcelExportService {

  constructor() { }

  public exportDailyLog(log: TimeLog): void {
    this.exportLogs([log], `TimeLog_${log.date.replace(/\//g, '-')}`);
  }

  public exportLogs(logs: TimeLog[], fileName: string): void {
    const data = logs.map(log => ({
      'Date': log.date,
      'Start Time': log.startTime,
      'End Time': log.endTime,
      'Total Duration Working': log.duration,
      'Target (mins)': log.targetTime || '-',
      'Status': log.status || '-'
    }));

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const workbook: XLSX.WorkBook = {
      Sheets: { 'Time Log': worksheet },
      SheetNames: ['Time Log']
    };

    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, fileName);
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    FileSaver.saveAs(data, fileName + EXCEL_EXTENSION);
  }
}
