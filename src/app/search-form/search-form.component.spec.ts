import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { SearchFormComponent } from './search-form.component';

describe('SearchFormComponent', () => {
  let component: SearchFormComponent;
  let fixture: ComponentFixture<SearchFormComponent>;
  let router:Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchFormComponent],
      providers: [
        { provide: Router, useClass: class { navigate = jasmine.createSpy("navigate"); } }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchFormComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Inicializar con los campos requeridos', () => {
    expect(component.searchForm.contains('type')).toBeTruthy();
    expect(component.searchForm.contains('documentNumber')).toBeTruthy();
  });

  it('Verifica que el campo type no este vacio', () => {
    const Type = component.searchForm.get('type');
    Type?.setValue('');
    expect(Type?.valid).toBeFalsy();
    Type?.setValue('pasaporte');
    expect(Type?.valid).toBeTruthy();
});

it('Verifica controles de validacion documento', () => {
  const documento = component.searchForm.get('documentNumber');
  documento?.setValue('');
  expect(documento?.valid).toBeFalsy();//Campo Vacio
  documento?.setValue('123123ab');
  expect(documento?.valid).toBeFalsy();//Datos incorrectos solo se permiten numericos
  documento?.setValue('1231');
  expect(documento?.valid).toBeFalsy();//Longitud muy baja
  documento?.setValue('12314234');
  expect(documento?.valid).toBeTruthy();
});

it('Si todo esta correcto redireccione al siguiente formulario', () => {
  component.searchForm.setValue({type:'C',documentNumber:'23445322'});
  component.onSearch();
  expect(router.navigate).toHaveBeenCalledWith(['/summary'],{
    queryParams:{type:'C',documentNumber:'23445322'}

  });

});

});

