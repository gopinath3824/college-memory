const supabase = require('../supabaseClient');

// ─── Post Message ─────────────────────────────────────────────────────────────
exports.postMessage = async (req, res) => {
  try {
    const { name, message } = req.body;
    const { data, error } = await supabase
      .from('messages')
      .insert([{ name, message }])
      .select();

    if (error) throw error;
    res.status(201).json({ success: true, message: data[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Could not save message.' });
  }
};

// ─── Get All Messages ─────────────────────────────────────────────────────────
exports.getMessages = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json({ success: true, messages: data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Could not fetch messages.' });
  }
};
