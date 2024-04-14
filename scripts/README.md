## Scripts
This folder contains code scripts used in the project.

#### generate_cropland_prediction_points.js
This script is used to generate georefernced cropland points. It uses LULC prediction time series over a geographical region as input and samples random points which are predicted as cropland by the time series. Number of points generated and region to be used is customisable in the script (depending on input).

#### get_cropping_intensity_pred_diff,js
This script is used to generate color coded georeferenced points based on prediction differences between two LULC prediction time series over a common region. It takes two LULC time series as input and checks specifically for cropping intensity based prediction differences between the two.
