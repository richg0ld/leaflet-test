/**
 * 히트맵 가짜데이터
 */
var testData={
  max:8,
  data:[
    {lat:-11.6408,lng:46.7728,count:3},
    {lat:-22.6408,lng:46.7728,count:2},
    {lat:-33.6408,lng:55.7728,count:1},
    ]
};
/**
 * 설정 정보
 */
var cfg = {
  // radius should be small ONLY if scaleRadius is true (or small radius is intended)
  // if scaleRadius is false it will be the constant radius used in pixels
  "radius": 2,
  "maxOpacity": .8,
  // scales the radius based on map zoom
  "scaleRadius": true,
  // if set to false the heatmap uses the global maximum for colorization
  // if activated: uses the data maximum within the current map boundaries
  //   (there will always be a red spot with useLocalExtremas true)
  "useLocalExtrema": true,
  // which field name in your data represents the lati-5tude - default "lat"
  latField: 'lat',
  // which field name in your data represents the longitude - default "lng"
  lngField: 'lng',
  // which field name in your data represents the data value - default "value"
  valueField: 'count'
};
/**
 * 빠운스
 */
var bounds = new L.LatLngBounds(L.latLng(-0, 0), L.latLng(-256, 256));
/**
 * 히트맵 레이어
 */
var heatmapLayer = new HeatmapOverlay(cfg);
/**
 *  지도 받아올 url, 영역을 넘어가는 곳에대한 이미지 요청을 막기 위한 옵션질
 */
var baseLayer = L.tileLayer("/map/erangel/{z}x{x}x{y}.jpg", {
  bounds: bounds,
  noWrap: true
});
/**
 *  맵 초기 설정
 */
var map = L.map('map', {
  crs: L.CRS.Simple,
  minZoom: 0,
  maxZoom: 3,
  zoomControl: false, //줌 컨트롤러
  attributionControl: false, // 오른쪽 밑에 워터마크 같은 것
  preferCanvas: true,
  maxBounds: bounds,
  maxBoundsViscosity: 1, // 경계를 벗어나도록 드래그 안되게,
  layers: [baseLayer, heatmapLayer],
});

map.fitBounds(bounds);

// map.setView({ lat: -500, lng: 1000 }) //맵 원하는 위치로 화면 이동 (킬로그 리스트에서 버튼 클릭 때 사용)
/**
 * 점 찍는거
 */
var LeafIcon = L.Icon.extend({
  options: {
    iconSize: [16, 16]
  }
});

// var orangeX = new LeafIcon({iconUrl: 'icon_spot@2x.png'});
// var greenX = new LeafIcon({iconUrl: 'icon_spot_g@2x.png'});
// var greenO = new LeafIcon({iconUrl: 'icon_direction_green@2x.png'});
// L.marker([-10, 10], {icon: orangeX}).addTo(map);
// L.marker([-246, 246], {icon: greenX}).addTo(map);
heatmapLayer.setData(testData);