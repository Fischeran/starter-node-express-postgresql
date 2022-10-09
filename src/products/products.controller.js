const productsService = require("./products.service");


function read(req, res) {
  const { product: data } = res.locals;
  res.json({ data });
}

function list(req, res, next) {
  res.json({
    data: [{ product_title: "product 1" }, { product_title: "product 2" }],
  });
}

function productExists(req, res, next) {
  productsService
    .read(req.params.productId)
    .then((product) => {
      if (product) {
        res.locals.product = product;
        return next();
      }
      next({ status: 404, message: `Product cannot be found.` });
    })
    .catch(next);
}



module.exports = {
  read: [productExists, read],
  list: [list],
};
