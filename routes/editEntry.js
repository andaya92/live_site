/**
 * http://usejsdoc.org/
 */
var db = require('../dbHelper');

exports.showPage = function(req,res,next){
	
	var currentId = req.query.id;
	var currentTable ="";
	var selection = "";
	if(req.query.table ==1){
		currentTable = "customers";
		selection = "_id";
	}else if(req.query.table ==2){
		currentTable = "dairies";
		selection = "dairy_id";
	}
	console.log('editEntryCurrent : ',currentId, currentTable, selection);
	
	db.query(currentTable, selection, currentId, function(err, result){
		if(err){
			console.log("Query Results had error from db: ", err);
		}
		
		console.log("Query Results from db: ", result[0]);
		if(currentTable == "customers"){
			res.render('editEntry', {title: "Edit Form",
				first_name: result[0].first_name,
				last_name: result[0].last_name,
				email:result[0].email,
				street:result[0].street,
				city:result[0].city,
				state:result[0].state,
				zip:result[0].zip,
				phone:result[0].phone,
				customer_key:result[0].customer_key,
				customer_id:result[0]._id	
			
			});
		}else if(currentTable == "dairies"){
			res.render('editEntry_dairy', {title: "Edit Form",
				dairy_name: result[0].dairy_name,
				contact_name: result[0].contact_name,
				contact_email:result[0].contact_email,
				street:result[0].street,
				city:result[0].city,
				state:result[0].state,
				zip:result[0].zip,
				phone:result[0].dairy_phone,
				customer_key:result[0].customer_key,
				dairy_id:result[0].dairy_id	
			});
		}
	});
};

exports.edit_form = function (req, res, next){
	var form_id = req.query.id;
	var query = "SELECT * FROM annual_report WHERE form_id = " + form_id;
	
	db.simpleQuery(query, function(err, result){
		if(err){
			throw err;
			return;
		}
		
		res.render('editEntry_form',{ title: "Edit form", error: "",
			hard_form_name: "Annual Report",
			dairy_key: result[0].dairy_key,
			filer_name: result[0].filer_name,
			milking_cows: result[0].milking_cows,
			dry_cows: result[0].dry_cows,
			heifers: result[0].heifers,
			total_manure: result[0].total_manure,
			ammonium_total: result[0].ammonium_total,
			nitrogen_total: result[0].nitrogen_total,
			volatilization_loss: result[0].volatilization_loss,
			form_id: result[0].form_id
			
		});
	});
	
	
		

};
	

exports.updateForm = function(req, res, next){
	//grab data from forms
	//send update query
	//display results from query if successful
	 var curCustomer = {
			first_name: req.body.first_name,
			last_name: req.body.last_name,
			email:req.body.email,
			street:req.body.street,
			city:req.body.city,
			state:req.body.state,
			zip:req.body.zip,
			phone:req.body.phone,
			customer_key: req.body.customer_key
	};
	 console.log("EDIT: ID:",  req.body.customers_id);
	db.update('customers', curCustomer, req.body.customers_id, function(err, result){
		if(err){
			console.log("editE error: ", result);
			return;
		}
		console.log('editE success: ', result);
		res.render('userSuccessfulEntry', {title: "Successful Edit", error:"", legend_title:"Customer ",
			first_name: req.body.first_name,
			last_name: req.body.last_name,
			email:req.body.email,
			street:req.body.street,
			city:req.body.city,
			state:req.body.state,
			zip:req.body.zip,
			phone:req.body.phone,		
			customer_id:req.body.customers_id,
			customer_key: req.body.customer_key
		
		});
	});
	console.log('Customer ID: ', req.body)
	
	
};

exports.updateForm_dairy = function(req,res,next){
	
	 var curDairy = {
				dairy_name: req.body.dairy_name,
				contact_name: req.body.contact_name,
				contact_email:req.body.contact_email,
				street:req.body.street,
				city:req.body.city,
				state:req.body.state,
				zip:req.body.zip,
				dairy_phone:req.body.phone,
				customer_key: req.body.customer_key
		};
	 db.update('dairies', curDairy, req.body.dairy_id, function(err, result){
		 if(err){
				console.log("Dairy Update Error: ", result);
				return;
			}
			console.log('editE success: ', result);
			res.render('dairySuccessfulEntry', {title: "Successful Edit", error:"", legend_title:"Dairy ",
				dairy_name: req.body.dairy_name,
				contact_name: req.body.contact_name,
				contact_email:req.body.contact_email,
				dairy_street:req.body.street,
				dairy_city:req.body.city,
				dairy_state:req.body.state,
				dairy_zip:req.body.zip,
				dairy_phone:req.body.phone,
				customer_key: req.body.customer_key,
				dairy_id: req.body.dairy_id
			
			});
		 
	 });
	
};

exports.updateForm_report = function(req, res, next){
		
		//calculate total AMMONIUM
		var vol_loss = (100 - req.body.volatilization_loss)/ 100; //Method of Application - Incorporated 3 day (Cool Dry weather)
		var ammonium_available = req.body.ammonium_total * vol_loss;
		
		//calculate total water use
		var milk_cow_water_use = req.body.milking_cows * 20; //20 gallons per day 
		var dry_cow_water_use = req.body.dry_cows * 15; //15 gallons per day 
		var heifers_water_use = req.body.heifers * 10; //10 gallons per day 
		var water_result = milk_cow_water_use + dry_cow_water_use + heifers_water_use;
	
	var curReport = {filer_name: req.body.filer_name,
					dairy_key: req.body.dairy_key,
					milking_cows: req.body.milking_cows,
					dry_cows: req.body.dry_cows,
					heifers: req.body.heifers,
					milking_cows_water_use: milk_cow_water_use,
					dry_cows_water_use: dry_cow_water_use,
					heifers_water_use: heifers_water_use,
					water_result: water_result,
					total_manure: req.body.total_manure,
					ammonium_total: req.body.ammonium_total,
					ammonium_available: ammonium_available,
					volatilization_loss: req.body.volatilization_loss,
					nitrogen_total: req.body.nitrogen_total,
					nitrogen_available: 1337
	};  
	db.update('annual_report', curReport, req.body.form_id, function(err, result){
		if(err){
			console.log("Form update error: ", result);
			return;
		}
		res.render('annual_report_success', {title: "Success", error:"", legend_title: "Successful Edit",
											form_id: req.body.form_id,
											filer_name: req.body.filer_name,
											dairy_key: req.body.dairy_key,
											milking_cows: req.body.milking_cows,
											dry_cows: req.body.dry_cows,
											heifers: req.body.heifers,
											milking_cows_water_use: milk_cow_water_use,
											dry_cows_water_use: dry_cow_water_use,
											heifers_water_use: heifers_water_use,
											water_result: water_result,
											total_manure: req.body.total_manure,
											ammonium_total: req.body.ammonium_total,
											ammonium_available: ammonium_available,
											volatilization_loss: req.body.volatilization_loss,
											nitrogen_total: req.body.nitrogen_total,
											nitrogen_available: 1337		
		});
	});
	
};