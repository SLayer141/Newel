const ListItem = require('../models/listItem');

// Create new list item
exports.createItem = async (req, res) => {
  try {
    console.log('Received request body:', JSON.stringify(req.body, null, 2));
    console.log('User from request:', req.user);
    
    const { name, address, department, dateOfJoining, hobbies, gender } = req.body;
    const userId = req.user?._id;

    // Validate user authentication
    if (!userId) {
      console.error('No user ID found in request');
      return res.status(401).json({ 
        success: false, 
        error: 'User not authenticated' 
      });
    }

    // Validate required fields
    if (!name || !address || !department || !dateOfJoining || !gender) {
      console.error('Missing required fields:', { name, address, department, dateOfJoining, gender });
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required fields',
        details: {
          name: !name,
          address: !address,
          department: !department,
          dateOfJoining: !dateOfJoining,
          gender: !gender
        }
      });
    }

    console.log('Creating new item with data:', {
      name,
      address,
      department,
      dateOfJoining: new Date(dateOfJoining),
      hobbies: hobbies || [],
      gender,
      userId
    });

    const newItem = new ListItem({
      name,
      address,
      department,
      dateOfJoining: new Date(dateOfJoining),
      hobbies: hobbies || [],
      gender,
      userId
    });

    console.log('Saving new item...');
    const savedItem = await newItem.save();
    console.log('Item saved successfully:', savedItem);

    res.status(201).json({ success: true, data: savedItem });
  } catch (error) {
    console.error('Error creating item:', error);
    console.error('Error stack:', error.stack);
    res.status(400).json({ 
      success: false, 
      error: error.message,
      details: error.errors || {}
    });
  }
};

// Get all items for a user
exports.getItems = async (req, res) => {
  try {
    const userId = req.user._id;
    const items = await ListItem.find({ userId });
    res.status(200).json({ success: true, data: items });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Update an item
exports.updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    
    const item = await ListItem.findOneAndUpdate(
      { _id: id, userId },
      req.body,
      { new: true, runValidators: true }
    );

    if (!item) {
      return res.status(404).json({ success: false, error: 'Item not found' });
    }

    res.status(200).json({ success: true, data: item });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Delete an item
exports.deleteItem = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const item = await ListItem.findOneAndDelete({ _id: id, userId });

    if (!item) {
      return res.status(404).json({ success: false, error: 'Item not found' });
    }

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
}; 