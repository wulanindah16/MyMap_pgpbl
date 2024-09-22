import { Component, OnInit } from '@angular/core';
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import { Geolocation } from '@capacitor/geolocation';
import Graphic from '@arcgis/core/Graphic';
import Point from '@arcgis/core/geometry/Point';
import SimpleMarkerSymbol from '@arcgis/core/symbols/SimpleMarkerSymbol';
import ImageryLayer from '@arcgis/core/layers/ImageryLayer';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  mapView!: MapView;
  userLocationGraphic!: Graphic;
  map!: Map;
  
  constructor() {}

  async ngOnInit() {
    // Inisialisasi Map
    this.map = new Map({
      basemap: 'topo-vector' // default basemap
    });

    // Inisialisasi MapView
    this.mapView = new MapView({
      container: 'container',
      map: this.map,
      zoom: 8
    });

    // Menambahkan layer cuaca
    let weatherServiceFL = new ImageryLayer({ url: WeatherServiceUrl });
    this.map.add(weatherServiceFL);

    // Menambahkan tiga marker
    const point1 = new Point({
      latitude: 38.54597534357144, 
      longitude: -95.58841634959443
    });

    const point2 = new Point({
      latitude: 38.37295031144698,  // Lokasi kedua
      longitude: -75.25820024370336
    });

    const point3 = new Point({
      latitude: 51.78940270772851,  // Lokasi ketiga
      longitude: -120.11503293017154
    });

    // Menambahkan simbol marker
    const markerSymbol = new SimpleMarkerSymbol({
      color: 'red',
      size: '8px',
      outline: {
        color: 'white',
        width: 1
      }
    });

    // Membuat marker sebagai Graphic
    const marker1 = new Graphic({
      geometry: point1,
      symbol: markerSymbol
    });

    const marker2 = new Graphic({
      geometry: point2,
      symbol: markerSymbol
    });

    const marker3 = new Graphic({
      geometry: point3,
      symbol: markerSymbol
    });

    // Menambahkan marker ke peta
    this.mapView.graphics.add(marker1);
    this.mapView.graphics.add(marker2);
    this.mapView.graphics.add(marker3);

    // Memperbarui lokasi pengguna
    await this.updateUserLocationOnMap();
    this.mapView.center = this.userLocationGraphic.geometry as Point;

    // Memperbarui lokasi pengguna setiap 10 detik
    setInterval(this.updateUserLocationOnMap.bind(this), 10000);
  }

  async getLocationService(): Promise<number[]> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition((resp) => {
        resolve([resp.coords.latitude, resp.coords.longitude]);
      });
    });
  }

  async updateUserLocationOnMap() {
    let latLng = await this.getLocationService();
    let geom = new Point({ latitude: latLng[0], longitude: latLng[1] });
    if (this.userLocationGraphic) {
      this.userLocationGraphic.geometry = geom;
    } else {
      this.userLocationGraphic = new Graphic({
        symbol: new SimpleMarkerSymbol(),
        geometry: geom,
      });
      this.mapView.graphics.add(this.userLocationGraphic);
    }
  }

  changeBasemap(event: any) {
    const selectedBasemap = event.target.value;
    this.map.basemap = selectedBasemap; // Mengganti basemap sesuai pilihan
  }
}

const WeatherServiceUrl =
  'https://mapservices.weather.noaa.gov/eventdriven/rest/services/radar/radar_base_reflectivity_time/ImageServer';

  // // Multiple marker
  // private markers = [
  //   { longitude: 119.75874998067361, latitude: -8.494730546808958 },
  //   { longitude: 119.71050016612038, latitude: -8.633402457764554 },
  //   {longitude: 119.55708603511063, latitude: -8.680900294610916},
  //   {longitude: 119.83933885776861, latitude: -8.483610648644428},
  //   {longitude: 119.70971620767934, latitude: -8.570740725185527},
  //   {longitude: 119.55930468317567, latitude: -8.655666418315185},
  //   {longitude: 119.88049468640492, latitude: -8.476662892449383},
  //   {longitude: 120.20038867535762, latitude: -8.82117085811829},
  //   {longitude: 119.87184675720819, latitude: -8.464085866363073},
  //   {longitude: -8.567844937101457, latitude: 119.80857968101964},
  //   {longitude: -8.508907146270488, latitude: 119.87622485794266},
  //   {longitude: -8.508425564080468, latitude: 119.61092745537331},
  //   {longitude: -8.545162881122124, latitude: 119.6483031345824},
  //   {longitude: -8.539496356390803, latitude: 119.99462842483355},
  //   {longitude: -8.625727613070563, latitude: 119.99720311685242},
  //   {longitude: -8.582625268880555, latitude: 119.9826992038345},
  //   {longitude: -8.612027119297096, latitude: 120.02253964705409},
  //   {longitude: -8.479347025339779, latitude: 119.89920607703503},
  //   {longitude: -8.388794010185475, latitude: 119.8529023364692},
  //   {longitude: -8.6537181867236, latitude: 119.71692306564803},
  //   {longitude: -8.526541877544174, latitude: 119.48295437639595},
  //   {longitude: -8.71224891221532, latitude: 119.98849202378275}
  // ];

//   public async ngOnInit() {
//     try {
//       // Menampilkan lokasi terkini
//       const position = await Geolocation.getCurrentPosition();
//       const longitude = position.coords.longitude;
//       const latitude = position.coords.latitude;

//       // Pembuatan map dengan basemap
//       const map = new Map({
//         basemap: 'topo-vector'
//       });

//       // Pembuatan map view
//       this.view = new MapView({
//         container: 'container',
//         map: map,
//         zoom: 12,
//         center: [longitude, latitude]
//       });

//       // Inisialisasi penambahan marker
//       this.view.when(() => {
//         this.addMarkers(this.markers);
//       });
//     } catch (error) {
//       console.error('Error getting geolocation or initializing map:', error);
//     }
//   }

//   private addMarkers(markerCoords: {longitude: number, latitude: number}[]) {
//     // Tampilan icon pada marker
//     const markerImageUrl = 'assets/icon/pin.png'; 

//     // Tampilan marker menggunakan PictureMarkerSymbol
//     const markerSymbol = new PictureMarkerSymbol({
//       url: markerImageUrl,
//       width: '20px', 
//       height: '20px'
//     });

//     // Menambahkan marker pada peta
//     markerCoords.forEach(coord => {
//       const point = new Point({
//         longitude: coord.longitude,
//         latitude: coord.latitude
//       });

//       const pointGraphic = new Graphic({
//         geometry: point,
//         symbol: markerSymbol
//       });

//       this.view.graphics.add(pointGraphic);
//     });
//   }
// }