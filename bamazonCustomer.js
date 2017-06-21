var mysql =require('mysql');
var inquirer = require ('inquirer');
var Table = require('cli-table');

var con = mysql.createConnection({
	host : 'localhost',
	port : 3306,
	user : 'root',
	password :'XXXXXXX',
	database : "bamazon_db"
	})


con.connect(function(err){
	if(err) throw err;
	console.log('connected');
	start_shopping();
})
  


function start_shopping(){
 
  con.query("Select * from select_product",function(err,res){
	  if(err) throw err;
 
 	var table = new Table ({
		head: ["item_id", "product_name", "department_name","product_price","quantity"]

 	 })

	for (var i = 0; i < res.length; i++) {
		 table.push([res[i].item_id,res[i].product_name, res[i].department_name,res[i].product_price,res[i].quantity])
		 
	 }
	console.log(table.toString());

	inquirer.prompt([{

		type : 'input', 
		name : 'id',
		message: 'Please enter the item_id of the product?',
		
		validate: function(value) {
			if(isNaN(value) == false){
				return true;
			} else {
				return false;
			  }
			}
		},{

		
		type: 'input',
		name:'userQuantity',
		message: 'How many do you need?',
		
		validate: function(value){
			var Integer  = Number.isInteger(parseFloat(value));
			var sign = Math.sign(value);

			if (Integer && (sign ===1)){
				
				return true;

			} else {
				return 'Please enter a non zero number.';
			}
		}
		 
	}
 	  ]).then (function(answer){
		var chosenItem =answer.id-1;
		var chosenProduct = res[chosenItem];
	 	var chosenQuantity = answer.userQuantity;
	 		
	 		if(chosenQuantity <= res[chosenItem].quantity){
	 		
	 			console.log('Congratulations! Your order of ' + res[chosenItem].product_name  + " is $"  + res[chosenItem].product_price * chosenQuantity);

	 			con.query('UPDATE select_product SET ? where?',[{
	 		
	 			quantity:res[chosenItem].quantity -chosenQuantity	
	 		
	 		}, {item_id:res[chosenItem].item_id,
	 		
	 		}],	function(err,res){
	 		
	 			start_shopping();
	 	});

	 		} else {
	 			console.log("Sorry!insufficient Quantity at this time.")
	 		}
 	  	 })
		});
	}

