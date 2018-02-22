/**
 *  히트맵 같은 추가적인 옵션에 대비하여 동적으로 변경할 수 있도록 배열로 레이어 프로퍼티 설정
 */
const layers = [];
/**
 * 한 타일의 사이즈
 */
const TILE_SIZE = 313;
/**
 * 옵션들...
 */
const option = {
  url: "https://pubg.op.gg/images/map/erangel/{z}x{x}x{y}.jpg",

  // 화면을 깊이를 컨트롤 할 수 있는 범위.
  minZoom: 0,
  maxZoom: 4,

  // 화면 제한할 Bounds. 이 영역 안에서만 이동이 가능하다.
  bounds: [[0, 0], [800000, 800000]],

  // Image 그리는 Bounds. 이미지 파일은 이 안에서만 다운로드한다.
  tileBounds: [[0, 0], [800000, 800000]],
};
function unscale(x, y, txt) {
  /**
   * 먼저, 수십만에 달하는 x, y 좌표를 'tileSize' (313) 로 축소하기 위해, 맵 타일의 가로/세로 크기를 구해온다.
   * 맵 파일 이미지에는 공백이 위아래 존재하지 않도록 구성하여둔 상태이다. (CSS background-size 의 Cover 옵션과 비슷한 개념)
   * 그러므로, 맵이 가로로 길쭉하면 가로 2칸이상 / 세로는 무조건 1칸으로 만들 수 있을 것이고,
   * 맵이 세로로 길쭉하면 세로 2칸이상 / 세로는 무조건 1칸으로 만들 수 있을 것이다.
   * 그렇기 때문에, 가로/세로중 짧은 길이를 구하여 tileSize 를 그 값으로 나눠주면 스케일 상수가 나온다.
   */
  const imageScale = TILE_SIZE / Math.min(
      option.tileBounds[1][0] - option.tileBounds[0][0],
      option.tileBounds[1][1] - option.tileBounds[0][1]);

  const scaledX = x * imageScale,
      scaledY = y * imageScale;

  console.log('==========================================', );
  console.log(txt);
  console.log('tileSize', TILE_SIZE);
  console.log('tileBounds', option.tileBounds);
  console.log('x', x);
  console.log('y', y);
  console.log('scaledX', scaledX);
  console.log('scaledY', scaledY);
  console.log('latLng', L.latLng(scaledY * -1, scaledX));
  console.log('==========================================', );

  return L.latLng(scaledY * -1, scaledX);
}

/**
 * 타일 레이어 설정
 */
layers.push(L.tileLayer(option.url, {
  tileSize: TILE_SIZE,
  bounds: new L.LatLngBounds(
      unscale(option.tileBounds[0][0], option.tileBounds[0][1], 'bounds'),
      unscale(option.tileBounds[1][0], option.tileBounds[1][1], 'bounds')),
  minZoom: option.minZoom,
  maxZoom: option.maxZoom,
  zoomOffset: 0,
  noWrap: true
}));

/**
 * 실제 맵 그리기 및 실제 맵 그려질 때 초기화 옵션들
 */
const map = L.map('map', {
  crs: L.CRS.Simple, // Coordinate Reference System 지도를 그릴때 어떠한 기준을 참조하게 되는데 기존 지구를 기준으로 지도 가그려지는걸 simple이라는 좌표 시스템으로 변경 (기존 지구를 참조하던 걸 그냥 일반 좌표형식으로 변경)
  minZoom: option.minZoom,
  maxZoom: option.maxZoom,
  zoom: option.minZoom,
  center: unscale(option.bounds[1][0] / 2, option.bounds[1][1] / 2, 'center'),
  zoomSnap: .5,
  zoomControl: false, //줌 컨트롤러
  attributionControl: false, // 오른쪽 밑에 워터마크 같은 것
  preferCanvas: true,
  maxBounds: new L.LatLngBounds(
      unscale(option.bounds[0][0], option.bounds[0][1], 'maxBounds'),
      unscale(option.bounds[1][0], option.bounds[1][1], 'maxBounds')), // 스크롤 막기
  maxBoundsViscosity: .8, // 경계를 벗어나도록 드래그 안되게,
  layers: layers
});

/**
 * 다양한 컨트롤 래핑 함수들. 다른 기능들을 테스트를 해보려면 api를 보고 활용해보면 됨.
 */
function moveView(x, y, depth) {
  map.setView(this.unscale(x, y), depth);
}
function marker(x, y) {
  return L.marker(this.unscale(x, y), {
    icon: L.divIcon({
      className: 'kill-point',
      html:`<i></i>`,
      iconSize: [16, 16]
    })
  }).addTo(map);
}
function moveZoom(depth) {
  map.setZoom(depth);
}
function zoomIn() {
  map.zoomIn();
}
function zoomOut() {
  map.zoomOut();
}