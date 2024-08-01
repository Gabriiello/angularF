import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { Chart, registerables, ChartOptions, ChartData, ChartDataset } from 'chart.js';
import { HttpClient } from '@angular/common/http';

// Registro de los componentes de Chart.js
Chart.register(...registerables);

@Component({
  selector: 'app-metricas',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './metricas.component.html',
  styleUrls: ['./metricas.component.css']
})
export class MetricasComponent implements OnInit {
  // Datos de la gráfica
  public lineChartData: ChartData<'line'> = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Respuestas Correctas',
        borderColor: '#42A5F5',
        backgroundColor: 'rgba(66, 165, 245, 0.3)',
        fill: true,
      }
    ]
  };

  // Opciones de la gráfica
  public lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: {
        display: true
      },
      tooltip: {
        mode: 'index',
        intersect: false
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Preguntas'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Cantidad de Respuestas Correctas'
        }
      }
    }
  };

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.loadMetrics();
  }

  loadMetrics(): void {
    this.http.get<any[]>('http://localhost:8080/api/metrics').subscribe(data => {
      this.processData(data);
    });
  }

  processData(data: any[]): void {
    const labels = data.map(item => item.pregunta);
    const values = data.map(item => item.correctas);

    this.lineChartData.labels = labels;
    this.lineChartData.datasets[0].data = values;
  }
}
