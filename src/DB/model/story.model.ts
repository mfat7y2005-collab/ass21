import mongoose from 'mongoose';

const storySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    createdAt: { 
        type: Date, 
        default: Date.now, 
        expires: 86400 
    }
});

export const Story = mongoose.model('Story', storySchema);