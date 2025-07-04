import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { MessageConstant } from 'src/app/core/constants/message.constant';
import { UrlConstant } from 'src/app/core/constants/url.constant';
import { CauHoiTracNghiem } from 'src/app/core/models/main/cau-hoi.model';
import { TracNghiemUserService } from 'src/app/core/services/main/trac-nghiem-user.service';
import { Paginate } from 'src/app/shared/widget/paginate/paginate.model';

@Component({
  selector: 'app-lam-trac-nghiem',
  templateUrl: './lam-trac-nghiem.component.html',
  styleUrls: ['./lam-trac-nghiem.component.scss']
})
export class LamTracNghiemComponent implements OnInit {

  listCauHoi: Paginate<CauHoiTracNghiem> = new Paginate<CauHoiTracNghiem>();
  currentIndex = 0;
  totalQuiz = 10;

  constructor(
    private spinner: NgxSpinnerService,
    private tracNghiemUserSvc: TracNghiemUserService,
    private alert: ToastrService,
    private router: Router,
    private nzModalSvc: NzModalService,
  ) { }

  ngOnInit(): void {
    this.getDataCauHoiRandom();
  }

  getDataCauHoiRandom() {
    this.spinner.show();
    this.tracNghiemUserSvc.getCauHoiUserRandomPaging(this.totalQuiz)
      .subscribe(res => {
        this.listCauHoi.data = res.content;
        this.listCauHoi.data.forEach(cauHoi => {
          cauHoi.dapAns = cauHoi.dapAns.sort(() => Math.random() - 0.5);
          cauHoi.dapAnUserSelected = '';
        }
        );
        this.spinner.hide();
      }, () => this.spinner.hide());
  }

  nextQuiz() {
    this.currentIndex += 1;
  }

  prevQuiz() {
    this.currentIndex -= 1;
  }

  goToQuiz(index: number) {
    this.currentIndex = index;
  }

  onSubmit() {
    this.nzModalSvc.confirm({
      nzContent: 'Xác nhận gửi bài làm?',
      nzOnOk: () => this.submitQuiz(),
      nzOkText: 'Gửi bài',
      nzCancelText: 'Quay lại'
    });
  }

  submitQuiz() {
    this.spinner.show();
    this.tracNghiemUserSvc.submitCauTraLoi({
      cauTraLois: this.listCauHoi.data.map(cauHoi => ({
        cauHoiTracNghiem: cauHoi,
        cauTraLoi: { noiDungCauTraLoi: cauHoi.dapAnUserSelected }
      }))
    }).subscribe(() => {
      this.spinner.hide();
      this.alert.success(MessageConstant.MSG_SUBMIT_DONE);
      this.router.navigateByUrl(UrlConstant.ROUTE.MAIN.MY_ANSWER);
    }, () => this.spinner.hide());
  }

}
