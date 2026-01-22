fetch("products.json")
	.then(function (response) {
		if (!response.ok) {
			throw new Error("Network response was not ok");
		}
		return response.json();
	})
	.then(function (products) {
		console.log("載入到的商品資料:", products);
		console.log(products[0].name, products[0].stock);
	})
	.catch(function (error) {
		console.error("讀取 products.json 發生錯誤:", error);
	});
