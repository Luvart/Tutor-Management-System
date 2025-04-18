const express = require("express");
const router = express.Router();
const messageController = require("../controllers/messageController");

router.post("/send", messageController.sendMessage);
router.get("/fetch/:user_id", messageController.getMessages);
router.get("/unread_counts/:admin_id", messageController.getUnreadCounts);
router.put('/mark_as_read/:user_id', messageController.markMessagesAsRead);


module.exports = router;
