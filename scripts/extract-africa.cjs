const fs = require("fs");

// African country names as they appear in Natural Earth / world-atlas
const AFRICAN_COUNTRIES = new Set([
  "Algeria", "Angola", "Benin", "Botswana", "Burkina Faso", "Burundi",
  "Cameroon", "Cape Verde", "Central African Rep.", "Chad", "Comoros",
  "Congo", "Dem. Rep. Congo", "Côte d'Ivoire", "Djibouti", "Egypt",
  "Eq. Guinea", "Eritrea", "eSwatini", "Ethiopia", "Gabon", "Gambia",
  "Ghana", "Guinea", "Guinea-Bissau", "Kenya", "Lesotho", "Liberia",
  "Libya", "Madagascar", "Malawi", "Mali", "Mauritania", "Mauritius",
  "Morocco", "Mozambique", "Namibia", "Niger", "Nigeria", "Rwanda",
  "São Tomé and Príncipe", "Senegal", "Seychelles", "Sierra Leone",
  "Somalia", "Somaliland", "South Africa", "S. Sudan", "Sudan",
  "Tanzania", "Togo", "Tunisia", "Uganda", "W. Sahara", "Zambia", "Zimbabwe",
]);

const world = JSON.parse(fs.readFileSync("public/geo/world-110m.json", "utf-8"));

// Filter geometries to only African countries
const africaGeometries = world.objects.countries.geometries.filter(
  (g) => AFRICAN_COUNTRIES.has(g.properties.name)
);

console.log("Found", africaGeometries.length, "African countries:");
africaGeometries.forEach((g) => console.log(" -", g.properties.name));

// Create a new topology with just Africa
const africaTopo = {
  type: world.type,
  objects: {
    countries: {
      type: world.objects.countries.type,
      geometries: africaGeometries,
    },
  },
  arcs: world.arcs,
  bbox: world.bbox,
  transform: world.transform,
};

fs.writeFileSync("public/geo/africa.json", JSON.stringify(africaTopo));
console.log("\nWrote public/geo/africa.json");
