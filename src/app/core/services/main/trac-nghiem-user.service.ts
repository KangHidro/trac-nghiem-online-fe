import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { UrlConstant } from '../../constants/url.constant';
import { PagedResults } from '../../models/common/response-page.model';
import { CauHoiTracNghiem } from '../../models/main/cau-hoi.model';
import { KetQuaTracNghiem, SubmitDataCauTraLoi } from '../../models/main/user-tra-loi.model';
import { HandlerErrorService } from '../common/handler-error.service';

@Injectable({
  providedIn: 'root'
})
export class TracNghiemUserService {

  tracNghiemApiUrl = '';
  ketQuaTracNghiemApiUrl = '';

  constructor(
    private http: HttpClient,
    private handleErrSvc: HandlerErrorService,
  ) {
    this.tracNghiemApiUrl = UrlConstant.API.TRAC_NGHIEM;
    this.ketQuaTracNghiemApiUrl = UrlConstant.API.KET_QUA_TRAC_NGHIEM;
  }

  getCauHoiUserRandomPaging(numberOfQuiz: number): Observable<PagedResults<CauHoiTracNghiem>> {
    const params = new HttpParams()
      .set('page', '0')
      .set('size', numberOfQuiz.toString())
      .set('soCau', numberOfQuiz.toString());
    return this.http.get<PagedResults<CauHoiTracNghiem>>(this.tracNghiemApiUrl + '/user/paging', { params })
      .pipe(catchError(this.handleErrSvc.handleError));
  }

  submitCauTraLoi(baiLamData: SubmitDataCauTraLoi): Observable<KetQuaTracNghiem> {
    return this.http.post<KetQuaTracNghiem>(this.ketQuaTracNghiemApiUrl, baiLamData)
      .pipe(catchError(this.handleErrSvc.handleError));
  }

  getKetQuaTracNghiemByEmail(email: string): Observable<KetQuaTracNghiem> {
    return this.http.get<KetQuaTracNghiem>(this.ketQuaTracNghiemApiUrl + `/${email}`)
      .pipe(catchError(this.handleErrSvc.handleError));
  }
}
