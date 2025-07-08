import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { SystemConstant } from 'src/app/core/constants/system.constant';
import { UrlConstant } from 'src/app/core/constants/url.constant';
import { DapAnModel } from 'src/app/core/models/main/cau-hoi.model';
import { KetQuaTracNghiem } from 'src/app/core/models/main/user-tra-loi.model';
import { AuthenticateService } from 'src/app/core/services/auth/authenticate.service';
import { TracNghiemUserService } from 'src/app/core/services/main/trac-nghiem-user.service';

@Component({
  selector: 'app-cau-tra-loi-cua-toi',
  templateUrl: './cau-tra-loi-cua-toi.component.html',
  styleUrls: ['./cau-tra-loi-cua-toi.component.scss']
})
export class CauTraLoiCuaToiComponent implements OnInit {

  routerLink = UrlConstant;
  userEmail = localStorage.getItem(SystemConstant.CURRENT_USER).replace(/\"/g, '').replace("@", '%40');
  listKetQuaTracNghiemUser: KetQuaTracNghiem = new KetQuaTracNghiem();
  fullDiemTong = 0;

  constructor(
    private spinner: NgxSpinnerService,
    private authSvc: AuthenticateService,
    private tracNghiemUserSvc: TracNghiemUserService,
  ) { }

  ngOnInit(): void {
    if (this.userEmail) {
      this.loadKetQuaTracNghiemUserLogin();
    } else {
      this.authSvc.doLogoutUser();
    }
  }

  loadKetQuaTracNghiemUserLogin() {
    this.spinner.show();
    this.tracNghiemUserSvc.getKetQuaTracNghiemByEmail(this.userEmail)
      .subscribe(res => {
        if (res) {
          this.listKetQuaTracNghiemUser = res;
          this.fullDiemTong = res.cauTraLois.reduce((sum, obj) => sum += obj.cauHoiTracNghiem.diemSo, 0);
        }
        this.spinner.hide();
      }, () => this.spinner.hide());
  }

  getDapAnDung(dapAns: DapAnModel[]): string {
    return dapAns.find(x => x.dapAnDung)?.noiDungCauTraLoi || '';
  }

}
