import './general';

export function initMap() {
  const map = new google.maps.Map(document.getElementById('map'), {
    zoom: 13,
    center: {lat: 37.575977, lng: -77.540993}
  });

  const marker = new google.maps.Marker({
    map,
    draggable: true,
    animation: google.maps.Animation.DROP,
    position: {lat: 37.575977, lng: -77.540993}
  });

  marker.addListener('click', () => {
    infowindow.open(map,marker);
  });

  const infowindow = new google.maps.InfoWindow({
    content: `<h3>University of Richmond</h3><p><b>Jepson School of Leadership Studies</b></p><p>Learn to be a full-stack JavaScript Engineer!</p>`
  });

  infowindow.open(map,marker);
}

window.addEventListener("load", () => {
  const $script = document.createElement('script');
  $script.src = `https://maps.googleapis.com/maps/api/js?key=${GMAP_KEY}&callback=bundle.initMap`;
  document.querySelector('body').appendChild($script);
});
