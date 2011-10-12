/*global describe: false, it: false, expect: false */

var SerialGenerator = function SerialGenerator(options) {
	"use strict";
	
	if (!options) {
		throw {
			name: "ArgumentMissing",
			message: "missing argument options, which must have an Array property row with at least one member"
		};
	}
	
	if (!options.row) {
		throw { 
			name: "ArgumentMissing",
			message: "options must have an Array property row with at least one member"
		};
	}
	
	if (!Array.isArray(options.row)) {
		throw { 
			name: "InvalidArgument", 
			message: "options.row must be an Array with at least one member"
		};
	}
	
	if (!this instanceof SerialGenerator) {
		return new SerialGenerator(options);
	}
	
	var row = options.row,
	
		positions = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
		
		positiveMod = function (number, modulus) {
			return (number % modulus + modulus) % modulus;
		},
		
		mapPitches = function (index) {
			var pitch = row[positiveMod(index, 12)];
			return pitch;
		},
		
		mapPositions = function (item) {
			var pitch = row.indexOf(positiveMod(item, 12));
			return pitch;
		};
	
	this.getPitches = function (callback) {
		callback = callback || function (item, lookup) {
			var pitch = lookup(item);
			return pitch;
		};
	
		return positions.map(function (item) {
			var pitch = positiveMod(callback(item, mapPitches), 12);
			return pitch;
		});
	};
	
	this.getPositions = function (callback) {
		callback = callback || function (item, lookup) {
			var pitch = lookup(item);
			return pitch;
		};
	
		return positions.map(function (item) {
			var pitch = positiveMod(callback(item, mapPositions), 12);
			return pitch;
		});
	};
};



describe("SerialGenerator", function () {
	"use strict";
	
	var row = [0, 2, 3, 1, 4, 5, 6, 7, 8, 9, 10, 11];
	
	describe("construtor", function () {
	
		it("should throw and exception if you don't pass in any options", function () {
			expect(function () {
				var sg = new SerialGenerator();
			}).toThrow({
				name: "ArgumentMissing",
				message: "missing argument options, which must have an Array property row with at least one member"
			});
		});
	
		it("should throw an exception if you don't pass in a row", function () {
			expect(function () {
				var sg = new SerialGenerator({});
			}).toThrow({
				name: "ArgumentMissing",
				message: "options must have an Array property row with at least one member"
			});
		});
		
		it("shuld throw and exception if the row is not an Array", function () {
			expect(function () {
				var sg = new SerialGenerator({
					row: {}
				});
			}).toThrow({ 
				name: "InvalidArgument",
				message: "options.row must be an Array with at least one member"
			});
		});
		
		it("should not throw an exception if you do pass in a row", function () {
			var sg = new SerialGenerator({
				row: row
			});
		});
	});
	
	describe("getPitches", function () {
		it("should return the row from the constructor when no parameters are passed in", function () {
			var	sg = new SerialGenerator({
					row: row
				}),
				result = sg.getPitches();
				
			expect(result).toEqual(row);
		});
		
		it("should return the row when an identity transformation is passed in", function () {
			var sg = new SerialGenerator({
					row: row
				}),
				result = sg.getPitches(function (item, lookup) {
					return lookup(item);
				});
			expect(result).toEqual(row);
		});
		
		it("should return the correct row when a transposition transformation is passed in", function () {
			var sg = new SerialGenerator({
					row: row
				}),
				result = sg.getPitches(function (item, lookup) {
					return lookup(item) + 1;
				});
			expect(result).toEqual([1, 3, 4, 2, 5, 6, 7, 8, 9, 10, 11, 0]);
		});
		
		it("should return the correct row when a rotation transformation is passed in", function () {
			var sg = new SerialGenerator({
					row: row
				}),
				result = sg.getPitches(function (item, lookup) {
					return lookup(item + 1);
				});
			expect(result).toEqual([2, 3, 1, 4, 5, 6, 7, 8, 9, 10, 11, 0]);
		});
		
		it("should return the correct row when a rotation and transposition transformation is passed in", function () {
			var sg = new SerialGenerator({
					row: row
				}),
				result = sg.getPitches(function (item, lookup) {
					return lookup(item + 1) + 1;
				});
			expect(result).toEqual([3, 4, 2, 5, 6, 7, 8, 9, 10, 11, 0, 1]);
		});
		
		it("should return the correct row when a pitch stretching transformation is passed in", function () {
			var sg = new SerialGenerator({
					row: row
				}),
				result = sg.getPitches(function (item, lookup) {
					return lookup(item) * 5;
				});
			expect(result).toEqual([ 0, 10, 3, 5, 8, 1, 6, 11, 4, 9, 2, 7 ]);
		});
		
		it("should return the correct row when a position skipping transformation is passed in", function () {
			var sg = new SerialGenerator({
					row: row
				}),
				result = sg.getPitches(function (item, lookup) {
					return lookup(item * 5);
				});
			expect(result).toEqual([ 0, 5, 10, 1, 8, 2, 6, 11, 4, 9, 3, 7 ]);
		});
		
		it("should be able to retrograde the series", function () {
			var sg = new SerialGenerator({
					row: row
				}),
				result = sg.getPitches(function (item, lookup) {
					return lookup(-item);
				});
			expect(result).toEqual([0, 11, 10, 9, 8, 7, 6, 5, 4, 1, 3, 2]);
		});
		
		it("should be able to invert the series", function () {
			var sg = new SerialGenerator({
					row: row
				}),
				result = sg.getPitches(function (item, lookup) {
					return -lookup(item);
				});
			expect(result).toEqual([0, 10, 9, 11, 8, 7, 6, 5, 4, 3, 2, 1]);
		});
	});
	
	describe("getPositions", function () {
		it("should map the row correctly when no parameters are passed in", function () {
			var sg = new SerialGenerator({
					row: row
				}),
				result = sg.getPositions();
			
			expect(result).toEqual([0, 3, 1, 2, 4, 5, 6, 7, 8, 9, 10, 11]);
		});
		
		it("should map the row correctly when an identity transformation is passed in", function () {
			var sg = new SerialGenerator({
					row: row
				}),
				result = sg.getPositions(function (item, lookup) {
					return lookup(item);
				});
			
			expect(result).toEqual([0, 3, 1, 2, 4, 5, 6, 7, 8, 9, 10, 11]);
		});
		
		it("should map the row correctly when a rotation transformation is passed in", function () {
			var sg = new SerialGenerator({
					row: row
				}),
				result = sg.getPositions(function (item, lookup) {
					return lookup(item + 1);
				});
			
			expect(result).toEqual([3, 1, 2, 4, 5, 6, 7, 8, 9, 10, 11, 0]);
		});
		
		it("should map the row correctly when a transposition transformation is passed in", function () {
			var sg = new SerialGenerator({
					row: row
				}),
				result = sg.getPositions(function (item, lookup) {
					return lookup(item) + 1;
				});
			
			expect(result).toEqual([1, 4, 2, 3, 5, 6, 7, 8, 9, 10, 11, 0]);
		});
		
		it("should map the row correctly when a rotation and transposition transformation is passed in", function () {
			var sg = new SerialGenerator({
					row: row
				}),
				result = sg.getPositions(function (item, lookup) {
					return lookup(item + 1) + 1;
				});
			
			expect(result).toEqual([4, 2, 3, 5, 6, 7, 8, 9, 10, 11, 0, 1]);
		});
	});

});