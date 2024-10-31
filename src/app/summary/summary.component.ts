import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientService } from '../services/client.service';
import { CommonModule } from '@angular/common';

/**
 * Componente de resumen que muestra información básica del cliente
 * basada en el tipo y número de documento proporcionados en la URL.
 */

@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.css'
})
export class SummaryComponent implements OnInit {
  type: string | null = null;
  documentNumber: string | null = null;
  clientInfo: any = null;
  errorMessage: string | null = null;

  /**
   * Constructor del componente.
   *
   * @param route - Proporciona acceso a la información de la ruta activa.
   * @param router - Permite la navegación a otras rutas.
   * @param clientInfoService - Servicio para obtener información del cliente.
   */

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private clientInfoService: ClientService
  ) {}

  /**
   * Inicializa el componente y suscribe a los parámetros de la ruta.
   *
   * Obtiene el tipo de documento y el número de documento de los parámetros
   * de la ruta y realiza una llamada al servicio para obtener la información
   * del cliente. Maneja errores en caso de que la información no se pueda
   * recuperar.
   */

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.type = params['type'] || null;
      this.documentNumber = params['documentNumber'] || null;
      if (this.type && this.documentNumber) {
        this.clientInfoService.getClientInfo(this.type, this.documentNumber).subscribe(
          (data) => {
            this.clientInfo = {
              firstName: data.firstName,
              firstSurname: data.firstSurname
            };
          },
          (error) => {
            this.handleError(error);
          }
        );
      }
    });
  }
   /**
   * Maneja los errores al obtener la información del cliente.
   *
   * @param error - El objeto de error devuelto por el servicio.
   */

  handleError(error: any): void {
    if (error.status === 404) {
      this.errorMessage = 'Cliente no encontrado.';
    } else if (error.status === 500) {
      this.errorMessage = 'Error del servidor';
    } else {
      this.errorMessage = 'Ocurrió un error inesperado.';
    }
  }

/**
   * Navega de vuelta a la ruta principal.
   */
  goBack() {
    this.router.navigate(['/']);
  }
}
