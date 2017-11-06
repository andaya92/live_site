var plotly = require('plotly')("andaya92", "H5Rps0S3sIDaLPfzhg0X");
var db = require('../dbHelper')
var ejs = require('ejs');
var async = require('async');

exports.getChartInfo = function(req,res,next){
	console.log('Getting chart info...');
	res.render('chart_pie',{source: null,
		fake_data: null,
		labels: null,
		fake_data1: null
		});
};
exports.showChart = function(req, res, next){
	//pass an id to the grapghs so we know which data set we are currently looking at.....
	console.log('Showing chart info...');
	console.log('Fields: ', req.body.field1, req.body.field2);
	//var source = '//plot.ly/~andaya92/2.embed';
	var isFilled1 = false;
	var isFilled2 = false;
	console.log("adwadawd", req.body.field1)
	if(req.body.field1 !== " "){isFilled1 = true;}
	if(req.body.field2 !== " "){isFilled2 = true;}
	var dataset_input = req.body.field1;
	var dataset_input1 = req.body.field2;
	var args = [];
	var baseSQL = "Select * FROM annual_report WHERE form_id = ";
	var sql = null;
	var sql1 = null;
	if(sql != null){sql = null;}
	if(sql1 != null){sql1 = null;}
	var fSql = baseSQL.concat('1');
	var sql = baseSQL.concat(dataset_input);
	var sql1 = baseSQL.concat(dataset_input1);
	console.log('sql: ', sql, sql1);
	//write async task
	//query twice
	//push results to graph on render
	if(isFilled1){args.push(sql);}
	else{args.push(fSql);}
	if(isFilled2){args.push(sql1);}
	else{args.push(fSql);}
	console.log('Truths: ', isFilled1, isFilled2);
	console.log('args: ', args);

	///////////////////////////////////////////////////////////////////////////////
	var tests = [];
	async.each(args, function(query, callback){
		db.simpleQuery(query, function(err, result){
			if(err){
				callback(err);
				return;
			}
			console.log('Query Suc(chart)');
			tests.push(result);
			callback();
			return;
		});
		
	}, function(err){
		if(err){
			return console.log("DEBUGGER: ", err);
		}
		var result1;
		var result2;

		var array = [];
		console.log('resultsa', tests[0].length );
		console.log('resultsb', array);
		if(tests[0].length == 0){
			 result1 = [{milking_cows:0, dry_cows: 0, heifers: 0}];
			 console.log("THIS MEANS THAT FIELD 1 is bad");
		}
		else{
			result1 = tests[0];
			console.log("THIS MEANS THAT FIELD 1 is good");
		}
		if(tests[1] == 0){
			 result2 = [{milking_cows:0, dry_cows: 0, heifers: 0}];
		}
		else{
			result2 = tests[1];
		}
		//console.log('results1', result1);
		//console.log('results2', result2);
		var total_cows = result1[0].milking_cows + result1[0].dry_cows + result1[0].heifers;
		var data = [result1[0].milking_cows, result1[0].dry_cows, result1[0].heifers, total_cows];
		var total_cows1 = result2[0].milking_cows + result2[0].dry_cows + result2[0].heifers;
		var data1 = [result2[0].milking_cows, result2[0].dry_cows, result2[0].heifers, total_cows1];
		var labels = ['Milking cows', 'Dry Cows', 'Heifers', 'Total'];

		console.log('results1', data);
		console.log('results2', data1);
		
		res.render('chart_pie', {
			fake_data: data,
			labels: labels,
			fake_data1: data1

			});
		
	});
	
	
	
	
	
};