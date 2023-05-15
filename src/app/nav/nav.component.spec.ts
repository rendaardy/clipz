import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from "@angular/router/testing";
import { By } from "@angular/platform-browser";

import { NavComponent } from './nav.component';
import { ModalService } from "../services/modal.service";
import { AuthService } from "../services/auth.service";

describe('NavComponent', () => {
  let component: NavComponent;
  let fixture: ComponentFixture<NavComponent>;
  const mockedAuthService: jasmine.SpyObj<AuthService> = jasmine.createSpyObj(
    "AuthService",
    ["createUser", "signout"],
    { isAuthenticated: true },
  );
  const mockedModalService: jasmine.SpyObj<ModalService> = jasmine.createSpyObj("ModalService", ["toggle"]);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NavComponent ],
      imports: [RouterTestingModule],
      providers: [
        { provide: ModalService, useValue: mockedModalService },
        { provide: AuthService, useValue: mockedAuthService },
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it("should log out", () => {
    const logoutLink = fixture.debugElement.query(By.css("li:nth-child(3) > a"));

    expect(logoutLink).withContext("Not logged in").toBeTruthy();

    logoutLink.triggerEventHandler("click", new Event("click"));

    const service = TestBed.inject(AuthService);

    expect(service.signout).withContext("Could not click logout link").toHaveBeenCalledTimes(1);
  });
});
