/* 
import { Component } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'video-root',
  standalone: true,
  imports: [HttpClientModule, FormsModule, CommonModule],
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.css']
})
export class VideoComponent {
  youtubeUrl: string = ''; // رابط YouTube
  errorMessage: string | null = null; // رسالة الخطأ إن وجدت
  isAnalyzing: boolean = false; // التحكم في عرض الرسالة
  dataList: { second: number; uniqueVehicles: number }[] = []; // قائمة البيانات المستلمة
  totalVehiclesHistory: number[] = []; // بيانات الرسم البياني
  timeLabels: string[] = []; // التسميات (الثواني)
  chart: any; // الرسم البياني
  chartReady: boolean = false; // تحقق من جاهزية الرسم البياني

  constructor(private cdr: ChangeDetectorRef) {
    Chart.register(...registerables); // تسجيل وحدات الرسم البياني
  }

  sendRequest() {
  const apiUrl = 'http://127.0.0.1:5000/api/track'; // رابط السيرفر

  if (!this.youtubeUrl.trim()) {
    this.errorMessage = 'Please enter a valid Camera URL.';
    return;
  }

  this.errorMessage = null;
  this.isAnalyzing = true; // عرض التحميل
  this.dataList = [];
  this.totalVehiclesHistory = [];
  this.timeLabels = [];
  this.chartReady = false;

  const eventSource = new EventSource(`${apiUrl}?url=${encodeURIComponent(this.youtubeUrl)}`);

  eventSource.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);

      if ('second' in data && 'unique_vehicles' in data) {
        const second = data.second;
        const uniqueVehicles = Math.round(data.unique_vehicles);

        this.dataList.push({ second, uniqueVehicles });
        this.updateChart(second, uniqueVehicles);

        this.isAnalyzing = false; // إخفاء التحميل عند استلام البيانات
        this.cdr.detectChanges();
      } else {
        console.error('Invalid data format:', data);
      }
    } catch (e) {
      console.error('Error parsing data:', e);
    }
  };

  eventSource.onerror = (error) => {
    console.error('EventSource error:', error);
    this.errorMessage = 'An error occurred while connecting to the server.';
    this.isAnalyzing = false; // إخفاء التحميل عند حدوث خطأ
    eventSource.close();
  };
}


  initializeChart() {
    if (this.chart) {
      return; // إذا كان الرسم البياني موجودًا مسبقًا
    }

    const canvas = document.getElementById('trafficChart') as HTMLCanvasElement;

    if (!canvas) {
      console.error('Canvas element for traffic chart not found.');
      return;
    }

    this.chart = new Chart(canvas, {
      type: 'line',
      data: {
        labels: this.timeLabels,
        datasets: [
          {
            label: 'Vehicles Detected',
            data: this.totalVehiclesHistory,
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderWidth: 2,
            tension: 0, // اجعل المنحنى مستقيمًا
            pointStyle: 'circle', // عرض النقاط
            pointRadius: 6, // حجم النقاط
            pointBackgroundColor: 'rgba(0, 123, 255, 1)',
            fill: false, // عدم ملء الرسم البياني
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          x: {
            title: {
              display: true,
              text: 'Time (seconds)',
            },
          },
          y: {
            title: {
              display: true,
              text: 'Number of Vehicles',
            },
            beginAtZero: true,
            ticks: {
              stepSize: 1, // منع الكسور
            },
          },
        },
      },
    });

    this.chartReady = true;
  }

  updateChart(second: number, totalVehicles: number) {
    if (!this.chartReady) {
      this.initializeChart();
    }

    this.timeLabels.push(`${second} sec`);
    this.totalVehiclesHistory.push(totalVehicles);

    if (this.chart) {
      this.chart.data.labels = this.timeLabels;
      this.chart.data.datasets[0].data = this.totalVehiclesHistory;
      this.chart.update();
    }
  }
}
*/
import { Component } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'video-root',
  standalone: true,
  imports: [HttpClientModule, FormsModule, CommonModule],
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.css']
})
export class VideoComponent {
  youtubeUrl: string = ''; // رابط YouTube
  errorMessage: string | null = null; // رسالة الخطأ إن وجدت
  isAnalyzing: boolean = false; // التحكم في عرض الرسالة
  dataList: { timestamp: string; uniqueVehicles: number }[] = []; // قائمة البيانات المستلمة
  totalVehiclesHistory: number[] = []; // بيانات الرسم البياني
  timeLabels: string[] = []; // التسميات (الطابع الزمني)
  chart: any; // الرسم البياني
  chartReady: boolean = false; // تحقق من جاهزية الرسم البياني

  constructor(private cdr: ChangeDetectorRef) {
    Chart.register(...registerables); // تسجيل وحدات الرسم البياني
  }

  sendRequest() {
    const apiUrl = 'http://127.0.0.1:5000/api/track'; // رابط السيرفر

    if (!this.youtubeUrl.trim()) {
      this.errorMessage = 'Please enter a valid Camera URL.';
      return;
    }

    this.errorMessage = null;
    this.isAnalyzing = true; // عرض التحميل
    this.dataList = [];
    this.totalVehiclesHistory = [];
    this.timeLabels = [];
    this.chartReady = false;

    const eventSource = new EventSource(`${apiUrl}?url=${encodeURIComponent(this.youtubeUrl)}`);

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if ('timestamp' in data && 'unique_vehicles' in data) {
          const timestamp = data.timestamp;
          const uniqueVehicles = Math.round(data.unique_vehicles);

          this.dataList.push({ timestamp, uniqueVehicles });
          this.updateChart(timestamp, uniqueVehicles);

          this.isAnalyzing = false; // إخفاء التحميل عند استلام البيانات
          this.cdr.detectChanges();
        } else {
          console.error('Invalid data format:', data);
        }
      } catch (e) {
        console.error('Error parsing data:', e);
      }
    };

    eventSource.onerror = (error) => {
      console.error('EventSource error:', error);
      this.errorMessage = 'An error occurred while connecting to the server.';
      this.isAnalyzing = false; // إخفاء التحميل عند حدوث خطأ
      eventSource.close();
    };
  }

  initializeChart() {
    if (this.chart) {
      return; // إذا كان الرسم البياني موجودًا مسبقًا
    }

    const canvas = document.getElementById('trafficChart') as HTMLCanvasElement;

    if (!canvas) {
      console.error('Canvas element for traffic chart not found.');
      return;
    }

    this.chart = new Chart(canvas, {
      type: 'line',
      data: {
        labels: this.timeLabels,
        datasets: [
          {
            label: 'Vehicles Detected',
            data: this.totalVehiclesHistory,
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderWidth: 2,
            tension: 0, // اجعل المنحنى مستقيمًا
            pointStyle: 'circle', // عرض النقاط
            pointRadius: 6, // حجم النقاط
            pointBackgroundColor: 'rgba(0, 123, 255, 1)',
            fill: false, // عدم ملء الرسم البياني
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          x: {
            title: {
              display: true,
              text: 'Time (hh:mm:ss)',
            },
          },
          y: {
            title: {
              display: true,
              text: 'Number of Vehicles',
            },
            beginAtZero: true,
            ticks: {
              stepSize: 1, // منع الكسور
            },
          },
        },
      },
    });

    this.chartReady = true;
  }

  updateChart(timestamp: string, totalVehicles: number) {
    if (!this.chartReady) {
      this.initializeChart();
    }

    this.timeLabels.push(timestamp);
    this.totalVehiclesHistory.push(totalVehicles);

    if (this.chart) {
      this.chart.data.labels = this.timeLabels;
      this.chart.data.datasets[0].data = this.totalVehiclesHistory;
      this.chart.update();
    }
  }
}



/*
import { Component } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'video-root',
  standalone: true,
  imports: [HttpClientModule, FormsModule, CommonModule],
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.css']
})
export class VideoComponent {
  youtubeUrl: string = '';
  frames: any[] = [];
  errorMessage: string | null = null;

  totalCars: number = 0; // إجمالي السيارات المكتشفة خلال آخر 10 ثوانٍ
  carCountHistory: number[] = []; // التاريخ الخاص بعدد السيارات لكل فترة
  timeLabels: string[] = []; // تسميات الزمن للرسم البياني
  chart: any; // متغير للرسم البياني
  currentTime: number = 0; // الوقت الحالي لتسميات الرسم البياني
  isChartInitialized: boolean = false; // متغير للتحقق إذا تم تهيئة الرسم البياني

  constructor(private cdr: ChangeDetectorRef) {
    Chart.register(...registerables);
  }

  ngOnInit() {
    // التأكد من أن الرسم البياني سيتم تهيئته عند الحاجة
    setTimeout(() => {
      this.initializeChart();
    }, 100);
  }

  sendRequest() {
    const apiUrl = 'http://127.0.0.1:5000/api/track'; // الرابط للـ backend

    if (!this.youtubeUrl.trim()) {
      this.errorMessage = 'Please enter a valid YouTube URL.';
      return;
    }

    this.errorMessage = null;
    this.frames = [];
    this.totalCars = 0;

    const eventSource = new EventSource(`${apiUrl}?url=${encodeURIComponent(this.youtubeUrl)}`);

    eventSource.onmessage = (event) => {
      try {
        const frameData = JSON.parse(event.data);

        // جمع عدد السيارات المكتشفة في هذا الفريم
        const carsInFrame = frameData.class_labels?.filter((label: any) => label === 0).length || 0;
        this.totalCars += carsInFrame; // أضف السيارات لهذا الفريم إلى الإجمالي

        this.frames.push(frameData); // أضف البيانات إلى قائمة الفريمات
        this.cdr.detectChanges();

        // تحديث الرسم البياني مباشرة مع كل فريم
        this.updateChartRealtime();
      } catch (e) {
        console.error('Error parsing frame data:', e);
      }
    };

    eventSource.onerror = (error) => {
      console.error('Error with EventSource:', error);
      this.errorMessage = 'An error occurred while connecting to the server.';
      eventSource.close();
    };
  }

  initializeChart() {
    const canvas = document.getElementById('trafficChart') as HTMLCanvasElement;

    if (!canvas) {
      console.error('Canvas element for traffic chart not found.');
      return;
    }

    this.chart = new Chart(canvas, {
      type: 'line',
      data: {
        labels: this.timeLabels,
        datasets: [
          {
            label: 'Cars Detected',
            data: this.carCountHistory,
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderWidth: 2,
            tension: 0.4
          }
        ]
      },
      options: {
        responsive: true,
        scales: {
          x: {
            title: {
              display: true,
              text: 'Time (seconds)'
            }
          },
          y: {
            title: {
              display: true,
              text: 'Number of Cars'
            },
            beginAtZero: true
          }
        }
      }
    });

    this.isChartInitialized = true; // تعيين العلم عند تهيئة الرسم البياني
  }

  updateChartRealtime() {
    if (!this.isChartInitialized || !this.chart) {
      console.error('Chart has not been initialized yet.');
      return;
    }

    if (this.frames.length % 10 === 0) {
      this.currentTime += 10;
      this.carCountHistory.push(this.totalCars);
      this.timeLabels.push(`${this.currentTime} sec`);
      this.chart.data.labels = this.timeLabels;
      this.chart.data.datasets[0].data = this.carCountHistory;
      this.chart.update();

      this.totalCars = 0;
    }
  }
}
*/






/*
import { Component } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core'; // Import ChangeDetectorRef
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'video-root',
  standalone: true,
  imports: [HttpClientModule, FormsModule, CommonModule],
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.css']
})
export class VideoComponent {
  youtubeUrl: string = '';
  frames: any[] = []; // Store frame data dynamically
  errorMessage: string | null = null; // Error message

  constructor(private cdr: ChangeDetectorRef) {}

  sendRequest() {
    const apiUrl = 'http://127.0.0.1:5000/api/track'; // Backend endpoint

    if (!this.youtubeUrl.trim()) {
      this.errorMessage = 'Please enter a valid YouTube URL.';
      return;
    }

    this.errorMessage = null; // Clear any previous errors
    this.frames = []; // Clear previous frames

    const eventSource = new EventSource(`${apiUrl}?url=${encodeURIComponent(this.youtubeUrl)}`);

    eventSource.onmessage = (event) => {
      try {
        const frameData = JSON.parse(event.data); // Parse the incoming frame data
        console.log('Received Frame Data:', frameData);
        this.frames.push(frameData); // Add frame data to the frames array
        this.cdr.detectChanges(); // Force Angular to detect changes
      } catch (e) {
        console.error('Error parsing frame data:', e);
      }
    };

    eventSource.onerror = (error) => {
      console.error('Error with EventSource:', error);
      this.errorMessage = 'An error occurred while connecting to the server.';
      eventSource.close(); // Close the connection
    };
  }
}
*/