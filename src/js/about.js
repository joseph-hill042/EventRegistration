import './general';

export function initMap() {
  console.log('Map initialized');
}

window.addEventListener("load", () => {
  const $script = document.createElement('script');
  $script.src = `https://maps.googleapis.com/maps/api/js?key=${GMAP_KEY}&callback=bundle.initMap`;
  document.querySelector('body').appendChild($script);
});
