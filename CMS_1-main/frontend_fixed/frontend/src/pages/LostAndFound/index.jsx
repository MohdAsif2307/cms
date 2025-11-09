import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { CMS_BASE_URL } from '../../baseUrl';
import toast from 'react-hot-toast';

const LostAndFound = () => {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({
    title: '',
    description: '',
    type: 'lost', // 'lost' or 'found'
    location: '',
    date: '',
    contactInfo: ''
  });
  const reduxUser = useSelector((state) => state.auth?.user);

  // Load lost and found items
  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const token = localStorage.getItem('userToken');
      const response = await fetch(`${CMS_BASE_URL}/lost-and-found`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setItems(data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch items:', error);
      toast.error('Failed to load lost and found items');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('userToken');
      const response = await fetch(`${CMS_BASE_URL}/lost-and-found`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...newItem,
          postedBy: reduxUser?._id
        })
      });

      if (response.ok) {
        toast.success('Item posted successfully');
        setNewItem({
          title: '',
          description: '',
          type: 'lost',
          location: '',
          date: '',
          contactInfo: ''
        });
        fetchItems(); // Refresh the list
      } else {
        toast.error('Failed to post item');
      }
    } catch (error) {
      console.error('Failed to post item:', error);
      toast.error('Failed to post item');
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Lost and Found</h1>
      
      {/* Post new item form */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Post New Item</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Title</label>
              <input
                type="text"
                value={newItem.title}
                onChange={(e) => setNewItem({...newItem, title: e.target.value})}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>
            <div className="w-32">
              <label className="block text-sm font-medium mb-1">Type</label>
              <select
                value={newItem.type}
                onChange={(e) => setNewItem({...newItem, type: e.target.value})}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="lost">Lost</option>
                <option value="found">Found</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              value={newItem.description}
              onChange={(e) => setNewItem({...newItem, description: e.target.value})}
              className="w-full px-3 py-2 border rounded-md"
              rows="3"
              required
            />
          </div>
          
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Location</label>
              <input
                type="text"
                value={newItem.location}
                onChange={(e) => setNewItem({...newItem, location: e.target.value})}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Date</label>
              <input
                type="date"
                value={newItem.date}
                onChange={(e) => setNewItem({...newItem, date: e.target.value})}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Contact Information</label>
            <input
              type="text"
              value={newItem.contactInfo}
              onChange={(e) => setNewItem({...newItem, contactInfo: e.target.value})}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Phone number or email"
              required
            />
          </div>
          
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Post Item
          </button>
        </form>
      </div>
      
      {/* List of items */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {items.map((item) => (
          <div key={item._id} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <span className={`px-3 py-1 rounded-full text-sm ${
                item.type === 'lost' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
              }`}>
                {item.type === 'lost' ? 'Lost' : 'Found'}
              </span>
            </div>
            <p className="mt-2 text-gray-600">{item.description}</p>
            <div className="mt-4 text-sm text-gray-500">
              <p><strong>Location:</strong> {item.location}</p>
              <p><strong>Date:</strong> {new Date(item.date).toLocaleDateString()}</p>
              <p><strong>Contact:</strong> {item.contactInfo}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LostAndFound;