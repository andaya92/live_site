var mysql = require('mysql');
var db = require('../dbHelper');
var async = require('async');



/*
 * 							Fake data
 * 
 */

var fakeData = null; 
//	[{first_name: " ",
//	last_name: " ",
//	city: " ",
//	email: " ",
//	phone: " ",
//	zip: " ",
//	_id: 1,
//}];

//fake dairy data
var dairy_fakeData = null;
//[{dairy_name: " ",
//	contact_name: "NULL",
//	dairy_city: "NULL",
//	contact_email: "NULL",
//	dairy_phone: "NULL",
//	dairy_zip: "NULL",
//	dairy_id: 1
//}];

/*
 * 							Tests
 * 
 */
//tests fields for spaces, no fields really have a space
//tests data from input fields,
//currently tests for spaces and since I add a single quote, there wil always be 
// a minimum of one
var testStr =function(string){
//regular expression matching for a space
console.log("Testing string:(", string, ")");
if(/ /.test(string) || string.length == 1){
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
		 console.log("varResults: ", varResults);
	 }else{
		 //false
		 varResults = varResults.concat("F");
		 console.log("varResults: ", varResults);
	 } 
}
return varResults;
};

//creates statement depending on which forms are filled out



/*
 * 
 * END TESTS
 * 
 */




/*
 * GET about page.
 */

exports.showPage = function(req, res){
	//real data => result
	res.render('about', { title: 'Customers',
		  errors:'',
		  resultData: fakeData,
		  dairy_resultData: dairy_fakeData
	});	
}

exports.post = function(req, res, next){
	//get data
	//for customers
	
	var firstName = (req.body.firstName != "") ? ("'" + req.body.first_name) : "bitch ";
	var lastName = (req.body.lastName != "") ? ("'" + req.body.last_name) : " ";
	var email = (req.body.email != undefined) ? ("'" + req.body.email) : " ";
	var city = (req.body.city != undefined) ? ("'" + req.body.city) : " ";
	var phoneNumber = (req.body.phoneNumber != undefined) ? ("'" + req.body.phoneNumber) : " ";
	var zipCode = (req.body.zipCode != undefined) ? ("'" + req.body.zipCode) : " ";
	console.error("Name error:1 ", firstName," 2: ", req.body.first_name);
	//for dairies
	var dairy_name = (req.body.dairy_name != undefined) ? ("'" + req.body.dairy_name) : " ";
	var contact_name = (req.body.contact_name != undefined) ? ("'" + req.body.contact_name) : " ";
	var contact_email =  (req.body.contact_email != undefined) ? ("'" + req.body.contact_email) : " ";
	var dairy_city = (req.body.dairy_city != undefined) ? ("'" + req.body.dairy_city) : " ";
	var dairy_phone = (req.body.dairy_phone != undefined) ? ("'" + req.body.dairy_phone) : " ";
	var dairy_zip =  (req.body.dairy_zip != undefined) ? ("'" + req.body.dairy_zip) : " ";
	
	
	var customer_projection = '*';
	var dairy_projection = '*';
	
	//Build Queries
	var customer_col_keys = ['_id', 'first_name', 'last_name', 'email', 'phone', 'city', 'zip'];
	var customer_col_values = [1000, firstName, lastName, email, phoneNumber, city, zipCode];
	var dairy_col_keys =['dairy_id', 'dairy_name', 'contact_name', 'contact_email', 'dairy_city', 'dairy_phone', 'dairy_zip'];
	var dairy_col_values =[1000, dairy_name, contact_name, contact_email, dairy_city, dairy_phone, dairy_zip];
	
	
	var createCustomerSQL = function(fieldInput, projection, table, keys, values ){
		 var sqlString = 'SELECT ' + projection + ' FROM ' + table + ' WHERE ';
		 var appendedFirstName = false;
		 if(fieldInput == "FFFFFFF"){
			 
			sqlString = 'SELECT ' + projection + ' FROM ' + table + ' WHERE ' + keys[0] + ' = ' + values[0];
			appendedFirstName = true;
		 }
		if(fieldInput[1] == 'T') {
			//append first name query
			 sqlString = sqlString.concat(keys[1] + " LIKE " + values[1] + "%'");
			 appendedFirstName = true;
		}
		if(fieldInput[2] == 'T') {
			//append last name query
			 sqlString = sqlString.concat(" AND " + keys[2] + " LIKE " + values[2] + "%'");
		}
		if(fieldInput[3] == 'T') {
			//append email query
			 sqlString = sqlString.concat(" AND " + keys[3] + " LIKE " + values[3] + "%'");
		}
		if(fieldInput[4] == 'T') {
			//append phone query
			 sqlString = sqlString.concat(" AND " + keys[4]  + " LIKE " + values[4] + "%'");
		}
		if(fieldInput[5] == 'T') {
			//append City query
			 sqlString = sqlString.concat(" AND " + keys[5] + " LIKE " + values[5] + "%'");
		}
		if(fieldInput[6] == 'T') {
			//append Zip query
			 sqlString = sqlString.concat(" AND " + keys[6] + " LIKE " + values[6] + "%'");
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
	
	//customer input and results
	//MUST BE IN ORDER WITH OTHER INPUT (COL KEY/ VLAUES)
		//must match the cases above in createSQL (first spot is for _id which there is no input field for)
										//i.e. I never check input[0], doesn't matter what is there except null because .length throws error on NULL
	var customer_field_input = ["a", firstName, lastName, email, phoneNumber, city, zipCode];
	var customer_field_results = testInput(customer_field_input);
	
	var dairy_field_input = ["a", dairy_name, contact_name, contact_email, dairy_city, dairy_phone, dairy_zip];
	var dairy_field_results = testInput(dairy_field_input);

	
	 console.log("Customer Field Test Result: ", customer_field_results);
	 console.log("Dairy Field Test Result: ", dairy_field_results);
	
	

	var customer_query = createCuawstomerSQL(customer_field_results, customer_projection, 'customers', customer_col_keys, customer_col_values);
	console.log("createSQL C: ", customer_query);
	
	var dairy_query = createCustomerSQL(dairy_field_results, dairy_projection, 'dairies', dairy_col_keys, dairy_col_values);
	console.log("createSQL D: ", dairy_query);
	
	//build fake result to deliver to page for error
	
	
	//display query results

	//store results
	var tests = [];
	
	//arrays of inputs for 2nd param which is a function with added callback
		//2nd param, callback once you are done with function
			///here I push the result from each db query to an array
		//3rd param is a final function that is called once all items have been used in first param
			//here I know my array will be full of results to use to populate data with
	async.each([customer_query, dairy_query], function(query, callback){
		db.simpleQuery(query, function(err, result){
			if(err){
				callback(err);
				return;
			}
			console.log('Query Suc');
			tests.push(result);
			callback();
			return;
		});
		
	}, function(err){
		console.log("DEBUGGER: ", err);
		if(err){
			res.render('about', {title: "Error",
							errors:"Error",
							resultData:fakeData,
							dairy_resultData: dairy_fakeData})
		}
		//console.log("GODLIKE: ", tests);
		var customer_results = tests[0];
		var dairy_results = tests[1];
		
		res.render('about', {title: "Aboot",
							errors:"",
							resultData:customer_results,
							dairy_resultData: dairy_results
		});
		
	});

	

};


		