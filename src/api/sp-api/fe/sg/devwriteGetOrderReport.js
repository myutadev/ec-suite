const {getOrderReport} = require('./devgetOrderReport');
const {getOrderItemByOrderId} = require('./devgetOrderItemByOrderId');
const {updateArrayDataToSheets} = require('../../../../lib/updateArrayDataToSheets')
require('dotenv').config();

const writeGetOrderReport = async () => {
    console.log("writeGetOrderReport starts");
    const orderDataArray = await getOrderReport();
    if (orderDataArray == null) {
        console.log('getOrderReport no data for today');
        return; 
    }

    const orderIds = orderDataArray.map(item=>item.AmazonOrderId)
    let orderItemInfoObj = {};

    //orderIdをキーとしたobjを作成
    for(orderId of orderIds){
        const orderInfo = await  getOrderItemByOrderId(orderId);
        orderItemInfoObj[orderInfo.AmazonOrderId]= orderInfo.OrderItems
    }
    // console.log(orderInfoObj);
    // process.exit();

     values = orderDataArray.map(item => {
        const orderItemsArray = orderItemInfoObj[item.AmazonOrderId]
        for (orderItem of orderItemsArray){
            return [
                    //			buyer-name	buyer-phone-number	sku	product-name	quantity-purchased	currency	item-price	item-tax	shipping-price	shipping-tax	ship-service-level	recipient-name	ship-address-1	ship-address-2	ship-address-3	ship-city	ship-state	ship-postal-code	ship-country	ship-phone-number	delivery-start-date	delivery-end-date	delivery-time-zone	delivery-Instructions	Note
                    item.AmazonOrderId, 
                    orderItem['OrderItemId'],
                    item.PurchaseDate,
                    item.LastUpdateDate,
                    item.BuyerInfo.BuyerEmail,
                    orderItem['BuyerInfo'], // buyer-name
                    // item., // buyer-phone-number
                    // item.,
                    // item.,
                    // item.,
                    // item.,


                  ]
        }
     })

        console.log('value is',values);
    process.exit();
    updateArrayDataToSheets(process.env.SPREADSHEET_ID2,'SGCurSelling!A2:F',values)
    console.log("writeInventoryhLedgerReport ends");



  };


// writeActiveInventoryReport()

  module.exports = {
    writeGetOrderReport
  };

// writeGetOrderReport();
