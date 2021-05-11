// TO MAKE THE MAP APPEAR YOU MUST
// ADD YOUR ACCESS TOKEN FROM
// https://account.mapbox.com
//
//
let commGardens;
let emptyLots;
let selectedSites;

function setup(){

    commGardens = loadJSON('/data/community_gardens_harlem_pick.json');
    emptyLots = loadJSON('/data/empty_sites_harlem_pick_with_details.json');
    selectedSites = loadJSON('/data/sites_selected.json');

}


mapboxgl.accessToken = 'pk.eyJ1IjoibW50bm0iLCJhIjoiY2tvNjQ5cHpiMWNobjJubHIxczcyYTl4YSJ9.rwhEtzQHJIBEVcw0QgMeVw';

var mappa = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mntnm/ckohqsc9w3x0l17mx5z89pntj',
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

    mappa.addSource('emptyLots', emptyLots );
    mappa.addLayer({
        'id': 'emptyLots',
        'type': 'circle',
        'source': 'emptyLots',
        'paint': {
        'circle-color': 'blue',
        'circle-radius': 6,
        }
    });

    mappa.addSource('selectedSites', selectedSites );
    mappa.addLayer({
        'id': 'selectedSites',
        'type': 'circle',
        'source': 'selectedSites',
        'paint': {
        'circle-color': 'purple',
        'circle-radius': 16,
        }
    });

    // Create a popup, but don't add it to the map yet.
    var popup = new mapboxgl.Popup({
        className: "garden-popup",
        closeButton: true,
        closeOnClick: true,
    }).setMaxWidth(600);


    // commGardens
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


        var d_name = "<h2 style='color:red;'>" + name + "</h2>";
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

    mappa.on('mouseleave', 'emptyLots', function () {
        mappa.getCanvas().style.cursor = '';
        //popup.remove();
    });


    // some utils
    insert = function insert(main_string, ins_string, pos) {
       if(typeof(pos) == "undefined") {
        pos = 0;
      }
       if(typeof(ins_string) == "undefined") {
        ins_string = '';
      }
       return main_string.slice(0, pos) + ins_string + main_string.slice(pos);
        }

    function addNewLines (str) { 
        var indices = [];
        for(var i=0; i<str.length;i++) {
            if (str[i] === ",") indices.push(i);}
        insertnewline = []
        var c = 0;
        for (var idx in indices){
            if (c % 3 == 0 && c != 0){
                insertnewline.push(indices[idx])
            }
            c++; 
        }
        insertnewline.reverse();
        var finalstr = str;
        for (var idx in insertnewline){
            finalstr = insert(finalstr, "<br>",insertnewline[idx]+1)
        }
        return finalstr;
    }

    // emptyLots
    mappa.on('mouseenter', 'emptyLots', function (e) {
        // Change the cursor style as a UI indicator.
        mappa.getCanvas().style.cursor = 'pointer';


        var coordinates = e.features[0].geometry.coordinates.slice();
        var name = e.features[0].properties.name;
        var occupation = e.features[0].properties.occupation;

        var lotnr = e.features[0].properties.lotnr;
        var pic1 = e.features[0].properties.pic1;
        var description = e.features[0].properties.description;
        var streetview = e.features[0].properties.streetview;

        description = addNewLines(description);


        var d_name = "<h2 style='color:blue;'>" + "Empty Lot" + "</h2>";
        var d_occupation = "<div>occupation: " + occupation + "</div>";
        var d_description = "<div>description: <br> " + description + "</div>";
        var d_coordinates = "<div>coordinates: " + coordinates + "</div>";
        var d_pic1 = "<img src=/assets/emptyLots/" + pic1 + " class='popupImage'>";
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

    // selectedSites
    mappa.on('mouseenter', 'selectedSites', function (e) {
        // Change the cursor style as a UI indicator.
        mappa.getCanvas().style.cursor = 'pointer';


        var coordinates = e.features[0].geometry.coordinates.slice();
        var name = e.features[0].properties.name;
        var occupation = e.features[0].properties.occupation;

        var lotnr = e.features[0].properties.lotnr;
        var pic1 = e.features[0].properties.pic1;
        var description = e.features[0].properties.description;
        var streetview = e.features[0].properties.streetview;

        var linkurl = e.features[0].properties.linkurl;

        description = addNewLines(description);


        var d_name = "<h2 style='color:purple;'>" + name + "</h2>";
        var d_occupation = "<div>occupation: " + occupation + "</div>";
        var d_description = "<div>description: <br> " + description + "</div>";
        var d_coordinates = "<div>coordinates: " + coordinates + "</div>";
        var d_pic1 = "<img src=/assets/emptyLots/" + pic1 + " class='popupImage'>";
        var d_streetview = "<a target='_blank' href='" + streetview + "'>link to streetview</a><br>";
        var d_linkurl = "<a target='_blank' href='" + linkurl + "'>LINK TO PROJECT</a>";
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
                                             d_streetview+
                                             d_linkurl
                                             ).addTo(mappa);
    });

    mappa.on('mouseleave', 'emptyLots', function () {
        mappa.getCanvas().style.cursor = '';
        //popup.remove();
    });

});

