import { pickBy } from "lodash";
import api from "../../../common/api";
import { apiErrorToast } from "../../../common/api/apiErrorToast";

const initialState = {
  loading: false,
  products: []
};

/* Action types */

const LOADING = "PRODUCTS_LOADING";
const SET = "PRODUCTS_SET";
const CREATE = "PRODUCTS_CREATE";
const UPDATE = "PRODUCTS_UPDATE";
const REMOVE = "PRODUCTS_REMOVE";

export const ActionTypes = {
  LOADING,
  SET,
  CREATE,
  UPDATE,
  REMOVE
};

/* Reducer handlers */
function handleLoading(state, { loading }) {
  return {
    ...state,
    loading
  };
}

function handleSet(state, { products }) {
  return {
    ...state,
    products
  };
}

function handleNewProduct(state, { product }) {
  return {
    ...state,
    products: state.products.concat(product)
  };
}

function handleUpdateProduct(state, { product }) {
  return {
    ...state,
    products: state.products.map(s => (s.id === product.id ? product : s))
  };
}

function handleRemoveProduct(state, { id }) {
  return {
    ...state,
    products: state.products.filter(s => s.id !== id)
  };
}

const handlers = {
  [LOADING]: handleLoading,
  [SET]: handleSet,
  [CREATE]: handleNewProduct,
  [UPDATE]: handleUpdateProduct,
  [REMOVE]: handleRemoveProduct
};

export default function reducer(state = initialState, action) {
  const handler = handlers[action.type];
  return handler ? handler(state, action) : state;
}

/* Actions */
export function setLoading(status) {
  return {
    type: LOADING,
    loading: status
  };
}

export function setproducts(products) {
  return {
    type: SET,
    products
  };
}

export function getAll() {
  return dispatch => {
    dispatch(setLoading(true));
    return api
      .get("/product")
      .then(response => {
        dispatch(setproducts(response.data));
        return dispatch(setLoading(false));
      })
      .catch(error => {
        apiErrorToast(error);
        return dispatch(setLoading(false));
      });
  };
}

export function getById(id) {
  return getAll({ id });
}

export function fetchByFilters(filters) {
  return function(dispatch) {
    return api
      .post("/product/search", pickBy(filters))
      .then(response => {
        dispatch(setproducts(response.data));
      })
      .catch(error => {
        apiErrorToast(error);
      });
  };
}

/* Selectors */
function base(state) {
  return state.product.list;
}

export function getLoading(state) {
  return base(state).loading;
}

export function getProducts(state) {
  return base(state).products;
}

export function getProductById(state, id) {
  return getProducts(state).find(s => s.id === id);
}
