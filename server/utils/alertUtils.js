const twilio = require('twilio');
const NodeMetadata = require('../schema/NodeMetadataSchema');
const Alert = require('../schema/AlertSchema');
const IotNodeData = require('../schema/NodeDataSchema');
require('dotenv').config();

// Initialize Twilio client
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// Function to verify if water level consistently exceeds threshold
const verifyWaterLevel = async (nodeId, threshold) => {
  try {
    // Fetch the latest 5 water level readings for the node
    const readings = await IotNodeData.find({ nodeId })
      .sort({ timestamp: -1 }) // Sort by latest readings
      .limit(5);

    if (readings.length < 5) {
      console.log(`Not enough data points for node ${nodeId} to verify.`);
      return false;
    }

    // Check if all the last 5 readings exceed the threshold
    return readings.every((record) => record.waterLevel >= threshold);
  } catch (error) {
    console.error('Error verifying water levels:', error);
    return false;
  }
};

// Utility function to check alert levels and send notifications
const checkAndSendAlerts = async (nodeId, waterLevel) => {
  try {
    // Fetch node metadata for alert thresholds and location data
    const nodeMetadata = await NodeMetadata.findOne({ nodeId });
    if (!nodeMetadata) return;

    const { yellow_alert, orange_alert, red_alert, locationName, latitude, longitude } = nodeMetadata;

    // Determine alert level
    let alertLevel = null;
    let alertMessage = null;
    let threshold = null;

    // Generate links
    const websiteLink = `https://mrrm.hultinfo.tech/${nodeId}`;
    const googleMapsLink = `https://www.google.com/maps?q=${latitude},${longitude}`;

    // Common heading
    const heading = "🌊 *Meenachil River Flood Alert* 🌊";

    if (waterLevel >= red_alert) {
      threshold = red_alert;
      alertLevel = 'Red';
      alertMessage = `${heading}\n\n🚨 *RED ALERT* 🚨\nLocation: ${locationName}\nWater Level: ${waterLevel} (Critical: ${red_alert})\nStatus: Immediate action required!\n\n🔗 More Info: ${websiteLink}\n📍 Location: ${googleMapsLink}`;
    } else if (waterLevel >= orange_alert) {
      threshold = orange_alert;
      alertLevel = 'Orange';
      alertMessage = `${heading}\n\n⚠️ *ORANGE ALERT* ⚠️\nLocation: ${locationName}\nWater Level: ${waterLevel} (Warning: ${orange_alert})\nStatus: Stay vigilant.\n\n🔗 More Info: ${websiteLink}\n📍 Location: ${googleMapsLink}`;
    } else if (waterLevel >= yellow_alert) {
      threshold = yellow_alert;
      alertLevel = 'Yellow';
      alertMessage = `${heading}\n\n🔔 *YELLOW ALERT* 🔔\nLocation: ${locationName}\nWater Level: ${waterLevel} (Caution: ${yellow_alert})\nStatus: Monitor closely.\n\n🔗 More Info: ${websiteLink}\n📍 Location: ${googleMapsLink}`;
    }

    if (!alertLevel || !threshold) {
      console.log(`Water level (${waterLevel}) at ${nodeId} is below alert thresholds.`);
      return;
    }

    // Verify if water level remains above threshold for 5 readings
    const isConsistent = await verifyWaterLevel(nodeId, threshold);
    if (!isConsistent) {
      console.log(`Water level at ${nodeId} fluctuating. No alert sent.`);
      return;
    }

    // Fetch users subscribed to this nodeId
    const subscribers = await Alert.find({ locations: nodeId });
    if (subscribers.length === 0) {
      console.log(`No subscribers found for nodeId: ${nodeId}`);
      return;
    }

    // Send WhatsApp, SMS & Calls
    const sendPromises = subscribers.map(async (subscriber) => {
      const { phone } = subscriber;

      try {
        // // Send WhatsApp Message
        // await client.messages.create({
        //   body: alertMessage,
        //   from: process.env.TWILIO_WHATSAPP_NUMBER,
        //   to: `whatsapp:${phone}`,
        // });
        // console.log(`WhatsApp alert sent to ${phone} for ${nodeId}`);

        // Send SMS Message
        await client.messages.create({
          body: alertMessage,
          from: process.env.TWILIO_SMS_NUMBER,
          to: phone,
        });
        console.log(`SMS alert sent to ${phone} for ${nodeId}`);

        // Make Voice Call Alert
        await client.calls.create({
          twiml: `<Response><Say voice="Polly.Matthew">
                  Attention! Attention! This is a ${alertLevel} alert for ${locationName}. 
                  The water level is rising rapidly. 
                  Current level: ${waterLevel}. 
                  Please take necessary precautions immediately!
                  </Say></Response>`,
          from: process.env.TWILIO_SMS_NUMBER, // Twilio Verified Number for Calls
          to: phone,
        });
        console.log(`Voice call alert sent to ${phone} for ${nodeId}`);

      } catch (error) {
        console.error(`Failed to send message to ${phone}:`, error.message);
      }
    });

    await Promise.all(sendPromises);
    console.log(`Alerts processed for ${nodeId} - ${alertLevel} level`);

  } catch (error) {
    console.error('Error in checkAndSendAlerts:', error);
  }
};

module.exports = { checkAndSendAlerts };