import React, { useState } from 'react';
import api from '../utils/api';

interface TransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTransferSuccess: () => void;
}

const TransferModal: React.FC<TransferModalProps> = ({ isOpen, onClose, onTransferSuccess }) => {
  const [recipientUsername, setRecipientUsername] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await api.post('/bank/transfer', {
        recipientUsername,
        amount: parseFloat(amount),
        description: description || `Transfer to ${recipientUsername}`
      });

      if (response.status === 200) {
        // Show success animation
        showTransferSuccess();
        onTransferSuccess();
        handleClose();
      }
    } catch (error: any) {
      setError(error.response?.data || 'Transfer failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setRecipientUsername('');
    setAmount('');
    setDescription('');
    setError('');
    onClose();
  };

  const showTransferSuccess = () => {
    // Create a magical success effect
    const successDiv = document.createElement('div');
    successDiv.className = 'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-green-600 text-black font-bold py-4 px-8 rounded-lg text-xl z-50 animate-bounce';
    successDiv.innerHTML = 'Transfer Complete! <span className="ml-2">Magic! </span>';
    document.body.appendChild(successDiv);

    // Play a magical sound effect (if available)
    const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT');
    audio.play().catch(() => {}); // Ignore if audio fails to play

    // Remove the success message after 2 seconds
    setTimeout(() => {
      document.body.removeChild(successDiv);
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-40">
      <div className="bg-gray-900 border-4 border-yellow-400 rounded-lg p-8 max-w-md w-full mx-4 transform transition-all animate-glow">
        <h2 className="text-3xl font-bold text-yellow-400 mb-6 text-center">
          Send Gold Magic
        </h2>

        {error && (
          <div className="bg-red-900 border-2 border-red-400 text-red-200 p-3 rounded mb-4 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold mb-2 text-yellow-300">
              Recipient Adventurer
            </label>
            <input
              type="text"
              value={recipientUsername}
              onChange={(e) => setRecipientUsername(e.target.value)}
              className="w-full bg-black border-2 border-yellow-400 text-yellow-400 px-4 py-3 rounded focus:outline-none focus:border-yellow-300"
              placeholder="Enter recipient username"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-2 text-yellow-300">
              Gold Amount
            </label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-black border-2 border-yellow-400 text-yellow-400 px-4 py-3 rounded focus:outline-none focus:border-yellow-300"
              placeholder="Enter amount"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-2 text-yellow-300">
              Magic Message (Optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-black border-2 border-yellow-400 text-yellow-400 px-4 py-3 rounded focus:outline-none focus:border-yellow-300"
              placeholder="Add a message..."
              rows={3}
            />
          </div>

          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-yellow-600 hover:bg-yellow-500 disabled:bg-gray-600 text-black font-bold py-3 px-4 rounded text-lg transition-all transform hover:scale-105"
            >
              {isLoading ? 'Casting Spell...' : 'Send Gold'}
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 bg-red-600 hover:bg-red-500 text-white font-bold py-3 px-4 rounded text-lg transition-all transform hover:scale-105"
            >
              Cancel
            </button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <p className="text-yellow-500 text-sm">
            Send gold to fellow adventurers!
          </p>
        </div>
      </div>
    </div>
  );
};

export default TransferModal;
