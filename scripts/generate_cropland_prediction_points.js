// This script is used to sample cropland points for a region from its LULC output for a particular hydrological year. Change input LULC image and num of points to change region/year and points sampled respectively.

// Image input as Sirohi LULC output for HY2020 
var image = ee.Image("projects/ee-indiasat/assets/LULC_Version2_Outputs_NewHierarchy/Sirohi_2020-07-01_2021-06-30_LULCmap_100m_Final_pipeline");

// Convert predicted_label band to integer values
var integerImage = image.select("predicted_label").toInt();

// Generate random points across the entire masked image (It is assumed that LULC image input is at 100m. Change scale parameter accordingly depending on input LULC image scale)
var randomPoints = integerImage.addBands(ee.Image.random()).reduceToVectors({
  geometry: integerImage.geometry(),
  scale: 100, // Specify scale to ensure points are generated within each pixel
  geometryType: 'centroid', // Generate points at pixel centroids
  eightConnected: false, // Generate points in 4-connected mode
  labelProperty: 'randomPoints', // Property name for random points
  reducer: ee.Reducer.mean() // Use mean reducer to generate points
});

// Add the predicted_label property to each random point
randomPoints = randomPoints.map(function(point) {
  var predictedLabel = ee.Number(integerImage.reduceRegion(ee.Reducer.first(), point.geometry(), 100).get("predicted_label"));
  return point.set("predicted_label", predictedLabel);
});

// Filter the random points based on the specified condition
var valuesToFilter = [8, 9, 10, 11]; // List of values to filter (8- Single Kharif, 9 - Single Non Kharif, 10 - Double, 11 - Triple)
randomPoints = randomPoints.filter(ee.Filter.inList("predicted_label", valuesToFilter));

// Randomly sample 5000 points (Change this number for more points)
randomPoints = randomPoints.randomColumn('random', 42).sort('random').limit(5000);

var renamedFC = randomPoints.map(function(feature) {
  var renamedValue = feature.get("predicted_label"); // Get the value from the original column
  return feature.set("predicted_label_asset", renamedValue).select(["predicted_label_asset"]); // Set the value to a new column name and select only the new column
});

// Export as a feature collection
Export.table.toAsset({
  collection: renamedFC,
  description: 'random_points_filtered',
  assetId: 'projects/ee-indiasat/assets/Polygon_Groundtruth/Jamui_cropland_GT_5000_100m_2013_14'
});

// print(randomPoints);

// Map.addLayer(image);
// Map.addLayer(randomPoints);
