import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError, BehaviorSubject } from 'rxjs';
import { SummaryComponent } from './summary.component';
import { ClientService } from '../services/client.service';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('SummaryComponent', () => {
  let component: SummaryComponent;
  let fixture: ComponentFixture<SummaryComponent>;
  let clientServiceMock: jasmine.SpyObj<ClientService>;
  let routerMock: jasmine.SpyObj<Router>;
  let queryParams: BehaviorSubject<Params>;
  let activatedRouteMock: Partial<ActivatedRoute>;

  beforeEach(async () => {
    clientServiceMock = jasmine.createSpyObj('ClientService', ['getClientInfo']);
    routerMock = jasmine.createSpyObj('Router', ['navigate']);
    queryParams = new BehaviorSubject<Params>({});
    activatedRouteMock = { queryParams: queryParams.asObservable() };

    await TestBed.configureTestingModule({
      imports: [CommonModule, SummaryComponent, HttpClientTestingModule],
      providers: [
        { provide: ClientService, useValue: clientServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SummaryComponent);
    component = fixture.componentInstance;
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería inicializar con los parámetros de consulta correctos y obtener la información del cliente', () => {
    const clienteMock = { firstName: 'Nicole', firstSurname: 'Rodriguez' };
    clientServiceMock.getClientInfo.and.returnValue(of(clienteMock));

    queryParams.next({ type: 'C', documentNumber: '23445322' });
    component.ngOnInit();
    fixture.detectChanges();

    expect(component.type).toBe('C');
    expect(component.documentNumber).toBe('23445322');
    expect(component.clientInfo).toEqual(clienteMock);
    expect(component.errorMessage).toBeNull();
    expect(clientServiceMock.getClientInfo).toHaveBeenCalledWith('C', '23445322');
  });

  it('debería manejar correctamente un error 404', () => {
    clientServiceMock.getClientInfo.and.returnValue(throwError(() => ({ status: 404 })));

    queryParams.next({ type: 'C', documentNumber: '87654321' });
    component.ngOnInit();
    fixture.detectChanges();

    expect(component.errorMessage).toBe('Cliente no encontrado.');
    expect(component.clientInfo).toBeNull();
    expect(clientServiceMock.getClientInfo).toHaveBeenCalledWith('C', '87654321');
  });

  it('debería navegar hacia atrás cuando se llama a goBack', () => {
    component.goBack();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/']);
  });

  it('debería tener valores nulos cuando no se proporcionan parámetros de consulta', () => {
    queryParams.next({});
    component.ngOnInit();
    fixture.detectChanges();

    expect(component.type).toBeNull();
    expect(component.documentNumber).toBeNull();
    expect(component.clientInfo).toBeNull();
    expect(component.errorMessage).toBeNull();
    expect(clientServiceMock.getClientInfo).not.toHaveBeenCalled();
  });
});
