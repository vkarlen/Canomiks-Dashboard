const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();
const {
  rejectUnauthenticated,
} = require('../modules/authentication-middleware');

router.get('/', rejectUnauthenticated, async (req, res) => {
  try {
    const queryText = `
    SELECT * FROM "orders" 
	  JOIN "status"
	  ON "status".id = "orders"."testingStatus"
    WHERE orders."companyID" = $1 
    ORDER BY ("status".id = 1) DESC;`;
    const dbRes = await pool.query(queryText, [req.user.companyID]);
    res.send(dbRes.rows);
  } catch (err) {
    console.error(err.message);
    res.sendStatus(500);
  }
});

router.get('/all', rejectUnauthenticated, async (req, res) => {
  try {
    const query = `SELECT * FROM orders ORDER BY ("companyID")`;
    const dbRes = await pool.query(query);
    res.send(dbRes.rows);
  } catch (err) {
    console.error(err.message);
    res.sendStatus(500);
  }
});

router.put('/newOrder/:id', async (req, res) => {
  try {
    const userId = req.user.id;
    const shipping = req.body;
    const sqlParams = [
      shipping.id,
      userId,
      shipping.shippedDate,
      shipping.carrierName,
      shipping.trackingNumber,
    ];
    const sqlQuery = `UPDATE "orders" 
    SET "shippedDate" = $3, "carrierName" = $4, "trackingNumber" = $5
    WHERE "id" = $1 
    RETURNING "id";`;
    const dbRes = await pool.query(sqlQuery, sqlParams);
    if (dbRes.rows.length === 0) {
      res.sendStatus(404);
      return;
    } else {
      res.send(dbRes.rows[0]);
    }
  } catch (err) {
    console.error(err.message);
    res.sendStatus(500);
  }
});
/**
 * POST route template
 */

// the initial sample order, for when they start the process.
router.post('/initialSample', rejectUnauthenticated, async (req, res) => {
  try {
    const { companyID, lotNumber } = req.body;
    const sqlText = `
    INSERT INTO "orders"
    ("companyID", "lotNumber") 
    VALUES 
    ($1, $2) 
    RETURNING id;
    `;
    const dbRes = await pool.query(sqlText, [companyID, lotNumber]);
    if (dbRes.rows.length === 0) {
      res.sendStatus(404);
      return;
    } else {
      res.send(dbRes.rows[0]);
    }
  } catch (err) {
    console.log('error in the initial order post', err);
    res.sendStatus(500);
  }
});

// for add sample page to save the sample information; after initial insert
router.put('/updateOrder', rejectUnauthenticated, async (req, res) => {
  try {
    // const order = req.body;
    // const orderArray = [
    //   order.companyID, //1
    //   order.ingredientName, //2
    //   order.ingredientAmount, //3
    //   order.ingredientUnit, //4
    //   order.format, //5
    //   order.purity, //6
    //   order.dateManufactured, //7
    //   order.lotNumber, //8
    //   order.extractionMethod, //9
    //   order.city, //10
    //   order.state, //11
    //   order.country, //12
    //   order.harvestDate, //13
    //   order.cropStrain, //14
    //   order.sustainability, //15
    //   order.orderId, //16
    // ];
    // const sqlText = `
    //   UPDATE "orders"
    //   SET "ingredientName" = $2, "ingredientAmount" = $3, "ingredientUnit" = $4,
    //   "format" = $5, "purity" = $6, "dateManufactured" = $7, "lotNumber" = $8,
    //   "extractionMethod" = $9, "city" = $10, "state" = $11, "country" = $12,
    //   "harvestDate" = $13, "cropStrain" = $14, "sustainabilityInfo" = $15
    //   WHERE "companyID" = $1 AND "id" = $16
    //   RETURNING *;
    // `;

    const orderArray = [
      req.body.value,
      req.body.companyID,
      req.body.orderId
    ];
    const tableName = req.body.name;
    console.log('table name:', tableName);

    const sqlText= `
    UPDATE "orders"
    SET "${tableName}" = $1
    WHERE "companyID" = $2 AND "id" = $3
    RETURNING *;
    `;
    const dbRes = await pool.query(sqlText, orderArray);

    if (dbRes.rows.length === 0) {
      res.sendStatus(404);
      return;
    } else {
      res.send(dbRes.rows[0]);
    };

  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

// for shipping page to save the shipping information; after initial insert
router.put('/shipping', rejectUnauthenticated, async (req, res) => {
  // POST route code here
  try {
    const order = req.body;
    const orderArray = [
      order.shippedDate,
      order.carrierName,
      order.trackingNumber,
      order.companyID,
      order.orderId,
    ];
    const sqlText = `
      UPDATE "orders"
      SET "shippedDate" = $1, "carrierName" = $2, "trackingNumber" = $3
      WHERE "companyID" = $4 AND "id" = $5
      RETURNING *;
    `;
    const dbRes = await pool.query(sqlText, orderArray);
    
    if (dbRes.rows.length === 0) {
      res.sendStatus(404);
      return;
    } else {
      res.send(dbRes.rows[0]);
    };

  } catch (err) {
    console.error(err.message);
    res.sendStatus(500);
  }
});

router.delete('/deleteSample/:company/:order', rejectUnauthenticated, async (req, res) => {
  try {
    const sqlText = `
      DELETE FROM "orders" 
      WHERE "companyID" = $1 AND "id" = $2;
    `;

    const dbRes = await pool.query(sqlText, [req.params.company, req.params.order]);

    res.sendStatus(200);
  }
  catch (err) {
    console.log('💥 something went wrong in the delete', err);
    res.sendStatus(500);
  }
  
})

module.exports = router;
