const mongoose=require('mongoose')

const productschema=mongoose.Schema({
    name: {
        type: String,
        required: true
      },
      description: {
        type: String
      },
      price: {
        type: Number,
        required: true
      },
      discount: {
        type: Number, // Assuming discount is a percentage or numeric value
        default: 0
      },
      bgcolor: {
        type: String
      },
      panelcolor: {
        type: String
      },
      textcolor: {
        type: String
      },
      owner: {
        type: mongoose.Schema.Types.ObjectId, // Assuming owner is a reference to a User collection
        ref: 'owner',
      },
      images: [
        {
          type: Buffer, // Store each image as a buffer
          required: true
        }
      ]
    }
)

module.exports=mongoose.model('product',productschema)