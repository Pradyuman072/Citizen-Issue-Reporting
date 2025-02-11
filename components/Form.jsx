"use client"
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';

const issueCategories = [
  'Broken Streetlight',
  'Pothole',
  'Garbage Disposal',
  'Road Maintenance',
  'Public Utility',
  'Other'
];

export default function IssueReportForm() {
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    defaultValues: {
      location: {
        type: 'auto'
      }
    }
  });

  const [isAnonymous, setIsAnonymous] = useState(false);
  const [locationError, setLocationError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [authorityInfo, setAuthorityInfo] = useState(null);
  const [submitError, setSubmitError] = useState(null);
  const locationType = watch('location.type');

  useEffect(() => {
    if (locationType === 'auto' && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setValue('location.coordinates', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
          setLocationError(null);
        },
        (error) => {
          setLocationError('Location access denied. Please enter address manually.');
          setValue('location.type', 'manual');
        },
        { timeout: 10000 }
      );
    }
  }, [locationType, setValue]);

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      setSubmitError(null);
      
      if (data.location.type === 'auto' && !data.location.coordinates) {
        setLocationError('Location data not available. Please try again or enter address manually.');
        return;
      }

      const location = data.location.type === 'auto'
        ? `${data.location.coordinates.latitude}, ${data.location.coordinates.longitude}`
        : data.location.address;
      console.log(location)
      const response = await fetch('/api/detect-authorities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          issueType: data.issueType,
          location,
          isAnonymous,
          description: data.description
    
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit report');
      }
      
      const authorityData = await response.json();
      setAuthorityInfo(authorityData);
    } catch (error) {
      console.error('Error submitting report:', error);
      setSubmitError(error.message);
      setAuthorityInfo(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      
      {submitError && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {submitError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow-md p-6 mb-4 space-y-6">
        {/* Issue Type Selection */}
        <div>
          <label className="block text-gray-700 text-sm font-semibold mb-2">
            Issue Category*
          </label>
          <select 
            {...register('issueType', { required: 'Please select an issue type' })}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select an issue type</option>
            {issueCategories.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          {errors.issueType && (
            <p className="text-red-500 text-sm mt-1">{errors.issueType.message}</p>
          )}
        </div>

        {/* Description Input */}
        <div>
          <label className="block text-gray-700 text-sm font-semibold mb-2">
            Description*
          </label>
          <textarea 
            {...register('description', { 
              required: 'Description is required',
              minLength: { value: 10, message: 'Description must be at least 10 characters' }
            })}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
            placeholder="Please describe the issue in detail..."
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
          )}
        </div>

        {/* Location Selection */}
        <div>
          <label className="block text-gray-700 text-sm font-semibold mb-2">
            Location*
          </label>
          <div className="space-y-2">
            <div className="flex items-center">
              <input 
                type="radio" 
                {...register('location.type')} 
                value="auto"
                id="auto-location"
                className="mr-2"
              />
              <label htmlFor="auto-location" className="text-sm text-gray-600">
                Use My Current Location
              </label>
            </div>
            <div className="flex items-center">
              <input 
                type="radio" 
                {...register('location.type')} 
                value="manual"
                id="manual-location"
                className="mr-2"
              />
              <label htmlFor="manual-location" className="text-sm text-gray-600">
                Enter Address Manually
              </label>
            </div>

            {locationType === 'manual' && (
              <input 
                type="text"
                {...register('location.address', { 
                  required: locationType === 'manual' ? 'Address is required' : false 
                })}
                className="w-full px-3 py-2 border rounded-md mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter full address"
              />
            )}

            {locationError && (
              <p className="text-red-500 text-sm">{locationError}</p>
            )}
          </div>
        </div>

        {/* Anonymous Reporting */}
        <div>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input 
              type="checkbox"
              checked={isAnonymous}
              onChange={() => setIsAnonymous(!isAnonymous)}
              className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            />
            <span className="text-sm text-gray-600">Report Anonymously</span>
          </label>
        </div>

        {/* Submit Button */}
        <button 
          type="submit" 
          disabled={isLoading}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : (
            'Submit Report'
          )}
        </button>
      </form>

      {/* Authority Information Display */}
      {authorityInfo && (
        <div className="bg-white rounded-lg shadow-md p-6 mt-4">
          <h3 className="text-lg font-bold mb-3 text-gray-800">Responsible Authority</h3>
          <div className="space-y-3">
            <p className="flex flex-col">
              <strong className="text-gray-700">Department:</strong>
              <span className="text-gray-600">{authorityInfo.department}</span>
            </p>
            <p className="flex flex-col">
              <strong className="text-gray-700">Contact:</strong>
              <span className="text-gray-600">{authorityInfo.contactNumber}</span>
            </p>
            {authorityInfo.email && (
              <p className="flex flex-col">
                <strong className="text-gray-700">Email:</strong>
                <span className="text-gray-600">{authorityInfo.email}</span>
              </p>
            )}
            {authorityInfo.additionalInfo && (
              <div className="mt-4 p-4 bg-gray-50 rounded-md">
                <p className="text-sm text-gray-600">{authorityInfo.additionalInfo}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}