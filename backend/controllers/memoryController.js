const supabase = require('../supabaseClient');

const mapMemory = (item) => ({
  ...item,
  _id: item.id,
  photoUrl: item.photo_url || item.photoUrl,
  publicId: item.public_id || item.publicId,
  likesCount: item.likes_count || item.likesCount || 0,
  createdAt: item.created_at || item.createdAt
});

// ─── Upload Memory ────────────────────────────────────────────────────────────
exports.uploadMemory = async (req, res) => {
  try {
    const { name, title, story } = req.body;

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Photo is required.' });
    }

    const photoUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

    const { data, error } = await supabase
      .from('memories')
      .insert([{ 
        name, 
        title, 
        story, 
        photo_url: photoUrl, 
        public_id: req.file.filename,
        likes_count: 0
      }])
      .select();

    if (error) throw error;
    res.status(201).json({ success: true, memory: mapMemory(data[0]) });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ success: false, message: 'Upload failed.', error: err.message });
  }
};

// ─── Get All Memories ─────────────────────────────────────────────────────────
exports.getMemories = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('memories')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json({ success: true, memories: data.map(mapMemory) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Could not fetch memories.' });
  }
};

// ─── Like Memory ──────────────────────────────────────────────────────────────
exports.likeMemory = async (req, res) => {
  try {
    const { memoryId } = req.body;
    
    const { data: mems, error: fetchErr } = await supabase
      .from('memories')
      .select('likes_count')
      .eq('id', memoryId)
      .single();
      
    if (fetchErr) throw fetchErr;

    const newLikes = (mems.likes_count || 0) + 1;
    
    const { data, error } = await supabase
      .from('memories')
      .update({ likes_count: newLikes })
      .eq('id', memoryId)
      .select();

    if (error) throw error;
    res.json({ success: true, likesCount: data[0].likes_count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Like failed.' });
  }
};
