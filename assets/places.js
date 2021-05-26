
// //places
//  function findPlaces() {
//     //inst of PlaceService Google Api
//     const placesService = new google.maps.places.PlacesService(map);

//     placesService.nearbySearch({  //nearbySearch call for places Id
//         location: trip.stops[0].stop_point_coors,
//         radius: 15000,
//         name: "campground"
//     }, places => {
//         console.log(places);
//         let placesId = [];
//         places.forEach(place => {
//             placesId.push(place.place_id);
//         })
//         placesId.forEach((place_id) => {
//             placesService.getDetails({ //call to getDetails for place's details info;
//                 placeId: place_id
//             }, details => {

//                 new google.maps.Marker({
//                     map,
//                     position: details.geometry.location
//                 })
//                 // let div = document.createElement("div");
//                 // div.innerHTML = `
//                 // <span>${details.name}</span>
//                 // `
//                 // document.getElementById("places").append(div)
//             });
//         })
//     });
// };
