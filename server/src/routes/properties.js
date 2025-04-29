const express = require('express');
const router = express.Router();
const Property = require('../models/Property');
const { z } = require('zod');
const auth = require('../middleware/auth');

// Validation schema
const propertySchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  address: z.object({
    street: z.string().min(1),
    city: z.string().min(1),
    state: z.string().min(1),
    zipCode: z.string().min(1)
  }),
  price: z.number().min(0),
  bedrooms: z.number().min(0),
  bathrooms: z.number().min(0),
  squareFeet: z.number().min(0),
  amenities: z.array(z.string()),
  images: z.array(z.string()),
  minimumIncome: z.number().min(0)
});

// Get all properties
router.get('/', async (req, res) => {
  try {
    const properties = await Property.find({ isAvailable: true })
      .populate('landlord', 'firstName lastName email');
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching properties' });
  }
});

// Get single property
router.get('/:id', async (req, res) => {
  try {
    const property = await Property.findById(req.params.id)
      .populate('landlord', 'firstName lastName email');
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    res.json(property);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching property' });
  }
});

// Create property (landlord only)
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'landlord') {
      return res.status(403).json({ message: 'Only landlords can create properties' });
    }

    const validatedData = propertySchema.parse(req.body);
    const property = new Property({
      ...validatedData,
      landlord: req.user.userId
    });
    await property.save();
    res.status(201).json(property);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Validation error', errors: error.errors });
    }
    res.status(500).json({ message: 'Error creating property' });
  }
});

// Update property (landlord only)
router.put('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'landlord') {
      return res.status(403).json({ message: 'Only landlords can update properties' });
    }

    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    if (property.landlord.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to update this property' });
    }

    const validatedData = propertySchema.parse(req.body);
    const updatedProperty = await Property.findByIdAndUpdate(
      req.params.id,
      validatedData,
      { new: true }
    );
    res.json(updatedProperty);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Validation error', errors: error.errors });
    }
    res.status(500).json({ message: 'Error updating property' });
  }
});

// Delete property (landlord only)
router.delete('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'landlord') {
      return res.status(403).json({ message: 'Only landlords can delete properties' });
    }

    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    if (property.landlord.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to delete this property' });
    }

    await Property.findByIdAndDelete(req.params.id);
    res.json({ message: 'Property deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting property' });
  }
});

module.exports = router; 