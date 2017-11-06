var db = require('../dbHelper');
/*
 * GET users listing.
 */

exports.list = function(req, res, next){
	var error = "";
	var fakeData = {dairy_name: " Error with db",
					dairy_id: 0 };
	
	if(req.query.error != null){
		error = req.query.error;
	}
	var SQL = 'SELECT * FROM dairies';
	
	db.simpleQuery(SQL, function(err, result){
		if(err){
			res.render('file_form', {title: "New Report", error: err,
				dairyResult: fakeData,
				hard_form_name: "Annual Report"
			
			});
			console.error("Error Showing customers in create new dairy", err);
			return;
		}
		res.render('file_form', {title: "New Dairy", error: error,
			dairyResult: result,
			hard_form_name: "Annual Report"
		
		});
	});
};

exports.post_annual_report = function(req, res, next){
	curFormData = {
		dairy_key: req.body.dairy_key,	
		filer_name: req.body.filer_name,	
		milking_cows: req.body.milking_cows,	
		dry_cows: req.body.dry_cows,	
		heifers: req.body.heifers,	
		total_manure: req.body.total_manure,	
		total_ammonium: req.body.ammonium_total,	
		total_nitrogen: req.body.nitrogen_total,	
		v_loss: req.body.v_loss	
	};
	
	//calculate total AMMONIUM
	var vol_loss = (100 - req.body.v_loss)/100; //Method of Application - Incorporated 3 day (Cool Dry weather)
	var available_ammonium = req.body.ammonium_total * vol_loss;
	
	//calculate total water use
	var milk_cow_water_use = req.body.milking_cows * 20; //20 gallons per day 
	var dry_cow_water_use = req.body.dry_cows * 15; //15 gallons per day 
	var heifers_water_use = req.body.heifers * 10; //10 gallons per day 
	var water_result = milk_cow_water_use + dry_cow_water_use + heifers_water_use;
	
	var table = 'annual_report';
	var formValues = {
            filer_name: req.body.filer_name,
            dairy_key: req.body.dairy_key,
			milking_cows: req.body.milking_cows,
			dry_cows: req.body.dry_cows,
			heifers: req.body.heifers,
            milking_cows_water_use: 0,
			dry_cows_water_use: 0,
			heifers_water_use: 0,
            water_result: water_result,
            total_manure:  req.body.total_manure,
            ammonium_total: req.body.ammonium_total,
            ammonium_available: available_ammonium,
            volatilization_loss: req.body.v_loss,
			nitrogen_total: req.body.nitrogen_total,
			nitrogen_available: 0
			
	};
	var insertID = db.insert(table, formValues, function(err, result){
		if(err){
			var redirectUrl = "/file_form?error=" + result.sqlMessage;
			res.redirect(redirectUrl);
			console.error("Error inserting report..." , redirectUrl); return;
			
		}
		console.log("Insert ID: ", result);

		res.render('annual_report_success', {
			title:"AR", error:"", legend_title: "Annual Report Summary",
			form_id: result.insertId,
			dairy_key: req.body.dairy_key,	
			filer_name: req.body.filer_name,	
			milking_cows: req.body.milking_cows,	
			dry_cows: req.body.dry_cows,	
			heifers: req.body.heifers,	
			total_manure: req.body.total_manure,	
			ammonium_total: req.body.ammonium_total,
			ammonium_available: available_ammonium,
			nitrogen_total: req.body.nitrogen_total,	
			water_result: water_result,
			available_ammonium: available_ammonium,
			v_loss: req.body.v_loss	
			
		});
	});
	
	
	console.log("Experimetnal Variable " + insertID);
}



