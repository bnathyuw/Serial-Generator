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
		positions = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
	
	this.getPitches = function () {
		return row;
	};
	
	this.getPositions = function () {
		return positions.map(function (item) {
			return row.indexOf(item);
		});
	};
};



describe("SerialGenerator", function () {
	"use strict";
	
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
				row: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
			});
		});
	});
	
	describe("getPitches", function () {
		it("should return the row from the constructor when no parameters are passed in", function () {
			var row = [0, 2, 3, 1, 4, 5, 6, 7, 8, 9, 10, 11],
				sg = new SerialGenerator({
					row: row
				}),
				result = sg.getPitches();
				
			expect(result).toEqual(row);
		});
	});
	
	describe("getPositions", function () {
		it("should map the row correctly when no parameters are passed in", function () {
			var row = [0, 2, 3, 1, 4, 5, 6, 7, 8, 9, 10, 11],
				sg = new SerialGenerator({
					row: row
				}),
				result = sg.getPositions();
			
			expect(result).toEqual([0, 3, 1, 2, 4, 5, 6, 7, 8, 9, 10, 11]);
		});
	});

});