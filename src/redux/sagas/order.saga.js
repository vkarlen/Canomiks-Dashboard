import axios from 'axios';
import { put, takeLatest } from 'redux-saga/effects';

function* fetchCustomerOrders() {
  try {
    const response = yield axios.get('/api/orders');
    yield put({
      type: 'SET_CUSTOMER_ORDERS',
      payload: response.data,
    });
  } catch (err) {
    console.error('Error in fetchCustomerOrders', err.message);
  }
}
function* updateUrl(action) {
  try {
    const response = yield axios.put('/api/orders/url', action.payload);
    console.log(response.data, 'response');
    yield put({
      type: 'SET_CURRENT_SAMPLE',
      payload: response.data,
    });
  } catch (err) {
    console.error('Error in updateUrl', err.message);
  }
} // end updateShipping

// end fetchCustomerOrders

function* fetchAllOrders() {
  try {
    const response = yield axios.get('/api/orders/all');
    yield put({
      type: 'SET_ALL_ORDERS',
      payload: response.data,
    });
  } catch (err) {
    console.error('Error in fetchAllOrders', err.message);
  }
} // end fetchAllOrders

function* addSampleOrder(action) {
  try {
    const response = yield axios.post('/api/orders/start', action.payload);
    console.log(response.data, 'response here');
    yield put({
      type: 'SET_INIT_SAMPLE_ID',
      payload: response.data,
    });
  } catch (err) {
    console.error('Error in addSampleOrder', err.message);
  }
} // end addSampleOrder

function* updateSampleInfo(action) {
  try {
    const response = yield axios.put('/api/orders/update', action.payload);
    // now set current sample with all the info
    yield put({
      type: 'SET_CURRENT_SAMPLE',
      payload: response.data,
    });
  } catch (err) {
    console.error('Error in updateSampleInfo', err.message);
  }
} // end updateSampleInfo

function* updateShipping(action) {
  try {
    const response = yield axios.put('/api/orders/shipping', action.payload);
  } catch (err) {
    console.error('Error in updateShipping', err.message);
  }
} // end updateShipping

function* updateSampleLab(action) {
  try {
    const response = yield axios.put('/api/orders/lab/update', action.payload.sample);

    // // Checks if delayed status has been changed
    if (action.payload.delayed !== response.data.delayed && response.data.delayed === true) {
      // delayed status email triggered
       yield put({
        type: 'EMAIL_STATUS',
        payload: {
          orderId: response.data.id,
          companyID: response.data.companyID,
          message: 'Unfortunately there was an issue with your sample and it has been delayed. Somebody should be in contact with you shortly with more information. '
        }
      }); // end dispatch
    }

    // Checks if test state has been changed
    if (
      action.payload.sequence !== action.payload.sample.sequence ||
      action.payload.testState !== action.payload.sample.testState
    ) {
      // status change email triggered
       yield put({
        type: 'EMAIL_STATUS',
        payload: {
          orderId: action.payload.sample.id,
          companyID: action.payload.sample.companyID,
          message: 'Your sample has moved to the next stage of the testing process. '
        }
      }); // end dispatch
    }

    yield put({
      type: 'FETCH_ALL_ORDERS',
    });

  } catch (err) {
    console.error('Error in updateSampleLab', err.message);
  }
} // end updateSampleLab

function* deleteCurrentSample(action) {
  try {
    yield axios.delete(`/api/orders/delete/${action.payload.companyID}/${action.payload.orderId}`);
    yield put({
      type: 'CLEAR_CURRENT_SAMPLE'
    });
  } catch (err) {
    console.error('Error in deleteCurrentSample', err.message);
  }
} // end deleteCurrentSample

function* updateTestPhase(action) {
  console.log(action, "action")
  try{
    const response = yield axios.put('/api/orders/date', action.payload)
    console.log(response.data, "response");
    yield put({
      type: 'SET_CURRENT_SAMPLE',
      payload: response.data,
    });
  }catch (err) {
    console.error('Error in updateTestPhase', err.message);
  }
}




function* orderSaga() {
  yield takeLatest('FETCH_CUSTOMER_ORDERS', fetchCustomerOrders);
  yield takeLatest('ADD_URL', updateUrl);
  yield takeLatest('FETCH_ALL_ORDERS', fetchAllOrders);
  yield takeLatest('ADD_SAMPLE', addSampleOrder);
  yield takeLatest('UPDATE_SAMPLE_INFO', updateSampleInfo);
  yield takeLatest('UPDATE_SHIPPING_INFO', updateShipping);
  yield takeLatest('UPDATE_SAMPLE_LAB', updateSampleLab);
  yield takeLatest('DELETE_CURRENT_SAMPLE', deleteCurrentSample);
  yield takeLatest('UPDATE_TEST_PHASE', updateTestPhase);
}

export default orderSaga;
