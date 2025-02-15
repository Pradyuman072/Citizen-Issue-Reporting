"use client";
import React, { useState, useEffect } from 'react';
import emailjs from '@emailjs/browser';
import Notification from './N';
import { useRouter } from 'next/navigation';

const AnonymousComplaintForm = ({ isOpen, onClose, issueType, description, location }) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    aadharNumber: '',
    proofFile: null,
    reasonForAnonymity: '',
    letterContent: generateDefaultLetter(issueType, description, location)
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState(null);
  const [showModal, setShowModal] = useState(isOpen);

  useEffect(() => {
    setShowModal(isOpen);
    // Initialize EmailJS
    emailjs.init("QiR8wTvZbujAzMVpS");
  }, [isOpen]);

  function generateDefaultLetter(issueType, description, location) {
    const date = new Date().toLocaleDateString();
    return `Date: ${date}\n\nTo,\nThe Concerned Authority,\n\nSubject: Anonymous Complaint Regarding ${issueType}\n\nDear Sir/Madam,\n\nI am writing to bring to your attention a serious issue that requires immediate action. I wish to remain anonymous due to the sensitive nature of this complaint.\n\nIssue Details:\nType of Issue: ${issueType}\nLocation: ${location}\n\nDescription of the Issue:\n${description}\n\nI have verified my identity through my Aadhar card, which has been submitted along with this complaint. I request you to take necessary action while maintaining my anonymity.\n\nI trust that you will address this issue with the urgency it deserves.\n\nThank you for your attention to this matter.\n\nYours sincerely,\nAnonymous Complainant`;
  }

  const validateAadhar = (aadhar) => {
    const aadharRegex = /^\d{12}$/;
    return aadharRegex.test(aadhar);
  };

  const sendEmail = async () => {
    try {
      // Handle file size and type validation
      if (formData.proofFile) {
        const fileSize = formData.proofFile.size / 1024 / 1024; // Convert to MB
        if (fileSize > 3) { // Limit to 3MB
          throw new Error('File size must be less than 3MB');
        }
  
        // Compress image if it's an image file
        if (formData.proofFile.type.startsWith('image/')) {
          const compressedFile = await compressImage(formData.proofFile);
          const base64String = await fileToBase64(compressedFile);
          if (base64String.length > 1500000) { // Roughly 1.5MB in base64
            throw new Error('File too large even after compression');
          }
        }
      }
  
      // Create template parameters without the file
      const templateParams = {
        to_name: "Administration Team",
        from_name: "Anonymous Complainant",
        message: `
          Issue Type: ${issueType}
          Location: ${location}
          
          Reason for Anonymity:
          ${formData.reasonForAnonymity}
          
          Complaint Details:
          ${formData.letterContent}
          
          Aadhar Number: ${formData.aadharNumber}
        `
      };
  
      // If there's a file, add a compressed version
      if (formData.proofFile) {
        if (formData.proofFile.type.startsWith('image/')) {
          const compressedFile = await compressImage(formData.proofFile);
          templateParams.attachment = await fileToBase64(compressedFile);
        } else {
          // For non-image files, just mention the file was attached
          templateParams.message += `\n\nNote: Supporting documentation was provided (${formData.proofFile.name})`;
        }
      }
  
      console.log('Sending email...');
      const result = await emailjs.send(
        'service_t9z8b19',
        'template_mcxbpyn',
        templateParams,
        'QiR8wTvZbujAzMVpS'
      );
  
      return result;
    } catch (error) {
      console.error('EmailJS error:', error);
      throw error;
    }
  };
  
  // Helper function to compress images
  const compressImage = async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          
          // Calculate new dimensions
          const maxDimension = 800;
          if (width > height && width > maxDimension) {
            height *= maxDimension / width;
            width = maxDimension;
          } else if (height > maxDimension) {
            width *= maxDimension / height;
            height = maxDimension;
          }
  
          canvas.width = width;
          canvas.height = height;
          
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          
          // Convert to blob
          canvas.toBlob(
            (blob) => {
              resolve(new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now(),
              }));
            },
            'image/jpeg',
            0.7 // compression quality
          );
        };
        img.src = event.target.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };
  
  // Helper function to convert file to base64
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };
  
  // Update the form validation to include file size check
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.aadharNumber) {
      newErrors.aadharNumber = 'Aadhar number is required';
    } else if (!validateAadhar(formData.aadharNumber)) {
      newErrors.aadharNumber = 'Please enter a valid 12-digit Aadhar number';
    }
    
    if (!formData.proofFile) {
      newErrors.proofFile = 'Supporting documentation is required';
    } else if (formData.proofFile.size / 1024 / 1024 > 3) {
      newErrors.proofFile = 'File size must be less than 3MB';
    }
    
    if (!formData.reasonForAnonymity || formData.reasonForAnonymity.length < 50) {
      newErrors.reasonForAnonymity = 'Please provide a detailed reason for anonymity (minimum 50 characters)';
    }
    
    if (!formData.letterContent || formData.letterContent.length < 100) {
      newErrors.letterContent = 'Letter content is too short';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Update the handleSubmit function
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted");
    
    if (!validateForm()) {
      setNotification({
        message: 'Please fill in all required fields correctly',
        type: 'error'
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      console.log("Sending email...");
      const result = await sendEmail();
      console.log("Email result:", result);
      
      setNotification({
        message: 'Complaint submitted successfully! Redirecting...',
        type: 'success'
      });
      
      // Wait for 2 seconds before redirecting
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setShowModal(false);
      onClose();
      router.push('/');
      
    } catch (error) {
      console.error('Error submitting complaint:', error);
      setNotification({
        message: 'Failed to submit complaint. Please try again.',
        type: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {notification && <Notification message={notification.message} type={notification.type} />}
      
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Anonymous Complaint Submission</h2>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <div className="flex items-center">
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                Your identity will be verified but kept confidential. Only authorized officials will have access to your details.
              </p>
            </div>
          </div>
        </div>

        {/* Aadhar Number Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Aadhar Number* <span className="text-red-500">Required</span>
          </label>
          <input
            type="text"
            value={formData.aadharNumber}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, ''); // Only allow digits
              setFormData({ ...formData, aadharNumber: value });
            }}
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.aadharNumber ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter 12-digit Aadhar number"
            maxLength={12}
            required
          />
          {errors.aadharNumber && (
            <p className="text-red-500 text-sm mt-1">{errors.aadharNumber}</p>
          )}
        </div>

        {/* Supporting Documentation */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Supporting Documentation* <span className="text-red-500">Required</span>
          </label>
          <input
            type="file"
            onChange={(e) => setFormData({ ...formData, proofFile: e.target.files[0] })}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            accept=".pdf,.jpg,.jpeg,.png"
            required
          />
          <p className="text-sm text-gray-500 mt-1">
            Upload relevant proof (photos, documents, etc.) - Max size: 5MB
          </p>
          {errors.proofFile && (
            <p className="text-red-500 text-sm mt-1">{errors.proofFile}</p>
          )}
        </div>

        {/* Reason for Anonymity */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Reason for Anonymity* <span className="text-red-500">Required</span>
          </label>
          <textarea
            value={formData.reasonForAnonymity}
            onChange={(e) => setFormData({ ...formData, reasonForAnonymity: e.target.value })}
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.reasonForAnonymity ? 'border-red-500' : 'border-gray-300'
            }`}
            rows={3}
            placeholder="Please explain why you wish to remain anonymous..."
            required
          />
          {errors.reasonForAnonymity && (
            <p className="text-red-500 text-sm mt-1">{errors.reasonForAnonymity}</p>
          )}
        </div>

        {/* Complaint Letter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Complaint Letter* <span className="text-red-500">Required</span>
          </label>
          <textarea
            value={formData.letterContent}
            onChange={(e) => setFormData({ ...formData, letterContent: e.target.value })}
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.letterContent ? 'border-red-500' : 'border-gray-300'
            }`}
            rows={12}
            required
          />
          {errors.letterContent && (
            <p className="text-red-500 text-sm mt-1">{errors.letterContent}</p>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => {
              setShowModal(false);
              onClose();
            }}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Anonymous Complaint'}
          </button>
        </div>
      </form>
    </>
  );
};

export default AnonymousComplaintForm;