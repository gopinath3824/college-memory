const express = require('express');
// mongoose removed
const cors = require('cors');
const multer = require('multer');
const path = require('path');
require('dotenv').config();

const app = express();

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend files
app.use(express.static(path.join(__dirname, '../frontend')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ─── Supabase (No connection needed on startup) ─────────────────────────────────
// Supabase connects dynamically on API requests

// ─── Routes ───────────────────────────────────────────────────────────────────
const memoriesRouter  = require('./routes/memories');
const commentsRouter  = require('./routes/comments');
const messagesRouter  = require('./routes/messages');
const pdfRouter       = require('./routes/pdf');

app.use('/api', memoriesRouter);
app.use('/api', commentsRouter);
app.use('/api', messagesRouter);
app.use('/api', pdfRouter);

// ─── Root ─────────────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// ─── Start Server ─────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
