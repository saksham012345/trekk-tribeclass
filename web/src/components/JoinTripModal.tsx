import React, { useState } from 'react';
import axios from 'axios';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'traveler' | 'organizer' | 'admin';
}

interface Trip {
  _id: string;
  title: string;
  description: string;
  destination: string;
  price: number;
  capacity: number;
  participants: string[];
  categories: string[];
  startDate: string;
  endDate: string;
}

interface JoinTripModalProps {
  trip: Trip;
  user: User;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const JoinTripModal: React.FC<JoinTripModalProps> = ({ trip, user, isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    emergencyContactName: '',
    emergencyContactPhone: '',
    medicalConditions: '',
    dietaryRestrictions: '',
    experienceLevel: 'beginner' as 'beginner' | 'intermediate' | 'advanced',
    specialRequests: '',
    agreeToTerms: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!formData.agreeToTerms) {
      setError('Please agree to the terms and conditions');
      setLoading(false);
      return;
    }

    try {
      await axios.post(`/trips/${trip._id}/join`, {
        participantInfo: {
          userId: user.id,
          emergencyContactName: formData.emergencyContactName,
          emergencyContactPhone: formData.emergencyContactPhone,
          medicalConditions: formData.medicalConditions,
          dietaryRestrictions: formData.dietaryRestrictions,
          experienceLevel: formData.experienceLevel,
          specialRequests: formData.specialRequests
        }
      });
      
      onSuccess();
      onClose();
    } catch (error: any) {
      setError(error.response?.data?.error || 'Failed to join trip');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-forest-800 to-nature-600 bg-clip-text text-transparent mb-2">
                Join Adventure
              </h2>
              <p className="text-forest-600">
                <span className="font-semibold">{trip.title}</span> • {trip.destination}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 flex items-center gap-2">
              <span className="text-xl">⚠️</span>
              <span className="text-sm">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Trip Summary */}
            <div className="bg-gradient-to-r from-forest-50 to-nature-50 rounded-xl p-4 border border-forest-200">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-forest-600">📅 Duration:</span>
                  <p className="font-medium text-forest-800">
                    {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <span className="text-forest-600">💰 Price:</span>
                  <p className="font-bold text-nature-600 text-lg">₹{trip.price}</p>
                </div>
                <div>
                  <span className="text-forest-600">👥 Available Spots:</span>
                  <p className="font-medium text-forest-800">
                    {trip.capacity - trip.participants.length} of {trip.capacity}
                  </p>
                </div>
                <div>
                  <span className="text-forest-600">🎯 Categories:</span>
                  <p className="font-medium text-forest-800">
                    {trip.categories.join(', ')}
                  </p>
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-forest-800 flex items-center gap-2">
                🚨 Emergency Contact
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="emergencyContactName" className="block text-sm font-medium text-forest-700 mb-2">
                    Contact Name *
                  </label>
                  <input
                    type="text"
                    id="emergencyContactName"
                    name="emergencyContactName"
                    required
                    value={formData.emergencyContactName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border-2 border-forest-200 rounded-lg focus:ring-2 focus:ring-nature-500 focus:border-nature-500 transition-all duration-300"
                    placeholder="Full name"
                  />
                </div>
                <div>
                  <label htmlFor="emergencyContactPhone" className="block text-sm font-medium text-forest-700 mb-2">
                    Contact Phone *
                  </label>
                  <input
                    type="tel"
                    id="emergencyContactPhone"
                    name="emergencyContactPhone"
                    required
                    value={formData.emergencyContactPhone}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border-2 border-forest-200 rounded-lg focus:ring-2 focus:ring-nature-500 focus:border-nature-500 transition-all duration-300"
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>
            </div>

            {/* Health Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-forest-800 flex items-center gap-2">
                🏥 Health & Dietary Information
              </h3>
              <div>
                <label htmlFor="medicalConditions" className="block text-sm font-medium text-forest-700 mb-2">
                  Medical Conditions / Allergies
                </label>
                <textarea
                  id="medicalConditions"
                  name="medicalConditions"
                  rows={2}
                  value={formData.medicalConditions}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border-2 border-forest-200 rounded-lg focus:ring-2 focus:ring-nature-500 focus:border-nature-500 transition-all duration-300"
                  placeholder="List any medical conditions, allergies, or medications we should know about..."
                />
              </div>
              <div>
                <label htmlFor="dietaryRestrictions" className="block text-sm font-medium text-forest-700 mb-2">
                  Dietary Restrictions
                </label>
                <input
                  type="text"
                  id="dietaryRestrictions"
                  name="dietaryRestrictions"
                  value={formData.dietaryRestrictions}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border-2 border-forest-200 rounded-lg focus:ring-2 focus:ring-nature-500 focus:border-nature-500 transition-all duration-300"
                  placeholder="Vegetarian, Vegan, Gluten-free, etc."
                />
              </div>
            </div>

            {/* Experience Level */}
            <div>
              <label htmlFor="experienceLevel" className="block text-sm font-medium text-forest-700 mb-2 flex items-center gap-2">
                🎯 Adventure Experience Level *
              </label>
              <select
                id="experienceLevel"
                name="experienceLevel"
                required
                value={formData.experienceLevel}
                onChange={handleChange}
                className="w-full px-3 py-2 border-2 border-forest-200 rounded-lg focus:ring-2 focus:ring-nature-500 focus:border-nature-500 transition-all duration-300"
              >
                <option value="beginner">🌱 Beginner - First time or minimal experience</option>
                <option value="intermediate">🌿 Intermediate - Some outdoor experience</option>
                <option value="advanced">🌲 Advanced - Extensive outdoor experience</option>
              </select>
            </div>

            {/* Special Requests */}
            <div>
              <label htmlFor="specialRequests" className="block text-sm font-medium text-forest-700 mb-2">
                Special Requests or Notes
              </label>
              <textarea
                id="specialRequests"
                name="specialRequests"
                rows={2}
                value={formData.specialRequests}
                onChange={handleChange}
                className="w-full px-3 py-2 border-2 border-forest-200 rounded-lg focus:ring-2 focus:ring-nature-500 focus:border-nature-500 transition-all duration-300"
                placeholder="Any special requests, accommodation needs, or additional information..."
              />
            </div>

            {/* Terms and Conditions */}
            <div className="space-y-4">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <h4 className="font-semibold text-amber-800 mb-2">📋 Important Terms</h4>
                <ul className="text-sm text-amber-700 space-y-1">
                  <li>• Full payment of ₹{trip.price} is required upon confirmation</li>
                  <li>• Cancellation policy: 7 days notice for full refund, 3 days for 50% refund</li>
                  <li>• Travel insurance is recommended but not mandatory</li>
                  <li>• All participants must follow safety guidelines and organizer instructions</li>
                  <li>• Weather conditions may affect itinerary</li>
                </ul>
              </div>
              
              <label className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleChange}
                  className="mt-1 w-4 h-4 text-nature-600 border-2 border-forest-300 rounded focus:ring-nature-500"
                  required
                />
                <span className="text-sm text-forest-700">
                  I agree to the terms and conditions, cancellation policy, and understand the risks associated with outdoor adventures. *
                </span>
              </label>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6 border-t border-forest-200">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 border-2 border-forest-300 text-forest-700 rounded-xl font-semibold hover:bg-forest-100 transition-all duration-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !formData.agreeToTerms}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-forest-600 to-nature-600 hover:from-forest-700 hover:to-nature-700 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Joining...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    🌟 Join Adventure (₹{trip.price})
                  </span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default JoinTripModal;
