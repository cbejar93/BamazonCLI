CREATE DATABASE bamazon_db;

USE bamazon_db;

CREATE TABLE products (
    item_id INT(20) AUTO_INCREMENT,
    product_name VARCHAR(20) NOT NULL,
    department_name VARCHAR(20) NOT NULL,
    price INT(20) NOT NULL,
    stock_quanity INT(20),
    PRIMARY KEY (item_key)
);

INSERT INTO products (product_name, department_name, price, stock_quanity) VALUES ("coke", "beverages", 100, 1000), ("diapers", "baby", 45, 2500), ("bread", "food", 12, 12), ("beer", "beverages", 1500, 32), ("computers", "tech", 500, 3000), ("Towels", "home", 400, 789), ("Plates", "home", 800, 20), ("pepsi", "beverages", 50000, 1), ("cribs", "baby", 500, 10000), ("pizza", "food", 350, 4562), ("iphone", "tech", 300, 800);