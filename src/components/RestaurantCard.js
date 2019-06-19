import React from "react";
import PropTypes from "prop-types";

const RestaurantCard = props => {
  const {
    image_url = null,
    name = null,
    address = null,
    city = null,
    postal_code = null,
    phone = null
  } = props.restaurant || {};

  return (
    <div className="col-sm-6 col-md-4 restaurant-card">
      <div className="restaurant-card-container border-gray rounded border mx-2 my-3 d-flex flex-row align-items-center p-0 bg-light">
        <div className="h-100 position-relative rounded-left col-4 no-padding">
          <img
            src={image_url}
            alt={name}
            className="d-block h-100 img-thumbnail border-0"
          />
        </div>

        <div className="px-3 col-6">
          <span className="restaurant-name text-dark d-block font-weight-bold">
            {name}
          </span>
          <span className="restaurant-region  text-uppercase">{address}</span>
          <span className="restaurant-region  text-uppercase restaurant-city">
            {city}, {postal_code}
          </span>
        </div>
        <div className="col-2">
          <a
            href={"tel:" + phone}
            target="_blank"
            alt={"Call " + name}
            className="btn btn-sm btn-danger d-block"
          >
            Call
          </a>
        </div>
      </div>
    </div>
  );
};

RestaurantCard.propTypes = {
  restaurant: PropTypes.shape({
    id: PropTypes.number.isRequired,
    phone: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired,
    city: PropTypes.string.isRequired,
    postal_code: PropTypes.string.isRequired,
    image_url: PropTypes.string.isRequired,
    reserve_url: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired
  }).isRequired
};

export default RestaurantCard;
