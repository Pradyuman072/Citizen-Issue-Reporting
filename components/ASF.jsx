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
  }, [isOpen]);

  function generateDefaultLetter(issueType, description, location) {
    const date = new Date().toLocaleDateString();
    return `Date: ${date}

To,
The Concerned Authority,

Subject: Anonymous Complaint Regarding ${issueType}

Dear Sir/Madam,

I am writing to bring to your attention a serious issue that requires immediate action. I wish to remain anonymous due to the sensitive nature of this complaint.

Issue Details:
Type of Issue: ${issueType}
Location: ${location}

Description of the Issue:
${description}

I have verified my identity through my Aadhar card, which has been submitted along with this complaint. I request you to take necessary action while maintaining my anonymity.

I trust that you will address this issue with the urgency it deserves.

Thank you for your attention to this matter.

Yours sincerely,
Anonymous Complainant`;
  }

  const validateAadhar = (aadhar) => {
    const aadharRegex = /^\d{12}$/;
    return aadharRegex.test(aadhar);
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.aadharNumber) {
      newErrors.aadharNumber = 'Aadhar number is required';
    } else if (!validateAadhar(formData.aadharNumber)) {
      newErrors.aadharNumber = 'Please enter a valid 12-digit Aadhar number';
    }
    
    if (!formData.proofFile) {
      newErrors.proofFile = 'Supporting documentation is required';
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

  const sendEmail = async () => {
    const serviceId = 'YOUR_SERVICE_ID';
    const templateId = 'YOUR_TEMPLATE_ID';
    const publicKey = 'YOUR_PUBLIC_KEY';

    const templateParams = {
      issue_type: issueType,
      location: location,
      reason_for_anonymity: formData.reasonForAnonymity,
      letter_content: formData.letterContent,
      aadhar_number: formData.aadharNumber
    };

    return await emailjs.send(
      serviceId,
      templateId,
      templateParams,
      publicKey
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setNotification({
        message: 'Please fill in all required fields correctly',
        type: 'error'
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await sendEmail();
      
      // Show success notification
      setNotification({
        message: 'Complaint submitted successfully! Redirecting...',
        type: 'success'
      });
      
      // Wait for notification to be visible
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Close modal
      setShowModal(false);
      onClose();
      
      // Redirect after modal is closed
      setTimeout(() => {
        router.push('/');
      }, 500);
      
    } catch (error) {
      console.error('Error submitting complaint:', error);
      setNotification({
        message: 'Failed to submit complaint. Please try again.',
        type: 'error'
      });
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
        </div>
      </form>
   
    </>
  );
};
export default AnonymousComplaintForm;