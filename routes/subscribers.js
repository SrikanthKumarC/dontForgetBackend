const express = require("express");
const router = express.Router();
const Subscriber = require("../models/subscribers");
var AWS = require('aws-sdk');
require('dotenv').config();

//middleware
async function getSubscriber(req, res, next) {
  let subscriber;
  try {
    subscriber = await Subscriber.findById(req.params.id);
    if (subscriber == null)
      return res.status(400).json({ message: "cannot find subscriber" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
  res.subscriber = subscriber;
  next();
}

// get all
router.get("/:email", async (req, res) => {
  try {
    const subscribers = await Subscriber.find({email: req.params.email});
    res.json(subscribers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// get one
router.get("/:id", getSubscriber, (req, res) => {
  res.json(res.subscriber);
});
// set one
router.post("/", async (req, res) => {
  const subscriber = new Subscriber({
    nums: req.body.nums,
    isHit: req.body.isHit,
    msg: req.body.msg,
    when: req.body.when,
    email: req.body.email
  });
  try {
    const newSubscriber = await subscriber.save();
    res.status(201).json(newSubscriber);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
// update one
router.patch("/:id", getSubscriber, async (req, res) => {
  if (req.body.nums != null) {
    res.subscriber.nums = req.body.nums;
  }
  if (req.body.isHit != null) {
    res.subscriber.isHit = req.body.isHit;
  }
  if (req.body.msg != null) {
    res.subscriber.msg = req.body.msg;
  }
  if (req.body.when != null) {
    res.subscriber.when = req.body.when;
  }
  try {
    const updated = await res.subscriber.save();
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete("/:id", getSubscriber, async (req, res) => {
  try {
    await res.subscriber.remove();
    res.json({ message: "deleted subscriber" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//remove an event everytime it has seen hit is true
const removeEventAfterHit = async () =>  {
  try {
    await Subscriber.findOneAndDelete(undefined, {isHit: true})
  }catch (err) {
    console.log(err)
  }
}

//core functionality
setInterval(() => {
  Subscriber.find({}, (err, reminderList) => {
    if (err) {
      console.log(err);
    }
    if (reminderList) {
      reminderList.forEach((reminder) => {
        if (!reminder.isHit) {
          const now = new Date();
          if (new Date(reminder.when) - now < 0) {
            Subscriber.findByIdAndUpdate(
              reminder._id,
              { isHit: true },
              (err, remindObj) => {
                if (err) {
                  console.log(err);
                }
                var params = {
                  Message: reminder.msg,
                  PhoneNumber: "+" + reminder.nums,
                  MessageAttributes: {
                    "AWS.SNS.SMS.SenderID": {
                      DataType: "String",
                      StringValue: "dontForget",
                    },
                  },
                };
                new AWS.SNS({ apiVersion: '2010-03-31' }).publish(params).promise();
                removeEventAfterHit();
              }
            );
          }
        }
      });
    }
  });
}, 1000);

module.exports = router;
