const Product = require('../model/product.model');
const { validationResult } = require('express-validator');
const nodemailer = require('nodemailer');

exports.add = (request, response, next) => {
  const errors = validationResult(request);
  if (!errors.isEmpty())
    return response.status(400).json({ errors: errors.array() });

  request.body.productImage = "http://localhost:3000/images/" + request.file.filename;
  Product.create(request.body)
    .then(result => {
      return response.status(201).json({ data: result, message: "Your Product will be display After Approved by Admin" });
    })
    .catch(err => {
      console.log(err + "===========================errrrr");
      return response.status(201).json({ error: "Internal Server Error......." });
    });
}

exports.delete = (request, response, next) => {
  const errors = validationResult(request);
  if (!errors.isEmpty())
    return response.status(400).json({ errors: errors.array() });


  Product.deleteOne({ _id: request.body.productId })
    .then(result => {
      if (result.deletedCount == 1) {
        return response.status(201).json({ Delete: "Deleted Successfully" });
      }
      else
        return response.status(201).json({ notDelete: "Not Deleted " });

    })
    .catch(err => {
      console.log(err + "===========================errrrr");
      return response.status(201).json({ error: "Internal Server Error......." });
    });
}

exports.productList = (request, response, next) => {
  Product.find({ isApproved: true })
    .then(result => {
      return response.status(201).json(result);
    })
    .catch(err => {
      console.log(err + "===========================errrrr");
      return response.status(201).json({ error: "Internal Server Error......." });
    });
}

exports.edit = (request, response, next) => {
  const errors = validationResult(request);
  if (!errors.isEmpty())
    return response.status(400).json({ errors: errors.array() });

  request.body.productImage = "http://localhost:3000/images/" + request.file.filename;
  Product.updateOne(
    { _id: request.body.productId },
    {
      $set: request.body
    }
  )
    .then(result => {
      if (result.modifiedCount == 1)
        return response.status(201).json({ message: "Updated Successfully" });
      else
        return response.status(201).json({ error: "Not Updated.." });
    })
    .catch(err => {
      console.log(err + "=======================errrrr");
      return response.status(201).json({ error: "Internal Server Error......." });
    });
}

exports.isApproved = (request, response, next) => {
  Product.updateOne(
    { _id: request.body.productId },
    {
      $set: { isApproved: true }
    }
  )
    .then(result => {
      if (result.modifiedCount == 1) {
        let transporter = nodemailer.createTransport({
          host: "smtp.gmail.com",
          port: 587,
          secure: false,
          requireTLS: true,
          auth: {
            user: "bidauction23@gmail.com",
            pass: "brainforcode",
          },
        });

        var message = {
          from: "bidauction23@gmail.com",
          to: "rajkasotiya26@gmail.com",
          subject: "Your Product Is Approved For Auction",
          html: `
                   <h1>Your Product Is Approved For Auction Now People Can Bid On Your Product</h1>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   
                 `

        };

        transporter.sendMail(message, (err, info) => {
          if (err) {
            console.log(err);
          } else {
            console.log("SUCCESS===================================\n" + info);
            //   console.log();
          }
        });
        return response.status(201).json({ message: "Updated Successfully" });
      }
      else
        return response.status(201).json({ error: "Not Updated.." });
    })
    .catch(err => {
      console.log(err + "===========================errrrr");
      return response.status(201).json({ error: "Internal Server Error......." });
    });
}

exports.isApprovedCancel = (request, response, next) => {
  Product.updateOne(
    { _id: request.body.productId },
    {
      $set: { isApproved: false }
    }
  )
    .then(result => {
      if (result.modifiedCount == 1) {
        let transporter = nodemailer.createTransport({
          host: "smtp.gmail.com",
          port: 587,
          secure: false,
          requireTLS: true,
          auth: {
            user: "bidauction23@gmail.com",
            pass: "brainforcode",
          },
        });

        var message = {
          from: "bidauction23@gmail.com",
          to: "rajkasotiya26@gmail.com",
          subject: "Your Product Is Not Approved For Auction",
          html: `
                 <h1>Your Product Is Not Approved For Auction Now People Can Bid On Your Product.There May Be Some Problem</h1>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   
               `
        };

        transporter.sendMail(message, (err, info) => {
          if (err) {
            console.log(err);
          } else {
            console.log("SUCCESS===================================\n" + info);
            //   console.log();
          }
        });
        return response.status(201).json({ message: "Updated Successfully" });
      }
      else
        return response.status(201).json({ error: "Not Updated.." });
    })
    .catch(err => {
      console.log(err + "===========================errrrr");
      return response.status(201).json({ error: "Internal Server Error......." });
    });
}

exports.searchProduct = (request, response, next) => {
  var regex = new RegExp(request.body.searchText, 'i');
  Product.find(
    {
      isApproved: true,
      $or: [
        { productName: regex },
        { categoryName: regex },
        { productDesc: regex }

      ]
    })
    .then(result => {
      if (result.length > 0)
        return response.status(201).json(result);
      else
        return response.status(201).json({ message: "No Result Found...." });
    })
    .catch(err => {
      console.log(err + "===========================errrrr");
      return response.status(201).json({ error: "Internal Server Error......." });
    });
}

exports.productListByCategory = (request, response, next) => {
  Product.find({
    $and: [
      { isApproved: true },
      { categoryName: request.body.categoryName }
    ]
  })
    .then(result => {
      if (result.length > 0)
        return response.status(201).json(result);
      else
        return response.status(201).json({ message: "Result Not Found......." });
    })
    .catch(err => {
      console.log(err + "===========================errrrr");
      return response.status(201).json({ error: "Internal Server Error......." });
    });
}

exports.productListBySeller = (request, response, next) => {
  Product.find({ creator: request.body.creatorId })
    .then(result => {
      if (result.length > 0)
        return response.status(201).json(result);
      else
        return response.status(201).json({ message: "Result Not Found......." });
    })
    .catch(err => {
      console.log(err + "===========================errrrr");
      return response.status(201).json({ error: "Internal Server Error......." });
    });
}

exports.approvedProductListBySeller = (request, response, next) => {
  Product.find({
    $and: [
      { isApproved: true },
      { creator: request.body.creatorId }
    ]
  })
    .then(result => {
      if (result.length > 0)
        return response.status(201).json(result);
      else
        return response.status(201).json({ message: "Result Not Found......." });
    })
    .catch(err => {
      console.log(err + "===========================errrrr");
      return response.status(201).json({ error: "Internal Server Error......." });
    });
}

exports.cancelProductListBySeller = (request, response, next) => {
  Product.find({
    $and: [
      { isApproved: false },
      { creator: request.body.creatorId }
    ]
  })
    .then(result => {
      if (result.length > 0) {
        return response.status(201).json(result);
      }
      else
        return response.status(201).json({ message: "Result Not Found......." });
    })
    .catch(err => {
      console.log(err + "===========================errrrr");
      return response.status(201).json({ error: "Internal Server Error......." });
    });
}


// exports.cancelProductAuction = (request, response, next) => {
//   Product.find({ 
//     $and: [
//       { isApproved: false },
//       { startTime: Date }
//     ]
//   })
//     .then(result => {
//       if (result.length > 0)
//         return response.status(201).json(result);
//       else
//         return response.status(201).json({ message: "Result Not Found......." });
//     })
//     .catch(err => {
//       console.log(err + "===========================errrrr");
//       return response.status(201).json({ error: "Internal Server Error......." });
//     });
// }