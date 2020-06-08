class Utility {};

Utility.map = function(x, xmin, xmax, ymin, ymax) {
	return (x - xmin) / (xmax - xmin) * (ymax - ymin) + ymin;
};

Utility.lerp = function(a, b, k) {
	return a * (1 - k) + b * k;
}

export default Utility;