/**
 * http://usejsdoc.org/
 */
var mysql = require('mysql')
console.log('Using helper....')
var connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'coolio',
	database: 'test'
});




exports.drop = function (table){
	var query = connection.query("DROP TABLE " + table, function(err, result){
		if(err){
			console.log("Error dropping table: ", err);
			return;
		}
		console.log(result.sql);
		console.log(result);
	});
	
};

//IMPLEMENT THE CALLBACK FEATURE SO CREATE_FORM WILL WORK PROPERLY db helper:  insert

exports.insert = function(table, values, callback){
	var insertQuery = "INSERT INTO " + table + " SET ?"
	var rowsInserted = connection.query(insertQuery, values, function(err, result){
		if(err){
			//console.error('Error inserting.', err);
			callback(true, err);
			return;
		}
		//console.log('InsHelper Results: ', result);
		callback(false, result);
		return result.insertId;
	
	});
}

exports.update = function(table, values, selectionArgs, callback){
	var selection ="";
	if(table == "customers"){selection = "_id";}
	else if(table == "dairies"){selection ="dairy_id";}
	else if(table == "annual_report"){selection ="form_id";}
		
		
	var updateQuery = "UPDATE " + table + " SET " + "?" + " WHERE " + selection + " = " + selectionArgs;
	var rowsUpdated = connection.query(updateQuery,values , function(err, result){
		if(err){
			callback(true, err);
			//console.error("Error updating (hlpr) ", err);
			return;
		}
		callback(false, result.message);
		//console.log("Update successful.", result);
		
	});
};

exports.simpleQuery = function(simpleQueryStatement, callback){
	var qResult = connection.query(simpleQueryStatement, function(err, result){
		if(err){
			console.error("Error selectiong from table ", err);
			callback(true, err);
			return;
		}
		callback(false, result);
	});
	
};
exports.query = function(table, selection, selectionArgs, callback){
	var selectQuery = "Select * FROM " + table + " WHERE " + selection + " =?";
	var qResult = connection.query(selectQuery, selectionArgs, function(err, result){
		if(err){
			console.error("Error selectiong from table ", err);
			callback(true, err);
			return;
		}
		callback(false, result);
	
	});
	//console.log("Selection Query: ", qResult);
	
};



