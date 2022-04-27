const NodeGeocoder = require("node-geocoder");

const options = {
  provider: "mapquest",
  httpAdapter: "https",
  apiKey: "eAoRsUXwl9vuMvK0FesPUfGNKAXM8UVI",
  formatter: null,
};

const geocoder = NodeGeocoder(options);

module.exports = geocoder;
