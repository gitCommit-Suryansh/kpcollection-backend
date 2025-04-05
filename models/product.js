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
      owner: {
        type: mongoose.Schema.Types.ObjectId, // Assuming owner is a reference to a User collection
        ref: 'owner',
      },
      images: [
        {
          type: String, // Store each image as a buffer
          required: true
        }
      ],
      sizes: {
        type: [String],
        default: ['S', 'M', 'L', 'XL', 'XXL'],
        required: true
      },
      category: {
        type: String,
        enum: ['Shirt', 'Jeans', 'T-Shirts', 'Lower'], // Restricting categories
        required: true
      }
    }
)

module.exports=mongoose.model('product',productschema)