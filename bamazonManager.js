var mysql = require ('mysql');
var inquirer = require('inquirer');
var Table = require('cli-table');

var con = mysql.createConnection({
	host: 'localhost',
	port : '3306',
	user : 'root',
	password: 'xxxxxxx',
	database: "bamazon_db"
});

con.connect(function(err){
	if (err)throw err;
	console.log('connected');
	managerPrompt();
	// viewInventory();
})

// Function to prompt the manager to select between the choices 
var managerPrompt =function() {
	inquirer.prompt({
	name 	: 'action',
	type 	: 'list',
	message	: 'what would you like to do?',
	
	choices	: ['View products for sale','View low inventory','Add to inventory','Add new inventory','Exit']
	}).then(function(answer){
			switch(answer.action){
				case 'View products for sale':
					  viewInventory();
					 	break;

				case 'View low inventory'    :
					  lowInventory(); 
						break;

				case 'Add to inventory'      :
					  addInventory();
					 	break;

				case 'Add new inventory'     :
					  newInventory();
						break;  

				case 'Exit'                  :
					  con.end();
						break;		 			
			
			}//answer.action
		})//function(answer)
	}// function start

function viewInventory() {
		con.query("Select * from select_product",function(err,res){
	  	if(err) throw err;
	    var table = new Table ({
		head: ["item_id", "product_name", "department_name","product_price","quantity"]
 	})

	for (var i = 0; i < res.length; i++) {
	 	  table.push([res[i].item_id,res[i].product_name, res[i].department_name,res[i].product_price,res[i].quantity])
	}
	 console.log(table.toString());
	 managerPrompt();
	})// query
	}// func.data

function lowInventory() {
	con.query("Select * from select_product WHERE quantity < 5",
	
	function(err,res){
	if(err) throw err;
	if(res.length===0){
	console.log("There are no item with low inventory.Please check later.");
			managerPrompt();
	} else{
 
 	var table = new Table ({
		head: ["item_id", "product_name", "department_name","product_price","quantity"]
 	})

	for (var i = 0; i < res.length; i++) {
		table.push([res[i].item_id,res[i].product_name, res[i].department_name,res[i].product_price,res[i].quantity])
	}
	console.log(table.toString());
	console.log("this item has a low inventory");
	managerPrompt();
	 }
	})// query
  }// func.data


function addInventory() {
	var item = [];
	con.query('SELECT * from select_product',function(err,res){
		if(err)throw err;
		//push inventory in an array
		for(var i = 0; i < res.length; i++) {
			item.push(res[i].product_name)
		}

	inquirer.prompt([{
		name:'choices',
		type:'checkbox',
		message: 'which product would you like to add inventory for?',
		choices:item

	}]).then (function(user){
		if(user.choices.length === 0){
			console.log('Oops! You did not select anything!');
			managerPrompt();
		} else {
				addToInventory(user.choices);
		}//else
	 })
	})//query
}

function addToInventory(itemName){
	var item = itemName;
	var itemQuantity;
    // add new item to the list 
	con.query('SELECT quantity from select_product WHERE ?',{
		product_name : item
    },(function(err,res){
    	if(err)throw err;
 	    itemQuantity = parseInt(res[0].quantity);
    }));//query

	inquirer.prompt([{
		name:'amount',
		type: 'Integer',
		message: 'how many '+ item + ' you would like to add?',

		validate: function(str){
			if(isNaN(parseInt(str))){
				console.log('Not a valid entry');
				return false;
			} else {
				return true;
			}
		}//validate
	}]).then(function(userQuantity){
	var amountInt = parseInt(userQuantity.amount);
		
		con.query('UPDATE select_product SET ? WHERE ?',[{
			quantity : itemQuantity + 0 + amountInt
			},{
				product_name : item
				}],(function(err) {
					if (err) throw err;
				})  
		); // end of query

		if (itemName.length!=0) {
			viewInventory();
		} else {
			console.log("Thank you your inventory has been updated");
			managerPrompt();
		  }
		})   ///    end of prompt.then then
}//function	


function newInventory() {
var newItemId =0;	
	inquirer.prompt([{	
		name:'name',
		type:'text',
		message:"Please add item name"
	},{
		name:"department",
		type:"text",
		message:"Please add department name"
	},{
		name:"price",
		type:"Integer",
		message:"Please add product's price"
	},{
		name:"Newquantity",
		type:"Integer",
		message:"Please add the quantity"
	}
	]).then(function(userInput){
			console.log("test");
			con.query("SELECT max(item_id)+1 as nextItemId \
						from select_product",function(err,res){
					newItemId = res[0].nextItemId;
			var name = userInput.name;
			var department = userInput.department;
			var price = parseInt(userInput.price);
			var quantity = parseInt(userInput.Newquantity)
			con.query('Insert into select_product SET ?',
			{item_id : newItemId, product_name : name, department_name : department, product_price : price, quantity:quantity
			}		
			//con.query(sql, [values]
					),function(err){
						if(err)throw err;
			         }//call back
			
		  			managerPrompt();
		  	//) // end of inset query 
			})//end of max query
	})//end of function user input
}//end of function