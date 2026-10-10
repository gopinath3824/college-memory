const supabase = require('../supabaseClient');

// ─── Add Comment ──────────────────────────────────────────────────────────────
exports.addComment = async (req, res) => {
  try {
    const { memoryId, username, comment } = req.body;
    const { data, error } = await supabase
      .from('comments')
      .insert([{ memory_id: memoryId, username, comment }])
      .select();

    if (error) throw error;
    res.status(201).json({ success: true, comment: data[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Could not save comment.' });
  }
};

// ─── Get Comments for a Memory ────────────────────────────────────────────────
exports.getComments = async (req, res) => {
  try {
    const { memoryId } = req.params;
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('memory_id', memoryId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json({ success: true, comments: data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Could not fetch comments.' });
  }
};
