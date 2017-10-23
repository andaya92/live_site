/**
 * http://usejsdoc.org/
 */
var insertHelper = require('../dbHelper')


//var table = "customers";
//insertHelper.drop(table);


/*
 * GET users listing.
 */

exports.showForm = function(req, res, next){
	res.render('blank_form', {title: "New Customer", error:null
					});
	

	
};
exports.showForm_dairy = function(req, res, next){
	var SQL = 'SELECT * FROM customers';
	insertHelper.simpleQuery(SQL, function(err, result){
		if(err){
			console.error("Error Showing customers in create new dairy", err);
			return;
		}
		res.render('blank_form_dairy', {title: "New Dairy", error:null,
			custResult: result
		
		});
	});
	
	

	
};


exports.post = function(req, res, next){
	
		
	

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
	
	//Store results in Database
insertHelper.insert('customers', curCustomer, function(err, result){
	if(err){
		console.error(err, result.sqlMessage);
		res.render('blank_form', {title: "New Form", error: result.sqlMessage
		});
		return;
	}else if(!err){
		console.error(err, result);
		res.render('userSuccessfulEntry', {title: 'Success', legend_title: "Customer ",
			first_name: req.body.first_name,
			last_name: req.body.last_name,
			email:req.body.email,
			street:req.body.street,
			city:req.body.city,
			state:req.body.state,
			zip:req.body.zip,
			phone:req.body.phone,
			customer_id:result.insertId,
			customer_key: req.body.customer_key,
			error: ""

		});

	}
	
});
	
		

};

exports.post_dairy = function(req, res, next){
	//called once add dairy form is submitted
		
	

	var curDairy = {
			dairy_name: req.body.dairy_name,
			contact_name: req.body.contact_name,
			contact_email:req.body.contact_email,
			street:req.body.dairy_street,
			city:req.body.dairy_city,
			state:req.body.dairy_state,
			zip:req.body.dairy_zip,
			dairy_phone:req.body.dairy_phone,
			customer_key: req.body.customer_key,
			customer_id: req.body.customer_id
	};
	console.log("Current Dairy Input ", req.body);
	
	//Store results in Database
insertHelper.insert('dairies', curDairy, function(err, result){
	if(err){
		console.error(err, result.sqlMessage);
		res.render('blank_form_dairy', {title: "New Form", error: result.sqlMessage, custResult: null
		});
		return;
	}else if(!err){
		console.error(err, result);
		res.render('dairySuccessfulEntry', {title: 'Success', legend_title: "Dairy ",
			dairy_name: req.body.dairy_name,
			contact_name: req.body.contact_name,
			contact_email:req.body.contact_email,
			dairy_street:req.body.dairy_street,
			dairy_city:req.body.dairy_city,
			dairy_state:req.body.dairy_state,
			dairy_zip:req.body.dairy_zip,
			dairy_phone:req.body.dairy_phone,
			dairy_id:result.insertId,
			customer_key: req.body.customer_key,
			customer_id: req.body.customer_id,
			error: ""

		});

	}
	
});
	
		

};

