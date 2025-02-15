"use client"
import React, { useState, useEffect, useRef } from 'react';
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

  const [locationError, setLocationError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [authorityInfo, setAuthorityInfo] = useState(null);
  const [submitError, setSubmitError] = useState(null);
  const locationType = watch('location.type');
  const authorityRef = useRef(null);

  

  useEffect(() => {
    if (authorityInfo && authorityRef.current) {
      authorityRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  }, [authorityInfo]);

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

      const response = await fetch('/api/detect-authorities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          issueType: data.issueType,
          location,
         
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
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Report an Issue</h2>
          <p className="text-gray-600">Help us improve your community by reporting issues in your area</p>
        </div>
        
        {submitError && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 text-red-700 rounded-r-lg">
            <p className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
              </svg>
              {submitError}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl shadow-lg p-8 space-y-6 transition-all duration-300 hover:shadow-xl">
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Issue Category<span className="text-red-500">*</span>
            </label>
            <select 
              {...register('issueType', { required: 'Please select an issue type' })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              <option value="">Select an issue type</option>
              {issueCategories.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            {errors.issueType && (
              <p className="mt-1 text-sm text-red-600">{errors.issueType.message}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Description<span className="text-red-500">*</span>
            </label>
            <textarea 
              {...register('description', { 
                required: 'Description is required',
                minLength: { value: 10, message: 'Description must be at least 10 characters' }
              })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              rows={4}
              placeholder="Please describe the issue in detail..."
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>

          <div className="space-y-4">
            <label className="block text-gray-700 font-medium mb-2">
              Location<span className="text-red-500">*</span>
            </label>
            <div className="space-y-3">
              <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <input 
                  type="radio" 
                  {...register('location.type')} 
                  value="auto"
                  id="auto-location"
                  className="w-4 h-4 text-blue-600"
                />
                <label htmlFor="auto-location" className="text-gray-700">
                  Use My Current Location
                </label>
              </div>
              <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <input 
                  type="radio" 
                  {...register('location.type')} 
                  value="manual"
                  id="manual-location"
                  className="w-4 h-4 text-blue-600"
                />
                <label htmlFor="manual-location" className="text-gray-700">
                  Enter Address Manually
                </label>
              </div>

              {locationType === 'manual' && (
                <input 
                  type="text"
                  {...register('location.address', { 
                    required: locationType === 'manual' ? 'Address is required' : false 
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Enter full address"
                />
              )}

              {locationError && (
                <p className="text-sm text-red-600">{locationError}</p>
              )}
            </div>
          </div>

          
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
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

        {authorityInfo && (
          <div ref={authorityRef} className="mt-8 bg-white rounded-xl shadow-lg p-8 transform transition-all duration-500 hover:shadow-xl">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Responsible Authority</h3>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-500 mb-1">Department</p>
                <p className="text-lg text-gray-900">{authorityInfo.department}</p>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-500 mb-1">Contact</p>
                <p className="text-lg text-gray-900">{authorityInfo.contactNumber}</p>
              </div>
              
              {authorityInfo.email && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-500 mb-1">Email</p>
                  <p className="text-lg text-gray-900">{authorityInfo.email}</p>
                </div>
              )}
              
              {authorityInfo.additionalInfo && (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                  <p className="text-sm text-blue-900">{authorityInfo.additionalInfo}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}