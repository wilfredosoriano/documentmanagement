const express = require('express');
const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secretKey = 'wilfredo1229';

const router = express.Router();

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (password === user.password) {
      return res.status(200).json({ message: 'Change Password Required', userId: user._id });
    }

    bcrypt.compare(password, user.password, function(err, result) {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error' });
      }

      if (!result) {
        return res.status(401).json({ message: 'Invalid credentials' });
      } else {

        const token = jwt.sign({ userId: user._id, role: user.role }, secretKey, { expiresIn: '1h' });
        return res.status(200).json({ token, role: user.role, userId: user._id });
      }
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});


router.post('/changePassword', async (req, res) => {
  const { userId, newPassword } = req.body;
  try {
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    bcrypt.genSalt(10, function(err, salt) {
      if (err) {
        console.error('Error generating salt:', err);
        return res.status(500).json({ message: 'Internal server error' });
      }

      bcrypt.hash(newPassword, salt, async function(err, hash) {
        if (err) {
          console.error('Error hashing password:', err);
          return res.status(500).json({ message: 'Internal server error' });
        }

        user.password = hash;
        user.hasChangedPassword = true;
        await user.save();

        return res.status(200).json({ message: 'Password changed successfully' });
      });
    });
  } catch (error) {
    console.error('Error in changePassword route:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const user = await userModel.findById(id);
    res.json(user);
  } catch (error) {
    console.error('Failed fetching user: ', error)
    res.status(500).json({ error: 'Failed to fetch user' });
  }
})

router.post('/', (req, res) => {
    const { firstname, middlename, lastname, email, address, password, role } = req.body;
    userModel.create({ firstname, middlename, lastname, email, address, password, role  })
    .then(newUser => {
      res.status(201).json(newUser);
    })
    .catch(err => {
      console.error('Error creating user:', err);
      res.status(500).json({ error: 'Failed to add user' });
    });
})

router.get('/', (req, res) => {
    userModel.find()
    .then(users => {
        res.json(users);
    })
    .catch(err => {
        console.err('Error fetching users:', err);
        res.status(500).json({ error: 'Failed to fetch users' });
    })
})

//delete specific user
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await userModel.findByIdAndDelete(id);
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
});


//delete all users
router.delete('/', async (req, res) => {
  try {
    await userModel.deleteMany();
    res.status(200).json({ message: 'Users deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

//edit user
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { firstname, middlename, lastname, address } = req.body;


    const updatedUser = await userModel.findByIdAndUpdate(
      id,
      { firstname, middlename, lastname, address  },
      { new: true } 
    );

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating usert: ', error);
    res.status(500).json({ error: 'Failed to update user.' });
  }
});

module.exports = router;