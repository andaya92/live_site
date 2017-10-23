var db = require('../dbHelper');

	var testStr =function(string){
	//regular expression matching for a space
	console.log("Testing string:(", string, ")");
	if(/ /.test(string) || string.length == 0){
		return false;
	}return true;
	};


	//tests an array of input field data
	//concats to an empty string a T(true; or valid data) or an F(false; invalid data) 
	var testInput = function(varArray){
	var varResults = "";
	 console.log("ZEBUG: ", varArray.length);
	for(var i=0; i < varArray.length; i++){
		 if(testStr(varArray[i])){
			 //true; good input, no spaces, greater than two
			 varResults = varResults.concat("T");
			 console.log("varResults : ", varResults);
		 }else{
			 //false
			 varResults = varResults.concat("F");
			 console.log("varResults: ", varResults);
		 } 
	}
	return varResults;
	};



exports.display_form = function(req, res, next){
	var error ="";
	if(req.query.error!= null){
		error = req.query.error;
	}
	res.render('search_form',{title: "Search Forms", errors: error,
								resultData: null
	});
	
};

exports.display_results = function(req, res, next){
	
	var dairy_key = (req.body.dairy_key != null || req.body.dairy_key != undefined && req.body.dairy_key != " ")? req.body.dairy_key : " ";
	var filer_name = (req.body.filer_name != null || req.body.filer_name != undefined && req.body.filer_name != " ")? req.body.filer_name : " ";
	var date = (req.body.date != null || req.body.date != undefined && req.body.date != " ")? req.body.date : " ";
	var projection = "*";
	console.log("search form results: ","." + dairy_key + ".", filer_name, '.' +  date + '.');
	
	var col_key = ['form_id', 'dairy_id', 'dairy_key', 'filer_name', 'date'];
	var col_values = [1, dairy_id, dairy_key,  filer_name, date];
	var fieldInput = testInput(col_values);
	var table = "annual_report";
	
		
				var createSQL = function(fieldInput, projection, table, keys, values ){
					 var sqlString = 'SELECT ' + projection + ' FROM ' + table + ' WHERE ';
					 var appendedFirstName = false;
					 if(fieldInput == "TFFFF" || fieldInput == "FFFF"){
						 
						sqlString = 'SELECT ' + projection + ' FROM ' + table + ' WHERE ' + keys[0] + ' >= ' + values[0];
						appendedFirstName = true;
					 }
					if(fieldInput[1] == 'T') {
						//append first name query
						 sqlString = sqlString.concat(keys[1] + " LIKE '" + values[1] + "%'");
						 appendedFirstName = true;
					}
					if(fieldInput[2] == 'T') {
						//append last name query
						 sqlString = sqlString.concat(" AND " + keys[2] + " LIKE '" + values[2] + "%'");
					}
					if(fieldInput[3] == 'T') {
						//append email query
						 sqlString = sqlString.concat(" AND " + keys[3] + " LIKE '" + values[3] + "%'");
					}
					if(fieldInput[4] == 'T') {
						//append email query
						 sqlString = sqlString.concat(" AND " + keys[4] + " LIKE '" + values[4] + "%'");
					}
					
					
					if(!appendedFirstName){
					//if first name was not appeneded to sql query, the first part after the WHERE clause will be = WHERE AND col_name = value;
						//remove the first instance of ' AND '
						var index = sqlString.indexOf(" AND ");
						console.log("AND index: ", index);
						var firstPart = sqlString.substring(0, index);
						var secondPart = sqlString.substring(index + 4, sqlString.length);
						sqlString = firstPart.concat(secondPart);
						console.log("saqlString ", sqlString);
					}
					return sqlString;
				};

		var sql = createSQL(fieldInput, projection, table, col_key, col_values);
		console.log("SQL: ", sql);
	
		db.simpleQuery(sql, function(err, result){
			if(err){
				console.log(result);
				return;
			}
			console.log("QResult: ", result);
			res.render('search_form', {title: 'Search Results', errors: "",
									resultData: result});
			
									
		});
		
		
};
