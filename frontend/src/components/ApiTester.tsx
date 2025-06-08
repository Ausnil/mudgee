import { useState, useEffect } from 'react';
import axios from 'axios';

interface Message {
  id: number;
  text: string;
  timestamp: string;
}

interface ApiResponse {
  success: boolean;
  messages?: Message[];
  serverInfo?: {
    name: string;
    version: string;
    time: string;
  };
  error?: string;
}

export default function ApiTester() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch messages on component mount
  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get<ApiResponse>('/api/hello');
      if (response.data.success && response.data.messages) {
        setMessages(response.data.messages);
      }
    } catch (err) {
      setError('Failed to fetch messages');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) {
      setError('Please enter a message');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await axios.post<ApiResponse>('/api/hello', {
        message: newMessage.trim(),
      });

      if (response.data.success) {
        setNewMessage('');
        fetchMessages(); // Refresh the messages
      }
    } catch (err) {
      setError('Failed to send message');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1>Backend-Frontend Communication</h1>
      
      <div style={{ margin: '20px 0' }}>
        <h2>Send a Message to Backend</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            style={{ flex: 1, padding: '10px' }}
          />
          <button 
            onClick={sendMessage}
            disabled={loading}
            style={{ padding: '10px 20px', background: '#0070f3', color: 'white', border: 'none' }}
          >
            {loading ? 'Sending...' : 'Send'}
          </button>
        </div>
      </div>

      <div style={{ margin: '20px 0' }}>
        <h2>Messages from Backend</h2>
        <button 
          onClick={fetchMessages}
          disabled={loading}
          style={{ marginBottom: '10px', padding: '8px 16px' }}
        >
          {loading ? 'Refreshing...' : 'Refresh Messages'}
        </button>

        {error && <div style={{ color: 'red', margin: '10px 0' }}>{error}</div>}

        {messages.length === 0 ? (
          <p>No messages yet</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {messages.map((msg) => (
              <li key={msg.id} style={{ 
                padding: '15px', 
                margin: '10px 0', 
                background: '#f5f5f5',
                borderRadius: '5px'
              }}>
                <div style={{ fontWeight: 'bold' }}>{msg.text}</div>
                <div style={{ fontSize: '0.8em', color: '#666' }}>
                  {new Date(msg.timestamp).toLocaleString()}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}