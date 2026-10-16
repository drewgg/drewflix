/**
 * == Setup/Install ==
 * Copy/rename this file to `data.js` in the same folder, then modify
 * that `data.js`, following the  information outlined in the
 * remainder of this file.
 */


/**
 * == SECTION 1 --- Page Configuraation ==
 * 
 * General settings that affect how the site works. 
 */

// Randomize the order of the show recommendations each time the page loads. Otherwise order is determined
// by the order shows appear in the localShowData JSON object (see SECTION 2).
const RANDOMIZE_RECOMMENDED = true;

// How long each shows stay in the featured/hero area.
const FEATURED_SHOW_CYCLE_TIME = 5;

 
/**
 * == SECTION 2 --- Show Configuration ==
 * 
 * Everything show specific is powered by this localShowData JSON object. Add new records to add new shows.
 * 
 * Here is a breakdown of every configuration key/value pair for each show entry:
 * 
 * "featured" -- Boolean 
 *  - If any entries have this set to true, then only those shows will show in the hero area. If all 
 * shows have this set to false, then all shows will show in the hero area.
 * 
 * "title" -- string [HTML]
 *  - Show title
 *  - HTML allowed
 * 
 * "description" -- string [HTML]
 *  - Primary text for the show details module.
 * 
 * "watchDescription" -- string [HTML]
 *  - Displays above the "watchLinks" buttons on the show details module.
 * 
 * "images" -- array
 *  - Each show uses images in multiple areas. This array holds/configures them all.
 * 
 * "images.thumbnail.src" -- string [URL]
 *  - URL for the image that shows in the recommendations area.
 *
 * "images.thumbnail.layouts.recommended" -- string [CSS]
 *  - Sets the CSS "object-position" values, allowing the image's position to be adjusted. default is 
 *    centered ("center center"). This is useful when the image you use is a different shape and it
 *    doesn't look good centered.
 * 
 * "images.banner.src" -- string [URL]
 *  - URL for the image that shows in the hero and show details areas.
 * 
 * "images.banner.layouts.recommended" -- string [CSS]
 *  - Sets the CSS "object-position" values, allowing the image's position to be adjusted. default is 
 *    centered ("center center"). This is useful when the image you use is a different shape and it
 *    doesn't look good centered.
 * 
 * "watchLinks" -- array
 * - Zero or more links to watch locations (like streaming sites) and trails.
 * 
 * "watchLinks.platform" -- string [plaintext]
 * - The text for the link. If set to "Trailer" then a "Trailer" button will also display when this
 *   show is featured in the hero area.
 *
 * "watchLinks.url" -- string [URL]
 * - URL for the watch link.
 * 
 * 
 * 
 */
const localShowData = [
  {
    "id": "1",
    "featured": false,
    "title": "Kipo and the Age of Wonderbeasts",
    "description": "In a post-apocalyptic world mutants (\"mutes\") rule the surface and most humans live underground in \"burrows\". Kipo Oak is a teenage burrow girl who get's ejected from her burrow to the surface and must find her way home. 100% rating on Rotten Tomatoes.<br><br><strong>You might like this show if you like:</strong><br>Ted Lasso, The Owl House",
    "watchDescription": "The entire series is available on Netflix",
    "images": {
      "thumbnail": {
        "src": "./images/kipo.png",
        "layouts": {
          "recommended": "center 20%"
        }
      },
      "banner": {
        "src": "./images/kipo.png",
        "layouts": {
          "hero": "center 13%",
          "modal": "center 15%"
        }
      }
    },
    "watchLinks": [
      {
        // HTML: allowed
        "platform": "Available on Netflix",
        "url": "https://www.netflix.com/title/80221553"
      },
      {
        // If platform is set to "Trailer" then a trailer button will show in the hero area
        // for this show (in addition to showing in the show details module).
        "platform": "Trailer",
        "url": "https://www.youtube.com/watch?v=25UHUbpFTtY"
      }
    ]
  },
  // next show
];