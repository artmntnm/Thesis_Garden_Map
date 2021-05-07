// TO MAKE THE MAP APPEAR YOU MUST
// ADD YOUR ACCESS TOKEN FROM
// https://account.mapbox.com
//
//
let commGardens;
function setup(){
    commGardens = loadJSON('/data/community_gardens_harlem_pick.json');
    console.log(commGardens);
}


mapboxgl.accessToken = 'pk.eyJ1IjoibW50bm0iLCJhIjoiY2tvNjQ5cHpiMWNobjJubHIxczcyYTl4YSJ9.rwhEtzQHJIBEVcw0QgMeVw';

var mappa = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mntnm/cko6ey90l33sk17munyglqoqj',
    center: [-73.950009, 40.809634],
    zoom: 14
});


mappa.on('load', function(){
    mappa.addSource('commGardens', commGardens );
    mappa.addLayer({
        'id': 'commGardens',
        'type': 'circle',
        'source': 'commGardens',
        'paint': {
        'circle-color': 'red',
        'circle-radius': 6,
        }
    });
    // Create a popup, but don't add it to the map yet.
    var popup = new mapboxgl.Popup({
        className: "garden-popup",
        closeButton: true,
        closeOnClick: true,
    }).setMaxWidth(600);

    mappa.on('mouseenter', 'commGardens', function (e) {
        // Change the cursor style as a UI indicator.
        mappa.getCanvas().style.cursor = 'pointer';

    var coordinates = e.features[0].geometry.coordinates.slice();
    var name = e.features[0].properties.name;
    var occupation = e.features[0].properties.occupation;

    var lotnr = e.features[0].properties.lotnr;
    var pic1 = e.features[0].properties.pic1;
    var description = e.features[0].properties.description;
    var streetview = e.features[0].properties.streetview;


    var d_name = "<h2>" + name + "</h2>";
    var d_occupation = "<div>occupation: " + occupation + "</div>";
    var d_description = "<div>description: " + description + "</div>";
    var d_coordinates = "<div>coordinates: " + coordinates + "</div>";
    var d_pic1 = "<img src=/assets/communityGardens/" + pic1 + " class='popupImage'>";
    var d_streetview = "<a target='_blank' href='" + streetview + "'>link to streetview</a>";
    var d_lotnr = "<div>lotnr: " + lotnr + "</div>";

    // Ensure that if the map is zoomed out such that multiple
    // copies of the feature are visible, the popup appears
    // over the copy being pointed to.
    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }

    // Populate the popup and set its coordinates
    // based on the feature found.
    popup.setLngLat(coordinates).setHTML(d_pic1+
                                         d_name+
                                         d_coordinates+
                                         d_lotnr+
                                         d_occupation+
                                         d_description+
                                         d_streetview
                                         ).addTo(mappa);
    });

    mappa.on('mouseleave', 'commGardens', function () {
    mappa.getCanvas().style.cursor = '';
    //popup.remove();
    });
});

