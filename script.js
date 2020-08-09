

const clientId = 'Z4N0SCYRHVCYIELMRC10YZY3MKECLCLAVQYKVJ4U0ER4XMJW';
const clientSecret = '4VF5DTR5NUB52W2F3YGJ41ULKPAPG4JUGSYRGJUJSAH5CROG';
let eachVenueDetailsObject = {};
let arrayOfFoursquarVenues = [];
let lng;
let lat;
let date = new Date();
date = date.getFullYear() + ((date.getMonth() < 10) ? "0" : "") + (date.getMonth() + 1) + ((date.getUTCDate() < 10) ? "0" : "") + date.getUTCDate();

function renderYoutubeVideos(youtubeData) {
     let youtubeId;
     let youtubeThumbnailUrl;
     console.log(youtubeData)
     for (let i = 0; i < youtubeData.items.length; i++) {
          youtubeId = youtubeData.items[i].id.videoId;
          youtubeThumbnailUrl = youtubeData.items[i].snippet.thumbnails.high.url;
          youtubeVideoTitle = youtubeData.items[i].snippet.title;
          $('#js-video-results-container').append(`</br>
               <a href="https://www.youtube.com/watch?v=${youtubeId}">
                    <h3>${youtubeVideoTitle}</h3>
                    <img src="${youtubeThumbnailUrl}">
               </a>
               </br>
          `)
     }
     $('#js-video-results-container').removeClass('hidden');
}

function renderFoursquareDetails(responseJson) {
     let imgPrefix = responseJson.response.venue.bestPhoto.prefix;
     let imgSuffix = responseJson.response.venue.bestPhoto.suffix;
     let locationName = responseJson.response.venue.name;
     let locationUrl = responseJson.response.venue.url;
     let locationAddress = responseJson.response.venue.location.address;
     let locationCity = responseJson.response.venue.location.city;
     let locationState = responseJson.response.venue.location.state;
     let locationZip = responseJson.response.venue.location.postalCode;
     let locationPopularHours = responseJson.response.venue.popular.timeframes;
     let locationOpen = responseJson.response.venue.hours.isOpen;

     $('#js-results-container').empty();
     $('#js-results-detail-container')
          .prepend(`<h2><a href="${locationUrl}">${locationName}</h2>`)
          .append(`<p class="quick-fix" style="font-style: italic">${locationAddress}, </p> <p class="quick-fix" style="font-style: italic">${locationCity}, ${locationState} ${locationZip}</p>`)
          .append(`<img src="${imgPrefix}300x500${imgSuffix}">`)
          .removeClass('hidden');

     if (locationOpen) {
          $('#js-results-detail-container').append(`<p>Open</p>`)
     } else {
          $('#js-results-detail-container').append(`<p>Closed</p>`)
     };

     $('#js-results-detail-container').append(`<p>High Traffic Hours</p>`)

     for (let i = 0; i < locationPopularHours.length; i++) {
          $('#js-results-detail-container').append(`<p>${locationPopularHours[i].days}: ${locationPopularHours[i].open[0].renderedTime}  </p>`)

     }
}

function watchFoursquareVenueClick(arr) {
     let venueName;
     let youtubeCategory;
     let youtubeZip;

     $('#js-results-container').on('click', 'li', function (event) {

          $('#js-results-container, #js-js-details-list, #js-video-list, #js-photo-list').empty();
          $('#js-results-section').addClass('hidden')

          for (let i = 0; i < arrayOfFoursquarVenues.length; i++) {
               if (event.target.id === arrayOfFoursquarVenues[i].id) {
                    console.log(arrayOfFoursquarVenues[i])
                    venueName = arrayOfFoursquarVenues[i].name.replace(" ", "+");
                    youtubeCategory = arrayOfFoursquarVenues[i].category.replace(" ", "+");
                    if (arrayOfFoursquarVenues[i].zipCode) {
                         youtubeZip = arrayOfFoursquarVenues[i].zipCode;
                    }
                    youtubeLat = arrayOfFoursquarVenues[i].latitude;
                    youtubeLng = arrayOfFoursquarVenues[i].longitude;
               }
          }

          //will need this code later, once ready, can delete foursquareVenueDetails above and actually use for fetch.   combine this fetch with youtube fetch.
          let venueId = event.target.id
                    let detailUrl = `https://api.foursquare.com/v2/venues/${venueId}?client_id=${clientId}&client_secret=${clientSecret}&v=${date}`
          
                    fetch(detailUrl)
                         .then(response => {
                              if (response.ok) {
                                   return response.json()
                              }
                              throw new Error(response.statusText);
                         })
                         .then(responseJson => renderFoursquareDetails(responseJson))
                         .catch(err => console.error(err))
          let videoLocation = `${youtubeLat},${youtubeLng}`;
          let videoSearchTerm = `${venueName}`;
          videoSearchTerm = videoSearchTerm.replace(" ", "+")
          let youtubeApiKey = `AIzaSyCTPdrlgLHzRzwleg63tpgjtaPpZ0o7C5Q`;
          let youtubeUrl = `https://www.googleapis.com/youtube/v3/search?key=${youtubeApiKey}&part=snippet&location=${videoLocation}&locationRadius=10mi&q=${videoSearchTerm}&type=video`
          console.log('youtube search results for: ', videoSearchTerm)
          fetch(youtubeUrl)
               .then(response => {
                    if (response.ok) {
                         return response.json()
                    }
                    throw new Error(response.statusText);
               })
               .then(responseJson => renderYoutubeVideos(responseJson))
               .catch(err => console.error(err))
     })
}

function renderFoursquareResultsList(data) {
     $('#js-results-container').empty();
     $('#js-details-list, #js-video-list, #js-photo-list').empty();
     $('#js-results-container').prepend(`<h3>Here are your results</h3>`)

     for (let i = 0; i < data.response.venues.length; i++) {
          for (let j = 0; j < data.response.venues[i].categories.length; j++) {
               eachVenueDetailsObject = {
                    category: data.response.venues[i].categories[j].name,
                    city: data.response.venues[i].location.city,
                    id: data.response.venues[i].id,
                    name: data.response.venues[i].name,
                    zipCode: data.response.venues[i].location.postalCode,
                    latitude: data.response.venues[i].location.lat,
                    longitude: data.response.venues[i].location.lng
               };
          };
          arrayOfFoursquarVenues.push(eachVenueDetailsObject);

          $('#js-results-container')
               .append(`<li >   
                    <h4 id="${data.response.venues[i].id}" class="${data.response.venues[i].name}" style="color: blue; text-decoration: underline;">
                         ${data.response.venues[i].name}</h4>
                    <p>${data.response.venues[i].location.formattedAddress}</p>
               </li>`)
     }
     $('#js-results-section').removeClass('hidden')

}
function watchForm() {
     $('#js-form').submit(event => {
          $('#js-results-detail-container, #js-video-results-container').empty();
          event.preventDefault()
          let location = $('input[name=location]').val().replace(" ", "-");
          let query = $('input[name=search-term]').val().replace(" ", "-");
          let foursquareApiUrl = `https://api.foursquare.com/v2/venues/search?near=${location}&query=${query}&client_id=${clientId}&client_secret=${clientSecret}&v=${date}`;
          fetch(foursquareApiUrl)
               .then(response => {
                    console.log(response)
                    if (response.ok) {
                         return response.json()
                    }
                    throw new Error(reponse.statusText);
               })
               .then(responseJson => { console.log(responseJson); renderFoursquareResultsList(responseJson) })
               .catch(err => console.error(err))
     });
}


function init() {
     watchForm()
     watchFoursquareVenueClick()
}

$(init)

