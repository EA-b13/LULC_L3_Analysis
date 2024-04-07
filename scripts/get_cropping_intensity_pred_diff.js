// This script is used to highlight color coded points that mark differences in cropping intensity prediction for a single region from different time series/clustering. It generates different categories based on cropping intensity prediction differences, plots them on GEE map and prints the number of points for each category. Please run this script on the GEE code editor. This script is also saved as a script on GEE: https://code.earthengine.google.com/?scriptPath=users%2Fmtpictd%2Feashan%3AJamui_5000_inequal_points

// Load the images
var firstImage = image; //Load first prediction image
var secondImage = image2; //Load second prediction image

// Get the bounding box of the first image
var studyArea = firstImage.geometry().bounds();

// Define categories
// 8 - Single Kharif
// 9 - Single Non-Kharif
// 10 - Double
// 11 - Triple
var categories = [
  {name: '8-9', expression: firstImage.select('predicted_label').eq(8).and(secondImage.select('predicted_label').eq(9)), color: 'blue'},
  {name: '9-8', expression: firstImage.select('predicted_label').eq(9).and(secondImage.select('predicted_label').eq(8)), color: 'green'},
  {name: '8-10', expression: firstImage.select('predicted_label').eq(8).and(secondImage.select('predicted_label').eq(10)), color: 'red'},
  {name: '10-8', expression: firstImage.select('predicted_label').eq(10).and(secondImage.select('predicted_label').eq(8)), color: 'yellow'},
  {name: '8-11', expression: firstImage.select('predicted_label').eq(8).and(secondImage.select('predicted_label').eq(11)), color: 'orange'},
  {name: '11-8', expression: firstImage.select('predicted_label').eq(11).and(secondImage.select('predicted_label').eq(8)), color: 'purple'},
  {name: '9-10', expression: firstImage.select('predicted_label').eq(9).and(secondImage.select('predicted_label').eq(10)), color: 'cyan'},
  {name: '10-9', expression: firstImage.select('predicted_label').eq(10).and(secondImage.select('predicted_label').eq(9)), color: 'magenta'},
  {name: '9-11', expression: firstImage.select('predicted_label').eq(9).and(secondImage.select('predicted_label').eq(11)), color: 'lime'},
  {name: '11-9', expression: firstImage.select('predicted_label').eq(11).and(secondImage.select('predicted_label').eq(9)), color: 'pink'},
  {name: '10-11', expression: firstImage.select('predicted_label').eq(10).and(secondImage.select('predicted_label').eq(11)), color: 'brown'},
  {name: '11-10', expression: firstImage.select('predicted_label').eq(11).and(secondImage.select('predicted_label').eq(10)), color: 'teal'}
];

// Initialize an empty list to store layer names and counts
var layerList = [];

// Iterate over categories
categories.forEach(function(category) {
  // Extract the pixels where the condition is true (1)
  var mask_true = category.expression.eq(1);

  // Apply the mask to itself
  var masked_true = mask_true.updateMask(mask_true);

  // Display the binary mask for true values
  Map.centerObject(studyArea, 10);
  Map.addLayer(masked_true, {palette: category.color}, 'Mask for ' + category.name + ' (1)');

  // Count the number of pixels where the condition is true
  var count_true = masked_true.reduceRegion({
    reducer: ee.Reducer.count(),
    geometry: studyArea,
    scale: 100,
    maxPixels: 1e9
  });

  // Print the count for the pixels where the condition is true
  print('Count for pixels where condition is true for ' + category.name + ':', count_true.get('predicted_label'));
  
  // Add layer name and count to the layerList
  layerList.push({name: category.name, count: count_true.get('predicted_label')});
});

// Print layerList
print('Layer list:', layerList);





