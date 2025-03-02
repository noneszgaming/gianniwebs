const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User_Address = require('../models/User_Address');
const User = require('../models/User');

router.get('/', auth, async (req, res) => {
  try {
    const addresses = await User_Address.find({}).sort({ _id: -1 });

    res.status(200).json({
      success: true,
      count: addresses.length,
      addresses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching addresses',
      error: error.message
    });
  }
});


router.post('/', auth, async (req, res) => {
  try {
    const { city, addressLine1, addressLine2, zipCode } = req.body;

    // Validation
    if (!city || !addressLine1 || !zipCode) {
      return res.status(400).json({
        success: false,
        message: 'Please provide city, address line 1, and zip code'
      });
    }

    const newAddress = new User_Address({
      city,
      addressLine1,
      addressLine2: addressLine2 || ''
    });

    if (zipCode) {
      newAddress.zipCode = zipCode;
    }

    const address = await newAddress.save();
    
    res.status(201).json({
      success: true,
      message: 'Address created successfully',
      address
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating address',
      error: error.message
    });
  }
});

router.delete('/:id', auth, async (req, res) => {
    try {
      // Check if any users are using this address
      const usersWithAddress = await User.find({ address: req.params.id });
      if (usersWithAddress.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'This address is currently in use by one or more users. Delete those users first.'
        });
      }
  
      // Használjuk a findByIdAndDelete metódust a remove() helyett
      const address = await User_Address.findByIdAndDelete(req.params.id);
      
      if (!address) {
        return res.status(404).json({
          success: false,
          message: 'Address not found'
        });
      }
      
      res.status(200).json({
        success: true,
        message: 'Address removed successfully'
      });
    } catch (error) {
      if (error.kind === 'ObjectId') {
        return res.status(404).json({
          success: false,
          message: 'Address not found'
        });
      }
      
      res.status(500).json({
        success: false,
        message: 'Error deleting address',
        error: error.message
      });
    }
  });

module.exports = router;