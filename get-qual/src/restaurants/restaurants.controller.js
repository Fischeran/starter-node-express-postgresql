const restaurantsService = require("./restaurants.service.js");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const hasProperties = require("../errors/hasProperties")



async function list(req, res, next) {
  const data = await restaurantsService.list();
  res.json({ data });
}

function create(req, res, next) {
  // Your solution here
  restaurantsService
    .create(req.body.data)
    .then((data) => res.status(201).json({data}))
    .catch(next)
}

const VALID_PROPERTIES = [
  "address",
  "cuisine",
  "restaurant_name"
]

function hasOnlyValidProperties(req, res, next) {
  const { data = {} } = req.body;

  const invalidFields = Object.keys(data).filter(
    (field) => !VALID_PROPERTIES.includes(field)
  );

  if (invalidFields.length) {
    return next({
      status: 400,
      message: `Invalid field(s): ${invalidFields.join(", ")}`,
    });
  }
  next();
}

const hasRequired = hasProperties("address", "cuisine", "restaurant_name")

async function update(req, res, next) {
  const updatedRestaurant = {
    ...res.locals.restaurant,
    ...req.body.data,
    restaurant_id: res.locals.restaurant.restaurant_id,
  };

  const data = await restaurantsService.update(updatedRestaurant);

  res.json({ data });
}

function destroy(req, res, next) {
  // your solution here
  restaurantsService
  .delete(res.locals.restaurant.restaurant_id)
  .then(() => res.sendStatus(204))
  .catch(next)
}

function restaurantExists(req, res, next) {
  restaurantsService
    .read(req.params.restaurantId)
    .then((restaurant) => {
      if (restaurant) {
        res.locals.restaurant = restaurant;
        return next();
      }
      next({ status: 404, message: `Restaurant cannot be found.` });
    })
    .catch(next);
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: [hasOnlyValidProperties , hasRequired,create],
  update: [asyncErrorBoundary(restaurantExists), asyncErrorBoundary(update)],
  delete: [restaurantExists, destroy],
};
