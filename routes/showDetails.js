/**
 * http://usejsdoc.org/
 */
var db = require('../dbHelper');



exports.showPage = function(req, res, next){
	//get data
	var currentId = req.query.id; 
	var table ="";
	var selection ="";
	
	if (req.query.table == 1){
		table = 'customers';
		selection ='_id';
	}else if(req.query.table == 2){
		table = 'dairies';
		selection ='dairy_id';
	}
	
	
	
	db.query(table, selection, currentId, function(err, result){
		if(err){
			throw err;
			return;
		}
		console.log("Table selected ", table);
		console.log("Selection selected ", selection);
		console.log("ID selected ", currentId);
		console.log("Result: ", result);
		if(table == "customers"){
			res.render('userSuccessfulEntry', {title:'About ' + result[0].first_name, legend_title: "Customer ",
				first_name: result[0].first_name,
				last_name: result[0].last_name,
				email:result[0].email,
				street:result[0].street,
				city: result[0].city,
				state: result[0].state,
				zip: result[0].zip,
				phone:result[0].phone,
				customer_id:result[0]._id,
				customer_key: result[0].customer_key,
				error:""
			});	
		}else if(table == "dairies"){
			res.render('dairySuccessfulEntry', {title:'About ' + result[0].dairy_name, legend_title: "Dairy ",
											dairy_name: result[0].dairy_name,
											dairy_phone: result[0].dairy_phone,
											contact_name: result[0].contact_name,
											contact_email: result[0].contact_email,
											dairy_street: result[0].street,
											dairy_city: result[0].city,
											dairy_state: result[0].state,
											dairy_zip: result[0].zip,
											dairy_id: result[0].dairy_id,
											customer_key: result[0].customer_key,
											error:""
			});
		}else{
			res.render('userSuccessfulEntry', {title:'Error ' , legend_title: "Error ",
				first_name: "Error",
				last_name: "",
				email:"",
				street:"",
				city: "",
				state:"",
				zip: "",
				phone:"",
				customer_id:"",
				customer_key: "",
				error:"Error showing details..."
			});
		}
	});

};

exports.showPage_form = function(req, res, next){
	var form_id = req.query.form_id;
	console.log("QUERY: ", form_id);
	var sql = "SELECT * FROM annual_report WHERE form_id = " + form_id;
	db.simpleQuery(sql, function(err, result){
		if(err){
			console.log(err);
			return;
		}
		res.render('annual_report_success', {title: "Details", error:"", legend_title: "Details",
			form_id: result[0].form_id,
			filer_name: result[0].filer_name,
			dairy_key: result[0].dairy_key,
			milking_cows: result[0].milking_cows,
			dry_cows: result[0].dry_cows,
			heifers: result[0].heifers,
			milking_cows_water_use: result[0].milk_cow_water_use,
			dry_cows_water_use: result[0].dry_cow_water_use,
			heifers_water_use: result[0].heifers_water_use,
			water_result: result[0].water_result,
			total_manure: result[0].total_manure,
			ammonium_total: result[0].ammonium_total,
			ammonium_available: result[0].ammonium_available,
			volatilization_loss: result[0].volatilization_loss,
			nitrogen_total: result[0].nitrogen_total,
			nitrogen_available: result[0].nitrogen_available
					
		});
	});
	
};