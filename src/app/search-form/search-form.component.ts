import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

/**
 * Componente de formulario de búsqueda que permite al usuario ingresar
 * el tipo de documento y el número de documento para realizar una búsqueda.
 */

@Component({
  selector: 'app-search-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './search-form.component.html',
  styleUrls: ['./search-form.component.css']
})
export class SearchFormComponent {
  /** Formulario reactivo que contiene los campos de búsqueda. */
  searchForm: FormGroup;

  /**
   * Constructor del componente.
   *
   * @param fb - Proporciona métodos para crear formularios reactivos.
   * @param router - Permite la navegación a otras rutas.
   */
  constructor(private fb: FormBuilder, private router: Router) {
    this.searchForm = this.fb.group({
      type: ['', Validators.required],

      /** Número de documento ingresado por el usuario. */
      documentNumber: ['', [
        Validators.required,  // Campo requerido
        Validators.minLength(8),  // Longitud mínima de 8 caracteres
        Validators.maxLength(11), // Longitud máxima de 11 caracteres
        Validators.pattern('^[0-9]*$') // Solo permite números
      ]]
    });
  }

   /**
   * Formatea el número de documento ingresado, eliminando caracteres no numéricos
   * y aplicando separadores de miles.
   */
  formatDocumentNumber() {
    let number = this.searchForm.get('documentNumber')?.value;
    if (number) {
      number = number.replace(/\D/g, ''); // Elimina caracteres no numéricos
      number = number.replace(/\B(?=(\d{3})+(?!\d))/g, ','); // Aplica separadores de miles
      this.searchForm.get('documentNumber')?.setValue(number, { emitEvent: false });
    }
  }

   /**
   * Maneja la acción de búsqueda al enviar el formulario.
   * Si el formulario es válido, navega a la página de resumen pasando
   * los parámetros de tipo y número de documento.
   */

  onSearch() {
    if (this.searchForm.valid) {
      const { type, documentNumber } = this.searchForm.value;
      this.router.navigate(['/summary'], {
        queryParams: { type, documentNumber }
      });
    }
  }
}
