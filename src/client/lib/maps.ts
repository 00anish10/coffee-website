export const PLACE_COORDS = { lat: 27.7153706, lng: 85.3088386 } as const;

const GOOGLE_PLACE =
  'https://www.google.com/maps/place/Himalayan+Arabica+Beans+Coffee/@27.7153706,85.3088386,17z/data=';

const PLACE_ID = '!1s0x39eb18fc98abbd05:0x463d2979458d7fef';
const COORDS = '!8m2!3d27.7153706!4d85.3088386';
const FEATURE_ID = '!16s%2Fg%2F11b6hy2w22';

export const MAPS_MENU_URL = `${GOOGLE_PLACE}!4m7!3m6${PLACE_ID}${COORDS}!10e9${FEATURE_ID}?entry=ttu`;

export const MAPS_REVIEWS_URL = `${GOOGLE_PLACE}!4m8!3m7${PLACE_ID}${COORDS}!9m1!1b1${FEATURE_ID}?entry=ttu`;
